
import { MappingTemplate } from './types';
import { v4 as uuidv4 } from 'uuid';

const STORAGE_KEY = 'import_templates';

// Predefined template for Relatório de Contratos
const CONTRATO_TEMPLATE: MappingTemplate = {
  id: 'conexa_relatorio_contratos',
  name: 'Conexa – Relatório de Contratos',
  columnMap: {
    'Razão Social': 'name',
    'CNPJ': 'id', 
    'E-mail': 'billingEmails', 
    'Telefone': 'id', 
    'Plano': 'plan', 
    'Sala / Estação': 'privateRoom', 
    'Data Início Contrato': 'contractStart',
    'Data Fim Contrato': 'contractEnd',
    'Valor': 'contractValue',
  },
  createdAt: '2025-04-30T00:00:00Z',
};

export const TemplateStore = {
  list: (): MappingTemplate[] => {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    } catch (e) {
      console.error('Error parsing templates from localStorage:', e);
      return [];
    }
  },
  
  get: (id: string): MappingTemplate | undefined => {
    return TemplateStore.list().find(tpl => tpl.id === id);
  },
  
  save: (template: Omit<MappingTemplate, 'id' | 'createdAt'>): MappingTemplate => {
    const newTemplate: MappingTemplate = {
      ...template,
      id: uuidv4(),
      createdAt: new Date().toISOString()
    };
    
    const existingTemplates = TemplateStore.list();
    localStorage.setItem(
      STORAGE_KEY, 
      JSON.stringify([...existingTemplates, newTemplate])
    );
    
    return newTemplate;
  },
  
  update: (template: MappingTemplate): void => {
    const templates = TemplateStore.list();
    const index = templates.findIndex(t => t.id === template.id);
    
    if (index >= 0) {
      templates[index] = template;
      localStorage.setItem(STORAGE_KEY, JSON.stringify(templates));
    }
  },
  
  delete: (id: string): void => {
    const templates = TemplateStore.list();
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(templates.filter(t => t.id !== id))
    );
  },
  
  // Initialize default templates if they don't exist yet
  initialize: (): void => {
    const templates = TemplateStore.list();
    
    // Check if template already exists
    if (!templates.some(t => t.id === 'conexa_relatorio_contratos')) {
      // Save the predefined template
      const existing = templates.find(t => t.name === CONTRATO_TEMPLATE.name);
      if (!existing) {
        localStorage.setItem(
          STORAGE_KEY,
          JSON.stringify([...templates, CONTRATO_TEMPLATE])
        );
      }
    }
  }
};

// Initialize templates on module load
TemplateStore.initialize();
