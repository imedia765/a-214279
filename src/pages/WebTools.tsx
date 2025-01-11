import { useState } from "react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { WebMetricsForm } from "@/components/web-tools/WebMetricsForm";
import { MetricsDisplay } from "@/components/web-tools/MetricsDisplay";
import { ConsoleOutput } from "@/components/web-tools/ConsoleOutput";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const WebTools = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [metrics, setMetrics] = useState<Array<{ metric: string; value: string }>>([]);
  const [logs, setLogs] = useState<string[]>([]);
  const { toast } = useToast();

  const handleAnalyze = async (url: string) => {
    setIsLoading(true);
    setLogs(prev => [...prev, `[${new Date().toLocaleTimeString()}] Analyzing ${url}...`]);

    try {
      const { data, error } = await supabase.functions.invoke('web-analyzer', {
        body: { url }
      });

      if (error) throw error;

      if (data.metrics) {
        setMetrics(data.metrics);
        setLogs(prev => [...prev, `[${new Date().toLocaleTimeString()}] Analysis completed successfully`]);
        toast({
          title: "Analysis Complete",
          description: "Website metrics have been analyzed successfully",
        });
      }
    } catch (error) {
      console.error('Analysis error:', error);
      setLogs(prev => [...prev, `[${new Date().toLocaleTimeString()}] Error: ${error.message}`]);
      toast({
        title: "Analysis Failed",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <main className="flex-1 p-6">
          <div className="container mx-auto">
            <div className="flex justify-between items-center mb-8">
              <h1 className="text-3xl font-bold">Web Development Tools</h1>
              <SidebarTrigger className="md:hidden" />
            </div>
            <div className="grid gap-6">
              <WebMetricsForm onAnalyze={handleAnalyze} isLoading={isLoading} />
              {metrics.length > 0 && <MetricsDisplay metrics={metrics} />}
              <ConsoleOutput logs={logs} />
            </div>
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default WebTools;