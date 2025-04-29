
export interface LeadFormValues {
  companyOrPerson: string;
  idNumber: string;          // CNPJ ou CPF
  entryDate: string;         // yyyy-mm-dd
  interestService: string;
  employees?: number;
  annualRevenue?: number;
  sourceCategory: 'indicação' | 'rede social' | 'outro';
  sourceDetail?: string;     // qual rede, quem indicou etc.
}

export interface ContactFormValues {
  contactName: string;
  email: string;
  phone: string;
  companyOrPerson: string;
  idNumber?: string;         // CNPJ ou CPF
  entryDate: string;         // yyyy-mm-dd
  interestService?: string;
  sourceCategory: 'indicação' | 'rede social' | 'outro';
  sourceDetail?: string;     // qual rede, quem indicou etc.
}
