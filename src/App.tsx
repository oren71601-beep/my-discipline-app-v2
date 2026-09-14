/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { TradingDay } from './types';
import { StatsDashboard } from './components/StatsDashboard';
import { InteractiveTable } from './components/InteractiveTable';
import { CalendarView } from './components/CalendarView';
import { AppWalkthroughVideo } from './components/AppWalkthroughVideo';
import LandingPage from './components/LandingPage';
import { 
  Calendar, 
  TrendingUp, 
  Download, 
  Upload, 
  Trash2, 
  FileSpreadsheet, 
  Info, 
  Sparkles,
  HelpCircle,
  Lock,
  Unlock,
  ExternalLink,
  ShieldCheck,
  Globe,
  CreditCard,
  UserCheck,
  Crown,
  Brain,
  Gift,
  CheckCircle2,
  Clock,
  CalendarDays,
  Target,
  Edit3,
  Check,
  Cloud,
  Smartphone,
  Monitor
} from 'lucide-react';
import { User, onAuthStateChanged } from 'firebase/auth';
import { 
  auth, 
  subscribeToMonthData, 
  saveMonthToCloud, 
  migrateLocalDataToCloud,
  saveUserProfileToCloud,
  subscribeToUserProfile 
} from './firebase';
import { CloudSyncModal } from './components/CloudSyncModal';
import { EndOfMonthInsightsModal } from './components/EndOfMonthInsightsModal';
import { LanguageCode, TRANSLATIONS, LANGUAGES } from './utils/translations';
import { AccountBillingModal } from './components/AccountBillingModal';
import { CancelSubscriptionResponse } from './utils/billingService';
import { 
  ICOUNT_CHECKOUT_URL, 
  PAYONEER_CHECKOUT_URL, 
  detectGeoLocation, 
  getCachedGeoLocation, 
  detectIsraelHeuristic,
  setSimulatedCountry,
  GeoLocationState
} from './utils/geoIpService';

const YEARS = [2024, 2025, 2026, 2027, 2028, 2029, 2030];

