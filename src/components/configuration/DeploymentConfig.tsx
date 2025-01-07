import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Rocket, Server, CloudUpload, Network } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

export const DeploymentConfig = () => {
  const { toast } = useToast();

  const handleDeploy = (platform: string) => {
    toast({
      title: "Deployment Initiated",
      description: `Starting deployment to ${platform}...`,
    });
  };

  return (
    <Card className="border-[#33C3F0]/20 bg-gradient-to-br from-background to-[#33C3F0]/5">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Rocket className="h-6 w-6 text-[#33C3F0]" />
          Deployment Configuration
        </CardTitle>
        <CardDescription>Configure and manage your deployment settings</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card className="border-[#9b87f5]/20 hover:border-[#9b87f5]/40 transition-colors">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <CloudUpload className="h-5 w-5 text-[#9b87f5]" />
                  <h3 className="font-semibold">Vercel</h3>
                </div>
                <Button 
                  onClick={() => handleDeploy('Vercel')}
                  className="bg-gradient-to-r from-[#9b87f5] to-[#7E69AB]"
                >
                  Deploy
                </Button>
              </div>
              <p className="text-sm text-muted-foreground">Serverless deployment platform</p>
            </CardContent>
          </Card>

          <Card className="border-[#D6BCFA]/20 hover:border-[#D6BCFA]/40 transition-colors">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Server className="h-5 w-5 text-[#D6BCFA]" />
                  <h3 className="font-semibold">Netlify</h3>
                </div>
                <Button 
                  onClick={() => handleDeploy('Netlify')}
                  className="bg-gradient-to-r from-[#D6BCFA] to-[#9b87f5]"
                >
                  Deploy
                </Button>
              </div>
              <p className="text-sm text-muted-foreground">Modern hosting platform</p>
            </CardContent>
          </Card>

          <Card className="border-[#E5DEFF]/20 hover:border-[#E5DEFF]/40 transition-colors">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Network className="h-5 w-5 text-[#E5DEFF]" />
                  <h3 className="font-semibold">AWS Amplify</h3>
                </div>
                <Button 
                  onClick={() => handleDeploy('AWS Amplify')}
                  className="bg-gradient-to-r from-[#E5DEFF] to-[#D6BCFA]"
                >
                  Deploy
                </Button>
              </div>
              <p className="text-sm text-muted-foreground">AWS hosting service</p>
            </CardContent>
          </Card>

          <Card className="border-[#33C3F0]/20 hover:border-[#33C3F0]/40 transition-colors">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Server className="h-5 w-5 text-[#33C3F0]" />
                  <h3 className="font-semibold">Digital Ocean</h3>
                </div>
                <Button 
                  onClick={() => handleDeploy('Digital Ocean')}
                  className="bg-gradient-to-r from-[#33C3F0] to-[#1EAEDB]"
                >
                  Deploy
                </Button>
              </div>
              <p className="text-sm text-muted-foreground">Cloud infrastructure platform</p>
            </CardContent>
          </Card>
        </div>
      </CardContent>
    </Card>
  );
};