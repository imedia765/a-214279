import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip } from "@/components/ui/chart";
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, Tooltip, Legend } from 'recharts';

const mockPerformanceData = [
  { time: '0s', responseTime: 120, throughput: 50 },
  { time: '10s', responseTime: 180, throughput: 45 },
  { time: '20s', responseTime: 150, throughput: 55 },
  { time: '30s', responseTime: 200, throughput: 40 },
  { time: '40s', responseTime: 160, throughput: 48 },
];

export const PerformanceMetrics = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Performance Metrics</CardTitle>
        <CardDescription>Response time and throughput</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={mockPerformanceData}>
              <XAxis dataKey="time" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="responseTime" 
                stroke="#8884d8" 
                name="Response Time (ms)" 
              />
              <Line 
                type="monotone" 
                dataKey="throughput" 
                stroke="#82ca9d" 
                name="Throughput (req/s)" 
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};