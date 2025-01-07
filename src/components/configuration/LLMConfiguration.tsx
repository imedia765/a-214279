import React, { useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { useLLM } from '@/hooks/useLLM';
import { LLMProviderSelect } from '@/components/LLMProviderSelect';

export const LLMConfiguration = () => {
  const { providers, selectedProvider, setSelectedProvider, loadProviders, isLoading, error } = useLLM();
  const [apiKey, setApiKey] = React.useState('');
  const [baseUrl, setBaseUrl] = React.useState('');

  useEffect(() => {
    loadProviders();
  }, []);

  const handleSave = async () => {
    console.log('Saving configuration:', { selectedProvider, apiKey, baseUrl });
  };

  return (
    <Card className="border-[#9b87f5]/20 bg-gradient-to-br from-background to-[#9b87f5]/5">
      <CardHeader>
        <CardTitle>LLM Provider Configuration</CardTitle>
        <CardDescription>Configure your LLM providers and API settings</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        
        <div className="space-y-2">
          <label className="text-sm font-medium">Provider</label>
          <LLMProviderSelect
            providers={providers}
            selectedProvider={selectedProvider}
            onProviderChange={setSelectedProvider}
          />
        </div>
        
        <div className="space-y-2">
          <label className="text-sm font-medium">API Key</label>
          <Input
            type="password"
            placeholder="Enter your API key"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            className="border-[#9b87f5]/20"
          />
        </div>
        
        <div className="space-y-2">
          <label className="text-sm font-medium">Base URL (Optional)</label>
          <Input
            placeholder="Enter base URL if using custom endpoint"
            value={baseUrl}
            onChange={(e) => setBaseUrl(e.target.value)}
            className="border-[#9b87f5]/20"
          />
        </div>
        
        <Button 
          onClick={handleSave}
          disabled={isLoading}
          className="w-full bg-gradient-to-r from-[#9b87f5] to-[#7E69AB] hover:from-[#7E69AB] hover:to-[#6E59A5]"
        >
          Save Configuration
        </Button>
      </CardContent>
    </Card>
  );
};