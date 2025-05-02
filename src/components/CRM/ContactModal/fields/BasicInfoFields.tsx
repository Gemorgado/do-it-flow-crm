
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

interface BasicInfoFieldsProps {
  form: UseFormReturn<ContactModalValues>;
  onPhoneChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export function BasicInfoFields({ form, onPhoneChange }: BasicInfoFieldsProps) {
  return (
    <>
      <FormField
        control={form.control}
        name="contactName"
        render={({ field, fieldState }) => (
          <FormItem>
            <div className="flex items-center justify-between">
              <FormLabel>Contact Name*</FormLabel>
              {fieldState.error && (
                <span className="text-xs text-destructive flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" />
                  {fieldState.error.message}
                </span>
              )}
            </div>
            <FormControl>
              <Input 
                placeholder="Full name" 
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

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name="email"
          render={({ field, fieldState }) => (
            <FormItem>
              <div className="flex items-center justify-between">
                <FormLabel>Email*</FormLabel>
                {fieldState.error && (
                  <span className="text-xs text-destructive flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" />
                    {fieldState.error.message}
                  </span>
                )}
              </div>
              <FormControl>
                <Input 
                  placeholder="email@example.com" 
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
          name="phone"
          render={({ field, fieldState }) => (
            <FormItem>
              <div className="flex items-center justify-between">
                <FormLabel>Phone*</FormLabel>
                {fieldState.error && (
                  <span className="text-xs text-destructive flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" />
                    {fieldState.error.message}
                  </span>
                )}
              </div>
              <FormControl>
                <Input 
                  placeholder="(00) 00000-0000" 
                  {...field}
                  onChange={onPhoneChange}
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
      </div>
    </>
  );
}
