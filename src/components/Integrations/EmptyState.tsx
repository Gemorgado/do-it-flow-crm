
import { CircleOff } from "lucide-react";

interface EmptyStateProps {
  msg: string;
}

export function EmptyState({ msg }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
      <CircleOff className="h-12 w-12 text-gray-400 mb-4" />
      <h3 className="text-lg font-medium text-gray-700 mb-2">{msg}</h3>
      <p className="text-gray-500 max-w-sm">
        Conecte novas integrações na aba "Disponíveis" para ativar funcionalidades adicionais.
      </p>
    </div>
  );
}
