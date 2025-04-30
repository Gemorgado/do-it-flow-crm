import React from "react";
import { useFormContext } from "react-hook-form";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { pipelineStages } from "@/data/leadsData";
import { PipelineStage } from "@/types";
import { formatDocument } from "@/utils/documentUtils";
import { LeadFormValues } from "@/types/crm";

export const CompanyPersonField = () => {
  const { control } = useFormContext<LeadFormValues>();
  
  return (
    <FormField
      control={control}
      name="companyOrPerson"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Empresa/Pessoa*</FormLabel>
          <FormControl>
            <Input placeholder="Nome da empresa ou pessoa" {...field} />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export const IdNumberField = () => {
  const { control, setValue } = useFormContext<LeadFormValues>();
  
  const handleIdNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formattedValue = formatDocument(e.target.value);
    setValue("idNumber", formattedValue);
  };
  
  return (
    <FormField
      control={control}
      name="idNumber"
      render={({ field }) => (
        <FormItem>
          <FormLabel>CNPJ/CPF*</FormLabel>
          <FormControl>
            <Input 
              placeholder="00.000.000/0000-00 ou 000.000.000-00" 
              {...field}
              onChange={handleIdNumberChange}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export const EntryDateField = () => {
  const { control } = useFormContext<LeadFormValues>();
  
  return (
    <FormField
      control={control}
      name="entryDate"
      render={({ field }) => (
        <FormItem className="flex flex-col">
          <FormLabel>Data de Entrada*</FormLabel>
          <Popover>
            <PopoverTrigger asChild>
              <FormControl>
                <Button
                  variant={"outline"}
                  className={cn(
                    "w-full pl-3 text-left font-normal",
                    !field.value && "text-muted-foreground"
                  )}
                >
                  {field.value ? (
                    format(new Date(field.value), "dd/MM/yyyy")
                  ) : (
                    <span>Selecione uma data</span>
                  )}
                  <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                </Button>
              </FormControl>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={field.value ? new Date(field.value) : undefined}
                onSelect={(date) => date && field.onChange(format(date, "yyyy-MM-dd"))}
                initialFocus
                className="pointer-events-auto"
              />
            </PopoverContent>
          </Popover>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export const InterestServiceField = () => {
  const { control } = useFormContext<LeadFormValues>();
  
  return (
    <FormField
      control={control}
      name="interestService"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Serviço de Interesse*</FormLabel>
          <FormControl>
            <Input placeholder="Descreva o serviço" {...field} />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

interface StageFieldProps {
  presetStageId?: string;
}

export const StageField = ({ presetStageId }: StageFieldProps) => {
  if (presetStageId) return null;
  
  const { control } = useFormContext<LeadFormValues>();
  
  return (
    <FormField
      control={control}
      name="stageId"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Estágio*</FormLabel>
          <Select 
            onValueChange={field.onChange} 
            defaultValue={field.value}
          >
            <FormControl>
              <SelectTrigger>
                <SelectValue placeholder="Selecione o estágio" />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              {pipelineStages.map((stage) => (
                <SelectItem key={stage.id} value={stage.id}>
                  {stage.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export const CompanyDetailsFields = () => {
  const { control } = useFormContext<LeadFormValues>();
  
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <FormField
        control={control}
        name="employees"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Número de Funcionários</FormLabel>
            <FormControl>
              <Input 
                type="number" 
                placeholder="0" 
                {...field}
                onChange={(e) => field.onChange(e.target.value === "" ? undefined : Number(e.target.value))}
                className="w-full"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="annualRevenue"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Faturamento Anual</FormLabel>
            <FormControl>
              <Input 
                type="number" 
                placeholder="0" 
                {...field}
                onChange={(e) => field.onChange(e.target.value === "" ? undefined : Number(e.target.value))}
                className="w-full"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};

export const SourceFields = () => {
  const { control } = useFormContext<LeadFormValues>();
  
  return (
    <>
      <FormField
        control={control}
        name="sourceCategory"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Origem*</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione a origem" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="indicacao">Indicação</SelectItem>
                <SelectItem value="rede_social">Rede Social</SelectItem>
                <SelectItem value="outro">Outro</SelectItem>
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="sourceDetail"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Detalhes da Origem</FormLabel>
            <FormControl>
              <Input placeholder="Ex: Instagram, indicação de João" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );
};
