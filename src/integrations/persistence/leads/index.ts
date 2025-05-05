
import { listLeads, getLead } from './leadQueries';
import { createLead, updateLead, deleteLead, createLeads } from './leadMutations';

export const leadPersistence = {
  listLeads,
  getLead,
  createLead,
  updateLead,
  deleteLead,
  createLeads
};
