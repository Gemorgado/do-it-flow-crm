
import { queryClient } from '@/lib/queryClient';
import { toast } from '@/hooks/use-toast';
import { resetPipelineDemo } from './resetPipelineDemo';

export async function resetDemoData() {
  /* First, reset pipeline data */
  await resetPipelineDemo();
  
  /* 1. LocalStorage / IndexedDB (MockAdapter) */
  const keys = [
    'clients', 'contracts', 
    'conexa_snapshot', 'space_bindings', 'import_templates',
    'mockClients', 'mockContacts', 'customers',
    'clients_data', 'crm_data', 'user_preferences'
  ];
  
  // Remove all items from localStorage
  keys.forEach(k => localStorage.removeItem(k));
  
  // Clear specific items that might be named differently
  localStorage.removeItem('mockClients');
  localStorage.removeItem('mockContacts');
  localStorage.removeItem('spaceBindings'); // Correct case from 'space_bindings' which might be wrong
  
  // Clear session storage as well
  sessionStorage.clear();

  /* 2. Se houver backend: endpoint opcional */
  // await api.delete('/admin/demo-data');   // descomente quando existir

  /* 3. Limpa cache React-Query para refletir imediatamente */
  queryClient.clear();
  
  // Invalida especificamente as queries relacionadas aos dados que estamos limpando
  queryClient.invalidateQueries({ queryKey: ['clients'] });
  queryClient.invalidateQueries({ queryKey: ['contacts'] });
  queryClient.invalidateQueries({ queryKey: ['contracts'] });
  queryClient.invalidateQueries({ queryKey: ['proposals'] });
  
  console.log('All demo data has been cleared successfully');
}
