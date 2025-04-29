
/**
 * Defines all possible tabs that can be restricted by permissions
 */
export type TabKey =
  | 'PIPELINE'
  | 'PIPELINE_PROGRESS'
  | 'GROWTH'
  | 'REPORTS'
  | 'OCCUPANCY_MAP';

/**
 * Maps tab keys to human-readable names for display in the UI
 */
export const TabKeyDisplayMap: Record<TabKey, string> = {
  PIPELINE: 'Pipeline de Vendas',
  PIPELINE_PROGRESS: 'Progresso do Pipeline',
  GROWTH: 'Growth Dashboard',
  REPORTS: 'Relatórios',
  OCCUPANCY_MAP: 'Mapa de Ocupação'
};

/**
 * Available team designations for users
 */
export type Team =
  | 'financeiro'
  | 'atendimento'
  | 'frontdesk'
  | 'comercial';

/**
 * Maps team types to human-readable names for display in the UI
 */
export const TeamDisplayMap: Record<Team, string> = {
  financeiro: 'Financeiro',
  atendimento: 'Atendimento',
  frontdesk: 'Front Desk',
  comercial: 'Comercial'
};

/**
 * User model with permission settings
 */
export interface User {
  id: string;
  name: string;
  email: string;
  team: Team;
  allowedTabs: TabKey[];
  createdAt: string;
}

/**
 * Route interface to integrate with permission filtering
 */
export interface Route {
  path: string;
  tabKey: TabKey;
  label: string;
  element: React.ReactNode;
}
