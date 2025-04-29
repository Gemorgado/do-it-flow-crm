
import { Card } from "@/components/ui/card";
import { PixelIdConfiguration } from './PixelIdConfiguration';
import { PixelStatus } from './PixelStatus';

interface PixelConfigCardProps {
  pixelId: string;
  setPixelId: (id: string) => void;
}

export function PixelConfigCard({ pixelId, setPixelId }: PixelConfigCardProps) {
  return (
    <Card className="p-4">
      <div className="flex flex-col gap-4">
        <PixelIdConfiguration pixelId={pixelId} setPixelId={setPixelId} />
        <PixelStatus />
      </div>
    </Card>
  );
}
