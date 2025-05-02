
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { trackMetaPixelEvent } from '../metaPixelUtils';

// Declare types for window.fbq
declare global {
  interface Window {
    fbq: any;
  }
}

// Mock window.fbq
let fbqCalls: any[] = [];
window.fbq = vi.fn((...args) => {
  fbqCalls.push(args);
});

describe('MetaPixel Utils', () => {
  beforeEach(() => {
    fbqCalls = [];
    vi.clearAllMocks();
  });

  it('should call fbq with the correct parameters', () => {
    const eventName = 'PageView';
    const params = {
      page_title: 'Test Page',
      page_location: 'https://example.com/test',
      page_path: '/test'
    };

    trackMetaPixelEvent(eventName, params);
    
    expect(window.fbq).toHaveBeenCalledWith('track', eventName, params);
    expect(fbqCalls.length).toBe(1);
    expect(fbqCalls[0]).toEqual(['track', eventName, params]);
  });

  it('should not throw if fbq is not defined', () => {
    // Remove fbq from window
    const originalFbq = window.fbq;
    delete window.fbq;

    // This should not throw
    expect(() => {
      trackMetaPixelEvent('PageView', {});
    }).not.toThrow();

    // Restore fbq
    window.fbq = originalFbq;
  });
});
