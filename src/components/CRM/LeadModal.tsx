
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { PipelineStage, Lead } from '@/types';
import { LeadForm } from '@/components/CRM/LeadForm';
import { LeadFormValues } from '@/types/crm';
import { useAuth } from '@/modules/auth/AuthProvider';
import { persistence } from '@/integrations/persistence';
import { toast } from 'sonner';
import { v4 as uuidv4 } from 'uuid';
import { useLeadModal } from './hooks/useModalContext';

interface LeadModalProps {
  addLeadToPipeline?: (lead: Lead) => Promise<Lead>;
}

export function LeadModal({ addLeadToPipeline }: LeadModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user } = useAuth();
  const { isOpen, options, close } = useLeadModal();
  
  const handleSubmit = async (data: LeadFormValues & { stageId?: string }) => {
    setIsSubmitting(true);
    
    try {
      if (options?.leadToEdit) {
        // Update existing lead
        const updatedLead: Lead = {
          ...options.leadToEdit,
          name: data.companyOrPerson || 'Sem nome',
          company: data.companyOrPerson,
          email: data.email || 'sem-email@exemplo.com',
          phone: data.phone || '',
          source: options.leadToEdit.source,
          sourceDetail: data.sourceDetail,
          updatedAt: new Date().toISOString(),
          notes: data.notes || '',
        };
        
        await persistence.updateLead(updatedLead);
        
        toast.success("Lead atualizado com sucesso", {
          description: "O lead foi atualizado no sistema"
        });
      } else {
        // Create new lead
        const newLead: Lead = {
          id: uuidv4(),
          name: data.companyOrPerson || 'Sem nome',
          company: data.companyOrPerson,
          email: data.email || 'sem-email@exemplo.com',
          phone: data.phone || '',
          status: 'novo',
          source: data.sourceCategory === 'indicacao' ? 'indicacao' : 
                 data.sourceCategory === 'rede_social' ? 'instagram' : 'outros',
          sourceDetail: data.sourceDetail,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          stage: options?.presetStage || {
            id: '1',
            name: 'Novo',
            order: 1,
            color: '#3b82f6'
          },
          notes: data.notes || '',
        };
        
        if (addLeadToPipeline) {
          await addLeadToPipeline(newLead);
        } else {
          await persistence.createLead(newLead);
        }
        
        toast.success("Lead criado com sucesso", {
          description: "O lead foi adicionado ao sistema"
        });
      }
      
      close();
    } catch (error) {
      console.error("Erro ao salvar lead:", error);
      toast.error("Erro ao salvar lead", {
        description: "Não foi possível salvar o lead. Tente novamente."
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={close}>
      <DialogContent className="sm:max-w-[625px]">
        <DialogHeader>
          <DialogTitle>{options?.leadToEdit ? "Editar Lead" : "Novo Lead"}</DialogTitle>
        </DialogHeader>
        
        <LeadForm 
          onSubmit={handleSubmit} 
          onCancel={close} 
          presetStage={options?.presetStage}
          leadToEdit={options?.leadToEdit}
          isSubmitting={isSubmitting}
        />
        
        <div className="mt-4 flex justify-end">
          <Button type="button" variant="secondary" onClick={close}>
            Cancelar
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
