
import React, { useState, useEffect } from "react";
import { FormProvider } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { LeadFormValues } from "@/types/crm";
import { PipelineStage } from "@/types";
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
  FormErrorSummary
} from "./components";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { InfoIcon } from "lucide-react";
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
        // Criar um novo objeto Lead com os dados do formulário
        const newLead = {
          id: uuidv4(),
          name: data.companyOrPerson || 'Sem nome',
          company: data.companyOrPerson,
          email: data.email || 'sem-email@exemplo.com',
          phone: data.phone || '',
          status: 'novo',
          source: data.sourceCategory,
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
  
  const onSubmitWithValidation = form.handleSubmit((data) => {
    setAttemptedSubmit(true);
    handleSubmit(data);
  });

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
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-muted-foreground">Informações básicas</h3>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <InfoIcon className="h-4 w-4 text-muted-foreground" />
                </TooltipTrigger>
                <TooltipContent>
                  <p className="text-xs">Campos marcados com * são obrigatórios</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          
          <CompanyPersonField />
          <IdNumberField />
          <EntryDateField />
          <InterestServiceField />
          <StageField presetStageId={presetStageId} />
          
          <div className="border-t pt-4 mt-6">
            <h3 className="text-sm font-medium text-muted-foreground mb-4">Detalhes adicionais</h3>
            <CompanyDetailsFields />
          </div>
          
          <div className="border-t pt-4 mt-6">
            <h3 className="text-sm font-medium text-muted-foreground mb-4">Origem</h3>
            <SourceFields />
          </div>
          
          {/* Adicionar campos para email e telefone */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <input 
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      type="email"
                      placeholder="email@exemplo.com"
                      {...field}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Telefone</FormLabel>
                  <FormControl>
                    <input 
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      placeholder="(00) 00000-0000"
                      {...field}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>

          {/* Adicionar campo para notas */}
          <FormField
            control={form.control}
            name="notes"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Notas adicionais</FormLabel>
                <FormControl>
                  <textarea 
                    className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    placeholder="Informações adicionais sobre o lead..."
                    {...field}
                  />
                </FormControl>
              </FormItem>
            )}
          />
          
          {/* Show summary of errors when form is submitted with errors */}
          {attemptedSubmit && Object.keys(form.formState.errors).length > 0 && (
            <FormErrorSummary />
          )}
          
          <div className="flex justify-end space-x-2 pt-6 border-t">
            <Button 
              type="button" 
              variant="outline" 
              onClick={onCancel}
              disabled={isSubmitting}
            >
              Cancelar
            </Button>
            <Button 
              type="submit" 
              disabled={isSubmitting}
              className="relative"
            >
              {isSubmitting ? (
                <>
                  <span className="opacity-0">Salvar</span>
                  <span className="absolute inset-0 flex items-center justify-center">
                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                  </span>
                </>
              ) : (
                "Salvar"
              )}
            </Button>
          </div>
        </form>
      </Form>
    </FormProvider>
  );
}
