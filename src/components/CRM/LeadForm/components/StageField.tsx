
import React from "react";
import { useFormContext } from "react-hook-form";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { LeadFormValues } from "@/types/crm";
import { pipelineStages } from "@/data/leadsData";

interface StageFieldProps {
  presetStageId?: string;
}

export const StageField = ({ presetStageId }: StageFieldProps) => {
  if (presetStageId) return null;
  
  const { control } = useFormContext<LeadFormValues>();
  
  return (
    <FormField
      control={control}
      name="stageId"
      render={({ field, fieldState }) => (
        <FormItem>
          <FormLabel>Estágio*</FormLabel>
          <Select 
            onValueChange={field.onChange} 
            defaultValue={field.value}
          >
            <FormControl>
              <SelectTrigger className={cn(
                fieldState.error && "border-red-500"
              )}>
                <SelectValue placeholder="Selecione o estágio" />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              {pipelineStages.map((stage) => (
                <SelectItem key={stage.id} value={stage.id}>
                  {stage.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};
