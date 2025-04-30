
import { queryClient } from '@/lib/queryClient';

export async function resetDemoData() {
  /* 1. LocalStorage / IndexedDB (MockAdapter) */
  const keys = [
    'leads', 'clients', 'contracts', 'proposals',
    'conexa_snapshot', 'space_bindings', 'import_templates',
  ];
  
  // Remove all items from localStorage
  keys.forEach(k => localStorage.removeItem(k));
  
  // Clear specific items that might be named differently
  localStorage.removeItem('mockLeads');
  localStorage.removeItem('mockClients');
  localStorage.removeItem('mockContacts');
  localStorage.removeItem('spaceBindings'); // Correct case from 'space_bindings' which might be wrong
  
  // Clear session storage as well
  sessionStorage.clear();

  /* 2. Se houver backend: endpoint opcional */
  // await api.delete('/admin/demo-data');   // descomente quando existir

  /* 3. Limpa cache React-Query para refletir imediatamente */
  queryClient.clear();
  
  console.log('All demo data has been cleared successfully');
}
