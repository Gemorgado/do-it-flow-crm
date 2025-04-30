
import * as XLSX from 'xlsx';

export async function readSpreadsheet(file: File): Promise<{
  headers: string[];
  rows: Record<string, any>[];
}> {
  try {
    const arrayBuffer = await file.arrayBuffer();
    const data = new Uint8Array(arrayBuffer);
    
    // Try to read the file with different options in case of encoding issues
    let workbook;
    try {
      workbook = XLSX.read(data, { type: 'array', WTF: false });
    } catch (e) {
      console.warn('First attempt to read file failed, trying with different options:', e);
      workbook = XLSX.read(data, { type: 'array', WTF: true, cellDates: true });
    }
    
    if (!workbook || !workbook.SheetNames || workbook.SheetNames.length === 0) {
      throw new Error('Invalid spreadsheet format or empty file');
    }
    
    const worksheet = workbook.Sheets[workbook.SheetNames[0]];
    
    if (!worksheet) {
      throw new Error('Worksheet not found in the file');
    }
    
    // Use header parameter to ensure first row is treated as headers
    const rows = XLSX.utils.sheet_to_json<Record<string, any>>(worksheet, { 
      defval: '',
      header: 1, // Use 1-indexed headers
      blankrows: false
    });
    
    // If rows exist but no data found, try again with different options
    if (rows.length <= 1) {
      console.warn('No data found in standard format, trying alternative parsing');
      const rowsAlt = XLSX.utils.sheet_to_json<Record<string, any>>(worksheet, { 
        defval: '', 
        raw: false,
        blankrows: false
      });
      
      if (rowsAlt.length > 0) {
        // Extract headers from the first row
        const headers = Object.keys(rowsAlt[0]);
        return { headers, rows: rowsAlt };
      }
    }
    
    // If we have rows with the header parameter, first row contains headers
    if (rows.length > 0) {
      const headers = rows[0] as string[];
      const dataRows = rows.slice(1).map((row: any[]) => {
        const obj: Record<string, any> = {};
        headers.forEach((header, i) => {
          if (header) { // Skip empty headers
            obj[header] = row[i] || '';
          }
        });
        return obj;
      });
      
      return { headers, rows: dataRows };
    }
    
    throw new Error('No data found in the spreadsheet');
  } catch (error) {
    console.error('Error reading spreadsheet:', error);
    throw new Error('Failed to read spreadsheet file: ' + (error instanceof Error ? error.message : 'Unknown error'));
  }
}
