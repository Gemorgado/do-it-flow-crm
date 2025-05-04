
import { leadPersistence } from "./leadPersistence";
import { clientPersistence } from "./clientPersistence";
import { taskPersistence } from "./taskPersistence";
import { interactionPersistence } from "./interactionPersistence";
import { spacePersistence } from "./spacePersistence";
import { snapshotPersistence } from "./snapshotPersistence";
import { proposalPersistence } from "./proposalPersistence";
import type { PersistenceAdapter } from "./types";

// Combine all persistence methods into a single interface
export const persistence: PersistenceAdapter = {
  // Lead methods
  ...leadPersistence,
  
  // Client methods
  ...clientPersistence,
  
  // Task methods
  ...taskPersistence,
  
  // Interaction methods
  ...interactionPersistence,
  
  // Space methods
  ...spacePersistence,
  
  // Snapshot methods
  ...snapshotPersistence,
  
  // Proposal methods
  ...proposalPersistence
};

// Re-export for convenience
export * from "./types";
