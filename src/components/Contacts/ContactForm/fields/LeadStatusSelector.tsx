
import { Control } from "react-hook-form";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
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
import { AlertCircle } from "lucide-react";

interface LeadStatusSelectorProps {
  control: Control<any>;
}

export function LeadStatusSelector({ control }: LeadStatusSelectorProps) {
  return (
    <FormField
      control={control}
      name="status"
      render={({ field, fieldState }) => (
        <FormItem>
          <div className="flex items-center justify-between">
            <FormLabel>Status</FormLabel>
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
                <SelectValue placeholder="Selecione um status" />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              <SelectItem value="novo">Novo</SelectItem>
              <SelectItem value="em_contato">Em Contato</SelectItem>
              <SelectItem value="qualificado">Qualificado</SelectItem>
              <SelectItem value="proposta">Proposta</SelectItem>
              <SelectItem value="negociacao">Em Negociação</SelectItem>
              <SelectItem value="ganho">Ganho</SelectItem>
              <SelectItem value="perdido">Perdido</SelectItem>
            </SelectContent>
          </Select>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
