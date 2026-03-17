import { trackEvent } from "./repository";

const TRACKING_KEY = "fl_tracking";

export interface TrackingData {
  pageviews: { count: number; timestamps: string[] };
  formStarts: number;
  purchases: { count: number; emails: string[]; timestamps: string[] };
  avgTimeOnPage: number;
  sessionDurations: number[];
}

const defaults: TrackingData = {
  pageviews: { count: 0, timestamps: [] },
  formStarts: 0,
  purchases: { count: 0, emails: [], timestamps: [] },
  avgTimeOnPage: 0,
  sessionDurations: [],
};

export const getTrackingData = (): TrackingData => {
  try {
    const raw = localStorage.getItem(TRACKING_KEY);
    if (!raw) return { ...defaults, pageviews: { count: 0, timestamps: [] }, purchases: { count: 0, emails: [], timestamps: [] } };
    const parsed = JSON.parse(raw);
    return {
      ...defaults,
      ...parsed,
      pageviews: { count: 0, timestamps: [], ...parsed.pageviews },
      purchases: { count: 0, emails: [], timestamps: [], ...parsed.purchases },
    };
  } catch {
    return { ...defaults, pageviews: { count: 0, timestamps: [] }, purchases: { count: 0, emails: [], timestamps: [] } };
  }
};

const save = (data: TrackingData) => {
  try {
    localStorage.setItem(TRACKING_KEY, JSON.stringify(data));
  } catch {
    // ignore storage errors
  }
};

/** Call on landing page mount. Returns cleanup function. */
export const trackPageView = (): (() => void) => {
  const data = getTrackingData();
  data.pageviews.count += 1;
  data.pageviews.timestamps.push(new Date().toISOString());
  save(data);
  trackEvent("page_view");

  const startTime = Date.now();
  const handleUnload = () => {
    const duration = Math.round((Date.now() - startTime) / 1000);
    const d = getTrackingData();
    d.sessionDurations.push(duration);
    const total = d.sessionDurations.reduce((a, b) => a + b, 0);
    d.avgTimeOnPage = Math.round(total / d.sessionDurations.length);
    save(d);
  };

  window.addEventListener("beforeunload", handleUnload);
  return () => window.removeEventListener("beforeunload", handleUnload);
};

/** Call when user first interacts with the purchase form. */
export const trackFormStart = () => {
  const data = getTrackingData();
  data.formStarts += 1;
  save(data);
  trackEvent("form_start");
};

/** Call on /obrigado mount (post-purchase confirmation). */
export const trackPurchase = (email?: string) => {
  const data = getTrackingData();
  data.purchases.count += 1;
  if (email) data.purchases.emails.push(email);
  data.purchases.timestamps.push(new Date().toISOString());
  save(data);
  trackEvent("purchase", email ? { email } : undefined);
};

export const resetTracking = () => {
  try {
    localStorage.removeItem(TRACKING_KEY);
  } catch {
    // ignore
  }
};
