import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

const mockCoverageData = {
  statements: 85,
  branches: 72,
  functions: 90,
  lines: 88,
};

export const TestCoverage = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Test Coverage</CardTitle>
        <CardDescription>Code coverage metrics</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="text-sm font-medium">Statements</span>
            <span className="text-sm text-muted-foreground">{mockCoverageData.statements}%</span>
          </div>
          <Progress value={mockCoverageData.statements} className="h-2" />
        </div>
        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="text-sm font-medium">Branches</span>
            <span className="text-sm text-muted-foreground">{mockCoverageData.branches}%</span>
          </div>
          <Progress value={mockCoverageData.branches} className="h-2" />
        </div>
        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="text-sm font-medium">Functions</span>
            <span className="text-sm text-muted-foreground">{mockCoverageData.functions}%</span>
          </div>
          <Progress value={mockCoverageData.functions} className="h-2" />
        </div>
        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="text-sm font-medium">Lines</span>
            <span className="text-sm text-muted-foreground">{mockCoverageData.lines}%</span>
          </div>
          <Progress value={mockCoverageData.lines} className="h-2" />
        </div>
      </CardContent>
    </Card>
  );
};