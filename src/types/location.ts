
export interface Location {
  id: string;
  name: string;
  type: string;
  identifier?: string; // Make identifier optional
  available?: boolean; // Make available optional
  capacity?: number;
  area?: number;
  floor?: number; // Add floor property
  description?: string; // Add description property
  isActive?: boolean; // Add isActive property
  createdAt?: string; // Add createdAt property
  updatedAt?: string; // Add updatedAt property
}
