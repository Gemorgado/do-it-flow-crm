
import React, { createContext, useContext, useEffect, useState } from "react";
import { User } from "@/modules/settings/users/types";
import { getUserApi, loginApi, logoutApi } from "./api";
import { useNavigate } from "react-router-dom";
import { toast } from "@/hooks/use-toast";

interface LoginCredentials {
  email: string;
  password: string;
  rememberMe?: boolean;
}

interface AuthContextValue {
  user: User | null;
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Load user from token on initial render
  useEffect(() => {
    const initializeAuth = async () => {
      const hasToken = localStorage.getItem("auth-token") || sessionStorage.getItem("auth-token");
      
      if (!hasToken) {
        setLoading(false);
        return;
      }
      
      try {
        const userData = await getUserApi();
        setUser(userData);
      } catch (error) {
        // Invalid token or other error
        console.error("Error initializing auth:", error);
        logoutApi(); // Clear invalid tokens
      } finally {
        setLoading(false);
      }
    };
    
    initializeAuth();
  }, []);
  
  const login = async (credentials: LoginCredentials) => {
    try {
      const { user } = await loginApi(credentials);
      setUser(user);
      toast({
        title: "Login realizado com sucesso",
        description: `Bem-vindo(a), ${user.name}!`,
      });
      navigate("/dashboard");
    } catch (error) {
      console.error("Login failed:", error);
      toast({
        title: "Erro ao fazer login",
        description: "Email ou senha inválidos",
        variant: "destructive",
      });
      throw error;
    }
  };
  
  const logout = () => {
    logoutApi();
    setUser(null);
    navigate("/login");
    toast({ 
      title: "Logout realizado",
      description: "Você foi desconectado com sucesso"
    });
  };
  
  const value = {
    user,
    login,
    logout,
    loading,
  };
  
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextValue => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
