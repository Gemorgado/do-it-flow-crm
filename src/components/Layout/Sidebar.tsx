
import {
  Sidebar as SidebarContainer,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
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
  Settings 
} from "lucide-react";
import { Link, useLocation } from "react-router-dom";

export function Sidebar() {
  const location = useLocation();

  const mainMenuItems = [
    { title: "Dashboard", url: "/", icon: LayoutDashboard },
    { title: "Pipeline", url: "/pipeline", icon: ArrowRight },
    { title: "Leads e Clientes", url: "/contatos", icon: Users },
    { title: "Propostas", url: "/propostas", icon: FileText },
    { title: "Agendamentos", url: "/agendamentos", icon: CalendarCheck },
    { title: "Mensagens", url: "/mensagens", icon: MessageSquare },
  ];

  const configMenuItems = [
    { title: "Configurações", url: "/configuracoes", icon: Settings },
  ];

  const isActiveLink = (url: string) => {
    return location.pathname === url;
  };

  return (
    <SidebarContainer>
      <SidebarHeader className="flex items-center justify-center p-4">
        <div className="flex items-center space-x-2">
          <div className="bg-doIt-primary rounded-md p-1">
            <span className="text-white font-bold text-lg">D</span>
          </div>
          <span className="font-semibold text-xl">Do It Flow</span>
        </div>
      </SidebarHeader>
      
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Principal</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {mainMenuItems.map((item) => (
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
