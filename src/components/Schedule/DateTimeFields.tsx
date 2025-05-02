
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";

interface DateTimeFieldsProps {
  form: UseFormReturn<any>;
}

export function DateTimeFields({ form }: DateTimeFieldsProps) {
  return (
    <div className="grid grid-cols-2 gap-4">
      <FormField
        control={form.control}
        name="start"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Início</FormLabel>
            <FormControl>
              <Input type="datetime-local" required {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormField
        control={form.control}
        name="end"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Fim</FormLabel>
            <FormControl>
              <Input type="datetime-local" required {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}
