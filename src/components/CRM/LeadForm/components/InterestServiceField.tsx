
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
import { cn } from "@/lib/utils";
import { LeadFormValues } from "@/types/crm";

export const InterestServiceField = () => {
  const { control } = useFormContext<LeadFormValues>();
  
  return (
    <FormField
      control={control}
      name="interestService"
      render={({ field, fieldState }) => (
        <FormItem>
          <FormLabel>Serviço de Interesse*</FormLabel>
          <FormControl>
            <Input 
              placeholder="Descreva o serviço" 
              {...field} 
              className={cn(
                fieldState.error && "border-red-500"
              )}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};
