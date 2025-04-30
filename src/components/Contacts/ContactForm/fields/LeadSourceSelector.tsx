
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

interface LeadSourceSelectorProps {
  control: Control<any>;
}

export function LeadSourceSelector({ control }: LeadSourceSelectorProps) {
  return (
    <FormField
      control={control}
      name="source"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Origem</FormLabel>
          <Select
            onValueChange={field.onChange}
            defaultValue={field.value}
          >
            <FormControl>
              <SelectTrigger>
                <SelectValue placeholder="Selecione uma origem" />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              <SelectItem value="site_organico">Site (Orgânico)</SelectItem>
              <SelectItem value="google_ads">Google Ads</SelectItem>
              <SelectItem value="meta_ads">Meta Ads</SelectItem>
              <SelectItem value="instagram">Instagram</SelectItem>
              <SelectItem value="indicacao">Indicação</SelectItem>
              <SelectItem value="visita_presencial">Visita Presencial</SelectItem>
              <SelectItem value="eventos">Eventos</SelectItem>
              <SelectItem value="outros">Outros</SelectItem>
            </SelectContent>
          </Select>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
