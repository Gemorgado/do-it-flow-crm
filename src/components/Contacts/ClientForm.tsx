
import React, { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, Controller } from "react-hook-form";
import * as z from "zod";
import { ServiceType } from "@/types/service";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "@/hooks/use-toast";
import { v4 as uuidv4 } from "uuid";
import { useClientFormEnhancements } from "@/hooks/useClientFormEnhancements";
import { Location, SpaceBinding } from "@/types";
import { persistence } from "@/integrations/persistence";

const clientFormSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(2, {
    message: "O nome precisa ter pelo menos 2 caracteres.",
  }),
  company: z.string().optional(),
  email: z.string().email({
    message: "Por favor insira um e-mail válido.",
  }),
  phone: z.string().min(8, {
    message: "Insira um número de telefone válido.",
  }),
  plan: z.string().optional(),
  contractStart: z.date().optional(),
  contractEnd: z.date().optional(),
  contractTerm: z.number().int().min(0).optional(),
  contractValue: z.number().min(0).optional(),
  dueDay: z.number().int().min(1).max(31).optional(),
  privateRoom: z.string().optional(),
  selectedSpaceId: z.string().optional(),
  billingEmails: z.string().optional(),
  lastReadjustDate: z.date().optional(),
  readjustIndex: z.string().optional(),
  isActive: z.boolean().default(true),
  address: z.string().optional(),
  notes: z.string().optional()
}).refine(data => {
  // Validate that contractEnd is after contractStart if both are provided
  if (data.contractStart && data.contractEnd) {
    return data.contractEnd > data.contractStart;
  }
  return true;
}, {
  message: "A data de término deve ser posterior à data de início",
  path: ["contractEnd"]
});

type ClientFormValues = z.infer<typeof clientFormSchema>;

const defaultValues: Partial<ClientFormValues> = {
  name: "",
  company: "",
  email: "",
  phone: "",
  isActive: true
};

interface ClientFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
  initialData?: any;
}

