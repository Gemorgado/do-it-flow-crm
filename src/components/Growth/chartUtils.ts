
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
export function transformToPieSliceArray(data: ChartData): PieSlice[] {
  if (!data || !data.labels || !data.datasets || data.datasets.length === 0) {
    return [];
  }
  
  const labels = data.labels as string[];
  
  return labels.map((label, index) => ({
    name: label,
    value: data.datasets[0].data[index] as number,
    color: getColorAsString(data.datasets[0].backgroundColor, index)
  }));
}

/**
 * Transforms pie data from raw chart data format to PieSlice[]
 */
export function toPieSliceArray(raw: ChartDataFormat | ChartData): PieSlice[] {
  // Handle case when raw is chart.js ChartData
  if (!raw.labels || !raw.datasets || raw.datasets.length === 0) {
    return [];
  }

  const labels = raw.labels as string[];
  
  return labels.map((lbl, i) => ({
    name: lbl,
    value: Number(raw.datasets[0].data[i]), // Ensure we're always returning a number
    color: getColorAsString(raw.datasets[0].backgroundColor, i)
  }));
}

/**
 * Helper function to ensure color is always returned as a string
 */
function getColorAsString(color: any, index: number): string {
  if (!color) {
    // Default color if none provided
    return '#' + Math.floor(Math.random()*16777215).toString(16);
  }
  
  if (typeof color === 'string') {
    return color;
  }
  
  if (Array.isArray(color) && index < color.length) {
    return typeof color[index] === 'string' ? color[index] : '#' + Math.floor(Math.random()*16777215).toString(16);
  }
  
  // For complex color objects or functions, return a default color
  return '#' + Math.floor(Math.random()*16777215).toString(16);
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
