
export const GA_MEASUREMENT_ID = 'G-EPORTS_DEMO'; // Placeholder ID

export const initGA = () => {
  if (typeof window === 'undefined') return;

  // Prevent multiple injections
  if (document.getElementById('ga-script')) return;

  // Inject the script
  const script = document.createElement('script');
  script.id = 'ga-script';
  script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;
  script.async = true;
  document.head.appendChild(script);

  // Initialize dataLayer
  window.dataLayer = window.dataLayer || [];
  function gtag(...args: any[]) {
    window.dataLayer.push(args);
  }
  window.gtag = gtag;
  gtag('js', new Date());
  gtag('config', GA_MEASUREMENT_ID);
};

export const trackEvent = (
    eventName: string,
    params?: Record<string, any>
) => {
    if (typeof window !== 'undefined' && window.gtag) {
        window.gtag('event', eventName, params);
    }
};

export const trackPageView = (path: string) => {
    if (typeof window !== 'undefined' && window.gtag) {
         window.gtag('config', GA_MEASUREMENT_ID, {
            page_path: path,
         });
    }
};
