
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { Reservation } from "@/types/schedule";
import { useDeleteReservation } from "@/hooks/useReservations";
import { toast } from "@/hooks/use-toast";
import { getResourceLabel } from "./util";
import { Trash2 } from "lucide-react";

interface ReservationDetailsDialogProps {
  isOpen: boolean;
  onClose: () => void;
  reservation: Reservation;
}

export function ReservationDetailsDialog({ isOpen, onClose, reservation }: ReservationDetailsDialogProps) {
  const deleteReservation = useDeleteReservation();
  
  const formatDateTime = (isoString: string) => {
    return format(new Date(isoString), "dd/MM/yyyy HH:mm");
  };
  
  const handleDelete = async () => {
    if (!window.confirm("Tem certeza que deseja excluir esta reserva?")) {
      return;
    }
    
    try {
      await deleteReservation.mutateAsync(reservation.id);
      toast({
        title: "Reserva excluída",
        description: "A reserva foi excluída com sucesso."
      });
      onClose();
    } catch (error) {
      toast({
        title: "Erro ao excluir",
        description: "Não foi possível excluir a reserva.",
        variant: "destructive"
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[450px]">
        <DialogHeader>
          <DialogTitle>Detalhes da Reserva</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="flex flex-col space-y-1">
            <span className="text-sm text-muted-foreground">Título:</span>
            <span className="font-medium">{reservation.title}</span>
          </div>
          
          <div className="flex flex-col space-y-1">
            <span className="text-sm text-muted-foreground">Recurso:</span>
            <div className="flex items-center">
              <div 
                className="w-3 h-3 rounded-full mr-2" 
                style={{ backgroundColor: reservation.resource === "auditorio" ? "#8b5cf6" : "#3b82f6" }}
              ></div>
              <span>{getResourceLabel(reservation.resource)}</span>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col space-y-1">
              <span className="text-sm text-muted-foreground">Início:</span>
              <span>{formatDateTime(reservation.start)}</span>
            </div>
            <div className="flex flex-col space-y-1">
              <span className="text-sm text-muted-foreground">Fim:</span>
              <span>{formatDateTime(reservation.end)}</span>
            </div>
          </div>
          
          <div className="flex flex-col space-y-1">
            <span className="text-sm text-muted-foreground">Criado por:</span>
            <span>{reservation.createdBy}</span>
          </div>
        </div>
        
        <DialogFooter>
          <Button 
            variant="destructive" 
            onClick={handleDelete}
            disabled={deleteReservation.isPending}
          >
            <Trash2 className="h-4 w-4 mr-1" />
            {deleteReservation.isPending ? "Excluindo..." : "Excluir Reserva"}
          </Button>
          <Button onClick={onClose}>
            Fechar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
