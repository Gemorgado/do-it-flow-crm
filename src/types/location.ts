
export interface Location {
  id: string;
  name: string;
  type: string;
  identifier: string;
  available: boolean;
  capacity?: number;
  area?: number;
}
