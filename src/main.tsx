
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import './styles/overlays.css'
import './styles/fix-ghost.css' // Add this import last to override any opacity issues
import { trackMetaPixelEvent } from './utils/metaPixelUtils.ts'
import { SnapshotProvider } from './contexts/SnapshotProvider.tsx'
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClient } from './lib/queryClient.ts'

// ⚠️ Safeguards for libraries
if (import.meta.env.DEV) {
  // Fix for cmdk issues with null references
  import('cmdk').then((cmdk) => {
    if (cmdk && cmdk.Command && cmdk.Command.prototype) {
      const origComponentDidMount = cmdk.Command.prototype.componentDidMount;
      cmdk.Command.prototype.componentDidMount = function() {
        if (this.rootRef && this.rootRef.current) {
          origComponentDidMount.call(this);
        }
      };
    }
  }).catch(e => console.error("Error setting up cmdk safeguard:", e));
  
  // Warning code for Select.Item
  import('@radix-ui/react-select').then((radix) => {
    if (radix) {
      const OrigItem = radix.Item;
      // Use a safer approach to replace the component
      if (OrigItem) {
        radix.Item = function(props) {
          if (!props?.value || props.value === '') {
            console.error('🛑 <Select.Item> sem value:', props.children);
            // Removed debugger statement
          }
          return OrigItem(props);
        };
      }
    }
  }).catch(e => console.error("Error setting up radix safeguard:", e));
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
