import { FolderTree, GitBranch, PackageSearch, BarChart2, Code2, Github } from "lucide-react"
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
} from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"
import { PromptInput } from "@/components/PromptInput"
import { useState } from "react"

export function AppSidebar() {
  const { toast } = useToast();
  const [promptValue, setPromptValue] = useState("");

  const handleGitLogin = () => {
    console.log("Initiating GitHub login...");
    toast({
      title: "GitHub Integration",
      description: "GitHub login functionality will be implemented in the next iteration.",
    });
  };

  const handlePromptSubmit = () => {
    console.log("Submitting prompt:", promptValue);
    setPromptValue(""); // Clear input after submission
  };

  return (
    <Sidebar>
      <SidebarHeader className="p-4">
        <h2 className="text-lg font-bold bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
          AI Code Generator
        </h2>
        <Button 
          onClick={handleGitLogin}
          className="w-full mt-4 bg-sidebar-accent hover:bg-sidebar-accent/90"
        >
          <Github className="mr-2 h-4 w-4" />
          Connect to GitHub
        </Button>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Project Tools</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton>
                  <Code2 className="mr-2 h-4 w-4" />
                  <span>Code Generator</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton>
                  <FolderTree className="mr-2 h-4 w-4" />
                  <span>Project Structure</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton>
                  <PackageSearch className="mr-2 h-4 w-4" />
                  <span>Dependencies</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton>
                  <BarChart2 className="mr-2 h-4 w-4" />
                  <span>Project Stats</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton>
                  <GitBranch className="mr-2 h-4 w-4" />
                  <span>Version Control</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="p-4">
        <div className="rounded-lg border border-sidebar-border bg-sidebar-accent/5 p-4 shadow-sm">
          <PromptInput 
            value={promptValue}
            onChange={setPromptValue}
            onSubmit={handlePromptSubmit}
            isLoading={false}
          />
        </div>
      </SidebarFooter>
    </Sidebar>
  )
}