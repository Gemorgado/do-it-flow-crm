
// Tracking utilities for paid media attribution

interface CampaignData {
  source: string;       // google, facebook, instagram, etc.
  medium: string;       // cpc, social, email, etc.
  campaign: string;     // campaign name
  content?: string;     // ad variation
  term?: string;        // keyword
  landingPage?: string; // landing page URL
}

// Parse UTM parameters from URL
export function getUTMParameters(): CampaignData {
  const urlParams = new URLSearchParams(window.location.search);
  
  return {
    source: urlParams.get('utm_source') || 'direct',
    medium: urlParams.get('utm_medium') || 'none',
    campaign: urlParams.get('utm_campaign') || 'none',
    content: urlParams.get('utm_content') || undefined,
    term: urlParams.get('utm_term') || undefined,
    landingPage: window.location.pathname,
  };
}

// Track event in Google Tag Manager
export function trackGTMEvent(eventName: string, eventData: Record<string, any> = {}) {
  if (typeof window !== 'undefined' && 'dataLayer' in window) {
    // TypeScript type assertion for dataLayer
    const dataLayer = (window as any).dataLayer || [];
    
    dataLayer.push({
      event: eventName,
      ...eventData,
      timestamp: new Date().toISOString(),
    });
    
    console.log(`GTM Event tracked: ${eventName}`, eventData);
    return true;
  }
  
  console.warn('Google Tag Manager dataLayer not found');
  return false;
}

// Track event in Facebook Pixel
export function trackFBPixelEvent(eventName: string, eventData: Record<string, any> = {}) {
  if (typeof window !== 'undefined' && 'fbq' in window) {
    // TypeScript type assertion for fbq
    const fbq = (window as any).fbq;
    
    fbq('track', eventName, eventData);
    console.log(`FB Pixel Event tracked: ${eventName}`, eventData);
    return true;
  }
  
  console.warn('Facebook Pixel not found');
  return false;
}

// Track lead events across all platforms
export function trackLeadEvent(eventName: string, leadData: Record<string, any> = {}) {
  // Track in GTM
  trackGTMEvent(eventName, leadData);
  
  // Track in Facebook Pixel
  trackFBPixelEvent(eventName, leadData);
  
  // Return campaign data for storage
  return getUTMParameters();
}
