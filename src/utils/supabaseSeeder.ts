
import { supabase } from '@/integrations/supabase/client';
import { ServiceType } from '@/types/service';

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
      status: 'new',
      source: 'site_organic',
    },
    {
      email: 'maria.oliveira@exemplo.com',
      name: 'Maria Oliveira',
      company: 'Startup XYZ',
      phone: '(11) 91234-5678',
      status: 'contacted',
      source: 'referral',
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
      const { error: leadsError } = await supabase
        .from('leads')
        .insert(generateMockLeads());
      
      if (leadsError) throw leadsError;
      console.log('  ✅ Leads seeded');
    } else {
      console.log('  ℹ️ Leads already exist');
    }
    
    console.log('Seeding spaces...');
    const { data: existingSpaces } = await supabase
      .from('spaces')
      .select('*');
    
    if (!existingSpaces?.length) {
      const { error: spacesError } = await supabase
        .from('spaces')
        .insert(generateMockSpaces());
      
      if (spacesError) throw spacesError;
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
