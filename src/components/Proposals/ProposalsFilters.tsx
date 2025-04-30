
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Filter, Search } from "lucide-react";

interface ProposalsFiltersProps {
  searchTerm: string;
  statusFilter: string;
  onSearchChange: (value: string) => void;
  onStatusChange: (value: string) => void;
}

export function ProposalsFilters({ 
  searchTerm, 
  statusFilter, 
  onSearchChange, 
  onStatusChange 
}: ProposalsFiltersProps) {
  return (
    <div className="flex flex-col sm:flex-row justify-between gap-4">
      <div className="flex flex-1 gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Buscar propostas..."
            className="pl-9"
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>
        
        <select
          className="px-3 py-2 rounded-md border border-input bg-background"
          value={statusFilter}
          onChange={(e) => onStatusChange(e.target.value)}
        >
          <option value="todas">Todos os status</option>
          <option value="enviada">Enviadas</option>
          <option value="visualizada">Visualizadas</option>
          <option value="aceita">Aceitas</option>
          <option value="rejeitada">Rejeitadas</option>
          <option value="expirada">Expiradas</option>
          <option value="em_negociacao">Em Negociação</option>
        </select>
        
        <Button variant="outline" className="gap-2">
          <Filter className="h-4 w-4" /> Filtros Avançados
        </Button>
      </div>
    </div>
  );
}
