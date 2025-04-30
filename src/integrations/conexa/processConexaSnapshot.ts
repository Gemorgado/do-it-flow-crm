
import type { ConexaSnapshot } from './types';
import { persistence } from '../persistence';
import { emit } from '../webhooks/emit';

export async function processConexaSnapshot(snap: ConexaSnapshot): Promise<void> {
  // 🔸 Here we would use a Prisma transaction in the future
  await persistence.upsertSnapshot(snap);

  console.info('[Conexa] Snapshot processed:', {
    clients: snap.customers.length,
    contracts: snap.contracts.length,
    services: snap.services.length,
    occupations: snap.roomOccupations.length,
  });
  
  // Emit webhook event for snapshot.applied
  await emit('snapshot.applied', {
    timestamp: new Date().toISOString(),
    stats: {
      customers: snap.customers.length,
      contracts: snap.contracts.length,
      services: snap.services.length,
      roomOccupations: snap.roomOccupations.length,
    }
  });
}
