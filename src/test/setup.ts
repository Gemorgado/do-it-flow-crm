
import '@testing-library/jest-dom';

// Mock localStorage and sessionStorage
const localStorageMock = (function() {
  let store: Record<string, string> = {};
  return {
    getItem(key: string) {
      return store[key] || null;
    },
    setItem(key: string, value: string) {
      store[key] = value;
    },
    removeItem(key: string) {
      delete store[key];
    },
    clear() {
      store = {};
    },
    key(index: number) {
      return Object.keys(store)[index] || null;
    },
    length: 0
  };
})();

Object.defineProperty(window, 'localStorage', { value: localStorageMock });
Object.defineProperty(window, 'sessionStorage', { value: localStorageMock });

// Mock console methods if needed
const originalConsoleError = console.error;
console.error = (...args) => {
  // Ignore certain expected errors or pass through
  if (typeof args[0] === 'string' && args[0].includes('not wrapped in act')) {
    return;
  }
  originalConsoleError(...args);
};

// Reset mocks before each test
beforeEach(() => {
  window.localStorage.clear();
  window.sessionStorage.clear();
});
