import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export const VersionControlConfig = () => {
  return (
    <Card className="border-[#E5DEFF]/20 bg-gradient-to-br from-background to-[#E5DEFF]/5">
      <CardHeader>
        <CardTitle>Version Control Configuration</CardTitle>
        <CardDescription>Configure version control settings and repositories</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Git Username</label>
          <Input placeholder="Enter Git username" className="border-[#E5DEFF]/20" />
        </div>
        
        <div className="space-y-2">
          <label className="text-sm font-medium">Git Email</label>
          <Input placeholder="Enter Git email" className="border-[#E5DEFF]/20" />
        </div>
        
        <div className="space-y-2">
          <label className="text-sm font-medium">Default Branch</label>
          <Input placeholder="Enter default branch name" defaultValue="main" className="border-[#E5DEFF]/20" />
        </div>
        
        <Button className="w-full bg-gradient-to-r from-[#E5DEFF] to-[#D6BCFA] text-primary-foreground hover:from-[#D6BCFA] hover:to-[#9b87f5]">
          Save Git Configuration
        </Button>
      </CardContent>
    </Card>
  );
};