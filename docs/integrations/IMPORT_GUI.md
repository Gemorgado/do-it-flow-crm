
# Conexa Spreadsheet Import Guide

This document provides an overview of how the Conexa Excel import functionality works for importing customer, contract, and service data into the Do It Flow system.

## Overview

The import feature allows administrators to upload Excel files (.xls or .xlsx) exported from Conexa ERP, map the columns to the Do It Flow system fields, and import all data in one operation.

## Features

- Drag-and-drop interface for uploading Excel files
- Automatic column mapping suggestions based on common header names
- Manual column mapping controls for custom spreadsheet formats
- Data preview before import
- Validation of required fields
- Error handling with downloadable error logs
- Import summary with counts of processed items

## File Format Requirements

The Excel file should include the following columns (header names may vary):

- **Customer Name**: Name or company name of the customer
- **Document Number**: CNPJ or CPF of the customer
- **Service Type**: Type of service contracted
- **Optional columns**: Email, Phone, Room Number, Contract Status

## Implementation Details

### Component Structure

- `ConexaImportPage.tsx`: Main page component with UI for file upload and mapping
- `useConexaImport.ts`: Hook for handling the import process
- `useConexaMapper.ts`: Hook for managing column mapping

### Data Flow

1. User uploads an Excel file
2. File is read and parsed using the SheetJS library
3. Column headers are extracted and mapped to system fields
4. User confirms or adjusts the mapping
5. Data is processed and transformed into a ConexaSnapshot
6. The snapshot is processed using the existing processConexaSnapshot function
7. Results are displayed to the user

### Data Persistence

Currently, the import uses the same `persistence` adapter as the rest of the Conexa integration, which defaults to the `LocalStorageAdapter`. When transitioning to a real database:

1. Create a new adapter that implements the `PersistenceAdapter` interface
2. Update the persistence export in `src/integrations/persistence.ts`
3. No changes will be needed in the import functionality itself

## Extending the Import

To add support for additional fields:

1. Add the new field to the `ColumnMapping` type in `useConexaMapper.ts`
2. Add auto-detection patterns for the field in the `commonHeaderMappings` object
3. Add the field to the mapping UI in `ConexaImportPage.tsx`
4. Update the data processing logic in `processImport` function to handle the new field

## Error Handling

The import provides detailed error handling:

- Required field validation before processing
- Try/catch blocks for each row to prevent a single error from failing the entire import
- Error rows are collected and can be downloaded as a CSV file
- Toast notifications for success and error states

## Future Improvements

- Add support for multiple sheets in a workbook
- Add advanced validation rules for specific fields
- Provide template download option for users
- Add option to update existing records vs. create new only
