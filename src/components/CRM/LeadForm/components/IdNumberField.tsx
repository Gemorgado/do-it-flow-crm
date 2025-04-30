
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
import { formatDocument } from "@/utils/documentUtils";
import { AlertCircle } from "lucide-react";

export const IdNumberField = () => {
  const { control, setValue, formState } = useFormContext<LeadFormValues>();
  
  const handleIdNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formattedValue = formatDocument(e.target.value);
    setValue("idNumber", formattedValue, { 
      shouldValidate: true,
      shouldDirty: true 
    });
  };
  
  return (
    <FormField
      control={control}
      name="idNumber"
      render={({ field, fieldState }) => (
        <FormItem>
          <div className="flex items-center justify-between">
            <FormLabel>CNPJ/CPF*</FormLabel>
            {fieldState.error && (
              <span className="text-xs text-destructive flex items-center gap-1">
                <AlertCircle className="h-3 w-3" />
                {fieldState.error.message}
              </span>
            )}
          </div>
          <FormControl>
            <Input 
              placeholder="00.000.000/0000-00 ou 000.000.000-00" 
              {...field}
              onChange={handleIdNumberChange}
              className={cn(
                fieldState.error && "border-destructive focus-visible:ring-destructive"
              )}
              aria-invalid={!!fieldState.error}
              aria-describedby={fieldState.error ? `${field.name}-error` : undefined}
            />
          </FormControl>
          <FormMessage id={`${field.name}-error`} />
          {!fieldState.error && field.value && field.value.length > 11 && (
            <FormDescription>
              CNPJ com 14 dígitos
            </FormDescription>
          )}
          {!fieldState.error && field.value && field.value.length <= 11 && field.value.length > 0 && (
            <FormDescription>
              CPF com 11 dígitos
            </FormDescription>
          )}
        </FormItem>
      )}
    />
  );
};
