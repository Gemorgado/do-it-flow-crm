
import React, { useState, useEffect } from "react";
import { FormProvider } from "react-hook-form";
import { Form } from "@/components/ui/form";
import { LeadFormValues } from "@/types/crm";
import { LeadStatus, PipelineStage, LeadSource } from "@/types";
import { useLeadFormLogic } from "./hooks/useLeadFormLogic";
import { v4 as uuidv4 } from 'uuid';
import { leadPersistence } from "@/integrations/persistence/leadPersistence";
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
import { toast } from "@/hooks/use-toast";

interface LeadFormProps {
  onSubmit: (data: LeadFormValues & { stageId?: string }) => void;
  onCancel: () => void;
  presetStage?: PipelineStage;
  isSubmitting: boolean;
}

export function LeadForm({ 
  onSubmit, 
  onCancel, 
  presetStage,
  isSubmitting 
}: LeadFormProps) {
  // Get preset stage ID if provided
  const presetStageId = presetStage?.id;

  const { form, handleSubmit, isValid } = useLeadFormLogic({
    onSubmit: async (data) => {
      try {
        // Map source category to LeadSource type
        const sourceMap: Record<string, LeadSource> = {
          'indicacao': 'indicacao',
          'rede_social': 'instagram', // Map rede_social to instagram as a valid LeadSource
          'outro': 'outros' // Map outro to outros
        };
        
        // Criar um novo objeto Lead com os dados do formulário
        const newLead = {
          id: uuidv4(),
          name: data.companyOrPerson || 'Sem nome',
          company: data.companyOrPerson,
          email: data.email || 'sem-email@exemplo.com',
          phone: data.phone || '',
          status: 'novo' as LeadStatus,
          source: sourceMap[data.sourceCategory] || 'outros' as LeadSource,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          stage: presetStage || {
            id: data.stageId || "1",
            name: "Novo",
            order: 1,
            color: "#3b82f6"
          },
          value: 0,
          notes: data.notes || '',
        };
        
        // Salvar o lead no sistema de persistência
        await leadPersistence.createLead(newLead);
        
        // Mostrar mensagem de sucesso
        toast({
          title: "Lead criado com sucesso",
          description: `O lead ${newLead.name} foi adicionado ao sistema`,
        });
        
        // Chamar o callback de sucesso
        onSubmit(data);
      } catch (error) {
        console.error("Erro ao criar lead:", error);
        toast({
          title: "Erro ao criar lead",
          description: "Ocorreu um erro ao criar o lead, tente novamente",
          variant: "destructive"
        });
      }
    },
    presetStageId
  });

  // Track form submission attempts for showing validation summary
  const [attemptedSubmit, setAttemptedSubmit] = useState(false);
  
  // Fix: Create a proper submission handler that awaits the async operation
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
            title="Informações básicas" 
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
          
          <FormButtons onCancel={onCancel} isSubmitting={isSubmitting} />
        </form>
      </Form>
    </FormProvider>
  );
}
