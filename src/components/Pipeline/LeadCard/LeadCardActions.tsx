
import { Lead } from "@/types";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { 
  MoreVertical, 
  Edit, 
  UserCheck, 
  Calendar, 
  Phone, 
  Trash, 
  Mail 
} from "lucide-react";

interface LeadCardActionsProps {
  lead: Lead;
  onConvert: () => void;
  onEdit: () => void;
}

export function LeadCardActions({ lead, onConvert, onEdit }: LeadCardActionsProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="p-0.5 hover:bg-gray-100 rounded">
          <MoreVertical className="h-4 w-4 text-gray-500" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuItem onClick={onEdit} className="cursor-pointer">
          <Edit className="mr-2 h-4 w-4" />
          <span>Editar</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={onConvert} className="cursor-pointer">
          <UserCheck className="mr-2 h-4 w-4" />
          <span>Converter para cliente</span>
        </DropdownMenuItem>
        <DropdownMenuItem className="cursor-pointer">
          <Calendar className="mr-2 h-4 w-4" />
          <span>Agendar reunião</span>
        </DropdownMenuItem>
        <DropdownMenuItem className="cursor-pointer">
          <Phone className="mr-2 h-4 w-4" />
          <span>Registrar contato</span>
        </DropdownMenuItem>
        <DropdownMenuItem className="cursor-pointer">
          <Mail className="mr-2 h-4 w-4" />
          <span>Enviar email</span>
        </DropdownMenuItem>
        <DropdownMenuItem className="cursor-pointer text-red-600 hover:text-red-800 hover:bg-red-50">
          <Trash className="mr-2 h-4 w-4" />
          <span>Excluir</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
