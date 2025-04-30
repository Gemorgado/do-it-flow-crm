
import React from "react";
import { useFormContext } from "react-hook-form";
import { format } from "date-fns";
import { CalendarIcon, AlertCircle } from "lucide-react";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { LeadFormValues } from "@/types/crm";

export const EntryDateField = () => {
  const { control } = useFormContext<LeadFormValues>();
  
  return (
    <FormField
      control={control}
      name="entryDate"
      render={({ field, fieldState }) => (
        <FormItem className="flex flex-col">
          <div className="flex items-center justify-between">
            <FormLabel>Data de Entrada*</FormLabel>
            {fieldState.error && (
              <span className="text-xs text-destructive flex items-center gap-1">
                <AlertCircle className="h-3 w-3" />
                {fieldState.error.message}
              </span>
            )}
          </div>
          <Popover>
            <PopoverTrigger asChild>
              <FormControl>
                <Button
                  variant={"outline"}
                  className={cn(
                    "w-full pl-3 text-left font-normal",
                    !field.value && "text-muted-foreground",
                    fieldState.error && "border-destructive focus-visible:ring-destructive"
                  )}
                  aria-invalid={!!fieldState.error}
                >
                  {field.value ? (
                    format(new Date(field.value), "dd/MM/yyyy")
                  ) : (
                    <span>Selecione uma data</span>
                  )}
                  <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                </Button>
              </FormControl>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={field.value ? new Date(field.value) : undefined}
                onSelect={(date) => date && field.onChange(format(date, "yyyy-MM-dd"))}
                initialFocus
                className="pointer-events-auto"
              />
            </PopoverContent>
          </Popover>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};
