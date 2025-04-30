
import { Button } from "@/components/ui/button";

interface ContactFormFooterProps {
  type: "lead" | "client";
  onCancel?: () => void;
}

export function ContactFormFooter({ type, onCancel }: ContactFormFooterProps) {
  const isLead = type === "lead";
  
  return (
    <div className="flex justify-end space-x-2 pt-4">
      <Button
        type="button"
        variant="outline"
        onClick={onCancel}
      >
        Cancelar
      </Button>
      <Button 
        type="submit"
        className="bg-doIt-primary hover:bg-doIt-dark"
      >
        {isLead ? "Criar Lead" : "Criar Cliente"}
      </Button>
    </div>
  );
}
