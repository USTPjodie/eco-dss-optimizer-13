
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import TechnologyComparison from "./pages/TechnologyComparison";
import SiteSuggestions from "./pages/SiteSuggestions";
import PolicyAssistant from "./pages/PolicyAssistant";
import NotFound from "./pages/NotFound";
import ScenarioSimulation from "./pages/ScenarioSimulation";
import WasteAnalysis from "./pages/WasteAnalysis";
import FinancialAnalysis from "./pages/FinancialAnalysis";
import MultiCriteriaAnalysis from "./pages/MultiCriteriaAnalysis";
import EnvironmentalImpact from "./pages/EnvironmentalImpact";
import DataManagement from "./pages/DataManagement";
import ImportData from "./pages/ImportData";
import UserManagement from "./pages/UserManagement";
import Settings from "./pages/Settings";
import Logs from "./pages/Logs";
import WteMonitoring from "./pages/WteMonitoring";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/" element={
              <ProtectedRoute requiredModule="dashboard">
                <Dashboard />
              </ProtectedRoute>
            } />
            <Route path="/compare" element={
              <ProtectedRoute requiredModule="technologyComparison">
                <TechnologyComparison />
              </ProtectedRoute>
            } />
            <Route path="/sites" element={
              <ProtectedRoute requiredModule="siteSuggestions">
                <SiteSuggestions />
              </ProtectedRoute>
            } />
            <Route path="/policy" element={
              <ProtectedRoute requiredModule="policyAssistant">
                <PolicyAssistant />
              </ProtectedRoute>
            } />
            <Route path="/waste-analysis" element={
              <ProtectedRoute requiredModule="wasteAnalysis">
                <WasteAnalysis />
              </ProtectedRoute>
            } />
            <Route path="/waste-analysis/simulation" element={
              <ProtectedRoute requiredModule="wasteAnalysis">
                <ScenarioSimulation />
              </ProtectedRoute>
            } />
            <Route path="/financial" element={
              <ProtectedRoute requiredModule="financialAnalysis">
                <FinancialAnalysis />
              </ProtectedRoute>
            } />
            <Route path="/mcda" element={
              <ProtectedRoute requiredModule="multiCriteriaAnalysis">
                <MultiCriteriaAnalysis />
              </ProtectedRoute>
            } />
            <Route path="/environmental" element={
              <ProtectedRoute requiredModule="environmentalImpact">
                <EnvironmentalImpact />
              </ProtectedRoute>
            } />
            <Route path="/data" element={
              <ProtectedRoute>
                <DataManagement />
              </ProtectedRoute>
            } />
            <Route path="/import-data" element={
              <ProtectedRoute requiredModule="dataManagement">
                <ImportData />
              </ProtectedRoute>
            } />
            {/* Admin Routes */}
            <Route path="/users" element={
              <ProtectedRoute requiredModule="userManagement">
                <UserManagement />
              </ProtectedRoute>
            } />
            <Route path="/settings" element={
              <ProtectedRoute requiredModule="settings">
                <Settings />
              </ProtectedRoute>
            } />
            <Route path="/logs" element={
              <ProtectedRoute requiredModule="logs">
                <Logs />
              </ProtectedRoute>
            } />
            <Route path="/wte-monitor" element={
              <ProtectedRoute requiredModule="wteMonitoring">
                <WteMonitoring />
              </ProtectedRoute>
            } />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
