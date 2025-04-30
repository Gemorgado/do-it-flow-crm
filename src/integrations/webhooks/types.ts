
export type WebhookEvent =
  | 'snapshot.applied'
  | 'customer.created'
  | 'contract.updated'
  | 'room.occupied';

export interface Webhook {
  id: string;              // uuid
  url: string;
  events: WebhookEvent[];
  secret?: string;         // opcional, para assinatura HMAC
  createdAt: string;
}
