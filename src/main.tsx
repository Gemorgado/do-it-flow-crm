
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import './styles/overlays.css'
import { trackMetaPixelEvent } from './utils/metaPixelUtils.ts'
import { SnapshotProvider } from './contexts/SnapshotProvider.tsx'
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClient } from './lib/queryClient.ts'

// ⚠️ Remova depois de corrigir
if (import.meta.env.DEV) {
  import('@radix-ui/react-select').then((radix) => {
    const OrigItem = radix.Item;
    radix.Item = (props: any) => {
      if (!props?.value || props.value === '') {
        // Mostra no console qual componente tentou renderizar
        console.error('🛑 <Select.Item> sem value:', props.children);
        debugger;                 // pausa no DevTools
      }
      return OrigItem(props);
    };
  });
}

// Rastrear evento de visualização da página ao carregar o aplicativo
document.addEventListener('DOMContentLoaded', () => {
  trackMetaPixelEvent('PageView', {
    page_title: document.title,
    page_location: window.location.href,
    page_path: window.location.pathname
  });
});

createRoot(document.getElementById("root")!).render(
  <QueryClientProvider client={queryClient}>
    <SnapshotProvider>
      <App />
    </SnapshotProvider>
  </QueryClientProvider>
);
