import { User, Team, TabKey } from "@/modules/settings/users/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toTabKeyArray } from "./utils";

interface LoginCredentials {
  email: string;
  password: string;
  rememberMe?: boolean;
}

interface LoginResponse {
  token: string;
  user: User;
}

// Mock API response for demonstration
const mockUsers = [
  {
    id: "1",
    name: "Admin User",
    email: "admin@doitflow.com",
    team: "comercial" as const,
    allowedTabs: ["PIPELINE", "PIPELINE_PROGRESS", "GROWTH", "REPORTS", "OCCUPANCY_MAP"],
    createdAt: new Date().toISOString(),
  },
  {
    id: "2",
    name: "Regular User",
    email: "user@doitflow.com",
    team: "atendimento" as const,
    allowedTabs: ["PIPELINE"],
    createdAt: new Date().toISOString(),
  },
];

// Utility function to map API user data to User type
function mapApiUser(userData: any): User {
  return {
    id: userData.id,
    name: userData.name,
    email: userData.email,
    team: userData.team as Team,
    allowedTabs: toTabKeyArray(userData.allowedTabs),
    createdAt: userData.createdAt,
  };
}

// In a real app, these would be API calls
export const loginApi = async (credentials: LoginCredentials): Promise<LoginResponse> => {
  // Simulate network request
  await new Promise((resolve) => setTimeout(resolve, 800));

  const userData = mockUsers.find((u) => u.email === credentials.email);
  
  if (!userData || credentials.password !== "123456") {
    throw new Error("Credenciais inválidas");
  }

  const token = `mock-jwt-token-${userData.id}-${Date.now()}`;
  
  // Store token based on rememberMe preference
  if (credentials.rememberMe) {
    localStorage.setItem("auth-token", token);
  } else {
    sessionStorage.setItem("auth-token", token);
  }

  // Map API user data to User type
  const user = mapApiUser(userData);

  return { token, user };
};

export const getUserApi = async (): Promise<User> => {
  // Simulate network request
  await new Promise((resolve) => setTimeout(resolve, 500));
  
  // Get token from storage
  const token = localStorage.getItem("auth-token") || sessionStorage.getItem("auth-token");
  
  if (!token) {
    throw new Error("Não autenticado");
  }
  
  // In a real app, you would validate the token with the backend
  // and fetch the user data
  const userId = token.split("-")[2];
  const userData = mockUsers.find((u) => u.id === userId);
  
  if (!userData) {
    throw new Error("Usuário não encontrado");
  }
  
  // Map API user data to User type
  return mapApiUser(userData);
};

export const logoutApi = (): void => {
  localStorage.removeItem("auth-token");
  sessionStorage.removeItem("auth-token");
};

// Custom React Query hook for login
export const useLogin = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: loginApi,
    onSuccess: (data) => {
      queryClient.setQueryData(["currentUser"], data.user);
    },
  });
};
