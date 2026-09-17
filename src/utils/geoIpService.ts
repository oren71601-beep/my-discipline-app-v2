/**
 * Subscription Checkout Routing Service
 * Exclusively powered by Payoneer for all users (domestic & international)
 */

export const PAYONEER_CHECKOUT_URL = 'https://link.payoneer.com/Token?t=ABB2FE3653554304AC7F081556E8CF02&src=dpl';
// Deprecated alias pointing directly to Payoneer
export const ICOUNT_CHECKOUT_URL = PAYONEER_CHECKOUT_URL;

const STORAGE_KEY_COUNTRY = 'trading_tracker_user_country';
const STORAGE_KEY_IS_ISRAEL = 'trading_tracker_is_israel';

export interface GeoLocationState {
  isIsrael: boolean;
  countryCode: string;
  providerName: 'Payoneer';
  checkoutUrl: string;
  source: 'cache' | 'api' | 'heuristic' | 'fallback';
}

/**
 * Heuristic check using device timezone and language locale
 * Used as an instant synchronous estimate while Geo-IP resolves
 */
export function detectIsraelHeuristic(): boolean {
  try {
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone || '';
    if (tz === 'Asia/Jerusalem' || tz.toLowerCase().includes('jerusalem') || tz.toLowerCase().includes('israel')) {
      return true;
    }

    const navLang = (navigator.language || '').toLowerCase();
    const navLangs = (navigator.languages || []).map((l) => l.toLowerCase());
    if (navLang.startsWith('he') || navLangs.some((l) => l.startsWith('he'))) {
      return true;
    }
  } catch {
    // Ignore error
  }
  return false;
}

/**
 * Get cached Geo-IP detection if available
 */
export function getCachedGeoLocation(): GeoLocationState | null {
  try {
    const cachedCountry = localStorage.getItem(STORAGE_KEY_COUNTRY);
    const cachedIsIsrael = localStorage.getItem(STORAGE_KEY_IS_ISRAEL);

    if (cachedCountry !== null && cachedIsIsrael !== null) {
      const isIsrael = cachedIsIsrael === 'true';
      return {
        isIsrael,
        countryCode: cachedCountry,
        providerName: 'Payoneer',
        checkoutUrl: PAYONEER_CHECKOUT_URL,
        source: 'cache',
      };
    }
  } catch {
    // Ignore storage errors
  }
  return null;
}

/**
 * Perform automatic Geo-IP detection against public IP lookup services
 */
export async function detectGeoLocation(): Promise<GeoLocationState> {
  // 1. Check storage cache first
  const cached = getCachedGeoLocation();
  if (cached) {
    return cached;
  }

  // 2. Query Geo-IP lookup APIs (fast, CORS-friendly)
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 2500);

    // Primary: country.is API (very fast, no key needed)
    const res = await fetch('https://api.country.is', {
      signal: controller.signal,
    });
    clearTimeout(timeoutId);

    if (res.ok) {
      const data = await res.json();
      const code = (data.country || '').toUpperCase();
      const isIsrael = code === 'IL';

      saveGeoLocation(code, isIsrael);

      return {
        isIsrael,
        countryCode: code,
        providerName: 'Payoneer',
        checkoutUrl: PAYONEER_CHECKOUT_URL,
        source: 'api',
      };
    }
  } catch {
    // Fall back to secondary IP service
  }

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 2500);

    // Secondary: ipapi.co
    const res = await fetch('https://ipapi.co/json/', {
      signal: controller.signal,
    });
    clearTimeout(timeoutId);

    if (res.ok) {
      const data = await res.json();
      const code = (data.country_code || '').toUpperCase();
      const isIsrael = code === 'IL';

      saveGeoLocation(code, isIsrael);

      return {
        isIsrael,
        countryCode: code,
        providerName: 'Payoneer',
        checkoutUrl: PAYONEER_CHECKOUT_URL,
        source: 'api',
      };
    }
  } catch {
    // Both APIs unreachable or blocked by client adblocker
  }

  // 3. Fallback to client heuristics (Timezone & Browser language)
  const heuristicIsrael = detectIsraelHeuristic();
  const fallbackCode = heuristicIsrael ? 'IL' : 'US';
  saveGeoLocation(fallbackCode, heuristicIsrael);

  return {
    isIsrael: heuristicIsrael,
    countryCode: fallbackCode,
    providerName: 'Payoneer',
    checkoutUrl: PAYONEER_CHECKOUT_URL,
    source: 'heuristic',
  };
}

function saveGeoLocation(countryCode: string, isIsrael: boolean) {
  try {
    localStorage.setItem(STORAGE_KEY_COUNTRY, countryCode);
    localStorage.setItem(STORAGE_KEY_IS_ISRAEL, isIsrael ? 'true' : 'false');
  } catch {
    // Ignore storage errors
  }
}

export function setSimulatedCountry(countryCode: 'IL' | 'US' | null): GeoLocationState {
  if (!countryCode) {
    try {
      localStorage.removeItem(STORAGE_KEY_COUNTRY);
      localStorage.removeItem(STORAGE_KEY_IS_ISRAEL);
    } catch {
      // ignore
    }
    const heuristicIsrael = detectIsraelHeuristic();
    return {
      isIsrael: heuristicIsrael,
      countryCode: heuristicIsrael ? 'IL' : 'US',
      providerName: 'Payoneer',
      checkoutUrl: PAYONEER_CHECKOUT_URL,
      source: 'heuristic',
    };
  }
  const isIsrael = countryCode === 'IL';
  saveGeoLocation(countryCode, isIsrael);
  return {
    isIsrael,
    countryCode,
    providerName: 'Payoneer',
    checkoutUrl: PAYONEER_CHECKOUT_URL,
    source: 'cache',
  };
}

/**
 * Returns current checkout URL synchronously (exclusively Payoneer)
 */
export function getCurrentSubscriptionUrl(): string {
  return PAYONEER_CHECKOUT_URL;
}
