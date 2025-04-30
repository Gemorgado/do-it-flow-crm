
import { useMutation } from "@tanstack/react-query";
import { CreateProposalInput, Proposal } from "@/types/proposal";
import { toast } from "@/hooks/use-toast";

// Mock API for demonstration purposes
// In a real app, this would be an actual API call
const createProposal = async (data: CreateProposalInput): Promise<Proposal> => {
  // Simulate network request
  await new Promise((resolve) => setTimeout(resolve, 800));
  
  const proposal: Proposal = {
    id: `proposal-${Date.now()}`,
    ...data,
    createdAt: new Date().toISOString(),
  };

  // If there's a followUp, create it
  if (data.followUpAt) {
    await createFollowUp({
      entityId: proposal.id,
      entityType: 'proposal',
      dueAt: data.followUpAt,
      notes: data.followUpNote || '',
    });
  }

  console.log("Created proposal:", proposal);
  
  return proposal;
};

// Mock follow-up API
const createFollowUp = async (data: {
  entityId: string;
  entityType: string;
  dueAt: string;
  notes: string;
}) => {
  // Simulate network request
  await new Promise((resolve) => setTimeout(resolve, 400));
  
  console.log("Created follow up:", data);
  
  return {
    id: `followup-${Date.now()}`,
    ...data,
    createdAt: new Date().toISOString(),
  };
};

export const useCreateProposal = () => {
  return useMutation({
    mutationFn: createProposal,
    onSuccess: () => {
      toast({
        title: "Proposta criada",
        description: "A proposta foi criada com sucesso",
      });
    },
    onError: (error) => {
      toast({
        title: "Erro ao criar proposta",
        description: "Não foi possível criar a proposta. Tente novamente.",
        variant: "destructive",
      });
      console.error("Error creating proposal:", error);
    },
  });
};
