
import { useState } from "react";
import { formatDocument } from "@/utils/documentUtils";

export function useDocumentFormatting() {
  const [formattedValue, setFormattedValue] = useState("");

  const handleDocumentChange = (value: string) => {
    const formatted = formatDocument(value);
    setFormattedValue(formatted);
    return formatted;
  };

  return {
    formattedValue,
    handleDocumentChange
  };
}
