
import { ChartData } from "@/types";

// Helper function to transform ChartData to format expected by chart components
export const transformChartData = (chartData: ChartData) => {
  if (!chartData || !chartData.labels || !chartData.datasets) {
    return [];
  }
  
  return chartData.labels.map((label, index) => {
    const dataPoint: { [key: string]: string | number } = { name: label };
    
    chartData.datasets.forEach((dataset) => {
      if (dataset.label) {
        dataPoint[dataset.label] = dataset.data[index];
      }
    });
    
    return dataPoint;
  });
};

// Transform pie chart data specifically
export const transformPieChartData = (chartData: ChartData) => {
  if (!chartData || !chartData.labels || !chartData.datasets || !chartData.datasets[0]) {
    return [];
  }
  
  return chartData.labels.map((label, index) => ({
    name: label,
    value: chartData.datasets[0].data[index],
    color: chartData.datasets[0].backgroundColor instanceof Array 
      ? chartData.datasets[0].backgroundColor[index] 
      : chartData.datasets[0].backgroundColor
  }));
};
