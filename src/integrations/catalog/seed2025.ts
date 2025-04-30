
import type { Plan } from './types';

export const catalog2025: Plan[] = [
  {
    id: 'endereco_fiscal',
    category: 'endereco_fiscal',
    title: '🧾 ENDEREÇO FISCAL',
    variants: [
      { label: 'Mensal',     price: '12x de R$ 150,00 = R$ 1.800,00' },
      { label: 'Semestral',  price: '2x de R$ 360,00 = R$ 720,00',   note: '+de 20% de desconto' },
      { label: 'Anual',      price: '3x de R$ 400,00 = R$ 1.200,00', note: '+de 30% de desconto' },
    ],
    benefits: [
      'Front Desk e secretariado básico',
      'Gestão de correspondência',
      'Registro do endereço para CNPJ aos órgãos',
      'Suporte contábil',
    ],
  },
  {
    id: 'estacao_flex',
    category: 'estacao_flex',
    title: '💼 ESTAÇÃO FLEX',
    variants: [
      { label: 'Diária',     price: 'R$ 50,00' },
      { label: 'Semanal',    price: 'R$ 150,00' },
      { label: 'Mensal',     price: 'R$ 450,00' },
      { label: 'Semestral',  price: 'R$ 2.400,00 à vista', note: '+15% de desconto' },
      { label: 'Anual',      price: 'R$ 4.200,00 à vista', note: '+20% de desconto' },
    ],
    benefits: [
      'Sem limite de hora em estações compartilhadas',
      '20 impressões P&B',
      'R$ 200,00 em cashback para uso exclusivo em salas de reunião',
      '20% de desconto na contratação de salas de reunião',
    ],
  },
  {
    id: 'estacao_fixa',
    category: 'estacao_fixa',
    title: '💼 ESTAÇÃO FIXA',
    variants: [
      { label: 'Mensal',     price: 'R$ 650,00' },
      { label: 'Semestral',  price: 'R$ 3.450,00 à vista', note: '+15% de desconto' },
      { label: 'Anual',      price: 'R$ 6.000,00 à vista', note: '+20% de desconto' },
    ],
    benefits: [
      'Estação de trabalho exclusiva',
      'Endereço fiscal incluso',
      '20 impressões P&B',
      'R$ 200,00 em cashback para salas de reunião',
      '20% de desconto na contratação de salas de reunião',
    ],
  },
  {
    id: 'sala_privativa',
    category: 'sala_privativa',
    title: '🧑‍💼 SALAS PRIVATIVAS',
    variants: [
      { label: 'Mensal', price: 'A partir de R$ 3.000,00' },
    ],
    benefits: [
      'Endereço fiscal',
      'IPTU incluso',
      'Café e água no refeitório',
      'Energia e limpeza da sala',
      'Centrais de ar',
      'Segurança eletrônica 24h',
      'Front Desk e secretariado básico',
      'Gestão de correspondência',
      'Sala mobiliada (com valor adicional em contratos de 12 meses)',
      '20 impressões P&B',
      'R$ 300 em bônus para salas de reunião (não aplicável ao auditório)',
      '20% de desconto após consumo de crédito fornecido',
    ],
  },
  {
    id: 'sala_reuniao',
    category: 'sala_reuniao',
    title: '🗣️ SALAS DE REUNIÃO',
    variants: [
      { label: 'Meet3 – 4 lugares', price: 'Hora R$ 50 | Meia diária R$ 250 | Diária R$ 400' },
      { label: 'Meet2 – 8 lugares', price: 'Hora R$ 70 | Meia diária R$ 350 | Diária R$ 600' },
      { label: 'Meet1 – 11 lugares', price: 'Hora R$ 80 | Meia diária R$ 400 | Diária R$ 700' },
      { label: 'Meet4 – 13 lugares', price: 'Hora R$ 100 | Meia diária R$ 500 | Diária R$ 800' },
    ],
    benefits: [
      'Front Desk e secretariado básico',
      'Smart TV',
      'Água e café em horário comercial',
      'Aplicativo de integração',
      'Serviço de limpeza',
      'Segurança eletrônica 24h',
    ],
  },
  {
    id: 'auditorio',
    category: 'auditorio',
    title: '🎤 AUDITÓRIO',
    variants: [
      { label: 'Manhã', price: 'Confirmar com o comercial' },
      { label: 'Tarde', price: 'Confirmar com o comercial' },
      { label: 'Noite / Fim de semana', price: 'Sob negociação' },
    ],
    benefits: [
      'Capacidade: 80 lugares',
      'Data show, Flip chart, Som e microfone',
      'Mesas e cadeiras',
      'Café e água nas áreas comuns',
    ],
  },
];
