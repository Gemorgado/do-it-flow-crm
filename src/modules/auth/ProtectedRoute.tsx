
import React from "react";
import { Navigate } from "react-router-dom";
import { TabKey } from "@/modules/settings/users/types";
import { useAuth } from "./AuthProvider";

interface ProtectedRouteProps {
  tab?: TabKey;
  children: JSX.Element;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ tab, children }) => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="flex h-screen w-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-t-transparent border-doIt-primary" />
      </div>
    );
  }
  
  // Not logged in
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  // Check tab-specific permissions
  if (tab && !user.allowedTabs.includes(tab)) {
    return <Navigate to="/403" replace />;
  }
  
  // User is authenticated and has permission
  return children;
};
