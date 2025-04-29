
export interface CampaignMetrics {
  clicks: number;
  impressions: number;
  ctr: number;
  cpc: number;
  conversions: number;
  convRate: number;
  cost: number;
}

// Default metrics for demo/placeholder
export const defaultCampaignMetrics = {
  google: {
    clicks: 8742,
    impressions: 187654,
    ctr: 4.66,
    cpc: 2.34,
    conversions: 325,
    convRate: 3.72,
    cost: 20456.28
  },
  meta: {
    clicks: 10543,
    impressions: 312456,
    ctr: 3.37,
    cpc: 1.87,
    conversions: 278,
    convRate: 2.64,
    cost: 19715.41
  }
};
