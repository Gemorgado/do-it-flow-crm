
import { supabase } from '../../supabase/client';
import { Proposal } from '@/types';
import { fromDbProposal } from './proposalMappers';

// List all proposals
export const listProposals = async (): Promise<Proposal[]> => {
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
};

// Get a single proposal
export const getProposal = async (id: string): Promise<Proposal | undefined> => {
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
};
