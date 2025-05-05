
import { Client, NewClient } from '../models/Client';

export interface ClientRepository {
  list(): Promise<Client[]>;
  get(id: string): Promise<Client | null>;
  create(data: NewClient): Promise<Client>;
  update(data: Client): Promise<Client>;
  remove(id: string): Promise<void>;
  addService(clientId: string, service: any): Promise<any>;
}
