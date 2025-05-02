
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { RESOURCES } from "@/constants/resources";
import { getResourceColor } from "./util";
import { UseFormReturn } from "react-hook-form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Check } from "lucide-react";

interface ResourceSelectProps {
  form: UseFormReturn<any>;
}

export function ResourceSelect({ form }: ResourceSelectProps) {
  return (
    <FormField
      control={form.control}
      name="resource"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Recurso</FormLabel>
          <Select
            value={field.value}
            onValueChange={field.onChange}
            disabled={field.disabled}
          >
            <FormControl>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Selecione um recurso" />
              </SelectTrigger>
            </FormControl>
            <SelectContent sideOffset={4} className="z-[100]">
              {RESOURCES.map(resource => (
                <SelectItem key={resource.id} value={resource.id} className="flex items-center gap-2">
                  <div className="flex items-center">
                    <div
                      className="w-3 h-3 rounded-full mr-2"
                      style={{ backgroundColor: getResourceColor(resource.id) }}
                    />
                    {resource.label}
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
