
import React from "react";
import { useFormContext } from "react-hook-form";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { LeadFormValues } from "@/types/crm";

export const FormErrorSummary = () => {
  const { formState } = useFormContext<LeadFormValues>();
  const { errors } = formState;
  
  if (!Object.keys(errors).length) return null;
  
  return (
    <Alert variant="destructive" className="mt-4">
      <AlertDescription>
        <p className="font-semibold">Por favor, corrija os seguintes erros:</p>
        <ul className="list-disc pl-5 mt-2 space-y-1">
          {Object.entries(errors).map(([field, error]) => (
            <li key={field}>
              {error?.message?.toString()}
            </li>
          ))}
        </ul>
      </AlertDescription>
    </Alert>
  );
};
