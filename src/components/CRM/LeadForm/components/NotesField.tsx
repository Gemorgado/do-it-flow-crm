
import React from "react";
import { useFormContext } from "react-hook-form";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { LeadFormValues } from "@/types/crm";

export const NotesField = () => {
  const { control } = useFormContext<LeadFormValues>();
  
  return (
    <FormField
      control={control}
      name="notes"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Notas adicionais</FormLabel>
          <FormControl>
            <Textarea 
              className="min-h-[80px]"
              placeholder="Informações adicionais sobre o lead..."
              {...field}
            />
          </FormControl>
        </FormItem>
      )}
    />
  );
};
