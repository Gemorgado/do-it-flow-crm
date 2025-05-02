
import { toast } from "@/hooks/use-toast";
import { ComboboxOption } from "@/components/ui/combobox";

interface ValidationParams {
  resource: string;
  start: string;
  end: string;
  selectedClient: ComboboxOption | null;
}

/**
 * Validates reservation form data
 * @returns undefined if validation passes, error message if validation fails
 */
export function validateReservationForm({
  resource,
  start,
  end,
  selectedClient
}: ValidationParams): string | undefined {
  // Check if client is selected
  if (!selectedClient) {
    return "Por favor, selecione um cliente para a reserva";
  }

  // Validate auditorium time slots
  if (resource === "auditorio") {
    const startDate = new Date(start);
    const endDate = new Date(end);
    const startHour = startDate.getHours();
    const endHour = endDate.getHours();
    
    // Check if full day or half day schedule
    const isFullDay = startHour === 8 && endHour === 19;
    const isMorning = startHour === 8 && endHour === 13;
    const isAfternoon = startHour === 13 && endHour === 19;
    
    if (!isFullDay && !isMorning && !isAfternoon) {
      return "Auditório só pode ser reservado em meio-período (8h-13h ou 13h-19h) ou período completo (8h-19h)";
    }
  }

  // All validations passed
  return undefined;
}

/**
 * Displays toast with validation error message
 */
export function showValidationError(errorMessage: string): void {
  toast({
    title: "Erro de validação",
    description: errorMessage,
    variant: "destructive"
  });
}
