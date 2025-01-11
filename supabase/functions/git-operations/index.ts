import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { Octokit } from 'https://esm.sh/octokit'
import * as git from 'https://esm.sh/isomorphic-git'
import http from 'https://esm.sh/isomorphic-git/http/web'
import * as fs from 'https://deno.land/std@0.177.0/fs/mod.ts'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

const log = {
  success: (message: string, data?: any) => {
    console.log('\x1b[32m%s\x1b[0m', '✓ SUCCESS:', message);
    if (data) console.log(JSON.stringify(data, null, 2));
    return { type: 'success', message, data, timestamp: new Date().toISOString() };
  },
  error: (message: string, error?: any) => {
    console.error('\x1b[31m%s\x1b[0m', '✗ ERROR:', message);
    if (error) {
      console.error('\x1b[31m%s\x1b[0m', '  Details:');
      if (error.status) console.error('\x1b[31m%s\x1b[0m', `  Status: ${error.status}`);
      if (error.message) console.error('\x1b[31m%s\x1b[0m', `  Message: ${error.message}`);
      if (error.response?.data) {
        console.error('\x1b[31m%s\x1b[0m', '  Response Data:');
        console.error(JSON.stringify(error.response.data, null, 2));
      }
    }
    return { type: 'error', message, error, timestamp: new Date().toISOString() };
  },
  info: (message: string, data?: any) => {
    console.log('\x1b[36m%s\x1b[0m', 'ℹ INFO:', message);
    if (data) console.log(JSON.stringify(data, null, 2));
    return { type: 'info', message, data, timestamp: new Date().toISOString() };
  }
};

const normalizeGitHubUrl = (url: string): string => {
  try {
    let normalizedUrl = url.trim().replace(/\.git$/, '').replace(/\/$/, '');
    normalizedUrl = normalizedUrl.replace(/:\d+/, '');
    if (!normalizedUrl.startsWith('http')) {
      normalizedUrl = `https://${normalizedUrl}`;
    }
    return normalizedUrl;
  } catch (error) {
    console.error('Error normalizing GitHub URL:', error);
    throw error;
  }
};

async function cloneRepository(url: string, dir: string, auth: { token: string }) {
  try {
    await git.clone({
      fs,
      http,
      dir,
      url,
      ref: 'main',
      singleBranch: true,
      depth: 1,
      onAuth: () => ({ username: auth.token })
    });
    return { success: true };
  } catch (error) {
    console.error('Clone error:', error);
    return { success: false, error };
  }
}

async function pushToRepository(sourceDir: string, targetUrl: string, auth: { token: string }, options: { force?: boolean }) {
  try {
    const pushResult = await git.push({
      fs,
      http,
      dir: sourceDir,
      url: targetUrl,
      force: options.force,
      onAuth: () => ({ username: auth.token })
    });
    return { success: true, result: pushResult };
  } catch (error) {
    console.error('Push error:', error);
    return { success: false, error };
  }
}

async function verifyPushSuccess(sourceCommit: string, targetUrl: string, auth: { token: string }) {
  try {
    const { owner, repo } = parseGitHubUrl(targetUrl);
    const octokit = new Octokit({ auth: auth.token });
    
    const { data: latestCommit } = await octokit.rest.repos.getCommit({
      owner,
      repo,
      ref: 'HEAD'
    });

    return {
      success: latestCommit.sha === sourceCommit,
      targetCommit: latestCommit.sha
    };
  } catch (error) {
    console.error('Verification error:', error);
    return { success: false, error };
  }
}

const parseGitHubUrl = (url: string) => {
  try {
    const regex = /github\.com\/([^\/]+)\/([^\/\.]+)/;
    const match = url.match(regex);
    
    if (!match) {
      throw new Error(`Invalid GitHub URL: ${url}`);
    }

    return {
      owner: match[1],
      repo: match[2].replace('.git', '')
    };
  } catch (error) {
    log.error('Error parsing GitHub URL:', error);
    throw error;
  }
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  const logs = [];
  const workDir = await Deno.makeTempDir();
  
  try {
    const { type, sourceRepoId, targetRepoId, pushType } = await req.json();
    logs.push(log.info('Received operation request', { type, sourceRepoId, targetRepoId, pushType }));

    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const githubToken = Deno.env.get('GITHUB_ACCESS_TOKEN');
    if (!githubToken) {
      logs.push(log.error('GitHub token not found'));
      throw new Error('GitHub token not configured');
    }

    if (type === 'push') {
      logs.push(log.info('Starting Git push operation', { sourceRepoId, targetRepoId, pushType }));
      
      const { data: sourceRepo } = await supabaseClient
        .from('repositories')
        .select('*')
        .eq('id', sourceRepoId)
        .single();
      
      const { data: targetRepo } = await supabaseClient
        .from('repositories')
        .select('*')
        .eq('id', targetRepoId)
        .single();

      if (!sourceRepo || !targetRepo) {
        logs.push(log.error('Repository not found', { sourceRepoId, targetRepoId }));
        throw new Error('Repository not found');
      }

      const normalizedSourceUrl = normalizeGitHubUrl(sourceRepo.url);
      const normalizedTargetUrl = normalizeGitHubUrl(targetRepo.url);
      const sourceDir = `${workDir}/source`;

      logs.push(log.info('Cloning source repository', { url: normalizedSourceUrl }));
      const cloneResult = await cloneRepository(normalizedSourceUrl, sourceDir, { token: githubToken });
      
      if (!cloneResult.success) {
        logs.push(log.error('Failed to clone source repository', cloneResult.error));
        throw new Error('Failed to clone source repository');
      }

      logs.push(log.info('Pushing to target repository', { url: normalizedTargetUrl }));
      const pushResult = await pushToRepository(sourceDir, normalizedTargetUrl, { token: githubToken }, {
        force: pushType === 'force' || pushType === 'force-with-lease'
      });

      if (!pushResult.success) {
        logs.push(log.error('Failed to push to target repository', pushResult.error));
        throw new Error('Failed to push to target repository');
      }

      logs.push(log.info('Verifying push success'));
      const verificationResult = await verifyPushSuccess(sourceRepo.last_commit, normalizedTargetUrl, { token: githubToken });

      if (!verificationResult.success) {
        logs.push(log.error('Push verification failed', verificationResult.error));
        throw new Error('Push verification failed');
      }

      await supabaseClient
        .from('repositories')
        .update({
          last_commit: verificationResult.targetCommit,
          last_sync: new Date().toISOString(),
          status: 'synced'
        })
        .eq('id', targetRepoId);

      logs.push(log.success('Push operation completed successfully'));
    }

    return new Response(
      JSON.stringify({ 
        success: true,
        logs,
        timestamp: new Date().toISOString()
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    logs.push(log.error('Operation failed', error));
    
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message || 'Unknown error occurred',
        logs,
        details: {
          name: error.name,
          message: error.message,
          stack: error.stack
        }
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500
      }
    );
  } finally {
    try {
      await Deno.remove(workDir, { recursive: true });
    } catch (error) {
      console.error('Failed to clean up temporary directory:', error);
    }
  }
});
