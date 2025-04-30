
import { useState, useEffect } from "react";
import { formatDocument, validateDocument } from "@/utils/documentUtils";

interface UseDocumentValidationProps {
  initialValue?: string;
  onChange?: (value: string, isValid: boolean) => void;
}

export function useDocumentValidation({ 
  initialValue = "", 
  onChange 
}: UseDocumentValidationProps = {}) {
  const [document, setDocument] = useState(initialValue);
  const [documentError, setDocumentError] = useState<string | null>(null);
  const [documentType, setDocumentType] = useState<'cpf' | 'cnpj' | null>(null);
  const [isValid, setIsValid] = useState(false);

  // Format and validate the document
  const handleDocumentChange = (value: string) => {
    const formattedValue = formatDocument(value);
    setDocument(formattedValue);
    
    if (!formattedValue) {
      setDocumentError(null);
      setDocumentType(null);
      setIsValid(false);
      if (onChange) onChange(formattedValue, false);
      return formattedValue;
    }
    
    // Determine document type
    const cleanValue = formattedValue.replace(/\D/g, '');
    const newDocumentType = cleanValue.length <= 11 ? 'cpf' : 'cnpj';
    setDocumentType(newDocumentType);
    
    // Validate the document
    const docIsValid = validateDocument(formattedValue);
    setIsValid(docIsValid);
    
    if (!docIsValid) {
      setDocumentError(`${newDocumentType === 'cpf' ? 'CPF' : 'CNPJ'} inválido`);
    } else {
      setDocumentError(null);
    }
    
    if (onChange) onChange(formattedValue, docIsValid);
    return formattedValue;
  };

  // Validate initial value if provided
  useEffect(() => {
    if (initialValue) {
      handleDocumentChange(initialValue);
    }
  }, [initialValue]);

  return {
    document,
    documentError,
    documentType,
    isValid,
    handleDocumentChange,
    setDocument
  };
}
