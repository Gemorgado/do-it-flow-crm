import type { ChartData } from "chart.js";

export type ChartDataFormat = { 
  labels: string[]; 
  datasets: { 
    label: string; 
    data: number[]; 
    backgroundColor: string | string[];
  }[];
};

export function transformChartData(chartData: any) {
  if (!chartData || !chartData.labels || !chartData.datasets) {
    return [];
  }
  
  return chartData.labels.map((label: string, index: number) => {
    const dataPoint: Record<string, any> = { name: label };
    
    chartData.datasets.forEach((dataset: any) => {
      dataPoint[dataset.label] = dataset.data[index];
    });
    
    return dataPoint;
  });
}

/**
 * Transforms chart data from { labels, datasets } format to Chart.js's native
 * ChartData<'pie'> format which is compatible with the PieChart component
 */
export function transformPieData(chartData: ChartDataFormat): ChartData<'pie'> {
  if (!chartData || !chartData.labels || !chartData.datasets || !chartData.datasets[0]) {
    return { labels: [], datasets: [] };
  }
  
  // Return data in Chart.js format
  return {
    labels: chartData.labels,
    datasets: chartData.datasets.map(dataset => ({
      label: dataset.label,
      data: dataset.data,
      backgroundColor: dataset.backgroundColor
    }))
  };
}

export function getChannelData(channelName: string, marketingROIData: any[]) {
  // Return data for the specified channel
  const channelData = marketingROIData.find(channel => channel.channel === channelName);
  
  return channelData || {
    channel: channelName,
    spend: 0,
    revenue: 0,
    roi: 0,
    leads: 0,
    customers: 0,
    cpl: 0,
    cac: 0
  };
}
