
import React from 'react';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import { Loader } from 'lucide-react';
import { useProposalForm } from './hooks/useProposalForm';
import { CompanyField } from './ProposalForm/CompanyField';
import { ServiceTypeField } from './ProposalForm/ServiceTypeField';
import { AmountField } from './ProposalForm/AmountField';
import { DateField } from './ProposalForm/DateField';
import { FollowUpSection } from './ProposalForm/FollowUpSection';
import { OwnerField } from './ProposalForm/OwnerField';

interface ProposalModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ProposalModal({ isOpen, onClose }: ProposalModalProps) {
  const { form, isPending, onSubmit, formatCurrency, currentUser } = useProposalForm(onClose);
  
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle>Nova Proposta</DialogTitle>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={onSubmit} className="space-y-4">
            <CompanyField control={form.control} />
            
            <ServiceTypeField control={form.control} />
            
            <AmountField control={form.control} formatCurrency={formatCurrency} />
            
            <DateField 
              control={form.control} 
              name="proposalDate" 
              label="Data da Proposta"
            />
            
            {/* Mostrar campo de responsável apenas para quem tem permissão */}
            {currentUser?.viewAllProposals && (
              <OwnerField 
                control={form.control}
                defaultValue={currentUser?.id || ''}
              />
            )}
            
            <FollowUpSection control={form.control} />
            
            <DialogFooter className="pt-4">
              <Button 
                type="button" 
                variant="outline" 
                onClick={onClose}
                disabled={isPending}
              >
                Cancelar
              </Button>
              <Button type="submit" disabled={isPending}>
                {isPending ? (
                  <>
                    <Loader className="mr-2 h-4 w-4 animate-spin" />
                    Salvando...
                  </>
                ) : (
                  'Salvar Proposta'
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
