
import { hasAccess, filterTabs } from '../permissionUtils';
import { User, TabKey, Route } from '../types';

describe('Permission Utils', () => {
  const mockUser: User = {
    id: '1',
    name: 'Test User',
    email: 'test@example.com',
    team: 'comercial',
    allowedTabs: ['PIPELINE', 'GROWTH'],
    createdAt: '2023-01-01T00:00:00.000Z'
  };

  const mockRoutes: Route[] = [
    { path: '/pipeline', tabKey: 'PIPELINE', label: 'Pipeline', element: <div>Pipeline</div> },
    { path: '/growth', tabKey: 'GROWTH', label: 'Growth', element: <div>Growth</div> },
    { path: '/reports', tabKey: 'REPORTS', label: 'Reports', element: <div>Reports</div> }
  ];

  describe('hasAccess', () => {
    it('should return true for allowed tabs', () => {
      expect(hasAccess(mockUser, 'PIPELINE')).toBe(true);
      expect(hasAccess(mockUser, 'GROWTH')).toBe(true);
    });

    it('should return false for disallowed tabs', () => {
      expect(hasAccess(mockUser, 'REPORTS')).toBe(false);
      expect(hasAccess(mockUser, 'OCCUPANCY_MAP')).toBe(false);
    });

    it('should return false for null or undefined user', () => {
      expect(hasAccess(null, 'PIPELINE')).toBe(false);
      expect(hasAccess(undefined, 'PIPELINE')).toBe(false);
    });
  });

  describe('filterTabs', () => {
    it('should filter routes based on user permissions', () => {
      const filteredRoutes = filterTabs(mockUser, mockRoutes);
      expect(filteredRoutes.length).toBe(2);
      expect(filteredRoutes.map(r => r.tabKey)).toEqual(['PIPELINE', 'GROWTH']);
    });

    it('should return empty array for null or undefined user', () => {
      expect(filterTabs(null, mockRoutes)).toEqual([]);
      expect(filterTabs(undefined, mockRoutes)).toEqual([]);
    });
  });
});
