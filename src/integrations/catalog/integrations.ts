
import { Integration } from "@/types/integration";

export const integrationCatalog: Integration[] = [
  {
    id: 'whatsapp_business',
    name: 'WhatsApp Business',
    category: 'marketing',
    description: 'Envie e receba mensagens diretamente pelo CRM.',
    status: 'disconnected',
    logo: '/icons/whatsapp.svg',
  },
  {
    id: 'meta_pixel',
    name: 'Meta Pixel',
    category: 'pixel',
    description: 'Acompanhe conversões e eventos do seu site.',
    status: 'disconnected',
    logo: '/icons/meta.svg',
  },
  {
    id: 'google_tag_manager',
    name: 'Google Tag Manager',
    category: 'marketing',
    description: 'Rastreie a origem dos leads e campanhas.',
    status: 'disconnected',
    logo: '/icons/code.svg',
  },
  {
    id: 'docusign',
    name: 'Assinatura Digital',
    category: 'outro',
    description: 'Integre com DocuSign para contratos digitais.',
    status: 'disconnected',
    logo: '/icons/file-signature.svg',
  },
  {
    id: 'zapier',
    name: 'Zapier',
    category: 'webhook',
    description: 'Integre com milhares de aplicativos.',
    status: 'disconnected',
    logo: '/icons/zap.svg',
  },
  {
    id: 'conexa_erp',
    name: 'Conexa ERP',
    category: 'erp',
    description: 'Sincronize dados com o sistema Conexa ERP.',
    status: 'disconnected',
    logo: '/icons/database.svg',
  }
];
