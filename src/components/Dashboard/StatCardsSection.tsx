
import { StatCard } from "@/components/Dashboard/StatCard";
import { DashboardStats } from "@/types";
import { Users, ArrowRight, FileText } from "lucide-react";

interface StatCardsSectionProps {
  stats: DashboardStats;
}

export function StatCardsSection({ stats }: StatCardsSectionProps) {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
      <StatCard
        title="Leads Novos"
        value={stats.newLeads}
        icon={<Users className="h-5 w-5" />}
        description="Últimos 30 dias"
      />
      <StatCard
        title="Taxa de Conversão"
        value={`${stats.leadsConversion}%`}
        icon={<ArrowRight className="h-5 w-5" />}
        description="Últimos 30 dias"
      />
      <StatCard
        title="Clientes Ativos"
        value={stats.activeClients}
        icon={<Users className="h-5 w-5" />}
      />
      <StatCard
        title="Faturamento"
        value={`R$ ${(stats.revenueMTD / 1000).toFixed(1)}k`}
        icon={<FileText className="h-5 w-5" />}
        description="Mês atual"
      />
    </div>
  );
}
