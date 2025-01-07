import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Brain, Database, Code, GitBranch, Copy, Printer } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { useProject } from '@/contexts/ProjectContext';
import { QuickAccess } from '@/components/researcher/QuickAccess';
import { AnalysisTools } from '@/components/researcher/AnalysisTools';
import { MiniBrowser } from '@/components/researcher/MiniBrowser';

const AIResearcher = () => {
  const { toast } = useToast();
  const { selectedProject } = useProject();
  const [selectedText, setSelectedText] = useState('');

  const projectTools = {
    'current': [
      { name: 'Code Analysis', progress: 85, description: 'Analyzing code patterns and structure' },
      { name: 'Data Mining', progress: 70, description: 'Extracting valuable insights from project data' },
      { name: 'Dependency Scanner', progress: 90, description: 'Scanning and analyzing project dependencies' }
    ]
  };

  const handleAnalyze = () => {
    toast({
      title: "Analysis Started",
      description: `AI is analyzing ${selectedProject.name}'s codebase...`,
    });
  };

  const handleCopyText = () => {
    if (selectedText) {
      navigator.clipboard.writeText(selectedText);
      toast({
        title: "Text Copied",
        description: "Selected text has been copied to clipboard",
      });
    }
  };

  const handleTextSelection = () => {
    const selection = window.getSelection();
    if (selection) {
      setSelectedText(selection.toString());
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
          AI Research Tools - {selectedProject.name}
        </h1>
        <div className="flex items-center gap-4">
          {selectedText && (
            <Button 
              onClick={handleCopyText} 
              variant="outline"
              className="flex items-center gap-2"
            >
              <Copy className="h-4 w-4" />
              Copy Selection
            </Button>
          )}
          <Button onClick={handleAnalyze} className="flex items-center gap-2">
            <Brain className="h-4 w-4" />
            Analyze Project
          </Button>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="space-y-6">
          <Card className="p-6 gradient-border">
            <div className="flex items-center gap-2 mb-4">
              <Brain className="h-5 w-5 text-primary" />
              <h2 className="text-xl font-semibold">Analysis Tools</h2>
            </div>
            <AnalysisTools tools={projectTools[selectedProject.id as keyof typeof projectTools] || projectTools.current} />
          </Card>

          <Card className="p-6 gradient-border">
            <div className="flex items-center gap-2 mb-4">
              <Database className="h-5 w-5 text-primary" />
              <h2 className="text-xl font-semibold">Quick Access</h2>
            </div>
            <QuickAccess />
          </Card>
        </div>

        <div onMouseUp={handleTextSelection}>
          <MiniBrowser className="lg:row-span-2" />
        </div>
      </div>

      <Card className="p-6 gradient-border">
        <div className="flex items-center gap-2 mb-4">
          <Brain className="h-5 w-5 text-primary" />
          <h2 className="text-xl font-semibold">Project Intelligence</h2>
        </div>
        <p className="text-muted-foreground mb-4">
          The AI Research Assistant analyzes your project structure, suggests improvements,
          and provides insights based on patterns from similar projects in the knowledge base.
        </p>
        <div className="grid md:grid-cols-3 gap-4">
          <div className="p-4 bg-accent/10 rounded-lg hover:bg-accent/20 transition-colors">
            <div className="flex items-center gap-2 mb-2">
              <Code className="h-4 w-4 text-primary" />
              <h3 className="font-medium">Code Analysis</h3>
            </div>
            <p className="text-sm text-muted-foreground">Real-time pattern analysis and suggestions</p>
          </div>
          <div className="p-4 bg-accent/10 rounded-lg hover:bg-accent/20 transition-colors">
            <div className="flex items-center gap-2 mb-2">
              <GitBranch className="h-4 w-4 text-primary" />
              <h3 className="font-medium">Project Structure</h3>
            </div>
            <p className="text-sm text-muted-foreground">Architecture and dependency insights</p>
          </div>
          <div className="p-4 bg-accent/10 rounded-lg hover:bg-accent/20 transition-colors">
            <div className="flex items-center gap-2 mb-2">
              <Database className="h-4 w-4 text-primary" />
              <h3 className="font-medium">Knowledge Base</h3>
            </div>
            <p className="text-sm text-muted-foreground">Access to patterns and best practices</p>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default AIResearcher;