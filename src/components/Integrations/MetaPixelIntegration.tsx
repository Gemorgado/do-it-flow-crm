
import { PixelHeader } from './MetaPixel/PixelHeader';
import { PixelConfigCard } from './MetaPixel/PixelConfigCard';
import { EventsList } from './MetaPixel/EventsList';
import { PixelActions } from './MetaPixel/PixelActions';
import { usePixelIntegration } from '@/hooks/usePixelIntegration';

export function MetaPixelIntegration() {
  const { pixelId, setPixelId, isEnabled, setIsEnabled, events } = usePixelIntegration();
  
  return (
    <div className="space-y-6">
      <PixelHeader isEnabled={isEnabled} setIsEnabled={setIsEnabled} />
      <PixelConfigCard pixelId={pixelId} setPixelId={setPixelId} />
      <EventsList events={events} />
      <PixelActions />
    </div>
  );
}
