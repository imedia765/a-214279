import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle2, XCircle, AlertCircle } from 'lucide-react';

const mockTestResults = [
  { name: 'User Authentication', status: 'passed', duration: '1.2s', timestamp: '2024-01-07 10:30' },
  { name: 'Data Fetching', status: 'failed', duration: '0.8s', timestamp: '2024-01-07 10:31', error: 'Timeout error' },
  { name: 'Form Validation', status: 'passed', duration: '0.5s', timestamp: '2024-01-07 10:32' },
  { name: 'API Integration', status: 'warning', duration: '1.5s', timestamp: '2024-01-07 10:33', warning: 'Slow response' },
];

export const TestResults = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Test Results</CardTitle>
        <CardDescription>Latest test execution results</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {mockTestResults.map((test, index) => (
            <div key={index} className="flex items-center justify-between p-4 rounded-lg border bg-card hover:bg-accent/5 transition-colors">
              <div className="flex items-center gap-3">
                {test.status === 'passed' && <CheckCircle2 className="h-5 w-5 text-green-500" />}
                {test.status === 'failed' && <XCircle className="h-5 w-5 text-red-500" />}
                {test.status === 'warning' && <AlertCircle className="h-5 w-5 text-yellow-500" />}
                <div>
                  <h4 className="font-medium">{test.name}</h4>
                  <p className="text-sm text-muted-foreground">{test.timestamp}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium">{test.duration}</p>
                {test.error && <p className="text-sm text-red-500">{test.error}</p>}
                {test.warning && <p className="text-sm text-yellow-500">{test.warning}</p>}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};