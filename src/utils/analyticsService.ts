/**
 * Analytics & Measurement Service
 * Tracks visitors, signups, newsletter subscribers, checkout clicks, and paying customers.
 * Exclusively viewed by the app owner (Oren).
 */

import { db } from '../firebase';
import { doc, getDoc, setDoc, collection, addDoc } from 'firebase/firestore';

export interface AnalyticsSummary {
  totalPageviews: number;
  uniqueVisitors: number;
  mobileVisits: number;
  desktopVisits: number;
  newsletterSignups: number;
  registeredAccounts: number;
  checkoutIntents: number;
  payingCustomers: number;
  estimatedRevenueUSD: number;
  lastUpdated: string;
}

export interface AnalyticsEvent {
  id: string;
  type: 'visit' | 'landing_view' | 'app_view' | 'signup' | 'login' | 'newsletter_signup' | 'checkout_intent' | 'payment_success';
  timestamp: string;
  device: 'mobile' | 'desktop';
  email?: string;
  details?: string;
}

const STORAGE_KEY_SUMMARY = 'trading_tracker_analytics_summary';
const STORAGE_KEY_EVENTS = 'trading_tracker_analytics_events';
const STORAGE_KEY_VISITOR_ID = 'trading_tracker_visitor_id';
const STORAGE_KEY_SESSION_RECORDED = 'trading_tracker_session_recorded';

// Generate or retrieve persistent visitor ID
export function getVisitorId(): string {
  try {
    let id = localStorage.getItem(STORAGE_KEY_VISITOR_ID);
    if (!id) {
      id = 'vis_' + Math.random().toString(36).substring(2, 9) + '_' + Date.now().toString(36);
      localStorage.setItem(STORAGE_KEY_VISITOR_ID, id);
    }
    return id;
  } catch {
    return 'vis_fallback';
  }
}

// Check device
export function getDeviceType(): 'mobile' | 'desktop' {
  if (typeof window === 'undefined') return 'desktop';
  const ua = navigator.userAgent.toLowerCase();
  const isMobile = /mobile|iphone|ipod|android|blackberry|opera mini|iemobile|wpdesktop/.test(ua) || window.innerWidth < 768;
  return isMobile ? 'mobile' : 'desktop';
}

// Get stored summary from localStorage
export function getStoredSummary(): AnalyticsSummary {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_SUMMARY);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch {}

  // Initialize with baseline counts derived from existing data
  return computeLiveSummary();
}

// Get all stored events (last 100)
export function getStoredEvents(): AnalyticsEvent[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_EVENTS);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

// Compute live real metrics from local storage registries (accounts, newsletters, paid subscribers)
export function computeLiveSummary(): AnalyticsSummary {
  let newsletterCount = 0;
  let accountsCount = 0;
  let paidCount = 0;

  try {
    const rawNewsletter = localStorage.getItem('trading_tracker_newsletter_subscribers');
    if (rawNewsletter) {
      newsletterCount = JSON.parse(rawNewsletter).length;
    }
  } catch {}

  try {
    const rawAccounts = localStorage.getItem('trading_tracker_local_accounts');
    if (rawAccounts) {
      accountsCount = Object.keys(JSON.parse(rawAccounts)).length;
    }
  } catch {}

  try {
    const rawPaid = localStorage.getItem('trading_tracker_paid_emails');
    if (rawPaid) {
      paidCount = JSON.parse(rawPaid).length;
    }
  } catch {}

  let totalPageviews = 1;
  let uniqueVisitors = 1;
  let mobileVisits = 0;
  let desktopVisits = 1;
  let checkoutIntents = 0;

  try {
    const rawSummary = localStorage.getItem(STORAGE_KEY_SUMMARY);
    if (rawSummary) {
      const parsed = JSON.parse(rawSummary);
      totalPageviews = Math.max(parsed.totalPageviews || 1, 1);
      uniqueVisitors = Math.max(parsed.uniqueVisitors || 1, 1);
      mobileVisits = parsed.mobileVisits || 0;
      desktopVisits = parsed.desktopVisits || 1;
      checkoutIntents = parsed.checkoutIntents || 0;
    }
  } catch {}

  return {
    totalPageviews,
    uniqueVisitors,
    mobileVisits,
    desktopVisits,
    newsletterSignups: newsletterCount,
    registeredAccounts: accountsCount,
    checkoutIntents,
    payingCustomers: paidCount,
    estimatedRevenueUSD: paidCount * 25,
    lastUpdated: new Date().toISOString()
  };
}

