
import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useConexaImport } from '@/hooks/useConexaImport';
import { useConexaMapper } from '@/hooks/useConexaMapper';
import { Loader, FileSpreadsheet, AlertTriangle, X, Check } from 'lucide-react';

export default function ConexaImportPage() {
  const { status, file, results, readFile, processImport, downloadErrorsCSV } = useConexaImport();
  const { mapping, setMapping } = useConexaMapper(results.headers);
  const [previewRows, setPreviewRows] = useState<number>(5);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      readFile(acceptedFiles[0]);
    }
  }, [readFile]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/vnd.ms-excel': ['.xls'],
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx']
    },
    maxFiles: 1,
    disabled: status === 'reading' || status === 'processing'
  });

  const handleMappingChange = (field: string, value: string | null) => {
    setMapping(prev => ({
      ...prev,
      [field]: value || undefined
    }));
  };

  const requiredFields = ['name', 'docNumber', 'serviceType'];

  const handleImport = () => {
    processImport(mapping);
  };

  const renderFileUploader = () => (
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

  const renderColumnMapping = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-6">
        {Object.entries({
          name: "Nome do Cliente",
          docNumber: "CNPJ/CPF",
          email: "E-mail",
          phone: "Telefone",
          serviceType: "Tipo de Serviço",
          roomNumber: "Número da Sala",
          status: "Status do Contrato"
        }).map(([field, label]) => (
          <div key={field} className="space-y-1">
            <label className="text-sm font-medium flex items-center">
              {label} 
              {requiredFields.includes(field) && (
                <span className="text-red-500 ml-1">*</span>
              )}
            </label>
            <Select
              value={mapping[field as keyof typeof mapping] || ""}
              onValueChange={value => handleMappingChange(field, value === "" ? null : value)}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Selecione a coluna" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Não mapear</SelectItem>
                {results.headers.map(header => (
                  <SelectItem key={header} value={header}>{header}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        ))}
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-medium">Pré-visualização dos dados</h3>
        <div className="border rounded overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                {results.headers.map(header => (
                  <TableHead key={header} className="whitespace-nowrap">
                    {header}
                    {Object.entries(mapping).map(([field, mappedHeader]) => 
                      mappedHeader === header ? (
                        <span key={field} className="ml-2 text-xs font-normal text-primary">
                          ({field})
                        </span>
                      ) : null
                    )}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {results.rows.slice(0, previewRows).map((row, index) => (
                <TableRow key={index}>
                  {results.headers.map(header => (
                    <TableCell key={`${index}-${header}`} className="whitespace-nowrap truncate max-w-[200px]">
                      {String(row[header] || '')}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        <div className="flex justify-end">
          <Button 
            variant="outline"
            onClick={() => setPreviewRows(prev => prev === 5 ? 10 : 5)}
          >
            {previewRows === 5 ? "Mostrar mais linhas" : "Mostrar menos linhas"}
          </Button>
        </div>
      </div>
    </div>
  );

  const renderResults = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-6">
        <div className="rounded-lg border bg-card p-4">
          <div className="text-2xl font-bold">{results.processedCount.customers}</div>
          <p className="text-sm text-muted-foreground">Clientes processados</p>
        </div>
        <div className="rounded-lg border bg-card p-4">
          <div className="text-2xl font-bold">{results.processedCount.contracts}</div>
          <p className="text-sm text-muted-foreground">Contratos criados</p>
        </div>
        <div className="rounded-lg border bg-card p-4">
          <div className="text-2xl font-bold">{results.processedCount.services}</div>
          <p className="text-sm text-muted-foreground">Serviços mapeados</p>
        </div>
        <div className="rounded-lg border bg-card p-4">
          <div className="text-2xl font-bold">{results.processedCount.roomOccupations}</div>
          <p className="text-sm text-muted-foreground">Salas ocupadas</p>
        </div>
      </div>

      {results.errorRows.length > 0 && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Erros na importação</AlertTitle>
          <AlertDescription>
            {results.errorRows.length} linhas não puderam ser processadas.
            <Button 
              variant="link" 
              onClick={downloadErrorsCSV} 
              className="p-0 h-auto font-semibold"
            >
              Baixar log de erros (CSV)
            </Button>
          </AlertDescription>
        </Alert>
      )}
    </div>
  );

  const getCardContent = () => {
    if (status === 'idle' || status === 'reading') {
      return renderFileUploader();
    }
    if (status === 'mapping') {
      return renderColumnMapping();
    }
    if (status === 'success') {
      return renderResults();
    }
    if (status === 'error') {
      return (
        <Alert variant="destructive" className="mb-6">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Erro na importação</AlertTitle>
          <AlertDescription>
            Ocorreu um erro ao processar o arquivo. Tente novamente ou contate o suporte.
          </AlertDescription>
        </Alert>
      );
    }
    return null;
  };

  return (
    <div className="container py-10 animate-fade-in">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-2">Importação de Dados Conexa</h1>
        <p className="text-muted-foreground mb-6">
          Importe dados de clientes, contratos e serviços diretamente de uma planilha do Conexa.
        </p>
        
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>
              {status === 'idle' && "Selecione uma planilha para importar"}
              {status === 'reading' && "Lendo planilha..."}
              {status === 'mapping' && "Mapeamento de colunas"}
              {status === 'processing' && "Processando dados..."}
              {status === 'success' && "Importação concluída"}
              {status === 'error' && "Erro na importação"}
            </CardTitle>
            {status === 'mapping' && (
              <CardDescription>
                Relacione as colunas da sua planilha com os campos do sistema. Campos com * são obrigatórios.
              </CardDescription>
            )}
            {file && status !== 'idle' && (
              <div className="flex items-center text-sm text-muted-foreground">
                <FileSpreadsheet className="h-4 w-4 mr-2" />
                {file.name}
              </div>
            )}
          </CardHeader>
          <CardContent>
            {getCardContent()}
          </CardContent>
          <CardFooter className="flex justify-between border-t pt-6">
            <Button 
              variant="outline" 
              onClick={() => window.location.href = "/integrations"}
              disabled={status === 'processing'}
            >
              {status === 'success' ? "Voltar para Integrações" : "Cancelar"}
            </Button>
            
            {status === 'mapping' && (
              <Button 
                onClick={handleImport}
                disabled={requiredFields.some(field => !mapping[field as keyof typeof mapping])}
              >
                Importar dados
              </Button>
            )}
            
            {status === 'processing' && (
              <Button disabled>
                <Loader className="mr-2 h-4 w-4 animate-spin" /> 
                Processando...
              </Button>
            )}
            
            {status === 'success' && (
              <div className="flex gap-3">
                <Button variant="outline" onClick={() => window.location.reload()}>
                  <X className="mr-2 h-4 w-4" /> 
                  Limpar e importar outra
                </Button>
                <Button onClick={() => window.location.href = "/integrations"}>
                  <Check className="mr-2 h-4 w-4" /> 
                  Concluir
                </Button>
              </div>
            )}
            
            {status === 'error' && (
              <Button onClick={() => window.location.reload()}>
                Tentar novamente
              </Button>
            )}
          </CardFooter>
        </Card>
        
        <div className="text-sm text-muted-foreground">
          <p className="mb-2">Dicas para uma importação bem-sucedida:</p>
          <ul className="list-disc pl-5 space-y-1">
            <li>Verifique se a primeira linha da planilha contém os cabeçalhos das colunas</li>
            <li>Os campos Nome, CNPJ/CPF e Tipo de Serviço são obrigatórios</li>
            <li>CNPJs e CPFs serão formatados automaticamente, não se preocupe com a formatação</li>
            <li>Para novos clientes, todos os contratos serão criados com data de início atual</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
