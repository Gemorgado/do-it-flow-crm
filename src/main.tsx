
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import './styles/overlays.css'
import { trackMetaPixelEvent } from './utils/metaPixelUtils.ts'
import { SnapshotProvider } from './contexts/SnapshotProvider.tsx'
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClient } from './lib/queryClient.ts'

// ⚠️ Safeguards for libraries
if (import.meta.env.DEV) {
  // Fix for cmdk issues with null references
  import('cmdk').then((cmdk: any) => {
    const origComponentDidMount = cmdk.Command.prototype.componentDidMount;
    cmdk.Command.prototype.componentDidMount = function() {
      if (this.rootRef?.current) {
        origComponentDidMount.call(this);
      }
    };
  });
  
  // Original warning code for Select.Item
  import('@radix-ui/react-select').then((radix: any) => {
    const OrigItem = radix.Item;
    // cast para any → não reclama de $$typeof
    radix.Item = ((props: any) => {
      if (!props?.value || props.value === '') {
        // Mostra no console qual componente tentou renderizar
        console.error('🛑 <Select.Item> sem value:', props.children);
        debugger;                 // pausa no DevTools
      }
      return OrigItem(props);
    }) as any;                // 👈 elimina TS2741
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
