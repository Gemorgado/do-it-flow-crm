
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

interface LeadSourceSelectorProps {
  control: Control<any>;
}

export function LeadSourceSelector({ control }: LeadSourceSelectorProps) {
  return (
    <FormField
      control={control}
      name="source"
      render={({ field, fieldState }) => (
        <FormItem>
          <div className="flex items-center justify-between">
            <FormLabel>Origem</FormLabel>
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
              <SelectTrigger 
                className={cn(
                  fieldState.error && "border-destructive focus-visible:ring-destructive"
                )}
                style={{ backgroundColor: "white", color: "#333" }}
              >
                <SelectValue placeholder="Selecione uma origem" />
              </SelectTrigger>
            </FormControl>
            <SelectContent style={{ 
              backgroundColor: "white", 
              zIndex: 200, 
              color: "#333", 
              opacity: 1,
              visibility: "visible"
            }}>
              <SelectItem value="site_organico" style={{ backgroundColor: "white", color: "#333" }}>Site (Orgânico)</SelectItem>
              <SelectItem value="google_ads" style={{ backgroundColor: "white", color: "#333" }}>Google Ads</SelectItem>
              <SelectItem value="meta_ads" style={{ backgroundColor: "white", color: "#333" }}>Meta Ads</SelectItem>
              <SelectItem value="instagram" style={{ backgroundColor: "white", color: "#333" }}>Instagram</SelectItem>
              <SelectItem value="indicacao" style={{ backgroundColor: "white", color: "#333" }}>Indicação</SelectItem>
              <SelectItem value="visita_presencial" style={{ backgroundColor: "white", color: "#333" }}>Visita Presencial</SelectItem>
              <SelectItem value="eventos" style={{ backgroundColor: "white", color: "#333" }}>Eventos</SelectItem>
              <SelectItem value="outros" style={{ backgroundColor: "white", color: "#333" }}>Outros</SelectItem>
            </SelectContent>
          </Select>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
