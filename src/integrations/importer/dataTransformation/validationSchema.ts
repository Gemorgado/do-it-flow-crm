
import { z } from 'zod';

// Schema for validating each row after mapping
export const RowSchema = z.object({
  name: z.string().min(2, "Nome deve ter pelo menos 2 caracteres"),
  docNumber: z.string().refine(val => {
    const digits = val.replace(/\D/g, '');
    return digits.length === 11 || digits.length === 14;
  }, "Documento deve ter 11 (CPF) ou 14 (CNPJ) dígitos"),
  email: z.string().email("Email inválido").optional().nullable(),
  phone: z.string().optional().nullable(),
  serviceType: z.string().min(1, "Tipo de serviço é obrigatório"),
  roomNumber: z.string().optional().nullable(),
  contractStart: z.string().min(1, "Data de início do contrato é obrigatória"),
  contractEnd: z.string().optional().nullable(),
  amount: z.preprocess(
    v => Number(String(v).replace(/[^\d]/g, '')), 
    z.number().nonnegative("Valor deve ser positivo").optional().nullable()
  )
});

export type ValidatedRow = z.infer<typeof RowSchema>;
