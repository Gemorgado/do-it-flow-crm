
import React from 'react';
import { Control } from 'react-hook-form';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

interface FollowUpSectionProps {
  control: Control<any>;
}

export function FollowUpSection({ control }: FollowUpSectionProps) {
  return (
    <div className="border-t border-gray-200 pt-4">
      <h4 className="text-sm font-medium mb-2">Acompanhamento (opcional)</h4>
      
      <FormField
        control={control}
        name="followUpAt"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Data e Hora do Follow-up</FormLabel>
            <FormControl>
              <Input type="datetime-local" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormField
        control={control}
        name="followUpNote"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Observação</FormLabel>
            <FormControl>
              <Textarea 
                placeholder="Informações adicionais para o acompanhamento..."
                className="min-h-[80px]"
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}
