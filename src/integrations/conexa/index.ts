
import { syncCustomers } from './syncCustomers';
import { syncContracts } from './syncContracts';
import { syncServices } from './syncServices';
import { ConexaSyncStatus, isConexaConfigValid } from './conexaClient';

export { syncCustomers, syncContracts, syncServices, isConexaConfigValid };

export const syncAllConexaData = async (
  lastSync?: string
): Promise<ConexaSyncStatus> => {
  try {
    // Run all sync operations in parallel
    const [customers, contracts, services] = await Promise.all([
      syncCustomers(lastSync),
      syncContracts(lastSync),
      syncServices(lastSync),
    ]);

    // Update the last sync time
    const now = new Date();
    const nextSync = new Date(now.getTime() + 15 * 60 * 1000); // 15 minutes later

    return {
      lastSync: now.toISOString(),
      nextSync: nextSync.toISOString(),
      status: 'connected',
      syncCount: {
        customers,
        contracts,
        services,
      }
    };
  } catch (error) {
    console.error('Error during Conexa sync:', error);
    
    return {
      lastSync: lastSync || new Date().toISOString(),
      nextSync: new Date(Date.now() + 15 * 60 * 1000).toISOString(),
      status: 'error',
      syncCount: {
        customers: 0,
        contracts: 0,
        services: 0
      }
    };
  }
};
