
import { Location } from '@/types';
import { ServiceType } from '@/types/service';
import { toServiceType } from '@/utils/enumMappers';

// Helper function to convert domain model to database model
export const toDbSpace = (space: Location) => ({
  name: space.name,
  type: space.type as ServiceType,
  description: space.description,
  floor: space.floor,
  area: space.area,
  capacity: space.capacity,
  is_active: space.isActive !== false
});

// Helper function to convert database model to domain model
export const fromDbSpace = (dbSpace: any): Location => ({
  id: dbSpace.id,
  name: dbSpace.name,
  type: toServiceType(dbSpace.type),
  description: dbSpace.description || '',
  floor: dbSpace.floor,
  area: dbSpace.area,
  capacity: dbSpace.capacity,
  isActive: dbSpace.is_active,
  createdAt: dbSpace.created_at,
  updatedAt: dbSpace.updated_at
});
