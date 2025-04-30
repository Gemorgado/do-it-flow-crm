
import React from "react";
import { useFormContext } from "react-hook-form";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { LeadFormValues } from "@/types/crm";

export const CompanyDetailsFields = () => {
  const { control } = useFormContext<LeadFormValues>();
  
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <FormField
        control={control}
        name="employees"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Número de Funcionários</FormLabel>
            <FormControl>
              <Input 
                type="number" 
                placeholder="0" 
                {...field}
                onChange={(e) => field.onChange(e.target.value === "" ? undefined : Number(e.target.value))}
                className="w-full"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="annualRevenue"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Faturamento Anual</FormLabel>
            <FormControl>
              <Input 
                type="number" 
                placeholder="0" 
                {...field}
                onChange={(e) => field.onChange(e.target.value === "" ? undefined : Number(e.target.value))}
                className="w-full"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};
