
import React from "react";
import { useFormContext } from "react-hook-form";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { LeadFormValues } from "@/types/crm";

export const CompanyPersonField = () => {
  const { control } = useFormContext<LeadFormValues>();
  
  return (
    <FormField
      control={control}
      name="companyOrPerson"
      render={({ field, fieldState }) => (
        <FormItem>
          <FormLabel>Empresa/Pessoa*</FormLabel>
          <FormControl>
            <Input 
              placeholder="Nome da empresa ou pessoa" 
              {...field} 
              className={cn(
                fieldState.error && "border-red-500"
              )}
            />
          </FormControl>
          <FormMessage />
          {!fieldState.error && (
            <FormDescription>
              Nome da empresa ou pessoa física para contato
            </FormDescription>
          )}
        </FormItem>
      )}
    />
  );
};
