
import * as z from "zod";

export const clientFormSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(2, {
    message: "O nome precisa ter pelo menos 2 caracteres.",
  }),
  company: z.string().optional(),
  email: z.string().email({
    message: "Por favor insira um e-mail válido.",
  }),
  phone: z.string().min(8, {
    message: "Insira um número de telefone válido.",
  }),
  plan: z.string().optional(),
  contractStart: z.date().optional(),
  contractEnd: z.date().optional(),
  contractTerm: z.number().int().min(0).optional(),
  contractValue: z.number().min(0).optional(),
  dueDay: z.number().int().min(1).max(31).optional(),
  privateRoom: z.string().optional(),
  selectedSpaceId: z.string().optional(),
  billingEmails: z.string().optional(),
  lastReadjustDate: z.date().optional(),
  readjustIndex: z.string().optional(),
  isActive: z.boolean().default(true),
  address: z.string().optional(),
  notes: z.string().optional()
}).refine(data => {
  // Validate that contractEnd is after contractStart if both are provided
  if (data.contractStart && data.contractEnd) {
    return data.contractEnd > data.contractStart;
  }
  return true;
}, {
  message: "A data de término deve ser posterior à data de início",
  path: ["contractEnd"]
});

export type ClientFormValues = z.infer<typeof clientFormSchema>;

export const defaultValues: Partial<ClientFormValues> = {
  name: "",
  company: "",
  email: "",
  phone: "",
  isActive: true
};
