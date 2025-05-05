
import { supabase } from '../../supabase/client';
import { Proposal } from '@/types';
import { v4 as uuidv4 } from 'uuid';
import { toDbProposal, toDbProposalItem } from './proposalMappers';

// Create a new proposal
export const createProposal = async (proposal: Proposal): Promise<Proposal> => {
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
};

// Update an existing proposal
export const updateProposal = async (proposal: Proposal): Promise<Proposal> => {
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
};

// Delete a proposal
export const deleteProposal = async (id: string): Promise<void> => {
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
};
