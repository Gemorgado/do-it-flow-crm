
import * as z from "zod";

// Schema definition for contact forms with improved validation messages
export const contactFormSchema = z.object({
  name: z.string().min(2, {
    message: "O nome precisa ter pelo menos 2 caracteres.",
  }),
  company: z.string().optional(),
  email: z.string().email({
    message: "Por favor insira um e-mail válido.",
  }),
  phone: z.string()
    .min(8, {
      message: "Insira um número de telefone válido.",
    })
    .refine((val) => /^(\d|\(|\)|\s|-|\.)+$/.test(val), {
      message: "O telefone deve conter apenas números e caracteres especiais válidos.",
    }),
  status: z.string().min(1, {
    message: "Por favor selecione um status.",
  }),
  source: z.string().min(1, {
    message: "Por favor selecione uma origem.",
  }),
});

// Schema for lead forms
export const leadFormSchema = z.object({
  companyOrPerson: z.string().min(3, {
    message: "Nome da empresa ou pessoa deve ter pelo menos 3 caracteres",
  }),
  idNumber: z.string().min(1, {
    message: "CNPJ ou CPF é obrigatório"
  }),
  entryDate: z.string().min(1, {
    message: "Data de entrada é obrigatória",
  }),
  interestService: z.string().min(1, {
    message: "Serviço de interesse é obrigatório",
  }),
  employees: z.number().optional()
    .refine(val => !val || val >= 0, {
      message: "O número de funcionários não pode ser negativo",
    }),
  annualRevenue: z.number().optional()
    .refine(val => !val || val >= 0, {
      message: "O faturamento anual não pode ser negativo",
    }),
  sourceCategory: z.enum(["indicacao", "rede_social", "outro"], {
    errorMap: () => ({ message: "Selecione uma categoria de origem válida" }),
  }),
  sourceDetail: z.string().optional(),
  stageId: z.string().min(1, {
    message: "É necessário selecionar um estágio"
  }).optional(),
  email: z.string().email({
    message: "Por favor insira um e-mail válido.",
  }).optional(),
  phone: z.string().optional(),
  notes: z.string().optional(),
});

// Schema for client forms
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

// Schema for the complete contact modal
export const contactModalSchema = z.object({
  contactName: z.string().min(3, {
    message: "Nome do contato deve ter pelo menos 3 caracteres",
  }),
  email: z.string().email({
    message: "Email inválido",
  }),
  phone: z.string().min(10, {
    message: "Telefone deve ter pelo menos 10 dígitos",
  }),
  companyOrPerson: z.string().min(2, {
    message: "Nome da empresa ou pessoa deve ter pelo menos 2 caracteres",
  }),
  idNumber: z.string().optional(),
  entryDate: z.string(),
  interestService: z.string().optional(),
  sourceCategory: z.enum(["indicação", "rede social", "outro"]),
  sourceDetail: z.string().optional(),
});

// Define types based on schemas
export type ContactFormValues = z.infer<typeof contactFormSchema>;
export type LeadFormValues = z.infer<typeof leadFormSchema>;
export type ClientFormValues = z.infer<typeof clientFormSchema>;
export type ContactModalValues = z.infer<typeof contactModalSchema>;
