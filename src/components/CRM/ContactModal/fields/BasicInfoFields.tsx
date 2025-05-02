
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

interface BasicInfoFieldsProps {
  form: UseFormReturn<ContactModalValues>;
}

export function BasicInfoFields({ form }: BasicInfoFieldsProps) {
  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Format phone number as (00) 00000-0000
    const value = e.target.value.replace(/\D/g, '');
    const formattedValue = value
      .replace(/^(\d{2})(\d)/g, '($1) $2')
      .replace(/(\d)(\d{4})$/, '$1-$2');
    
    form.setValue("phone", formattedValue);
  };
  
  return (
    <>
      <FormField
        control={form.control}
        name="contactName"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Contact Name*</FormLabel>
            <FormControl>
              <Input 
                placeholder="Full name" 
                {...field} 
                style={{ backgroundColor: "white", color: "#333" }}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email*</FormLabel>
              <FormControl>
                <Input 
                  placeholder="email@example.com" 
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
          name="phone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Phone*</FormLabel>
              <FormControl>
                <Input 
                  placeholder="(00) 00000-0000" 
                  {...field}
                  onChange={handlePhoneChange}
                  style={{ backgroundColor: "white", color: "#333" }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </>
  );
}
