
import { getClient, listClients } from './clientQueries';
import { createClient, updateClient, deleteClient } from './clientMutations';

export const clientPersistence = {
  listClients,
  getClient,
  createClient,
  updateClient,
  deleteClient
};
