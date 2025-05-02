
import React from "react";
import { UseFormReturn } from "react-hook-form";
import { ContactModalValues } from "@/schemas/contactFormSchemas";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface DateAndServiceFieldsProps {
  form: UseFormReturn<ContactModalValues>;
}

export function DateAndServiceFields({ form }: DateAndServiceFieldsProps) {
  return (
    <>
      <FormField
        control={form.control}
        name="entryDate"
        render={({ field }) => (
          <FormItem className="flex flex-col">
            <FormLabel>Entry Date*</FormLabel>
            <Popover>
              <PopoverTrigger asChild>
                <FormControl>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "w-full pl-3 text-left font-normal",
                      !field.value && "text-muted-foreground"
                    )}
                    style={{ backgroundColor: "white", color: "#333" }}
                  >
                    {field.value ? (
                      format(new Date(field.value), "dd/MM/yyyy")
                    ) : (
                      <span>Select a date</span>
                    )}
                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                  </Button>
                </FormControl>
              </PopoverTrigger>
              <PopoverContent 
                className="w-auto p-0" 
                align="start"
                style={{ 
                  zIndex: 200, 
                  backgroundColor: "white", 
                  visibility: "visible",
                  opacity: 1
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

      <FormField
        control={form.control}
        name="interestService"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Service of Interest</FormLabel>
            <FormControl>
              <Input 
                placeholder="Describe the service" 
                {...field} 
                style={{ backgroundColor: "white", color: "#333" }}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );
}
