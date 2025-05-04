
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useCreateProposal } from '@/api/proposals';
import { CreateProposalInput } from '@/types/proposal';
import { useAuth } from '@/modules/auth/AuthProvider';
import { ServiceType } from '@/types/service';

// Updated schema with required fields for company and service type
const formSchema = z.object({
  companyId: z.string().min(1, 'Selecione uma empresa'),
  serviceType: z.enum(['fiscal_address', 'flex_desk', 'fixed_desk', 'private_office', 'meeting_room', 'auditorium'] as const, {
    required_error: 'Escolha o serviço',
  }),
  amount: z.number().min(0, 'O valor deve ser maior ou igual a zero'),
  proposalDate: z.string().min(1, 'Selecione uma data'),
  followUpAt: z.string().optional(),
  followUpNote: z.string().optional(),
  ownerId: z.string().optional(),
  // Adding required fields
  title: z.string().min(1, 'Título é obrigatório'),
  leadId: z.string().min(1, 'Lead ID é obrigatório'),
  value: z.number().min(0, 'Valor deve ser maior ou igual a zero'),
  expiresAt: z.string().min(1, 'Data de expiração é obrigatória'),
});

type ProposalFormValues = z.infer<typeof formSchema>;

export const useProposalForm = (onClose: () => void) => {
  const { mutate: createProposal, isPending } = useCreateProposal();
  const { user } = useAuth();
  
  const form = useForm<ProposalFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      companyId: '',
      serviceType: 'private_office' as ServiceType,
      amount: 0,
      proposalDate: new Date().toISOString().split('T')[0],
      followUpAt: '',
      followUpNote: '',
      ownerId: user?.id || '',
      // Default values for required fields
      title: '',
      leadId: '',
      value: 0,
      expiresAt: new Date(Date.now() + 30*24*60*60*1000).toISOString().split('T')[0], // 30 days from now
    },
  });
  
  const onSubmit = (data: ProposalFormValues) => {
    // Convert amount to cents
    const amountInCents = Math.round(data.amount * 100);
    const valueInCents = Math.round(data.value * 100);
    
    const proposalData: CreateProposalInput = {
      companyId: data.companyId,
      serviceType: data.serviceType,
      amount: amountInCents,
      proposalDate: data.proposalDate,
      followUpAt: data.followUpAt || undefined,
      followUpNote: data.followUpNote || undefined,
      ownerId: data.ownerId || user?.id, // Use selected owner or current user
      title: data.title,
      leadId: data.leadId,
      value: valueInCents,
      expiresAt: data.expiresAt,
      status: 'draft',
      created_by: user?.id,
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
    user,
  };
};
