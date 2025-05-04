
export interface User {
  id: string;
  name: string;
  email: string;
  role: "admin" | "comercial" | "atendimento" | "gerente" | "diretor";
  avatar?: string;
  createdAt: string;
  active: boolean;
}
