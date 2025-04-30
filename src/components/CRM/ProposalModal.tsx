
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useCreateProposal } from '@/api/proposals';
import { CreateProposalInput, ServiceType } from '@/types/proposal';

const serviceTypeOptions: { value: ServiceType; label: string }[] = [
  { value: 'endereços_fiscais', label: 'Endereços Fiscais' },
  { value: 'salas_privadas', label: 'Salas Privadas' },
  { value: 'coworking_flex', label: 'Coworking Flex' },
  { value: 'consultoria', label: 'Consultoria' },
  { value: 'outro', label: 'Outro' },
];

// Mock company options (in real app, this would come from an API)
const companyOptions = [
  { id: 'comp-1', name: 'Empresa ABC Ltda' },
  { id: 'comp-2', name: 'Tech Solutions S.A.' },
  { id: 'comp-3', name: 'Consultoria XYZ' },
];

const formSchema = z.object({
  companyId: z.string().min(1, 'Selecione uma empresa'),
  serviceType: z.enum(['endereços_fiscais', 'salas_privadas', 'coworking_flex', 'consultoria', 'outro'] as const),
  amount: z.number().min(0, 'O valor deve ser maior ou igual a zero'),
  proposalDate: z.string().min(1, 'Selecione uma data'),
  followUpAt: z.string().optional(),
  followUpNote: z.string().optional(),
});

interface ProposalModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ProposalModal({ isOpen, onClose }: ProposalModalProps) {
  const { mutate: createProposal, isLoading } = useCreateProposal();
  
  const form = useForm<z.infer<typeof formSchema>>({
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
  
  const onSubmit = (data: z.infer<typeof formSchema>) => {
    // Convert amount to cents
    const amountInCents = Math.round(data.amount * 100);
    
    const proposalData: CreateProposalInput = {
      ...data,
      amount: amountInCents,
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

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle>Nova Proposta</DialogTitle>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="companyId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Empresa / Cliente</FormLabel>
                  <Select 
                    onValueChange={field.onChange} 
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione uma empresa" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {companyOptions.map((company) => (
                        <SelectItem key={company.id} value={company.id}>
                          {company.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="serviceType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tipo de Serviço</FormLabel>
                  <Select 
                    onValueChange={field.onChange} 
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o tipo de serviço" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {serviceTypeOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="amount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Valor da Proposta</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      step="0.01"
                      min="0"
                      onChange={(e) => field.onChange(parseFloat(e.target.value))}
                      value={field.value}
                    />
                  </FormControl>
                  <div className="text-xs text-gray-500">
                    {formatCurrency(field.value)}
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="proposalDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Data da Proposta</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="border-t border-gray-200 pt-4">
              <h4 className="text-sm font-medium mb-2">Acompanhamento (opcional)</h4>
              
              <FormField
                control={form.control}
                name="followUpAt"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Data e Hora do Follow-up</FormLabel>
                    <FormControl>
                      <Input type="datetime-local" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="followUpNote"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Observação</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Informações adicionais para o acompanhamento..."
                        className="min-h-[80px]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <DialogFooter className="pt-4">
              <Button 
                type="button" 
                variant="outline" 
                onClick={onClose}
                disabled={isLoading}
              >
                Cancelar
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? 'Salvando...' : 'Salvar Proposta'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
