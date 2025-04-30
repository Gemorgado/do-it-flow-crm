
import { ImportError } from '../types';

/**
 * Generates a CSV string containing error information for download
 */
export const generateErrorCSV = (errors: ImportError[]): string => {
  const headers = "Linha,Código,Campo,Erro\n";
  
  const rows = errors.flatMap(error => {
    return error.issues.map(issue => {
      const field = issue.path.join('.');
      return `${error.line},"${issue.code}","${field}","${issue.message}"`;
    });
  });
  
  return headers + rows.join('\n');
};
