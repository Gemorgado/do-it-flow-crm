
import React from "react";
import { UseFormReturn } from "react-hook-form";
import { ContactModalValues } from "@/schemas/contactFormSchemas";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { AlertCircle } from "lucide-react";

interface SourceFieldsProps {
  form: UseFormReturn<ContactModalValues>;
}

export function SourceFields({ form }: SourceFieldsProps) {
  const sourceCategory = form.watch("sourceCategory");

  return (
    <>
      <FormField
        control={form.control}
        name="sourceCategory"
        render={({ field, fieldState }) => (
          <FormItem>
            <div className="flex items-center justify-between">
              <FormLabel>Source*</FormLabel>
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
                  <SelectValue placeholder="Select a source" />
                </SelectTrigger>
              </FormControl>
              <SelectContent style={{ 
                backgroundColor: "white",
                zIndex: 200,
                opacity: 1,
                visibility: "visible" 
              }}>
                <SelectItem value="indicacao" style={{ backgroundColor: "white", color: "#333" }}>Indication</SelectItem>
                <SelectItem value="rede_social" style={{ backgroundColor: "white", color: "#333" }}>Social Network</SelectItem>
                <SelectItem value="outro" style={{ backgroundColor: "white", color: "#333" }}>Other</SelectItem>
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="sourceDetail"
        render={({ field, fieldState }) => (
          <FormItem>
            <div className="flex items-center justify-between">
              <FormLabel>
                {sourceCategory === "indicacao" 
                  ? "Who recommended" 
                  : sourceCategory === "rede_social" 
                    ? "Which social network" 
                    : "Source details"}
              </FormLabel>
              {fieldState.error && (
                <span className="text-xs text-destructive flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" />
                  {fieldState.error.message}
                </span>
              )}
            </div>
            <FormControl>
              <Input 
                placeholder={
                  sourceCategory === "indicacao" 
                    ? "Name of person who recommended" 
                    : sourceCategory === "rede_social" 
                      ? "Ex: Instagram, Facebook" 
                      : "Ex: Website, Google"
                } 
                {...field} 
                className={cn(
                  fieldState.error && "border-destructive focus-visible:ring-destructive"
                )}
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
