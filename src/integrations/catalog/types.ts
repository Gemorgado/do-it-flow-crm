
export interface Plan {
  id: string;
  category: 'endereco_fiscal' | 'estacao_flex' | 'estacao_fixa' | 'sala_privativa' | 'sala_reuniao' | 'auditorio';
  title: string;              // ex.: "Endereço Fiscal"
  variants: Variant[];        // mensal, semestral, anual…
  benefits: string[];
}

export interface Variant {
  label: string;              // "Mensal", "Semestral", "Diária"…
  price: string;              // manter string p/ formato exato "12x de R$ 150,00"
  note?: string;              // desconto, condição
}
