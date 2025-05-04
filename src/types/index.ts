
// This file re-exports all types from domain-specific files
// to maintain compatibility with existing imports

// Re-export all domain-specific types
export * from "./lead";
export * from "./client";
export * from "./contact";
export * from "./service";
export * from "./location";
export * from "./interaction";
export * from "./task";
export * from "./user";
export * from "./chart";
export * from "./space";
export * from "./pie";
export * from "./crm";
export * from "./proposal";
export * from "./schedule";
export * from "./integration";

// For backward compatibility, also re-export these types which were imported in the original file
export type { SpaceBinding } from "./space";
export type { ServiceType } from "./service";
