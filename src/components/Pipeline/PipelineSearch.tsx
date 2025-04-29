
import { Search, Filter } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface PipelineSearchProps {
  onSearch: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onFilterByUser: (userId: string) => void;
}

export function PipelineSearch({ onSearch, onFilterByUser }: PipelineSearchProps) {
  return (
    <div className="flex flex-col sm:flex-row justify-between gap-4">
      <div className="flex flex-1 gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Buscar leads..."
            className="pl-9"
            onChange={onSearch}
          />
        </div>
        
        <Button variant="outline" className="gap-2">
          <Filter className="h-4 w-4" /> Filtros
        </Button>
      </div>
      
      <div className="flex gap-3">
        <Select 
          defaultValue="atribuido" 
          onValueChange={onFilterByUser}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Atribuído a" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="atribuido">Todos</SelectItem>
            <SelectItem value="1">Amanda Silva</SelectItem>
            <SelectItem value="2">Ricardo Barros</SelectItem>
            <SelectItem value="3">Camila Costa</SelectItem>
          </SelectContent>
        </Select>
        
        <Select defaultValue="criacao">
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Ordenar por" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="criacao">Data de criação</SelectItem>
            <SelectItem value="atualizacao">Última atualização</SelectItem>
            <SelectItem value="valor">Valor da proposta</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
