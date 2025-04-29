
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { FiscalAddressContract } from "../types";
import { getDaysRemaining } from "../addressUtils";

interface ExpiringTableProps {
  contracts: FiscalAddressContract[];
}

export const ExpiringTable: React.FC<ExpiringTableProps> = ({ contracts }) => {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-md font-medium">Próximas Renovações (≤ 90 dias)</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nº do Contrato</TableHead>
              <TableHead>Cliente</TableHead>
              <TableHead>Ciclo</TableHead>
              <TableHead>Vencimento</TableHead>
              <TableHead>Dias Faltantes</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {contracts.length > 0 ? (
              contracts.map((contract) => (
                <TableRow key={contract.contractNo}>
                  <TableCell className="font-medium">{contract.contractNo}</TableCell>
                  <TableCell>{contract.customerName}</TableCell>
                  <TableCell>
                    <Badge variant={contract.cycle === 'annual' ? 'default' : 'secondary'}>
                      {contract.cycle === 'annual' ? 'Anual' : 'Semestral'}
                    </Badge>
                  </TableCell>
                  <TableCell>{contract.endDate}</TableCell>
                  <TableCell>
                    <Badge variant="outline">
                      {getDaysRemaining(contract.endDate)} dias
                    </Badge>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="text-center">
                  Nenhum contrato a vencer nos próximos 90 dias.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};
