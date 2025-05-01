
import React from "react";
import { Button } from "@/components/ui/button";

interface DialogActionsProps {
  isEditing: boolean;
  setIsEditing: (value: boolean) => void;
  handleSaveChanges: () => void;
  isSpaceAvailable: boolean;
  onAssignSpace?: () => void;
  isPending: boolean;
}

export function DialogActions({ 
  isEditing, 
  setIsEditing, 
  handleSaveChanges, 
  isSpaceAvailable,
  onAssignSpace,
  isPending
}: DialogActionsProps) {
  return (
    <div className="pt-2 flex justify-end space-x-2">
      {isEditing ? (
        <>
          <Button variant="outline" onClick={() => setIsEditing(false)}>
            Cancelar
          </Button>
          <Button onClick={handleSaveChanges} disabled={isPending}>
            Salvar Alterações
          </Button>
        </>
      ) : (
        <>
          <Button onClick={() => setIsEditing(true)}>
            Editar Informações
          </Button>
          {isSpaceAvailable && onAssignSpace && (
            <Button onClick={onAssignSpace}>
              Vincular a Cliente
            </Button>
          )}
        </>
      )}
    </div>
  );
}
