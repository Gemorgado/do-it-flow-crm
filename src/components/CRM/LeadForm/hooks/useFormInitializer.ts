
import { format } from "date-fns";
import { pipelineStages } from "@/data/leadsData";

/**
 * Hook to initialize form default values
 */
export function useFormInitializer(presetStageId?: string) {
  return {
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
  };
}
