
import React from 'react';
import { Control, Controller } from 'react-hook-form';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { SERVICE_OPTIONS } from '@/constants/serviceOptions';

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
          <FormControl>
            <Select 
              onValueChange={field.onChange} 
              defaultValue={field.value}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione o tipo de serviço" />
              </SelectTrigger>
              <SelectContent>
                {SERVICE_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
