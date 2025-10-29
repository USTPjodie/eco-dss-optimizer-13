import { createContext, useState, useContext, ReactNode, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { User as SupabaseUser, Session } from "@supabase/supabase-js";

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
  session: Session | null;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signup: (email: string, password: string, name: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  hasAccess: (module: string) => boolean;
  getAccessibleRoutes: () => string[];
  getModuleByRoute: (route: string) => string | undefined;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Fetch user profile and role from database
  const fetchUserProfile = async (supabaseUser: SupabaseUser) => {
    try {
      // Get profile
      const { data: profile } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", supabaseUser.id)
        .single();

      // Get role
      const { data: roleData } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", supabaseUser.id)
        .single();

      if (profile && roleData) {
        const userProfile: User = {
          id: profile.id,
          email: profile.email,
          name: profile.name,
          role: roleData.role as UserRole,
          lastLogin: new Date(),
        };
        setUser(userProfile);
        setIsAuthenticated(true);
      }
    } catch (error) {
      console.error("Error fetching user profile:", error);
      setUser(null);
      setIsAuthenticated(false);
    }
  };

  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        
        if (session?.user) {
          // Defer database calls to avoid blocking
          setTimeout(() => {
            fetchUserProfile(session.user);
          }, 0);
        } else {
          setUser(null);
          setIsAuthenticated(false);
        }
      }
    );

    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session?.user) {
        fetchUserProfile(session.user);
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        return { success: false, error: error.message };
      }

      if (data.user) {
        await fetchUserProfile(data.user);
        return { success: true };
      }

      return { success: false, error: "Login failed" };
    } catch (error) {
      return { success: false, error: "An unexpected error occurred" };
    }
  };

  const signup = async (email: string, password: string, name: string) => {
    try {
      const redirectUrl = `${window.location.origin}/`;
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: redirectUrl,
          data: {
            name,
          },
        },
      });

      if (error) {
        return { success: false, error: error.message };
      }

      if (data.user) {
        return { success: true };
      }

      return { success: false, error: "Signup failed" };
    } catch (error) {
      return { success: false, error: "An unexpected error occurred" };
    }
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setSession(null);
    setIsAuthenticated(false);
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

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
    </div>;
  }

  return (
    <AuthContext.Provider value={{ 
      isAuthenticated, 
      user,
      session,
      login,
      signup,
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
