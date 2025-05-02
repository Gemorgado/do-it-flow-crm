
import { FormItem, FormLabel } from "@/components/ui/form";
import { Combobox, ComboboxOption } from "@/components/ui/combobox";
import { useClients } from "@/hooks/useClients";

interface ClientSelectProps {
  selectedClient: ComboboxOption | null;
  onSelectClient: (client: ComboboxOption) => void;
}

export function ClientSelect({ selectedClient, onSelectClient }: ClientSelectProps) {
  const { data: clients = [] } = useClients();
  
  return (
    <FormItem>
      <FormLabel>Cliente</FormLabel>
      <Combobox
        options={clients.map(client => ({ id: client.id, name: client.name }))}
        selected={selectedClient}
        onSelect={onSelectClient}
        getOptionLabel={(client) => client.name}
        placeholder="Selecione o cliente"
        searchPlaceholder="Buscar cliente..."
        emptyMessage="Nenhum cliente encontrado"
      />
      {!selectedClient && (
        <p className="text-xs text-orange-600 mt-1">
          É necessário selecionar um cliente
        </p>
      )}
    </FormItem>
  );
}
