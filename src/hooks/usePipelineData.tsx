
import { useState, useEffect, useCallback } from 'react';
import { Lead, PipelineStage } from '@/types';
import { supabase } from '@/integrations/supabase/client';
import { persistence } from '@/integrations/persistence';
import { toast } from 'sonner';
import { trackLeadEvent } from '@/utils/trackingUtils';

// Convert Supabase lead format to application format
const mapLeadFromSupabase = (lead: any, stages: Record<string, PipelineStage>): Lead => {
  return {
    id: lead.id,
    name: lead.name,
    company: lead.company || '',
    email: lead.email,
    phone: lead.phone || '',
    status: lead.status,
    source: lead.source,
    createdAt: lead.created_at,
    updatedAt: lead.updated_at,
    stage: lead.stage_id ? stages[lead.stage_id] : null,
    assignedTo: lead.assigned_to || '',
    notes: lead.notes || '',
    value: lead.value || 0,
    lastContact: lead.last_contact,
    nextFollowUp: lead.next_follow_up,
    meetingScheduled: lead.meeting_scheduled
  };
};

export const usePipelineData = (initialLeads: Lead[] = [], initialStages: PipelineStage[] = []) => {
  const [leads, setLeads] = useState<Lead[]>(initialLeads);
  const [pipelineStages, setPipelineStages] = useState<PipelineStage[]>(initialStages);
  const [filteredLeads, setFilteredLeads] = useState<Lead[]>(initialLeads);
  const [searchTerm, setSearchTerm] = useState('');
  const [userFilter, setUserFilter] = useState('all');
  const [isLoading, setIsLoading] = useState(true);
  const [draggedLead, setDraggedLead] = useState<Lead | null>(null);
  const [stagesLookup, setStagesLookup] = useState<Record<string, PipelineStage>>({});
  
  // Compute leads by stage
  const leadsByStage = pipelineStages.reduce<Record<string, Lead[]>>((acc, stage) => {
    acc[stage.id] = filteredLeads.filter((lead) => lead.stage?.id === stage.id);
    return acc;
  }, {});

  // Compute leads needing attention
  const leadsNeedingAttention = filteredLeads.filter(
    (lead) => lead.nextFollowUp && new Date(lead.nextFollowUp) <= new Date()
  );

  // Load initial data
  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        
        // Fetch stages
        const { data: stagesData, error: stagesError } = await supabase
          .from('pipeline_stages')
          .select('*')
          .order('order_number');
          
        if (stagesError) throw stagesError;
        
        const stages = stagesData.map(stage => ({
          id: stage.id,
          name: stage.name,
          order: stage.order_number,
          color: stage.color
        }));
        
        setPipelineStages(stages);
        
        // Create a stages lookup object for efficient access
        const stageLookup: Record<string, PipelineStage> = {};
        stages.forEach(stage => {
          stageLookup[stage.id] = stage;
        });
        setStagesLookup(stageLookup);
        
        // Fetch leads
        const { data: leadsData, error: leadsError } = await supabase
          .from('leads')
          .select('*')
          .neq('status', 'converted');
          
        if (leadsError) throw leadsError;
        
        const mappedLeads = leadsData.map(lead => mapLeadFromSupabase(lead, stageLookup));
        setLeads(mappedLeads);
        setFilteredLeads(mappedLeads);

        // Track view event
        trackLeadEvent('pipeline_view', {
          leads_count: mappedLeads.length,
          page_name: 'Pipeline de Vendas'
        });
      } catch (error) {
        console.error('Error loading pipeline data:', error);
        toast.error('Failed to load pipeline data');
      } finally {
        setIsLoading(false);
      }
    };
    
    loadData();
    
    // Subscribe to changes using Supabase realtime with optimized updates
    const pipelineChannel = supabase.channel('pipeline_changes')
      .on('postgres_changes', 
        { event: 'INSERT', schema: 'public', table: 'leads' },
        payload => {
          console.log('Lead inserted:', payload);
          // Add the new lead to our state
          const newLead = mapLeadFromSupabase(payload.new, stagesLookup);
          setLeads(currentLeads => [...currentLeads, newLead]);
        }
      )
      .on('postgres_changes', 
        { event: 'UPDATE', schema: 'public', table: 'leads' },
        payload => {
          console.log('Lead updated:', payload);
          // Update the specific lead in our state
          const updatedLead = mapLeadFromSupabase(payload.new, stagesLookup);
          setLeads(currentLeads => 
            currentLeads.map(lead => 
              lead.id === updatedLead.id ? updatedLead : lead
            )
          );
        }
      )
      .on('postgres_changes', 
        { event: 'DELETE', schema: 'public', table: 'leads' },
        payload => {
          console.log('Lead deleted:', payload);
          // Remove the lead from our state
          setLeads(currentLeads => 
            currentLeads.filter(lead => lead.id !== payload.old.id)
          );
        }
      )
      .on('postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'pipeline_stages' },
        payload => {
          console.log('Pipeline stage inserted:', payload);
          const newStage = {
            id: payload.new.id,
            name: payload.new.name,
            order: payload.new.order_number,
            color: payload.new.color
          };
          setPipelineStages(currentStages => [...currentStages, newStage]);
          setStagesLookup(current => ({...current, [newStage.id]: newStage}));
        }
      )
      .on('postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'pipeline_stages' },
        payload => {
          console.log('Pipeline stage updated:', payload);
          const updatedStage = {
            id: payload.new.id,
            name: payload.new.name,
            order: payload.new.order_number,
            color: payload.new.color
          };
          setPipelineStages(currentStages => 
            currentStages.map(stage => 
              stage.id === updatedStage.id ? updatedStage : stage
            )
          );
          setStagesLookup(current => ({...current, [updatedStage.id]: updatedStage}));
        }
      )
      .on('postgres_changes',
        { event: 'DELETE', schema: 'public', table: 'pipeline_stages' },
        payload => {
          console.log('Pipeline stage deleted:', payload);
          setPipelineStages(currentStages => 
            currentStages.filter(stage => stage.id !== payload.old.id)
          );
          setStagesLookup(current => {
            const updated = {...current};
            delete updated[payload.old.id];
            return updated;
          });
        }
      )
      .subscribe();
      
    // Clean up subscription
    return () => {
      supabase.removeChannel(pipelineChannel);
    };
  }, []);
  
  // Filter leads when search term or user filter changes
  useEffect(() => {
    const filtered = leads.filter(lead => {
      const matchesSearch = searchTerm === '' || 
        lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        lead.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (lead.company && lead.company.toLowerCase().includes(searchTerm.toLowerCase()));
      
      const matchesUser = userFilter === 'all' || lead.assignedTo === userFilter;
      
      return matchesSearch && matchesUser;
    });
    
    setFilteredLeads(filtered);
  }, [leads, searchTerm, userFilter]);

  // Handle drag operations
  const handleDragStart = useCallback((e: React.DragEvent<HTMLDivElement>, lead: Lead) => {
    console.log('Drag started:', lead);
    e.dataTransfer.setData('text/plain', lead.id);
    setDraggedLead(lead);
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  }, []);

  const handleDrop = useCallback(async (e: React.DragEvent<HTMLDivElement>, stageId: string) => {
    e.preventDefault();
    const leadId = e.dataTransfer.getData('text/plain');
    
    if (!draggedLead) {
      console.error('No dragged lead found');
      return;
    }
    
    console.log(`Dropping lead ${leadId} into stage ${stageId}`);
    
    try {
      // Find the lead
      const leadToUpdate = leads.find(l => l.id === leadId);
      if (!leadToUpdate) {
        console.error(`Lead with ID ${leadId} not found`);
        return;
      }
      
      // Find the stage
      const newStage = pipelineStages.find(s => s.id === stageId);
      if (!newStage) {
        console.error(`Stage with ID ${stageId} not found`);
        return;
      }
      
      // Update the lead's stage
      await updateLeadStage(leadId, stageId);
      
    } catch (error) {
      console.error('Error dropping lead:', error);
      toast.error('Failed to update lead stage');
    } finally {
      setDraggedLead(null);
    }
  }, [draggedLead, leads, pipelineStages]);

  // Update lead stage
  const updateLeadStage = useCallback(async (leadId: string, stageId: string) => {
    try {
      const { error } = await supabase
        .from('leads')
        .update({ stage_id: stageId, updated_at: new Date().toISOString() })
        .eq('id', leadId);
        
      if (error) throw error;
      
      // For optimistic updates, we also update local state
      // This prevents UI lag while waiting for the realtime update
      setLeads(currentLeads => 
        currentLeads.map(lead => {
          if (lead.id === leadId) {
            const updatedStage = stagesLookup[stageId];
            return {
              ...lead,
              stage: updatedStage,
              updatedAt: new Date().toISOString()
            };
          }
          return lead;
        })
      );
      
      toast.success('Lead stage updated');
      
    } catch (error) {
      console.error('Error updating lead stage:', error);
      toast.error('Failed to update lead stage');
    }
  }, [stagesLookup]);

  // Handle search
  const handleSearchLeads = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  }, []);

  // Handle user filter
  const handleFilterByUser = useCallback((userId: string) => {
    setUserFilter(userId);
  }, []);

  // Add new lead to pipeline
  const addLeadToPipeline = useCallback(async (lead: Lead) => {
    try {
      // Make sure lead has first stage if not specified
      if (!lead.stage && pipelineStages.length > 0) {
        const firstStage = pipelineStages.find(s => s.order === 1) || pipelineStages[0];
        lead.stage = firstStage;
      }
      
      const createdLead = await persistence.createLead(lead);
      
      // Optimistic update for immediate UI feedback
      setLeads(currentLeads => [...currentLeads, {...lead, id: createdLead.id}]);
      
      toast.success('Lead added to pipeline');
      
      return createdLead;
    } catch (error) {
      console.error('Error adding lead to pipeline:', error);
      toast.error('Failed to add lead to pipeline');
      throw error;
    }
  }, [pipelineStages]);

  return {
    leads,
    filteredLeads,
    pipelineStages,
    leadsByStage,
    leadsNeedingAttention,
    isLoading,
    handleDragStart,
    handleDragOver,
    handleDrop,
    updateLeadStage,
    handleSearchLeads,
    handleFilterByUser,
    addLeadToPipeline
  };
};
