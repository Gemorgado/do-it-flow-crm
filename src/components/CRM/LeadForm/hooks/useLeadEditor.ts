
import { Lead, LeadSource, LeadStatus, PipelineStage } from "@/types";
import { LeadFormValues } from "@/types/crm";
import { persistence } from "@/integrations/persistence";
import { toast } from "@/hooks/use-toast";
import { v4 as uuidv4 } from 'uuid';

interface UseLeadEditorProps {
  leadToEdit?: Lead;
  presetStage?: PipelineStage;
  onSuccess: () => void;
}

export function useLeadEditor({ leadToEdit, presetStage, onSuccess }: UseLeadEditorProps) {
  const isEditMode = !!leadToEdit;

  // Map source category to LeadSource type
  const sourceMap: Record<string, LeadSource> = {
    'indicacao': 'indicacao',
    'rede_social': 'instagram',
    'outro': 'outros'
  };

  const updateLead = async (data: LeadFormValues & { stageId?: string }) => {
    if (!leadToEdit) return null;
    
    try {
      const updatedLead = {
        ...leadToEdit,
        name: data.companyOrPerson || leadToEdit.name,
        company: data.idNumber || leadToEdit.company,
        email: data.email || leadToEdit.email,
        phone: data.phone || leadToEdit.phone,
        notes: data.notes || leadToEdit.notes,
        updatedAt: new Date().toISOString()
      };
      
      // If stage was changed, update it too
      if (data.stageId && data.stageId !== leadToEdit.stage.id) {
        const newStage = {
          id: data.stageId,
          name: "Estágio atualizado", // Ideally we would fetch the real stage name
          order: parseInt(data.stageId),
          color: "#000000" // Ideally we would fetch the real stage color
        };
        updatedLead.stage = newStage;
      }
      
      await persistence.updateLead(updatedLead);
      
      toast({
        title: "Lead atualizado com sucesso",
        description: `O lead ${updatedLead.name} foi atualizado`,
      });
      
      onSuccess();
      return updatedLead;
    } catch (error) {
      console.error("Erro ao atualizar lead:", error);
      
      toast({
        title: "Erro ao atualizar lead",
        description: "Ocorreu um erro ao atualizar o lead, tente novamente",
        variant: "destructive"
      });
      
      throw error;
    }
  };

  const createLead = async (data: LeadFormValues & { stageId?: string }) => {
    try {
      // Create a new Lead object with all required fields
      const newLead: Lead = {
        id: uuidv4(),
        name: data.companyOrPerson || 'Sem nome',
        company: data.companyOrPerson,
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
      
      await persistence.createLead(newLead);
      
      toast({
        title: "Lead criado com sucesso",
        description: `O lead ${newLead.name} foi adicionado ao sistema`,
      });
      
      onSuccess();
      return newLead;
    } catch (error) {
      console.error("Erro ao criar lead:", error);
      
      toast({
        title: "Erro ao criar lead",
        description: "Ocorreu um erro ao criar o lead, tente novamente",
        variant: "destructive"
      });
      
      throw error;
    }
  };

  const handleSubmit = async (data: LeadFormValues & { stageId?: string }) => {
    return isEditMode ? updateLead(data) : createLead(data);
  };

  // Prepare default values for edit mode
  const getEditModeDefaults = (): Partial<LeadFormValues> | undefined => {
    if (!isEditMode) return undefined;
    
    return {
      companyOrPerson: leadToEdit.name,
      idNumber: leadToEdit.company || '',
      entryDate: leadToEdit.createdAt,
      interestService: leadToEdit.notes || '',
      stageId: leadToEdit.stage.id || "1",
      email: leadToEdit.email || '',
      phone: leadToEdit.phone || '',
      notes: leadToEdit.notes || '',
      sourceCategory: mapLeadSourceToCategory(leadToEdit.source) as "indicacao" | "rede_social" | "outro",
      sourceDetail: leadToEdit.sourceDetail || '',
    };
  };

  return {
    handleSubmit,
    isEditMode,
    editModeDefaults: getEditModeDefaults()
  };
}

// Helper function to map lead source type to category
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
