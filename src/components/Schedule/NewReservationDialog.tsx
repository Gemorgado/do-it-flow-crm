
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useCreateReservation } from "@/hooks/useReservations";
import { formatISO, parseISO } from "date-fns";
import { toast } from "@/hooks/use-toast";
import { Resource } from "@/types/schedule";
import { getResourceColor, getResourceLabel } from "./util";

interface NewReservationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  defaultValues?: {
    start: string;
    end: string;
  };
}

export function NewReservationDialog({ isOpen, onClose, defaultValues }: NewReservationDialogProps) {
  const [selectedResource, setSelectedResource] = useState<Resource>("meet1");

  const form = useForm({
    defaultValues: {
      title: "",
      start: defaultValues?.start ? parseISO(defaultValues.start).toISOString().slice(0, 16) : "",
      end: defaultValues?.end ? parseISO(defaultValues.end).toISOString().slice(0, 16) : ""
    },
  });

  const createReservation = useCreateReservation();

  const handleSubmit = async (values: any) => {
    try {
      const isAuditorium = selectedResource === "auditorio";
      
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

      await createReservation.mutateAsync({
        resource: selectedResource,
        title: values.title,
        start: values.start,
        end: values.end,
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
  
  const resourceOptions: Resource[] = ["meet1", "meet2", "meet3", "meet4", "auditorio"];

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
            
            <div className="grid grid-cols-1 gap-4">
              <FormItem>
                <FormLabel>Recurso</FormLabel>
                <Select
                  value={selectedResource}
                  onValueChange={(value: Resource) => setSelectedResource(value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione um recurso" />
                  </SelectTrigger>
                  <SelectContent>
                    {resourceOptions.map((resource) => (
                      <SelectItem
                        key={resource}
                        value={resource}
                        className="flex items-center"
                      >
                        <div className="flex items-center">
                          <div
                            className="w-3 h-3 rounded-full mr-2"
                            style={{ backgroundColor: getResourceColor(resource) }}
                          ></div>
                          {getResourceLabel(resource)}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
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
                disabled={createReservation.isPending}
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
