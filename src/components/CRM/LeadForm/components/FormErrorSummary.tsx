
import React from "react";
import { useFormContext } from "react-hook-form";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { LeadFormValues } from "@/types/crm";
import { AlertCircle } from "lucide-react";

export const FormErrorSummary = () => {
  const { formState } = useFormContext<LeadFormValues>();
  const { errors } = formState;
  
  if (!Object.keys(errors).length) return null;
  
  return (
    <Alert variant="destructive" className="mt-4 border-destructive/50 text-destructive">
      <div className="flex gap-2 items-start">
        <AlertCircle className="h-5 w-5 mt-0.5" />
        <AlertDescription className="w-full">
          <p className="font-semibold">Por favor, corrija os seguintes erros:</p>
          <ul className="list-disc pl-5 mt-2 space-y-1">
            {Object.entries(errors).map(([field, error]) => (
              <li key={field}>
                {error?.message?.toString()}
              </li>
            ))}
          </ul>
        </AlertDescription>
      </div>
    </Alert>
  );
};
