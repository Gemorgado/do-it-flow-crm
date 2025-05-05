
import { leadPersistence } from "./leads";
import { clientPersistence } from "./clients";
import { taskPersistence } from "./taskPersistence";
import { interactionPersistence } from "./interactionPersistence";
import { spacePersistence } from "./spaces";
import { snapshotPersistence } from "./snapshotPersistence";
import { proposalPersistence } from "./proposals";
import { bindingPersistence } from "./bindingPersistence";
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
  ...proposalPersistence,
  
  // Binding methods (for space allocation)
  ...bindingPersistence
};

// Re-export for convenience
export * from "./types";
