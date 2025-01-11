// @ts-ignore: Deno deploy
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { Octokit } from 'https://esm.sh/octokit'
import * as git from 'https://esm.sh/isomorphic-git@1.24.5'
import http from 'https://esm.sh/isomorphic-git@1.24.5/http/web'
import { join } from "https://deno.land/std@0.168.0/path/mod.ts";

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

// Create a proper fs implementation for isomorphic-git
const fs = {
  promises: {
    readFile: async (filepath: string) => {
      try {
        return await Deno.readFile(filepath);
      } catch (error) {
        log.error(`Error reading file ${filepath}:`, error);
        throw error;
      }
    },
    writeFile: async (filepath: string, data: Uint8Array) => {
      try {
        await Deno.writeFile(filepath, data);
      } catch (error) {
        log.error(`Error writing file ${filepath}:`, error);
        throw error;
      }
    },
    unlink: async (filepath: string) => {
      try {
        await Deno.remove(filepath);
      } catch (error) {
        log.error(`Error removing file ${filepath}:`, error);
        throw error;
      }
    },
    readdir: async (filepath: string) => {
      try {
        const entries = [];
        for await (const entry of Deno.readDir(filepath)) {
          entries.push(entry.name);
        }
        return entries;
      } catch (error) {
        log.error(`Error reading directory ${filepath}:`, error);
        throw error;
      }
    },
    mkdir: async (filepath: string, options = { recursive: true }) => {
      try {
        await Deno.mkdir(filepath, options);
      } catch (error) {
        log.error(`Error creating directory ${filepath}:`, error);
        throw error;
      }
    },
    rmdir: async (filepath: string, options = { recursive: true }) => {
      try {
        await Deno.remove(filepath, options);
      } catch (error) {
        log.error(`Error removing directory ${filepath}:`, error);
        throw error;
      }
    },
    stat: async (filepath: string) => {
      try {
        const stat = await Deno.stat(filepath);
        return {
          ...stat,
          isFile: () => stat.isFile,
          isDirectory: () => stat.isDirectory,
          isSymlink: () => stat.isSymlink,
        };
      } catch (error) {
        log.error(`Error getting stat for ${filepath}:`, error);
        throw error;
      }
    },
    lstat: async (filepath: string) => {
      try {
        const stat = await Deno.lstat(filepath);
        return {
          ...stat,
          isFile: () => stat.isFile,
          isDirectory: () => stat.isDirectory,
          isSymlink: () => stat.isSymlink,
        };
      } catch (error) {
        log.error(`Error getting lstat for ${filepath}:`, error);
        throw error;
      }
    },
  },
  readFileSync: (filepath: string) => {
    try {
      return Deno.readFileSync(filepath);
    } catch (error) {
      log.error(`Error reading file sync ${filepath}:`, error);
      throw error;
    }
  },
  writeFileSync: (filepath: string, data: Uint8Array) => {
    try {
      Deno.writeFileSync(filepath, data);
    } catch (error) {
      log.error(`Error writing file sync ${filepath}:`, error);
      throw error;
    }
  },
  existsSync: (filepath: string) => {
    try {
      Deno.statSync(filepath);
      return true;
    } catch {
      return false;
    }
  },
  readdirSync: (filepath: string) => {
    try {
      return Array.from(Deno.readDirSync(filepath)).map(entry => entry.name);
    } catch (error) {
      log.error(`Error reading directory sync ${filepath}:`, error);
      throw error;
    }
  },
  mkdirSync: (filepath: string, options = { recursive: true }) => {
    try {
      Deno.mkdirSync(filepath, options);
    } catch (error) {
      log.error(`Error creating directory sync ${filepath}:`, error);
      throw error;
    }
  },
  rmdirSync: (filepath: string, options = { recursive: true }) => {
    try {
      Deno.removeSync(filepath, options);
    } catch (error) {
      log.error(`Error removing directory sync ${filepath}:`, error);
      throw error;
    }
  },
  unlinkSync: (filepath: string) => {
    try {
      Deno.removeSync(filepath);
    } catch (error) {
      log.error(`Error removing file sync ${filepath}:`, error);
      throw error;
    }
  },
  statSync: (filepath: string) => {
    try {
      const stat = Deno.statSync(filepath);
      return {
        ...stat,
        isFile: () => stat.isFile,
        isDirectory: () => stat.isDirectory,
        isSymlink: () => stat.isSymlink,
        mode: stat.mode || 0o666,
        size: stat.size || 0,
        mtimeMs: stat.mtime?.getTime() || 0,
      };
    } catch (error) {
      log.error(`Error getting stat sync for ${filepath}:`, error);
      throw error;
    }
  },
  lstatSync: (filepath: string) => {
    try {
      const stat = Deno.lstatSync(filepath);
      return {
        ...stat,
        isFile: () => stat.isFile,
        isDirectory: () => stat.isDirectory,
        isSymlink: () => stat.isSymlink,
        mode: stat.mode || 0o666,
        size: stat.size || 0,
        mtimeMs: stat.mtime?.getTime() || 0,
      };
    } catch (error) {
      log.error(`Error getting lstat sync for ${filepath}:`, error);
      throw error;
    }
  },
};

