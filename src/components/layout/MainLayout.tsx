
import { cn } from "@/lib/utils";
import {
  Sidebar,
  SidebarContent,
  SidebarProvider,
  SidebarTrigger,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar";
import {
  BarChart,
  Recycle,
  Zap,
  Map,
  LineChart,
  Calculator,
  Trash2,
  Activity,
  FileText,
  LogOut,
  User,
  Settings,
  Database,
} from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";

interface MainLayoutProps {
  children: React.ReactNode;
}

type NavigationItem = {
  title: string;
  href: string;
  icon: React.ElementType;
  module: string;
};

const navigationItems: NavigationItem[] = [
  { title: "Dashboard", href: "/", icon: BarChart, module: "dashboard" },
  { title: "Waste Analysis", href: "/waste-analysis", icon: Recycle, module: "wasteAnalysis" },
  { title: "Technology Comparison", href: "/compare", icon: Zap, module: "technologyComparison" },
  { title: "Site Suggestions", href: "/sites", icon: Map, module: "siteSuggestions" },
  { title: "Financial Analysis", href: "/financial", icon: Calculator, module: "financialAnalysis" },
  { title: "Environmental Impact", href: "/environmental", icon: Trash2, module: "environmentalImpact" },
  { title: "Multi-Criteria Analysis", href: "/mcda", icon: Activity, module: "multiCriteriaAnalysis" },
  { title: "Policy Assistant", href: "/policy", icon: FileText, module: "policyAssistant" },
  { title: "WtE Monitoring", href: "/wte-monitor", icon: Activity, module: "wteMonitoring" },
  { title: "Data Management", href: "/data", icon: Database, module: "dataManagement" },
];

// Additional admin items that only Super Admin can see
const adminItems: NavigationItem[] = [
  { title: "User Management", href: "/users", icon: User, module: "userManagement" },
  { title: "Settings", href: "/settings", icon: Settings, module: "settings" },
  { title: "Logs", href: "/logs", icon: Database, module: "logs" },
];

const MainLayout = ({ children }: MainLayoutProps) => {
  const location = useLocation();
  const { logout, user, hasAccess } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    toast.success("You have been logged out");
    navigate("/login");
  };

  // Filter navigation items based on user permissions
  const accessibleNavItems = navigationItems.filter(item => hasAccess(item.module));
  const accessibleAdminItems = adminItems.filter(item => hasAccess(item.module));

  // Get role display name
  const getRoleDisplay = () => {
    if (!user) return "";
    
    const roleMap: Record<string, string> = {
      super_admin: "Super Admin",
      municipal_analyst: "Municipal Analyst",
      environmental_specialist: "Environmental Specialist",
      gis_planner: "GIS Planner",
      technologist: "Technologist/Engineer",
      policy_maker: "Policy Maker",
      viewer: "Read-Only Viewer",
    };
    
    return roleMap[user.role] || user.role;
  };

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-background">
        {/* Apply proper z-index to ensure sidebar appears above content on mobile */}
        <Sidebar>
          <SidebarContent>
            <div className="mb-4 px-4">
              <div className="flex items-center space-x-2 mb-6">
                <div className="text-lg font-semibold">CDO MSWIE DSS</div>
              </div>
              
              {user && (
                <div className="mb-6 py-2 px-3 rounded-lg bg-muted/50">
                  <div className="flex items-center mb-2">
                    <Avatar className="h-8 w-8 mr-2">
                      <AvatarImage src={`https://avatar.vercel.sh/${user.id}.png`} alt={user.name} />
                      <AvatarFallback>{user.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <div className="overflow-hidden">
                      <div className="truncate text-sm font-medium">{user.name}</div>
                      <div className="truncate text-xs text-muted-foreground">{user.email}</div>
                    </div>
                  </div>
                  <Badge variant="outline" className="w-full justify-center text-xs">
                    {getRoleDisplay()}
                  </Badge>
                </div>
              )}
            </div>
            
            <SidebarMenu>
              {accessibleNavItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    isActive={location.pathname === item.href}
                    tooltip={item.title}
                    className="hover:bg-primary/10 transition-colors duration-200"
                  >
                    <Link
                      to={item.href}
                      className="flex items-center gap-3 w-full"
                    >
                      <item.icon className="h-5 w-5" />
                      <span className="font-medium">{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}

              {accessibleAdminItems.length > 0 && (
                <>
                  <div className="px-4 py-2 mt-4 mb-2">
                    <h3 className="text-xs font-medium text-muted-foreground">Administration</h3>
                  </div>
                  
                  {accessibleAdminItems.map((item) => (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton
                        asChild
                        isActive={location.pathname === item.href}
                        tooltip={item.title}
                        className="hover:bg-primary/10 transition-colors duration-200"
                      >
                        <Link
                          to={item.href}
                          className="flex items-center gap-3 w-full"
                        >
                          <item.icon className="h-5 w-5" />
                          <span className="font-medium">{item.title}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </>
              )}

              {/* Logout button */}
              <SidebarMenuItem>
                <SidebarMenuButton
                  tooltip="Logout"
                  className="hover:bg-primary/10 transition-colors duration-200 mt-auto"
                  onClick={handleLogout}
                >
                  <div className="flex items-center gap-3 w-full text-destructive">
                    <LogOut className="h-5 w-5" />
                    <span className="font-medium">Logout</span>
                  </div>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarContent>
        </Sidebar>

        {/* Add proper padding and ensure main content doesn't get overlapped */}
        <main className="flex-1 overflow-hidden md:ml-0">
          <div className="container mx-auto p-4">
            {/* Make the trigger more visible on mobile */}
            <SidebarTrigger className="mb-4 md:mb-6" />
            
            <div className="flex justify-between items-center mb-6">
              <div>
                <h1 className="text-2xl font-bold">{
                  // Get the current page title from the navigation items
                  [...accessibleNavItems, ...accessibleAdminItems].find(
                    item => item.href === location.pathname
                  )?.title || "Dashboard"
                }</h1>
              </div>
              
              {user && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm" className="ml-auto">
                      <Avatar className="h-6 w-6">
                        <AvatarImage src={`https://avatar.vercel.sh/${user.id}.png`} alt={user.name} />
                        <AvatarFallback>{user.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                      </Avatar>
                      <span className="ml-2 hidden md:inline">{user.name}</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>My Account</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem disabled>Profile</DropdownMenuItem>
                    <DropdownMenuItem disabled>Preferences</DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleLogout} className="text-destructive">
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>Logout</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </div>
            
            <div className="mt-2">{children}</div>
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default MainLayout;
