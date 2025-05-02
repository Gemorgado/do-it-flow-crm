
import { useForm } from "react-hook-form";
import { Resource } from "@/types/schedule";
import { useState } from "react";
import { ComboboxOption } from "@/components/ui/combobox";
import { parseISO } from "date-fns";

export interface ReservationFormValues {
  title: string;
  resource: Resource;
  start: string;
  end: string;
}

interface UseReservationFormProps {
  defaultValues?: {
    start: string;
    end: string;
  };
}

export function useReservationForm({ defaultValues }: UseReservationFormProps = {}) {
  const [selectedClient, setSelectedClient] = useState<ComboboxOption | null>(null);
  
  const form = useForm<ReservationFormValues>({
    defaultValues: {
      title: "",
      resource: "meet1" as Resource, // Default resource
      start: defaultValues?.start ? parseISO(defaultValues.start).toISOString().slice(0, 16) : "",
      end: defaultValues?.end ? parseISO(defaultValues.end).toISOString().slice(0, 16) : ""
    },
  });

  return {
    form,
    selectedClient,
    setSelectedClient
  };
}
