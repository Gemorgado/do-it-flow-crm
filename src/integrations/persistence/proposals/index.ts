
import { getProposal, listProposals } from './proposalQueries';
import { createProposal, updateProposal, deleteProposal } from './proposalMutations';

export const proposalPersistence = {
  listProposals,
  getProposal,
  createProposal,
  updateProposal,
  deleteProposal
};
