
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { useState, useEffect } from "react";
import { useGetProposal, useUpdateProposal } from "@/api/proposal";
import { Proposal } from "@/types";

interface ProposalEditDialogProps {
  open: boolean;
  id: string | null;
  onClose: () => void;
}

export function ProposalEditDialog({ open, id, onClose }: ProposalEditDialogProps) {
  const { data: proposal, isLoading } = useGetProposal(id);
  const { mutate: updateProposal, isPending } = useUpdateProposal();
  
  const [formData, setFormData] = useState<Partial<Proposal>>({
    title: "",
    value: 0,
    status: "enviada",
    expiresAt: ""
  });

  useEffect(() => {
    if (proposal) {
      setFormData({
        title: proposal.title,
        value: proposal.value,
        status: proposal.status,
        expiresAt: proposal.expiresAt
      });
    }
  }, [proposal]);

  const handleChange = (field: keyof typeof formData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = () => {
    if (id) {
      updateProposal(
        { id, data: formData },
        { onSuccess: onClose }
      );
    }
  };

  return (
    <Dialog open={open} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Editar Proposta</DialogTitle>
        </DialogHeader>

        {isLoading ? (
          <div className="flex justify-center py-8">Carregando...</div>
        ) : (
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="title">Título</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => handleChange("title", e.target.value)}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="value">Valor (R$)</Label>
              <Input
                id="value"
                type="number"
                value={formData.value}
                onChange={(e) => handleChange("value", Number(e.target.value))}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="status">Status</Label>
              <Select 
                value={formData.status} 
                onValueChange={(value) => handleChange("status", value as Proposal["status"])}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="enviada">Enviada</SelectItem>
                  <SelectItem value="visualizada">Visualizada</SelectItem>
                  <SelectItem value="aceita">Aceita</SelectItem>
                  <SelectItem value="rejeitada">Rejeitada</SelectItem>
                  <SelectItem value="expirada">Expirada</SelectItem>
                  <SelectItem value="em_negociacao">Em Negociação</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="expiresAt">Data de validade</Label>
              <Input
                id="expiresAt"
                type="date"
                value={formData.expiresAt ? new Date(formData.expiresAt).toISOString().split("T")[0] : ""}
                onChange={(e) => handleChange("expiresAt", new Date(e.target.value).toISOString())}
              />
            </div>
          </div>
        )}

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button 
            onClick={handleSubmit}
            disabled={isPending || isLoading}
          >
            {isPending ? "Salvando..." : "Salvar"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
