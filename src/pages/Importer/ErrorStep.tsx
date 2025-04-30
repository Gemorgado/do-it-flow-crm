
import React from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Download, AlertCircle, ArrowLeft } from 'lucide-react';
import { ImportError } from '@/integrations/importer/types';

interface ErrorStepProps {
  errors: ImportError[];
  onDownloadErrors: () => void;
  onBack: () => void;
}

export function ErrorStep({ errors, onDownloadErrors, onBack }: ErrorStepProps) {
  const displayErrors = errors.slice(0, 10); // Show only first 10 errors
  
  return (
    <div className="space-y-4">
      <Card className="border-red-200 bg-red-50">
        <CardHeader>
          <CardTitle className="text-red-800 flex items-center gap-2">
            <AlertCircle className="h-5 w-5" />
            Erros na Importação
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <p className="text-red-700">
              Foram encontrados {errors.length} erros na sua planilha. Corrija os problemas e tente importar novamente.
            </p>
          </div>
          
          <div className="border rounded-md overflow-x-auto bg-white">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Linha</TableHead>
                  <TableHead>Descrição do Erro</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {displayErrors.map((error, index) => (
                  <TableRow key={index}>
                    <TableCell>{error.line}</TableCell>
                    <TableCell>
                      <ul className="list-disc list-inside">
                        {error.issues.map((issue, i) => (
                          <li key={i}>
                            {issue.path.length > 0 ? `${issue.path.join('.')}: ` : ''}
                            {issue.message}
                          </li>
                        ))}
                      </ul>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          
          {errors.length > 10 && (
            <div className="mt-2 text-sm text-red-700">
              Mostrando 10 de {errors.length} erros. Baixe o relatório completo para ver todos.
            </div>
          )}
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" onClick={onBack} className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            Voltar
          </Button>
          <Button onClick={onDownloadErrors} variant="secondary" className="gap-2">
            <Download className="h-4 w-4" />
            Baixar Relatório de Erros
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
