
import { useState } from 'react';

export interface PixelEvent {
  name: string;
  description: string;
  tracked: number;
  custom?: boolean;
}

export function usePixelIntegration() {
  const [pixelId, setPixelId] = useState('123456789012345');
  const [isEnabled, setIsEnabled] = useState(true);
  
  const events: PixelEvent[] = [
    { name: 'PageView', description: 'Visualização de páginas', tracked: 256 },
    { name: 'Lead', description: 'Novos leads capturados', tracked: 48 },
    { name: 'new_lead_button_click', description: 'Clique em Novo Lead', tracked: 76, custom: true },
    { name: 'CompleteRegistration', description: 'Registros completos', tracked: 32 }
  ];
  
  return {
    pixelId,
    setPixelId,
    isEnabled,
    setIsEnabled,
    events
  };
}
