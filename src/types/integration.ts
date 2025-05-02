
export interface Integration {
  id: string;                // ex.: 'whatsapp_business'
  name: string;              // 'WhatsApp Business'
  category: 'marketing' | 'erp' | 'pixel' | 'webhook' | 'outro';
  description: string;
  connectedAt?: string;      // começa undefined
  status: 'connected' | 'disconnected';
  logo: string;              // caminho do ícone
}
