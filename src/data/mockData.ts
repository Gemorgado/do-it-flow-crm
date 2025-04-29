
// This file now re-exports everything from the new modular files 
// to maintain compatibility with existing imports

// Import from all our separate data files
import { dashboardStats, leadsChartData, conversionChartData, revenueChartData, leadSourceChartData, leadSourceData, campaignPerformanceData, trafficSourceData, metaVsGoogleData, growthMetrics } from "./dashboardData";
import { marketingROIData } from "./marketingData";
import { users, tasks } from "./usersData";
import { leads, pipelineStages } from "./leadsData";
import { locations } from "./locationsData";
import { clients, clientServices } from "./clientsData";

// Re-export everything
export {
  dashboardStats,
  leadsChartData,
  conversionChartData,
  revenueChartData,
  leadSourceChartData,
  leadSourceData,
  campaignPerformanceData,
  trafficSourceData,
  metaVsGoogleData,
  growthMetrics,
  marketingROIData,
  users,
  tasks,
  leads,
  pipelineStages,
  locations,
  clients,
  clientServices
};

// Re-export types from types.ts
export * from "./types";
