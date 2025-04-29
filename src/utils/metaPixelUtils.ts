
// Utility functions for Meta Pixel (Facebook Pixel) tracking

/**
 * Track a standard event with the Meta Pixel
 * @param eventName The standard Meta Pixel event name
 * @param params Optional parameters for the event
 * @returns boolean indicating if the event was tracked successfully
 */
export function trackMetaPixelEvent(
  eventName: string, 
  params: Record<string, any> = {}
): boolean {
  if (typeof window !== 'undefined' && 'fbq' in window) {
    // TypeScript type assertion for fbq
    const fbq = (window as any).fbq;
    
    fbq('track', eventName, params);
    console.log(`Meta Pixel Event tracked: ${eventName}`, params);
    return true;
  }
  
  console.warn('Meta Pixel (fbq) not found or not initialized');
  return false;
}

/**
 * Track a custom event with the Meta Pixel
 * @param eventName The custom event name
 * @param params Optional parameters for the event
 * @returns boolean indicating if the event was tracked successfully
 */
export function trackCustomMetaPixelEvent(
  eventName: string, 
  params: Record<string, any> = {}
): boolean {
  if (typeof window !== 'undefined' && 'fbq' in window) {
    // TypeScript type assertion for fbq
    const fbq = (window as any).fbq;
    
    fbq('trackCustom', eventName, params);
    console.log(`Meta Pixel Custom Event tracked: ${eventName}`, params);
    return true;
  }
  
  console.warn('Meta Pixel (fbq) not found or not initialized');
  return false;
}

/**
 * Track a lead conversion event
 * @param leadData Data about the lead
 * @returns boolean indicating if the event was tracked successfully
 */
export function trackLeadConversion(leadData: {
  leadId?: string;
  value?: number;
  currency?: string;
  leadSource?: string;
  campaignName?: string;
} = {}): boolean {
  return trackMetaPixelEvent('Lead', leadData);
}

/**
 * Track a completed registration event
 * @param userData Data about the user registration
 * @returns boolean indicating if the event was tracked successfully
 */
export function trackRegistration(userData: {
  userId?: string;
  userType?: string;
  registrationType?: string;
} = {}): boolean {
  return trackMetaPixelEvent('CompleteRegistration', userData);
}

/**
 * Track an add to cart event
 * @param productData Data about the product added to cart
 * @returns boolean indicating if the event was tracked successfully
 */
export function trackAddToCart(productData: {
  content_ids?: string[];
  content_name?: string;
  content_type?: string;
  value?: number;
  currency?: string;
} = {}): boolean {
  return trackMetaPixelEvent('AddToCart', productData);
}

/**
 * Track a purchase event
 * @param purchaseData Data about the purchase
 * @returns boolean indicating if the event was tracked successfully
 */
export function trackPurchase(purchaseData: {
  value: number;
  currency?: string;
  content_ids?: string[];
  content_name?: string;
  content_type?: string;
  order_id?: string;
}): boolean {
  return trackMetaPixelEvent('Purchase', purchaseData);
}

/**
 * Track a payment information add event
 * @param paymentData Data about the payment method
 * @returns boolean indicating if the event was tracked successfully
 */
export function trackAddPaymentInfo(paymentData: {
  content_category?: string;
  content_ids?: string[];
  contents?: any[];
  currency?: string;
  value?: number;
}): boolean {
  return trackMetaPixelEvent('AddPaymentInfo', paymentData);
}

/**
 * Track when a user starts the checkout process
 * @param checkoutData Data about the checkout
 * @returns boolean indicating if the event was tracked successfully
 */
export function trackInitiateCheckout(checkoutData: {
  content_category?: string;
  content_ids?: string[];
  contents?: any[];
  currency?: string;
  value?: number;
}): boolean {
  return trackMetaPixelEvent('InitiateCheckout', checkoutData);
}
