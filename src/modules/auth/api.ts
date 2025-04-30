
import { User } from "@/modules/settings/users/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";

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
    team: "comercial",
    allowedTabs: ["PIPELINE", "PIPELINE_PROGRESS", "GROWTH", "REPORTS", "OCCUPANCY_MAP"],
    createdAt: new Date().toISOString(),
  },
  {
    id: "2",
    name: "Regular User",
    email: "user@doitflow.com",
    team: "atendimento",
    allowedTabs: ["PIPELINE"],
    createdAt: new Date().toISOString(),
  },
];

// In a real app, these would be API calls
export const loginApi = async (credentials: LoginCredentials): Promise<LoginResponse> => {
  // Simulate network request
  await new Promise((resolve) => setTimeout(resolve, 800));

  const user = mockUsers.find((u) => u.email === credentials.email);
  
  if (!user || credentials.password !== "123456") {
    throw new Error("Credenciais inválidas");
  }

  const token = `mock-jwt-token-${user.id}-${Date.now()}`;
  
  // Store token based on rememberMe preference
  if (credentials.rememberMe) {
    localStorage.setItem("auth-token", token);
  } else {
    sessionStorage.setItem("auth-token", token);
  }

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
  const user = mockUsers.find((u) => u.id === userId);
  
  if (!user) {
    throw new Error("Usuário não encontrado");
  }
  
  return user;
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
