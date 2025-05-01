
import React from "react";
import { FormField, FormItem, FormLabel, FormControl, FormMessage, FormDescription } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { UseFormReturn } from "react-hook-form";
import { ClientFormValues } from "../schemas";

interface AdditionalInfoSectionProps {
  form: UseFormReturn<ClientFormValues>;
}

export function AdditionalInfoSection({ form }: AdditionalInfoSectionProps) {
  return (
    <>
      <FormField
        control={form.control}
        name="billingEmails"
        render={({ field }) => (
          <FormItem>
            <FormLabel>E-mails para Avisos Financeiros</FormLabel>
            <FormControl>
              <Textarea 
                placeholder="email1@exemplo.com; email2@exemplo.com" 
                {...field} 
                className="resize-none"
              />
            </FormControl>
            <FormDescription>
              Separe os e-mails por ponto e vírgula (;)
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="address"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Endereço</FormLabel>
            <FormControl>
              <Input placeholder="Endereço completo" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="notes"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Observações</FormLabel>
            <FormControl>
              <Textarea 
                placeholder="Informações adicionais" 
                {...field} 
                className="resize-none"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="isActive"
        render={({ field }) => (
          <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
            <div className="space-y-0.5">
              <FormLabel className="text-base">
                Cliente Ativo
              </FormLabel>
              <FormDescription>
                Determina se o cliente está ativo no sistema
              </FormDescription>
            </div>
            <FormControl>
              <Switch
                checked={field.value}
                onCheckedChange={field.onChange}
              />
            </FormControl>
          </FormItem>
        )}
      />
    </>
  );
}
