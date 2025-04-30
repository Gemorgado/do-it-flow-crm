
import { useState } from "react";
import { formatDocument, validateDocument } from "@/utils/documentUtils";

export function useDocumentValidation(initialValue: string = "") {
  const [document, setDocument] = useState(initialValue);
  const [documentError, setDocumentError] = useState<string | null>(null);
  const [documentType, setDocumentType] = useState<'cpf' | 'cnpj' | null>(null);

  const handleDocumentChange = (value: string) => {
    const formattedValue = formatDocument(value);
    setDocument(formattedValue);
    
    if (!formattedValue) {
      setDocumentError(null);
      setDocumentType(null);
      return formattedValue;
    }
    
    // Determine document type
    const cleanValue = formattedValue.replace(/\D/g, '');
    if (cleanValue.length <= 11) {
      setDocumentType('cpf');
    } else {
      setDocumentType('cnpj');
    }
    
    const isValid = validateDocument(formattedValue);
    setDocumentError(isValid ? null : `${documentType === 'cpf' ? 'CPF' : 'CNPJ'} inválido`);
    
    return formattedValue;
  };

  return {
    document,
    documentError,
    documentType,
    handleDocumentChange,
    isValid: !documentError && !!document
  };
}
