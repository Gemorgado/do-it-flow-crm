
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
          <FormLabel>CNPJ/CPF*</FormLabel>
          <FormControl>
            <Input 
              placeholder="00.000.000/0000-00 ou 000.000.000-00" 
              {...field}
              onChange={handleIdNumberChange}
              className={cn(
                fieldState.error && "border-red-500"
              )}
            />
          </FormControl>
          <FormMessage />
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
