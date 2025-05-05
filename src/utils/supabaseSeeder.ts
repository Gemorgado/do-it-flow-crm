
import { supabase } from '../integrations/supabase/client';
import { LeadStatus, LeadSource } from '@/types/lead';
import { ProposalStatus } from '@/types/proposal';
import { ServiceType } from '@/types/service';
import { toLeadSource, toLeadStatus, toServiceType } from './enumMappers';
import { persistence } from '@/integrations/persistence';

function generateMockPipelineStages() {
  return [
    {
      name: 'Novos Leads',
      order_number: 1,
      color: '#3b82f6', // blue
    },
    {
      name: 'Contato Inicial',
      order_number: 2,
      color: '#8b5cf6', // violet
    },
    {
      name: 'Qualificação',
      order_number: 3,
      color: '#10b981', // emerald
    },
    {
      name: 'Proposta Enviada',
      order_number: 4,
      color: '#f59e0b', // amber
    },
    {
      name: 'Negociação',
      order_number: 5,
      color: '#ef4444', // red
    },
    {
      name: 'Fechado Ganho',
      order_number: 6,
      color: '#22c55e', // green
    },
    {
      name: 'Fechado Perdido',
      order_number: 7,
      color: '#6b7280', // gray
    }
  ];
}

function generateMockLeads() {
  return [
    {
      email: 'joao.silva@exemplo.com',
      name: 'João Silva',
      company: 'Empresa ABC',
      phone: '(11) 98765-4321',
      status: 'novo' as LeadStatus,
      source: 'site_organico' as LeadSource,
    },
    {
      email: 'maria.oliveira@exemplo.com',
      name: 'Maria Oliveira',
      company: 'Startup XYZ',
      phone: '(11) 91234-5678',
      status: 'contatado' as LeadStatus,
      source: 'indicacao' as LeadSource,
    }
  ];
}

function generateMockSpaces() {
  return [
    {
      name: 'Sala Executiva A',
      type: 'private_office' as ServiceType,
      description: 'Sala privativa para até 4 pessoas',
      floor: 2,
      area: 15,
      capacity: 4,
      is_active: true
    },
    {
      name: 'Estação Flex 01',
      type: 'flex_desk' as ServiceType,
      description: 'Estação de trabalho flexível',
      floor: 1,
      area: 2,
      capacity: 1,
      is_active: true
    }
  ];
}

export async function seedDatabase() {
  try {
    console.log('Seeding pipeline stages...');
    const { data: existingStages } = await supabase
      .from('pipeline_stages')
      .select('*');
    
    if (!existingStages?.length) {
      const { error: stagesError } = await supabase
        .from('pipeline_stages')
        .insert(generateMockPipelineStages());
      
      if (stagesError) throw stagesError;
      console.log('  ✅ Pipeline stages seeded');
    } else {
      console.log('  ℹ️ Pipeline stages already exist');
    }
    
    console.log('Seeding leads...');
    const { data: existingLeads } = await supabase
      .from('leads')
      .select('*');
    
    if (!existingLeads?.length) {
      // Create leads one by one using the lead persistence layer
      const leadsToCreate = generateMockLeads();
      for (const leadData of leadsToCreate) {
        // Create a proper Lead object with default values
        const lead = {
          id: '',
          name: leadData.name,
          company: leadData.company,
          email: leadData.email,
          phone: leadData.phone,
          status: leadData.status,
          source: leadData.source,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          stage: {
            id: '',
            name: '',
            order: 0,
            color: ''
          }
        };
        
        await persistence.createLead(lead);
      }
      
      console.log('  ✅ Leads seeded');
    } else {
      console.log('  ℹ️ Leads already exist');
    }
    
    console.log('Seeding spaces...');
    const { data: existingSpaces } = await supabase
      .from('spaces')
      .select('*');
    
    if (!existingSpaces?.length) {
      // Insert spaces one by one
      for (const spaceData of generateMockSpaces()) {
        const space = {
          id: '',
          name: spaceData.name,
          type: spaceData.type,
          description: spaceData.description,
          floor: spaceData.floor,
          area: spaceData.area,
          capacity: spaceData.capacity,
          isActive: spaceData.is_active,
          createdAt: '',
          updatedAt: ''
        };
        
        await persistence.createSpace(space);
      }
      
      console.log('  ✅ Spaces seeded');
    } else {
      console.log('  ℹ️ Spaces already exist');
    }
    
    return true;
  } catch (error) {
    console.error('Error seeding database:', error);
    return false;
  }
}
