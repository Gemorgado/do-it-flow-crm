
import { format } from "date-fns";
import { pipelineStages } from "@/data/leadsData";
import { LeadFormValues } from "@/schemas/contactFormSchemas";

/**
 * Hook to initialize form default values
 */
export function useFormInitializer(presetStageId?: string): Partial<LeadFormValues> & { stageId: string } {
  return {
    companyOrPerson: "",
    idNumber: "",
    entryDate: format(new Date(), "yyyy-MM-dd"),
    interestService: "",
    sourceCategory: "outro" as "outro" | "indicacao" | "rede_social",
    sourceDetail: "",
    stageId: presetStageId || pipelineStages[0].id,
    email: "",
    phone: "",
    notes: "",
  };
}
