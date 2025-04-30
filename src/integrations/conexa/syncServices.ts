
import { conexa, ConexaService } from './conexaClient';

export const fetchServices = async (since?: string): Promise<{ data: ConexaService[] }> => {
  try {
    return await conexa.get('/services', { 
      params: since ? { updated_at: since } : {} 
    });
  } catch (error) {
    console.error('Error fetching services from Conexa:', error);
    throw new Error('Failed to fetch services from Conexa');
  }
};

export const syncServices = async (since?: string): Promise<number> => {
  try {
    const { data } = await fetchServices(since);
    
    // Here you would normally save the data to your database
    // For example: await db.services.upsertMany(data)
    
    console.log(`Synced ${data.length} services from Conexa`);
    return data.length;
  } catch (error) {
    console.error('Error syncing services:', error);
    return 0;
  }
};
