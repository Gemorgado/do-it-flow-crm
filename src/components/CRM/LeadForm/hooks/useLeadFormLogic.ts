
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { LeadFormValues, leadFormSchema } from "@/schemas/contactFormSchemas";
import { pipelineStages } from "@/data/leadsData";
import { useFormInitializer } from "./useFormInitializer";
import { useSubmitHandler } from "./useSubmitHandler";

interface UseLeadFormLogicProps {
  onSubmit: (data: LeadFormValues & { stageId?: string }) => void;
  presetStageId?: string;
  initialValues?: Partial<LeadFormValues & { stageId?: string }>;
}

export function useLeadFormLogic({ onSubmit, presetStageId, initialValues }: UseLeadFormLogicProps) {
  // Initialize form with default values or initialValues if provided
  const defaultValues = initialValues || useFormInitializer(presetStageId);
  
  // Create the form instance
  const form = useForm<LeadFormValues & { stageId?: string }>({
    resolver: zodResolver(leadFormSchema),
    defaultValues,
    mode: "onBlur", // Validate on blur for better UX
  });

  // Create a submit handler
  const handleSubmit = useSubmitHandler(onSubmit, presetStageId);
  
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