export default function App() {
  const [language, setLanguage] = useState<LanguageCode>(() => {
    return (localStorage.getItem('trading_tracker_lang') as LanguageCode) || 'en';
  });

  const t = TRANSLATIONS[language];
  const isRtl = language === 'he' || language === 'ar';

  // Geo-IP Automatic Location Detection (iCount for Israel / Payoneer for International)
  const [geoInfo, setGeoInfo] = useState<GeoLocationState>(() => {
    const cached = getCachedGeoLocation();
    if (cached) return cached;
    const isIL = detectIsraelHeuristic();
    return {
      isIsrael: isIL,
      countryCode: isIL ? 'IL' : 'US',
      providerName: isIL ? 'iCount' : 'Payoneer',
      checkoutUrl: isIL ? ICOUNT_CHECKOUT_URL : PAYONEER_CHECKOUT_URL,
      source: 'heuristic',
    };
  });

  useEffect(() => {
    detectGeoLocation().then((loc) => {
      setGeoInfo(loc);
    });
  }, []);

  // Sync HTML document direction
  useEffect(() => {
    document.documentElement.dir = t.dir;
    localStorage.setItem('trading_tracker_lang', language);
  }, [language, t.dir]);

  // Setup defaults - restore exact last opened month and year from LocalStorage, with fallback to real current month/year
  const [selectedYear, setSelectedYear] = useState<number>(() => {
    const saved = localStorage.getItem('trading_tracker_selected_year') || localStorage.getItem('trading_tracker_last_closed_year');
    if (saved) {
      const parsed = parseInt(saved, 10);
      if (!isNaN(parsed) && parsed >= 2020 && parsed <= 2035) return parsed;
    }
    return new Date().getFullYear();
  });
  const [selectedMonth, setSelectedMonth] = useState<number>(() => {
    const saved = localStorage.getItem('trading_tracker_selected_month') || localStorage.getItem('trading_tracker_last_closed_month');
    if (saved) {
      const parsed = parseInt(saved, 10);
      if (!isNaN(parsed) && parsed >= 1 && parsed <= 12) return parsed;
    }
    return new Date().getMonth() + 1; // Real current month (e.g. 9 for September)
  });
  const [days, setDays] = useState<TradingDay[]>([]);
  const [showStats, setShowStats] = useState<boolean>(true);
  const [activeView, setActiveView] = useState<'table' | 'calendar'>(() => {
    const saved = localStorage.getItem('trading_tracker_active_view');
    return (saved === 'calendar' || saved === 'table') ? saved : 'table';
  });
  const [lastSelectedDay, setLastSelectedDay] = useState<number | null>(() => {
    const saved = localStorage.getItem('trading_tracker_last_day');
    return saved ? parseInt(saved, 10) : null;
  });
  const [showClearConfirm, setShowClearConfirm] = useState<boolean>(false);
  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'info' | 'error' } | null>(null);

  // Subscription & Paywall States - defaults to active workspace for returning or pro users
  const [isPremium, setIsPremium] = useState<boolean>(() => {
    const saved = localStorage.getItem('trading_tracker_premium');
    return saved === null ? true : saved === 'true';
  });
  const [accountName, setAccountName] = useState<string>(() => {
    return localStorage.getItem('trading_tracker_account_name') || '';
  });

  const handleUpdateAccountName = (newName: string) => {
    setAccountName(newName);
    localStorage.setItem('trading_tracker_account_name', newName);
  };

  const [showPaywallModal, setShowPaywallModal] = useState<boolean>(false);
  const [showBillingModal, setShowBillingModal] = useState<boolean>(false);
  const [isSimulatingSubPurchase, setIsSimulatingSubPurchase] = useState<boolean>(false);
  // Reopening page always returns cleanly to the main workspace (הדף הראשי)
  const [showLanding, setShowLanding] = useState<boolean>(false);
  const [showWalkthroughVideo, setShowWalkthroughVideo] = useState<boolean>(false);
  const [showEndOfMonthModal, setShowEndOfMonthModal] = useState<boolean>(false);

  // Cloud Sync & Multi-device persistence (Firebase Firestore & Auth)
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [showCloudSyncModal, setShowCloudSyncModal] = useState<boolean>(false);
  const [cloudSyncStatus, setCloudSyncStatus] = useState<'idle' | 'syncing' | 'synced' | 'error'>('idle');

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Derive month string layout like "2026-06"
  const monthId = `${selectedYear}-${String(selectedMonth).padStart(2, '0')}`;

  // Previous Month Pledge / Personal Commitment calculation
  const prevMonthNum = selectedMonth === 1 ? 12 : selectedMonth - 1;
  const prevYearNum = selectedMonth === 1 ? selectedYear - 1 : selectedYear;
  const prevMonthId = `${prevYearNum}-${String(prevMonthNum).padStart(2, '0')}`;

  const [currentPledge, setCurrentPledge] = useState<string>('');
  const [isEditingPledge, setIsEditingPledge] = useState<boolean>(false);
  const [pledgeDraft, setPledgeDraft] = useState<string>('');

  useEffect(() => {
    const savedPrev = localStorage.getItem(`trading_tracker_pledge_${prevMonthId}`);
    const savedCurr = localStorage.getItem(`trading_tracker_pledge_${monthId}`);
    if (savedPrev && savedPrev.trim()) {
      setCurrentPledge(savedPrev.trim());
    } else if (savedCurr && savedCurr.trim()) {
      setCurrentPledge(savedCurr.trim());
    } else {
      setCurrentPledge('');
    }
  }, [selectedYear, selectedMonth, prevMonthId, monthId]);

  useEffect(() => {
    const handleStorageUpdate = () => {
      const savedPrev = localStorage.getItem(`trading_tracker_pledge_${prevMonthId}`);
      const savedCurr = localStorage.getItem(`trading_tracker_pledge_${monthId}`);
      if (savedPrev && savedPrev.trim()) setCurrentPledge(savedPrev.trim());
      else if (savedCurr && savedCurr.trim()) setCurrentPledge(savedCurr.trim());
      else setCurrentPledge('');
    };
    window.addEventListener('pledge_updated', handleStorageUpdate);
    window.addEventListener('storage', handleStorageUpdate);
    return () => {
      window.removeEventListener('pledge_updated', handleStorageUpdate);
      window.removeEventListener('storage', handleStorageUpdate);
    };
  }, [prevMonthId, monthId]);

  const handleSavePledge = (newPledge: string) => {
    const trimmed = newPledge.trim();
    setCurrentPledge(trimmed);
    if (trimmed) {
      localStorage.setItem(`trading_tracker_pledge_${prevMonthId}`, trimmed);
      localStorage.setItem(`trading_tracker_pledge_${monthId}`, trimmed);
      showToast(
        language === 'he' ? 'ההתחייבות האישית מחודש שעבר עודכנה בהצלחה! 🎯' : 'Commitment updated successfully! 🎯',
        'success'
      );
    } else {
      localStorage.removeItem(`trading_tracker_pledge_${prevMonthId}`);
      localStorage.removeItem(`trading_tracker_pledge_${monthId}`);
    }
    if (currentUser) {
      saveMonthToCloud(currentUser.uid, monthId, selectedYear, selectedMonth, days, trimmed);
    }
    setIsEditingPledge(false);
    window.dispatchEvent(new Event('pledge_updated'));
  };

  // 1. Firebase Auth listener: Automatically handles user session & local-to-cloud migration
  useEffect(() => {
    if (!auth) return;
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      if (user) {
        setCloudSyncStatus('syncing');
        try {
          await migrateLocalDataToCloud(user.uid);
          setCloudSyncStatus('synced');
        } catch (err) {
          console.error('Migration error on login:', err);
          setCloudSyncStatus('error');
        }
      } else {
        setCloudSyncStatus('idle');
      }
    });
    return () => unsubscribe();
  }, []);

  // 2. Real-time Month Sync: Live Firestore listener so phone & PC update instantly
  useEffect(() => {
    if (!currentUser) return;

    setCloudSyncStatus('syncing');
    const unsubscribe = subscribeToMonthData(currentUser.uid, monthId, (cloudData) => {
      if (cloudData && Array.isArray(cloudData.days) && cloudData.days.length > 0) {
        setDays(cloudData.days);
        localStorage.setItem(`trading_tracker_data_${monthId}`, JSON.stringify(cloudData.days));
        if (typeof cloudData.pledge === 'string') {
          setCurrentPledge(cloudData.pledge);
          localStorage.setItem(`trading_tracker_pledge_${monthId}`, cloudData.pledge);
        }
      }
      setCloudSyncStatus('synced');
    });

    return () => unsubscribe();
  }, [currentUser, monthId]);

  // 3. User Profile Sync across devices (active year & month)
  useEffect(() => {
    if (!currentUser) return;

    const unsubscribe = subscribeToUserProfile(currentUser.uid, (profile) => {
      if (profile) {
        if (profile.selectedYear && profile.selectedYear !== selectedYear) {
          setSelectedYear(profile.selectedYear);
        }
        if (profile.selectedMonth && profile.selectedMonth !== selectedMonth) {
          setSelectedMonth(profile.selectedMonth);
        }
      }
    });

    return () => unsubscribe();
  }, [currentUser]);

  // Synchronize state preferences to LocalStorage for full session continuity
  useEffect(() => {
    localStorage.setItem('trading_tracker_selected_year', String(selectedYear));
    localStorage.setItem('trading_tracker_last_closed_year', String(selectedYear));
  }, [selectedYear]);

  useEffect(() => {
    localStorage.setItem('trading_tracker_selected_month', String(selectedMonth));
    localStorage.setItem('trading_tracker_last_closed_month', String(selectedMonth));
  }, [selectedMonth]);

  useEffect(() => {
    localStorage.setItem('trading_tracker_active_view', activeView);
  }, [activeView]);

  // Synchronize state synchronously right when the user closes, refreshes or leaves the page
  useEffect(() => {
    const handleSaveOnPageClose = () => {
      localStorage.setItem('trading_tracker_selected_year', String(selectedYear));
      localStorage.setItem('trading_tracker_selected_month', String(selectedMonth));
      localStorage.setItem('trading_tracker_last_closed_year', String(selectedYear));
      localStorage.setItem('trading_tracker_last_closed_month', String(selectedMonth));
      // Ensure landing page flag is cleared so reopening ALWAYS returns directly to the main workspace (הדף הראשי)
      localStorage.removeItem('trading_tracker_show_landing');
    };

    window.addEventListener('beforeunload', handleSaveOnPageClose);
    window.addEventListener('pagehide', handleSaveOnPageClose);
    return () => {
      window.removeEventListener('beforeunload', handleSaveOnPageClose);
      window.removeEventListener('pagehide', handleSaveOnPageClose);
    };
  }, [selectedYear, selectedMonth]);

  useEffect(() => {
    if (lastSelectedDay !== null) {
      localStorage.setItem('trading_tracker_last_day', String(lastSelectedDay));
    }
  }, [lastSelectedDay]);

  // Derivations for "Professional Polish" premium header statistics
  const executedDays = days.filter(d => d.executed === 'Y');
  const executedDaysCount = executedDays.length;
  const noneDeviationCount = executedDays.filter(d => d.deviation === 'none').length;
  const disciplineScore = executedDaysCount > 0 ? (noneDeviationCount / executedDaysCount) * 10 : 10.0;
  const totalR = executedDays.reduce((acc, d) => acc + (d.resultR || 0), 0);

  // Get dynamic months list
  const MONTH_NAMES = t.months.map((name, i) => ({ id: i + 1, name }));

  // Helper: Get number of days in a year/month combination
  const getDaysInMonth = (year: number, month: number): number => {
    return new Date(year, month, 0).getDate();
  };

  // Trigger temporary toast notifications
  const showToast = (message: string, type: 'success' | 'info' | 'error' = 'success') => {
    setNotification({ message, type });
    setTimeout(() => {
      setNotification(null);
    }, 4000);
  };

  // Load or construct days template when selectedMonth / selectedYear change
  useEffect(() => {
    const storageKey = `trading_tracker_data_${monthId}`;
    const storedData = localStorage.getItem(storageKey);

    if (storedData) {
      try {
        const parsed = JSON.parse(storedData) as TradingDay[];
        // Align dynamically to the exact number of days of the month (e.g. if saved on a different template, force conformity)
        const daysCount = getDaysInMonth(selectedYear, selectedMonth);
        if (parsed.length === daysCount) {
          setDays(parsed);
        } else {
          // Adjust length dynamically
          const adjusted: TradingDay[] = Array.from({ length: daysCount }, (_, i) => {
            const dayNum = i + 1;
            const existing = parsed.find(p => p.day === dayNum);
            return existing || {
              day: dayNum,
              executed: null,
              mentalState: null,
              noEntryReason: null,
              deviation: null,
              confidence: null,
              rating: null,
              resultR: null,
              notes: '',
            };
          });
          setDays(adjusted);
        }
      } catch (err) {
        console.error("Error loading tracker data", err);
        generateFreshTemplate();
      }
    } else {
      generateFreshTemplate();
    }
  }, [selectedYear, selectedMonth, monthId]);

  // Helper routine to make clean unfilled template
  const generateFreshTemplate = () => {
    const daysCount = getDaysInMonth(selectedYear, selectedMonth);
    const freshDays: TradingDay[] = Array.from({ length: daysCount }, (_, i) => ({
      day: i + 1,
      executed: null,
      mentalState: null,
      noEntryReason: null,
      deviation: null,
      confidence: null,
      rating: null,
      resultR: null,
      notes: '',
    }));
    setDays(freshDays);
  };

  // Auto-save State changes to LocalStorage and Firestore Cloud in real-time
  const saveToStorage = (updatedDays: TradingDay[]) => {
    const storageKey = `trading_tracker_data_${monthId}`;
    localStorage.setItem(storageKey, JSON.stringify(updatedDays));
    if (currentUser) {
      saveMonthToCloud(currentUser.uid, monthId, selectedYear, selectedMonth, updatedDays, currentPledge);
    }
  };

  // Handle a change in cell data (supports both single field change and updating multiple fields in one batch)
  const handleUpdateDay = (dayNum: number, fieldOrUpdates: keyof TradingDay | Partial<TradingDay>, value?: any) => {
    setLastSelectedDay(dayNum);
    setDays(prevDays => {
      const updated = prevDays.map(d => {
        if (d.day === dayNum) {
          if (typeof fieldOrUpdates === 'object' && fieldOrUpdates !== null) {
            return {
              ...d,
              ...fieldOrUpdates,
            };
          } else {
            return {
              ...d,
              [fieldOrUpdates as keyof TradingDay]: value,
            };
          }
        }
        return d;
      });
      saveToStorage(updated);
      return updated;
    });
  };

  // Action: Pre-populate sample/demo data so the stats charts pop up beautifully on first render!
  const handlePopulateSampleData = () => {
    const daysCount = getDaysInMonth(selectedYear, selectedMonth);
    const demoDays: TradingDay[] = Array.from({ length: daysCount }, (_, i) => {
      const dNum = i + 1;
      
      // Standard layout simulation
      if (dNum === 1) {
        return {
          day: dNum,
          executed: 'Y',
          mentalState: 'calm',
          noEntryReason: null,
          deviation: 'none',
          confidence: 5,
          rating: 9,
          resultR: 2.5,
          notes: language === 'he' ? 'פריצה מושלמת מעל רמת שיא שבועי. כניסה לפי הספר ויציאה ביעד R3.' : 'Perfect breakout on support, entry by the book, exited at target.',
        };
      }
      if (dNum === 2) {
        return {
          day: dNum,
          executed: 'N',
          mentalState: 'calm',
          noEntryReason: 'focus',
          deviation: null,
          confidence: null,
          rating: null,
          resultR: 0,
          notes: language === 'he' ? 'חיכיתי לפולבק אך המחיר טס בלעדיי. נמנעתי ממרדף.' : 'Missed trigger, didn\'t chase.',
        };
      }
      if (dNum === 3) {
        return {
          day: dNum,
          executed: 'Y',
          mentalState: 'stressed',
          noEntryReason: null,
          deviation: 'early_entry',
          confidence: 2,
          rating: 5,
          resultR: -1.0,
          notes: language === 'he' ? 'חריגה: נכנסתי חצי דקה לפני סגירת הנר מחשש שאהיה באיחור.' : 'Deviation: Entered early due to FOMO before close confirmation.',
        };
      }
      if (dNum === 4) {
        return {
          day: dNum,
          executed: 'N',
          mentalState: 'tired',
          noEntryReason: 'discipline',
          deviation: null,
          confidence: null,
          rating: null,
          resultR: 0,
          notes: language === 'he' ? 'עייפות מוגברת, החלטתי לא לחפש עסקאות בכוח.' : 'Felt tired, stayed disciplined and out of markets.',
        };
      }
      if (dNum === 5) {
        return {
          day: dNum,
          executed: 'Y',
          mentalState: 'calm',
          noEntryReason: null,
          deviation: 'none',
          confidence: 4,
          rating: 8,
          resultR: 1.5,
          notes: language === 'he' ? 'עסקת היפוך מוצלחת על קו מגמה.' : 'Beautiful trend reversal entry.',
        };
      }
      if (dNum === 8) {
        return {
          day: dNum,
          executed: 'Y',
          mentalState: 'revenge',
          noEntryReason: null,
          deviation: 'move_stop',
          confidence: 1,
          rating: 2,
          resultR: -2.3,
          notes: language === 'he' ? 'סטייה חמורה: הזזתי את הסטופ לוס למטה בעקבות רצף הפסדים.' : 'Severe deviation: Moved stop loss down out of revenge.',
        };
      }
      if (dNum === 9) {
        return {
          day: dNum,
          executed: 'Y',
          mentalState: 'indifferent',
          noEntryReason: null,
          deviation: 'none',
          confidence: 3,
          rating: 7,
          resultR: 0.8,
          notes: language === 'he' ? 'עסקה רגועה ללא דרמות מיוחדות.' : 'Calm clean small win.',
        };
      }
      if (dNum === 12) {
        return {
          day: dNum,
          executed: 'Y',
          mentalState: 'stressed',
          noEntryReason: null,
          deviation: 'raise_risk',
          confidence: 3,
          rating: 4,
          resultR: -1.8,
          notes: language === 'he' ? 'חריגה: הגדלתי את סיכון ה-R המקורי כי הייתי בטוח מדי.' : 'Deviation: Raised position size excessively because of high confidence.',
        };
      }
      if (dNum === 16) {
        return {
          day: dNum,
          executed: 'N',
          mentalState: 'calm',
          noEntryReason: 'rr',
          deviation: null,
          confidence: null,
          rating: null,
          resultR: 0,
          notes: language === 'he' ? 'סטאפ תקין אך יחס סיכון/סיכוי היה נמוך.' : 'No entry because Risk-Reward was below plan.',
        };
      }
      if (dNum === 19) {
        return {
          day: dNum,
          executed: 'Y',
          mentalState: 'calm',
          noEntryReason: null,
          deviation: 'none',
          confidence: 5,
          rating: 9,
          resultR: 2.4,
          notes: language === 'he' ? 'מימוש מלא ביעד 2.4R לפי כללי התוכנית.' : 'Clean trade execution with full 2.4R target hit.',
        };
      }
      if (dNum === 23) {
        return {
          day: dNum,
          executed: 'Y',
          mentalState: 'calm',
          noEntryReason: null,
          deviation: 'none',
          confidence: 4,
          rating: 8,
          resultR: 1.6,
          notes: language === 'he' ? 'סבלנות ומשמעת ברמה גבוהה.' : 'High discipline and patience rewarded.',
        };
      }
      if (dNum === 26) {
        return {
          day: dNum,
          executed: 'Y',
          mentalState: 'stressed',
          noEntryReason: null,
          deviation: 'early_exit',
          confidence: 3,
          rating: 6,
          resultR: 0.6,
          notes: language === 'he' ? 'יציאה מוקדמת בגלל פחד לאבד את הרווח.' : 'Early exit due to fear of giving back gains.',
        };
      }
      if (dNum === 28) {
        return {
          day: dNum,
          executed: 'N',
          mentalState: 'calm',
          noEntryReason: 'discipline',
          deviation: null,
          confidence: null,
          rating: null,
          resultR: 0,
          notes: language === 'he' ? 'סוף חודש: שמרתי על הרווח החודשי ולא חיפשתי עסקאות מיותרות.' : 'End of month: Protected profits, skipped unnecessary trades.',
        };
      }

      // Safe placeholder default for other days
      return {
        day: dNum,
        executed: null,
        mentalState: null,
        noEntryReason: null,
        deviation: null,
        confidence: null,
        rating: null,
        resultR: null,
        notes: '',
      };
    });

    setDays(demoDays);
    saveToStorage(demoDays);
    showToast(t.toastSuccessSample, 'success');
    // Open end-of-month insights review modal after short delay
    setTimeout(() => {
      setShowEndOfMonthModal(true);
    }, 500);
  };

  // Action: Toggle Premium Mode (for simulation/testing by the developer)
  const handleTogglePremium = () => {
    const nextVal = !isPremium;
    setIsPremium(nextVal);
    localStorage.setItem('trading_tracker_premium', String(nextVal));
    if (nextVal && !accountName) {
      const defaultName = language === 'he' ? 'סוחר Pro' : 'Pro Trader';
      setAccountName(defaultName);
      localStorage.setItem('trading_tracker_account_name', defaultName);
    }
    showToast(nextVal ? t.toastSuccessClear : 'Simulating free account status...', 'info');
  };

  // Action: Cancel Subscription (Revert to Free mode with API notification)
  const handleCancelSubscription = (info?: CancelSubscriptionResponse) => {
    setIsPremium(false);
    localStorage.setItem('trading_tracker_premium', 'false');
    if (info) {
      localStorage.setItem('trading_tracker_cancellation_record', JSON.stringify(info));
    }
    const refText = info?.confirmationCode ? ` (#${info.confirmationCode})` : '';
    const msg = {
      he: `המנוי בוטל בהצלחה מול ספק הסליקה ולא יחויב בחודש הבא${refText}!`,
      en: `Subscription cancelled with billing provider. You will not be charged next month${refText}!`,
      ar: `تم إلغاء الاشتراك بنجاح لدى مزود الدفع ولن يتم الخصم الشهر القادم${refText}!`,
      ru: `Подписка успешно отменена у платежного провайдера и не будет списана в след. месяце${refText}!`
    }[language];
    showToast(msg, 'info');
  };

  // Action: Reactivate Subscription (Upgrade to Pro)
  const handleReactivateSubscription = () => {
    setIsPremium(true);
    localStorage.setItem('trading_tracker_premium', 'true');
    localStorage.removeItem('trading_tracker_cancellation_record');
    if (!accountName) {
      const defaultName = language === 'he' ? 'סוחר Pro' : 'Pro Trader';
      setAccountName(defaultName);
      localStorage.setItem('trading_tracker_account_name', defaultName);
    }
    const msg = {
      he: 'המנוי חודש בהצלחה! כל הפיצ׳רים נפתחו מחדש 👑',
      en: 'Subscription reactivated successfully! Pro features unlocked 👑',
      ar: 'تمت إعادة تفعيل الاشتراك بنجاح! ميزات البريميوم مفتوحة 👑',
      ru: 'Подписка успешно возобновлена! Все Pro функции разблокированы 👑'
    }[language];
    showToast(msg, 'success');
  };

  // Action: Simulate App Store IAP Purchase
  const handleSimulatePurchase = () => {
    setIsSimulatingSubPurchase(true);
    setTimeout(() => {
      setIsSimulatingSubPurchase(false);
      setIsPremium(true);
      localStorage.setItem('trading_tracker_premium', 'true');
      setShowPaywallModal(false);
      if (!accountName) {
        const defaultName = language === 'he' ? 'סוחר Pro' : 'Pro Trader';
        setAccountName(defaultName);
        localStorage.setItem('trading_tracker_account_name', defaultName);
      }
      
      const successMsg = {
        he: 'הרכישה הושלמה בהצלחה דרך ה-App Store! תודה על ההצטרפות 🚀',
        en: 'Purchase completed successfully via App Store! Thank you for joining Pro 🚀',
        ar: 'تمت عملية الشراء بنجاح عبر متجر التطبيقات! شكراً لك 🚀',
        ru: 'Покупка успешно совершена через App Store! Добро пожаловать в Pro 🚀'
      }[language];
      
      showToast(successMsg, 'success');
    }, 1800);
  };

  // Action: Clear entire month logs
  const handleClearMonth = () => {
    setShowClearConfirm(true);
  };

  const executeClearMonth = () => {
    generateFreshTemplate();
    const storageKey = `trading_tracker_data_${monthId}`;
    localStorage.removeItem(storageKey);
    if (currentUser) {
      const daysCount = getDaysInMonth(selectedYear, selectedMonth);
      const freshDays: TradingDay[] = Array.from({ length: daysCount }, (_, i) => ({
        day: i + 1,
        executed: null,
        mentalState: null,
        noEntryReason: null,
        deviation: null,
        confidence: null,
        rating: null,
        resultR: null,
        notes: '',
      }));
      saveMonthToCloud(currentUser.uid, monthId, selectedYear, selectedMonth, freshDays, currentPledge);
    }
    setShowClearConfirm(false);
    showToast(t.toastSuccessClear, 'info');
  };

  // Action: Backup / Export Current Month Data as JSON File
  const handleExportMonth = () => {
    if (!isPremium) {
      setShowPaywallModal(true);
      return;
    }
    try {
      const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(days, null, 2));
      const downloadAnchor = document.createElement('a');
      downloadAnchor.setAttribute("href", dataStr);
      downloadAnchor.setAttribute("download", `trading_journal_${monthId}.json`);
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();
      showToast(t.toastSuccessBackup, 'success');
    } catch (err) {
      showToast('Error exporting file', 'error');
    }
  };

  // Action: Restore Backup from JSON
  const handleImportMonth = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        if (Array.isArray(parsed)) {
          // Rudimentary validation of schema
          const isValid = parsed.every(item => typeof item.day === 'number');
          if (isValid) {
            setDays(parsed);
            saveToStorage(parsed);
            showToast(t.toastSuccessUpload, 'success');
          } else {
            showToast('Invalid file structure', 'error');
          }
        } else {
          showToast('Invalid backup format', 'error');
        }
      } catch (err) {
        showToast(t.toastErrorUpload, 'error');
      }
    };
    reader.readAsText(file);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  // Extra headers or labels translation
  const appLabels = {
    he: {
      subHeaderTitle: 'מרכז בקרה ומוניטיזציה',
      subHeaderDesc: 'סמלץ את מודל המנוי שלך בחנויות האפליקציות ($25 לחודש):',
      statusLabel: 'סטטוס מנוי נוכחי:',
      premiumActive: '👑 פרימיום פעיל',
      freeActive: '🔓 גרסה חינמית (חלק נעול)',
      btnFree: 'העבר למצב חינמי',
      btnPremium: 'הפעל מנוי פרימיום',
      btnGuide: 'איך להעלות ל-App Store? 📱',
      brandBadge: 'יומן מנטלי',
      brandSub: 'לזיהוי דפוסים חוזרים, מעקב סטיות ובניית יציבות פסיכולוגית',
      colTrades: 'סה"כ עסקאות',
      colDiscipline: 'ציון משמעת ממוצע',
      colPL: 'רווח/הפסד (R)',
      lblYear: 'שנה:',
      lblMonth: 'חודש:',
      btnSimulate: 'הדמיית נתונים',
      lblBackupGroup: 'גיבוי וניהול:',
      btnExport: 'ייצוא גיבוי (JSON)',
      btnImport: 'טעינת גיבוי',
      btnToggleStatsShow: 'הסתר פאנל אנליטיקה',
      btnToggleStatsHide: 'הצג פאנל אנליטיקה',
      btnReset: 'אפס נתוני חודש',
      tabTable: 'תצוגת טבלה אינטראקטיבית',
      tabCalendar: 'תצוגת לוח שנה חצי-אישי',
      calendarLockedTitle: 'תצוגת לוח השנה נעולה 📅',
      calendarLockedDesc: 'תצוגת לוח השנה המנטלי מאפשרת מעקב חזותי קליל אחר ביצועים יומיים, ציון פסיכולוגי והערות מפורטות.',
      btnUnlockCalendar: '⚡ פתח את הלוח ב-$25 לחודש',
      resetTitle: 'איפוס נתוני יומן המסחר',
      resetBody: 'האם אתה בטוח שברצונך למחוק לחלוטין את כל העסקאות, הנתונים וההערות שנרשמו לחודש זה?',
      resetWarning: '⚠️ שים לב: פעולה זו תנקה לחלוטין גם את נתוני הסימולציה והלוקאל סטורג׳ ולא ניתן יהיה לשחזרם!',
      btnConfirmReset: 'כן, מחק והתחל מחדש',
      btnCancelReset: 'בטל וחזור',
      viewGuidePaywall: 'צפה במסך הרכישה (Paywall)',
      creatorLabel: 'פותח עבור סוחרים מקצועיים',
      footerCopyright: '© 2026 לוח מעקב מסחר חודשי ממוחשב - כל הזכויות שמורות. מעקב סיכונים (R) ויציבות פסיכולוגית.',
      legendTitle: 'מקרא קיצורים והסברים על יתרונות היומן האנליטי',
      legendDevTitle: 'סטיות מהתוכנית המקורית:',
      legendDevItem1: 'כ.מוקדמת: כניסה מוקדמת לפוזיציה לפני קבלת האישור הסופי לפי תנאי האסטרטגיה.',
      legendDevItem2: 'ה.סטופ: הזזת פקודת הסטופ לוס (Stop Loss) בניגוד לחוקי התוכנית (יוצר סכנת קריסה).',
      legendDevItem3: 'ה.סיכון: הגדלת סיכון מעבר למה שנקבע מראש (R), שמפרה את ניהול הסיכונים החשבונאי.',
      legendDevItem4: 'י.מוקדמת: יציאה מוקדמת מהעסקה בפחד או בחוסר סבלנות לפני הגעה ליעד התוכנית המקורי.',
      legendSkipTitle: 'אי-כניסה לסטאפ מזהה:',
      legendSkipItem1: 'פוקוס: המניה או הסטאפ ברחו בהיעדר תשומת לב או עיכוב במסכים המקבילים.',
      legendSkipItem2: 'RR (יחס סיכון-סיכון): יחס הסיכון-סיכוי לא עמד בתנאי הסף שנקבעו לפי הסטטיסטיקה.',
      legendSkipItem3: 'משמעת: שמירה על הימנעות מכניסה לסטאפ פגום או שלא מוכן לפי חוקי העבודה הכוללים.',
      legendSkipItem4: 'פחד: היסוס ברגע האמת של ביצוע פקודה בגלל פחד להפסיד או חוסר ביטחון פנימי.',
      legendSkipItem5: 'אחר: סיבות אישיות, עייפות צבירת רצף הפסדים וכדומה.',
      legendRuleTitle: 'כללי עבודה חיוניים:',
      legendRuleBody: 'המפתח לרווחיות עקבית במסחר בשוק ההון הוא משמעת ברזל והימנעות מסטיות פסיכולוגיות. מטרת הלוח החודשי היא לשקף לך בצורה כנה את אחוז העמידה בתוכנית שלך. ככל שציון המשמעת שלך גבוה יותר, כך תוחלת הרווח השנתית שלך תשתלב עם הסטטיסטיקה של היתרון שלך.',
    },
    en: {
      subHeaderTitle: 'Developer Control & Monetization',
      subHeaderDesc: 'Simulate your app store purchase flows ($25/month subscription model):',
      statusLabel: 'Subscription State:',
      premiumActive: '👑 Pro Active',
      freeActive: '🔓 Free (Features locked)',
      btnFree: 'Demote to Free',
      btnPremium: 'Promote to Pro',
      btnGuide: 'Deployment Steps Guide 📱',
      brandBadge: 'Mental Journal',
      brandSub: 'Detect cognitive biases, control rule deviations, and secure trading consistency',
      colTrades: 'Total Trades',
      colDiscipline: 'Discipline Score',
      colPL: 'Result Net (R)',
      lblYear: 'Year:',
      lblMonth: 'Month:',
      btnSimulate: 'Simulate Data',
      lblBackupGroup: 'Data Sync:',
      btnExport: 'Export JSON Backup',
      btnImport: 'Import Backup',
      btnToggleStatsShow: 'Hide Analytics Panel',
      btnToggleStatsHide: 'Show Analytics Panel',
      btnReset: 'Reset Month',
      tabTable: 'Interactive Table view',
      tabCalendar: 'Visual Calendar view',
      calendarLockedTitle: 'Mental Calendar is Locked 📅',
      calendarLockedDesc: 'The interactive mental calendar allows you to visually log emotional sentiments, ratings, and daily lessons.',
      btnUnlockCalendar: '⚡ Unlock Calendar for $25/mo',
      resetTitle: 'Reset Monthly Logs',
      resetBody: 'Are you absolutely sure you want to permanently delete all entered trades and comments for this month?',
      resetWarning: '⚠️ Warning: This will completely wipe localStorage backup for the selected month. This cannot be undone!',
      btnConfirmReset: 'Yes, Wipe Everything',
      btnCancelReset: 'Cancel',
      viewGuidePaywall: 'View Subscription Screen (Paywall)',
      creatorLabel: 'Designed for Professional Traders',
      footerCopyright: '© 2026 Professional Trading Journal - All rights reserved. Built to track psychological trading performance.',
      legendTitle: 'Trading Metrics Legend & Performance Advantages',
      legendDevTitle: 'Rule Deviations:',
      legendDevItem1: 'Early Entry: Entering the market before setup is fully formed and confirmed.',
      legendDevItem2: 'Moved Stop: Dragging the stop-loss order against rules out of stubbornness.',
      legendDevItem3: 'Raised Risk: Increasing position size (R-unit) beyond maximum authorized rules.',
      legendDevItem4: 'Early Exit: Quitting a trade too early due to fear or anxiety before hitting target.',
      legendSkipTitle: 'No Entry Reasons:',
      legendSkipItem1: 'Focus: Asset ran away because of lack of focus or looking at too many charts.',
      legendSkipItem2: 'RR (Risk/Reward): Standard setup was valid but risk-reward multiple was poor.',
      legendSkipItem3: 'Discipline: Avoiding a trade intentionally because of bad/incomplete market conditions.',
      legendSkipItem4: 'Fear: Hesitating or freezing during execution trigger out of fear of loss.',
      legendSkipItem5: 'Other: Personal issues, fatigue, or avoiding revenge-trading cycle.',
      legendRuleTitle: 'Key Professional Habits:',
      legendRuleBody: 'The key to consistent profitability is flawless execution and absolute self-discipline. This journal visually highlights the percentage of perfect execution (No Deviations). Keeping your discipline rating close to 100% guarantees your edge plays out statistically in the long run.',
    },
    ar: {
      subHeaderTitle: 'مركز التحكم والربح للمطور',
      subHeaderDesc: 'قم بمحاكاة تدفقات المشتريات والاشتراك (25$ شهرياً):',
      statusLabel: 'حالة الاشتراك الحالية:',
      premiumActive: '👑 حساب متميز نشط',
      freeActive: '🔓 النسخة المجانية (ميزات مقפلة)',
      btnFree: 'التحويل إلى مجاني',
      btnPremium: 'تفعيل بريميوم',
      btnGuide: 'خطوات النشر بالمتجر 📱',
      brandBadge: 'دفتر تداول العقلية',
      brandSub: 'لتحديد الأنماط المتكررة، مراقبة الانحرافات وبناء استقرار الأداء',
      colTrades: 'إجمالي الصفقات',
      colDiscipline: 'معدل الانضباط',
      colPL: 'الأرباح (R)',
      lblYear: 'السنة:',
      lblMonth: 'الشهر:',
      btnSimulate: 'بيانات تجريبية',
      lblBackupGroup: 'البيانات الاحتياطية:',
      btnExport: 'تصدير نسخة JSON',
      btnImport: 'استيراد نسخة',
      btnToggleStatsShow: 'إخفاء التحليلات',
      btnToggleStatsHide: 'عرض التحليلات',
      btnReset: 'إعادة ضبط الشهر',
      tabTable: 'عرض الجدول التفاعلي',
      tabCalendar: 'عرض التقويم الذهني',
      calendarLockedTitle: 'التقويم الذهني مقفل 📅',
      calendarLockedDesc: 'يسمح لك التقويم المالي بمتابعة حالتك الذهنية والتقييمات اليومية وتدوين أهم الملاحظات بسهولة تامة.',
      btnUnlockCalendar: '⚡ افتح التقويم بـ 25$ شهرياً',
      resetTitle: 'إعادة ضبط بيانات الشهر',
      resetBody: 'هل أنت متأكد من رغبتك في حذف جميع الصفقات والبيانات المسجلة لهذا الشهر بالكامل؟',
      resetWarning: '⚠️ تنبيه: سيتم مسح البيانات بشكل كامل من الذاكرة المحلية للجهاز ولا يمكن التراجع!',
      btnConfirmReset: 'نعم، احذف كل شيء',
      btnCancelReset: 'إلغاء وتراجع',
      viewGuidePaywall: 'عرض شاشة الاشتراك (Paywall)',
      creatorLabel: 'مصمم خصيصاً للمتداولين المحترفين',
      footerCopyright: '© 2026 دفتر تداول الأداء والعقلية - جميع الحقوق محفوظة. تتبع عوائد المخاطرة (R).',
      legendTitle: 'مصطلحات التداول وفوائد الدفتر التحليلي',
      legendDevTitle: 'الانحرافות عن الخطة:',
      legendDevItem1: 'دخول مبكر: التسرع في دخول الصفقة قبل اكتمال شروط الاستراتيجية بالكامل.',
      legendDevItem2: 'تحريك الوقف: تحريك أمر وقف الخسارة عن مكانه الأساسي عناداً ومخالفة للخطة.',
      legendDevItem3: 'رفع المخاطرة: زيادة حجم العقد أو المخاطرة المسموح بها لكل صفقة.',
      legendDevItem4: 'خروج مبكر: الخروج من صفقة رابحة مبكراً بدافع القلق قبل وصول السعر للهدف.',
      legendSkipTitle: 'أسباب عدم دخول صفقات:',
      legendSkipItem1: 'التركيز: فوات الفرصة لعدم الانتباه للمنصة أو تشتت الانتباه بقراءة أخبار غير مجدية.',
      legendSkipItem2: 'العائد/المخاطرة (RR): الستاب كان جيداً لكن معدل الربح إلى الخسارة غير مقبول.',
      legendSkipItem3: 'الانضباط: الامتناع الواعي عن دخول صفقة بسبب تدهور ظروف السوق العامة.',
      legendSkipItem4: 'الخوف: التردد عند لحظة كبس الزر خشية التعرض للخسارة بعد سلسلة خسائر سابقاً.',
      legendSkipItem5: 'أخرى: ظروف خاصة، تعب وإجهاد بدني، أو تجنب صفقات الانتقام.',
      legendRuleTitle: 'عادات مهنية أساسية:',
      legendRuleBody: 'سر الربح المستمر في الأسواق هو الانضباط الصارم وتجنب القرارات العشوائية. يهدف هذا الجدول لمساعدتك في قياس نسبة التزامك بالخطة (الانضباط بنسبة 100%). كلما ارتفع معدل انضباطك، تحسنت نتائجك وجنت الصفقات أرباحاً تراكمية أعلى.',
    },
    ru: {
      subHeaderTitle: 'Контроль Разработчика и Монетизация',
      subHeaderDesc: 'Симуляция платежных сценариев в App Store ($25/мес):',
      statusLabel: 'Статус подписки:',
      premiumActive: '👑 Премиум активен',
      freeActive: '🔓 Бесплатный аккаунт',
      btnFree: 'Сделать бесплатным',
      btnPremium: 'Активировать Премиум',
      btnGuide: 'Как загрузить в App Store? 📱',
      brandBadge: 'Психо-Журнал',
      brandSub: 'Поиск паттернов, учет отклонений и формирование психологической дисциплины',
      colTrades: 'Всего сделок',
      colDiscipline: 'Ср. дисциплина',
      colPL: 'Результат (R)',
      lblYear: 'Год:',
      lblMonth: 'Месяц:',
      btnSimulate: 'Загрузить демо',
      lblBackupGroup: 'Резервные копии:',
      btnExport: 'Экспорт бэкапа (JSON)',
      btnImport: 'Импорт бэкапа',
      btnToggleStatsShow: 'Скрыть панель аналитики',
      btnToggleStatsHide: 'Показать панель аналитики',
      btnReset: 'Очистить месяц',
      tabTable: 'Интерактивная таблица',
      tabCalendar: 'Ментальный календарь',
      calendarLockedTitle: 'Календарь заблокирован 📅',
      calendarLockedDesc: 'Ментальный календарь позволяет наглядно отслеживать настроение, дневную оценку и важные заметки.',
      btnUnlockCalendar: '⚡ Открыть календарь за $25/мес',
      resetTitle: 'Очистка дневника за месяц',
      resetBody: 'Вы абсолютно уверены, что хотите стереть все сделки, оценки и комментарии за текущий месяц?',
      resetWarning: '⚠️ Внимание: это полностью очистит локальные данные на устройстве. Восстановление невозможно!',
      btnConfirmReset: 'Да, стереть всё',
      btnCancelReset: 'Отмена',
      viewGuidePaywall: 'Посмотреть окно оплаты (Paywall)',
      creatorLabel: 'Создано для профессиональных трейдеров',
      footerCopyright: '© 2026 Профессиональный Дневник Трейдера - Все права защищены. Учет рисков (R) и дисциплины.',
      legendTitle: 'Обозначения метрик и преимущества торгового анализа',
      legendDevTitle: 'Нарушения дисциплины:',
      legendDevItem1: 'Ранний Вход: преждевременное открытие сделки до подтверждения сигнала стратегией.',
      legendDevItem2: 'Двигал Стоп: перенос стоп-лосса вопреки правилам торгового плана из-за нежелания фиксировать убыток.',
      legendDevItem3: 'Завысил Риск: увеличение размера позиции (R) сверх допустимого лимита на сделку.',
      legendDevItem4: 'Ранний Выход: закрытие сделки раньше цели из-за страха, жадности или паники.',
      legendSkipTitle: 'Причины пропуска входов:',
      legendSkipItem1: 'Фокус: пропустил сигнал из-за невнимательности или отвлечения на другие активы.',
      legendSkipItem2: 'R:R (Соотношение): сигнал был, но математическое ожидание прибыли к риску было плохим.',
      legendSkipItem3: 'Дисциплина: осознанный отказ от входа из-за несоответствия внешних факторов.',
      legendSkipItem4: 'Страх: замер у терминала в момент клика из-за боязни потерять средства.',
      legendSkipItem5: 'Другое: личные обстоятельства, усталость, предотвращение тильта.',
      legendRuleTitle: 'Ключевые торговые привычки:',
      legendRuleBody: 'Секрет долгосрочной доходности — строгая дисциплина и исключение эмоциональных решений. Дневник наглядно демонстрирует ваш процент дисциплинированности (без отклонений). Держите этот показатель выше 80%, чтобы ваше математическое преимущество работало на вас.',
    }
  }[language];

  if (showLanding) {
    return (
      <LandingPage 
        onLaunchApp={() => setShowLanding(false)} 
        language={language} 
        isRtl={isRtl} 
        isPremium={isPremium} 
        onTogglePremium={handleTogglePremium} 
      />
    );
  }

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-800 pb-12 transition-all duration-300 font-sans" dir={isRtl ? 'rtl' : 'ltr'}>
      
      {/* Toast Notification Popups */}
      {notification && (
        <div 
          className={`fixed bottom-5 left-5 z-55 flex items-center gap-2.5 px-4.5 py-3.5 rounded-xl shadow-lg border text-sm leading-relaxed ${
            notification.type === 'success' 
              ? 'bg-emerald-50 text-emerald-900 border-emerald-200' 
              : notification.type === 'error'
                ? 'bg-rose-50 text-rose-900 border-rose-200'
                : 'bg-indigo-50 text-indigo-900 border-indigo-200'
          }`}
        >
          <div className="w-2 h-2 rounded-full bg-current" />
          <span>{notification.message}</span>
        </div>
      )}

      {/* Monetization & App Store Developer Control Center Panel */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-950 to-indigo-950 text-white border-b border-indigo-500/30 px-4 py-2.5 sm:px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          
          <div className="flex items-center flex-wrap gap-2 text-xs">
            <div className="inline-flex items-center gap-1.5 bg-slate-800/80 px-2.5 py-1 rounded-xl border border-slate-700">
              <span className="text-slate-400 text-[11px]">{appLabels.statusLabel}</span>
              {isPremium ? (
                <span className="text-emerald-400 font-black flex items-center gap-1">
                  {appLabels.premiumActive}
                </span>
              ) : (
                <span className="text-amber-400 font-bold flex items-center gap-1">
                  {appLabels.freeActive}
                </span>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2 self-start md:self-auto flex-wrap">
            {/* Cloud Sync Button (Phone & PC Real-Time Sync) */}
            <button
              onClick={() => setShowCloudSyncModal(true)}
              className={`inline-flex items-center gap-1.5 text-xs font-black px-3 py-1.5 rounded-xl transition-all border cursor-pointer shadow-xs ${
                currentUser
                  ? 'bg-emerald-950/70 hover:bg-emerald-900 text-emerald-300 border-emerald-500/50'
                  : 'bg-indigo-600 hover:bg-indigo-500 text-white border-indigo-400 animate-pulse'
              }`}
              title={language === 'he' ? 'סנכרון ענן בזמן אמת בין המחשב לפלאפון' : 'Real-time sync between computer and phone'}
            >
              {currentUser ? (
                <>
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping inline-block" />
                  <Cloud className="w-3.5 h-3.5 text-emerald-400" />
                  <span>{language === 'he' ? 'מסונכרן מחשב 💻 ופלאפון 📱' : 'Synced PC & Phone 📱'}</span>
                </>
              ) : (
                <>
                  <Cloud className="w-3.5 h-3.5" />
                  <span>{language === 'he' ? 'סנכרן מחשב 💻 ופלאפון 📱' : 'Sync PC & Phone 📱'}</span>
                </>
              )}
            </button>

            {/* Open Billing & Account Settings */}
            <button
              onClick={() => setShowBillingModal(true)}
              className="inline-flex items-center gap-1.5 text-xs font-extrabold px-3 py-1.5 rounded-xl transition-all border bg-slate-800 hover:bg-slate-700 text-emerald-400 hover:text-white border-slate-700 cursor-pointer shadow-xs"
            >
              <CreditCard className="w-3.5 h-3.5 text-emerald-400" />
              <span>{language === 'he' ? 'ניהול מנוי וחיובים 💳' : 'Billing & Account 💳'}</span>
            </button>

            {/* Open marketing landing page & media hub */}
            <button
              onClick={() => setShowLanding(true)}
              className="inline-flex items-center gap-1.5 text-xs font-extrabold px-3 py-1.5 rounded-xl transition-all border bg-slate-800 hover:bg-slate-700 text-indigo-300 hover:text-white border-slate-700 cursor-pointer"
            >
              <Globe className="w-3.5 h-3.5 text-indigo-400 animate-pulse" />
              <span>{language === 'he' ? 'דף נחיתה ומדיה 📱' : 'Marketing Hub 📱'}</span>
            </button>

            {/* Toggle subscription simulation */}
            <button
              onClick={handleTogglePremium}
              className={`inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-xl transition-all border cursor-pointer ${
                isPremium 
                  ? 'bg-amber-500 hover:bg-amber-600 text-slate-950 border-amber-400' 
                  : 'bg-indigo-600 hover:bg-indigo-700 text-white border-indigo-500'
              }`}
            >
              {isPremium ? <Lock className="w-3 h-3" /> : <Unlock className="w-3 h-3" />}
              <span>{isPremium ? appLabels.btnFree : appLabels.btnPremium}</span>
            </button>
          </div>

        </div>
      </div>

      {/* App Store / Google Play Premium Paywall Modal */}
      {showPaywallModal && (
        <div 
          onClick={(e) => {
            if (e.target === e.currentTarget) setShowPaywallModal(false);
          }}
          className="fixed inset-0 z-55 flex items-center justify-center p-3 sm:p-4 md:p-6 bg-slate-950/80 backdrop-blur-md select-none overflow-y-auto"
        >
          <div 
            className="bg-white rounded-3xl border border-slate-200 max-w-lg w-full shadow-2xl overflow-hidden flex flex-col max-h-[92vh] sm:max-h-[88vh] my-auto animate-fade-in" 
            dir={isRtl ? 'rtl' : 'ltr'}
          >
            
            {/* Paywall Header with Simulated Apple App Store interface */}
            <div className="bg-slate-950 text-white p-4.5 sm:p-5 relative shrink-0">
              <div className="absolute top-3.5 end-3.5">
                <button 
                  onClick={() => setShowPaywallModal(false)}
                  className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition-colors cursor-pointer text-sm font-bold"
                  aria-label="Close"
                >
                  ✕
                </button>
              </div>
              
              <div className="flex items-center gap-3.5 pt-1 pe-8">
                <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-gradient-to-tr from-indigo-500 to-indigo-600 flex items-center justify-center text-white font-black shadow-lg shadow-indigo-500/30 shrink-0 border border-indigo-400/20 text-xl sm:text-2xl">
                  📈
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-black tracking-tight text-white flex items-center gap-1.5 flex-wrap">
                    <span>Trading Journal Pro</span>
                    <span className="bg-indigo-600/40 text-indigo-300 text-[10px] px-2 py-0.5 rounded-full font-extrabold border border-indigo-500/30">PREMIUM</span>
                  </h3>
                  <p className="text-slate-400 text-xs mt-0.5 leading-relaxed line-clamp-2">{t.paywallLockedDesc}</p>
                </div>
              </div>
            </div>

            {/* Paywall Features & Pricing - Smooth internal scrolling */}
            <div className="p-4 sm:p-5.5 space-y-3.5 sm:space-y-4 flex-1 overflow-y-auto bg-slate-50/60 overscroll-contain">
              <div className="space-y-2.5">
                <div className="text-[11px] font-extrabold text-slate-400 uppercase tracking-wider">{t.paywallFeaturesTitle}</div>
                
                <div className="grid grid-cols-1 gap-2.5">
                  
                  <div className="flex items-start gap-2.5 bg-white p-3 rounded-2xl border border-slate-200/90 shadow-2xs">
                    <div className="w-7.5 h-7.5 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600 border border-indigo-100/60 shrink-0 mt-0.5">
                      <TrendingUp className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <h4 className="text-xs font-black text-slate-900">{t.paywallFeature1Title}</h4>
                      <p className="text-slate-500 text-[11px] leading-relaxed mt-0.5">{t.paywallFeature1Desc}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-2.5 bg-white p-3 rounded-2xl border border-slate-200/90 shadow-2xs">
                    <div className="w-7.5 h-7.5 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600 border border-emerald-100/60 shrink-0 mt-0.5">
                      <Calendar className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <h4 className="text-xs font-black text-slate-900">{t.paywallFeature2Title}</h4>
                      <p className="text-slate-500 text-[11px] leading-relaxed mt-0.5">{t.paywallFeature2Desc}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-2.5 bg-white p-3 rounded-2xl border border-slate-200/90 shadow-2xs">
                    <div className="w-7.5 h-7.5 rounded-xl bg-amber-50 flex items-center justify-center text-amber-600 border border-amber-100/60 shrink-0 mt-0.5">
                      <Download className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <h4 className="text-xs font-black text-slate-900">{t.paywallFeature3Title}</h4>
                      <p className="text-slate-500 text-[11px] leading-relaxed mt-0.5">{t.paywallFeature3Desc}</p>
                    </div>
                  </div>

                </div>
              </div>

              {/* 7-Day Free Trial & Pricing Box */}
              <div className="bg-gradient-to-br from-indigo-50 via-indigo-50/70 to-emerald-50/60 border-2 border-indigo-200/90 rounded-2xl p-3.5 sm:p-4 space-y-2.5 shadow-xs">
                {/* Free Trial Badge & Highlight */}
                <div className="flex items-center justify-between gap-2 flex-wrap">
                  <div className="inline-flex items-center gap-1.5 bg-emerald-500 text-white font-black text-[11px] px-3 py-1 rounded-full shadow-xs uppercase tracking-wider">
                    <Gift className="w-3.5 h-3.5" />
                    <span>{t.paywallTrialBadge}</span>
                  </div>
                  <span className="text-[11px] font-bold text-emerald-700 bg-emerald-100/70 px-2.5 py-0.5 rounded-lg border border-emerald-300">
                    {t.paywallTrialCancelAnytime}
                  </span>
                </div>

                {/* Price Display */}
                <div className="text-center py-0.5">
                  <div className="flex items-baseline justify-center gap-2">
                    <span className="text-2xl sm:text-3xl font-black text-indigo-950">$0.00</span>
                    <span className="text-emerald-600 font-extrabold text-xs sm:text-sm">
                      {language === 'he' ? 'ב-7 הימים הראשונים' : 'for the first 7 days'}
                    </span>
                  </div>
                  <div className="text-slate-500 text-[11px] font-semibold mt-0.5">
                    {language === 'he' 
                      ? 'ואחרי 7 ימי ניסיון: רק $25 לחודש (חיוב אוטומטי אלא אם בוטל)' 
                      : 'then only $25/month auto-billed unless cancelled'}
                  </div>
                </div>

                {/* 2-Step Transparent Timeline */}
                <div className="bg-white/90 backdrop-blur-xs rounded-xl p-2.5 sm:p-3 border border-indigo-100/80 space-y-2 text-[11px]">
                  <div className="flex items-start gap-2 text-slate-700">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>
                      <strong className="text-slate-900 font-bold">{language === 'he' ? 'שלב 1 (היום): ' : 'Step 1 (Today): '}</strong>
                      {t.paywallTrialTimeline1}
                    </span>
                  </div>
                  <div className="flex items-start gap-2 text-slate-700">
                    <Clock className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
                    <span>
                      <strong className="text-slate-900 font-bold">{language === 'he' ? 'שלב 2 (בעוד 7 ימים): ' : 'Step 2 (In 7 days): '}</strong>
                      {t.paywallTrialTimeline2}
                    </span>
                  </div>
                </div>

                <p className="text-slate-500 text-[10px] text-center leading-relaxed font-medium">
                  {t.paywallTrialBillingTerms}
                </p>
              </div>
            </div>

            {/* Subscription Checkout Button (Geo-IP: iCount for Israel / Payoneer for International) */}
            <div className="p-3.5 sm:p-4.5 border-t border-slate-200 bg-white text-center space-y-2.5 shrink-0 shadow-xs">
              <a
                href={geoInfo.checkoutUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => {
                  showToast(
                    geoInfo.isIsrael
                      ? (language === 'he'
                          ? 'מעביר לעמוד התשלום המאובטח של iCount (סליקה בישראל עם 7 ימי ניסיון חינם) בטאב חדש 🚀'
                          : 'Opening iCount secure checkout with 7-day free trial in a new tab 🚀')
                      : (language === 'he'
                          ? 'מעביר לעמוד התשלום המאובטח של Payoneer (עם 7 ימי ניסיון חינם) בטאב חדש 🚀'
                          : 'Opening Payoneer secure checkout with 7-day free trial in a new tab 🚀'),
                    'info'
                  );
                }}
                className="w-full py-3 sm:py-3.5 bg-gradient-to-r from-emerald-600 via-indigo-600 to-indigo-700 hover:from-emerald-700 hover:via-indigo-700 hover:to-indigo-800 text-white font-black text-xs sm:text-sm rounded-2xl shadow-lg hover:shadow-xl transition-all hover:scale-[1.01] cursor-pointer text-center flex items-center justify-center gap-2 group"
              >
                <Gift className="w-4 h-4 text-amber-300 shrink-0" />
                <span>{t.paywallBtnStart}</span>
                <ExternalLink className="w-4 h-4 text-indigo-200 group-hover:text-white transition-colors shrink-0" />
              </a>

              {/* Geo-IP Provider Info badge with fast simulation toggle */}
              <div className="flex flex-wrap items-center justify-center gap-2 text-[10px] sm:text-[11px] text-slate-500 font-medium">
                <span className="inline-flex items-center gap-1.5 bg-slate-100 text-slate-700 px-2.5 py-0.5 rounded-full border border-slate-200 font-bold">
                  <Globe className="w-3 h-3 text-indigo-600 shrink-0" />
                  <span>
                    {geoInfo.isIsrael
                      ? (language === 'he' ? 'זיהוי מיקום: ישראל (iCount 🇮🇱)' : 'Detected: Israel (iCount 🇮🇱)')
                      : (language === 'he' ? 'זיהוי מיקום: בינלאומי (Payoneer 🌐)' : 'Detected: International (Payoneer 🌐)')}
                  </span>
                </span>

                <button
                  type="button"
                  onClick={() => {
                    const next = setSimulatedCountry(geoInfo.isIsrael ? 'US' : 'IL');
                    setGeoInfo(next);
                    showToast(
                      next.isIsrael 
                        ? (language === 'he' ? 'מיקום הוגדר: ישראל 🇮🇱 (קישור iCount נטען)' : 'Location set: Israel 🇮🇱 (iCount link active)') 
                        : (language === 'he' ? 'מיקום הוגדר: בינלאומי 🌐 (קישור Payoneer נטען)' : 'Location set: International 🌐 (Payoneer link active)'),
                      'info'
                    );
                  }}
                  className="text-[10px] text-indigo-600 hover:text-indigo-800 font-semibold underline cursor-pointer"
                  title="Toggle location detection simulation"
                >
                  {geoInfo.isIsrael ? (language === 'he' ? 'החלף לגלובלי (Payoneer)' : 'Switch to Global (Payoneer)') : (language === 'he' ? 'החלף לישראל (iCount)' : 'Switch to Israel (iCount)')}
                </button>
              </div>
              
              <div className="flex flex-col sm:flex-row items-center justify-between gap-1 text-slate-400 text-[10px] px-1">
                <div className="flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                  <span>
                    {geoInfo.isIsrael
                      ? (language === 'he' ? 'סליקה מאובטחת ע״י iCount (ש״ח / כרטיסי אשראי ישראליים)' : 'Secured via iCount payment gateway')
                      : t.paywallSecuredText}
                  </span>
                </div>
                {/* Developer simulation bypass */}
                <button
                  type="button"
                  onClick={handleSimulatePurchase}
                  className="text-[10px] text-slate-400 hover:text-indigo-600 underline cursor-pointer"
                  title="Simulate instant activation for testing"
                >
                  {t.devBypassBtn}
                </button>
              </div>

              <div className="pt-1 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => {
                    setShowPaywallModal(false);
                    setShowBillingModal(true);
                  }}
                  className="text-[11px] text-indigo-600 hover:text-indigo-800 font-bold hover:underline cursor-pointer"
                >
                  {language === 'he' ? 'כבר מנוי? נהל את המנוי והחשבון שלך כאן ⚙️' : 'Already subscribed? Manage billing & account here ⚙️'}
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* Custom React Confirm Dialog for Resetting data */}
      {showClearConfirm && (
        <div className="fixed inset-0 z-55 flex items-center justify-center p-4 bg-slate-900/65 backdrop-blur-xs select-none">
          <div className="bg-white rounded-3xl border border-slate-200 max-w-sm w-full shadow-2xl p-6 sm:p-7 text-center space-y-5 animate-fade-in" dir={isRtl ? 'rtl' : 'ltr'}>
            <div className="mx-auto w-12 h-12 rounded-full bg-rose-50 flex items-center justify-center text-rose-600 border border-rose-100">
              <Trash2 className="w-6 h-6" />
            </div>
            
            <div className="space-y-2">
              <h3 className="text-base font-extrabold text-slate-950">{appLabels.resetTitle}</h3>
              <p className="text-slate-500 text-xs leading-relaxed">
                {appLabels.resetBody}
              </p>
              <p className="text-amber-600 text-[11px] font-bold bg-amber-50 rounded-lg py-1 px-2 border border-amber-100">
                {appLabels.resetWarning}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2">
              <button
                type="button"
                onClick={executeClearMonth}
                className="w-full py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-xl transition-all shadow-sm shadow-rose-100 cursor-pointer text-center"
              >
                {appLabels.btnConfirmReset}
              </button>
              <button
                type="button"
                onClick={() => setShowClearConfirm(false)}
                className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-all cursor-pointer text-center"
              >
                {appLabels.btnCancelReset}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Top Header Section bar */}
      <header className="bg-slate-900 text-white shadow-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          
          {/* Brand/Heading block */}
          <div className="flex items-center gap-3">
            <div className="bg-indigo-600 p-2.5 rounded-2xl text-white shadow-md shadow-indigo-500/30">
              <TrendingUp className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white">{t.appTitle}</h1>
                <span className="bg-slate-800 text-indigo-400 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase shrink-0">{appLabels.brandBadge}</span>
              </div>
              <p className="text-slate-400 text-xs mt-0.5 sm:mt-1 font-medium">{t.appSubtitle}</p>
            </div>
          </div>

          {/* Core Dynamic Stats shown directly in the header for "Professional Polish" */}
          <div className="flex gap-6 border-r border-l border-slate-800 px-6 py-1 mx-4 hidden lg:flex">
            <div className="text-center">
              <div className="text-[10px] text-slate-400 uppercase tracking-widest font-semibold">{appLabels.colTrades}</div>
              <div className="text-lg font-mono font-bold text-emerald-400">{executedDaysCount}</div>
            </div>
            <div className="text-center flex flex-col items-center">
              <div className="text-[10px] text-slate-400 uppercase tracking-widest font-semibold font-semibold">{appLabels.colDiscipline}</div>
              <div className="text-lg font-mono font-bold text-amber-400">{disciplineScore.toFixed(1)}</div>
            </div>
            <div className="text-center">
              <div className="text-[10px] text-slate-400 uppercase tracking-widest font-semibold font-medium">{appLabels.colPL}</div>
              <div className={`text-lg font-mono font-bold ${totalR >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                {totalR >= 0 ? `+${totalR.toFixed(1)}` : `${totalR.toFixed(1)}`}R
              </div>
            </div>
          </div>

          {/* Quick Date Selectors & Language Selectors Panel */}
          <div className="flex flex-wrap items-center gap-2.5">

            {/* User Account / Upgrade to Pro Button */}
            <button
              onClick={() => setShowBillingModal(true)}
              className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl px-2.5 py-1.5 border border-slate-700 transition-all cursor-pointer shadow-xs group"
              title={
                isPremium
                  ? (language === 'he' ? 'ניהול מנוי והגדרות חשבון' : 'Billing & Account Settings')
                  : (language === 'he' ? 'שדרוג לחשבון Pro' : 'Upgrade to Pro')
              }
            >
              <div className={`w-6 h-6 rounded-lg flex items-center justify-center text-xs font-black text-white shrink-0 shadow-xs transition-colors ${
                isPremium 
                  ? 'bg-gradient-to-tr from-amber-500 to-indigo-600' 
                  : 'bg-indigo-600 group-hover:bg-indigo-500'
              }`}>
                {isPremium ? (
                  <Crown className="w-3.5 h-3.5 text-amber-200" />
                ) : (
                  <Sparkles className="w-3.5 h-3.5 text-indigo-200" />
                )}
              </div>
              <div className="flex flex-col text-start leading-tight">
                <div className="flex items-center gap-1.5">
                  <span className="text-[11px] font-bold text-slate-200">
                    {isPremium ? (accountName || (language === 'he' ? 'סוחר Pro' : 'Pro Trader')) : (
                      language === 'he' ? 'שדרוג ל-Pro' :
                      language === 'ar' ? 'ترقية إلى Pro' :
                      language === 'ru' ? 'Перейти на Pro' :
                      'Upgrade to Pro'
                    )}
                  </span>
                  <span className={`text-[9px] font-extrabold px-1.5 py-0.2 rounded-full ${
                    isPremium ? 'bg-emerald-500/20 text-emerald-300' : 'bg-amber-500/20 text-amber-300'
                  }`}>
                    {isPremium ? 'PRO' : 'FREE'}
                  </span>
                </div>
                <span className="text-[10px] text-indigo-300 group-hover:text-indigo-200 font-medium">
                  {isPremium 
                    ? (language === 'he' ? 'מנוי פעיל 👑' : 'Active Pro 👑') 
                    : (language === 'he' ? 'הפעל מנוי ⚡' : 'Subscribe ⚡')}
                </span>
              </div>
            </button>
            
            {/* Language Selector */}
            <div className="flex items-center gap-1.5 bg-slate-800 rounded-xl px-2.5 py-1.5 border border-slate-700">
              <Globe className="w-4 h-4 text-slate-400 shrink-0" />
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value as LanguageCode)}
                className="bg-transparent border-none text-xs font-bold text-white focus:outline-none cursor-pointer"
              >
                {LANGUAGES.map(lang => (
                  <option key={lang.code} value={lang.code} className="bg-slate-900 text-white">
                    {lang.flag} {lang.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Year Selector */}
            <div className="flex items-center gap-1.5 bg-slate-800 rounded-xl px-3 py-1.5 border border-slate-700">
              <span className="text-xs text-slate-400 font-medium whitespace-nowrap">{appLabels.lblYear}</span>
              <select
                value={selectedYear}
                onChange={(e) => {
                  const val = parseInt(e.target.value, 10);
                  setSelectedYear(val);
                  localStorage.setItem('trading_tracker_selected_year', String(val));
                  localStorage.setItem('trading_tracker_last_closed_year', String(val));
                  if (currentUser) {
                    saveUserProfileToCloud(currentUser.uid, { selectedYear: val, selectedMonth });
                  }
                }}
                className="bg-transparent border-none text-sm font-bold text-white focus:outline-none cursor-pointer"
              >
                {YEARS.map(y => (
                  <option key={y} value={y} className="bg-slate-900 text-white">{y}</option>
                ))}
              </select>
            </div>

            {/* Month Selector */}
            <div className="flex items-center gap-1.5 bg-slate-800 rounded-xl px-3 py-1.5 border border-slate-700">
              <Calendar className="w-4 h-4 text-slate-400 shrink-0" />
              <span className="text-xs text-slate-400 font-medium whitespace-nowrap">{appLabels.lblMonth}</span>
              <select
                value={selectedMonth}
                onChange={(e) => {
                  const val = parseInt(e.target.value, 10);
                  setSelectedMonth(val);
                  localStorage.setItem('trading_tracker_selected_month', String(val));
                  localStorage.setItem('trading_tracker_last_closed_month', String(val));
                  if (currentUser) {
                    saveUserProfileToCloud(currentUser.uid, { selectedYear, selectedMonth: val });
                  }
                }}
                className="bg-transparent border-none text-sm font-bold text-white focus:outline-none cursor-pointer"
              >
                {MONTH_NAMES.map(m => (
                  <option key={m.id} value={m.id} className="bg-slate-900 text-white">{m.name}</option>
                ))}
              </select>
            </div>

            {/* Prepopulate Sample Data Button - only for premium users */}
            {isPremium && (
              <button
                onClick={handlePopulateSampleData}
                className="inline-flex items-center gap-1.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs px-3.5 py-1.5 rounded-xl transition-all shadow-sm cursor-pointer"
                title="Populate dynamic monthly simulation demo dataset"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>{appLabels.btnSimulate}</span>
              </button>
            )}

          </div>
        </div>
      </header>

      {/* Main Workspace Body Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8">
        
        {!isPremium ? (
          /* INITIAL FREE STATE: Interactive Video Walkthrough showing how the app works */
          <AppWalkthroughVideo 
            language={language}
            onOpenPaywall={() => setShowPaywallModal(true)}
            onTogglePremium={handleTogglePremium}
          />
        ) : (
          /* PREMIUM SUBSCRIBER STATE: Full Journal, Analytics, Data Sync, and Calendar */
          <>
            {/* Quick Utility Actions and Control bar (Save/Load Data, Reset) */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-100 shadow-xs">
              
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-slate-700">{appLabels.lblBackupGroup}</span>
                <div className="flex items-center gap-2 mt-0.5">
                  <button
                    onClick={handleExportMonth}
                    className="inline-flex items-center gap-1.5 text-slate-600 hover:text-indigo-600 text-xs font-semibold bg-slate-50 hover:bg-indigo-50 border border-slate-200/60 px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>{appLabels.btnExport}</span>
                  </button>
                  
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="inline-flex items-center gap-1.5 text-slate-600 hover:text-indigo-600 text-xs font-semibold bg-slate-50 hover:bg-indigo-50 border border-slate-200/60 px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    <span>{appLabels.btnImport}</span>
                  </button>
                  <input 
                    ref={fileInputRef}
                    type="file" 
                    accept=".json" 
                    onChange={handleImportMonth}
                    className="hidden" 
                  />

                  {/* Cloud Sync Quick Status Button */}
                  <button
                    onClick={() => setShowCloudSyncModal(true)}
                    className={`inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-lg border transition-all cursor-pointer ${
                      currentUser
                        ? 'bg-emerald-50 text-emerald-800 border-emerald-200 hover:bg-emerald-100'
                        : 'bg-indigo-50 text-indigo-700 border-indigo-200 hover:bg-indigo-100'
                    }`}
                    title={language === 'he' ? 'סנכרון ענן בזמן אמת בין המחשב לפלאפון' : 'Real-time sync between PC and phone'}
                  >
                    {currentUser ? (
                      <>
                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                        <Cloud className="w-3.5 h-3.5 text-emerald-600" />
                        <span>{language === 'he' ? 'ענן מסונכרן (מחשב ונייד)' : 'Synced (PC & Phone)'}</span>
                      </>
                    ) : (
                      <>
                        <Cloud className="w-3.5 h-3.5 text-indigo-600" />
                        <span>{language === 'he' ? 'סנכרן מחשב ופלאפון ☁️' : 'Sync to Mobile ☁️'}</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              <div className="flex items-center gap-3">
                {/* End of Month Insights & Coaching Button */}
                <button
                  onClick={() => setShowEndOfMonthModal(true)}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-700 hover:text-indigo-900 border border-indigo-300 bg-indigo-50/90 hover:bg-indigo-100 px-3 py-1.5 rounded-lg transition-all shadow-xs cursor-pointer relative"
                  title={language === 'he' ? 'צפה בתובנות מנטליות ואסטרטגיות לסוף חודש' : 'View End of Month Mental & Strategic Insights'}
                >
                  <Brain className="w-3.5 h-3.5 text-indigo-600 animate-pulse" />
                  <span>{language === 'he' ? '🧠 תובנות סוף חודש' : language === 'ar' ? '🧠 تحليلات نهاية الشهر' : language === 'ru' ? '🧠 Инсайты конца месяца' : '🧠 End of Month Insights'}</span>
                  {executedDaysCount > 0 && (
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping inline-block" />
                  )}
                </button>

                {/* Watch video walkthrough again toggle button */}
                <button
                  onClick={() => setShowWalkthroughVideo(!showWalkthroughVideo)}
                  className="inline-flex items-center gap-1.5 text-xs text-indigo-600 hover:text-indigo-700 border border-indigo-200 bg-indigo-50/70 hover:bg-indigo-100/70 px-3 py-1.5 rounded-lg font-semibold transition-colors cursor-pointer"
                >
                  <span>{showWalkthroughVideo 
                    ? (language === 'he' ? '✕ סגור סרטון הדרכה' : '✕ Hide Video') 
                    : (language === 'he' ? '🎬 צפה בסרטון ההסבר' : '🎬 Watch Video Guide')}</span>
                </button>

                {/* ShowStats state toggle button */}
                <button
                  onClick={() => setShowStats(!showStats)}
                  className="inline-flex items-center gap-1.5 text-xs text-slate-600 hover:text-slate-900 border border-slate-200 bg-slate-50 px-3 py-1.5 rounded-lg font-semibold transition-colors cursor-pointer"
                >
                  <span>{showStats ? appLabels.btnToggleStatsShow : appLabels.btnToggleStatsHide}</span>
                </button>

                {/* Clear button */}
                <button
                  onClick={handleClearMonth}
                  className="inline-flex items-center gap-1.5 text-rose-600 hover:text-rose-700 hover:bg-rose-50 text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>{appLabels.btnReset}</span>
                </button>
              </div>
            </div>

            {/* Optional video walkthrough review for Pro members */}
            {showWalkthroughVideo && (
              <div className="animate-fade-in">
                <AppWalkthroughVideo 
                  language={language}
                  onOpenPaywall={() => setShowPaywallModal(true)}
                  onTogglePremium={handleTogglePremium}
                />
              </div>
            )}

            {/* SECTION 1: Advanced Analytics Dashboard Panel */}
            {showStats && (
              <section className="relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-2 transition-all">
                <div className="animate-fade-in">
                  <StatsDashboard days={days} language={language} />
                </div>
              </section>
            )}

            {/* SECTION 2: Daily Interactive Workspace (Table or Calendar style) */}
            <section className="space-y-4">
              <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-3 border-b border-slate-100 pb-3">
                <h2 className="text-lg font-extrabold text-slate-950 flex items-center gap-2 shrink-0">
                  <FileSpreadsheet className="w-5 h-5 text-indigo-600" />
                  <span>
                    {language === 'he' ? 'יומן מעקב חודשי - ' : language === 'ar' ? 'دفتر التتبع الشهري - ' : language === 'ru' ? 'Ежемесячный журнал - ' : 'Monthly Trading Journal - '} 
                    {MONTH_NAMES.find(m => m.id === selectedMonth)?.name} {selectedYear}
                  </span>
                </h2>

                {/* Previous Month Commitment In Red (התחייבות מחודש שעבר באדום) - Only shown if written */}
                {(Boolean(currentPledge.trim()) || isEditingPledge) && (
                  <div className="flex items-center justify-center flex-1 max-w-2xl mx-0 xl:mx-4 w-full animate-fade-in">
                    {isEditingPledge ? (
                      <form 
                        onSubmit={(e) => {
                          e.preventDefault();
                          handleSavePledge(pledgeDraft);
                        }}
                        className="w-full flex items-center gap-2 bg-red-50/95 border-2 border-red-500 rounded-xl p-1.5 shadow-xs animate-fade-in"
                      >
                        <input
                          type="text"
                          value={pledgeDraft}
                          onChange={(e) => setPledgeDraft(e.target.value)}
                          placeholder={language === 'he' ? 'ההתחייבות שלך מחודש שעבר...' : 'Your commitment from last month...'}
                          className="flex-1 bg-white border border-red-200 rounded-lg px-2.5 py-1 text-xs text-red-700 font-extrabold placeholder-red-300 focus:outline-none focus:ring-1 focus:ring-red-500"
                          autoFocus
                        />
                        <button
                          type="submit"
                          className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white rounded-lg text-xs font-black transition-colors cursor-pointer shrink-0 flex items-center gap-1 shadow-2xs"
                        >
                          <Check className="w-3.5 h-3.5" />
                          <span>{language === 'he' ? 'שמור' : 'Save'}</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => setIsEditingPledge(false)}
                          className="px-2 py-1 text-slate-500 hover:text-slate-800 text-xs font-semibold cursor-pointer shrink-0"
                        >
                          {language === 'he' ? 'ביטול' : 'Cancel'}
                        </button>
                      </form>
                    ) : (
                      <div 
                        onClick={() => {
                          setPledgeDraft(currentPledge);
                          setIsEditingPledge(true);
                        }}
                        className="w-full bg-red-50/95 hover:bg-red-100/90 border border-red-300/90 rounded-xl px-3 sm:px-4 py-2 flex items-center justify-between gap-2 shadow-2xs transition-all cursor-pointer group"
                        title={language === 'he' ? 'לחץ לעריכת ההתחייבות האישית מחודש שעבר' : 'Click to edit commitment from last month'}
                      >
                        <div className="flex items-center gap-2 min-w-0">
                          <span className="w-5 h-5 rounded-md bg-red-600 text-white flex items-center justify-center shrink-0 shadow-2xs">
                            <Target className="w-3.5 h-3.5" />
                          </span>
                          <div className="truncate text-xs">
                            <span className="font-black text-red-700 me-1.5">
                              {language === 'he' ? 'התחייבות מחודש שעבר:' : language === 'ar' ? 'التزام الشهر السابق:' : language === 'ru' ? 'Обязательство с прошлого месяца:' : 'Pledge from Last Month:'}
                            </span>
                            <span className="font-black text-red-600 tracking-tight">
                              "{currentPledge}"
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center gap-1.5 text-red-400 group-hover:text-red-700 transition-colors shrink-0 ps-2">
                          <span className="text-[10px] font-bold hidden sm:inline text-red-600/80 group-hover:text-red-700">
                            {language === 'he' ? 'ערוך' : 'Edit'}
                          </span>
                          <Edit3 className="w-3.5 h-3.5" />
                        </div>
                      </div>
                    )}
                  </div>
                )}
                
                {/* View Selector Tabs */}
                <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200/50 self-start xl:self-auto shrink-0">
                  <button
                    type="button"
                    onClick={() => setActiveView('table')}
                    className={`px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      activeView === 'table'
                        ? 'bg-slate-900 text-white shadow-xs'
                        : 'text-slate-650 hover:text-slate-900 bg-transparent'
                    }`}
                  >
                    {appLabels.tabTable}
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveView('calendar')}
                    className={`px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                      activeView === 'calendar'
                        ? 'bg-slate-900 text-white shadow-xs'
                        : 'text-slate-650 hover:text-slate-900 bg-transparent'
                    }`}
                  >
                    <span>{appLabels.tabCalendar}</span>
                    <span className="text-xs">📅</span>
                  </button>
                </div>
              </div>

              {activeView === 'table' ? (
                <InteractiveTable 
                  days={days} 
                  onUpdateDay={handleUpdateDay}
                  selectedYear={selectedYear}
                  selectedMonth={selectedMonth}
                  language={language}
                  lastSelectedDay={lastSelectedDay}
                  onSelectDay={(day) => setLastSelectedDay(day)}
                />
              ) : (
                <CalendarView
                  days={days}
                  selectedYear={selectedYear}
                  selectedMonth={selectedMonth}
                  onUpdateDay={handleUpdateDay}
                  language={language}
                  lastSelectedDay={lastSelectedDay}
                  onSelectDay={(day) => setLastSelectedDay(day)}
                />
              )}
            </section>
          </>
        )}

        {/* SECTION 3: Detailed explanatory guide matching the original user guidelines */}
        <section className="bg-slate-900 text-slate-300 rounded-2xl p-6 shadow-sm border border-slate-800 space-y-4">
          <div className="flex items-center gap-2.5 pb-3 border-b border-slate-800">
            <Info className="w-5 h-5 text-indigo-400" />
            <h3 className="font-extrabold text-white text-base">{appLabels.legendTitle}</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 text-sm">
            
            <div className="space-y-2">
              <h4 className="font-bold text-white text-xs uppercase tracking-wider text-indigo-400">{appLabels.legendDevTitle}</h4>
              <ul className="space-y-1.5 text-xs text-slate-400 leading-relaxed">
                <li>{appLabels.legendDevItem1}</li>
                <li>{appLabels.legendDevItem2}</li>
                <li>{appLabels.legendDevItem3}</li>
                <li>{appLabels.legendDevItem4}</li>
              </ul>
            </div>

            <div className="space-y-2">
              <h4 className="font-bold text-white text-xs uppercase tracking-wider text-amber-400">{appLabels.legendSkipTitle}</h4>
              <ul className="space-y-1.5 text-xs text-slate-400 leading-relaxed">
                <li>{appLabels.legendSkipItem1}</li>
                <li>{appLabels.legendSkipItem2}</li>
                <li>{appLabels.legendSkipItem3}</li>
                <li>{appLabels.legendSkipItem4}</li>
                <li>{appLabels.legendSkipItem5}</li>
              </ul>
            </div>

            <div className="space-y-2">
              <h4 className="font-bold text-white text-xs uppercase tracking-wider text-rose-400">{appLabels.legendRuleTitle}</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                {appLabels.legendRuleBody}
              </p>
            </div>

          </div>
        </section>

      </main>

      {/* Compact footer */}
      <footer className="mt-8 border-t border-slate-200 py-6 text-center text-xs text-slate-400 max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
        <p>{appLabels.footerCopyright}</p>
        <button
          onClick={() => setShowBillingModal(true)}
          className="text-xs text-indigo-600 hover:text-indigo-800 font-bold hover:underline cursor-pointer flex items-center gap-1"
        >
          <CreditCard className="w-3.5 h-3.5" />
          <span>{language === 'he' ? 'ניהול מנוי וחשבון (Billing)' : 'Subscription & Billing'}</span>
        </button>
      </footer>

      {/* Account & Billing Settings Modal */}
      <AccountBillingModal
        isOpen={showBillingModal}
        onClose={() => setShowBillingModal(false)}
        isPremium={isPremium}
        onCancelSubscription={handleCancelSubscription}
        onReactivateSubscription={handleReactivateSubscription}
        accountName={accountName}
        onUpdateAccountName={handleUpdateAccountName}
        language={language}
      />

      {/* End of Month Mental & Strategic Insights Modal */}
      <EndOfMonthInsightsModal
        isOpen={showEndOfMonthModal}
        onClose={() => setShowEndOfMonthModal(false)}
        days={days}
        selectedYear={selectedYear}
        selectedMonth={selectedMonth}
        language={language}
      />

      {/* Cloud Sync (PC & Smartphone Live Synchronization) Modal */}
      <CloudSyncModal
        isOpen={showCloudSyncModal}
        onClose={() => setShowCloudSyncModal(false)}
        currentUser={currentUser}
        language={language}
        onSuccessToast={(msg) => showToast(msg, 'success')}
      />

    </div>
  );
}
