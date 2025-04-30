
import axios from "axios";
import { Proposal } from "@/types";
import { toast } from "@/hooks/use-toast";
import { useMutation, useQuery } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";

// Base API para chamadas REST
const api = axios.create({
  baseURL: "/api", // Ajuste conforme seu ambiente
});

// Funções de API para propostas
export const getProposal = (id: string): Promise<Proposal> => 
  api.get(`/proposals/${id}`).then(r => r.data);

export const updateProposal = (id: string, data: Partial<Proposal>): Promise<Proposal> => 
  api.put(`/proposals/${id}`, data).then(r => r.data);

// Mock para desenvolvimento
const mockGetProposal = (id: string): Promise<Proposal> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const proposal = mockProposals.find(p => p.id === id);
      if (proposal) {
        resolve(proposal);
      } else {
        throw new Error("Proposta não encontrada");
      }
    }, 500);
  });
};

const mockUpdateProposal = (id: string, data: Partial<Proposal>): Promise<Proposal> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const index = mockProposals.findIndex(p => p.id === id);
      if (index !== -1) {
        const updatedProposal = { ...mockProposals[index], ...data };
        mockProposals[index] = updatedProposal as Proposal;
        resolve(updatedProposal as Proposal);
      } else {
        throw new Error("Proposta não encontrada");
      }
    }, 500);
  });
};

// Hooks de React Query para propostas
export const useGetProposal = (id: string | null) => {
  return useQuery({
    queryKey: ["proposal", id],
    queryFn: () => mockGetProposal(id!),
    enabled: !!id,
  });
};

export const useUpdateProposal = () => {
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Proposal> }) => 
      mockUpdateProposal(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["proposals"] });
      toast({
        title: "Proposta atualizada",
        description: "A proposta foi atualizada com sucesso",
      });
    },
    onError: (error) => {
      toast({
        title: "Erro ao atualizar proposta",
        description: error instanceof Error ? error.message : "Ocorreu um erro ao atualizar a proposta",
        variant: "destructive",
      });
    },
  });
};

// Mock data para desenvolvimento
const mockProposals: Proposal[] = [
  {
    id: "1",
    leadId: "lead1",
    title: "Proposta para Sistema ERP",
    value: 15000,
    createdAt: "2023-04-10T15:30:00Z",
    expiresAt: "2023-05-10T23:59:59Z",
    status: "enviada",
    products: [
      { id: "p1", name: "Implantação ERP", quantity: 1, unitPrice: 10000, total: 10000 },
      { id: "p2", name: "Treinamento", quantity: 5, unitPrice: 1000, total: 5000 }
    ]
  },
  {
    id: "2",
    leadId: "lead2",
    title: "Consultoria Estratégica",
    value: 8500,
    createdAt: "2023-04-12T10:15:00Z",
    expiresAt: "2023-05-12T23:59:59Z",
    status: "visualizada",
    products: [
      { id: "p3", name: "Diagnóstico Empresarial", quantity: 1, unitPrice: 3500, total: 3500 },
      { id: "p4", name: "Plano de Ação", quantity: 1, unitPrice: 5000, total: 5000 }
    ]
  },
  {
    id: "3",
    leadId: "lead3",
    title: "Desenvolvimento de Website",
    value: 12000,
    createdAt: "2023-04-15T09:00:00Z",
    expiresAt: "2023-05-15T23:59:59Z",
    status: "aceita",
    products: [
      { id: "p5", name: "Design UX/UI", quantity: 1, unitPrice: 4000, total: 4000 },
      { id: "p6", name: "Desenvolvimento Frontend", quantity: 1, unitPrice: 5000, total: 5000 },
      { id: "p7", name: "Integração Backend", quantity: 1, unitPrice: 3000, total: 3000 }
    ]
  },
  {
    id: "4",
    leadId: "lead4",
    title: "Plano de Marketing Digital",
    value: 6500,
    createdAt: "2023-04-18T14:20:00Z",
    expiresAt: "2023-05-18T23:59:59Z",
    status: "rejeitada",
    products: [
      { id: "p8", name: "Análise de Mercado", quantity: 1, unitPrice: 2000, total: 2000 },
      { id: "p9", name: "Estratégia de Conteúdo", quantity: 1, unitPrice: 1500, total: 1500 },
      { id: "p10", name: "Gestão de Mídia", quantity: 3, unitPrice: 1000, total: 3000 }
    ]
  },
  {
    id: "5",
    leadId: "lead5",
    title: "Hospedagem e Suporte Anual",
    value: 9600,
    createdAt: "2023-04-20T11:30:00Z",
    expiresAt: "2023-05-20T23:59:59Z",
    status: "em_negociacao",
    products: [
      { id: "p11", name: "Hospedagem em Cloud", quantity: 12, unitPrice: 500, total: 6000 },
      { id: "p12", name: "Suporte Técnico", quantity: 12, unitPrice: 300, total: 3600 }
    ]
  }
];
