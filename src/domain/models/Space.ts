
export interface Space {
  id: string;
  name: string;
  type: string;
  identifier?: string; 
  available?: boolean;
  capacity?: number;
  area?: number;
  floor?: number;
  description?: string;
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface NewSpace extends Omit<Space, 'id' | 'createdAt' | 'updatedAt'> {
  id?: string;
}
