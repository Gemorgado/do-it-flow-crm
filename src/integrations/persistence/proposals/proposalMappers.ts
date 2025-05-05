
import { Proposal, ProposalStatus } from '@/types';
import { toProposalStatus, toServiceType } from '@/utils/enumMappers';
import { ServiceType } from '@/types/service';

// Helper function to convert from domain model to database model
export const toDbProposal = (proposal: Proposal) => ({
  lead_id: proposal.leadId,
  title: proposal.title,
  value: proposal.value,
  expires_at: proposal.expiresAt,
  status: proposal.status,
  notes: proposal.notes,
  created_by: proposal.created_by
});

// Helper function to convert from database model to domain model
export const fromDbProposal = (dbProposal: any, items: any[] = []): Proposal => {
  const defaultServiceType = 'private_office' as ServiceType;
  
  return {
    id: dbProposal.id,
    leadId: dbProposal.lead_id,
    title: dbProposal.title,
    value: dbProposal.value,
    createdAt: dbProposal.created_at,
    expiresAt: dbProposal.expires_at,
    status: toProposalStatus(dbProposal.status),
    notes: dbProposal.notes,
    created_by: dbProposal.created_by,
    serviceType: defaultServiceType,
    products: items.map(item => ({
      id: item.id,
      name: item.name,
      quantity: item.quantity,
      unitPrice: item.unit_price,
      total: item.total
    }))
  };
};

// Helper function to convert proposal items from domain model to database model
export const toDbProposalItem = (item: any, proposalId: string) => ({
  proposal_id: proposalId,
  name: item.name,
  quantity: item.quantity,
  unit_price: item.unitPrice,
  total: item.total
});
