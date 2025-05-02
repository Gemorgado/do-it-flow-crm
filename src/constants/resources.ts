
export const RESOURCES = [
  { id: 'meet1',  label: 'Meet 1 – 11 lugares' },
  { id: 'meet2',  label: 'Meet 2 – 8 lugares' },
  { id: 'meet3',  label: 'Meet 3 – 4 lugares' },
  { id: 'meet4',  label: 'Meet 4 – 13 lugares' },
  { id: 'auditorio', label: 'Auditório – 80 lugares' },
] as const;

export type Resource = typeof RESOURCES[number]['id'];
