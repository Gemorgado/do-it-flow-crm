
import { useState, useEffect } from 'react';
import { Integration } from "@/types/integration";
import { integrationCatalog } from '@/integrations/catalog/integrations';

export function useIntegrations() {
  const [integrations, setIntegrations] = useState<Integration[]>([]);
  
  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem('integrations') ?? '[]');
    const merged = integrationCatalog.map((item) =>
      stored.find((s: Integration) => s.id === item.id) ?? item
    );
    setIntegrations(merged);
  }, []);
  
  return integrations;
}

export function connectIntegration(id: string, payload: Partial<Integration> = {}) {
  const list: Integration[] = JSON.parse(localStorage.getItem('integrations') ?? '[]');
  const idx = list.findIndex((i: Integration) => i.id === id);
  
  if (idx >= 0) {
    list[idx] = { 
      ...list[idx], 
      status: 'connected', 
      connectedAt: new Date().toISOString(), 
      ...payload 
    };
  } else {
    const catalogItem = integrationCatalog.find(i => i.id === id);
    if (catalogItem) {
      list.push({ 
        ...catalogItem,
        status: 'connected', 
        connectedAt: new Date().toISOString(), 
        ...payload 
      });
    }
  }
  
  localStorage.setItem('integrations', JSON.stringify(list));
  // Force a page refresh to show updated integration status
  window.location.reload();
}

export function disconnectIntegration(id: string) {
  const list: Integration[] = JSON.parse(localStorage.getItem('integrations') ?? '[]');
  const idx = list.findIndex((i: Integration) => i.id === id);
  
  if (idx >= 0) {
    list[idx] = { 
      ...list[idx], 
      status: 'disconnected', 
      connectedAt: undefined
    };
    localStorage.setItem('integrations', JSON.stringify(list));
  }
  
  // Force a page refresh to show updated integration status
  window.location.reload();
}
