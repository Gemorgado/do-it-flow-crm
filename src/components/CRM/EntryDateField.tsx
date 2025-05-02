
import React from "react";
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
import { Control } from "react-hook-form";

interface EntryDateFieldProps {
  control: Control<any>;
  name: string;
  label?: string;
}

export const EntryDateField = ({ control, name, label = "Data de Entrada*" }: EntryDateFieldProps) => {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field, fieldState }) => (
        <FormItem className="flex flex-col">
          <div className="flex items-center justify-between">
            <FormLabel>{label}</FormLabel>
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
                  style={{ backgroundColor: 'white', color: '#333' }}
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
            <PopoverContent 
              className="w-auto p-0" 
              align="start"
              style={{ 
                zIndex: 999, 
                backgroundColor: 'white', 
                visibility: 'visible',
                opacity: 1,
                position: 'relative'
              }}
            >
              <Calendar
                mode="single"
                selected={field.value ? new Date(field.value) : undefined}
                onSelect={(date) => date && field.onChange(format(date, "yyyy-MM-dd"))}
                initialFocus
                className="pointer-events-auto p-3"
              />
            </PopoverContent>
          </Popover>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};
