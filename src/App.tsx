/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { TradingDay } from './types';
import { StatsDashboard } from './components/StatsDashboard';
import { InteractiveTable } from './components/InteractiveTable';
import { CalendarView } from './components/CalendarView';
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
  Smartphone,
  ExternalLink,
  ShieldCheck,
  Globe,
  CreditCard,
  UserCheck
} from 'lucide-react';
import { LanguageCode, TRANSLATIONS, LANGUAGES } from './utils/translations';
import { AccountBillingModal } from './components/AccountBillingModal';
import { CancelSubscriptionResponse } from './utils/billingService';

const YEARS = [2024, 2025, 2026, 2027, 2028, 2029, 2030];
const PAYONEER_CHECKOUT_URL = 'https://link.payoneer.com/Token?t=ABB2FE3653554304AC7F081556E8CF02&src=dpl';

export default function App() {
  const [language, setLanguage] = useState<LanguageCode>(() => {
    return (localStorage.getItem('trading_tracker_lang') as LanguageCode) || 'en';
  });

  const t = TRANSLATIONS[language];
  const isRtl = language === 'he' || language === 'ar';

  // Sync HTML document direction
  useEffect(() => {
    document.documentElement.dir = t.dir;
    localStorage.setItem('trading_tracker_lang', language);
  }, [language, t.dir]);

  // Setup defaults - initial state restored from LocalStorage for seamless persistence
  const [selectedYear, setSelectedYear] = useState<number>(() => {
    const saved = localStorage.getItem('trading_tracker_selected_year');
    return saved ? parseInt(saved, 10) : 2026;
  });
  const [selectedMonth, setSelectedMonth] = useState<number>(() => {
    const saved = localStorage.getItem('trading_tracker_selected_month');
    return saved ? parseInt(saved, 10) : 6;
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

  // Subscription & Paywall States (Simulated and configured for App Store / Monetization integration)
  const [isPremium, setIsPremium] = useState<boolean>(() => {
    return localStorage.getItem('trading_tracker_premium') === 'true';
  });
  const [showPaywallModal, setShowPaywallModal] = useState<boolean>(false);
  const [showBillingModal, setShowBillingModal] = useState<boolean>(false);
  const [isSimulatingSubPurchase, setIsSimulatingSubPurchase] = useState<boolean>(false);
  const [showLanding, setShowLanding] = useState<boolean>(() => {
    const saved = localStorage.getItem('trading_tracker_show_landing');
    return saved !== null ? saved === 'true' : true;
  });

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Synchronize state preferences to LocalStorage for full session continuity
  useEffect(() => {
    localStorage.setItem('trading_tracker_selected_year', String(selectedYear));
  }, [selectedYear]);

  useEffect(() => {
    localStorage.setItem('trading_tracker_selected_month', String(selectedMonth));
  }, [selectedMonth]);

  useEffect(() => {
    localStorage.setItem('trading_tracker_active_view', activeView);
  }, [activeView]);

  useEffect(() => {
    localStorage.setItem('trading_tracker_show_landing', String(showLanding));
  }, [showLanding]);

  useEffect(() => {
    if (lastSelectedDay !== null) {
      localStorage.setItem('trading_tracker_last_day', String(lastSelectedDay));
    }
  }, [lastSelectedDay]);

  // Derive month string layout like "2026-06"
  const monthId = `${selectedYear}-${String(selectedMonth).padStart(2, '0')}`;

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

  // Auto-save State changes to LocalStorage
  const saveToStorage = (updatedDays: TradingDay[]) => {
    const storageKey = `trading_tracker_data_${monthId}`;
    localStorage.setItem(storageKey, JSON.stringify(updatedDays));
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
  };

  // Action: Toggle Premium Mode (for simulation/testing by the developer)
  const handleTogglePremium = () => {
    const nextVal = !isPremium;
    setIsPremium(nextVal);
    localStorage.setItem('trading_tracker_premium', String(nextVal));
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
      creatorLabel: 'יוצר עבור: oren71601@gmail.com',
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
      creatorLabel: 'Configured for: oren71601@gmail.com',
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
      creatorLabel: 'مخصص لـ: oren71601@gmail.com',
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
      creatorLabel: 'Создано для: oren71601@gmail.com',
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
            <span className="inline-flex items-center gap-1 bg-indigo-500/10 text-indigo-300 font-extrabold px-2.5 py-1 rounded-full border border-indigo-500/20 uppercase tracking-wider text-[10px]">
              <Smartphone className="w-3 h-3 text-indigo-400" />
              {appLabels.subHeaderTitle}
            </span>
            <span className="text-slate-300 font-medium">{appLabels.subHeaderDesc}</span>
            
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
        <div className="fixed inset-0 z-55 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-md select-none">
          <div className="bg-white rounded-3xl border border-slate-200 max-w-lg w-full shadow-2xl overflow-hidden flex flex-col" dir={isRtl ? 'rtl' : 'ltr'}>
            
            {/* Paywall Header with Simulated Apple App Store interface */}
            <div className="bg-slate-950 text-white p-6 relative">
              <div className="absolute top-4 right-4">
                <button 
                  onClick={() => setShowPaywallModal(false)}
                  className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition-colors cursor-pointer text-sm font-bold"
                >
                  ✕
                </button>
              </div>
              
              <div className="flex items-center gap-4.5 pt-2">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-indigo-500 to-indigo-600 flex items-center justify-center text-white font-black shadow-lg shadow-indigo-500/30 shrink-0 border border-indigo-400/20 text-2xl">
                  📈
                </div>
                <div>
                  <h3 className="text-lg font-black tracking-tight text-white flex items-center gap-1.5">
                    <span>Trading Journal Pro</span>
                    <span className="bg-indigo-600/30 text-indigo-400 text-[10px] px-2 py-0.5 rounded-full font-bold border border-indigo-500/20">PREMIUM</span>
                  </h3>
                  <p className="text-slate-400 text-xs mt-1 leading-relaxed">{t.paywallLockedDesc}</p>
                </div>
              </div>
            </div>

            {/* Paywall Features & Pricing */}
            <div className="p-6 sm:p-7 space-y-6 flex-1 bg-slate-50/50">
              <div className="space-y-4">
                <div className="text-xs font-bold text-slate-400 uppercase tracking-widest">{t.paywallFeaturesTitle}</div>
                
                <div className="grid grid-cols-1 gap-3">
                  
                  <div className="flex items-start gap-3 bg-white p-3 rounded-2xl border border-slate-200 shadow-2xs">
                    <div className="w-8 h-8 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600 border border-indigo-100/50 shrink-0">
                      <TrendingUp className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-xs font-extrabold text-slate-900">{t.paywallFeature1Title}</h4>
                      <p className="text-slate-500 text-[11px] leading-relaxed mt-0.5">{t.paywallFeature1Desc}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 bg-white p-3 rounded-2xl border border-slate-200 shadow-2xs">
                    <div className="w-8 h-8 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600 border border-emerald-100/50 shrink-0">
                      <Calendar className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-xs font-extrabold text-slate-900">{t.paywallFeature2Title}</h4>
                      <p className="text-slate-500 text-[11px] leading-relaxed mt-0.5">{t.paywallFeature2Desc}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 bg-white p-3 rounded-2xl border border-slate-200 shadow-2xs">
                    <div className="w-8 h-8 rounded-xl bg-amber-50 flex items-center justify-center text-amber-600 border border-amber-100/50 shrink-0">
                      <Download className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-xs font-extrabold text-slate-900">{t.paywallFeature3Title}</h4>
                      <p className="text-slate-500 text-[11px] leading-relaxed mt-0.5">{t.paywallFeature3Desc}</p>
                    </div>
                  </div>

                </div>
              </div>

              {/* Price Tag Box */}
              <div className="bg-indigo-50 border border-indigo-100 rounded-2xl p-4.5 text-center space-y-1">
                <div className="text-[11px] text-indigo-600 font-extrabold tracking-wider uppercase">{t.paywallPriceSub}</div>
                <div className="flex items-baseline justify-center gap-1">
                  <span className="text-2xl font-black text-indigo-950">$25</span>
                  <span className="text-slate-500 text-xs font-medium">{language === 'he' ? '/ לחודש' : '/ month'}</span>
                </div>
                <p className="text-slate-400 text-[10px]">{t.paywallPriceDetails}</p>
              </div>
            </div>

            {/* Payoneer Subscription Checkout Button */}
            <div className="p-6 border-t border-slate-200 bg-white text-center space-y-3">
              <a
                href={PAYONEER_CHECKOUT_URL}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => {
                  showToast(
                    language === 'he'
                      ? 'מעביר לעמוד התשלום המאובטח של Payoneer בטאב חדש 🚀'
                      : 'Opening Payoneer secure subscription checkout in a new tab 🚀',
                    'info'
                  );
                }}
                className="w-full py-3.5 bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white font-black text-sm rounded-2xl shadow-lg hover:shadow-xl transition-all hover:scale-[1.01] cursor-pointer text-center flex items-center justify-center gap-2 group"
              >
                <span>{t.paywallBtnStart}</span>
                <ExternalLink className="w-4 h-4 text-indigo-200 group-hover:text-white transition-colors shrink-0" />
              </a>
              
              <div className="flex flex-col sm:flex-row items-center justify-between gap-1.5 text-slate-400 text-[10px] px-1">
                <div className="flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                  <span>{t.paywallSecuredText}</span>
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

              <div className="pt-1.5 border-t border-slate-100 mt-2">
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

            {/* Logged-In User Account & Billing Settings Button */}
            <button
              onClick={() => setShowBillingModal(true)}
              className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl px-2.5 py-1.5 border border-slate-700 transition-all cursor-pointer shadow-xs group"
              title={language === 'he' ? 'ניהול מנוי והגדרות חשבון' : 'Billing & Account Settings'}
            >
              <div className="w-6 h-6 rounded-lg bg-indigo-600 group-hover:bg-indigo-500 flex items-center justify-center text-xs font-black text-white shrink-0 shadow-xs transition-colors">
                <CreditCard className="w-3.5 h-3.5 text-white" />
              </div>
              <div className="flex flex-col text-start leading-tight">
                <div className="flex items-center gap-1.5">
                  <span className="text-[11px] font-bold text-slate-200">oren71601</span>
                  <span className={`text-[9px] font-extrabold px-1.5 py-0.2 rounded-full ${
                    isPremium ? 'bg-emerald-500/20 text-emerald-300' : 'bg-amber-500/20 text-amber-300'
                  }`}>
                    {isPremium ? 'PRO' : 'FREE'}
                  </span>
                </div>
                <span className="text-[10px] text-indigo-300 group-hover:text-indigo-200 font-medium">
                  {language === 'he' ? 'ניהול מנוי' : 'Billing'}
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
                onChange={(e) => setSelectedYear(parseInt(e.target.value, 10))}
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
                onChange={(e) => setSelectedMonth(parseInt(e.target.value, 10))}
                className="bg-transparent border-none text-sm font-bold text-white focus:outline-none cursor-pointer"
              >
                {MONTH_NAMES.map(m => (
                  <option key={m.id} value={m.id} className="bg-slate-900 text-white">{m.name}</option>
                ))}
              </select>
            </div>

            {/* Prepopulate Sample Data Button */}
            <button
              onClick={handlePopulateSampleData}
              className="inline-flex items-center gap-1.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs px-3.5 py-1.5 rounded-xl transition-all shadow-sm cursor-pointer"
              title="Populate dynamic monthly simulation demo dataset"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>{appLabels.btnSimulate}</span>
            </button>

          </div>
        </div>
      </header>

      {/* Main Workspace Body Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8">
        
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
                onClick={() => {
                  if (!isPremium) {
                    setShowPaywallModal(true);
                  } else {
                    fileInputRef.current?.click();
                  }
                }}
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
            </div>
          </div>

          <div className="flex items-center gap-3">
            
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

        {/* SECTION 1: Advanced Analytics Dashboard Panel */}
        {showStats && (
          <section className="relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-2">
            {!isPremium ? (
              <div className="relative">
                {/* Blurred mockup of stats */}
                <div className="opacity-10 blur-md pointer-events-none select-none">
                  <StatsDashboard days={days} language={language} />
                </div>
                {/* Gorgeous Premium Paywall overlay */}
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6 bg-slate-50/50 backdrop-blur-xs">
                  <div className="bg-slate-900 text-white p-5 sm:p-6 rounded-3xl shadow-2xl border border-slate-800 max-w-md w-full space-y-4 animate-fade-in">
                    <div className="mx-auto w-12 h-12 rounded-2xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center border border-indigo-500/20">
                      <Lock className="w-5 h-5 animate-pulse" />
                    </div>
                    <div className="space-y-1.5">
                      <h4 className="text-base font-extrabold text-white">{t.paywallLockedTitle}</h4>
                      <p className="text-slate-400 text-xs leading-relaxed">
                        {t.paywallLockedDesc}
                      </p>
                    </div>
                    <div className="pt-2 flex flex-col gap-2">
                      <button
                        onClick={() => setShowPaywallModal(true)}
                        className="w-full py-2.5 bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white font-extrabold text-xs rounded-xl shadow-md cursor-pointer transition-all"
                      >
                        {t.paywallUnlockBtn}
                      </button>
                      <button
                        onClick={handleTogglePremium}
                        className="text-indigo-400 hover:text-indigo-300 text-[10px] font-bold underline cursor-pointer bg-transparent border-none"
                      >
                        {t.devBypassBtn}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="animate-fade-in">
                <StatsDashboard days={days} language={language} />
              </div>
            )}
          </section>
        )}

        {/* SECTION 2: Daily Interactive Workspace (Table or Calendar style) */}
        <section className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-slate-100 pb-3">
            <h2 className="text-lg font-extrabold text-slate-950 flex items-center gap-2">
              <FileSpreadsheet className="w-5 h-5 text-indigo-600" />
              <span>
                {language === 'he' ? 'יומן מעקב חודשי - ' : language === 'ar' ? 'دفتر التتبع الشهري - ' : language === 'ru' ? 'Ежемесячный журнал - ' : 'Monthly Trading Journal - '} 
                {MONTH_NAMES.find(m => m.id === selectedMonth)?.name} {selectedYear}
              </span>
            </h2>
            
            {/* View Selector Tabs */}
            <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200/50 self-start sm:self-auto">
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
            <div className="relative">
              {!isPremium ? (
                <div className="relative overflow-hidden rounded-2xl border border-slate-200 bg-white">
                  {/* Blurred mockup of calendar */}
                  <div className="opacity-10 blur-md pointer-events-none select-none">
                    <CalendarView
                      days={days}
                      selectedYear={selectedYear}
                      selectedMonth={selectedMonth}
                      onUpdateDay={handleUpdateDay}
                      language={language}
                      lastSelectedDay={lastSelectedDay}
                      onSelectDay={(day) => setLastSelectedDay(day)}
                    />
                  </div>
                  {/* Gorgeous Premium Paywall overlay */}
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6 bg-slate-50/50 backdrop-blur-xs">
                    <div className="bg-slate-900 text-white p-5 sm:p-6 rounded-3xl shadow-2xl border border-slate-800 max-w-md w-full space-y-4 animate-fade-in">
                      <div className="mx-auto w-12 h-12 rounded-2xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center border border-indigo-500/20">
                        <Calendar className="w-5 h-5 animate-pulse" />
                      </div>
                      <div className="space-y-1.5">
                        <h4 className="text-base font-extrabold text-white">{appLabels.calendarLockedTitle}</h4>
                        <p className="text-slate-400 text-xs leading-relaxed">
                          {appLabels.calendarLockedDesc}
                        </p>
                      </div>
                      <div className="pt-2 flex flex-col gap-2">
                        <button
                          onClick={() => setShowPaywallModal(true)}
                          className="w-full py-2.5 bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white font-extrabold text-xs rounded-xl shadow-md cursor-pointer transition-all"
                        >
                          {appLabels.btnUnlockCalendar}
                        </button>
                        <button
                          onClick={handleTogglePremium}
                          className="text-indigo-400 hover:text-indigo-300 text-[10px] font-bold underline cursor-pointer bg-transparent border-none"
                        >
                          {t.devBypassBtn}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
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
            </div>
          )}
        </section>

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
        userEmail="oren71601@gmail.com"
        language={language}
      />

    </div>
  );
}
