
export type InternalField =
  | 'id'
  | 'name'
  | 'plan'
  | 'contractStart'
  | 'contractEnd'
  | 'contractTerm'
  | 'contractValue'
  | 'dueDay'
  | 'privateRoom'
  | 'billingEmails'
  | 'createdBy'
  | 'lastReadjustDate'
  | 'readjustIndex'
  | 'isActive';

export interface MappingTemplate {
  id: string;                 // uuid
  name: string;               // "Conexa – Contratos"
  columnMap: Record<string, InternalField>; // "Razão Social" -> 'name'
  createdAt: string;
}

export type ImportStep = 'upload' | 'mapping' | 'preview' | 'processing' | 'complete' | 'error';

export interface ImportError {
  line: number;
  issues: Array<{
    code: string;
    message: string;
    path: string[];
  }>;
  rawData?: Record<string, any>;
}

export interface PreviewData {
  headers: string[];
  rows: Record<string, any>[];
  mapping: Record<string, InternalField>;
}
