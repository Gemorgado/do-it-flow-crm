
import React, { useState, useEffect } from "react";
import { FormProvider } from "react-hook-form";
import { Form } from "@/components/ui/form";
import { LeadFormValues } from "@/types/crm";
import { Lead, LeadStatus, PipelineStage, LeadSource } from "@/types";
import { useLeadFormLogic } from "./LeadForm/hooks/useLeadFormLogic";
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
} from "./LeadForm/components";
import { toast } from "@/hooks/use-toast";

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
  const isEditMode = !!leadToEdit;

  // Prepare default values for edit mode
  const editModeDefaults = isEditMode ? {
    companyOrPerson: leadToEdit.name,
    idNumber: leadToEdit.company || '',
    entryDate: leadToEdit.createdAt,
    interestService: leadToEdit.notes || '',
    stageId: leadToEdit.stage.id || "1",
    email: leadToEdit.email || '',
    phone: leadToEdit.phone || '',
    notes: leadToEdit.notes || '',
    sourceCategory: mapLeadSourceToCategory(leadToEdit.source) || 'outro',
    sourceDetail: leadToEdit.sourceDetail || '',
  } : undefined;

  const { form, handleSubmit, isValid } = useLeadFormLogic({
    onSubmit: async (data) => {
      try {
        // Map source category to LeadSource type
        const sourceMap: Record<string, LeadSource> = {
          'indicacao': 'indicacao',
          'rede_social': 'instagram',
          'outro': 'outros'
        };
        
        if (isEditMode) {
          // Atualizar lead existente
          const updatedLead = {
            ...leadToEdit,
            name: data.companyOrPerson || leadToEdit.name,
            company: data.company || leadToEdit.company,
            email: data.email || leadToEdit.email,
            phone: data.phone || leadToEdit.phone,
            status: leadToEdit.status as LeadStatus,
            source: sourceMap[data.sourceCategory] || leadToEdit.source,
            sourceDetail: data.sourceDetail,
            updatedAt: new Date().toISOString(),
            stage: leadToEdit.stage.id !== data.stageId ? 
              { id: data.stageId || "1", name: "Novo", order: 1, color: "#3b82f6" } : 
              leadToEdit.stage,
            notes: data.notes || leadToEdit.notes,
          };
          
          await leadPersistence.updateLead(updatedLead);
          
          toast({
            title: "Lead atualizado com sucesso",
            description: `O lead ${updatedLead.name} foi atualizado`,
          });
        } else {
          // Criar novo lead
          const newLead = {
            id: uuidv4(),
            name: data.companyOrPerson || 'Sem nome',
            company: data.company || '',
            email: data.email || 'sem-email@exemplo.com',
            phone: data.phone || '',
            status: 'novo' as LeadStatus,
            source: sourceMap[data.sourceCategory] || 'outros' as LeadSource,
            sourceDetail: data.sourceDetail,
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
          
          await leadPersistence.createLead(newLead);
          
          toast({
            title: "Lead criado com sucesso",
            description: `O lead ${newLead.name} foi adicionado ao sistema`,
          });
        }
        
        // Chamar o callback de sucesso
        onSubmit(data);
      } catch (error) {
        console.error("Erro ao salvar lead:", error);
        toast({
          title: "Erro ao salvar lead",
          description: "Ocorreu um erro ao salvar o lead, tente novamente",
          variant: "destructive"
        });
      }
    },
    presetStageId,
    initialValues: editModeDefaults,
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

// Função auxiliar para mapear o tipo de origem do lead para categoria
function mapLeadSourceToCategory(source: string): string {
  switch (source) {
    case 'indicacao':
      return 'indicacao';
    case 'instagram':
    case 'meta_ads':
      return 'rede_social';
    default:
      return 'outro';
  }
}
