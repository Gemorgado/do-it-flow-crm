
import { BrowserRouter as Router, Routes, Route, Outlet } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";

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
import Index from "@/pages/Index";

import { MainLayout } from "@/components/Layout/MainLayout";
import { CRMModalsProvider } from "@/components/CRM/CRMModalsProvider";

// Cria uma nova instância do QueryClient
const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <CRMModalsProvider>
        <Router>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/" element={<MainLayout><Outlet /></MainLayout>}>
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="contacts" element={<Contacts />} />
              <Route path="pipeline" element={<Pipeline />} />
              <Route path="spaces" element={<SpaceManagement />} />
              <Route path="meeting-rooms" element={<MeetingRooms />} />
              <Route path="fiscal-addresses" element={<FiscalAddresses />} />
              <Route path="growth" element={<GrowthDashboard />} />
              <Route path="growth-reports" element={<GrowthReports />} />
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
        </Router>
        <Toaster />
      </CRMModalsProvider>
    </QueryClientProvider>
  );
}

export default App;
