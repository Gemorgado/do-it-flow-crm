
import { useState } from 'react';
import { Card } from "@/components/ui/card";
import { PixelHeader } from './MetaPixel/PixelHeader';
import { PixelIdConfiguration } from './MetaPixel/PixelIdConfiguration';
import { PixelStatus } from './MetaPixel/PixelStatus';
import { EventsList } from './MetaPixel/EventsList';
import { PixelActions } from './MetaPixel/PixelActions';

export function MetaPixelIntegration() {
  const [pixelId, setPixelId] = useState('123456789012345');
  const [isEnabled, setIsEnabled] = useState(true);
  
  const events = [
    { name: 'PageView', description: 'Visualização de páginas', tracked: 256 },
    { name: 'Lead', description: 'Novos leads capturados', tracked: 48 },
    { name: 'new_lead_button_click', description: 'Clique em Novo Lead', tracked: 76, custom: true },
    { name: 'CompleteRegistration', description: 'Registros completos', tracked: 32 }
  ];
  
  return (
    <div className="space-y-6">
      <PixelHeader isEnabled={isEnabled} setIsEnabled={setIsEnabled} />
      
      <Card className="p-4">
        <div className="flex flex-col gap-4">
          <PixelIdConfiguration pixelId={pixelId} setPixelId={setPixelId} />
          <PixelStatus />
        </div>
      </Card>

      <EventsList events={events} />
      
      <PixelActions />
    </div>
  );
}
