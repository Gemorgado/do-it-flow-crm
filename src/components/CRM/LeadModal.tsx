
import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
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
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { LeadFormValues } from "@/types/crm";
import { useCreateLead } from "@/api/crm";
import { formatDocument, validateDocument } from "@/utils/documentUtils";
import { useLeadModal } from "./hooks/useModalContext";
import { pipelineStages } from "@/data/leadsData";

// Schema de validação usando Zod
const leadFormSchema = z.object({
  companyOrPerson: z.string().min(3, {
    message: "Nome da empresa ou pessoa deve ter pelo menos 3 caracteres",
  }),
  idNumber: z.string().refine(validateDocument, {
    message: "CNPJ ou CPF inválido",
  }),
  entryDate: z.string(),
  interestService: z.string().min(1, {
    message: "Serviço de interesse é obrigatório",
  }),
  employees: z.number().optional(),
  annualRevenue: z.number().optional(),
  sourceCategory: z.enum(["indicacao", "rede_social", "outro"]),
  sourceDetail: z.string().optional(),
  stageId: z.string().optional(),
});

/**
 * Modal para criação de novos leads
 */
export function LeadModal() {
  const { isOpen, close, options } = useLeadModal();
  const { mutate, isPending } = useCreateLead();
  
  // Get preset stage ID if provided
  const presetStageId = options?.presetStage?.id;

  const form = useForm<LeadFormValues & { stageId?: string }>({
    resolver: zodResolver(leadFormSchema),
    defaultValues: {
      companyOrPerson: "",
      idNumber: "",
      entryDate: format(new Date(), "yyyy-MM-dd"),
      interestService: "",
      sourceCategory: "outro",
      sourceDetail: "",
      stageId: presetStageId || pipelineStages[0].id,
    },
  });

  const onSubmit = (data: LeadFormValues & { stageId?: string }) => {
    mutate({
      ...data,
      stageId: data.stageId || presetStageId || pipelineStages[0].id
    }, {
      onSuccess: () => {
        close();
        form.reset();
      },
    });
  };

  const handleIdNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formattedValue = formatDocument(e.target.value);
    form.setValue("idNumber", formattedValue);
  };

  return (
    <Dialog open={isOpen} onOpenChange={close}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Novo Lead</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="companyOrPerson"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Empresa/Pessoa*</FormLabel>
                  <FormControl>
                    <Input placeholder="Nome da empresa ou pessoa" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="idNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>CNPJ/CPF*</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="00.000.000/0000-00 ou 000.000.000-00" 
                      {...field}
                      onChange={handleIdNumberChange}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="entryDate"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Data de Entrada*</FormLabel>
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
                            format(new Date(field.value), "dd/MM/yyyy")
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
                        selected={field.value ? new Date(field.value) : undefined}
                        onSelect={(date) => date && field.onChange(format(date, "yyyy-MM-dd"))}
                        initialFocus
                        className="pointer-events-auto"
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="interestService"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Serviço de Interesse*</FormLabel>
                  <FormControl>
                    <Input placeholder="Descreva o serviço" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {!presetStageId && (
              <FormField
                control={form.control}
                name="stageId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Estágio*</FormLabel>
                    <Select 
                      onValueChange={field.onChange} 
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione o estágio" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {pipelineStages.map((stage) => (
                          <SelectItem key={stage.id} value={stage.id}>
                            {stage.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="employees"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Número de Funcionários</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        placeholder="0" 
                        {...field}
                        onChange={(e) => field.onChange(e.target.value === "" ? undefined : Number(e.target.value))}
                        className="w-full"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="annualRevenue"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Faturamento Anual</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        placeholder="0" 
                        {...field}
                        onChange={(e) => field.onChange(e.target.value === "" ? undefined : Number(e.target.value))}
                        className="w-full"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="sourceCategory"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Origem*</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione a origem" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="indicacao">Indicação</SelectItem>
                      <SelectItem value="rede_social">Rede Social</SelectItem>
                      <SelectItem value="outro">Outro</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="sourceDetail"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Detalhes da Origem</FormLabel>
                  <FormControl>
                    <Input placeholder="Ex: Instagram, indicação de João" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button type="button" variant="outline" onClick={close}>
                Cancelar
              </Button>
              <Button type="submit" disabled={isPending}>
                {isPending ? "Salvando..." : "Salvar"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
