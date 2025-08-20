import { createContext, useState, useContext, ReactNode, useEffect } from "react";

export type UserRole = 
  | "super_admin" 
  | "municipal_analyst" 
  | "environmental_specialist" 
  | "gis_planner" 
  | "technologist" 
  | "policy_maker" 
  | "viewer";

interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  lastLogin: Date;
}

type ModuleAccess = {
  [key: string]: boolean;
};

// Define role-based module access permissions
const roleModuleAccess: Record<UserRole, ModuleAccess> = {
  super_admin: {
    dashboard: true,
    wasteAnalysis: true,
    technologyComparison: true,
    siteSuggestions: true,
    scenarioSimulation: true,
    financialAnalysis: true,
    environmentalImpact: true,
    multiCriteriaAnalysis: true,
    policyAssistant: true,
    userManagement: true,
    settings: true,
    logs: true,
    dataManagement: true,
    wteMonitoring: true,
  },
  municipal_analyst: {
    dashboard: true,
    wasteAnalysis: true,
    scenarioSimulation: true,
    financialAnalysis: true,
    userManagement: false,
    settings: false,
    logs: false,
    technologyComparison: false,
    siteSuggestions: false,
    environmentalImpact: false,
    multiCriteriaAnalysis: false,
    policyAssistant: false,
    dataManagement: true,
    wteMonitoring: true,
  },
  environmental_specialist: {
    dashboard: true,
    wasteAnalysis: true,
    environmentalImpact: true,
    policyAssistant: true,
    userManagement: false,
    settings: false,
    logs: false,
    technologyComparison: false,
    siteSuggestions: false,
    scenarioSimulation: false,
    financialAnalysis: false,
    multiCriteriaAnalysis: false,
    dataManagement: true,
    wteMonitoring: true,
  },
  gis_planner: {
    dashboard: true,
    siteSuggestions: true,
    environmentalImpact: true,
    userManagement: false,
    settings: false,
    logs: false,
    wasteAnalysis: false,
    technologyComparison: false,
    scenarioSimulation: false,
    financialAnalysis: false,
    multiCriteriaAnalysis: false,
    policyAssistant: false,
    dataManagement: true,
    wteMonitoring: false,
  },
  technologist: {
    dashboard: true,
    technologyComparison: true,
    multiCriteriaAnalysis: true,
    userManagement: false,
    settings: false,
    logs: false,
    wasteAnalysis: false,
    siteSuggestions: false,
    scenarioSimulation: false,
    financialAnalysis: false,
    environmentalImpact: false,
    policyAssistant: false,
    dataManagement: true,
    wteMonitoring: true,
  },
  policy_maker: {
    dashboard: true,
    scenarioSimulation: true,
    multiCriteriaAnalysis: true,
    policyAssistant: true,
    userManagement: false,
    settings: false,
    logs: false,
    wasteAnalysis: false,
    technologyComparison: false,
    siteSuggestions: false,
    financialAnalysis: false,
    environmentalImpact: false,
    dataManagement: true,
    wteMonitoring: false,
  },
  viewer: {
    dashboard: true,
    userManagement: false,
    settings: false,
    logs: false,
    wasteAnalysis: false,
    technologyComparison: false,
    siteSuggestions: false,
    scenarioSimulation: false,
    financialAnalysis: false,
    environmentalImpact: false,
    multiCriteriaAnalysis: false,
    policyAssistant: false,
    dataManagement: false,
    wteMonitoring: false,
  },
};

// Map module names to routes
const moduleRoutes: Record<string, string> = {
  dashboard: "/",
  wasteAnalysis: "/waste-analysis",
  technologyComparison: "/compare",
  siteSuggestions: "/sites",
  scenarioSimulation: "/simulation",
  financialAnalysis: "/financial",
  environmentalImpact: "/environmental",
  multiCriteriaAnalysis: "/mcda",
  policyAssistant: "/policy",
  userManagement: "/users",
  settings: "/settings",
  logs: "/logs",
  dataManagement: "/data",
  wteMonitoring: "/wte-monitor",
};

type AuthContextType = {
  isAuthenticated: boolean;
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  hasAccess: (module: string) => boolean;
  getAccessibleRoutes: () => string[];
  getModuleByRoute: (route: string) => string | undefined;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock user data for demonstration purposes
const mockUsers = [
  {
    id: "1",
    email: "admin@example.com",
    password: "password",
    name: "Super Admin",
    role: "super_admin" as UserRole,
  },
  {
    id: "2",
    email: "analyst@example.com",
    password: "password",
    name: "Municipal Analyst",
    role: "municipal_analyst" as UserRole,
  },
  {
    id: "3",
    email: "env@example.com",
    password: "password",
    name: "Environmental Specialist",
    role: "environmental_specialist" as UserRole,
  },
  {
    id: "4",
    email: "gis@example.com",
    password: "password",
    name: "GIS Planner",
    role: "gis_planner" as UserRole,
  },
  {
    id: "5",
    email: "tech@example.com",
    password: "password",
    name: "Technologist",
    role: "technologist" as UserRole,
  },
  {
    id: "6",
    email: "policy@example.com",
    password: "password",
    name: "Policy Maker",
    role: "policy_maker" as UserRole,
  },
  {
    id: "7",
    email: "viewer@example.com",
    password: "password",
    name: "Read-Only Viewer",
    role: "viewer" as UserRole,
  },
];

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return localStorage.getItem("isLoggedIn") === "true";
  });
  
  const [user, setUser] = useState<User | null>(() => {
    const storedUser = localStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser) : null;
  });

  const login = async (email: string, password: string): Promise<boolean> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const foundUser = mockUsers.find(
          (u) => u.email === email && u.password === password
        );

        if (foundUser) {
          const loggedInUser: User = {
            id: foundUser.id,
            email: foundUser.email,
            name: foundUser.name,
            role: foundUser.role,
            lastLogin: new Date(),
          };

          localStorage.setItem("isLoggedIn", "true");
          localStorage.setItem("user", JSON.stringify(loggedInUser));
          
          setIsAuthenticated(true);
          setUser(loggedInUser);
          
          // Log the login activity (in a real app, this would be sent to a server)
          console.log("Login activity:", {
            userId: loggedInUser.id,
            timestamp: new Date().toISOString(),
            action: "LOGIN",
          });
          
          resolve(true);
        } else {
          resolve(false);
        }
      }, 1000);
    });
  };

  const logout = () => {
    // Log the logout activity
    if (user) {
      console.log("Logout activity:", {
        userId: user.id,
        timestamp: new Date().toISOString(),
        action: "LOGOUT",
      });
    }
    
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("user");
    setIsAuthenticated(false);
    setUser(null);
  };

  // Check if the current user has access to a specific module
  const hasAccess = (module: string): boolean => {
    if (!user) return false;
    
    const permissions = roleModuleAccess[user.role];
    return permissions ? !!permissions[module] : false;
  };

  // Get list of accessible routes for the current user
  const getAccessibleRoutes = (): string[] => {
    if (!user) return [];
    
    const permissions = roleModuleAccess[user.role];
    if (!permissions) return [];
    
    return Object.keys(permissions)
      .filter(module => permissions[module])
      .map(module => moduleRoutes[module])
      .filter(Boolean) as string[];
  };

  // Get module name from route path
  const getModuleByRoute = (route: string): string | undefined => {
    return Object.keys(moduleRoutes).find(key => moduleRoutes[key] === route);
  };

  return (
    <AuthContext.Provider value={{ 
      isAuthenticated, 
      user, 
      login, 
      logout, 
      hasAccess,
      getAccessibleRoutes,
      getModuleByRoute
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
