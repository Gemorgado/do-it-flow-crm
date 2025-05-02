
import { FormItem, FormLabel, FormMessage, FormControl } from "@/components/ui/form";
import { Combobox, ComboboxOption } from "@/components/ui/combobox";
import { useClients } from "@/hooks/useClients";
import { useClientActiveContract } from "@/hooks/useClients";
import { Badge } from "@/components/ui/badge";
import { User, BriefcaseBusiness, Phone } from "lucide-react";
import { Controller } from "react-hook-form";
import { UseFormReturn } from "react-hook-form";
import { useState } from "react";

interface ClientSelectProps {
  form: UseFormReturn<any>;
}

export function ClientSelect({ form }: ClientSelectProps) {
  const { data: clients = [] } = useClients();
  const [selectedClient, setSelectedClient] = useState<ComboboxOption | null>(null);
  const { data: activeContract } = useClientActiveContract(selectedClient?.id || null);
  const [query, setQuery] = useState("");
  
  const handleClientSelect = (client: ComboboxOption) => {
    setSelectedClient(client);
    form.setValue("clientId", client.id, { shouldValidate: true });
  };

  return (
    <FormItem className="space-y-3">
      <FormLabel>Cliente</FormLabel>
      <FormControl>
        <Combobox
          options={clients.map(client => ({ id: client.id, name: client.name }))}
          selected={selectedClient}
          onSelect={handleClientSelect}
          getOptionLabel={(client) => client.name}
          placeholder="Selecione o cliente"
          searchPlaceholder="Buscar cliente..."
          emptyMessage="Nenhum cliente encontrado"
          query={query}
          onQueryChange={setQuery}
        />
      </FormControl>
      <FormMessage />

      {!selectedClient && form.formState.errors.clientId && (
        <p className="text-xs text-destructive">
          É necessário selecionar um cliente
        </p>
      )}

      {selectedClient && (
        <div className="mt-2 p-3 bg-zinc-50 rounded-md border border-zinc-200">
          <div className="flex items-center gap-2 mb-2">
            <User className="h-4 w-4 text-zinc-500" />
            <h4 className="font-medium">{selectedClient.name}</h4>
            <Badge variant="outline" className="ml-auto">
              {clients.find(c => c.id === selectedClient.id)?.status || "Cliente"}
            </Badge>
          </div>
          
          <div className="space-y-1 text-sm text-zinc-600">
            {clients.find(c => c.id === selectedClient.id)?.company && (
              <div className="flex items-center gap-2">
                <BriefcaseBusiness className="h-4 w-4 text-zinc-400" />
                <span>{clients.find(c => c.id === selectedClient.id)?.company}</span>
              </div>
            )}
            
            {clients.find(c => c.id === selectedClient.id)?.phone && (
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-zinc-400" />
                <span>{clients.find(c => c.id === selectedClient.id)?.phone}</span>
              </div>
            )}
            
            {activeContract && (
              <div className="mt-2 pt-2 border-t border-zinc-200">
                <span className="text-xs font-medium text-zinc-500">Contrato Ativo:</span>
                <p className="text-sm">{activeContract.description}</p>
              </div>
            )}
          </div>
        </div>
      )}
    </FormItem>
  );
}
