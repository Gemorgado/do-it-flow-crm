
import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Check } from "lucide-react";
import { Client } from "@/types";

interface SpaceBinderClientProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  filteredClients: Client[];
  selectedClientId: string | null;
  setSelectedClientId: (id: string | null) => void;
}

export function SpaceBinderClient({
  searchQuery,
  setSearchQuery,
  filteredClients,
  selectedClientId,
  setSelectedClientId,
}: SpaceBinderClientProps) {
  return (
    <div>
      <Label htmlFor="clientSearch">Cliente</Label>
      <Input
        id="clientSearch"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        placeholder="Buscar cliente..."
        className="mt-1"
      />
      
      <ScrollArea className="h-40 mt-2 border rounded-md">
        <div className="p-1">
          {filteredClients.length === 0 ? (
            <p className="text-sm text-gray-500 p-2">Nenhum cliente encontrado</p>
          ) : (
            filteredClients.map(client => (
              <Button
                key={client.id}
                variant={selectedClientId === client.id ? "secondary" : "ghost"}
                className="w-full justify-start py-2 px-2 h-auto my-1"
                onClick={() => {
                  setSelectedClientId(client.id);
                }}
              >
                <div className="flex items-center">
                  {selectedClientId === client.id && (
                    <Check className="w-4 h-4 mr-2" />
                  )}
                  <div className="text-left">
                    <div>{client.name}</div>
                    {client.company && (
                      <div className="text-xs text-gray-500">{client.company}</div>
                    )}
                  </div>
                </div>
              </Button>
            ))
          )}
        </div>
      </ScrollArea>
    </div>
  );
}
