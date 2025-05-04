
import React from "react";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

export interface FormButtonsProps {
  onCancel: () => void;
  isSubmitting: boolean;
  isEditMode?: boolean;
}

export function FormButtons({ onCancel, isSubmitting, isEditMode }: FormButtonsProps) {
  return (
    <div className="flex justify-end gap-2 pt-4 border-t">
      <Button 
        type="button" 
        variant="outline" 
        onClick={onCancel}
        disabled={isSubmitting}
      >
        Cancelar
      </Button>
      <Button 
        type="submit"
        disabled={isSubmitting}
      >
        {isSubmitting ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Salvando...
          </>
        ) : (
          isEditMode ? "Atualizar Lead" : "Criar Lead"
        )}
      </Button>
    </div>
  );
}
