
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { format } from "date-fns";
import { LeadFormValues } from "@/types/crm";
import { validateDocument } from "@/utils/documentUtils";
import { PipelineStage } from "@/types";
import { pipelineStages } from "@/data/leadsData";

// Schema de validação usando Zod
export const leadFormSchema = z.object({
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

interface UseLeadFormLogicProps {
  onSubmit: (data: LeadFormValues & { stageId?: string }) => void;
  presetStageId?: string;
}

export function useLeadFormLogic({ onSubmit, presetStageId }: UseLeadFormLogicProps) {
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

  return {
    form,
    handleSubmit
  };
}
