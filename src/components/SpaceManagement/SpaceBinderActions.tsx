
import React from "react";
import { Button } from "@/components/ui/button";
import { Check, Trash, X } from "lucide-react";
import { UseMutationResult } from "@tanstack/react-query";
import { DialogFooter } from "@/components/ui/dialog";
import { SpaceBinding } from "@/types";

interface SpaceBinderActionsProps {
  existingBinding: SpaceBinding | null;
  onClose: () => void;
  handleSave: () => void;
  handleUnbind: () => void;
  bindSpace: UseMutationResult<any, Error, SpaceBinding>;
  unbindSpace: UseMutationResult<any, Error, string>;
  canSave: boolean;
}

export function SpaceBinderActions({
  existingBinding,
  onClose,
  handleSave,
  handleUnbind,
  bindSpace,
  unbindSpace,
  canSave
}: SpaceBinderActionsProps) {
  return (
    <DialogFooter className="flex justify-between sm:justify-between">
      <div className="space-x-2">
        {existingBinding && (
          <Button
            variant="destructive"
            size="sm"
            onClick={handleUnbind}
            disabled={unbindSpace.isPending}
          >
            <Trash className="w-4 h-4 mr-2" />
            Desvincular
          </Button>
        )}
      </div>
      
      <div className="space-x-2">
        <Button
          variant="outline"
          size="sm"
          onClick={onClose}
        >
          <X className="w-4 h-4 mr-2" />
          Cancelar
        </Button>
        
        <Button
          size="sm"
          onClick={handleSave}
          disabled={!canSave || bindSpace.isPending}
        >
          <Check className="w-4 h-4 mr-2" />
          Salvar
        </Button>
      </div>
    </DialogFooter>
  );
}