const normalizeGitHubUrl = (url: string): string => {
  try {
    let normalizedUrl = url.trim().replace(/\.git$/, '').replace(/\/$/, '');
    normalizedUrl = normalizedUrl.replace(/:\d+/, '');
    if (!normalizedUrl.startsWith('http')) {
      normalizedUrl = `https://${normalizedUrl}`;
    }
    return normalizedUrl + '.git';
  } catch (error) {
    log.error('Error normalizing GitHub URL:', error);
    throw error;
  }
};

async function createTempDir(): Promise<string> {
  try {
    const tempDir = await Deno.makeTempDir();
    log.info(`Created temporary directory: ${tempDir}`);
    return tempDir;
  } catch (error) {
    log.error('Failed to create temporary directory:', error);
    throw error;
  }
}

async function cloneRepository(url: string, dir: string, auth: { token: string }) {
  try {
    log.info(`Starting clone operation for ${url} into ${dir}`);
    
    await fs.promises.mkdir(dir, { recursive: true });
    
    const cloneOptions = {
      fs,
      http,
      dir,
      url,
      depth: 1,
      onAuth: () => ({ username: auth.token }),
      onProgress: (progress: any) => {
        log.info('Clone progress', progress);
      },
      headers: {
        'Authorization': `token ${auth.token}`
      }
    };

    await git.clone(cloneOptions);
    
    log.success('Clone operation completed successfully');
    return { success: true };
  } catch (error) {
    log.error('Clone operation failed', error);
    throw error;
  }
}

async function pushToRepository(sourceDir: string, targetUrl: string, auth: { token: string }, options: { force?: boolean }) {
  try {
    log.info(`Starting push operation to ${targetUrl}`);
    
    const pushOptions = {
      fs,
      http,
      dir: sourceDir,
      url: targetUrl,
      force: options.force,
      onAuth: () => ({ username: auth.token }),
      onProgress: (progress: any) => {
        log.info('Push progress', progress);
      },
      remote: 'origin'
    };

    const pushResult = await git.push(pushOptions);
    
    log.success('Push operation completed successfully', pushResult);
    return { success: true, result: pushResult };
  } catch (error) {
    log.error('Push operation failed', error);
    return { success: false, error };
  }
}

async function verifyPushSuccess(sourceCommit: string, targetUrl: string, auth: { token: string }) {
  try {
    const { owner, repo } = parseGitHubUrl(targetUrl);
    const octokit = new Octokit({ auth: auth.token });
    
    log.info(`Verifying push success for ${owner}/${repo}`);
    
    // Get the latest commit from the target repository
    const { data: latestCommit } = await octokit.rest.repos.getCommit({
      owner,
      repo,
      ref: 'HEAD'
    });

    const success = latestCommit.sha === sourceCommit;
    log.info('Push verification result', { 
      success, 
      sourceCommit, 
      targetCommit: latestCommit.sha,
      commitDate: latestCommit.commit.author?.date
    });
    
    return {
      success,
      targetCommit: latestCommit.sha,
      commitDate: latestCommit.commit.author?.date
    };
  } catch (error) {
    log.error('Verification failed', error);
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
  let workDir: string | null = null;
  
  try {
    workDir = await createTempDir();
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
      const sourceDir = join(workDir, 'source');

      logs.push(log.info('Cloning source repository', { url: normalizedSourceUrl }));
      await cloneRepository(normalizedSourceUrl, sourceDir, { token: githubToken });

      logs.push(log.info('Pushing to target repository', { url: normalizedTargetUrl }));
      const pushResult = await pushToRepository(sourceDir, normalizedTargetUrl, { token: githubToken }, {
        force: pushType === 'force' || pushType === 'force-with-lease'
      });

      if (!pushResult.success) {
        throw new Error('Failed to push to target repository');
      }

      logs.push(log.info('Verifying push success'));
      const verificationResult = await verifyPushSuccess(sourceRepo.last_commit, normalizedTargetUrl, { token: githubToken });

      if (!verificationResult.success) {
        throw new Error('Push verification failed');
      }

      await supabaseClient
        .from('repositories')
        .update({
          last_commit: verificationResult.targetCommit,
          last_commit_date: verificationResult.commitDate,
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
    if (workDir) {
      try {
        await Deno.remove(workDir, { recursive: true });
      } catch (error) {
        console.error('Failed to clean up temporary directory:', error);
      }
    }
  }
});