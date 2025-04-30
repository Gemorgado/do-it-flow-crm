
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";

// Auth
import { AuthProvider } from "@/modules/auth/AuthProvider";
import { ProtectedRoute } from "@/modules/auth/ProtectedRoute";
import LoginPage from "@/modules/auth/LoginPage";

// Pages
import Dashboard from "@/pages/Dashboard";
import Contacts from "@/pages/Contacts";
import Pipeline from "@/pages/Pipeline";
import SpaceManagement from "@/pages/SpaceManagement";
import MeetingRooms from "@/pages/MeetingRooms";
import FiscalAddresses from "@/pages/FiscalAddresses";
import GrowthDashboard from "@/pages/GrowthDashboard";
import GrowthReports from "@/pages/GrowthReports";
import Integrations from "@/pages/Integrations";
import PlansAndServices from "@/pages/PlansAndServices";
import Automations from "@/pages/Automations";
import Messages from "@/pages/Messages";
import Proposals from "@/pages/Proposals";
import Schedule from "@/pages/Schedule";
import Settings from "@/pages/Settings";
import Profile from "@/pages/Profile";
import NotFound from "@/pages/NotFound";
import AccessDenied from "@/pages/AccessDenied";
import Index from "@/pages/Index";

import { MainLayout } from "@/components/Layout/MainLayout";
import { CRMModalsProvider } from "@/components/CRM/CRMModalsProvider";

// Cria uma nova instância do QueryClient
const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <AuthProvider>
          <CRMModalsProvider>
            <Routes>
              <Route path="/" element={<Navigate to="/login" replace />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/403" element={<AccessDenied />} />
              
              <Route path="/" element={
                <ProtectedRoute>
                  <MainLayout>
                    <Navigate to="/dashboard" replace />
                  </MainLayout>
                </ProtectedRoute>
              } />
              
              <Route path="/" element={
                <ProtectedRoute>
                  <MainLayout />
                </ProtectedRoute>
              }>
                <Route path="dashboard" element={<Dashboard />} />
                <Route path="contacts" element={<Contacts />} />
                <Route path="pipeline" element={
                  <ProtectedRoute tab="PIPELINE">
                    <Pipeline />
                  </ProtectedRoute>
                } />
                <Route path="spaces" element={
                  <ProtectedRoute tab="OCCUPANCY_MAP">
                    <SpaceManagement />
                  </ProtectedRoute>
                } />
                <Route path="meeting-rooms" element={<MeetingRooms />} />
                <Route path="fiscal-addresses" element={<FiscalAddresses />} />
                <Route path="growth" element={
                  <ProtectedRoute tab="GROWTH">
                    <GrowthDashboard />
                  </ProtectedRoute>
                } />
                <Route path="growth-reports" element={
                  <ProtectedRoute tab="REPORTS">
                    <GrowthReports />
                  </ProtectedRoute>
                } />
                <Route path="integrations" element={<Integrations />} />
                <Route path="plans" element={<PlansAndServices />} />
                <Route path="automations" element={<Automations />} />
                <Route path="messages" element={<Messages />} />
                <Route path="proposals" element={<Proposals />} />
                <Route path="schedule" element={<Schedule />} />
                <Route path="settings" element={<Settings />} />
                <Route path="profile" element={<Profile />} />
                <Route path="*" element={<NotFound />} />
              </Route>
            </Routes>
            <Toaster />
          </CRMModalsProvider>
        </AuthProvider>
      </Router>
    </QueryClientProvider>
  );
}

export default App;
