
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { useCreateWebhook } from "./useWebhooks";
import type { WebhookEvent } from "./types";

interface WebhookModalProps {
  open: boolean;
  onClose: () => void;
}

const webhookEvents: { value: WebhookEvent; label: string }[] = [
  { value: 'snapshot.applied', label: 'Snapshot Aplicado' },
  { value: 'customer.created', label: 'Cliente Criado' },
  { value: 'contract.updated', label: 'Contrato Atualizado' },
  { value: 'room.occupied', label: 'Sala Ocupada' },
];

export function WebhookModal({ open, onClose }: WebhookModalProps) {
  const [url, setUrl] = React.useState('');
  const [secret, setSecret] = React.useState('');
  const [selectedEvents, setSelectedEvents] = React.useState<WebhookEvent[]>([]);
  const { toast } = useToast();
  const createWebhook = useCreateWebhook();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!url) {
      toast({
        title: "URL obrigatória",
        description: "Por favor, informe a URL do webhook",
        variant: "destructive",
      });
      return;
    }
    
    if (selectedEvents.length === 0) {
      toast({
        title: "Selecione pelo menos um evento",
        description: "O webhook precisa ser acionado por pelo menos um evento",
        variant: "destructive",
      });
      return;
    }
    
    createWebhook.mutate({
      url,
      events: selectedEvents,
      secret: secret || undefined,
    }, {
      onSuccess: () => {
        toast({
          title: "Webhook criado",
          description: "Webhook vinculado com sucesso",
        });
        handleClose();
      },
      onError: (error) => {
        toast({
          title: "Erro ao criar webhook",
          description: String(error),
          variant: "destructive",
        });
      }
    });
  };
  
  const handleClose = () => {
    setUrl('');
    setSecret('');
    setSelectedEvents([]);
    onClose();
  };
  
  const toggleEvent = (event: WebhookEvent) => {
    setSelectedEvents(prev => 
      prev.includes(event)
        ? prev.filter(e => e !== event)
        : [...prev, event]
    );
  };
  
  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Vincular Novo Webhook</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="url">URL do Webhook *</Label>
            <Input
              id="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://exemplo.com/webhook"
              required
            />
            <p className="text-sm text-gray-500">
              URL que receberá as chamadas POST com eventos
            </p>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="secret">Segredo (opcional)</Label>
            <Input
              id="secret"
              value={secret}
              onChange={(e) => setSecret(e.target.value)}
              placeholder="string-secreta-para-assinatura"
            />
            <p className="text-sm text-gray-500">
              Enviado no header X-Hub-Signature para autenticação
            </p>
          </div>
          
          <div className="space-y-2">
            <Label>Eventos *</Label>
            <div className="space-y-2 border rounded-md p-4">
              {webhookEvents.map((event) => (
                <div key={event.value} className="flex items-center space-x-2">
                  <Checkbox
                    id={event.value}
                    checked={selectedEvents.includes(event.value)}
                    onCheckedChange={() => toggleEvent(event.value)}
                  />
                  <Label htmlFor={event.value} className="cursor-pointer">
                    {event.label}
                  </Label>
                </div>
              ))}
            </div>
            <p className="text-sm text-gray-500">
              Selecione quais eventos dispararão este webhook
            </p>
          </div>
          
          <DialogFooter>
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancelar
            </Button>
            <Button type="submit" disabled={createWebhook.isPending}>
              {createWebhook.isPending ? "Salvando..." : "Salvar"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
