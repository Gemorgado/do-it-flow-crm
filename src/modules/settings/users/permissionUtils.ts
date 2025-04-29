
import { TabKey, User, Route } from './types';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

/**
 * Checks if a user has access to a specific tab
 * @param user The user to check permissions for
 * @param tab The tab key to check access for
 * @returns boolean indicating if the user has access
 */
export const hasAccess = (user: User | null | undefined, tab: TabKey): boolean => {
  if (!user) return false;
  return user.allowedTabs.includes(tab);
};

/**
 * Filters available routes based on user permissions
 * @param user The user to filter routes for
 * @param allRoutes All available routes in the application
 * @returns Filtered list of routes the user has access to
 */
export const filterTabs = (user: User | null | undefined, allRoutes: Route[]): Route[] => {
  if (!user) return [];
  return allRoutes.filter(route => hasAccess(user, route.tabKey));
};

/**
 * React hook to protect routes based on user permissions
 * Redirects to 403 page if user doesn't have access
 * @param tab The tab key to protect
 * @param user The current user
 */
export const useProtectedTab = (tab: TabKey, user: User | null | undefined) => {
  const navigate = useNavigate();

  useEffect(() => {
    if (user && !hasAccess(user, tab)) {
      navigate('/403');
    }
  }, [user, tab, navigate]);
};
