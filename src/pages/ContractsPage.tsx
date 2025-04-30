
import { useContracts, useCustomers, useServices } from "@/hooks/conexaData";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export default function ContractsPage() {
  const contracts = useContracts();
  const customers = useCustomers();
  const services = useServices();
  
  // Create a lookup map for customer names and service labels
  const customerMap = Object.fromEntries(customers.map(c => [c.id, c.name]));
  const serviceMap = Object.fromEntries(services.map(s => [s.id, s.label]));
  
  return (
    <div className="animate-fade-in space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Contratos</h1>
        <p className="text-gray-500">Contratos ativos e encerrados</p>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Lista de Contratos</CardTitle>
        </CardHeader>
        <CardContent>
          {contracts.length === 0 ? (
            <div className="text-center p-4 text-gray-500">
              Nenhum contrato encontrado. Importe dados pelo módulo Conexa.
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Cliente</TableHead>
                  <TableHead>Serviço</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Valor</TableHead>
                  <TableHead>Início</TableHead>
                  <TableHead>Término</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {contracts.map((contract) => (
                  <TableRow key={contract.id}>
                    <TableCell>{customerMap[contract.customerId] || contract.customerId}</TableCell>
                    <TableCell>{serviceMap[contract.serviceId] || contract.serviceId}</TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 rounded text-xs ${contract.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                        {contract.status === 'active' ? 'Ativo' : 'Encerrado'}
                      </span>
                    </TableCell>
                    <TableCell>R$ {contract.amount.toFixed(2)}</TableCell>
                    <TableCell>{new Date(contract.startDate).toLocaleDateString()}</TableCell>
                    <TableCell>{contract.endDate ? new Date(contract.endDate).toLocaleDateString() : '-'}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
