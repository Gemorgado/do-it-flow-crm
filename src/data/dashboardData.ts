
import { DashboardStats, ChartData } from "@/types";

export const dashboardStats: DashboardStats = {
  newLeads: 256,
  activeClients: 187,
  revenueMTD: 1420000,
  leadsConversion: 23.5,
  pendingTasks: 12,
  upcomingRenewals: 8,
  meetingsScheduled: 3
};

export const leadsChartData: ChartData = {
  labels: ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho"],
  datasets: [
    {
      label: "Leads",
      data: [120, 150, 180, 200, 220, 256],
      borderColor: "rgba(54, 162, 235, 1)",
      backgroundColor: "rgba(54, 162, 235, 0.2)",
      borderWidth: 2,
    },
  ],
};

export const conversionChartData: ChartData = {
  labels: ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho"],
  datasets: [
    {
      label: "Conversão",
      data: [20, 25, 30, 35, 40, 60],
      borderColor: "rgba(75, 192, 192, 1)",
      backgroundColor: "rgba(75, 192, 192, 0.2)",
      borderWidth: 2,
    },
  ],
};

export const revenueChartData: ChartData = {
  labels: ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho"],
  datasets: [
    {
      label: "Receita",
      data: [5000, 6000, 7500, 8200, 9800, 14200],
      borderColor: "rgba(255, 99, 132, 1)",
      backgroundColor: "rgba(255, 99, 132, 0.2)",
      borderWidth: 2,
    },
  ],
};

export const leadSourceChartData: ChartData = {
  labels: ["Orgânico", "Google Ads", "Meta Ads", "Indicação"],
  datasets: [
    {
      label: "Origem dos Leads",
      data: [40, 30, 20, 10],
      backgroundColor: [
        "rgba(255, 99, 132, 0.7)",
        "rgba(54, 162, 235, 0.7)",
        "rgba(255, 206, 86, 0.7)",
        "rgba(75, 192, 192, 0.7)",
      ],
      borderWidth: 1,
    },
  ],
};

export const leadSourceData = {
  labels: ["Google Ads", "Meta Ads", "Orgânico", "Referência", "Indicação", "Outros"],
  datasets: [
    {
      label: "Lead Sources",
      data: [35, 25, 18, 12, 8, 2],
      backgroundColor: [
        "rgba(54, 162, 235, 0.7)",
        "rgba(102, 102, 255, 0.7)",
        "rgba(75, 192, 192, 0.7)",
        "rgba(255, 206, 86, 0.7)",
        "rgba(255, 159, 64, 0.7)",
        "rgba(201, 203, 207, 0.7)"
      ],
      borderWidth: 1
    }
  ]
};

export const campaignPerformanceData = {
  labels: ["Campanha A", "Campanha B", "Campanha C", "Campanha D", "Campanha E"],
  datasets: [
    {
      label: "CPL (R$)",
      data: [45.20, 67.80, 32.50, 89.30, 51.70],
      backgroundColor: "rgba(54, 162, 235, 0.7)",
    },
    {
      label: "CAC (R$)",
      data: [320.50, 475.40, 290.30, 610.80, 380.20],
      backgroundColor: "rgba(255, 99, 132, 0.7)",
    }
  ]
};

// Add the missing trafficSourceData, metaVsGoogleData, and growthMetrics
export const trafficSourceData = {
  labels: ["Direto", "Orgânico", "Redes Sociais", "Email", "Referência", "Ads"],
  datasets: [
    {
      label: "Tráfego",
      data: [30, 25, 20, 15, 7, 3],
      backgroundColor: [
        "rgba(54, 162, 235, 0.7)",
        "rgba(75, 192, 192, 0.7)",
        "rgba(153, 102, 255, 0.7)",
        "rgba(255, 159, 64, 0.7)",
        "rgba(255, 205, 86, 0.7)",
        "rgba(255, 99, 132, 0.7)"
      ]
    }
  ]
};

export const metaVsGoogleData = {
  labels: ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun"],
  datasets: [
    {
      label: "Google Ads",
      data: [12, 19, 15, 22, 24, 25],
      backgroundColor: "rgba(54, 162, 235, 0.5)",
      borderColor: "rgba(54, 162, 235, 1)",
      borderWidth: 2
    },
    {
      label: "Meta Ads",
      data: [15, 12, 19, 16, 14, 17],
      backgroundColor: "rgba(153, 102, 255, 0.5)",
      borderColor: "rgba(153, 102, 255, 1)",
      borderWidth: 2
    }
  ]
};

export const growthMetrics = [
  {
    title: "CAC Meta",
    value: "R$ 392",
    change: "12%",
    changeDirection: "down",
    badgeVariant: "default"
  },
  {
    title: "CAC Google",
    value: "R$ 390",
    change: "5%",
    changeDirection: "down",
    badgeVariant: "default"
  },
  {
    title: "CPL Médio",
    value: "R$ 46",
    change: "8%",
    changeDirection: "down",
    badgeVariant: "default"
  },
  {
    title: "ROI Marketing",
    value: "187%",
    change: "15%",
    changeDirection: "up",
    badgeVariant: "default"
  }
];
