
import { LeadFormValues } from "@/schemas/contactFormSchemas";
import { pipelineStages } from "@/data/leadsData";

/**
 * Hook to create a submit handler for the lead form
 */
export function useSubmitHandler(
  onSubmit: (data: LeadFormValues & { stageId?: string }) => void,
  presetStageId?: string
) {
  return (data: LeadFormValues & { stageId?: string }) => {
    onSubmit({
      ...data,
      stageId: data.stageId || presetStageId || pipelineStages[0].id
    });
  };
}