// Save summary locally & optionally in Firestore
export async function saveSummary(summary: AnalyticsSummary) {
  try {
    localStorage.setItem(STORAGE_KEY_SUMMARY, JSON.stringify(summary));
  } catch {}

  // Sync to Firestore if db is available
  if (db) {
    try {
      const summaryDoc = doc(db, 'site_analytics', 'summary');
      await setDoc(summaryDoc, {
        ...summary,
        updatedAt: new Date().toISOString()
      }, { merge: true });
    } catch (e) {
      // Non-fatal, local fallback is maintained
      console.warn('Analytics cloud sync skipped:', e);
    }
  }
}

// Record an individual analytics event
export async function recordAnalyticsEvent(
  type: AnalyticsEvent['type'], 
  details?: string, 
  email?: string
): Promise<void> {
  const device = getDeviceType();
  const event: AnalyticsEvent = {
    id: 'evt_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6),
    type,
    timestamp: new Date().toISOString(),
    device,
    email,
    details
  };

  // Add to local events list
  try {
    const existing = getStoredEvents();
    const updated = [event, ...existing].slice(0, 100);
    localStorage.setItem(STORAGE_KEY_EVENTS, JSON.stringify(updated));
  } catch {}

  // Update summary numbers
  const summary = computeLiveSummary();
  if (type === 'visit') {
    summary.totalPageviews += 1;
    if (device === 'mobile') {
      summary.mobileVisits += 1;
    } else {
      summary.desktopVisits += 1;
    }
  } else if (type === 'checkout_intent') {
    summary.checkoutIntents += 1;
  }

  await saveSummary(summary);

  // Sync event to Firestore collection if db exists
  if (db) {
    try {
      const eventsCol = collection(db, 'analytics_events');
      await addDoc(eventsCol, {
        ...event,
        visitorId: getVisitorId()
      });
    } catch {}
  }
}

// Automatic Session Visit Tracker (deduplicates per browser session to accurately measure unique visits)
export function trackAutomaticVisit(view: 'landing' | 'app'): void {
  if (typeof window === 'undefined') return;

  const sessionRecorded = sessionStorage.getItem(STORAGE_KEY_SESSION_RECORDED);
  const summary = computeLiveSummary();
  const device = getDeviceType();

  summary.totalPageviews += 1;

  if (!sessionRecorded) {
    // New unique session visit!
    sessionStorage.setItem(STORAGE_KEY_SESSION_RECORDED, 'true');
    summary.uniqueVisitors += 1;
    if (device === 'mobile') {
      summary.mobileVisits += 1;
    } else {
      summary.desktopVisits += 1;
    }

    recordAnalyticsEvent(
      view === 'landing' ? 'landing_view' : 'visit',
      `New visitor session (${device}) on ${view === 'landing' ? 'Landing Page' : 'Trading Journal'}`
    );
  } else {
    // Recurring pageview in same session
    saveSummary(summary);
  }
}

// Get list of newsletter emails for owner export/viewing
export function getNewsletterSubscribersList(): { email: string; date?: string }[] {
  try {
    const raw = localStorage.getItem('trading_tracker_newsletter_subscribers');
    if (raw) {
      const list: string[] = JSON.parse(raw);
      return list.map(email => ({ email }));
    }
  } catch {}
  return [];
}

// Get list of paid subscriber emails
export function getPaidSubscribersList(): string[] {
  try {
    const raw = localStorage.getItem('trading_tracker_paid_emails');
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

// Get list of registered accounts
export function getRegisteredAccountsList(): { email: string; name?: string; createdAt?: string; isPremium?: boolean }[] {
  try {
    const raw = localStorage.getItem('trading_tracker_local_accounts');
    if (raw) {
      const accounts = JSON.parse(raw);
      return Object.values(accounts);
    }
  } catch {}
  return [];
}
