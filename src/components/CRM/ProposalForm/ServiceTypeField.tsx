
import React from 'react';
import { Control } from 'react-hook-form';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ServiceType } from '@/types/proposal';

const serviceTypeOptions: { value: ServiceType; label: string }[] = [
  { value: 'endereco_fiscal', label: 'Endereço Fiscal' },
  { value: 'estacao_flex', label: 'Estação Flex' },
  { value: 'estacao_fixa', label: 'Estação Fixa' },
  { value: 'sala_privativa', label: 'Sala Privativa' },
  { value: 'sala_reuniao', label: 'Sala de Reunião' },
  { value: 'auditorio', label: 'Auditório' },
];

interface ServiceTypeFieldProps {
  control: Control<any>;
}

export function ServiceTypeField({ control }: ServiceTypeFieldProps) {
  return (
    <FormField
      control={control}
      name="serviceType"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Tipo de Serviço</FormLabel>
          <Select 
            onValueChange={field.onChange} 
            defaultValue={field.value}
          >
            <FormControl>
              <SelectTrigger>
                <SelectValue placeholder="Selecione o tipo de serviço" />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              {serviceTypeOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
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
