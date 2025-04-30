
import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Card } from '@/components/ui/card';
import { FileUpload } from 'lucide-react';

interface UploadStepProps {
  onFileSelect: (file: File) => void;
  isLoading?: boolean;
}

export function UploadStep({ onFileSelect, isLoading = false }: UploadStepProps) {
  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      onFileSelect(acceptedFiles[0]);
    }
  }, [onFileSelect]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/vnd.ms-excel': ['.xls'],
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
      'text/csv': ['.csv']
    },
    disabled: isLoading,
    multiple: false
  });

  return (
    <Card 
      {...getRootProps()} 
      className={`p-8 border-2 border-dashed cursor-pointer text-center ${
        isDragActive ? 'border-primary bg-primary/5' : 'border-muted'
      } transition-colors`}
    >
      <input {...getInputProps()} />
      <div className="flex flex-col items-center justify-center gap-2">
        <FileUpload 
          className={`h-12 w-12 ${isLoading ? 'animate-pulse text-muted' : 'text-primary/60'}`}
        />
        <h3 className="text-lg font-medium">
          {isLoading ? 'Processando...' : 'Arraste uma planilha ou clique para selecionar'}
        </h3>
        <p className="text-sm text-muted-foreground">
          {isDragActive 
            ? 'Solte o arquivo aqui...' 
            : 'Formatos suportados: XLS, XLSX, CSV'}
        </p>
      </div>
    </Card>
  );
}
