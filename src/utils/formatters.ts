
/**
 * Format a number to a currency string
 * @param value - The number to format
 * @returns Formatted currency string or empty string if value is null
 */
export function formatCurrency(value: number | null | undefined): string {
  if (value === null || value === undefined) return "";
  return new Intl.NumberFormat('pt-BR', { 
    style: 'currency', 
    currency: 'BRL' 
  }).format(value);
}

/**
 * Format a date string to a localized date string
 * @param dateString - The date string to format
 * @returns Formatted date string or empty string if dateString is null
 */
export function formatDate(dateString: string | null): string {
  if (!dateString) return "";
  try {
    return new Intl.DateTimeFormat('pt-BR').format(new Date(dateString));
  } catch (e) {
    return "";
  }
}
