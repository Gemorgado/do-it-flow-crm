
import React from 'react';
import { Control } from 'react-hook-form';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';

interface AmountFieldProps {
  control: Control<any>;
  formatCurrency: (value: number) => string;
}

export function AmountField({ control, formatCurrency }: AmountFieldProps) {
  return (
    <FormField
      control={control}
      name="amount"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Valor da Proposta</FormLabel>
          <FormControl>
            <Input
              type="number"
              step="0.01"
              min="0"
              onChange={(e) => field.onChange(parseFloat(e.target.value))}
              value={field.value}
            />
          </FormControl>
          <div className="text-xs text-gray-500">
            {formatCurrency(field.value)}
          </div>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
