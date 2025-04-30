
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

interface ContactFormFieldsProps {
  type: "lead" | "client";
  form: UseFormReturn<any>;
}

export function ContactFormFields({ type, form }: ContactFormFieldsProps) {
  const isLead = type === "lead";
  
  return (
    <>
      <FormField
        control={form.control}
        name="name"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Nome*</FormLabel>
            <FormControl>
              <Input placeholder="Nome completo" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormField
        control={form.control}
        name="company"
        render={({ field }) => (
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
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email*</FormLabel>
              <FormControl>
                <Input placeholder="email@exemplo.com" {...field} />
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
              <FormLabel>Telefone*</FormLabel>
              <FormControl>
                <Input placeholder="(00) 00000-0000" {...field} />
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
