
import { conexa, ConexaContract } from './conexaClient';

export const fetchContracts = async (since?: string): Promise<{ data: ConexaContract[] }> => {
  try {
    return await conexa.get('/contracts', { 
      params: since ? { updated_at: since } : {} 
    });
  } catch (error) {
    console.error('Error fetching contracts from Conexa:', error);
    throw new Error('Failed to fetch contracts from Conexa');
  }
};

export const syncContracts = async (since?: string): Promise<number> => {
  try {
    const { data } = await fetchContracts(since);
    
    // Here you would normally save the data to your database
    // For example: await db.contracts.upsertMany(data)
    
    console.log(`Synced ${data.length} contracts from Conexa`);
    return data.length;
  } catch (error) {
    console.error('Error syncing contracts:', error);
    return 0;
  }
};
