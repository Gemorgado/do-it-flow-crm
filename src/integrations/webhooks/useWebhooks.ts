
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { WebhookStore } from './persistence';
import type { Webhook } from './types';

const KEY = ['integrations','webhooks'];

export function useWebhooks() {
  return useQuery({
    queryKey: KEY,
    queryFn: WebhookStore.list
  });
}

export function useCreateWebhook() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: WebhookStore.create,
    onSuccess: () => qc.invalidateQueries({ queryKey: KEY }),
  });
}

export function useRemoveWebhook() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: WebhookStore.remove,
    onSuccess: () => qc.invalidateQueries({ queryKey: KEY }),
  });
}

export function testWebhook(url: string) {
  return fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ event: 'test', payload: { message: 'This is a test webhook' } }),
  }).then(res => {
    if (!res.ok) throw new Error(`Failed to test webhook: ${res.status}`);
    return res;
  });
}
