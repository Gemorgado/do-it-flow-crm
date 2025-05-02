
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { RESOURCES } from "@/constants/resources";
import { getResourceColor } from "./util";
import { UseFormReturn } from "react-hook-form";
import * as Select from '@radix-ui/react-select';
import { ChevronDown, Check } from 'lucide-react';

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
          <Select.Root 
            value={field.value} 
            onValueChange={(value) => {
              field.onChange(value);
              console.log("Resource selected:", value);
            }}
            disabled={field.disabled}
          >
            <FormControl>
              <Select.Trigger 
                className="w-full flex items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                style={{backgroundColor: 'white'}}
              >
                <Select.Value placeholder="Selecione um recurso" />
                <Select.Icon asChild>
                  <ChevronDown size={16} />
                </Select.Icon>
              </Select.Trigger>
            </FormControl>
            
            <Select.Portal>
              <Select.Content 
                className="select-content overflow-hidden bg-white rounded-md shadow-lg z-[200]" 
                position="popper" 
                sideOffset={4}
                style={{
                  backgroundColor: 'white',
                  minWidth: '220px',
                  zIndex: 200,
                  opacity: 1,
                  visibility: 'visible'
                }}
              >
                <Select.Viewport 
                  style={{
                    backgroundColor: 'white',
                    padding: '4px'
                  }}
                >
                  {RESOURCES.map(resource => (
                    <Select.Item 
                      key={resource.id} 
                      value={resource.id} 
                      className="flex items-center gap-2 px-3 py-1.5 rounded hover:bg-zinc-100 cursor-pointer"
                      style={{
                        backgroundColor: 'white',
                        opacity: 1
                      }}
                    >
                      <Select.ItemIndicator className="absolute left-2 flex items-center justify-center">
                        <Check size={12} />
                      </Select.ItemIndicator>
                      <div className="flex items-center pl-4">
                        <div
                          className="w-3 h-3 rounded-full mr-2"
                          style={{ backgroundColor: getResourceColor(resource.id) }}
                        />
                        {resource.label}
                      </div>
                    </Select.Item>
                  ))}
                </Select.Viewport>
              </Select.Content>
            </Select.Portal>
          </Select.Root>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
