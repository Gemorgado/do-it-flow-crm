
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { MainLayout } from "./components/Layout/MainLayout";
import Dashboard from "./pages/Dashboard";
import Pipeline from "./pages/Pipeline";
import Contacts from "./pages/Contacts";
import Proposals from "./pages/Proposals";
import Schedule from "./pages/Schedule";
import Messages from "./pages/Messages";
import Settings from "./pages/Settings";
import Profile from "./pages/Profile";
import NotFound from "./pages/NotFound";
import GrowthDashboard from "./pages/GrowthDashboard";
import SpaceManagement from "./pages/SpaceManagement";
import PlansAndServices from "./pages/PlansAndServices";
import GrowthReports from "./pages/GrowthReports";
import Automations from "./pages/Automations";
import Integrations from "./pages/Integrations";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <MainLayout>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/pipeline" element={<Pipeline />} />
            <Route path="/contatos" element={<Contacts />} />
            <Route path="/propostas" element={<Proposals />} />
            <Route path="/agendamentos" element={<Schedule />} />
            <Route path="/mensagens" element={<Messages />} />
            <Route path="/configuracoes" element={<Settings />} />
            <Route path="/perfil" element={<Profile />} />
            <Route path="/growth" element={<GrowthDashboard />} />
            <Route path="/espacos" element={<SpaceManagement />} />
            <Route path="/planos" element={<PlansAndServices />} />
            <Route path="/relatorios" element={<GrowthReports />} />
            <Route path="/automacoes" element={<Automations />} />
            <Route path="/integracoes" element={<Integrations />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </MainLayout>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
