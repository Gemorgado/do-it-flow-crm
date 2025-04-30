
import React, { useState } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import type { ColumnMapping as ColumnMappingType } from '@/hooks/useConexaMapper';

interface ColumnMappingProps {
  headers: string[];
  rows: Record<string, any>[];
  mapping: ColumnMappingType;
  onMappingChange: (field: string, value: string | null) => void;
  requiredFields: string[];
}

export function ColumnMapping({
  headers,
  rows,
  mapping,
  onMappingChange,
  requiredFields
}: ColumnMappingProps) {
  const [previewRows, setPreviewRows] = useState<number>(5);
  
  const fieldLabels = {
    name: "Nome do Cliente",
    docNumber: "CNPJ/CPF",
    email: "E-mail",
    phone: "Telefone",
    serviceType: "Tipo de Serviço",
    roomNumber: "Número da Sala",
    status: "Status do Contrato"
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-6">
        {Object.entries(fieldLabels).map(([field, label]) => (
          <div key={field} className="space-y-1">
            <label className="text-sm font-medium flex items-center">
              {label} 
              {requiredFields.includes(field) && (
                <span className="text-red-500 ml-1">*</span>
              )}
            </label>
            <Select
              value={mapping[field as keyof ColumnMappingType] || ""}
              onValueChange={value => onMappingChange(field, value === "" ? null : value)}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Selecione a coluna" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="nao_mapear">Não mapear</SelectItem>
                {headers.map(header => (
                  <SelectItem key={header} value={header}>{header}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        ))}
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-medium">Pré-visualização dos dados</h3>
        <div className="border rounded overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                {headers.map(header => (
                  <TableHead key={header} className="whitespace-nowrap">
                    {header}
                    {Object.entries(mapping).map(([field, mappedHeader]) => 
                      mappedHeader === header ? (
                        <span key={field} className="ml-2 text-xs font-normal text-primary">
                          ({field})
                        </span>
                      ) : null
                    )}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.slice(0, previewRows).map((row, index) => (
                <TableRow key={index}>
                  {headers.map(header => (
                    <TableCell key={`${index}-${header}`} className="whitespace-nowrap truncate max-w-[200px]">
                      {String(row[header] || '')}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        <div className="flex justify-end">
          <Button 
            variant="outline"
            onClick={() => setPreviewRows(prev => prev === 5 ? 10 : 5)}
          >
            {previewRows === 5 ? "Mostrar mais linhas" : "Mostrar menos linhas"}
          </Button>
        </div>
      </div>
    </div>
  );
}
