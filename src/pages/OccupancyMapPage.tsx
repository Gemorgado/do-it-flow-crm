
import { useTodayRoomOccupancy, useContracts } from "@/hooks/conexaData";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export default function OccupancyMapPage() {
  const todayOccupations = useTodayRoomOccupancy();
  const contracts = useContracts();
  
  // Create a lookup map for contract details
  const contractMap = Object.fromEntries(contracts.map(c => [c.id, c]));
  
  return (
    <div className="animate-fade-in space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Mapa de Ocupação</h1>
        <p className="text-gray-500">Ocupação de salas para hoje</p>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Salas Ocupadas Hoje</CardTitle>
        </CardHeader>
        <CardContent>
          {todayOccupations.length === 0 ? (
            <div className="text-center p-4 text-gray-500">
              Nenhuma ocupação registrada para hoje. Importe dados pelo módulo Conexa.
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID da Sala</TableHead>
                  <TableHead>ID do Contrato</TableHead>
                  <TableHead>Valor do Contrato</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {todayOccupations.map((occupation, index) => {
                  const contract = contractMap[occupation.contractId];
                  return (
                    <TableRow key={index}>
                      <TableCell>{occupation.roomId}</TableCell>
                      <TableCell>{occupation.contractId}</TableCell>
                      <TableCell>
                        {contract && contract.amount ? `R$ ${contract.amount.toFixed(2)}` : '-'}
                      </TableCell>
                      <TableCell>
                        {contract && contract.status && (
                          <span className={`px-2 py-1 rounded text-xs ${contract.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                            {contract.status === 'active' ? 'Ativo' : 'Encerrado'}
                          </span>
                        )}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
