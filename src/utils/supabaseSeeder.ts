
import { supabase } from '@/integrations/supabase/client';
import { v4 as uuidv4 } from 'uuid';
import { leads as mockLeads, pipelineStages as mockStages } from '@/data/leadsData';
import { clients as mockClients, clientServices as mockServices } from '@/data/clientsData';
import { locations as mockLocations } from '@/data/locationsData';
import { toast } from 'sonner';

/**
 * Seeds the Supabase database with initial data
 */
export const seedSupabaseData = async (): Promise<void> => {
  try {
    toast.info('Seeding database with initial data...');
    
    // Check if we already have data
    const { count: stagesCount } = await supabase
      .from('pipeline_stages')
      .select('*', { count: 'exact', head: true });
      
    if (stagesCount && stagesCount > 0) {
      console.log('Database already has data, skipping seed');
      toast.success('Database already has data');
      return;
    }
    
    // 1. Insert pipeline stages
    const stagePromises = mockStages.map(async (stage) => {
      const { data, error } = await supabase
        .from('pipeline_stages')
        .insert({
          name: stage.name,
          order_number: stage.order,
          color: stage.color
        })
        .select();
        
      if (error) {
        console.error('Error inserting stage:', error);
        throw error;
      }
      
      return data[0];
    });
    
    const stages = await Promise.all(stagePromises);
    console.log('Inserted stages:', stages);
    
    // Create a mapping from old stage IDs to new ones
    const stageMap = new Map();
    stages.forEach((stage, index) => {
      stageMap.set(mockStages[index].id, stage.id);
    });
    
    // 2. Insert leads
    const leadPromises = mockLeads.map(async (lead) => {
      const newStageId = stageMap.get(lead.stage.id);
      
      const { data, error } = await supabase
        .from('leads')
        .insert({
          name: lead.name,
          company: lead.company,
          email: lead.email,
          phone: lead.phone,
          status: lead.status,
          source: lead.source,
          stage_id: newStageId,
          assigned_to: lead.assignedTo
        })
        .select();
        
      if (error) {
        console.error('Error inserting lead:', error);
        throw error;
      }
      
      return data[0];
    });
    
    const leads = await Promise.all(leadPromises);
    console.log('Inserted leads:', leads);
    
    // 3. Insert spaces (locations)
    const spacePromises = mockLocations.map(async (loc) => {
      const { data, error } = await supabase
        .from('spaces')
        .insert({
          name: loc.name,
          type: loc.type,
          floor: loc.floor,
          capacity: loc.capacity,
          area: loc.area,
          description: loc.description,
          is_active: loc.isActive !== false
        })
        .select();
        
      if (error) {
        console.error('Error inserting space:', error);
        throw error;
      }
      
      return data[0];
    });
    
    const spaces = await Promise.all(spacePromises);
    console.log('Inserted spaces:', spaces);
    
    // Create a mapping from old location IDs to new ones
    const spaceMap = new Map();
    spaces.forEach((space, index) => {
      spaceMap.set(mockLocations[index].id, space.id);
    });
    
    // 4. Insert clients
    const clientPromises = mockClients.map(async (client) => {
      const { data, error } = await supabase
        .from('clients')
        .insert({
          name: client.name,
          company: client.company,
          email: client.email,
          phone: client.phone,
          address: client.address,
          status: client.status,
          notes: client.notes,
          assigned_to: client.assignedTo,
          is_active: client.isActive
        })
        .select();
        
      if (error) {
        console.error('Error inserting client:', error);
        throw error;
      }
      
      return { ...data[0], oldId: client.id };
    });
    
    const clients = await Promise.all(clientPromises);
    console.log('Inserted clients:', clients);
    
    // Create a mapping from old client IDs to new ones
    const clientMap = new Map();
    clients.forEach((client) => {
      clientMap.set(client.oldId, client.id);
    });
    
    // 5. Insert client services
    const servicePromises = mockServices.map(async (service) => {
      const newClientId = clientMap.get(service.clientId);
      const newLocationId = service.locationId ? spaceMap.get(service.locationId) : null;
      
      const { data, error } = await supabase
        .from('client_services')
        .insert({
          client_id: newClientId,
          type: service.type,
          description: service.description,
          location_id: newLocationId,
          contract_start: service.contractStart,
          contract_end: service.contractEnd,
          value: service.value,
          billing_cycle: service.billingCycle,
          status: service.status
        })
        .select();
        
      if (error) {
        console.error('Error inserting service:', error);
        throw error;
      }
      
      return data[0];
    });
    
    const services = await Promise.all(servicePromises);
    console.log('Inserted services:', services);
    
    // 6. Create some space allocations
    // For simplicity, we'll just create a few allocations based on client services
    const allocations = [];
    for (const service of services) {
      if (service.location_id) {
        const { data, error } = await supabase
          .from('space_allocations')
          .insert({
            space_id: service.location_id,
            client_id: service.client_id,
            contract_id: service.id,
            start_date: service.contract_start,
            end_date: service.contract_end
          })
          .select();
          
        if (error) {
          console.error('Error inserting allocation:', error);
          throw error;
        }
        
        allocations.push(data[0]);
      }
    }
    
    console.log('Inserted allocations:', allocations);
    
    toast.success('Database seeded successfully');
  } catch (error) {
    console.error('Error seeding database:', error);
    toast.error('Failed to seed database');
  }
};
