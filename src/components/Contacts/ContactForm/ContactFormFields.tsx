
import { UseFormReturn } from "react-hook-form";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { LeadStatusSelector } from "./fields/LeadStatusSelector";
import { LeadSourceSelector } from "./fields/LeadSourceSelector";
import { cn } from "@/lib/utils";
import { AlertCircle } from "lucide-react";

interface ContactFormFieldsProps {
  type: "lead" | "client";
  form: UseFormReturn<any>;
}

export function ContactFormFields({ type, form }: ContactFormFieldsProps) {
  const isLead = type === "lead";
  const { formatPhoneNumber } = form.getValues();
  
  // Function to format phone as user types
  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhoneNumber ? formatPhoneNumber(e.target.value) : e.target.value;
    form.setValue('phone', formatted, { shouldValidate: true });
  };
  
  return (
    <>
      <FormField
        control={form.control}
        name="name"
        render={({ field, fieldState }) => (
          <FormItem>
            <div className="flex items-center justify-between">
              <FormLabel>Nome*</FormLabel>
              {fieldState.error && (
                <span className="text-xs text-destructive flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" />
                  {fieldState.error.message}
                </span>
              )}
            </div>
            <FormControl>
              <Input 
                placeholder="Nome completo" 
                {...field} 
                className={cn(
                  fieldState.error && "border-destructive focus-visible:ring-destructive"
                )}
                aria-invalid={!!fieldState.error}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormField
        control={form.control}
        name="company"
        render={({ field, fieldState }) => (
          <FormItem>
            <FormLabel>Empresa</FormLabel>
            <FormControl>
              <Input placeholder="Nome da empresa" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                  placeholder="email@exemplo.com" 
                  type="email"
                  {...field} 
                  className={cn(
                    fieldState.error && "border-destructive focus-visible:ring-destructive"
                  )}
                  aria-invalid={!!fieldState.error}
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
                <FormLabel>Telefone*</FormLabel>
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
                  onChange={handlePhoneChange}
                  className={cn(
                    fieldState.error && "border-destructive focus-visible:ring-destructive"
                  )}
                  aria-invalid={!!fieldState.error}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      {isLead && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <LeadStatusSelector control={form.control} />
          <LeadSourceSelector control={form.control} />
        </div>
      )}
    </>
  );
}
