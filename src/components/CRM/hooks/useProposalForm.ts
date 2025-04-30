
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useCreateProposal } from '@/api/proposals';
import { CreateProposalInput, ServiceType } from '@/types/proposal';

const formSchema = z.object({
  companyId: z.string().min(1, 'Selecione uma empresa'),
  serviceType: z.enum(['endereços_fiscais', 'salas_privadas', 'coworking_flex', 'consultoria', 'outro'] as const),
  amount: z.number().min(0, 'O valor deve ser maior ou igual a zero'),
  proposalDate: z.string().min(1, 'Selecione uma data'),
  followUpAt: z.string().optional(),
  followUpNote: z.string().optional(),
});

type ProposalFormValues = z.infer<typeof formSchema>;

export const useProposalForm = (onClose: () => void) => {
  const { mutate: createProposal, isPending } = useCreateProposal();
  
  const form = useForm<ProposalFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      companyId: '',
      serviceType: 'salas_privadas',
      amount: 0,
      proposalDate: new Date().toISOString().split('T')[0],
      followUpAt: '',
      followUpNote: '',
    },
  });
  
  const onSubmit = (data: ProposalFormValues) => {
    // Convert amount to cents
    const amountInCents = Math.round(data.amount * 100);
    
    const proposalData: CreateProposalInput = {
      companyId: data.companyId,
      serviceType: data.serviceType,
      amount: amountInCents,
      proposalDate: data.proposalDate,
      followUpAt: data.followUpAt || undefined,
      followUpNote: data.followUpNote || undefined,
    };
    
    createProposal(proposalData, {
      onSuccess: () => {
        onClose();
        form.reset();
      },
    });
  };
  
  // Format number to currency
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  return {
    form,
    isPending,
    onSubmit: form.handleSubmit(onSubmit),
    formatCurrency,
  };
};
