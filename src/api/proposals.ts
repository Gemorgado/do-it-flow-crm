
import { useMutation, useQuery } from "@tanstack/react-query";
import { CreateProposalInput, Proposal } from "@/types/proposal";
import { toast } from "@/hooks/use-toast";
import { useAuth } from "@/modules/auth/AuthProvider";

// Mock users for demonstration
const mockUsers = [
  { id: "1", name: "Admin" },
  { id: "2", name: "Consultor 1" },
  { id: "3", name: "Consultor 2" }
];

// Mock API for user fetching
export const useUsers = () => {
  return {
    data: mockUsers,
    isLoading: false
  };
};

// Mock proposals data
const mockProposals: Proposal[] = [];

// Mock API for proposals fetching with owner filtering
export const useProposals = () => {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ['proposals', { owner: user?.viewAllProposals ? 'all' : user?.id }],
    queryFn: async () => {
      // Simulate network request
      await new Promise((resolve) => setTimeout(resolve, 800));
      
      // Filter proposals based on user permissions
      let filteredProposals = [...mockProposals];
      
      // If user doesn't have viewAllProposals permission, only show their own
      if (user && !user.viewAllProposals) {
        filteredProposals = filteredProposals.filter(p => p.ownerId === user.id);
      }
      
      return filteredProposals;
    }
  });
};

// Mock API for demonstration purposes
// In a real app, this would be an actual API call
const createProposal = async (data: CreateProposalInput): Promise<Proposal> => {
  // Simulate network request
  await new Promise((resolve) => setTimeout(resolve, 800));
  
  const proposal: Proposal = {
    id: `proposal-${Date.now()}`,
    ...data,
    ownerId: data.ownerId || "1", // Default to user 1 if not provided
    createdAt: new Date().toISOString(),
  };

  // Add to mock data
  mockProposals.push(proposal);

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
