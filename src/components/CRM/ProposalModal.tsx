
import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { CalendarIcon, Clock } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { useCreateProposal } from "@/api/proposals";
import { CreateProposalInput, ServiceType } from "@/types/proposal";

// Mock companies data for the select
const MOCK_COMPANIES = [
  { id: "comp1", name: "Empresa ABC Ltda" },
  { id: "comp2", name: "Comércio XYZ S.A." },
  { id: "comp3", name: "Indústria Exemplo" },
  { id: "comp4", name: "Startup Inovadora" },
  { id: "comp5", name: "Consultoria Técnica" },
];

const SERVICE_TYPES: { value: ServiceType; label: string }[] = [
  { value: "endereços_fiscais", label: "Endereços Fiscais" },
  { value: "salas_privadas", label: "Salas Privadas" },
  { value: "coworking_flex", label: "Coworking Flexível" },
  { value: "consultoria", label: "Consultoria" },
  { value: "outro", label: "Outro" },
];

const proposalSchema = z.object({
  companyId: z.string({
    required_error: "Selecione uma empresa",
  }),
  serviceType: z.enum(["endereços_fiscais", "salas_privadas", "coworking_flex", "consultoria", "outro"] as const, {
    required_error: "Selecione um tipo de serviço",
  }),
  amount: z.number({
    required_error: "Informe o valor da proposta",
    invalid_type_error: "Valor deve ser um número",
  }).nonnegative("O valor deve ser maior ou igual a zero"),
  proposalDate: z.date({
    required_error: "Selecione a data da proposta",
  }),
  followUpAt: z.date().optional(),
  followUpNote: z.string().optional(),
});

type ProposalFormValues = z.infer<typeof proposalSchema>;

interface ProposalModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ProposalModal({ isOpen, onClose }: ProposalModalProps) {
  const createProposal = useCreateProposal();
  
  const form = useForm<ProposalFormValues>({
    resolver: zodResolver(proposalSchema),
    defaultValues: {
      companyId: "",
      serviceType: "endereços_fiscais",
      amount: 0,
      proposalDate: new Date(),
      followUpNote: "",
    },
  });

  function onSubmit(values: ProposalFormValues) {
    const input: CreateProposalInput = {
      companyId: values.companyId,
      serviceType: values.serviceType,
      // Convert to cents
      amount: Math.round(values.amount * 100),
      proposalDate: format(values.proposalDate, "yyyy-MM-dd"),
      followUpAt: values.followUpAt ? values.followUpAt.toISOString() : undefined,
      followUpNote: values.followUpNote,
    };

    createProposal.mutate(input, {
      onSuccess: () => {
        onClose();
        form.reset();
      }
    });
  }

  // Format currency
  const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  };

  // Parse currency input
  const parseCurrencyInput = (value: string): number => {
    // Remove non-numeric characters and convert to number
    const numericValue = value.replace(/[^\d]/g, "");
    return numericValue ? parseInt(numericValue) / 100 : 0;
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Nova Proposta</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
            {/* Company Select */}
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
                      {MOCK_COMPANIES.map((company) => (
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

            {/* Service Type */}
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
                      {SERVICE_TYPES.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Amount */}
            <FormField
              control={form.control}
              name="amount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Valor da Proposta</FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      inputMode="decimal"
                      value={formatCurrency(field.value)}
                      onChange={(e) => {
                        field.onChange(parseCurrencyInput(e.target.value));
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Proposal Date */}
            <FormField
              control={form.control}
              name="proposalDate"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Data da Proposta</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-full pl-3 text-left font-normal",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value ? (
                            format(field.value, "PPP", { locale: ptBR })
                          ) : (
                            <span>Selecione uma data</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        initialFocus
                        className="p-3 pointer-events-auto"
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Follow-up Date */}
            <FormField
              control={form.control}
              name="followUpAt"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Data de Follow-up (opcional)</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-full pl-3 text-left font-normal",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value ? (
                            format(field.value, "PPP 'às' HH:mm", { locale: ptBR })
                          ) : (
                            <span>Selecione uma data para follow-up</span>
                          )}
                          <Clock className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <div className="p-3">
                        <Calendar
                          mode="single"
                          selected={field.value || undefined}
                          onSelect={(date) => {
                            if (date) {
                              const currentTime = field.value || new Date();
                              date.setHours(currentTime.getHours());
                              date.setMinutes(currentTime.getMinutes());
                              field.onChange(date);
                            } else {
                              field.onChange(undefined);
                            }
                          }}
                          initialFocus
                          className="pointer-events-auto"
                        />
                        <div className="mt-4 flex justify-between border-t pt-4">
                          <div className="flex items-center space-x-2">
                            <Input
                              type="time"
                              className="w-full"
                              onChange={(e) => {
                                if (!e.target.value || !field.value) return;
                                
                                const [hours, minutes] = e.target.value.split(":").map(Number);
                                const date = field.value || new Date();
                                date.setHours(hours);
                                date.setMinutes(minutes);
                                field.onChange(new Date(date));
                              }}
                              value={field.value ? 
                                `${field.value.getHours().toString().padStart(2, '0')}:${field.value.getMinutes().toString().padStart(2, '0')}` : 
                                ""
                              }
                            />
                          </div>
                        </div>
                      </div>
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Follow-up Note */}
            <FormField
              control={form.control}
              name="followUpNote"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Observação (opcional)</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Adicione observações sobre o follow-up"
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter className="pt-4">
              <Button 
                type="button" 
                variant="outline" 
                onClick={onClose}
                disabled={createProposal.isPending}
              >
                Cancelar
              </Button>
              <Button 
                type="submit"
                disabled={createProposal.isPending}
              >
                {createProposal.isPending ? "Salvando..." : "Salvar Proposta"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
