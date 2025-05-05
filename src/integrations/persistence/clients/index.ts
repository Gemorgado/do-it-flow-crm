
import { getClient, listClients } from './clientQueries';
import { createClient, updateClient, deleteClient } from './clientMutations';

// Add a createClients function to handle batch creation
const createClients = async (clients) => {
  console.log("Creating multiple clients:", clients.length);
  // Implementation to add multiple clients
  for (const client of clients) {
    await createClient(client);
  }
  return Promise.resolve();
};

export const clientPersistence = {
  listClients,
  getClient,
  createClient,
  updateClient,
  deleteClient,
  createClients
};
