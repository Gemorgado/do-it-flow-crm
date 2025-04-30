
import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Loader2, Plus, Trash2, Send } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { WebhookModal } from "@/integrations/webhooks/WebhookModal";
import { useWebhooks, useRemoveWebhook, testWebhook } from "@/integrations/webhooks/useWebhooks";

export function WebhookCard() {
  const [modalOpen, setModalOpen] = useState(false);
  const [testingId, setTestingId] = useState<string | null>(null);
  const { data: webhooks = [], isLoading } = useWebhooks();
  const removeWebhook = useRemoveWebhook();
  const { toast } = useToast();

  const handleTestWebhook = async (id: string, url: string) => {
    setTestingId(id);
    
    try {
      await testWebhook(url);
      toast({
        title: "Webhook testado",
        description: "Requisição de teste enviada com sucesso",
      });
    } catch (error) {
      toast({
        title: "Erro ao testar webhook",
        description: String(error),
        variant: "destructive",
      });
    } finally {
      setTestingId(null);
    }
  };

  const handleRemoveWebhook = (id: string) => {
    if (confirm("Tem certeza que deseja remover este webhook?")) {
      removeWebhook.mutate(id, {
        onSuccess: () => {
          toast({
            title: "Webhook removido",
            description: "Webhook removido com sucesso",
          });
        },
        onError: (error) => {
          toast({
            title: "Erro ao remover webhook",
            description: String(error),
            variant: "destructive",
          });
        }
      });
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Webhooks</CardTitle>
          <Button onClick={() => setModalOpen(true)} size="sm" className="gap-1">
            <Plus size={16} />
            Vincular Webhook
          </Button>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center py-4">
              <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
            </div>
          ) : webhooks.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <p>Nenhum webhook configurado.</p>
              <p className="text-sm mt-2">
                Clique no botão "Vincular Webhook" para adicionar uma integração.
              </p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>URL</TableHead>
                  <TableHead>Eventos</TableHead>
                  <TableHead>Criado em</TableHead>
                  <TableHead className="w-[120px]">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {webhooks.map((webhook) => (
                  <TableRow key={webhook.id}>
                    <TableCell className="font-mono text-sm">{webhook.url}</TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {webhook.events.map((event) => (
                          <Badge key={event} variant="outline">{event}</Badge>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell>{formatDate(webhook.createdAt)}</TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button
                          size="icon"
                          variant="outline"
                          onClick={() => handleTestWebhook(webhook.id, webhook.url)}
                          disabled={testingId === webhook.id}
                        >
                          {testingId === webhook.id ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <Send className="h-4 w-4" />
                          )}
                        </Button>
                        <Button
                          size="icon"
                          variant="outline"
                          className="text-red-500 hover:text-red-600"
                          onClick={() => handleRemoveWebhook(webhook.id)}
                          disabled={removeWebhook.isPending}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
      
      <WebhookModal open={modalOpen} onClose={() => setModalOpen(false)} />
    </>
  );
}
