
import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
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
import { ContactModalValues, contactModalSchema } from "@/schemas/contactFormSchemas";
import { useContactModal } from "./hooks/useModalContext";
import { formatDocument } from "@/utils/documentUtils";
import { toast } from "sonner";
import { contactPersistence } from "@/integrations/persistence/contactPersistence";

/**
 * Modal para criação de novos contatos
 */
export function ContactModal() {
  const { isOpen, close } = useContactModal();
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const form = useForm<ContactModalValues>({
    resolver: zodResolver(contactModalSchema),
    defaultValues: {
      contactName: "",
      email: "",
      phone: "",
      companyOrPerson: "",
      idNumber: "",
      entryDate: format(new Date(), "yyyy-MM-dd"),
      interestService: "",
      sourceCategory: "outro",
      sourceDetail: "",
    },
  });

  const onSubmit = async (data: ContactModalValues) => {
    console.log("Submitting form data:", data);
    
    try {
      setIsSubmitting(true);
      // Usar o sistema de persistência local em vez da API
      await contactPersistence.createContact(data);
      
      toast.success("Contato criado com sucesso", {
        description: "O contato foi adicionado ao sistema"
      });
      
      close();
      form.reset();
    } catch (error) {
      console.error("Error in onSubmit:", error);
      toast.error("Erro ao criar contato", {
        description: "Ocorreu um erro ao processar sua solicitação."
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleIdNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formattedValue = formatDocument(e.target.value);
    form.setValue("idNumber", formattedValue);
  };
  
  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Formata o telefone como (00) 00000-0000
    const value = e.target.value.replace(/\D/g, '');
    const formattedValue = value
      .replace(/^(\d{2})(\d)/g, '($1) $2')
      .replace(/(\d)(\d{4})$/, '$1-$2');
    
    form.setValue("phone", formattedValue);
  };

  return (
    <Dialog open={isOpen} onOpenChange={close}>
      <DialogContent 
        className="sm:max-w-[500px]"
        style={{ 
          backgroundColor: "white", 
          opacity: 1, 
          zIndex: 150
        }}
      >
        <DialogHeader>
          <DialogTitle>Novo Contato</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="contactName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome do Contato*</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="Nome completo" 
                      {...field} 
                      style={{ backgroundColor: "white", color: "#333" }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email*</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="email@exemplo.com" 
                        {...field} 
                        style={{ backgroundColor: "white", color: "#333" }}
                      />
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
                      <Input 
                        placeholder="(00) 00000-0000" 
                        {...field}
                        onChange={handlePhoneChange}
                        style={{ backgroundColor: "white", color: "#333" }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="companyOrPerson"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Empresa/Pessoa*</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="Nome da empresa ou pessoa" 
                      {...field} 
                      style={{ backgroundColor: "white", color: "#333" }}
                    />
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
                  <FormLabel>CNPJ/CPF</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="00.000.000/0000-00 ou 000.000.000-00" 
                      {...field}
                      onChange={handleIdNumberChange}
                      style={{ backgroundColor: "white", color: "#333" }}
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
                          style={{ backgroundColor: "white", color: "#333" }}
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
                    <PopoverContent 
                      className="w-auto p-0" 
                      align="start"
                      style={{ 
                        zIndex: 200, 
                        backgroundColor: "white", 
                        visibility: "visible",
                        opacity: 1
                      }}
                    >
                      <Calendar
                        mode="single"
                        selected={field.value ? new Date(field.value) : undefined}
                        onSelect={(date) => date && field.onChange(format(date, "yyyy-MM-dd"))}
                        initialFocus
                        className="pointer-events-auto p-3"
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
                  <FormLabel>Serviço de Interesse</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="Descreva o serviço" 
                      {...field} 
                      style={{ backgroundColor: "white", color: "#333" }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="sourceCategory"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Origem*</FormLabel>
                  <Select 
                    onValueChange={field.onChange} 
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger style={{ backgroundColor: "white", color: "#333" }}>
                        <SelectValue placeholder="Selecione a origem" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent style={{ 
                      backgroundColor: "white",
                      zIndex: 200,
                      opacity: 1,
                      visibility: "visible" 
                    }}>
                      <SelectItem value="indicacao" style={{ backgroundColor: "white", color: "#333" }}>Indicação</SelectItem>
                      <SelectItem value="rede_social" style={{ backgroundColor: "white", color: "#333" }}>Rede Social</SelectItem>
                      <SelectItem value="outro" style={{ backgroundColor: "white", color: "#333" }}>Outro</SelectItem>
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
                    <Input 
                      placeholder="Ex: Instagram, indicação de João" 
                      {...field} 
                      style={{ backgroundColor: "white", color: "#333" }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button 
                type="button" 
                variant="outline" 
                onClick={close}
                disabled={isSubmitting}
                style={{ backgroundColor: "white", color: "#333", opacity: 1 }}
              >
                Cancelar
              </Button>
              <Button 
                type="submit" 
                disabled={isSubmitting}
                style={{ backgroundColor: "hsl(var(--primary))", color: "white", opacity: 1 }}
              >
                {isSubmitting ? (
                  <>
                    <span className="opacity-0">Salvar</span>
                    <span className="absolute inset-0 flex items-center justify-center">
                      <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                    </span>
                  </>
                ) : "Salvar"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
