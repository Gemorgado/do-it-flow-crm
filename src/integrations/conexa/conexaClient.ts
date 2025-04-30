
import axios from 'axios';

// Create axios instance for Conexa API
export const conexa = axios.create({
  baseURL: import.meta.env.VITE_CONEXA_BASE_URL || 'https://api.conexa.com.br/v1',
  headers: {
    'Authorization': `Bearer ${import.meta.env.VITE_CONEXA_API_TOKEN}`,
    'Content-Type': 'application/json',
  },
});

// Helper function to check if config is valid
export const isConexaConfigValid = (): boolean => {
  return !!import.meta.env.VITE_CONEXA_API_TOKEN && !!import.meta.env.VITE_CONEXA_BASE_URL;
};

// Type definitions for Conexa API responses
export interface ConexaCustomer {
  id: string;
  name: string;
  email: string;
  document: string;
  phone: string;
  created_at: string;
  updated_at: string;
}

export interface ConexaContract {
  id: string;
  customer_id: string;
  service_id: string;
  value: number;
  status: 'active' | 'inactive' | 'pending';
  start_date: string;
  end_date: string;
  created_at: string;
  updated_at: string;
}

export interface ConexaService {
  id: string;
  name: string;
  description: string;
  active: boolean;
  created_at: string;
  updated_at: string;
}

export interface ConexaSyncStatus {
  lastSync: string;
  nextSync: string;
  status: 'connected' | 'disconnected' | 'error';
  syncCount: {
    customers: number;
    contracts: number;
    services: number;
  }
}
