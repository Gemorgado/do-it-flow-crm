
# Conexa Snapshot Processing

This document explains how to migrate from the current mock persistence layer to a real database implementation.

## Current Implementation

The current implementation uses `localStorage` as a mock persistence layer through the `LocalStorageAdapter` class that implements the `PersistenceAdapter` interface.

## Migrating to a Real Database

### Step 1: Create a new adapter implementation

Create a new adapter that implements the same `PersistenceAdapter` interface. For example, with Prisma:

```typescript
import { PrismaClient } from '@prisma/client';
import type { ConexaSnapshot } from './conexa/types';
import type { PersistenceAdapter } from './persistence';

const prisma = new PrismaClient();

class PrismaAdapter implements PersistenceAdapter {
  async upsertSnapshot(snap: ConexaSnapshot): Promise<void> {
    await prisma.$transaction(async (tx) => {
      // Process customers
      for (const customer of snap.customers) {
        await tx.customer.upsert({
          where: { erpId: customer.id },
          update: {
            name: customer.name,
            docNumber: customer.docNumber,
            email: customer.email,
            phone: customer.phone,
            updatedAt: new Date(customer.updatedAt)
          },
          create: {
            erpId: customer.id,
            name: customer.name,
            docNumber: customer.docNumber,
            email: customer.email,
            phone: customer.phone,
            updatedAt: new Date(customer.updatedAt)
          }
        });
      }

      // Process services
      for (const service of snap.services) {
        await tx.service.upsert({
          where: { erpId: service.id },
          update: {
            label: service.label,
            category: service.category,
            price: service.price,
            updatedAt: new Date(service.updatedAt)
          },
          create: {
            erpId: service.id,
            label: service.label,
            category: service.category,
            price: service.price,
            updatedAt: new Date(service.updatedAt)
          }
        });
      }

      // Process contracts
      for (const contract of snap.contracts) {
        await tx.contract.upsert({
          where: { erpId: contract.id },
          update: {
            status: contract.status,
            amount: contract.amount,
            startDate: new Date(contract.startDate),
            endDate: contract.endDate ? new Date(contract.endDate) : null,
            updatedAt: new Date(contract.updatedAt),
            customer: { connect: { erpId: contract.customerId } },
            service: { connect: { erpId: contract.serviceId } }
          },
          create: {
            erpId: contract.id,
            status: contract.status,
            amount: contract.amount,
            startDate: new Date(contract.startDate),
            endDate: contract.endDate ? new Date(contract.endDate) : null,
            updatedAt: new Date(contract.updatedAt),
            customer: { connect: { erpId: contract.customerId } },
            service: { connect: { erpId: contract.serviceId } }
          }
        });
      }

      // Process room occupations
      for (const occupation of snap.roomOccupations) {
        await tx.roomBooking.upsert({
          where: {
            roomId_contractId_date: {
              roomId: occupation.roomId,
              contractId: occupation.contractId,
              date: new Date(occupation.date)
            }
          },
          update: { status: 'occupied' },
          create: {
            roomId: occupation.roomId,
            contractId: occupation.contractId,
            date: new Date(occupation.date),
            status: 'occupied'
          }
        });
      }

      // Store snapshot metadata
      await tx.integrationSnapshot.create({
        data: {
          provider: 'conexa',
          syncedAt: new Date(snap.syncedAt),
          metadata: {
            customersCount: snap.customers.length,
            contractsCount: snap.contracts.length,
            servicesCount: snap.services.length,
            roomOccupationsCount: snap.roomOccupations.length
          }
        }
      });
    });
  }

  async getLastSnapshot(): Promise<ConexaSnapshot | null> {
    // Retrieve the latest snapshot metadata
    const lastSnapshot = await prisma.integrationSnapshot.findFirst({
      where: { provider: 'conexa' },
      orderBy: { syncedAt: 'desc' }
    });

    if (!lastSnapshot) return null;

    // Rebuild the snapshot from the database
    const customers = await prisma.customer.findMany({
      where: { erpId: { not: null } }
    });

    const services = await prisma.service.findMany({
      where: { erpId: { not: null } }
    });

    const contracts = await prisma.contract.findMany({
      where: { erpId: { not: null } }
    });

    const roomOccupations = await prisma.roomBooking.findMany({
      where: { status: 'occupied' }
    });

    return {
      customers: customers.map(c => ({
        id: c.erpId!,
        name: c.name,
        docNumber: c.docNumber,
        email: c.email || undefined,
        phone: c.phone || undefined,
        updatedAt: c.updatedAt.toISOString()
      })),
      services: services.map(s => ({
        id: s.erpId!,
        label: s.label,
        category: s.category,
        price: s.price,
        updatedAt: s.updatedAt.toISOString()
      })),
      contracts: contracts.map(c => ({
        id: c.erpId!,
        customerId: c.customerId,
        serviceId: c.serviceId,
        status: c.status as 'active' | 'closed',
        amount: c.amount,
        startDate: c.startDate.toISOString(),
        endDate: c.endDate?.toISOString(),
        updatedAt: c.updatedAt.toISOString()
      })),
      roomOccupations: roomOccupations.map(r => ({
        roomId: r.roomId,
        contractId: r.contractId,
        date: r.date.toISOString().split('T')[0]
      })),
      syncedAt: lastSnapshot.syncedAt.toISOString()
    };
  }
}
```

### Step 2: Update the persistence.ts file

Replace the current adapter with your new implementation:

```typescript
// Import the new adapter
import { PrismaAdapter } from './prismaAdapter';

// Export the new adapter instance
export const persistence: PersistenceAdapter = new PrismaAdapter();
```

### Step 3: Required Database Schema

You'll need to define the following tables in your Prisma schema:

1. `Customer`
   - id (primary key)
   - erpId (unique, for mapping to Conexa)
   - name
   - docNumber
   - email (optional)
   - phone (optional)
   - updatedAt

2. `Service`
   - id (primary key)
   - erpId (unique)
   - label
   - category
   - price
   - updatedAt

3. `Contract`
   - id (primary key)
   - erpId (unique)
   - customerId (foreign key)
   - serviceId (foreign key)
   - status (enum: 'active', 'closed')
   - amount
   - startDate
   - endDate (optional)
   - updatedAt

4. `RoomBooking`
   - id (primary key)
   - roomId
   - contractId
   - date
   - status (enum: 'occupied', 'available', etc.)
   - unique constraint on (roomId, contractId, date)

5. `IntegrationSnapshot`
   - id (primary key)
   - provider (e.g., 'conexa')
   - syncedAt
   - metadata (JSON)

### Step 4: Test the implementation

Make sure to test that the new adapter properly handles all CRUD operations and edge cases before deploying to production.
