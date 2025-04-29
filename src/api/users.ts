
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { User } from '@/modules/settings/users/types';

// Mock data for development if API is not ready
const mockUsers: User[] = [
  {
    id: '1',
    name: 'Admin User',
    email: 'admin@doitflow.com',
    team: 'comercial',
    allowedTabs: ['PIPELINE', 'PIPELINE_PROGRESS', 'GROWTH', 'REPORTS', 'OCCUPANCY_MAP'],
    createdAt: '2023-01-01T00:00:00.000Z'
  },
  {
    id: '2',
    name: 'Front Desk User',
    email: 'frontdesk@doitflow.com',
    team: 'frontdesk',
    allowedTabs: ['PIPELINE', 'OCCUPANCY_MAP'],
    createdAt: '2023-02-15T00:00:00.000Z'
  }
];

/**
 * Fetches users with optional pagination
 */
export const useUsers = (page = 1, limit = 10) => {
  return useQuery({
    queryKey: ['users', page, limit],
    queryFn: async () => {
      // Replace with actual API call when ready
      // const response = await fetch(`/api/settings/users?page=${page}&limit=${limit}`);
      // return response.json();
      
      // Mock response
      return {
        data: mockUsers,
        meta: {
          total: mockUsers.length,
          page,
          limit
        }
      };
    }
  });
};

/**
 * Creates or updates a user
 */
export const useUpsertUser = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (user: Omit<User, 'id' | 'createdAt'> & { id?: string }) => {
      // Replace with actual API call when ready
      // const method = user.id ? 'PATCH' : 'POST';
      // const url = user.id ? `/api/settings/users/${user.id}` : '/api/settings/users';
      // const response = await fetch(url, {
      //   method,
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(user)
      // });
      // return response.json();
      
      // Mock response
      return {
        ...user,
        id: user.id || Math.random().toString(36).substring(2, 9),
        createdAt: user.id ? (mockUsers.find(u => u.id === user.id)?.createdAt || new Date().toISOString()) : new Date().toISOString()
      };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
    }
  });
};

/**
 * Deletes a user
 */
export const useDeleteUser = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (userId: string) => {
      // Replace with actual API call when ready
      // const response = await fetch(`/api/settings/users/${userId}`, {
      //   method: 'DELETE'
      // });
      // return response.json();
      
      // Mock response
      return { success: true };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
    }
  });
};
