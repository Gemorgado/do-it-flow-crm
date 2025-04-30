
import React from "react";
import { useFormContext } from "react-hook-form";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
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
import { cn } from "@/lib/utils";
import { LeadFormValues } from "@/types/crm";
import { AlertCircle } from "lucide-react";

export const SourceFields = () => {
  const { control, watch } = useFormContext<LeadFormValues>();
  const sourceCategory = watch("sourceCategory");
  
  return (
    <>
      <FormField
        control={control}
        name="sourceCategory"
        render={({ field, fieldState }) => (
          <FormItem>
            <div className="flex items-center justify-between">
              <FormLabel>Origem*</FormLabel>
              {fieldState.error && (
                <span className="text-xs text-destructive flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" />
                  {fieldState.error.message}
                </span>
              )}
            </div>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger className={cn(
                  fieldState.error && "border-destructive focus-visible:ring-destructive"
                )}>
                  <SelectValue placeholder="Selecione a origem" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="indicacao">Indicação</SelectItem>
                <SelectItem value="rede_social">Rede Social</SelectItem>
                <SelectItem value="outro">Outro</SelectItem>
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="sourceDetail"
        render={({ field, fieldState }) => (
          <FormItem>
            <div className="flex items-center justify-between">
              <FormLabel>
                {sourceCategory === "indicacao" 
                  ? "Quem indicou" 
                  : sourceCategory === "rede_social" 
                    ? "Qual rede social" 
                    : "Detalhes da origem"}
              </FormLabel>
              {fieldState.error && (
                <span className="text-xs text-destructive flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" />
                  {fieldState.error.message}
                </span>
              )}
            </div>
            <FormControl>
              <Input 
                placeholder={
                  sourceCategory === "indicacao" 
                    ? "Nome da pessoa que indicou" 
                    : sourceCategory === "rede_social" 
                      ? "Ex: Instagram, Facebook" 
                      : "Ex: Site, Google"
                } 
                {...field} 
                className={cn(
                  fieldState.error && "border-destructive focus-visible:ring-destructive"
                )}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );
};
