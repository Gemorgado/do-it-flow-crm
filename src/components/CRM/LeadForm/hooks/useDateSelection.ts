
import { useState } from "react";
import { format } from "date-fns";

export function useDateSelection(initialDate?: string) {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(
    initialDate ? new Date(initialDate) : new Date()
  );
  const [dateError, setDateError] = useState<string | null>(null);

  const handleDateSelect = (date?: Date) => {
    setSelectedDate(date);
    
    if (!date) {
      setDateError("A data é obrigatória");
      return "";
    }
    
    try {
      setDateError(null);
      return format(date, "yyyy-MM-dd");
    } catch (error) {
      setDateError("Data inválida");
      return "";
    }
  };

  const formattedDate = selectedDate ? format(selectedDate, "dd/MM/yyyy") : "";

  return {
    selectedDate,
    formattedDate,
    handleDateSelect,
    dateError
  };
}
