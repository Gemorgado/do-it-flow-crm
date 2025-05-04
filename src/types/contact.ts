
export interface Contact {
  id: string;
  name: string;
  email: string;
  phone: string;
  company?: string;
  idNumber?: string;
  entryDate: string;
  interestService?: string;
  sourceCategory: "indicacao" | "rede_social" | "outro";
  sourceDetail?: string;
  createdAt: string;
  updatedAt: string;
}
