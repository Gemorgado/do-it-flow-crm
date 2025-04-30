
import { useState } from "react";
import { formatDocument, validateDocument } from "@/utils/documentUtils";

export function useDocumentValidation(initialValue: string = "") {
  const [document, setDocument] = useState(initialValue);
  const [documentError, setDocumentError] = useState<string | null>(null);

  const handleDocumentChange = (value: string) => {
    const formattedValue = formatDocument(value);
    setDocument(formattedValue);
    
    if (!formattedValue) {
      setDocumentError(null);
      return formattedValue;
    }
    
    const isValid = validateDocument(formattedValue);
    setDocumentError(isValid ? null : "CNPJ ou CPF inválido");
    
    return formattedValue;
  };

  return {
    document,
    documentError,
    handleDocumentChange,
    isValid: !documentError && !!document
  };
}
