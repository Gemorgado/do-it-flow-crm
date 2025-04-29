import type { ChartData } from "chart.js";
import { PieSlice } from "@/types/pie";

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
 * Transforms chart data from { labels, datasets } format to an array of PieSlice objects
 * which is compatible with the PieChart component
 */
export function transformToPieSliceArray(data: ChartData<'pie'>): PieSlice[] {
  if (!data || !data.labels || !data.datasets || data.datasets.length === 0) {
    return [];
  }
  
  return data.labels.map((label, index) => ({
    name: label as string,
    value: data.datasets[0].data[index] as number,
    color: Array.isArray(data.datasets[0].backgroundColor) 
      ? data.datasets[0].backgroundColor[index] as string
      : data.datasets[0].backgroundColor as string
  }));
}

/**
 * Transforms pie data from raw chart data format to PieSlice[]
 */
export function toPieSliceArray(raw: {
  labels: string[];
  datasets: { data: number[]; backgroundColor: string | string[] }[];
}): PieSlice[] {
  return raw.labels.map((lbl, i) => ({
    name: lbl,
    value: raw.datasets[0].data[i],
    color: Array.isArray(raw.datasets[0].backgroundColor)
      ? raw.datasets[0].backgroundColor[i]
      : raw.datasets[0].backgroundColor
  }));
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
