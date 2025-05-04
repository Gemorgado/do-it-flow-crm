
import React, { useState, useEffect } from "react";
import { FormProvider } from "react-hook-form";
import { Form } from "@/components/ui/form";
import { LeadFormValues } from "@/types/crm";
import { Lead, PipelineStage } from "@/types";
import { useLeadFormLogic } from "./hooks/useLeadFormLogic";
import { useLeadEditor } from "./hooks/useLeadEditor";
import { 
  CompanyPersonField,
  IdNumberField,
  EntryDateField, 
  InterestServiceField,
  StageField,
  CompanyDetailsFields,
  SourceFields,
  FormErrorSummary,
  ContactFields,
  NotesField,
  FormButtons,
  FormSectionHeader
} from "./components";

interface LeadFormProps {
  onSubmit: (data: LeadFormValues & { stageId?: string }) => void;
  onCancel: () => void;
  presetStage?: PipelineStage;
  leadToEdit?: Lead;
  isSubmitting: boolean;
}

export function LeadForm({ 
  onSubmit, 
  onCancel, 
  presetStage,
  leadToEdit,
  isSubmitting 
}: LeadFormProps) {
  // Get preset stage ID if provided
  const presetStageId = presetStage?.id || leadToEdit?.stage.id;
  
  const { isEditMode, editModeDefaults, handleSubmit: handleLeadSubmit } = useLeadEditor({
    leadToEdit,
    presetStage,
    onSuccess: () => onSubmit({ companyOrPerson: '' })
  });

  const { form, handleSubmit, isValid } = useLeadFormLogic({
    onSubmit: async (data) => {
      try {
        await handleLeadSubmit(data);
        onSubmit(data);
      } catch (error) {
        console.error("Error during form submission:", error);
      }
    },
    presetStageId,
    initialValues: editModeDefaults,
  });

  // Track form submission attempts for showing validation summary
  const [attemptedSubmit, setAttemptedSubmit] = useState(false);
  
  // Create a proper submission handler that awaits the async operation
  const onSubmitWithValidation = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setAttemptedSubmit(true);
    
    // Only proceed if form is valid
    if (Object.keys(form.formState.errors).length === 0) {
      try {
        await form.handleSubmit(handleSubmit)(e);
      } catch (error) {
        console.error("Error during form submission:", error);
      }
    }
  };

  // Show error summary if user has attempted to submit and there are errors
  useEffect(() => {
    if (attemptedSubmit && !isValid) {
      const firstError = document.querySelector('[aria-invalid="true"]');
      if (firstError) {
        (firstError as HTMLElement).focus();
      }
    }
  }, [attemptedSubmit, isValid]);

  return (
    <FormProvider {...form}>
      <Form {...form}>
        <form onSubmit={onSubmitWithValidation} className="space-y-4" noValidate>
          <FormSectionHeader 
            title={isEditMode ? "Editar Lead" : "Informações básicas"}
            tooltipText="Campos marcados com * são obrigatórios" 
          />
          
          <CompanyPersonField />
          <IdNumberField />
          <EntryDateField />
          <InterestServiceField />
          <StageField presetStageId={presetStageId} />
          
          <div className="border-t pt-4 mt-6">
            <FormSectionHeader title="Detalhes adicionais" />
            <CompanyDetailsFields />
          </div>
          
          <div className="border-t pt-4 mt-6">
            <FormSectionHeader title="Origem" />
            <SourceFields />
          </div>
          
          <ContactFields />
          <NotesField />
          
          {/* Show summary of errors when form is submitted with errors */}
          {attemptedSubmit && Object.keys(form.formState.errors).length > 0 && (
            <FormErrorSummary />
          )}
          
          <FormButtons 
            onCancel={onCancel} 
            isSubmitting={isSubmitting}
            isEditMode={isEditMode} 
          />
        </form>
      </Form>
    </FormProvider>
  );
}
