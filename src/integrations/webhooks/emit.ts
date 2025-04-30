
import { getWebhooks } from './persistence';
import type { WebhookEvent } from './types';

export async function emit(event: WebhookEvent, payload: any) {
  const hooks = getWebhooks().filter(h => h.events.includes(event));
  
  console.log(`Emitting ${event} to ${hooks.length} webhooks`, payload);
  
  const promises = hooks.map(h => 
    fetch(h.url, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json', 
        'X-Hub-Signature': h.secret ?? '' 
      },
      body: JSON.stringify({ event, payload }),
    }).catch(err => {
      console.error(`Failed to send webhook to ${h.url}:`, err);
    })
  );

  return Promise.allSettled(promises);
}
