
import * as XLSX from 'xlsx';

export async function readSpreadsheet(file: File): Promise<{
  headers: string[];
  rows: Record<string, any>[];
}> {
  try {
    const arrayBuffer = await file.arrayBuffer();
    const data = new Uint8Array(arrayBuffer);
    const workbook = XLSX.read(data, { type: 'array' });
    const worksheet = workbook.Sheets[workbook.SheetNames[0]];
    const rows = XLSX.utils.sheet_to_json<Record<string, any>>(worksheet, { defval: '' });
    
    // Extract headers from the first row
    const headers = rows.length > 0 ? Object.keys(rows[0]) : [];
    
    return { headers, rows };
  } catch (error) {
    console.error('Error reading spreadsheet:', error);
    throw new Error('Failed to read spreadsheet file');
  }
}
