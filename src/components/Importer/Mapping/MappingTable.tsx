
import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { InternalField } from '@/integrations/importer/types';
import { selectContentClass, selectItemClass } from '@/lib/radixClass';
import { FIELD_LABELS, REQUIRED_FIELDS } from '@/integrations/importer/fieldLabels';

interface MappingTableProps {
  headers: string[];
  previewRows: Record<string, any>[];
  mapping: Record<string, InternalField | ''>;
  onMappingChange: (header: string, field: InternalField | '') => void;
}

export function MappingTable({
  headers,
  previewRows,
  mapping,
  onMappingChange,
}: MappingTableProps) {
  return (
    <div className="border rounded-md">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-1/3">Coluna na Planilha</TableHead>
            <TableHead className="w-1/3">Campo no Sistema</TableHead>
            <TableHead className="w-1/3">Exemplo</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {headers.map(header => {
            const exampleValue = previewRows.length > 0 ? previewRows[0][header] : '';
            
            return (
              <TableRow key={header}>
                <TableCell>{header}</TableCell>
                <TableCell>
                  <Select
                    value={mapping[header] || ''}
                    onValueChange={(value) => {
                      onMappingChange(header, value as InternalField | '');
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione um campo" />
                    </SelectTrigger>
                    <SelectContent className={selectContentClass}>
                      <SelectItem className={selectItemClass} value="">Não mapear esta coluna</SelectItem>
                      {Object.entries(FIELD_LABELS).map(([field, label]) => (
                        <SelectItem 
                          key={field} 
                          value={field}
                          className={selectItemClass}
                        >
                          {label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </TableCell>
                <TableCell className="truncate max-w-xs">
                  {exampleValue ? String(exampleValue) : ''}
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
