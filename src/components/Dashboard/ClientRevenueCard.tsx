
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp, ArrowUpRight, Users } from "lucide-react";
import { useState } from "react";

interface ClientRevenue {
  name: string;
  company: string;
  monthlyRevenue: number;
  renewalDate: string;
  status: 'ativo' | 'risco' | 'pendente';
}

interface ClientRevenueCardProps {
  title: string;
  clients: ClientRevenue[];
  totalRevenue: number;
  projectedRevenue: number;
  className?: string;
}

export function ClientRevenueCard({ title, clients, totalRevenue, projectedRevenue, className }: ClientRevenueCardProps) {
  const [sortField, setSortField] = useState<'name' | 'revenue'>('revenue');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  
  const handleSort = (field: 'name' | 'revenue') => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };
  
  const sortedClients = [...clients].sort((a, b) => {
    if (sortField === 'name') {
      return sortDirection === 'asc' 
        ? a.name.localeCompare(b.name) 
        : b.name.localeCompare(a.name);
    } else {
      return sortDirection === 'asc' 
        ? a.monthlyRevenue - b.monthlyRevenue 
        : b.monthlyRevenue - a.monthlyRevenue;
    }
  });
  
  return (
    <Card className={className}>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-md font-medium">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="text-sm text-muted-foreground mb-1">Receita Mensal</div>
            <div className="text-2xl font-bold">R$ {totalRevenue.toLocaleString()}</div>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="text-sm text-muted-foreground mb-1">Projeção 12 meses</div>
            <div className="flex items-center">
              <span className="text-2xl font-bold">R$ {projectedRevenue.toLocaleString()}</span>
              <span className="text-green-600 ml-2 flex items-center text-xs">
                <ArrowUpRight size={14} />
                8.5%
              </span>
            </div>
          </div>
        </div>
        
        <div className="rounded-md border overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="cursor-pointer" onClick={() => handleSort('name')}>
                  <div className="flex items-center">
                    Cliente
                    {sortField === 'name' && (
                      sortDirection === 'asc' ? <ChevronUp size={16} /> : <ChevronDown size={16} />
                    )}
                  </div>
                </TableHead>
                <TableHead className="cursor-pointer text-right" onClick={() => handleSort('revenue')}>
                  <div className="flex items-center justify-end">
                    Receita Mensal
                    {sortField === 'revenue' && (
                      sortDirection === 'asc' ? <ChevronUp size={16} /> : <ChevronDown size={16} />
                    )}
                  </div>
                </TableHead>
                <TableHead className="text-right">Renovação</TableHead>
                <TableHead className="text-right">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedClients.slice(0, 5).map((client, index) => (
                <TableRow key={index}>
                  <TableCell>
                    <div>
                      <div className="font-medium">{client.name}</div>
                      <div className="text-xs text-muted-foreground">{client.company}</div>
                    </div>
                  </TableCell>
                  <TableCell className="text-right font-medium">
                    R$ {client.monthlyRevenue.toLocaleString()}
                  </TableCell>
                  <TableCell className="text-right">
                    {new Date(client.renewalDate).toLocaleDateString('pt-BR')}
                  </TableCell>
                  <TableCell className="text-right">
                    <span className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold
                      ${client.status === 'ativo' ? 'bg-green-100 text-green-800' : 
                       client.status === 'risco' ? 'bg-amber-100 text-amber-800' : 
                       'bg-gray-100 text-gray-800'}`}>
                      {client.status === 'ativo' ? 'Ativo' : 
                       client.status === 'risco' ? 'Renovação em risco' : 'Pendente'}
                    </span>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        
        <div className="mt-4 flex justify-end">
          <Button variant="outline" size="sm">
            <Users className="mr-2 h-4 w-4" />
            Ver todos os clientes
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
