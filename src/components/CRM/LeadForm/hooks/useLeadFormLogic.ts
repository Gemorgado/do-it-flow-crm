
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { LeadFormValues, leadFormSchema } from "@/schemas/contactFormSchemas";
import { validateDocument } from "@/utils/documentUtils";
import { pipelineStages } from "@/data/leadsData";

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
      email: "",
      phone: "",
      notes: "",
    },
    mode: "onBlur", // Validate on blur for better UX
  });

  const handleSubmit = (data: LeadFormValues & { stageId?: string }) => {
    onSubmit({
      ...data,
      stageId: data.stageId || presetStageId || pipelineStages[0].id
    });
  };

  return {
    form,
    handleSubmit,
    errors: form.formState.errors,
    isSubmitting: form.formState.isSubmitting,
    isDirty: form.formState.isDirty,
    touchedFields: form.formState.touchedFields,
    isValid: form.formState.isValid,
  };
}
