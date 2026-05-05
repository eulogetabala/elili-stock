"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { apiClient } from "@/lib/api-client";

interface User {
  id: string;
  _id?: string; // Pour compatibilité
  email: string;
  firstName: string;
  lastName: string;
  roles: string[];
  avatar?: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => void;
  refreshUser: () => Promise<void>;
}

interface RegisterData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Vérifier si l'utilisateur est connecté au chargement
  useEffect(() => {
    const checkAuth = async () => {
      const accessToken = localStorage.getItem("accessToken");
      if (accessToken) {
        try {
          await refreshUser();
        } catch {
          apiClient.clearTokens();
          setUser(null);
        }
      }
      setIsLoading(false);
    };
    checkAuth();
  }, []);

  const refreshUser = useCallback(async () => {
    try {
      // Pour l'instant, on utilise les infos du token
      // Vous pouvez créer un endpoint /users/me dans le backend si nécessaire
      const accessToken = localStorage.getItem("accessToken");
      if (!accessToken) throw new Error("No token");
      // On pourrait décoder le JWT pour obtenir les infos utilisateur
      // Pour l'instant, on retourne null et on laisse le login/register définir l'utilisateur
      return;
    } catch (error) {
      throw error;
    }
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const response = await apiClient.post<{
        accessToken: string;
        refreshToken: string;
        user: User;
      }>("/auth/login", { email, password });

      apiClient.setTokens(response.accessToken, response.refreshToken);
      setUser({
        ...response.user,
        _id: response.user.id, // Pour compatibilité avec le reste du code
      });
    } catch (error: any) {
      throw new Error(error.message || "Erreur lors de la connexion");
    }
  };

  const register = async (data: RegisterData) => {
    try {
      const response = await apiClient.post<{
        accessToken: string;
        refreshToken: string;
        user: User;
      }>("/auth/register", data);

      apiClient.setTokens(response.accessToken, response.refreshToken);
      setUser({
        ...response.user,
        _id: response.user.id, // Pour compatibilité avec le reste du code
      });
    } catch (error: any) {
      throw new Error(error.message || "Erreur lors de l'inscription");
    }
  };

  const logout = async () => {
    try {
      await apiClient.post("/auth/logout");
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      apiClient.clearTokens();
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        register,
        logout,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
