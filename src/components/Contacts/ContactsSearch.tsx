
import React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Filter } from "lucide-react";

interface ContactsSearchProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
}

export function ContactsSearch({ searchTerm, onSearchChange }: ContactsSearchProps) {
  return (
    <div className="flex flex-col sm:flex-row justify-between gap-4">
      <div className="flex flex-1 gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Buscar contatos..."
            className="pl-9"
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>
        
        <Button variant="outline" className="gap-2">
          <Filter className="h-4 w-4" /> Filtros
        </Button>
      </div>
    </div>
  );
}
