
import { supabase } from '../supabase/client';
import { Proposal, ProposalStatus } from '@/types';
import { v4 as uuidv4 } from 'uuid';
import { ServiceType } from '@/types/service';

export const proposalPersistence = {
  // List all proposals
  listProposals: async (): Promise<Proposal[]> => {
    const { data: proposalsData, error: proposalsError } = await supabase
      .from('proposals')
      .select('*, proposal_items(*)');

    if (proposalsError) {
      console.error('Error fetching proposals:', proposalsError);
      throw proposalsError;
    }

    // Convert database format to application format
    return proposalsData.map(proposal => {
      // Default to a service type if not available
      const serviceType = 'private_office' as ServiceType;
      
      return {
        id: proposal.id,
        leadId: proposal.lead_id,
        title: proposal.title,
        value: proposal.value,
        createdAt: proposal.created_at,
        expiresAt: proposal.expires_at,
        status: proposal.status as ProposalStatus,
        notes: proposal.notes,
        created_by: proposal.created_by,
        serviceType: serviceType, // Add default service type
        products: proposal.proposal_items || []
      };
    });
  },

  // Get a single proposal
  getProposal: async (id: string): Promise<Proposal | undefined> => {
    const { data, error } = await supabase
      .from('proposals')
      .select('*, proposal_items(*)')
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        // Not found
        return undefined;
      }
      console.error('Error fetching proposal:', error);
      throw error;
    }

    // Default to a service type if not available
    const serviceType = 'private_office' as ServiceType;
    
    return {
      id: data.id,
      leadId: data.lead_id,
      title: data.title,
      value: data.value,
      createdAt: data.created_at,
      expiresAt: data.expires_at,
      status: data.status as ProposalStatus,
      notes: data.notes,
      created_by: data.created_by,
      serviceType: serviceType, // Add default service type
      products: data.proposal_items || []
    };
  },

  // Create a new proposal
  createProposal: async (proposal: Proposal): Promise<Proposal> => {
    const proposalId = proposal.id || uuidv4();

    // First create the proposal
    const { error: proposalError } = await supabase
      .from('proposals')
      .insert({
        id: proposalId,
        lead_id: proposal.leadId,
        title: proposal.title,
        value: proposal.value,
        expires_at: proposal.expiresAt,
        status: proposal.status as ProposalStatus,
        notes: proposal.notes,
        created_by: proposal.created_by
      });

    if (proposalError) {
      console.error('Error creating proposal:', proposalError);
      throw proposalError;
    }

    // Now create proposal items if any
    if (proposal.products && proposal.products.length > 0) {
      const proposalItems = proposal.products.map(item => ({
        proposal_id: proposalId,
        name: item.name,
        quantity: item.quantity,
        unit_price: item.unitPrice,
        total: item.total
      }));

      const { error: itemsError } = await supabase
        .from('proposal_items')
        .insert(proposalItems);

      if (itemsError) {
        console.error('Error creating proposal items:', itemsError);
        throw itemsError;
      }
    }

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
      .update({
        lead_id: proposal.leadId,
        title: proposal.title,
        value: proposal.value,
        expires_at: proposal.expiresAt,
        status: proposal.status as ProposalStatus,
        notes: proposal.notes
      })
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
      const proposalItems = proposal.products.map(item => ({
        proposal_id: proposal.id,
        name: item.name,
        quantity: item.quantity,
        unit_price: item.unitPrice,
        total: item.total
      }));

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
