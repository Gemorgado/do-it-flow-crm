
import { v4 as uuid } from 'uuid';
import type { Webhook } from './types';

const KEY = 'webhooks';

export function getWebhooks(): Webhook[] {
  const raw = localStorage.getItem(KEY);
  return raw ? JSON.parse(raw) : [];
}

export function saveWebhooks(list: Webhook[]) {
  localStorage.setItem(KEY, JSON.stringify(list));
}

export const WebhookStore = {
  list: () => Promise.resolve(getWebhooks()),
  create: (w: Omit<Webhook,'id'|'createdAt'>) => {
    const data = { ...w, id: uuid(), createdAt: new Date().toISOString() };
    saveWebhooks([...getWebhooks(), data]);
    return Promise.resolve(data);
  },
  remove: (id: string) => {
    saveWebhooks(getWebhooks().filter(w => w.id !== id));
    return Promise.resolve();
  },
};
