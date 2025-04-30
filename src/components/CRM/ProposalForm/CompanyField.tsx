
import React, { useState } from 'react';
import { Control, Controller } from 'react-hook-form';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { useCompanySearch } from '@/api/companies';
import { Combobox } from '@/components/ui/combobox';
import { Company } from '@/types/proposal';

interface CompanyFieldProps {
  control: Control<any>;
}

export function CompanyField({ control }: CompanyFieldProps) {
  const [query, setQuery] = useState('');
  const { data: companies = [] } = useCompanySearch(query);

  return (
    <FormField
      control={control}
      name="companyId"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Empresa / Cliente</FormLabel>
          <FormControl>
            <Combobox
              placeholder="Selecione uma empresa"
              searchPlaceholder="Buscar empresa..."
              options={companies}
              selected={field.value ? companies.find(c => c.id === field.value) || null : null}
              onSelect={(company: Company) => field.onChange(company.id)}
              onSearch={setQuery}
              getOptionLabel={(company: Company) => company.name}
              emptyMessage="Nenhuma empresa encontrada."
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
