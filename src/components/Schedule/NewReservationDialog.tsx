
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useCreateReservation } from "@/hooks/useReservations";
import { toast } from "@/hooks/use-toast";
import { ResourceSelect } from "./ResourceSelect";
import { ClientSelect } from "./ClientSelect";
import { DateTimeFields } from "./DateTimeFields";
import { AuditoriumWarning } from "./AuditoriumWarning";
import { useReservationForm } from "@/hooks/useReservationForm";
import { ComboboxOption } from "@/components/ui/combobox";

interface NewReservationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  defaultValues?: {
    start: string;
    end: string;
  };
}

export function NewReservationDialog({ isOpen, onClose, defaultValues }: NewReservationDialogProps) {
  const { form, selectedClient, setSelectedClient } = useReservationForm({ defaultValues });
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

  const handleClientSelect = (client: ComboboxOption) => {
    setSelectedClient(client);
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
            
            <ResourceSelect form={form} />
            
            <div className="grid grid-cols-1 gap-4">
              <ClientSelect 
                selectedClient={selectedClient} 
                onSelectClient={handleClientSelect} 
              />
            </div>
            
            <DateTimeFields form={form} />
            
            {selectedResource === "auditorio" && <AuditoriumWarning />}

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
