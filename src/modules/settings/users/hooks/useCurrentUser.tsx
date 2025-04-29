
import { useState, useEffect } from "react";
import { User } from "../types";
import { useUsers } from "@/api/users";

// In a real application, this would come from an authentication context
const CURRENT_USER_ID = "1"; // Default to admin user for testing

/**
 * Hook to get the current authenticated user
 * In a real app, this would be connected to your auth provider
 */
export const useCurrentUser = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { data: usersData, isLoading: usersLoading } = useUsers();

  useEffect(() => {
    if (!usersLoading && usersData?.data) {
      const user = usersData.data.find(u => u.id === CURRENT_USER_ID) || null;
      setCurrentUser(user);
      setIsLoading(false);
    }
  }, [usersData, usersLoading]);

  return {
    currentUser,
    isLoading
  };
};
