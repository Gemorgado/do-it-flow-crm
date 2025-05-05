
import { supabase } from '../supabase/client';
import { Proposal } from '@/types';
import { v4 as uuidv4 } from 'uuid';
import { ServiceType } from '@/types/service';
import { ProposalStatus } from '@/types/proposal';
import { toProposalStatus, toServiceType } from '@/utils/enumMappers';

// Helper function to convert from domain model to database model
const toDbProposal = (proposal: Proposal) => ({
  lead_id: proposal.leadId,
  title: proposal.title,
  value: proposal.value,
  expires_at: proposal.expiresAt,
  status: proposal.status,
  notes: proposal.notes,
  created_by: proposal.created_by
});

// Helper function to convert from database model to domain model
const fromDbProposal = (dbProposal: any, items: any[] = []): Proposal => {
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
const toDbProposalItem = (item: any, proposalId: string) => ({
  proposal_id: proposalId,
  name: item.name,
  quantity: item.quantity,
  unit_price: item.unitPrice,
  total: item.total
});

export const proposalPersistence = {
  // List all proposals
  listProposals: async (): Promise<Proposal[]> => {
    const { data: proposalsData, error: proposalsError } = await supabase
      .from('proposals')
      .select('*');

    if (proposalsError) {
      console.error('Error fetching proposals:', proposalsError);
      throw proposalsError;
    }

    // Fetch all proposal items in a single query
    const { data: itemsData, error: itemsError } = await supabase
      .from('proposal_items')
      .select('*');

    if (itemsError) {
      console.error('Error fetching proposal items:', itemsError);
      throw itemsError;
    }

    // Group items by proposal ID
    const itemsByProposal: Record<string, any[]> = {};
    itemsData.forEach(item => {
      if (!itemsByProposal[item.proposal_id]) {
        itemsByProposal[item.proposal_id] = [];
      }
      itemsByProposal[item.proposal_id].push(item);
    });

    // Convert database format to application format
    return proposalsData.map(proposal => {
      return fromDbProposal(proposal, itemsByProposal[proposal.id] || []);
    });
  },

  // Get a single proposal
  getProposal: async (id: string): Promise<Proposal | undefined> => {
    const { data: proposal, error: proposalError } = await supabase
      .from('proposals')
      .select('*')
      .eq('id', id)
      .single();

    if (proposalError) {
      if (proposalError.code === 'PGRST116') {
        // Not found
        return undefined;
      }
      console.error('Error fetching proposal:', proposalError);
      throw proposalError;
    }

    // Get proposal items
    const { data: items, error: itemsError } = await supabase
      .from('proposal_items')
      .select('*')
      .eq('proposal_id', id);

    if (itemsError) {
      console.error('Error fetching proposal items:', itemsError);
      throw itemsError;
    }

    return fromDbProposal(proposal, items || []);
  },

  // Create a new proposal
  createProposal: async (proposal: Proposal): Promise<Proposal> => {
    const proposalId = proposal.id || uuidv4();

    // First create the proposal
    const { data, error: proposalError } = await supabase
      .from('proposals')
      .insert({
        id: proposalId,
        ...toDbProposal(proposal)
      })
      .select()
      .single();

    if (proposalError) {
      console.error('Error creating proposal:', proposalError);
      throw proposalError;
    }

    // Now create proposal items if any
    if (proposal.products && proposal.products.length > 0) {
      const proposalItems = proposal.products.map(item => 
        toDbProposalItem(item, proposalId)
      );

      const { error: itemsError } = await supabase
        .from('proposal_items')
        .insert(proposalItems);

      if (itemsError) {
        console.error('Error creating proposal items:', itemsError);
        throw itemsError;
      }
    }

    // Return the newly created proposal
    return {
      ...proposal,
      id: proposalId
    };
  },

  // Update an existing proposal
  updateProposal: async (proposal: Proposal): Promise<Proposal> => {
    // Update the main proposal
    const { error: proposalError } = await supabase
      .from('proposals')
      .update(toDbProposal(proposal))
      .eq('id', proposal.id);

    if (proposalError) {
      console.error('Error updating proposal:', proposalError);
      throw proposalError;
    }

    // Handle proposal items (delete and recreate)
    if (proposal.products && proposal.products.length > 0) {
      // First delete existing items
      const { error: deleteError } = await supabase
        .from('proposal_items')
        .delete()
        .eq('proposal_id', proposal.id);

      if (deleteError) {
        console.error('Error deleting proposal items:', deleteError);
        throw deleteError;
      }

      // Then create new items
      const proposalItems = proposal.products.map(item => 
        toDbProposalItem(item, proposal.id)
      );

      const { error: itemsError } = await supabase
        .from('proposal_items')
        .insert(proposalItems);

      if (itemsError) {
        console.error('Error creating proposal items:', itemsError);
        throw itemsError;
      }
    }

    return proposal;
  },

  // Delete a proposal
  deleteProposal: async (id: string): Promise<void> => {
    // First delete related proposal items
    const { error: itemsError } = await supabase
      .from('proposal_items')
      .delete()
      .eq('proposal_id', id);

    if (itemsError) {
      console.error('Error deleting proposal items:', itemsError);
      throw itemsError;
    }

    // Then delete the proposal itself
    const { error: proposalError } = await supabase
      .from('proposals')
      .delete()
      .eq('id', id);

    if (proposalError) {
      console.error('Error deleting proposal:', proposalError);
      throw proposalError;
    }
  }
};
