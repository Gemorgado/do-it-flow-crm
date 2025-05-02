
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
import { cn } from "@/lib/utils";
import { AlertCircle } from "lucide-react";

interface CompanyFieldsProps {
  form: UseFormReturn<ContactModalValues>;
  onIdNumberChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export function CompanyFields({ form, onIdNumberChange }: CompanyFieldsProps) {
  return (
    <>
      <FormField
        control={form.control}
        name="companyOrPerson"
        render={({ field, fieldState }) => (
          <FormItem>
            <div className="flex items-center justify-between">
              <FormLabel>Company/Person*</FormLabel>
              {fieldState.error && (
                <span className="text-xs text-destructive flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" />
                  {fieldState.error.message}
                </span>
              )}
            </div>
            <FormControl>
              <Input 
                placeholder="Company or person name" 
                {...field} 
                className={cn(
                  fieldState.error && "border-destructive focus-visible:ring-destructive"
                )}
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
        render={({ field, fieldState }) => (
          <FormItem>
            <div className="flex items-center justify-between">
              <FormLabel>CNPJ/CPF</FormLabel>
              {fieldState.error && (
                <span className="text-xs text-destructive flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" />
                  {fieldState.error.message}
                </span>
              )}
            </div>
            <FormControl>
              <Input 
                placeholder="00.000.000/0000-00 or 000.000.000-00" 
                {...field}
                onChange={onIdNumberChange}
                className={cn(
                  fieldState.error && "border-destructive focus-visible:ring-destructive"
                )}
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