export function ClientForm({ onSuccess, onCancel, initialData }: ClientFormProps) {
  const { planOptions, getAvailableSpaces } = useClientFormEnhancements();
  const [availableSpaces, setAvailableSpaces] = useState<Location[]>([]);

  const form = useForm<ClientFormValues>({
    resolver: zodResolver(clientFormSchema),
    defaultValues: initialData || defaultValues,
  });

  const watchPlan = form.watch("plan");
  
  // Update available spaces when plan changes
  useEffect(() => {
    if (watchPlan === 'sala_privativa' || watchPlan === 'estacao_fixa') {
      const spaces = getAvailableSpaces(watchPlan as ServiceType);
      setAvailableSpaces(spaces);
    } else {
      setAvailableSpaces([]);
    }
  }, [watchPlan, getAvailableSpaces]);

  const handleSubmit = async (data: ClientFormValues) => {
    try {
      // Process the billingEmails string to array
      const billingEmailsArray = data.billingEmails 
        ? data.billingEmails.split(';').map(email => email.trim()).filter(Boolean)
        : [];

      // Format dates as strings
      const formattedData = {
        ...data,
        id: data.id || uuidv4(),
        billingEmails: billingEmailsArray,
        contractStart: data.contractStart ? format(data.contractStart, 'yyyy-MM-dd') : undefined,
        contractEnd: data.contractEnd ? format(data.contractEnd, 'yyyy-MM-dd') : undefined,
        lastReadjustDate: data.lastReadjustDate ? format(data.lastReadjustDate, 'yyyy-MM-dd') : undefined,
        createdBy: initialData?.createdBy || "current-user", // In a real app, this would be the current user
        createdAt: initialData?.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        status: data.isActive ? "ativo" : "inativo",
        services: initialData?.services || []
      };

      // Handle space binding if a space was selected
      if (data.selectedSpaceId && (data.plan === 'sala_privativa' || data.plan === 'estacao_fixa')) {
        try {
          // Create a binding between client and space
          const binding: SpaceBinding = {
            spaceId: data.selectedSpaceId,
            clientId: formattedData.id,
            contractId: uuidv4(),
            boundAt: new Date().toISOString(),
            startDate: data.contractStart ? format(data.contractStart, 'yyyy-MM-dd') : undefined,
            endDate: data.contractEnd ? format(data.contractEnd, 'yyyy-MM-dd') : undefined,
            unitPrice: data.contractValue || null
          };
          
          await persistence.bindSpace(binding);
          
          console.log("Space binding created successfully");
        } catch (error) {
          console.error("Error binding space to client:", error);
          // Continue with client creation even if binding fails
        }
      }

      // In a real application, this would make an API call to save the client
      console.log("Client form submitted:", formattedData);
      
      // Show success message
      toast({
        title: `Cliente ${initialData ? 'atualizado' : 'criado'} com sucesso!`,
        description: `${data.name} foi ${initialData ? 'atualizado' : 'adicionado'} à sua lista de clientes.`,
      });
      
      // Reset form and close modal
      if (!initialData) form.reset();
      if (onSuccess) onSuccess();
    } catch (error) {
      toast({
        title: "Erro ao salvar cliente",
        description: "Ocorreu um erro ao processar sua solicitação.",
        variant: "destructive",
      });
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nome*</FormLabel>
              <FormControl>
                <Input placeholder="Nome do cliente" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="company"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Empresa</FormLabel>
                <FormControl>
                  <Input placeholder="Nome da empresa" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="plan"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Plano</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione um plano" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {planOptions.map((option) => (
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
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email*</FormLabel>
                <FormControl>
                  <Input placeholder="email@exemplo.com" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Telefone*</FormLabel>
                <FormControl>
                  <Input placeholder="(00) 00000-0000" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Space selection when plan is sala_privativa or estacao_fixa */}
        {(watchPlan === 'sala_privativa' || watchPlan === 'estacao_fixa') && (
          <FormField
            control={form.control}
            name="selectedSpaceId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  {watchPlan === 'sala_privativa' ? 'Selecione uma sala' : 'Selecione uma estação'}
                </FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder={
                        availableSpaces.length > 0 
                          ? "Selecione um espaço" 
                          : "Nenhum espaço disponível"
                      } />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {availableSpaces.length > 0 ? (
                      availableSpaces.map((space) => (
                        <SelectItem key={space.id} value={space.id}>
                          {space.name || space.id}
                        </SelectItem>
                      ))
                    ) : (
                      <SelectItem value="none" disabled>
                        Nenhum espaço disponível
                      </SelectItem>
                    )}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="contractStart"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Data de Início</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "pl-3 text-left font-normal",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        {field.value ? (
                          format(field.value, "dd/MM/yyyy")
                        ) : (
                          <span>Escolha uma data</span>
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
          
          <FormField
            control={form.control}
            name="contractEnd"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Data de Término</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "pl-3 text-left font-normal",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        {field.value ? (
                          format(field.value, "dd/MM/yyyy")
                        ) : (
                          <span>Escolha uma data</span>
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
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <FormField
            control={form.control}
            name="contractTerm"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Fidelidade (meses)</FormLabel>
                <FormControl>
                  <Input 
                    type="number" 
                    min={0} 
                    {...field} 
                    onChange={e => field.onChange(e.target.value ? Number(e.target.value) : undefined)} 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="contractValue"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Valor</FormLabel>
                <FormControl>
                  <Input 
                    type="number"
                    min={0}
                    step={0.01}
                    placeholder="0,00" 
                    {...field}
                    onChange={e => field.onChange(e.target.value ? Number(e.target.value) : undefined)}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="dueDay"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Dia de Vencimento</FormLabel>
                <FormControl>
                  <Input 
                    type="number" 
                    min={1} 
                    max={31}
                    placeholder="1-31"
                    {...field}
                    onChange={e => field.onChange(e.target.value ? Number(e.target.value) : undefined)}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="privateRoom"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Sala Privativa</FormLabel>
                <FormControl>
                  <Input placeholder="Nº ou identificação da sala" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="lastReadjustDate"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Data do Último Reajuste</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "pl-3 text-left font-normal",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        {field.value ? (
                          format(field.value, "dd/MM/yyyy")
                        ) : (
                          <span>Escolha uma data</span>
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
        </div>
        
        <FormField
          control={form.control}
          name="readjustIndex"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Índice de Reajuste</FormLabel>
              <Select
                onValueChange={field.onChange}
                defaultValue={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione um índice" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="ipca">IPCA</SelectItem>
                  <SelectItem value="igpm">IGP-M</SelectItem>
                  <SelectItem value="inpc">INPC</SelectItem>
                  <SelectItem value="outro">Outro</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="billingEmails"
          render={({ field }) => (
            <FormItem>
              <FormLabel>E-mails para Avisos Financeiros</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="email1@exemplo.com; email2@exemplo.com" 
                  {...field} 
                  className="resize-none"
                />
              </FormControl>
              <FormDescription>
                Separe os e-mails por ponto e vírgula (;)
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="address"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Endereço</FormLabel>
              <FormControl>
                <Input placeholder="Endereço completo" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="notes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Observações</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Informações adicionais" 
                  {...field} 
                  className="resize-none"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="isActive"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <FormLabel className="text-base">
                  Cliente Ativo
                </FormLabel>
                <FormDescription>
                  Determina se o cliente está ativo no sistema
                </FormDescription>
              </div>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
            </FormItem>
          )}
        />

        <div className="flex justify-end space-x-2 pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
          >
            Cancelar
          </Button>
          <Button 
            type="submit"
            className="bg-doIt-primary hover:bg-doIt-dark"
          >
            {initialData ? "Atualizar Cliente" : "Criar Cliente"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
