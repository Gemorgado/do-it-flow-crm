
import { useState } from "react";
import { Lead } from "@/types";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { MessageCircle, Send, Archive } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface WhatsAppDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  lead: Lead;
  onMessageSent?: (message: string) => void;
}

interface Message {
  id: string;
  text: string;
  sender: "agent" | "client";
  timestamp: Date;
  read: boolean;
}

export function WhatsAppDialog({ open, onOpenChange, lead, onMessageSent }: WhatsAppDialogProps) {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<Message[]>(
    lead.lastContact 
      ? [
          { 
            id: "1", 
            text: "Olá, tudo bem? Estou interessado em saber mais sobre seus serviços.", 
            sender: "client", 
            timestamp: new Date(lead.lastContact), 
            read: true 
          }
        ]
      : []
  );

  const handleSendMessage = () => {
    if (!message.trim()) return;

    // Add the message to the list
    const newMessage = {
      id: `msg-${Date.now()}`,
      text: message,
      sender: "agent" as const,
      timestamp: new Date(),
      read: true
    };

    setMessages([...messages, newMessage]);
    
    // Clear the input
    setMessage("");
    
    // Simulate response (in a real app, this would integrate with WhatsApp API)
    setTimeout(() => {
      toast({
        title: "Mensagem enviada",
        description: `Mensagem enviada para ${lead.name} via WhatsApp`,
      });
      
      // Notify parent component for any auto-stage-progression
      if (onMessageSent) {
        onMessageSent(message);
      }
    }, 500);
  };

  const handleArchive = (messageId: string) => {
    // Mark message as archived (in real app, this would update the server)
    setMessages(messages.map(msg => 
      msg.id === messageId ? { ...msg, archived: true } : msg
    ));
    
    toast({
      title: "Mensagem arquivada",
      description: "A mensagem foi arquivada com sucesso",
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <MessageCircle className="h-5 w-5 text-green-600" /> 
            WhatsApp - {lead.name}
          </DialogTitle>
        </DialogHeader>
        
        <div className="max-h-[300px] overflow-y-auto p-2 bg-gray-50 rounded-md">
          {messages.length === 0 ? (
            <p className="text-center text-gray-500 py-6">
              Nenhuma mensagem trocada ainda com este lead.
            </p>
          ) : (
            <div className="space-y-3">
              {messages.map((msg) => (
                <div 
                  key={msg.id}
                  className={`flex ${msg.sender === 'agent' ? 'justify-end' : 'justify-start'}`}
                >
                  <div 
                    className={`max-w-[80%] p-3 rounded-lg relative group ${
                      msg.sender === 'agent' 
                        ? 'bg-doIt-primary text-white rounded-br-none' 
                        : 'bg-white border rounded-bl-none'
                    }`}
                  >
                    <p className="text-sm">{msg.text}</p>
                    <span className="text-xs opacity-70 mt-1 block">
                      {msg.timestamp.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                    </span>
                    
                    <Button 
                      variant="ghost" 
                      size="icon"
                      className="h-6 w-6 absolute -top-3 -right-3 bg-white rounded-full shadow opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={() => handleArchive(msg.id)}
                    >
                      <Archive className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        
        <div className="flex gap-2 items-end mt-2">
          <div className="flex-1">
            <Textarea 
              placeholder="Digite sua mensagem..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="resize-none"
              rows={2}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage();
                }
              }}
            />
          </div>
          <Button onClick={handleSendMessage}>
            <Send className="h-4 w-4" />
            <span className="sr-only">Enviar</span>
          </Button>
        </div>
        
        <DialogFooter className="sm:justify-start">
          <div className="text-xs text-gray-500">
            As mensagens são sincronizadas com o histórico do cliente
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
