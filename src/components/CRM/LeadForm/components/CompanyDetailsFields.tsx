
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
import { cn } from "@/lib/utils";
import { AlertCircle } from "lucide-react";

export const CompanyDetailsFields = () => {
  const { control } = useFormContext<LeadFormValues>();
  
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <FormField
        control={control}
        name="employees"
        render={({ field, fieldState }) => (
          <FormItem>
            <div className="flex items-center justify-between">
              <FormLabel>Número de Funcionários</FormLabel>
              {fieldState.error && (
                <span className="text-xs text-destructive flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" />
                  {fieldState.error.message}
                </span>
              )}
            </div>
            <FormControl>
              <Input 
                type="number" 
                placeholder="0" 
                {...field}
                onChange={(e) => field.onChange(e.target.value === "" ? undefined : Number(e.target.value))}
                className={cn(
                  fieldState.error && "border-destructive focus-visible:ring-destructive",
                  "w-full"
                )}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="annualRevenue"
        render={({ field, fieldState }) => (
          <FormItem>
            <div className="flex items-center justify-between">
              <FormLabel>Faturamento Anual</FormLabel>
              {fieldState.error && (
                <span className="text-xs text-destructive flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" />
                  {fieldState.error.message}
                </span>
              )}
            </div>
            <FormControl>
              <Input 
                type="number" 
                placeholder="0" 
                {...field}
                onChange={(e) => field.onChange(e.target.value === "" ? undefined : Number(e.target.value))}
                className={cn(
                  fieldState.error && "border-destructive focus-visible:ring-destructive",
                  "w-full"
                )}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};
