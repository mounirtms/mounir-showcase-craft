// Analytics utility functions

declare global {
  interface Window {
    dataLayer: any[];
  }
}

/**
 * Push event to dataLayer for Google Tag Manager
 * @param eventName - Name of the event
 * @param eventData - Additional event data
 */
export const trackEvent = (eventName: string, eventData: Record<string, any> = {}) => {
  if (typeof window !== 'undefined' && window.dataLayer) {
    window.dataLayer.push({
      event: eventName,
      ...eventData
    });
  }
};

/**
 * Track button clicks
 * @param buttonName - Name of the button
 * @param additionalData - Additional data to track
 */
export const trackButtonClick = (buttonName: string, additionalData: Record<string, any> = {}) => {
  trackEvent('button_click', {
    buttonName,
    ...additionalData
  });
};

/**
 * Track form submissions
 * @param formName - Name of the form
 * @param additionalData - Additional data to track
 */
export const trackFormSubmit = (formName: string, additionalData: Record<string, any> = {}) => {
  trackEvent('form_submit', {
    formName,
    ...additionalData
  });
};

/**
 * Track page views
 * @param pageName - Name of the page
 * @param additionalData - Additional data to track
 */
export const trackPageView = (pageName: string, additionalData: Record<string, any> = {}) => {
  trackEvent('page_view', {
    pageName,
    ...additionalData
  });
};