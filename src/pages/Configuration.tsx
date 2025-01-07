import React from 'react';
import { LLMConfiguration } from '@/components/configuration/LLMConfiguration';
import { FileSystemConfig } from '@/components/configuration/FileSystemConfig';
import { TerminalConfig } from '@/components/configuration/TerminalConfig';
import { VersionControlConfig } from '@/components/configuration/VersionControlConfig';
import { DatabaseConfig } from '@/components/configuration/DatabaseConfig';
import { SecurityConfig } from '@/components/configuration/SecurityConfig';
import { DeploymentConfig } from '@/components/configuration/DeploymentConfig';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';

const Configuration = () => {
  return (
    <div className="container mx-auto p-6 space-y-8">
      <div className="space-y-2">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-[#9b87f5] via-[#7E69AB] to-[#6E59A5] bg-clip-text text-transparent">
          Configuration
        </h1>
        <p className="text-muted-foreground">
          Manage your application settings and preferences
        </p>
      </div>

      <ScrollArea className="h-[calc(100vh-12rem)]">
        <div className="grid gap-8">
          {/* Security Configuration Section */}
          <section className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="h-8 w-1 bg-gradient-to-b from-[#8B5CF6] to-[#6E59A5] rounded-full" />
              <h2 className="text-2xl font-semibold">Security Settings</h2>
            </div>
            <div className="pl-4">
              <SecurityConfig />
            </div>
          </section>

          <Separator className="my-4 bg-gradient-to-r from-transparent via-[#7E69AB]/20 to-transparent" />

          {/* Deployment Section */}
          <section className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="h-8 w-1 bg-gradient-to-b from-[#33C3F0] to-[#1EAEDB] rounded-full" />
              <h2 className="text-2xl font-semibold">Deployment</h2>
            </div>
            <div className="pl-4">
              <DeploymentConfig />
            </div>
          </section>

          <Separator className="my-4 bg-gradient-to-r from-transparent via-[#7E69AB]/20 to-transparent" />

          {/* LLM Configuration Section */}
          <section className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="h-8 w-1 bg-gradient-to-b from-[#9b87f5] to-[#6E59A5] rounded-full" />
              <h2 className="text-2xl font-semibold">LLM Providers</h2>
            </div>
            <div className="pl-4">
              <LLMConfiguration />
            </div>
          </section>

          <Separator className="my-4 bg-gradient-to-r from-transparent via-[#7E69AB]/20 to-transparent" />

          {/* Database Section */}
          <section className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="h-8 w-1 bg-gradient-to-b from-[#D6BCFA] to-[#9b87f5] rounded-full" />
              <h2 className="text-2xl font-semibold">Database</h2>
            </div>
            <div className="pl-4 grid grid-cols-1 gap-6">
              <DatabaseConfig />
            </div>
          </section>

          <Separator className="my-4 bg-gradient-to-r from-transparent via-[#7E69AB]/20 to-transparent" />

          {/* File System & Terminal Section */}
          <section className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="h-8 w-1 bg-gradient-to-b from-[#E5DEFF] to-[#D6BCFA] rounded-full" />
              <h2 className="text-2xl font-semibold">Development Environment</h2>
            </div>
            <div className="pl-4 grid grid-cols-1 md:grid-cols-2 gap-6">
              <FileSystemConfig />
              <TerminalConfig />
            </div>
          </section>

          <Separator className="my-4 bg-gradient-to-r from-transparent via-[#7E69AB]/20 to-transparent" />

          {/* Version Control Section */}
          <section className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="h-8 w-1 bg-gradient-to-b from-[#33C3F0] to-[#1EAEDB] rounded-full" />
              <h2 className="text-2xl font-semibold">Version Control</h2>
            </div>
            <div className="pl-4">
              <VersionControlConfig />
            </div>
          </section>
        </div>
      </ScrollArea>
    </div>
  );
};

export default Configuration;