
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
  
  // Warning code for Select.Item - With safer TypeScript approach
  import('@radix-ui/react-select').then((radix) => {
    try {
      // Use type assertion to help TypeScript understand our intentions
      const SelectModule = radix as any;
      
      // Check if Item exists and can be modified
      if (SelectModule && SelectModule.Item) {
        const OrigItem = SelectModule.Item;
        
        // Create a wrapped version of the component that adds our validation
        const WrappedItem = React.forwardRef((props: any, ref: any) => {
          // Log warning for items without value
          if (!props?.value || props.value === '') {
            console.error('🛑 <Select.Item> sem value:', props.children);
          }
          
          // Render the original component with all props
          return React.createElement(OrigItem, { ...props, ref });
        });
        
        // Copy over any static properties from the original component
        if (OrigItem) {
          Object.assign(WrappedItem, OrigItem);
        }
        
        // Replace the original Item with our wrapped version
        SelectModule.Item = WrappedItem;
      }
    } catch (error) {
      console.error("Error setting up radix select safeguard:", error);
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
