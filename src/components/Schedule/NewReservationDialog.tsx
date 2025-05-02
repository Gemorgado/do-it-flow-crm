
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useCreateReservation } from "@/hooks/useReservations";
import { formatISO, parseISO } from "date-fns";
import { toast } from "@/hooks/use-toast";
import { Resource, RESOURCES } from "@/constants/resources";
import { getResourceColor } from "./util";
import { useClients } from "@/hooks/useClients";
import { Combobox, ComboboxOption } from "@/components/ui/combobox";
import * as SelectPrimitive from "@radix-ui/react-select";
import { Check, ChevronDown } from "lucide-react";

interface NewReservationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  defaultValues?: {
    start: string;
    end: string;
  };
}

export function NewReservationDialog({ isOpen, onClose, defaultValues }: NewReservationDialogProps) {
  const [selectedClient, setSelectedClient] = useState<ComboboxOption | null>(null);
  const { data: clients = [] } = useClients();

  const form = useForm({
    defaultValues: {
      title: "",
      resource: "meet1" as Resource, // Default resource
      start: defaultValues?.start ? parseISO(defaultValues.start).toISOString().slice(0, 16) : "",
      end: defaultValues?.end ? parseISO(defaultValues.end).toISOString().slice(0, 16) : ""
    },
  });

  const createReservation = useCreateReservation();
  const selectedResource = form.watch("resource");

  const handleSubmit = async (values: any) => {
    try {
      const isAuditorium = values.resource === "auditorio";
      
      // If it's the auditorium, we need to validate the time range
      if (isAuditorium) {
        const startDate = new Date(values.start);
        const endDate = new Date(values.end);
        const startHour = startDate.getHours();
        const endHour = endDate.getHours();
        
        // Check if full day or half day schedule
        const isFullDay = startHour === 8 && endHour === 19;
        const isMorning = startHour === 8 && endHour === 13;
        const isAfternoon = startHour === 13 && endHour === 19;
        
        if (!isFullDay && !isMorning && !isAfternoon) {
          toast({
            title: "Horário inválido",
            description: "Auditório só pode ser reservado em meio-período (8h-13h ou 13h-19h) ou período completo (8h-19h)",
            variant: "destructive"
          });
          return;
        }
      }
      
      if (!selectedClient) {
        toast({
          title: "Cliente não selecionado",
          description: "Por favor, selecione um cliente para a reserva",
          variant: "destructive"
        });
        return;
      }

      await createReservation.mutateAsync({
        resource: values.resource,
        title: values.title,
        start: values.start,
        end: values.end,
        customerId: selectedClient.id,
        createdBy: "current-user" // In a real app, get from authentication context
      });
      
      toast({
        title: "Reserva criada",
        description: "A reserva foi criada com sucesso."
      });
      
      onClose();
    } catch (error: any) {
      toast({
        title: "Erro ao criar reserva",
        description: error.message || "Ocorreu um erro ao criar a reserva",
        variant: "destructive"
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Nova Reserva</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Título da Reserva</FormLabel>
                  <FormControl>
                    <Input placeholder="Ex: Reunião com Cliente" required {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="resource"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Recurso</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <SelectPrimitive.Root
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        <SelectPrimitive.Trigger
                          className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          <SelectPrimitive.Value>
                            {RESOURCES.find(r => r.id === field.value)?.label || "Selecione um recurso"}
                          </SelectPrimitive.Value>
                          <SelectPrimitive.Icon>
                            <ChevronDown className="h-4 w-4 opacity-50" />
                          </SelectPrimitive.Icon>
                        </SelectPrimitive.Trigger>
                        
                        <SelectPrimitive.Portal>
                          <SelectPrimitive.Content
                            className="z-50 overflow-hidden rounded-md border bg-popover text-popover-foreground shadow-md animate-in fade-in-80"
                            position="popper" 
                            sideOffset={5}
                          >
                            <SelectPrimitive.Viewport className="p-1">
                              {RESOURCES.map(resource => (
                                <SelectPrimitive.Item
                                  key={resource.id}
                                  value={resource.id}
                                  className="relative flex h-9 cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none hover:bg-accent hover:text-accent-foreground data-[highlighted]:bg-accent data-[highlighted]:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50"
                                >
                                  <div className="flex items-center">
                                    <div
                                      className="w-3 h-3 rounded-full mr-2"
                                      style={{ backgroundColor: getResourceColor(resource.id) }}
                                    ></div>
                                    <SelectPrimitive.ItemText>{resource.label}</SelectPrimitive.ItemText>
                                  </div>
                                  <SelectPrimitive.ItemIndicator className="absolute right-2">
                                    <Check className="h-4 w-4" />
                                  </SelectPrimitive.ItemIndicator>
                                </SelectPrimitive.Item>
                              ))}
                            </SelectPrimitive.Viewport>
                          </SelectPrimitive.Content>
                        </SelectPrimitive.Portal>
                      </SelectPrimitive.Root>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="grid grid-cols-1 gap-4">
              <FormItem>
                <FormLabel>Cliente</FormLabel>
                <Combobox
                  options={clients.map(client => ({ id: client.id, name: client.name }))}
                  selected={selectedClient}
                  onSelect={(client) => setSelectedClient(client)}
                  getOptionLabel={(client) => client.name}
                  placeholder="Selecione o cliente"
                  searchPlaceholder="Buscar cliente..."
                  emptyMessage="Nenhum cliente encontrado"
                />
                {!selectedClient && (
                  <p className="text-xs text-orange-600 mt-1">
                    É necessário selecionar um cliente
                  </p>
                )}
              </FormItem>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="start"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Início</FormLabel>
                    <FormControl>
                      <Input type="datetime-local" required {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="end"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Fim</FormLabel>
                    <FormControl>
                      <Input type="datetime-local" required {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            {selectedResource === "auditorio" && (
              <div className="bg-amber-50 p-3 rounded-md">
                <p className="text-sm text-amber-800">
                  Para o Auditório, as reservas devem seguir um dos formatos:
                </p>
                <ul className="list-disc ml-5 text-sm text-amber-800">
                  <li>Meio período manhã: 8h-13h</li>
                  <li>Meio período tarde: 13h-19h</li>
                  <li>Período completo: 8h-19h</li>
                </ul>
              </div>
            )}

            <DialogFooter>
              <Button type="button" variant="outline" onClick={onClose}>
                Cancelar
              </Button>
              <Button 
                type="submit" 
                disabled={createReservation.isPending || !selectedClient}
              >
                {createReservation.isPending ? "Salvando..." : "Salvar Reserva"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
