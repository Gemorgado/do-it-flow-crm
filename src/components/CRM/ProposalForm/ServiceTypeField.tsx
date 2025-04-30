
import React from 'react';
import { Control } from 'react-hook-form';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ServiceType } from '@/types/proposal';

const serviceTypeOptions: { value: ServiceType; label: string }[] = [
  { value: 'endereços_fiscais', label: 'Endereços Fiscais' },
  { value: 'salas_privadas', label: 'Salas Privadas' },
  { value: 'coworking_flex', label: 'Coworking Flex' },
  { value: 'consultoria', label: 'Consultoria' },
  { value: 'outro', label: 'Outro' },
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
