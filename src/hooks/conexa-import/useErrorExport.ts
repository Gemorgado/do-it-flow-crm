
import { useState } from 'react';

export function useErrorExport() {
  const downloadErrorsCSV = (errorRows: Array<{ index: number; error: string; row: Record<string, any> }>) => {
    if (errorRows.length === 0) return;
    
    const headers = ['Row Index', 'Error', ...Object.keys(errorRows[0]?.row || {})];
    const csvContent = [
      headers.join(','),
      ...errorRows.map(({ index, error, row }) => {
        const rowValues = Object.values(row).map(val => `"${String(val).replace(/"/g, '""')}"`);
        return [index, `"${error.replace(/"/g, '""')}"`, ...rowValues].join(',');
      })
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', 'conexa_import_errors.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return { downloadErrorsCSV };
}
