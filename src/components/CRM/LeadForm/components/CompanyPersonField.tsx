
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
import { AlertCircle } from "lucide-react";

export const CompanyPersonField = () => {
  const { control } = useFormContext<LeadFormValues>();
  
  return (
    <FormField
      control={control}
      name="companyOrPerson"
      render={({ field, fieldState }) => (
        <FormItem>
          <div className="flex items-center justify-between">
            <FormLabel>Empresa/Pessoa*</FormLabel>
            {fieldState.error && (
              <span className="text-xs text-destructive flex items-center gap-1">
                <AlertCircle className="h-3 w-3" />
                {fieldState.error.message}
              </span>
            )}
          </div>
          <FormControl>
            <Input 
              placeholder="Nome da empresa ou pessoa" 
              {...field} 
              className={cn(
                fieldState.error && "border-destructive focus-visible:ring-destructive"
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
