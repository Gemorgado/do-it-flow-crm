
/**
 * Define proper types for our chart data
 */
export type PieSlice = { 
  name: string; 
  value: number; 
  color: string;
};

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
 * Transforma dados de gráfico de pizza no formato { labels, datasets } para um array de objetos
 * com { name, value, color } que é compatível com o componente PieChart
 */
export function transformPieData(chartData: ChartDataFormat): PieSlice[] {
  if (!chartData || !chartData.labels || !chartData.datasets || !chartData.datasets[0]) {
    return [];
  }
  
  // Return an array of objects with name, value, and color properties
  return chartData.labels.map((label: string, index: number) => ({
    name: label,
    value: chartData.datasets[0].data[index],
    color: Array.isArray(chartData.datasets[0].backgroundColor) 
      ? chartData.datasets[0].backgroundColor[index] 
      : chartData.datasets[0].backgroundColor
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
