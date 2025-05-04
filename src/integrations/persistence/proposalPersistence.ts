
import { supabase } from '../supabase/client';
import { Proposal, ProposalItem } from '@/types';
import { v4 as uuidv4 } from 'uuid';
import { 
  PT_BR_TO_PROPOSAL_STATUS, 
  PROPOSAL_STATUS_TO_PT_BR,
  ProposalStatus 
} from '@/types/proposal';

// Helper function to map frontend status to database status
const mapProposalStatus = (status: string): string => {
  if (status in PT_BR_TO_PROPOSAL_STATUS) {
    return PT_BR_TO_PROPOSAL_STATUS[status as keyof typeof PT_BR_TO_PROPOSAL_STATUS];
  } else if (Object.values(PT_BR_TO_PROPOSAL_STATUS).includes(status as ProposalStatus)) {
    return status;
  }
  return status || 'draft';
};

// Helper function to map database status to frontend status
const mapToFrontendStatus = (status: string): ProposalStatus => {
  if (status in PROPOSAL_STATUS_TO_PT_BR) {
    return status as ProposalStatus;
  } else if (Object.values(PROPOSAL_STATUS_TO_PT_BR).includes(status)) {
    // Find key by value
    for (const [key, value] of Object.entries(PROPOSAL_STATUS_TO_PT_BR)) {
      if (value === status) {
        return key as ProposalStatus;
      }
    }
  }
  return 'draft';
};

export const proposalPersistence = {
  listProposals: async (): Promise<Proposal[]> => {
    const { data, error } = await supabase
      .from('proposals')
      .select(`
        id, 
        lead_id,
        title,
        value,
        created_at,
        expires_at, 
        status,
        notes,
        created_by,
        proposal_items(*)
      `);

    if (error) {
      console.error('Error fetching proposals:', error);
      throw error;
    }

    return data.map(item => ({
      id: item.id,
      leadId: item.lead_id,
      title: item.title,
      value: item.value,
      createdAt: item.created_at,
      expiresAt: item.expires_at,
      status: mapToFrontendStatus(item.status),
      notes: item.notes,
      created_by: item.created_by,
      // Provide a default serviceType
      serviceType: 'private_office', // Default value, may need to be updated based on actual data
      products: item.proposal_items.map((product: any) => ({
        id: product.id,
        name: product.name,
        quantity: product.quantity,
        unitPrice: product.unit_price,
        total: product.total
      }))
    }));
  },

  getProposal: async (id: string): Promise<Proposal | undefined> => {
    const { data, error } = await supabase
      .from('proposals')
      .select(`
        id, 
        lead_id,
        title,
        value,
        created_at,
        expires_at, 
        status,
        notes,
        created_by,
        proposal_items(*)
      `)
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        // Record not found
        return undefined;
      }
      console.error('Error fetching proposal:', error);
      throw error;
    }

    return {
      id: data.id,
      leadId: data.lead_id,
      title: data.title,
      value: data.value,
      createdAt: data.created_at,
      expiresAt: data.expires_at,
      status: mapToFrontendStatus(data.status),
      notes: data.notes,
      created_by: data.created_by,
      // Provide a default serviceType
      serviceType: 'private_office', // Default value, may need to be updated based on actual data
      products: data.proposal_items.map((product: any) => ({
        id: product.id,
        name: product.name,
        quantity: product.quantity,
        unitPrice: product.unit_price,
        total: product.total
      }))
    };
  },

  createProposal: async (proposal: Proposal): Promise<Proposal> => {
    const proposalId = proposal.id || uuidv4();
    const proposalStatus = mapProposalStatus(proposal.status);

    // Start a transaction to insert both the proposal and its items
    const { data: proposalData, error: proposalError } = await supabase
      .from('proposals')
      .insert({
        id: proposalId,
        lead_id: proposal.leadId,
        title: proposal.title,
        value: proposal.value,
        expires_at: proposal.expiresAt,
        status: proposalStatus,
        notes: proposal.notes,
        created_by: proposal.created_by
      })
      .select()
      .single();

    if (proposalError) {
      console.error('Error creating proposal:', proposalError);
      throw proposalError;
    }

    // Insert proposal items
    if (proposal.products?.length) {
      const proposalItems = proposal.products.map(product => ({
        id: product.id || uuidv4(),
        proposal_id: proposalId,
        name: product.name,
        quantity: product.quantity,
        unit_price: product.unitPrice,
        total: product.total
      }));

      const { error: itemsError } = await supabase
        .from('proposal_items')
        .insert(proposalItems);

      if (itemsError) {
        console.error('Error creating proposal items:', itemsError);
        throw itemsError;
      }
    }

    // Return created proposal with products
    return {
      ...proposal,
      id: proposalId,
      createdAt: proposalData.created_at
    };
  },

  updateProposal: async (proposal: Proposal): Promise<Proposal> => {
    // Update the proposal
    const { error: proposalError } = await supabase
      .from('proposals')
      .update({
        lead_id: proposal.leadId,
        title: proposal.title,
        value: proposal.value,
        expires_at: proposal.expiresAt,
        status: mapProposalStatus(proposal.status),
        notes: proposal.notes,
        updated_at: new Date().toISOString()
      })
      .eq('id', proposal.id);

    if (proposalError) {
      console.error('Error updating proposal:', proposalError);
      throw proposalError;
    }

    // Handle proposal items (delete and re-create for simplicity)
    if (proposal.products?.length) {
      // Delete existing items
      const { error: deleteError } = await supabase
        .from('proposal_items')
        .delete()
        .eq('proposal_id', proposal.id);

      if (deleteError) {
        console.error('Error deleting proposal items:', deleteError);
        throw deleteError;
      }

      // Insert new items
      const proposalItems = proposal.products.map(product => ({
        id: product.id || uuidv4(),
        proposal_id: proposal.id,
        name: product.name,
        quantity: product.quantity,
        unit_price: product.unitPrice,
        total: product.total
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

  deleteProposal: async (id: string): Promise<void> => {
    // Delete proposal (will cascade delete items due to foreign key constraint)
    const { error } = await supabase
      .from('proposals')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting proposal:', error);
      throw error;
    }
  }
};
