
import { useForm } from "react-hook-form";
import { Resource } from "@/types/schedule";
import { parseISO } from "date-fns";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

export interface ReservationFormValues {
  title: string;
  resource: Resource;
  start: string;
  end: string;
  clientId: string;
}

interface UseReservationFormProps {
  defaultValues?: Partial<ReservationFormValues>;
  schema?: z.ZodType<any>;
}

export function useReservationForm({ defaultValues, schema }: UseReservationFormProps = {}) {
  const form = useForm<ReservationFormValues>({
    defaultValues: {
      title: "",
      resource: "meet1" as Resource, // Default resource
      start: defaultValues?.start ? parseISO(defaultValues.start).toISOString().slice(0, 16) : "",
      end: defaultValues?.end ? parseISO(defaultValues.end).toISOString().slice(0, 16) : "",
      clientId: defaultValues?.clientId || "",
    },
    resolver: schema ? zodResolver(schema) : undefined,
  });

  return {
    form
  };
}
