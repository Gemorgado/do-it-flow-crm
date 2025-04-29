
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { hasAccess } from "../permissionUtils";
import { TabKey, User } from "../types";
import { useCurrentUser } from "./useCurrentUser";

/**
 * Hook to protect routes based on user permissions
 * Redirects to 403 page if user doesn't have access
 * @param requiredTab The tab key required to access this route
 */
export const useProtectedRoute = (requiredTab: TabKey) => {
  const { currentUser, isLoading } = useCurrentUser();
  const navigate = useNavigate();

  useEffect(() => {
    // Only check after we've loaded the user
    if (!isLoading) {
      if (!currentUser || !hasAccess(currentUser, requiredTab)) {
        navigate('/403');
      }
    }
  }, [currentUser, requiredTab, navigate, isLoading]);

  return { currentUser, isLoading };
};
