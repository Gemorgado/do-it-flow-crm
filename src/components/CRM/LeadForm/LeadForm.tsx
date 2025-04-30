
import React from "react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { format } from "date-fns";

import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { LeadFormValues } from "@/types/crm";
import { validateDocument } from "@/utils/documentUtils";
import { useCreateLead } from "@/api/crm";
import { PipelineStage } from "@/types";
import { pipelineStages } from "@/data/leadsData";
import { 
  CompanyPersonField,
  IdNumberField,
  EntryDateField, 
  InterestServiceField,
  StageField,
  CompanyDetailsFields,
  SourceFields 
} from "./FormFields";

// Schema de validação usando Zod
const leadFormSchema = z.object({
  companyOrPerson: z.string().min(3, {
    message: "Nome da empresa ou pessoa deve ter pelo menos 3 caracteres",
  }),
  idNumber: z.string().refine(validateDocument, {
    message: "CNPJ ou CPF inválido",
  }),
  entryDate: z.string(),
  interestService: z.string().min(1, {
    message: "Serviço de interesse é obrigatório",
  }),
  employees: z.number().optional(),
  annualRevenue: z.number().optional(),
  sourceCategory: z.enum(["indicacao", "rede_social", "outro"]),
  sourceDetail: z.string().optional(),
  stageId: z.string().optional(),
});

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

  const form = useForm<LeadFormValues & { stageId?: string }>({
    resolver: zodResolver(leadFormSchema),
    defaultValues: {
      companyOrPerson: "",
      idNumber: "",
      entryDate: format(new Date(), "yyyy-MM-dd"),
      interestService: "",
      sourceCategory: "outro",
      sourceDetail: "",
      stageId: presetStageId || pipelineStages[0].id,
    },
  });

  const handleSubmit = (data: LeadFormValues & { stageId?: string }) => {
    onSubmit({
      ...data,
      stageId: data.stageId || presetStageId || pipelineStages[0].id
    });
  };

  return (
    <FormProvider {...form}>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
          <CompanyPersonField />
          <IdNumberField />
          <EntryDateField />
          <InterestServiceField />
          <StageField presetStageId={presetStageId} />
          <CompanyDetailsFields />
          <SourceFields />
          
          <div className="flex justify-end space-x-2 pt-2">
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancelar
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Salvando..." : "Salvar"}
            </Button>
          </div>
        </form>
      </Form>
    </FormProvider>
  );
}
