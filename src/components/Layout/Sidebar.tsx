
import {
  Sidebar as SidebarContainer,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { 
  LayoutDashboard, 
  Users, 
  FileText, 
  ArrowRight, 
  CalendarCheck, 
  MessageSquare, 
  Settings,
  Building,
  BarChart,
  FileBarChart,
  Zap,
  Plug,
  DoorClosed,
  Badge
} from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { useCurrentUser } from "@/modules/settings/users/hooks/useCurrentUser";
import { TabKey } from "@/modules/settings/users/types";

interface SidebarRoute {
  title: string;
  url: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  tabKey?: TabKey;
}

export function Sidebar() {
  const location = useLocation();
  const { currentUser } = useCurrentUser();
  const [filteredMenuItems, setFilteredMenuItems] = useState<SidebarRoute[]>([]);

  // Define all menu items with their corresponding tab keys
  const mainMenuItems: SidebarRoute[] = [
    { title: "Dashboard", url: "/dashboard", icon: LayoutDashboard },
    { title: "Pipeline", url: "/pipeline", icon: ArrowRight, tabKey: "PIPELINE" },
    { title: "Leads e Clientes", url: "/contacts", icon: Users },
    { title: "Propostas", url: "/proposals", icon: FileText },
    { title: "Agendamentos", url: "/schedule", icon: CalendarCheck },
    { title: "Salas de Reunião", url: "/meeting-rooms", icon: DoorClosed },
    { title: "Mensagens", url: "/messages", icon: MessageSquare },
    { title: "Growth", url: "/growth", icon: BarChart, tabKey: "GROWTH" },
    { title: "Relatórios", url: "/growth-reports", icon: FileBarChart, tabKey: "REPORTS" },
    { title: "Espaços", url: "/spaces", icon: Building, tabKey: "OCCUPANCY_MAP" },
    { title: "Planos e Serviços", url: "/plans", icon: FileText },
    { title: "Endereços Fiscais", url: "/fiscal-addresses", icon: Badge },
  ];

  const automationItems: SidebarRoute[] = [
    { title: "Automações", url: "/automations", icon: Zap },
    { title: "Integrações", url: "/integrations", icon: Plug },
  ];

  const configMenuItems: SidebarRoute[] = [
    { title: "Configurações", url: "/settings", icon: Settings },
  ];

  // Filter menu items based on user permissions
  useEffect(() => {
    if (currentUser) {
      // For tabs that require permissions, filter them
      // For tabs without a tabKey, always show them (they don't require specific permissions)
      const filtered = mainMenuItems.filter(item => 
        !item.tabKey || currentUser.allowedTabs.includes(item.tabKey)
      );
      
      setFilteredMenuItems(filtered);
    } else {
      // If no user data yet, show all menu items
      setFilteredMenuItems(mainMenuItems);
    }
  }, [currentUser]);

  const isActiveLink = (url: string) => {
    return location.pathname === url;
  };

  return (
    <SidebarContainer>
      <SidebarHeader className="flex items-center justify-center p-4">
        <div className="flex items-center space-x-2">
          <img src="./do-it-logo.png" alt="Logo" className="h-8 w-8" />
          <span className="font-semibold text-xl">Do It Hub</span>
        </div>
      </SidebarHeader>
      
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Principal</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {filteredMenuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton 
                    asChild
                    className={isActiveLink(item.url) ? "bg-doIt-light text-doIt-primary" : ""}
                  >
                    <Link to={item.url} className="flex items-center gap-3">
                      <item.icon className="h-5 w-5" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        
        <SidebarGroup>
          <SidebarGroupLabel>Automação</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {automationItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton 
                    asChild
                    className={isActiveLink(item.url) ? "bg-doIt-light text-doIt-primary" : ""}
                  >
                    <Link to={item.url} className="flex items-center gap-3">
                      <item.icon className="h-5 w-5" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        
        <SidebarGroup>
          <SidebarGroupLabel>Sistema</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {configMenuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton 
                    asChild
                    className={isActiveLink(item.url) ? "bg-doIt-light text-doIt-primary" : ""}
                  >
                    <Link to={item.url} className="flex items-center gap-3">
                      <item.icon className="h-5 w-5" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </SidebarContainer>
  );
}
