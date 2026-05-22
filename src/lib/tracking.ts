import { trackEvent } from "./repository";

declare global {
  interface Window {
    dataLayer: Record<string, unknown>[];
  }
}

/** Push an event object to the GTM dataLayer. */
export const gtmPush = (data: Record<string, unknown>) => {
  try {
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push(data);
  } catch {
    // ignore in SSR / test environments
  }
};

const TRACKING_KEY = "fl_tracking";
const SESSION_KEY = "fl_tracking_session_id";

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

const createSessionId = () => {
  try {
    return crypto.randomUUID();
  } catch {
    return `${Date.now()}-${Math.random().toString(36).slice(2)}`;
  }
};

const getTrackingSessionId = () => {
  try {
    const current = sessionStorage.getItem(SESSION_KEY);
    if (current) return current;
    const next = createSessionId();
    sessionStorage.setItem(SESSION_KEY, next);
    return next;
  } catch {
    return createSessionId();
  }
};

const baseEventPayload = () => ({
  session_id: getTrackingSessionId(),
  path: window.location.pathname,
  title: document.title,
  referrer: document.referrer || null,
});

/** Call on landing page mount. Returns cleanup function. */
export const trackPageView = (): (() => void) => {
  const data = getTrackingData();
  data.pageviews.count += 1;
  data.pageviews.timestamps.push(new Date().toISOString());
  save(data);
  const payload = baseEventPayload();
  trackEvent("page_view", payload);
  gtmPush({ event: "page_view", ...payload });

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
  const payload = baseEventPayload();
  trackEvent("form_start", payload);
  gtmPush({ event: "form_start", ...payload });
};

export const trackCtaClick = (
  ctaId: string,
  payload: Record<string, unknown> = {},
) => {
  const eventPayload = { ...baseEventPayload(), ...payload, cta_id: ctaId };
  trackEvent("cta_click", eventPayload);
  gtmPush({ event: "cta_click", ...eventPayload });
};

export const trackWhatsAppClick = (payload: Record<string, unknown> = {}) => {
  const eventPayload = { ...baseEventPayload(), ...payload };
  trackEvent("whatsapp_click", eventPayload);
  gtmPush({ event: "whatsapp_click", ...eventPayload });
};

export const trackBeginCheckout = ({
  itemId,
  itemName,
  itemCategory,
  value,
}: {
  itemId: string;
  itemName: string;
  itemCategory: string;
  value: number;
}) => {
  const payload = {
    ...baseEventPayload(),
    item_id: itemId,
    item_name: itemName,
    item_category: itemCategory,
    value,
  };

  trackEvent("begin_checkout", payload);
  gtmPush({
    event: "begin_checkout",
    ...payload,
    ecommerce: {
      currency: "BRL",
      value,
      items: [
        {
          item_id: itemId,
          item_name: itemName,
          item_category: itemCategory,
          price: value,
          quantity: 1,
        },
      ],
    },
  });
};

/** Call on /obrigado mount (post-purchase confirmation). */
export const trackPurchase = (email?: string) => {
  const data = getTrackingData();
  data.purchases.count += 1;
  if (email) data.purchases.emails.push(email);
  data.purchases.timestamps.push(new Date().toISOString());
  save(data);
  const payload = { ...baseEventPayload(), ...(email ? { email } : {}) };
  trackEvent("purchase", payload);
  gtmPush({ event: "purchase", ...payload });
};

export const resetTracking = () => {
  try {
    localStorage.removeItem(TRACKING_KEY);
  } catch {
    // ignore
  }
};
