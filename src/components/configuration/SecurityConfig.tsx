import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Shield, Users, Key, Lock, AlertTriangle, FileKey, Network, Bell } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

export const SecurityConfig = () => {
  const { toast } = useToast();

  const handlePolicyChange = () => {
    toast({
      title: "Policy Updated",
      description: "Security policy has been successfully updated.",
    });
  };

  const handleKeyGeneration = () => {
    toast({
      title: "API Key Generated",
      description: "New API key has been created successfully.",
    });
  };

  return (
    <div className="space-y-6">
      {/* RLS Section */}
      <Card className="border-[#8B5CF6]/20 bg-gradient-to-br from-background to-[#8B5CF6]/5">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Shield className="w-6 h-6 text-[#8B5CF6]" />
            <CardTitle>Row Level Security (RLS)</CardTitle>
          </div>
          <CardDescription>Configure row-level security policies and permissions</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <label className="text-sm font-medium">Enable RLS</label>
              <p className="text-sm text-muted-foreground">Enforce row-level security policies</p>
            </div>
            <Switch onCheckedChange={handlePolicyChange} />
          </div>
          
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Table</TableHead>
                <TableHead>Policy Name</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell>users</TableCell>
                <TableCell>auth_users_policy</TableCell>
                <TableCell>SELECT, UPDATE</TableCell>
                <TableCell>
                  <Button variant="ghost" size="sm">Edit</Button>
                  <Button variant="ghost" size="sm" className="text-destructive">Delete</Button>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Authentication Section */}
      <Card className="border-[#D6BCFA]/20 bg-gradient-to-br from-background to-[#D6BCFA]/5">
        <CardHeader>
          <div className="flex items-center gap-2">
            <FileKey className="w-6 h-6 text-[#D6BCFA]" />
            <CardTitle>Authentication Settings</CardTitle>
          </div>
          <CardDescription>Configure authentication methods and policies</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Session Duration</label>
              <Select defaultValue="24h">
                <SelectTrigger>
                  <SelectValue placeholder="Select duration" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1h">1 hour</SelectItem>
                  <SelectItem value="12h">12 hours</SelectItem>
                  <SelectItem value="24h">24 hours</SelectItem>
                  <SelectItem value="7d">7 days</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">2FA Settings</label>
              <div className="flex items-center gap-2">
                <Switch />
                <span className="text-sm">Require 2FA for all users</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Roles & Permissions */}
      <Card className="border-[#E5DEFF]/20 bg-gradient-to-br from-background to-[#E5DEFF]/5">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Users className="w-6 h-6 text-[#E5DEFF]" />
            <CardTitle>Roles & Permissions</CardTitle>
          </div>
          <CardDescription>Manage user roles and access controls</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">New Role</label>
              <div className="flex gap-2">
                <Input placeholder="Role name" />
                <Button>Add Role</Button>
              </div>
            </div>
          </div>
          
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Role</TableHead>
                <TableHead>Permissions</TableHead>
                <TableHead>Users</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell>admin</TableCell>
                <TableCell>Full access</TableCell>
                <TableCell>2</TableCell>
                <TableCell>
                  <Button variant="ghost" size="sm">Edit</Button>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>editor</TableCell>
                <TableCell>Read, Write</TableCell>
                <TableCell>5</TableCell>
                <TableCell>
                  <Button variant="ghost" size="sm">Edit</Button>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Network Security */}
      <Card className="border-[#9b87f5]/20 bg-gradient-to-br from-background to-[#9b87f5]/5">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Network className="w-6 h-6 text-[#9b87f5]" />
            <CardTitle>Network Security</CardTitle>
          </div>
          <CardDescription>Configure network security settings and access controls</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">IP Whitelist</label>
              <Input placeholder="Add IP address" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Rate Limiting</label>
              <Select defaultValue="medium">
                <SelectTrigger>
                  <SelectValue placeholder="Select rate limit" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low (100 req/min)</SelectItem>
                  <SelectItem value="medium">Medium (500 req/min)</SelectItem>
                  <SelectItem value="high">High (1000 req/min)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* API Keys */}
      <Card className="border-[#E5DEFF]/20 bg-gradient-to-br from-background to-[#E5DEFF]/5">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Key className="w-6 h-6 text-[#E5DEFF]" />
            <CardTitle>API Keys</CardTitle>
          </div>
          <CardDescription>Manage API keys and access tokens</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button onClick={handleKeyGeneration}>Generate New API Key</Button>
          
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Key Name</TableHead>
                <TableHead>Created</TableHead>
                <TableHead>Last Used</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell>prod_key_1</TableCell>
                <TableCell>2024-03-15</TableCell>
                <TableCell>2024-03-20</TableCell>
                <TableCell>
                  <Button variant="ghost" size="sm" className="text-destructive">Revoke</Button>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Security Notifications */}
      <Card className="border-[#D6BCFA]/20 bg-gradient-to-br from-background to-[#D6BCFA]/5">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Bell className="w-6 h-6 text-[#D6BCFA]" />
            <CardTitle>Security Notifications</CardTitle>
          </div>
          <CardDescription>Configure security alerts and notifications</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <label className="text-sm font-medium">Failed Login Attempts</label>
                <p className="text-sm text-muted-foreground">Notify on suspicious login activity</p>
              </div>
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <label className="text-sm font-medium">API Key Usage</label>
                <p className="text-sm text-muted-foreground">Alert on unusual API activity</p>
              </div>
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <label className="text-sm font-medium">Permission Changes</label>
                <p className="text-sm text-muted-foreground">Notify on role or permission updates</p>
              </div>
              <Switch defaultChecked />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Security Audit Log */}
      <Card className="border-[#9b87f5]/20 bg-gradient-to-br from-background to-[#9b87f5]/5">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Lock className="w-6 h-6 text-[#9b87f5]" />
            <CardTitle>Security Audit Log</CardTitle>
          </div>
          <CardDescription>View security-related events and activities</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="bg-muted/50 p-4 rounded-lg">
              <div className="flex justify-between items-center text-sm">
                <span className="flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-yellow-500" />
                  Failed login attempt
                </span>
                <span className="text-muted-foreground">2 minutes ago</span>
              </div>
            </div>
            <div className="bg-muted/50 p-4 rounded-lg">
              <div className="flex justify-between items-center text-sm">
                <span className="flex items-center gap-2">
                  <Key className="w-4 h-4 text-green-500" />
                  API key generated
                </span>
                <span className="text-muted-foreground">1 hour ago</span>
              </div>
            </div>
            <div className="bg-muted/50 p-4 rounded-lg">
              <div className="flex justify-between items-center text-sm">
                <span className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-blue-500" />
                  Role permissions updated
                </span>
                <span className="text-muted-foreground">3 hours ago</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};