
import React from "react";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { UseFormReturn } from "react-hook-form";
import { Location } from "@/types";
import { ClientFormValues } from "../schemas";
import { ServiceType } from "@/types/service";

interface SpaceSelectionSectionProps {
  form: UseFormReturn<ClientFormValues>;
  watchPlan: string | undefined;
  availableSpaces: Location[];
}

export function SpaceSelectionSection({ form, watchPlan, availableSpaces }: SpaceSelectionSectionProps) {
  // Check if the plan type requires space selection
  if (!(watchPlan === 'sala_privativa' || watchPlan === 'estacao_fixa')) {
    return null;
  }

  return (
    <FormField
      control={form.control}
      name="selectedSpaceId"
      render={({ field }) => (
        <FormItem>
          <FormLabel>
            {watchPlan === 'sala_privativa' ? 'Selecione uma sala' : 'Selecione uma estação'}
          </FormLabel>
          <Select
            onValueChange={field.onChange}
            defaultValue={field.value}
          >
            <FormControl>
              <SelectTrigger>
                <SelectValue placeholder={
                  availableSpaces.length > 0 
                    ? "Selecione um espaço" 
                    : "Nenhum espaço disponível"
                } />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              {availableSpaces.length > 0 ? (
                availableSpaces.map((space) => (
                  <SelectItem key={space.id} value={space.id}>
                    {space.name || space.id}
                  </SelectItem>
                ))
              ) : (
                <SelectItem value="none" disabled>
                  Nenhum espaço disponível
                </SelectItem>
              )}
            </SelectContent>
          </Select>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
