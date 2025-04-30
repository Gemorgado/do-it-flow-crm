
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
import { AlertCircle } from "lucide-react";

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
          <div className="flex items-center justify-between">
            <FormLabel>Estágio*</FormLabel>
            {fieldState.error && (
              <span className="text-xs text-destructive flex items-center gap-1">
                <AlertCircle className="h-3 w-3" />
                {fieldState.error.message}
              </span>
            )}
          </div>
          <Select 
            onValueChange={field.onChange} 
            defaultValue={field.value}
          >
            <FormControl>
              <SelectTrigger className={cn(
                fieldState.error && "border-destructive focus-visible:ring-destructive"
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
