
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
import { validateReservationForm, showValidationError } from "@/services/reservationValidation";
import { z } from "zod";

interface NewReservationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  defaultValues?: {
    start: string;
    end: string;
  };
}

// Define validation schema
const reservationSchema = z.object({
  title: z.string().min(1, "Título é obrigatório"),
  resource: z.enum(["meet1", "meet2", "meet3", "meet4", "auditorio"]),
  start: z.string().min(1, "Data e hora inicial são obrigatórias"),
  end: z.string().min(1, "Data e hora final são obrigatórias"),
  clientId: z.string().min(1, "Cliente é obrigatório")
});

export function NewReservationDialog({ isOpen, onClose, defaultValues }: NewReservationDialogProps) {
  const { form } = useReservationForm({ 
    defaultValues: {
      ...defaultValues,
      clientId: ""
    },
    schema: reservationSchema
  });
  const createReservation = useCreateReservation();
  const selectedResource = form.watch("resource");

  const handleSubmit = async (values: any) => {
    try {
      // Validate form data using the validation service
      const validationError = validateReservationForm({
        resource: values.resource,
        start: values.start,
        end: values.end,
        selectedClient: values.clientId ? { id: values.clientId, name: "" } : null
      });

      if (validationError) {
        showValidationError(validationError);
        return;
      }

      await createReservation.mutateAsync({
        resource: values.resource,
        title: values.title,
        start: values.start,
        end: values.end,
        customerId: values.clientId,
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
      <DialogContent className="sm:max-w-[500px] z-50">
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
            
            <ClientSelect form={form} />
            
            <DateTimeFields form={form} />
            
            {selectedResource === "auditorio" && <AuditoriumWarning />}

            <DialogFooter>
              <Button type="button" variant="outline" onClick={onClose}>
                Cancelar
              </Button>
              <Button 
                type="submit" 
                disabled={createReservation.isPending || !form.formState.isValid}
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
