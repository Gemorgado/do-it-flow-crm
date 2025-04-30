
import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { FileSpreadsheet } from 'lucide-react';

interface FileUploaderProps {
  onDrop: (acceptedFiles: File[]) => void;
  isLoading: boolean;
}

export function FileUploader({ onDrop, isLoading }: FileUploaderProps) {
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/vnd.ms-excel': ['.xls'],
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx']
    },
    maxFiles: 1,
    disabled: isLoading
  });

  return (
    <div 
      {...getRootProps()} 
      className={`border-2 border-dashed rounded-lg p-10 text-center cursor-pointer transition-colors
        ${isDragActive ? 'border-primary bg-primary/10' : 'border-gray-300 hover:border-primary/50'}`}
    >
      <input {...getInputProps()} />
      <FileSpreadsheet className="mx-auto h-16 w-16 text-muted-foreground mb-4" />
      {isDragActive ? (
        <p className="text-lg font-medium">Solte o arquivo aqui...</p>
      ) : (
        <>
          <p className="text-lg font-medium mb-2">Arraste uma planilha do Conexa ou clique para selecionar</p>
          <p className="text-sm text-muted-foreground">Aceita arquivos .xls e .xlsx</p>
        </>
      )}
    </div>
  );
}
