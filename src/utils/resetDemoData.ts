
import { queryClient } from '@/lib/queryClient';

export async function resetDemoData() {
  /* 1. LocalStorage / IndexedDB (MockAdapter) */
  const keys = [
    'leads', 'clients', 'contracts', 'proposals',
    'conexa_snapshot', 'space_bindings', 'import_templates',
  ];
  keys.forEach(k => localStorage.removeItem(k));

  /* 2. Se houver backend: endpoint opcional */
  // await api.delete('/admin/demo-data');   // descomente quando existir

  /* 3. Limpa cache React-Query para refletir imediatamente */
  queryClient.clear();
}
