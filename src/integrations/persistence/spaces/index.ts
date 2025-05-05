
import { getLocations, getLocation } from './spaceQueries';
import { createSpace, updateSpace, deleteSpace } from './spaceMutations';

export const spacePersistence = {
  getLocations,
  getLocation,
  createSpace,
  updateSpace,
  deleteSpace
};
