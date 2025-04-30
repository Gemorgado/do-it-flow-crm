
import React from 'react';
import { Control } from 'react-hook-form';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

// Mock company options (in real app, this would come from an API)
const companyOptions = [
  { id: 'comp-1', name: 'Empresa ABC Ltda' },
  { id: 'comp-2', name: 'Tech Solutions S.A.' },
  { id: 'comp-3', name: 'Consultoria XYZ' },
];

interface CompanyFieldProps {
  control: Control<any>;
}

export function CompanyField({ control }: CompanyFieldProps) {
  return (
    <FormField
      control={control}
      name="companyId"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Empresa / Cliente</FormLabel>
          <Select 
            onValueChange={field.onChange} 
            defaultValue={field.value}
          >
            <FormControl>
              <SelectTrigger>
                <SelectValue placeholder="Selecione uma empresa" />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              {companyOptions.map((company) => (
                <SelectItem key={company.id} value={company.id}>
                  {company.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
