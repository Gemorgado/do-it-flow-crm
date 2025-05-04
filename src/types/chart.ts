
export interface DashboardStats {
  newLeads: number;
  activeClients: number;
  revenueMTD: number;
  leadsConversion: number;
  pendingTasks: number;
  upcomingRenewals: number;
  meetingsScheduled: number;
}

export interface ChartData {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    backgroundColor?: string | string[];
    borderColor?: string;
    borderWidth?: number;
  }[];
}
