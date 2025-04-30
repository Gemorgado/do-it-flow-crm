
import React from 'react';
import { Button } from "@/components/ui/button";
import { Database, Loader } from "lucide-react";

interface ConexaSyncButtonProps {
  isLoading: boolean;
  onSync: () => Promise<void>;
}

export function ConexaSyncButton({ isLoading, onSync }: ConexaSyncButtonProps) {
  return (
    <Button 
      onClick={onSync} 
      disabled={isLoading}
      className="w-full"
    >
      {isLoading ? (
        <>
          <Loader className="mr-2 h-4 w-4 animate-spin" strokeWidth={1.5} />
          Sincronizando...
        </>
      ) : (
        <>
          <Database className="mr-2 h-4 w-4" strokeWidth={1.5} />
          Sincronizar Agora
        </>
      )}
    </Button>
  );
}
