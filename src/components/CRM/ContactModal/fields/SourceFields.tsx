
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface SourceFieldsProps {
  form: UseFormReturn<ContactModalValues>;
}

export function SourceFields({ form }: SourceFieldsProps) {
  return (
    <>
      <FormField
        control={form.control}
        name="sourceCategory"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Source*</FormLabel>
            <Select 
              onValueChange={field.onChange} 
              defaultValue={field.value}
            >
              <FormControl>
                <SelectTrigger style={{ backgroundColor: "white", color: "#333" }}>
                  <SelectValue placeholder="Select a source" />
                </SelectTrigger>
              </FormControl>
              <SelectContent style={{ 
                backgroundColor: "white",
                zIndex: 200,
                opacity: 1,
                visibility: "visible" 
              }}>
                <SelectItem value="indicacao" style={{ backgroundColor: "white", color: "#333" }}>Indication</SelectItem>
                <SelectItem value="rede_social" style={{ backgroundColor: "white", color: "#333" }}>Social Network</SelectItem>
                <SelectItem value="outro" style={{ backgroundColor: "white", color: "#333" }}>Other</SelectItem>
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="sourceDetail"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Source Details</FormLabel>
            <FormControl>
              <Input 
                placeholder="Ex: Instagram, John's indication" 
                {...field} 
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
