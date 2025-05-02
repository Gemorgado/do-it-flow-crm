
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { RESOURCES } from "@/constants/resources";
import { getResourceColor } from "./util";
import * as SelectPrimitive from "@radix-ui/react-select";
import { Check, ChevronDown } from "lucide-react";
import { UseFormReturn } from "react-hook-form";

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
          <FormControl>
            <div className="relative">
              <SelectPrimitive.Root
                value={field.value}
                onValueChange={field.onChange}
              >
                <SelectPrimitive.Trigger
                  className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <SelectPrimitive.Value>
                    {RESOURCES.find(r => r.id === field.value)?.label || "Selecione um recurso"}
                  </SelectPrimitive.Value>
                  <SelectPrimitive.Icon>
                    <ChevronDown className="h-4 w-4 opacity-50" />
                  </SelectPrimitive.Icon>
                </SelectPrimitive.Trigger>
                
                <SelectPrimitive.Portal>
                  <SelectPrimitive.Content
                    className="z-50 overflow-hidden rounded-md border bg-popover text-popover-foreground shadow-md animate-in fade-in-80"
                    position="popper" 
                    sideOffset={5}
                  >
                    <SelectPrimitive.Viewport className="p-1">
                      {RESOURCES.map(resource => (
                        <SelectPrimitive.Item
                          key={resource.id}
                          value={resource.id}
                          className="relative flex h-9 cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none hover:bg-accent hover:text-accent-foreground data-[highlighted]:bg-accent data-[highlighted]:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50"
                        >
                          <div className="flex items-center">
                            <div
                              className="w-3 h-3 rounded-full mr-2"
                              style={{ backgroundColor: getResourceColor(resource.id) }}
                            ></div>
                            <SelectPrimitive.ItemText>{resource.label}</SelectPrimitive.ItemText>
                          </div>
                          <SelectPrimitive.ItemIndicator className="absolute right-2">
                            <Check className="h-4 w-4" />
                          </SelectPrimitive.ItemIndicator>
                        </SelectPrimitive.Item>
                      ))}
                    </SelectPrimitive.Viewport>
                  </SelectPrimitive.Content>
                </SelectPrimitive.Portal>
              </SelectPrimitive.Root>
            </div>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
