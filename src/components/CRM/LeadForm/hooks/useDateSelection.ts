
import { useState } from "react";
import { format } from "date-fns";

export function useDateSelection(initialDate?: string) {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(
    initialDate ? new Date(initialDate) : new Date()
  );

  const handleDateSelect = (date?: Date) => {
    setSelectedDate(date);
    return date ? format(date, "yyyy-MM-dd") : "";
  };

  const formattedDate = selectedDate ? format(selectedDate, "dd/MM/yyyy") : "";

  return {
    selectedDate,
    formattedDate,
    handleDateSelect
  };
}
