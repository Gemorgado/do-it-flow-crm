
import { syncAllConexaData, isConexaConfigValid } from '../integrations/conexa';

let lastRun: string | undefined;

// This is a placeholder for the actual job scheduler
// In a real implementation, you would use a cron job or a task scheduler
export const startConexaSync = async () => {
  // Check if Conexa config is valid
  if (!isConexaConfigValid()) {
    console.error('Conexa configuration is invalid. Check your environment variables.');
    return;
  }

  console.log('Starting Conexa sync job...');

  try {
    const result = await syncAllConexaData(lastRun);
    lastRun = result.lastSync;
    console.log('Conexa sync completed successfully:', result);
    return result;
  } catch (error) {
    console.error('Error in Conexa sync job:', error);
    throw error;
  }
};

// For demonstration - in a real app, you'd use node-cron
export const scheduleConexaSync = () => {
  // Every 15 minutes
  const interval = 15 * 60 * 1000;
  
  console.log('Scheduling Conexa sync job every 15 minutes...');
  
  setInterval(async () => {
    try {
      await startConexaSync();
    } catch (error) {
      console.error('Error in scheduled Conexa sync:', error);
    }
  }, interval);
};

// For manual sync
export const triggerManualSync = async () => {
  return await startConexaSync();
};
