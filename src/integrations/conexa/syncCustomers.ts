
import { conexa, ConexaCustomer } from './conexaClient';

export const fetchCustomers = async (since?: string): Promise<{ data: ConexaCustomer[] }> => {
  try {
    return await conexa.get('/customers', { 
      params: since ? { updated_at: since } : {} 
    });
  } catch (error) {
    console.error('Error fetching customers from Conexa:', error);
    throw new Error('Failed to fetch customers from Conexa');
  }
};

export const syncCustomers = async (since?: string): Promise<number> => {
  try {
    const { data } = await fetchCustomers(since);
    
    // Here you would normally save the data to your database
    // For example: await db.customers.upsertMany(data)
    
    console.log(`Synced ${data.length} customers from Conexa`);
    return data.length;
  } catch (error) {
    console.error('Error syncing customers:', error);
    return 0;
  }
};
