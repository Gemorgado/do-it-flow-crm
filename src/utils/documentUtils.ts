
/**
 * Formata um número de documento (CPF/CNPJ) de acordo com o comprimento
 * @param value String contendo apenas números
 * @returns String formatada como CPF ou CNPJ
 */
export function formatDocument(value: string): string {
  // Remove caracteres não numéricos
  const cleanValue = value.replace(/\D/g, '');
  
  // Formata como CPF (000.000.000-00)
  if (cleanValue.length <= 11) {
    return cleanValue
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d{1,2})$/, '$1-$2');
  }
  
  // Formata como CNPJ (00.000.000/0000-00)
  return cleanValue
    .replace(/^(\d{2})(\d)/, '$1.$2')
    .replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3')
    .replace(/\.(\d{3})(\d)/, '.$1/$2')
    .replace(/(\d{4})(\d)/, '$1-$2');
}

/**
 * Valida se a string é um CPF ou CNPJ válido
 * @param value String contendo o documento a ser validado
 * @returns Boolean indicando se o documento é válido
 */
export function validateDocument(value: string): boolean {
  // Remove caracteres não numéricos
  const cleanValue = value.replace(/\D/g, '');
  
  // Valida CPF
  if (cleanValue.length === 11) {
    // Validação simplificada: verifica se não são todos dígitos iguais
    return !/^(\d)\1{10}$/.test(cleanValue);
  }
  
  // Valida CNPJ
  if (cleanValue.length === 14) {
    // Validação simplificada: verifica se não são todos dígitos iguais
    return !/^(\d)\1{13}$/.test(cleanValue);
  }
  
  return false;
}
