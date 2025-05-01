
import React from "react";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { useClientForm } from "./useClientForm";
import { 
  BasicInfoSection,
  SpaceSelectionSection,
  ContractDetailsSection,
  ReadjustmentSection,
  AdditionalInfoSection
} from "./FormSections";

interface ClientFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
  initialData?: any;
}

export function ClientForm({ onSuccess, onCancel, initialData }: ClientFormProps) {
  const { 
    form, 
    planOptions, 
    availableSpaces, 
    handleSubmit,
    watchPlan
  } = useClientForm({ onSuccess, initialData });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <BasicInfoSection form={form} planOptions={planOptions} />
        
        <SpaceSelectionSection 
          form={form} 
          watchPlan={watchPlan} 
          availableSpaces={availableSpaces} 
        />

        <ContractDetailsSection form={form} />
        
        <ReadjustmentSection form={form} />
        
        <AdditionalInfoSection form={form} />

        <div className="flex justify-end space-x-2 pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
          >
            Cancelar
          </Button>
          <Button 
            type="submit"
            className="bg-doIt-primary hover:bg-doIt-dark"
          >
            {initialData ? "Atualizar Cliente" : "Criar Cliente"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
