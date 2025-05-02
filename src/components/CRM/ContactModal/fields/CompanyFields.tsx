
import React from "react";
import { UseFormReturn } from "react-hook-form";
import { ContactModalValues } from "@/schemas/contactFormSchemas";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { formatDocument } from "@/utils/documentUtils";

interface CompanyFieldsProps {
  form: UseFormReturn<ContactModalValues>;
}

export function CompanyFields({ form }: CompanyFieldsProps) {
  const handleIdNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formattedValue = formatDocument(e.target.value);
    form.setValue("idNumber", formattedValue);
  };
  
  return (
    <>
      <FormField
        control={form.control}
        name="companyOrPerson"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Company/Person*</FormLabel>
            <FormControl>
              <Input 
                placeholder="Company or person name" 
                {...field} 
                style={{ backgroundColor: "white", color: "#333" }}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="idNumber"
        render={({ field }) => (
          <FormItem>
            <FormLabel>CNPJ/CPF</FormLabel>
            <FormControl>
              <Input 
                placeholder="00.000.000/0000-00 or 000.000.000-00" 
                {...field}
                onChange={handleIdNumberChange}
                style={{ backgroundColor: "white", color: "#333" }}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );
}
