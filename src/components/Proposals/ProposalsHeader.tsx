
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useProposalModal } from "@/components/CRM/hooks/useProposalModal";

export function ProposalsHeader() {
  const { open: openProposalModal } = useProposalModal();

  return (
    <div className="flex flex-col md:flex-row justify-between gap-4">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Gestão de Propostas</h1>
        <p className="text-gray-500">Crie, gerencie e acompanhe propostas comerciais</p>
      </div>
      <Button className="bg-doIt-primary hover:bg-doIt-dark" onClick={openProposalModal}>
        <Plus className="mr-2 h-4 w-4" /> Nova Proposta
      </Button>
    </div>
  );
}
