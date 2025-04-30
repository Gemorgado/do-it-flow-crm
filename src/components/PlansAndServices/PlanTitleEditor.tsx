
import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";

interface PlanTitleEditorProps {
  title: string;
  isEditing: boolean;
  onUpdate: (title: string) => void;
}

export const PlanTitleEditor = ({ title: initialTitle, isEditing, onUpdate }: PlanTitleEditorProps) => {
  const [title, setTitle] = useState(initialTitle);
  
  useEffect(() => {
    setTitle(initialTitle);
  }, [initialTitle]);
  
  const handleChange = (value: string) => {
    setTitle(value);
    onUpdate(value);
  };
  
  if (!isEditing) {
    return <span>{title}</span>;
  }
  
  return (
    <Input 
      value={title} 
      onChange={(e) => handleChange(e.target.value)}
      className="max-w-[250px]"
    />
  );
};
