
import type { ConexaSnapshot } from './types';
import { persistence } from '../persistence';

export async function processConexaSnapshot(snap: ConexaSnapshot): Promise<void> {
  // 🔸 Here we would use a Prisma transaction in the future
  await persistence.upsertSnapshot(snap);

  console.info('[Conexa] Snapshot processed:', {
    clients: snap.customers.length,
    contracts: snap.contracts.length,
    services: snap.services.length,
    occupations: snap.roomOccupations.length,
  });
}
