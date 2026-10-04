import React, { useState, useEffect } from 'react';
import { 
  TradingDay, 
  MENTAL_STATE_TRANSLATIONS, 
  MENTAL_STATE_EMOJIS, 
  DEVIATION_TRANSLATIONS,
  DEVIATION_DESCRIPTIONS
} from '../types';
import { 
  Brain, 
  Sparkles, 
  Award, 
  TrendingUp, 
  TrendingDown, 
  ShieldCheck, 
  AlertTriangle, 
  CheckCircle2, 
  Copy, 
  Download, 
  X, 
  Target, 
  Calendar, 
  Zap, 
  Flame, 
  Clock, 
  ArrowRight,
  Smile,
  Frown,
  Check,
  FileText,
  BookOpen,
  Lightbulb,
  Quote,
  AlertOctagon
} from 'lucide-react';
import { LanguageCode, TRANSLATIONS } from '../utils/translations';

interface EndOfMonthInsightsModalProps {
  isOpen: boolean;
  onClose: () => void;
  days: TradingDay[];
  selectedYear: number;
  selectedMonth: number;
  language: LanguageCode;
}

export const EndOfMonthInsightsModal: React.FC<EndOfMonthInsightsModalProps> = ({
  isOpen,
  onClose,
  days,
  selectedYear,
  selectedMonth,
  language,
}) => {
  const [copied, setCopied] = useState<boolean>(false);
  const [dontShowAgain, setDontShowAgain] = useState<boolean>(false);
  const [nextMonthPledge, setNextMonthPledge] = useState<string>('');
  const [pledgeSaved, setPledgeSaved] = useState<boolean>(false);

  const monthId = `${selectedYear}-${String(selectedMonth).padStart(2, '0')}`;
  const pledgeStorageKey = `trading_tracker_pledge_${monthId}`;

  // Load saved pledge on mount
  useEffect(() => {
    if (isOpen) {
      const saved = localStorage.getItem(pledgeStorageKey) || '';
      setNextMonthPledge(saved);
      setPledgeSaved(false);
      setCopied(false);
    }
  }, [isOpen, pledgeStorageKey]);

  if (!isOpen) return null;

  const isRtl = language === 'he' || language === 'ar';
  const t = TRANSLATIONS[language];
  const monthName = t.months[selectedMonth - 1] || `${selectedMonth}`;

  // --- Calculations ---
  const executedDays = days.filter(d => d.executed === 'Y');
  const totalTrades = executedDays.length;
  const noTradeDays = days.filter(d => d.executed === 'N');

  const profitableTrades = executedDays.filter(d => (d.resultR || 0) > 0);
  const losingTrades = executedDays.filter(d => (d.resultR || 0) < 0);
  const breakEvenTrades = executedDays.filter(d => (d.resultR || 0) === 0);

  const winRate = totalTrades > 0 ? (profitableTrades.length / totalTrades) * 100 : 0;
  const netR = executedDays.reduce((sum, d) => sum + (d.resultR || 0), 0);

  // Discipline & Deviations
  const noDeviationTrades = executedDays.filter(d => d.deviation === 'none');
  const deviatedTrades = executedDays.filter(d => d.deviation && d.deviation !== 'none');
  const disciplineScore = totalTrades > 0 ? (noDeviationTrades.length / totalTrades) * 100 : 100;

  // Comparison: R made with discipline vs R lost to deviations
  const disciplinedR = noDeviationTrades.reduce((sum, d) => sum + (d.resultR || 0), 0);
  const deviatedR = deviatedTrades.reduce((sum, d) => sum + (d.resultR || 0), 0);

  // Average Win vs Loss
  const totalWinsR = profitableTrades.reduce((sum, d) => sum + (d.resultR || 0), 0);
  const totalLossesR = Math.abs(losingTrades.reduce((sum, d) => sum + (d.resultR || 0), 0));
  const avgWinR = profitableTrades.length > 0 ? totalWinsR / profitableTrades.length : 0;
  const avgLossR = losingTrades.length > 0 ? totalLossesR / losingTrades.length : 0;
  const profitFactor = totalLossesR > 0 ? totalWinsR / totalLossesR : totalWinsR > 0 ? 99 : 0;

  // Streak calculations
  let maxWinStreak = 0;
  let currentWinStreak = 0;
  let maxLossStreak = 0;
  let currentLossStreak = 0;

  executedDays.forEach(d => {
    const r = d.resultR || 0;
    if (r > 0) {
      currentWinStreak++;
      currentLossStreak = 0;
      if (currentWinStreak > maxWinStreak) maxWinStreak = currentWinStreak;
    } else if (r < 0) {
      currentLossStreak++;
      currentWinStreak = 0;
      if (currentLossStreak > maxLossStreak) maxLossStreak = currentLossStreak;
    } else {
      currentWinStreak = 0;
      currentLossStreak = 0;
    }
  });

  // Emotional states breakdown
  const emotionsMap: Record<string, { count: number; totalR: number }> = {
    calm: { count: 0, totalR: 0 },
    stressed: { count: 0, totalR: 0 },
    tired: { count: 0, totalR: 0 },
    indifferent: { count: 0, totalR: 0 },
    revenge: { count: 0, totalR: 0 },
  };

  executedDays.forEach(d => {
    if (d.mentalState && emotionsMap[d.mentalState]) {
      emotionsMap[d.mentalState].count++;
      emotionsMap[d.mentalState].totalR += (d.resultR || 0);
    }
  });

  // Deviations breakdown
  const deviationCounts: Record<string, number> = {
    early_entry: 0,
    move_stop: 0,
    raise_risk: 0,
    early_exit: 0,
  };
  deviatedTrades.forEach(d => {
    if (d.deviation && deviationCounts[d.deviation] !== undefined) {
      deviationCounts[d.deviation]++;
    }
  });

  // Fear vs Discipline skips
  const fearSkips = noTradeDays.filter(d => d.noEntryReason === 'fear').length;
  const disciplineSkips = noTradeDays.filter(d => d.noEntryReason === 'discipline').length;

  // Ratings averages
  const ratings = executedDays.filter(d => d.rating !== null).map(d => d.rating as number);
  const avgRating = ratings.length > 0 ? ratings.reduce((a, b) => a + b, 0) / ratings.length : 0;

  const confidences = executedDays.filter(d => d.confidence !== null).map(d => d.confidence as number);
  const avgConfidence = confidences.length > 0 ? confidences.reduce((a, b) => a + b, 0) / confidences.length : 0;

  // Best weekday analysis
  const weekdayNames = language === 'he' 
    ? ['ראשון', 'שני', 'שלישי', 'רביעי', 'חמישי', 'שישי', 'שבת']
    : language === 'ar'
      ? ['الأحد', 'الإثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت']
      : language === 'ru'
        ? ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб']
        : ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const weekdayR: Record<number, { count: number; totalR: number }> = {};
  executedDays.forEach(d => {
    const dayDate = new Date(selectedYear, selectedMonth - 1, d.day);
    const dayOfWeek = dayDate.getDay();
    if (!weekdayR[dayOfWeek]) weekdayR[dayOfWeek] = { count: 0, totalR: 0 };
    weekdayR[dayOfWeek].count++;
    weekdayR[dayOfWeek].totalR += (d.resultR || 0);
  });

  let bestWeekday = -1;
  let bestWeekdayR = -Infinity;
  Object.keys(weekdayR).forEach(k => {
    const key = Number(k);
    if (weekdayR[key].count >= 2 && weekdayR[key].totalR > bestWeekdayR) {
      bestWeekdayR = weekdayR[key].totalR;
      bestWeekday = key;
    }
  });

  // --- Automated Scanner: Top 3 Lessons from Days with Negative Results (resultR < 0) ---
  interface RedDayQuote {
    day: number;
    text: string;
    r: number;
  }

  interface ScannedLesson {
    id: string;
    rank: number;
    title: string;
    categoryBadge: string;
    totalDamageR: number;
    occurrences: number;
    daysList: number[];
    quotes: RedDayQuote[];
    explanation: string;
    actionRule: string;
    color: 'rose' | 'amber' | 'indigo' | 'emerald';
  }

  // 1. Gather all negative days (resultR < 0) and any individual trades with resultR < 0
  const negativeTradesList: {
    day: number;
    r: number;
    notes: string;
    deviation: string | null;
    mentalState: string | null;
  }[] = [];

  losingTrades.forEach(d => {
    const rVal = d.resultR || 0;
    // Primary day note
    if (d.notes && d.notes.trim()) {
      negativeTradesList.push({
        day: d.day,
        r: rVal,
        notes: d.notes.trim(),
        deviation: d.deviation || null,
        mentalState: d.mentalState || null,
      });
    }

    // Individual trades on that day if present
    if (d.trades && d.trades.length > 0) {
      d.trades.forEach(tr => {
        const trR = tr.resultR || 0;
        if (trR < 0 && tr.notes && tr.notes.trim()) {
          const alreadyAdded = negativeTradesList.some(
            existing => existing.day === d.day && existing.notes === tr.notes?.trim()
          );
          if (!alreadyAdded) {
            negativeTradesList.push({
              day: d.day,
              r: trR,
              notes: tr.notes.trim(),
              deviation: tr.deviation || d.deviation || null,
              mentalState: tr.mentalState || d.mentalState || null,
            });
          }
        }
      });
    }
  });

  const redDaysWithNotesCount = losingTrades.filter(d => Boolean(d.notes && d.notes.trim())).length;
  const totalLosingDaysCount = losingTrades.length;

  // 2. Mistake definitions with comprehensive multi-language keyword scanning
  interface MistakeRuleConfig {
    key: string;
    pattern: RegExp;
    matchesDeviation?: (dev: string | null) => boolean;
    matchesMental?: (mental: string | null) => boolean;
    title: Record<LanguageCode, string>;
    categoryBadge: Record<LanguageCode, string>;
    explanation: Record<LanguageCode, string>;
    actionRule: Record<LanguageCode, string>;
    color: 'rose' | 'amber' | 'indigo';
  }

  const mistakeConfigs: MistakeRuleConfig[] = [
    {
      key: 'move_stop',
      pattern: /(?:stop|סטופ|הזזתי|הרחקתי|ביטלתי|widen|moved stop|cancel stop|стоп|בלי סטופ|ללא סטופ)/i,
      matchesDeviation: (dev) => dev === 'move_stop',
      title: {
        he: 'הזזת סטופ לוס או אי-כיבוד פקודת ההגנה',
        en: 'Moving Stop Loss or Violating Risk Cutoffs',
        ar: 'تحريك وقف الخسارة أو خرق حدود الخسارة',
        ru: 'Перенос стоп-лосса или нарушение границ риска',
      },
      categoryBadge: {
        he: 'הגנת הון',
        en: 'Capital Defense',
        ar: 'حماية رأس المال',
        ru: 'Защита капитала',
      },
      explanation: {
        he: 'הזזת הסטופ במקום לתת לשוק לאמת או לשלול את הסטאפ הפכה הפסד מתוכנן וקטן לדימום כספי מוגדל.',
        en: 'Moving the stop instead of letting the market invalidate the setup transformed a small controlled loss into a painful bleed.',
        ar: 'تحريك وقف الخسارة حول خسارة مخططة وصغيرة إلى نزيف مالي متفاقم.',
        ru: 'Сдвиг стопа вместо контролируемого выхода превратил плановый убыток в глубокую просадку.',
      },
      actionRule: {
        he: 'חוק ברזל: לאחר שליחת הפקודה, הסטופ נעול לחלוטין. קידום סטופ מותר אך ורק להגנה על רווח (Breakeven).',
        en: 'Iron Rule: Once submitted, the stop loss is completely locked. Trailing stops are only allowed to protect gains (Breakeven).',
        ar: 'قاعدة حديدية: بمجرد إدخال الصفقة، يكون وقف الخسارة ثابتًا ولا يُحرك إلا لحماية الأرباح.',
        ru: 'Железное правило: после входа стоп-лосс неприкосновенен. Разрешен только безубыток (Breakeven).',
      },
      color: 'rose',
    },
    {
      key: 'early_entry',
      pattern: /(?:early|מוקדם|טרם|לפני הזמן|איחור|fomo|פומו|נר לא נסגר|בלי אישור|חצי דקה|אימפולסיבי|רדפתי|רודף|מרדף|chase|chasing|погоня|фомо)/i,
      matchesDeviation: (dev) => dev === 'early_entry',
      title: {
        he: 'כניסה מוקדמת לפני אישור / מרדף מתוך FOMO',
        en: 'Premature Entry & FOMO Chasing',
        ar: 'دخول مبكر ومطاردة السوق (FOMO)',
        ru: 'Ранний вход и погоня за рынком (FOMO)',
      },
      categoryBadge: {
        he: 'סבלנות ואישור',
        en: 'Patience & Confirmation',
        ar: 'الصبر والتأكيد',
        ru: 'Терпение и подтверждение',
      },
      explanation: {
        he: 'קפיצה על עסקאות לפני סגירת נר אישור או מרדף אחרי מחיר שכבר יצא לדרך יצרו נקודות כניסה גרועות.',
        en: 'Jumping into trades before the candle closed or chasing runaway candles destroyed favorable risk/reward.',
        ar: 'الدخول قبل إغلاق شمعة التأكيد أو مطاردة السعر خلق نقاط دخول غير ملائمة بنسبة مخاطرة سيئة.',
        ru: 'Вход до закрытия свечи или погоня за уходящей ценой ухудшили соотношение риск/прибыль.',
      },
      actionRule: {
        he: 'חוק ברזל: המתן תמיד לסגירת נר מלאה על רמת המפתח וקבלת אישור טכני מלא לפני ביצוע.',
        en: 'Iron Rule: Always wait for the full candle close on key levels and verified confirmation before executing.',
        ar: 'قاعدة حديدية: انتظر دائمًا إغلاق الشمعة بالكامل وتأكيد الإشارة الفنية قبل الدخول.',
        ru: 'Железное правило: всегда дожидаться полного закрытия сигнальной свечи на ключевом уровне.',
      },
      color: 'amber',
    },
    {
      key: 'raise_risk',
      pattern: /(?:risk|lot|size|סיכון|לוט|מינוף|גדול מדי|הגדלתי|overleverage|ריסק|ריסק גבוה|בטוח מדי|משקל|heavy|риск)/i,
      matchesDeviation: (dev) => dev === 'raise_risk',
      title: {
        he: 'הגדלת סיכון מעבר ל-1R (מינוף יתר)',
        en: 'Oversized Risk & Excessive Sizing',
        ar: 'زيادة المخاطرة والمبالغة في حجم العقد',
        ru: 'Завышенный риск и чрезмерный размер позиции',
      },
      categoryBadge: {
        he: 'ניהול סיכונים',
        en: 'Risk Management',
        ar: 'إدارة المخاطر',
        ru: 'Управление риском',
      },
      explanation: {
        he: 'הגדלת כמות הלטים עקב ביטחון מופרז פגעה אנושות בתוצאה החודשית בדיוק בעסקאות שנכשלו.',
        en: 'Increasing position sizing due to overconfidence disproportionately harmed the account when those trades failed.',
        ar: 'زيادة حجم الصفقة بدافع الثقة المفرطة ألحقت ضررًا كبيرًا بالحساب عند خسارة الصفقة.',
        ru: 'Увеличение лота из-за ложной самоуверенности нанесло сильный удар по балансу при убытке.',
      },
      actionRule: {
        he: 'חוק ברזל: סחר אך ורק בסיכון קבוע של 1R המחושב במדויק מראש לפני כל פקודה, ללא שום חריגות.',
        en: 'Iron Rule: Trade strictly at a fixed 1R risk calculated in advance before every single order.',
        ar: 'قاعدة حديدية: التداول بمخاطرة ثابتة 1R محسوبة بدقة مسبقًا بدون أي استثناء.',
        ru: 'Железное правило: торговать строго фиксированным риском 1R, рассчитанным до каждого клика.',
      },
      color: 'rose',
    },
    {
      key: 'revenge_tilt',
      pattern: /(?:revenge|נקמה|כעס|עצבים|להחזיר|פיצוי|טילט|tilt|עסקה נוספת|בכוח|force|forced|רצף הפסדים|тильт)/i,
      matchesMental: (mental) => mental === 'revenge',
      title: {
        he: 'מסחר נקמה וניסיון להחזיר הפסד',
        en: 'Revenge Trading & Emotional Tilt',
        ar: 'التداول الانتقامي ومحاولة تعويض الخسارة',
        ru: 'Реванш-трейдинг и эмоциональный тильт',
      },
      categoryBadge: {
        he: 'חוסן מנטלי',
        en: 'Mental Resilience',
        ar: 'الانضباط النفسي',
        ru: 'Психологическая устойчивость',
      },
      explanation: {
        he: 'ניסיון לפצות מיידית על הפסד טרי גרם לכניסות חפוזות, שיפוט מעורפל והעמקת הנזק.',
        en: 'Trying to immediately claw back recent losses sparked hurried trades, impaired judgment, and deeper drawdown.',
        ar: 'محاولة تعويض الخسارة فورًا أدت إلى قرارات متسرعة وتشويش في التفكير ومضاعفة الخسائر.',
        ru: 'Попытка немедленно отыграться вызвала поспешные входы, потерю хладнокровия и рост убытков.',
      },
      actionRule: {
        he: 'חוק ברזל: חובת התרחקות מוחלטת מהמסך ל-45 דקות לפחות לאחר כל הפסד לפני פתיחת פוזיציה נוספת.',
        en: 'Iron Rule: Mandatory 45-minute cooling off period away from screens after any stop-out.',
        ar: 'قاعدة حديدية: ابتعاد إلزامي عن الشاشات لمدة 45 دقيقة على الأقل بعد أي خسارة.',
        ru: 'Железное правило: обязательный 45-минутный перерыв от графиков после любого стопа.',
      },
      color: 'rose',
    },
    {
      key: 'counter_trend',
      pattern: /(?:trend|מגמה|נגד|counter|top fish|bottom fish|נשפך|קונטרה|דשדוש|chop|against)/i,
      title: {
        he: 'מסחר נגד המגמה השלטת (ציד שיאים/תחתיות)',
        en: 'Counter-Trend Trading & Picking Extremes',
        ar: 'التداول عكس الاتجاه ومحاولة صيد القمم والقيعان',
        ru: 'Торговля против тренда и ловля разворотов',
      },
      categoryBadge: {
        he: 'מבנה שוק',
        en: 'Market Structure',
        ar: 'هيكل السوق',
        ru: 'Структура рынка',
      },
      explanation: {
        he: 'ניסיון להקדים היפוך כנגד מומנטום חזק בטיימפריים הגבוה הוביל לעצירה חוזרת בסטופ.',
        en: 'Attempting to predict tops/bottoms against strong higher-timeframe momentum repeatedly hit stops.',
        ar: 'محاولة التنبؤ بالانعكاس ضد زخم قوي في الإطار الزمني الأكبر انتهت بضرب الوقف.',
        ru: 'Попытка угадать разворот против мощного импульса старшего таймфрейма выбила стопы.',
      },
      actionRule: {
        he: 'חוק ברזל: סחר אך ורק עם כיוון המגמה והמבנה של מסגרת הזמן הגבוהה (HTF); אל תנחש היפוכים.',
        en: 'Iron Rule: Align execution strictly with higher-timeframe trend structure; never predict blind tops/bottoms.',
        ar: 'قاعدة حديدية: تداول دائمًا مع اتجاه ومبنى الإطار الزمني الأكبر (HTF) ولا تخمن القمم.',
        ru: 'Железное правило: входить строго по тренду старшего таймфрейма (HTF) без угадывания вершин.',
      },
      color: 'indigo',
    },
    {
      key: 'low_quality_setup',
      pattern: /(?:patience|boring|forced|משעמם|בכוח|איכות נמוכה|סבלנות|דחפתי|לא אידיאלי|not a\+|low quality|סתם|random)/i,
      title: {
        he: 'עסקאות כפויות בתנאי שוק נחותים (Forced Trades)',
        en: 'Forced Setups in Low Quality Market Chop',
        ar: 'صفقات مفتعلة في ظروف سوق ضعيفة',
        ru: 'Вымученные сделки в низкокачественном боковике',
      },
      categoryBadge: {
        he: 'סלקטיביות',
        en: 'Selectivity',
        ar: 'الانتقائية',
        ru: 'Избирательность',
      },
      explanation: {
        he: 'חוסר סבלנות או צורך בריגוש דחפו לכניסה בעסקאות באיכות ירודה שלא עמדו במלוא תנאי השיטה.',
        en: 'Boredom or action addiction drove entries in messy chop outside your core system rules.',
        ar: 'الملل والرغبة في الفعل دفعا إلى الدخول في صفقات ضعيفة خارج شروط الخطة الأساسية.',
        ru: 'Скука или зуд действий привели к входу в некачественные сетапы вне торговой системы.',
      },
      actionRule: {
        he: 'חוק ברזל: אם הסטאפ אינו A+ מושלם עם צ\'קליסט של 100%, הידיים נשארות על המקלדת ללא פעולה.',
        en: 'Iron Rule: If the setup is not an absolute A+ passing 100% of your checklist, preserve capital and stand aside.',
        ar: 'قاعدة حديدية: إذا لم تكن الصفقة A+ مكتملة بنسبة 100%، ابق خارج السوق فالحفاظ على الرصيد نجاح.',
        ru: 'Железное правило: если сетап не идеальный А+ по чек-листу на 100% — не открывать сделку.',
      },
      color: 'amber',
    },
    {
      key: 'news_volatility',
      pattern: /(?:news|cpi|fomc|nfp|הודעה|חדשות|תנודתיות|ספייק|spike|slippage|החלקה|נאום|speech)/i,
      title: {
        he: 'מסחר סביב הודעות מאקרו ותנודתיות חריגה',
        en: 'Trading Around High-Impact News Events',
        ar: 'التداول أثناء الأخبار الاقتصادية القوية',
        ru: 'Торговля во время важных новостных релизов',
      },
      categoryBadge: {
        he: 'סביבת מאקרו',
        en: 'Macro Environment',
        ar: 'بيئة الأخبار',
        ru: 'Макро-среда',
      },
      explanation: {
        he: 'חשיפה לאירועי מאקרו אדומים הביאה להרחבת ספראד, גלישות מחיר וספייקים חסרי כיוון.',
        en: 'Holding or initiating trades into high-impact news exposed the account to slippage and unpredictable spikes.',
        ar: 'التعرض للبيانات الاقتصادية الكبرى تسبب في انزلاقات سعرية وتقلبات عشوائية أضرت بالصفقة.',
        ru: 'Вход перед важными макроэкономическими релизами привел к проскальзыванию и непредсказуемым скачкам.',
      },
      actionRule: {
        he: 'חוק ברזל: הימנע מפתיחת עסקאות 15 דקות לפני ואחרי הודעות מאקרו בעלות השפעה גבוהה (Red Folder).',
        en: 'Iron Rule: Zero new orders within 15 minutes before or after high-impact economic releases (Red Folder).',
        ar: 'قاعدة حديدية: الامتناع عن التداول قبل 15 دقيقة وبعد صدور الأخبار ذات التأثير القوي.',
        ru: 'Железное правило: запрет на открытие позиций за 15 минут до и после важных новостей (Red Folder).',
      },
      color: 'indigo',
    },
    {
      key: 'early_exit',
      pattern: /(?:early exit|יציאה מוקדמת|חתכתי|פחד|panic|hesitat|היסוס|הייתי בפלוס|סגרתי מהר)/i,
      matchesDeviation: (dev) => dev === 'early_exit',
      title: {
        he: 'יציאה מוקדמת או סגירה ידנית מתוך חרדה',
        en: 'Anxious Early Cut & Premature Exit',
        ar: 'الخروج المبكر والإغلاق اليدوي بدافع القلق',
        ru: 'Преждевременный выход из-за тревоги',
      },
      categoryBadge: {
        he: 'ניהול עסקה',
        en: 'Trade Management',
        ar: 'إدارة الصفقة',
        ru: 'Управление сделкой',
      },
      explanation: {
        he: 'סגירה ידנית מבוהלת גרמה לחיתוך רווחים או מימוש הפסד מיותר לפני שהשוק הגיע לתנאי הפסילה.',
        en: 'Panic-closing the position cut trades prematurely before reaching actual technical invalidation levels.',
        ar: 'الإغلاق اليدوي المتسرع قطع الأرباح أو تسبب في خسائر مبكرة قبل وصول السوق لمنطقة الإلغاء.',
        ru: 'Паническое ручное закрытие обрезало прибыль или привело к выходу до системной отмены сетапа.',
      },
      actionRule: {
        he: 'חוק ברזל: תן לעסקה לנשום; התערבות ידנית מותרת אך ורק אם מודל השוק נשבר טכנית, לא לפי דופק.',
        en: 'Iron Rule: Let the trade play out; manual exit is only warranted on technical market break, never anxiety.',
        ar: 'قاعدة حديدية: دع الصفقة تتنفس ولا تتدخل يدويًا إلا عند إلغاء النموذج الفني فقط.',
        ru: 'Железное правило: давать сделке дышать; выходить вручную только при техническом сломе модели.',
      },
      color: 'amber',
    },
  ];

  // 3. Scan negative trades and group by category
  interface ScoredCategory {
    cfg: MistakeRuleConfig;
    occurrences: number;
    totalDamageR: number;
    daysList: number[];
    quotes: RedDayQuote[];
  }

  const scoredMap: Record<string, ScoredCategory> = {};
  const unclassifiedQuotes: RedDayQuote[] = [];

  negativeTradesList.forEach(item => {
    let matched = false;
    mistakeConfigs.forEach(cfg => {
      const textMatches = cfg.pattern.test(item.notes);
      const devMatches = cfg.matchesDeviation ? cfg.matchesDeviation(item.deviation) : false;
      const mentalMatches = cfg.matchesMental ? cfg.matchesMental(item.mentalState) : false;

      if (textMatches || devMatches || mentalMatches) {
        matched = true;
        if (!scoredMap[cfg.key]) {
          scoredMap[cfg.key] = {
            cfg,
            occurrences: 0,
            totalDamageR: 0,
            daysList: [],
            quotes: [],
          };
        }
        scoredMap[cfg.key].occurrences++;
        scoredMap[cfg.key].totalDamageR += Math.abs(item.r);
        if (!scoredMap[cfg.key].daysList.includes(item.day)) {
          scoredMap[cfg.key].daysList.push(item.day);
        }
        scoredMap[cfg.key].quotes.push({
          day: item.day,
          text: item.notes,
          r: item.r,
        });
      }
    });

    if (!matched) {
      unclassifiedQuotes.push({
        day: item.day,
        text: item.notes,
        r: item.r,
      });
    }
  });

  // Sort matched categories by occurrences (descending) and damage R (descending)
  const sortedScored = Object.values(scoredMap).sort((a, b) => {
    if (b.occurrences !== a.occurrences) return b.occurrences - a.occurrences;
    return b.totalDamageR - a.totalDamageR;
  });

  const finalTopLessons: ScannedLesson[] = [];

  // Add the top matched categories
  sortedScored.slice(0, 3).forEach((item, index) => {
    finalTopLessons.push({
      id: item.cfg.key,
      rank: index + 1,
      title: item.cfg.title[language] || item.cfg.title.en,
      categoryBadge: item.cfg.categoryBadge[language] || item.cfg.categoryBadge.en,
      totalDamageR: item.totalDamageR,
      occurrences: item.occurrences,
      daysList: item.daysList.sort((a, b) => a - b),
      quotes: item.quotes,
      explanation: item.cfg.explanation[language] || item.cfg.explanation.en,
      actionRule: item.cfg.actionRule[language] || item.cfg.actionRule.en,
      color: item.cfg.color,
    });
  });

  // If fewer than 3, add unclassified notes directly as custom lessons
  if (finalTopLessons.length < 3 && unclassifiedQuotes.length > 0) {
    unclassifiedQuotes.forEach(q => {
      if (finalTopLessons.length < 3) {
        finalTopLessons.push({
          id: `custom_day_${q.day}`,
          rank: finalTopLessons.length + 1,
          title: language === 'he' 
            ? `לקח מיום מסחר ${q.day}: בקרה ותיעוד` 
            : `Lesson from Day ${q.day}: Execution Review`,
          categoryBadge: language === 'he' ? 'הערת מסחר' : 'Trade Journal Note',
          totalDamageR: Math.abs(q.r),
          occurrences: 1,
          daysList: [q.day],
          quotes: [q],
          explanation: language === 'he'
            ? `מתוך התיעוד האישי שלך: "${q.text}". דפוס זה גרר הפסד של ${Math.abs(q.r).toFixed(1)}R.`
            : `From your trade journal: "${q.text}". This resulted in a -${Math.abs(q.r).toFixed(1)}R loss.`,
          actionRule: language === 'he'
            ? 'חוק ברזל: בצע בדיקה שבועית מעמיקה לסטאפ מיום זה והגדר תנאי כניסה נוקשים יותר.'
            : 'Iron Rule: Perform a weekend post-mortem review of this setup and tighten entry criteria.',
          color: 'indigo',
        });
      }
    });
  }

  // If still fewer than 3 and there are losing trades without notes, derive lessons from recorded deviations & mental states
  if (finalTopLessons.length < 3 && losingTrades.length > 0) {
    const unrepresentedRedDays = losingTrades.filter(
      d => !finalTopLessons.some(l => l.daysList.includes(d.day))
    );

    unrepresentedRedDays.forEach(d => {
      if (finalTopLessons.length < 3) {
        const rLoss = Math.abs(d.resultR || 1.0);
        const dev = d.deviation;
        const mental = d.mentalState;

        let derivedTitle = language === 'he' ? `הגנת הון ביום ${d.day}` : `Capital Defense on Day ${d.day}`;
        let derivedRule = language === 'he' 
          ? 'חוק ברזל: הקפד לרשום הערה קצרה בכל יום אדום כדי לאתר דפוסי כשל חוזרים.' 
          : 'Iron Rule: Always record a note on red days to identify recurring leaks.';

        if (dev && dev !== 'none') {
          derivedTitle = language === 'he' ? `חריגת משמעת (${dev}) ביום ${d.day}` : `Discipline Deviation (${dev}) on Day ${d.day}`;
          derivedRule = language === 'he' ? 'חוק ברזל: היצמד לתוכנית המסחר והימנע מכל חריגה.' : 'Iron Rule: Stick strictly to your written plan.';
        } else if (mental && mental === 'revenge') {
          derivedTitle = language === 'he' ? `מצב מנטלי (נקמה) ביום ${d.day}` : `Revenge Mindset on Day ${d.day}`;
          derivedRule = language === 'he' ? 'חוק ברזל: עצור מסחר מיידית עם הופעת דחף לנקום בשוק.' : 'Iron Rule: Cease trading immediately upon emotional tilt.';
        }

        finalTopLessons.push({
          id: `derived_day_${d.day}`,
          rank: finalTopLessons.length + 1,
          title: derivedTitle,
          categoryBadge: language === 'he' ? 'ניתוח ביצוע' : 'Execution Log',
          totalDamageR: rLoss,
          occurrences: 1,
          daysList: [d.day],
          quotes: d.notes ? [{ day: d.day, text: d.notes, r: d.resultR || 0 }] : [],
          explanation: language === 'he'
            ? `יום מסחר עם תוצאה שלילית של -${rLoss.toFixed(1)}R. זיהוי מוקדם של גורמי ההפסד מאפשר עצירת דימום מהירה.`
            : `Trading day ending at -${rLoss.toFixed(1)}R. Early detection stops ongoing leakages.`,
          actionRule: derivedRule,
          color: 'amber',
        });
      }
    });
  }

  // If still fewer than 3 (e.g. 0 losing trades this entire month!):
  if (finalTopLessons.length === 0) {
    finalTopLessons.push(
      {
        id: 'no_loss_1',
        rank: 1,
        title: language === 'he' ? 'שימור הצניעות והמשמעת במומנטום חיובי' : 'Maintain Humility During Winning Streaks',
        categoryBadge: language === 'he' ? 'חוסן מנטלי' : 'Mental Resilience',
        totalDamageR: 0,
        occurrences: 0,
        daysList: [],
        quotes: [],
        explanation: language === 'he'
          ? 'אפס ימי הפסד החודש! הסכנה הגדולה ביותר לאחר רצף הצלחות היא ביטחון עודף והגדלת סיכון.'
          : 'Zero losing days this month! The biggest danger after winning streaks is overconfidence and sizing inflation.',
        actionRule: language === 'he'
          ? 'חוק ברזל: שמור על אותו גודל פוזיציה מדויק ואל תרשה לאופוריה לשנות את כללי הכניסה.'
          : 'Iron Rule: Keep the exact same risk sizing and never let euphoria loosen your entry standards.',
        color: 'emerald',
      },
      {
        id: 'no_loss_2',
        rank: 2,
        title: language === 'he' ? 'הגנה קפדנית על סטופ לוס גם בעסקאות בטוחות' : 'Never Compromise Stop Loss Sizing',
        categoryBadge: language === 'he' ? 'הגנת הון' : 'Capital Defense',
        totalDamageR: 0,
        occurrences: 0,
        daysList: [],
        quotes: [],
        explanation: language === 'he'
          ? 'שמירה על הסטופים היא הסיבה המרכזית לחודש נקי. המשך לקבע את גבול ההפסד בכל עסקה.'
          : 'Strict stop placement is why your month was clean. Keep locking in invalidation levels.',
        actionRule: language === 'he'
          ? 'חוק ברזל: שום עסקה אינה פטורה מפקודת הגנה (Stop Loss) המוזנת מראש במערכת.'
          : 'Iron Rule: No trade is ever placed without a pre-set protective stop loss order.',
        color: 'emerald',
      },
      {
        id: 'no_loss_3',
        rank: 3,
        title: language === 'he' ? 'התמדה בתיעוד הערות מפורטות לכל יום מסחר' : 'Consistent Daily Post-Trade Journaling',
        categoryBadge: language === 'he' ? 'משמעת תיעוד' : 'Journaling Discipline',
        totalDamageR: 0,
        occurrences: 0,
        daysList: [],
        quotes: [],
        explanation: language === 'he'
          ? 'תיעוד שוטף של מחשבות, תחושות וביצוע הוא המפתח לשכפול הצלחות לאורך זמן.'
          : 'Consistent logging of thoughts and execution is key to replicating sustained profitability.',
        actionRule: language === 'he'
          ? 'חוק ברזל: מלא הערה קצרה לכל עסקה בטבלה - הן ברווח והן בהפסד.'
          : 'Iron Rule: Always write a brief note for every executed session in your journal.',
        color: 'emerald',
      }
    );
  }

  // --- Dynamic Improvement Directives for Next Month ---
  const improvementDirectives: { title: string; desc: string; icon: any; color: string }[] = [];

  // Directive 1: Moving Stop Loss
  if (deviationCounts.move_stop > 0) {
    improvementDirectives.push({
      title: language === 'he' ? 'חוק ברזל: נעילת סטופ בלתי נגיש' : 'Iron Rule: Inviolable Stop Loss',
      desc: language === 'he' 
        ? `ביצעת ${deviationCounts.move_stop} פעמים הזזת סטופ בניגוד לתוכנית. לחודש הבא: ברגע שהעסקה נפתחת, אסור להרחיק את הסטופ בשום פנים. קידום סטופ מותר אך ורק להגנה (Breakeven).`
        : `You moved stop loss ${deviationCounts.move_stop} times. For next month: never widen your stop under any circumstances.`,
      icon: AlertTriangle,
      color: 'rose'
    });
  }

  // Directive 2: Revenge Trading
  if (emotionsMap.revenge.count > 0) {
    improvementDirectives.push({
      title: language === 'he' ? 'פרוטוקול צינון נגד מסחר נקמה' : 'Cooling Protocol Against Revenge Trading',
      desc: language === 'he'
        ? `ביצעת ${emotionsMap.revenge.count} עסקאות מתוך נקמה/כעס (תוצאה: ${emotionsMap.revenge.totalR.toFixed(1)}R). לחודש הבא: חובה לקחת הפסקה של 45 דקות מהמסך לאחר כל הפסד.`
        : `You took ${emotionsMap.revenge.count} revenge trades (${emotionsMap.revenge.totalR.toFixed(1)}R). Take a mandatory 45-min break after every loss.`,
      icon: Flame,
      color: 'amber'
    });
  }

  // Directive 3: Early Entry / FOMO
  if (deviationCounts.early_entry > 0) {
    improvementDirectives.push({
      title: language === 'he' ? 'אישור נר מלא לפני קליק' : 'Wait for Full Candle Close',
      desc: language === 'he'
        ? `נרשמו ${deviationCounts.early_entry} כניסות מוקדמות לפני אישור. לחודש הבא: המתן תמיד לסגירת הנר על רמת המפתח לפני פתיחת פקודה.`
        : `Recorded ${deviationCounts.early_entry} early entries. Always wait for the candle close confirmation.`,
      icon: Clock,
      color: 'indigo'
    });
  }

  // Directive 4: Raised Risk
  if (deviationCounts.raise_risk > 0) {
    improvementDirectives.push({
      title: language === 'he' ? 'משמעת סיכון אחיד 1R' : 'Strict 1R Fixed Risk Position',
      desc: language === 'he'
        ? `הגדלת סיכון ${deviationCounts.raise_risk} פעמים מעבר לתוכנית. לחודש הבא: סחר בגודל סיכון קבוע של 1R בלבד כדי להבטיח שרידות מתמטית.`
        : `Raised risk ${deviationCounts.raise_risk} times. Stick strictly to 1R fixed sizing per trade.`,
      icon: Target,
      color: 'rose'
    });
  }

  // Directive 5: Fear Skips
  if (fearSkips >= 2) {
    improvementDirectives.push({
      title: language === 'he' ? 'הפחתת גודל הסיכון להורדת חרדה' : 'Reduce Risk Size to Neutralize Fear',
      desc: language === 'he'
        ? `נמנעת מ-${fearSkips} עסקאות תקפות מתוך פחד. שקול לחתוך את הסיכון הכספי לחצי עד שהביצוע הטכני יהפוך לאוטומטי ונטול היסוס.`
        : `Skipped ${fearSkips} valid setups due to fear. Cut dollar risk in half until execution becomes effortless.`,
      icon: ShieldCheck,
      color: 'amber'
    });
  }

  // If few or no violations, positive reinforcement:
  if (improvementDirectives.length === 0) {
    improvementDirectives.push({
      title: language === 'he' ? 'שימור המומנטום והרחבת היתרון' : 'Sustain Momentum & Expand Edge',
      desc: language === 'he'
        ? `הפגנת שליטה מנטלית מעולה עם ${disciplineScore.toFixed(0)}% עמידה בתוכנית! לחודש הבא: התמקד בסבלנות לתת לעסקאות המנצחות להגיע ליעדי R מלאים.`
        : `Excellent mental discipline (${disciplineScore.toFixed(0)}% adherence)! Focus on letting winning trades reach maximum target R.`,
      icon: Award,
      color: 'emerald'
    });
  }

  // Handle closing modal
  const handleClose = () => {
    if (dontShowAgain) {
      localStorage.setItem(`eom_popup_seen_${monthId}`, 'true');
    }
    onClose();
  };

  const handleSavePledge = () => {
    localStorage.setItem(pledgeStorageKey, nextMonthPledge);
    window.dispatchEvent(new Event('pledge_updated'));
    setPledgeSaved(true);
    setTimeout(() => setPledgeSaved(false), 3000);
  };

  // Copy report to clipboard
  const handleCopySummary = () => {
    const report = `📊 ${language === 'he' ? 'סיכום סוף חודש' : 'Monthly Trading Insights'} (${monthName} ${selectedYear})
━━━━━━━━━━━━━━━━━━━━━━━━━━
💰 ${language === 'he' ? 'מאזן נטו R' : 'Net R'}: ${netR >= 0 ? `+${netR.toFixed(2)}R` : `${netR.toFixed(2)}R`}
🎯 Win Rate: ${winRate.toFixed(1)}% (${profitableTrades.length}/${totalTrades})
🛡️ ${language === 'he' ? 'ציון משמעת' : 'Discipline Score'}: ${disciplineScore.toFixed(1)}%
⚖️ Profit Factor: ${profitFactor.toFixed(2)} | Avg Win: +${avgWinR.toFixed(2)}R | Avg Loss: -${avgLossR.toFixed(2)}R

🧠 ${language === 'he' ? 'תובנה פסיכולוגית מכרעת' : 'Key Psychological Insight'}:
• ${language === 'he' ? 'רווח מעסקאות ממושמעות (ללא חריגה)' : 'Disciplined Trades Profit'}: ${disciplinedR >= 0 ? `+${disciplinedR.toFixed(1)}R` : `${disciplinedR.toFixed(1)}R`}
• ${language === 'he' ? 'נזק מחריגות מהתוכנית' : 'Damage from Deviations'}: ${deviatedR.toFixed(1)}R (${deviatedTrades.length} ${language === 'he' ? 'חריגות' : 'deviations'})

📖 ${language === 'he' ? '3 הלקחים המובילים מימי הפסד (ניתוח הערות)' : 'Top 3 Lessons from Red Days (Notes Analysis)'}:
${finalTopLessons.map(l => `${l.rank}. [${l.categoryBadge}] ${l.title} (${l.occurrences > 0 ? `${l.occurrences} ${language === 'he' ? 'ימים' : 'days'}, -${l.totalDamageR.toFixed(1)}R` : (language === 'he' ? 'שימור הצלחה' : 'Edge preservation')})\n${l.quotes.length > 0 ? `   💬 "${l.quotes[0].text}" (${language === 'he' ? 'יום' : 'Day'} ${l.quotes[0].day})\n` : ''}   💡 ${l.actionRule}`).join('\n')}

🚀 ${language === 'he' ? 'חוקי ברזל לחודש הבא' : 'Directives for Next Month'}:
${improvementDirectives.map((d, i) => `${i + 1}. ${d.title}: ${d.desc}`).join('\n')}

${nextMonthPledge ? `📝 ${language === 'he' ? 'ההתחייבות האישית שלי' : 'My Personal Pledge'}: "${nextMonthPledge}"` : ''}`;

    navigator.clipboard.writeText(report);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  // Download report as file
  const handleDownloadReport = () => {
    const reportText = `MONTHLY TRADING MENTAL & STRATEGIC INSIGHTS
Month: ${monthName} ${selectedYear}
Generated: ${new Date().toLocaleDateString()}

========================================
1. CORE PERFORMANCE METRICS
========================================
Total Executed Trades: ${totalTrades}
Profitable Trades: ${profitableTrades.length} (${winRate.toFixed(1)}%)
Losing Trades: ${losingTrades.length}
Break-Even Trades: ${breakEvenTrades.length}
Net R Result: ${netR >= 0 ? `+${netR.toFixed(2)}R` : `${netR.toFixed(2)}R`}
Profit Factor: ${profitFactor.toFixed(2)}
Average Win: +${avgWinR.toFixed(2)}R
Average Loss: -${avgLossR.toFixed(2)}R
Max Win Streak: ${maxWinStreak} trades
Max Loss Streak: ${maxLossStreak} trades
Average Trade Quality Rating: ${avgRating.toFixed(1)} / 10
Average Trade Confidence: ${avgConfidence.toFixed(1)} / 5

========================================
2. PSYCHOLOGICAL & DISCIPLINE ANALYSIS
========================================
Discipline Score: ${disciplineScore.toFixed(1)}%
Trades Without Deviations: ${noDeviationTrades.length}
Trades With Deviations: ${deviatedTrades.length}

THE COST OF EMOTIONS:
- Result on 100% disciplined trades: ${disciplinedR >= 0 ? `+${disciplinedR.toFixed(2)}R` : `${disciplinedR.toFixed(2)}R`}
- Result on deviated trades: ${deviatedR >= 0 ? `+${deviatedR.toFixed(2)}R` : `${deviatedR.toFixed(2)}R`}
${deviatedR < 0 ? `-> Deviations cost you ${Math.abs(deviatedR).toFixed(2)}R this month!` : ''}

DEVIATION DETAILS:
- Early Entry: ${deviationCounts.early_entry}
- Moved Stop Loss: ${deviationCounts.move_stop}
- Raised Risk: ${deviationCounts.raise_risk}
- Early Exit: ${deviationCounts.early_exit}

EMOTIONAL STATES:
- Calm: ${emotionsMap.calm.count} trades (${emotionsMap.calm.totalR >= 0 ? '+' : ''}${emotionsMap.calm.totalR.toFixed(1)}R)
- Stressed: ${emotionsMap.stressed.count} trades (${emotionsMap.stressed.totalR >= 0 ? '+' : ''}${emotionsMap.stressed.totalR.toFixed(1)}R)
- Tired: ${emotionsMap.tired.count} trades (${emotionsMap.tired.totalR >= 0 ? '+' : ''}${emotionsMap.tired.totalR.toFixed(1)}R)
- Revenge: ${emotionsMap.revenge.count} trades (${emotionsMap.revenge.totalR >= 0 ? '+' : ''}${emotionsMap.revenge.totalR.toFixed(1)}R)

========================================
3. TOP 3 LESSONS FROM RED DAYS (NOTES SCAN)
========================================
Scanned notes from days with negative results (resultR < 0): ${redDaysWithNotesCount} note(s) found across ${totalLosingDaysCount} losing session(s).

${finalTopLessons.map(l => `LESSON #${l.rank}: ${l.title} [${l.categoryBadge}]
Impact: -${l.totalDamageR.toFixed(2)}R across ${l.occurrences} day(s) ${l.daysList.length > 0 ? `(Days: ${l.daysList.join(', ')})` : ''}
Diagnosis: ${l.explanation}
${l.quotes.map(q => `-> Quoted Note (Day ${q.day}, ${q.r}R): "${q.text}"`).join('\n')}
Actionable Rule for Next Month:
=> ${l.actionRule}
`).join('\n')}
========================================
4. ACTIONABLE STRATEGIC DIRECTIVES FOR NEXT MONTH
========================================
${improvementDirectives.map((d, i) => `${i + 1}. [${d.title}]\n   ${d.desc}\n`).join('\n')}

========================================
5. TRADER'S COMMITMENT & PLEDGE
========================================
${nextMonthPledge ? nextMonthPledge : '(No pledge written yet)'}
`;

    const blob = new Blob([reportText], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `trading-insights-${monthId}.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-55 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto animate-fade-in">
      <div 
        className="bg-white rounded-3xl border border-slate-200 max-w-3xl w-full shadow-2xl overflow-hidden my-auto flex flex-col max-h-[92vh]"
        dir={isRtl ? 'rtl' : 'ltr'}
      >
        
        {/* Header with gradient badge and title */}
        <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-indigo-950 text-white p-5 sm:p-6 border-b border-indigo-500/30 relative shrink-0">
          
          <button
            onClick={handleClose}
            className="absolute top-4 left-4 sm:top-5 sm:left-5 text-slate-400 hover:text-white bg-slate-800/80 hover:bg-slate-700 p-2 rounded-xl transition-colors cursor-pointer"
            title={language === 'he' ? 'סגור' : 'Close'}
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2 mb-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-bold border border-indigo-400/30">
              <Brain className="w-3.5 h-3.5 text-indigo-400" />
              <span>{language === 'he' ? 'דו"ח אימון ותובנות סוף חודש' : 'End of Month Coaching & Insights'}</span>
            </span>
            <span className="text-xs text-slate-400 font-mono">
              {monthName} {selectedYear}
            </span>
          </div>

          <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
            {language === 'he' ? 'תובנות מנטליות ואסטרטגיות לשיפור הרווחיות' : 'Mental Insights & Strategic Improvement'}
          </h2>

          <p className="text-slate-300 text-xs sm:text-sm mt-1 max-w-xl">
            {language === 'he' 
              ? 'ניתוח פסיכולוגי עמוק של העסקאות שלך, מחיר החריגות מתוכנית המסחר, והמלצות ברורות לחודש הבא.'
              : 'Deep psychological review of your executed trades, deviation costs, and custom directives for next month.'}
          </p>

          {/* Quick Metrics Bar in Header */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-4 pt-3 border-t border-slate-800/80">
            <div className="bg-slate-900/90 rounded-xl p-2.5 border border-slate-800">
              <div className="text-[10px] text-slate-400 font-medium">
                {language === 'he' ? 'תוצאה חודשית' : 'Monthly Result'}
              </div>
              <div className={`text-base font-black font-mono ${netR >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                {netR >= 0 ? `+${netR.toFixed(2)}R` : `${netR.toFixed(2)}R`}
              </div>
            </div>

            <div className="bg-slate-900/90 rounded-xl p-2.5 border border-slate-800">
              <div className="text-[10px] text-slate-400 font-medium">
                {language === 'he' ? 'ציון משמעת' : 'Discipline Score'}
              </div>
              <div className={`text-base font-black font-mono ${disciplineScore >= 80 ? 'text-emerald-400' : disciplineScore >= 60 ? 'text-amber-400' : 'text-rose-400'}`}>
                {disciplineScore.toFixed(0)}%
              </div>
            </div>

            <div className="bg-slate-900/90 rounded-xl p-2.5 border border-slate-800">
              <div className="text-[10px] text-slate-400 font-medium">
                {language === 'he' ? 'אחוז הצלחה' : 'Win Rate'}
              </div>
              <div className="text-base font-black font-mono text-indigo-300">
                {winRate.toFixed(1)}% <span className="text-[10px] text-slate-400">({profitableTrades.length}/{totalTrades})</span>
              </div>
            </div>

            <div className="bg-slate-900/90 rounded-xl p-2.5 border border-slate-800">
              <div className="text-[10px] text-slate-400 font-medium">
                {language === 'he' ? 'פקטור רווח (PF)' : 'Profit Factor'}
              </div>
              <div className="text-base font-black font-mono text-amber-300">
                {profitFactor > 90 ? '∞' : profitFactor.toFixed(2)}
              </div>
            </div>
          </div>

        </div>

        {/* Scrollable Body Content */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-6 text-start">

          {/* Section 1: The Dramatic Cost of Deviations */}
          <div className="bg-slate-50 rounded-2xl p-4 sm:p-5 border border-slate-200/80 space-y-3">
            <div className="flex items-center gap-2">
              <span className="w-8 h-8 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center font-bold text-sm">
                ⚖️
              </span>
              <div>
                <h3 className="text-sm sm:text-base font-black text-slate-900">
                  {language === 'he' ? 'מחיר הרגשות: מסחר ממושמע מול חריגות' : 'The Emotional Cost: Discipline vs Deviations'}
                </h3>
                <p className="text-[11px] sm:text-xs text-slate-500">
                  {language === 'he' 
                    ? 'ההבדל המתמטי בין שמירה מדויקת על הכללים לבין כניסה מפחד, הזזת סטופ או הגדלת לוט.'
                    : 'The direct math between following your plan vs emotional impulsive actions.'}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              
              {/* Disciplined Result Card */}
              <div className="bg-white rounded-xl p-3.5 border border-emerald-200 shadow-xs">
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="font-bold text-emerald-800 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>{language === 'he' ? 'עסקאות ללא חריגה (100% משמעת)' : 'Clean Disciplined Trades'}</span>
                  </span>
                  <span className="font-mono text-xs font-extrabold text-emerald-600">{noDeviationTrades.length} {language === 'he' ? 'עסקאות' : 'trades'}</span>
                </div>
                <div className="text-xl font-black font-mono text-emerald-600">
                  {disciplinedR >= 0 ? `+${disciplinedR.toFixed(2)}R` : `${disciplinedR.toFixed(2)}R`}
                </div>
                <p className="text-[11px] text-slate-500 mt-1">
                  {language === 'he' ? 'זהו הרווח האמיתי שהאסטרטגיה שלך מייצרת כשאינך מתערב לה!' : 'This is your system true mathematical edge!'}
                </p>
              </div>

              {/* Deviated Result Card */}
              <div className="bg-white rounded-xl p-3.5 border border-rose-200 shadow-xs">
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="font-bold text-rose-800 flex items-center gap-1">
                    <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
                    <span>{language === 'he' ? 'עסקאות עם חריגות מהתוכנית' : 'Trades With Deviations'}</span>
                  </span>
                  <span className="font-mono text-xs font-extrabold text-rose-600">{deviatedTrades.length} {language === 'he' ? 'עסקאות' : 'trades'}</span>
                </div>
                <div className={`text-xl font-black font-mono ${deviatedR >= 0 ? 'text-slate-700' : 'text-rose-600'}`}>
                  {deviatedR >= 0 ? `+${deviatedR.toFixed(2)}R` : `${deviatedR.toFixed(2)}R`}
                </div>
                <p className="text-[11px] text-slate-500 mt-1">
                  {deviatedR < 0 
                    ? (language === 'he' ? `החריגות מחקו לך ${Math.abs(deviatedR).toFixed(1)}R מהחשבון!` : `Deviations destroyed ${Math.abs(deviatedR).toFixed(1)}R!`)
                    : (language === 'he' ? 'גם אם לא הפסדת כאן, חריגות הן פצצת זמן מתקתקת.' : 'Even if positive, deviations are a ticking bomb.')}
                </p>
              </div>

            </div>
          </div>

          {/* Section 2: Emotional States & Behavioral Triggers */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Brain className="w-4 h-4 text-indigo-600" />
              <h3 className="text-sm sm:text-base font-black text-slate-900">
                {language === 'he' ? 'ניתוח מצבי רוח וטריגרים רגשיים' : 'Emotional States & Mental Triggers'}
              </h3>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-center text-xs">
              
              {/* Calm */}
              <div className="bg-emerald-50/70 border border-emerald-200 rounded-xl p-2.5">
                <div className="text-base">🧘‍♂️</div>
                <div className="font-bold text-emerald-900 text-[11px] mt-1">{language === 'he' ? 'רגוע' : 'Calm'}</div>
                <div className="text-[10px] text-slate-500">{emotionsMap.calm.count} {language === 'he' ? 'עסקאות' : 'trades'}</div>
                <div className={`font-mono font-black text-xs mt-0.5 ${emotionsMap.calm.totalR >= 0 ? 'text-emerald-700' : 'text-rose-600'}`}>
                  {emotionsMap.calm.totalR >= 0 ? `+${emotionsMap.calm.totalR.toFixed(1)}R` : `${emotionsMap.calm.totalR.toFixed(1)}R`}
                </div>
              </div>

              {/* Stressed */}
              <div className="bg-amber-50/70 border border-amber-200 rounded-xl p-2.5">
                <div className="text-base">😰</div>
                <div className="font-bold text-amber-900 text-[11px] mt-1">{language === 'he' ? 'לחוץ' : 'Stressed'}</div>
                <div className="text-[10px] text-slate-500">{emotionsMap.stressed.count} {language === 'he' ? 'עסקאות' : 'trades'}</div>
                <div className={`font-mono font-black text-xs mt-0.5 ${emotionsMap.stressed.totalR >= 0 ? 'text-emerald-700' : 'text-rose-600'}`}>
                  {emotionsMap.stressed.totalR >= 0 ? `+${emotionsMap.stressed.totalR.toFixed(1)}R` : `${emotionsMap.stressed.totalR.toFixed(1)}R`}
                </div>
              </div>

              {/* Tired */}
              <div className="bg-slate-100 border border-slate-200 rounded-xl p-2.5">
                <div className="text-base">😴</div>
                <div className="font-bold text-slate-800 text-[11px] mt-1">{language === 'he' ? 'עייף' : 'Tired'}</div>
                <div className="text-[10px] text-slate-500">{emotionsMap.tired.count} {language === 'he' ? 'עסקאות' : 'trades'}</div>
                <div className={`font-mono font-black text-xs mt-0.5 ${emotionsMap.tired.totalR >= 0 ? 'text-emerald-700' : 'text-rose-600'}`}>
                  {emotionsMap.tired.totalR >= 0 ? `+${emotionsMap.tired.totalR.toFixed(1)}R` : `${emotionsMap.tired.totalR.toFixed(1)}R`}
                </div>
              </div>

              {/* Indifferent */}
              <div className="bg-indigo-50/70 border border-indigo-200 rounded-xl p-2.5">
                <div className="text-base">😐</div>
                <div className="font-bold text-indigo-900 text-[11px] mt-1">{language === 'he' ? 'אדיש' : 'Indifferent'}</div>
                <div className="text-[10px] text-slate-500">{emotionsMap.indifferent.count} {language === 'he' ? 'עסקאות' : 'trades'}</div>
                <div className={`font-mono font-black text-xs mt-0.5 ${emotionsMap.indifferent.totalR >= 0 ? 'text-emerald-700' : 'text-rose-600'}`}>
                  {emotionsMap.indifferent.totalR >= 0 ? `+${emotionsMap.indifferent.totalR.toFixed(1)}R` : `${emotionsMap.indifferent.totalR.toFixed(1)}R`}
                </div>
              </div>

              {/* Revenge */}
              <div className="bg-rose-50/70 border border-rose-200 rounded-xl p-2.5 col-span-2 sm:col-span-1">
                <div className="text-base">😡</div>
                <div className="font-bold text-rose-900 text-[11px] mt-1">{language === 'he' ? 'נקמה' : 'Revenge'}</div>
                <div className="text-[10px] text-slate-500">{emotionsMap.revenge.count} {language === 'he' ? 'עסקאות' : 'trades'}</div>
                <div className={`font-mono font-black text-xs mt-0.5 ${emotionsMap.revenge.totalR >= 0 ? 'text-emerald-700' : 'text-rose-600'}`}>
                  {emotionsMap.revenge.totalR >= 0 ? `+${emotionsMap.revenge.totalR.toFixed(1)}R` : `${emotionsMap.revenge.totalR.toFixed(1)}R`}
                </div>
              </div>

            </div>

            {/* Quick takeaway banner */}
            {bestWeekday !== -1 && (
              <div className="text-xs bg-indigo-50/80 text-indigo-900 border border-indigo-200/70 rounded-xl p-3 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-indigo-600 shrink-0" />
                <span>
                  {language === 'he' 
                    ? `דפוס חיובי זוהה: ימי ${weekdayNames[bestWeekday]} היו הרווחיים ביותר שלך עם ${bestWeekdayR >= 0 ? `+${bestWeekdayR.toFixed(1)}R` : `${bestWeekdayR.toFixed(1)}R`}!`
                    : `Positive pattern detected: ${weekdayNames[bestWeekday]} was your most profitable day (${bestWeekdayR >= 0 ? `+${bestWeekdayR.toFixed(1)}R` : `${bestWeekdayR.toFixed(1)}R`})!`}
                </span>
              </div>
            )}
          </div>

          {/* Section 3: Top 3 Lessons from Red Days (Scanned Notes Summary) */}
          <div className="bg-slate-900 text-white rounded-2xl p-4 sm:p-5 border border-slate-800 shadow-md space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-rose-500/20 text-rose-400 border border-rose-500/30 flex items-center justify-center shrink-0">
                  <BookOpen className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm sm:text-base font-black text-white flex items-center gap-2">
                    <span>{language === 'he' ? '3 הלקחים המובילים מימי הפסד' : language === 'ar' ? 'أهم 3 دروس من أيام الخسارة' : language === 'ru' ? 'Топ-3 урока из убыточных дней' : 'Top 3 Lessons from Red Days'}</span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30 font-mono">
                      resultR &lt; 0
                    </span>
                  </h3>
                  <p className="text-[11px] text-slate-400">
                    {language === 'he'
                      ? 'סריקה אוטומטית של שדות ההערות בימי הפסד לחשיפת הדפוסים והטעויות שחזרו על עצמן.'
                      : 'Automated scan of notes from negative trades highlighting recurring mistakes & leaks.'}
                  </p>
                </div>
              </div>

              {/* Status pill */}
              <div className="self-start sm:self-auto shrink-0">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-slate-800 border border-slate-700 text-[11px] font-medium text-slate-300">
                  <FileText className="w-3 h-3 text-indigo-400" />
                  <span>
                    {totalLosingDaysCount === 0
                      ? (language === 'he' ? '0 ימי הפסד החודש 🎉' : '0 Losing Days 🎉')
                      : language === 'he'
                        ? `${redDaysWithNotesCount} מתוך ${totalLosingDaysCount} ימי הפסד עם הערות`
                        : `${redDaysWithNotesCount} of ${totalLosingDaysCount} red days with notes`}
                  </span>
                </span>
              </div>
            </div>

            {/* Note prompt banner if losing days exist without notes */}
            {totalLosingDaysCount > 0 && redDaysWithNotesCount === 0 && (
              <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-3 text-xs text-amber-200 flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <p className="leading-relaxed">
                  {language === 'he'
                    ? 'טיפ של מקצוענים: זוהו ימי הפסד ללא מלל בעמודת ההערות. הלקחים להלן נגזרו מיומן החריגות והמצב המנטלי שנרשמו. מילוי הערה קצרה לכל עסקה אדומה בטבלה יחדד את הניתוח אפילו יותר!'
                    : 'Pro tip: Negative trading days without written notes were detected. The lessons below are derived from your recorded deviations and emotional logs. Adding notes to red days sharpens your cognitive audit!'}
                </p>
              </div>
            )}

            {/* The 3 Cards */}
            <div className="space-y-3">
              {finalTopLessons.map((lesson) => {
                const isRose = lesson.color === 'rose';
                const isAmber = lesson.color === 'amber';
                const isEmerald = lesson.color === 'emerald';

                return (
                  <div
                    key={lesson.id}
                    className={`rounded-xl p-3.5 sm:p-4 border transition-all ${
                      isRose
                        ? 'bg-rose-950/20 border-rose-500/30'
                        : isAmber
                          ? 'bg-amber-950/20 border-amber-500/30'
                          : isEmerald
                            ? 'bg-emerald-950/20 border-emerald-500/30'
                            : 'bg-indigo-950/20 border-indigo-500/30'
                    }`}
                  >
                    {/* Lesson Top Row */}
                    <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                      <div className="flex items-center gap-2">
                        {/* Rank Badge */}
                        <span
                          className={`w-6 h-6 rounded-lg flex items-center justify-center font-black text-xs font-mono shadow-xs ${
                            lesson.rank === 1
                              ? 'bg-rose-500 text-white'
                              : lesson.rank === 2
                                ? 'bg-amber-500 text-slate-950'
                                : 'bg-indigo-500 text-white'
                          }`}
                        >
                          #{lesson.rank}
                        </span>

                        {/* Title */}
                        <h4 className="text-xs sm:text-sm font-extrabold text-white">
                          {lesson.title}
                        </h4>

                        {/* Category Badge */}
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-slate-800/90 text-slate-300 border border-slate-700">
                          {lesson.categoryBadge}
                        </span>
                      </div>

                      {/* Impact Pill */}
                      {lesson.totalDamageR > 0 && (
                        <div className="flex items-center gap-1.5 text-[11px] font-mono font-bold">
                          <span className="text-slate-400">
                            {lesson.occurrences} {language === 'he' ? 'מופעים' : 'trades'}
                          </span>
                          <span className="text-rose-400 bg-rose-500/20 border border-rose-500/30 px-2 py-0.5 rounded-md">
                            -{lesson.totalDamageR.toFixed(1)}R
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Explanation / Diagnosis */}
                    <p className="text-xs text-slate-300 leading-relaxed mb-3 break-words">
                      {lesson.explanation}
                    </p>

                    {/* Scanned Notes Quotes (if any) */}
                    {lesson.quotes.length > 0 && (
                      <div className="mb-3 space-y-1.5 min-w-0">
                        <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                          <Quote className="w-3 h-3 text-indigo-400 shrink-0" />
                          <span>{language === 'he' ? 'ציטוט ישיר מהערות המסחר:' : 'Direct excerpt from your journal:'}</span>
                        </div>
                        <div className="space-y-1.5 min-w-0">
                          {lesson.quotes.map((q, qIdx) => (
                            <div
                              key={qIdx}
                              className="bg-slate-950/60 border border-slate-800 rounded-lg p-2.5 text-xs text-slate-200 flex items-start gap-2 italic min-w-0 overflow-hidden"
                            >
                              <span className="not-italic text-[10px] font-black px-1.5 py-0.5 rounded bg-rose-500/20 text-rose-300 border border-rose-500/30 font-mono shrink-0">
                                {language === 'he' ? `יום ${q.day}` : `Day ${q.day}`} ({q.r}R)
                              </span>
                              <span className="text-slate-200 text-xs break-words break-all min-w-0 flex-1">
                                "{q.text}"
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Actionable Golden Rule */}
                    <div className="bg-slate-950/80 border border-indigo-500/30 rounded-lg p-2.5 flex items-start gap-2 min-w-0">
                      <Lightbulb className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                      <div className="text-xs leading-relaxed min-w-0 flex-1 break-words">
                        <span className="font-extrabold text-amber-300">
                          {language === 'he' ? 'הכלל לתיקון: ' : 'Corrective Rule: '}
                        </span>
                        <span className="text-slate-200 font-medium">
                          {lesson.actionRule}
                        </span>
                      </div>
                    </div>

                  </div>
                );
              })}
            </div>
          </div>

          {/* Section 4: Actionable Strategic Improvement Plan for Next Month */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Target className="w-4 h-4 text-indigo-600" />
                <h3 className="text-sm sm:text-base font-black text-slate-900">
                  {language === 'he' ? 'תוכנית שיפור אסטרטגית ומנטלית לחודש הבא' : 'Strategic Improvement Plan for Next Month'}
                </h3>
              </div>
              <span className="text-[11px] text-indigo-600 font-bold bg-indigo-50 px-2 py-0.5 rounded-lg border border-indigo-200">
                {improvementDirectives.length} {language === 'he' ? 'המלצות מפתח' : 'Key Directives'}
              </span>
            </div>

            <div className="space-y-2.5">
              {improvementDirectives.map((directive, idx) => {
                const IconComponent = directive.icon;
                const isRose = directive.color === 'rose';
                const isAmber = directive.color === 'amber';
                const isEmerald = directive.color === 'emerald';

                return (
                  <div 
                    key={idx}
                    className={`p-3.5 rounded-2xl border transition-all ${
                      isRose 
                        ? 'bg-rose-50/50 border-rose-200/80' 
                        : isAmber 
                          ? 'bg-amber-50/50 border-amber-200/80' 
                          : isEmerald 
                            ? 'bg-emerald-50/50 border-emerald-200/80'
                            : 'bg-indigo-50/50 border-indigo-200/80'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 mt-0.5 ${
                        isRose ? 'bg-rose-100 text-rose-700' : isAmber ? 'bg-amber-100 text-amber-700' : isEmerald ? 'bg-emerald-100 text-emerald-700' : 'bg-indigo-100 text-indigo-700'
                      }`}>
                        <IconComponent className="w-4 h-4" />
                      </div>
                      <div className="space-y-1">
                        <div className="text-xs sm:text-sm font-extrabold text-slate-900">
                          {idx + 1}. {directive.title}
                        </div>
                        <p className="text-xs text-slate-600 leading-relaxed">
                          {directive.desc}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Section 4: Personal Pledge & Commitment for Next Month */}
          <div className="bg-slate-900 text-white rounded-2xl p-4 sm:p-5 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-amber-400" />
                <h4 className="text-xs sm:text-sm font-black text-white">
                  {language === 'he' ? 'ההתחייבות האישית שלי לחודש הבא' : 'My Personal Commitment for Next Month'}
                </h4>
              </div>
              {pledgeSaved && (
                <span className="text-[11px] text-emerald-400 font-bold flex items-center gap-1">
                  <Check className="w-3.5 h-3.5" />
                  <span>{language === 'he' ? 'ההתחייבות נשמרה!' : 'Pledge Saved!'}</span>
                </span>
              )}
            </div>

            <p className="text-[11px] text-slate-300">
              {language === 'he'
                ? 'כתוב חוק ברזל אחד בלבד שאתה מתחייב לא להפר בחודש הבא (למשל: "לא אסחור אחרי השעה 18:00", "אכבה את המסך אחרי הפסד ראשון").'
                : 'Write your single #1 golden rule for the upcoming month (e.g. "I will never move a stop loss").'}
            </p>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
              <input
                type="text"
                value={nextMonthPledge}
                onChange={(e) => setNextMonthPledge(e.target.value)}
                placeholder={language === 'he' ? 'ההתחייבות המנטלית שלי לחודש הבא...' : 'My mental commitment for next month...'}
                className="flex-1 bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-indigo-500"
              />
              <button
                onClick={handleSavePledge}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl transition-colors cursor-pointer shrink-0"
              >
                {language === 'he' ? 'שמור התחייבות' : 'Save Pledge'}
              </button>
            </div>
          </div>

        </div>

        {/* Modal Footer Controls */}
        <div className="bg-slate-50 border-t border-slate-200 p-4 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
          
          {/* Don't show again toggle */}
          <label className="flex items-center gap-2 text-xs text-slate-600 cursor-pointer select-none self-start sm:self-auto">
            <input
              type="checkbox"
              checked={dontShowAgain}
              onChange={(e) => setDontShowAgain(e.target.checked)}
              className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
            />
            <span>{language === 'he' ? 'אל תקפיץ אוטומטית שוב לחודש זה' : 'Do not pop up automatically again for this month'}</span>
          </label>

          {/* Action buttons */}
          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            
            {/* Copy button */}
            <button
              onClick={handleCopySummary}
              className="inline-flex items-center gap-1.5 px-3 py-2 bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 rounded-xl text-xs font-bold transition-colors cursor-pointer"
              title={language === 'he' ? 'העתק סיכום ללוח' : 'Copy Summary'}
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? (language === 'he' ? 'הועתק!' : 'Copied!') : (language === 'he' ? 'העתק סיכום' : 'Copy')}</span>
            </button>

            {/* Download report button */}
            <button
              onClick={handleDownloadReport}
              className="inline-flex items-center gap-1.5 px-3 py-2 bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 rounded-xl text-xs font-bold transition-colors cursor-pointer"
              title={language === 'he' ? 'הורד קובץ דו"ח' : 'Download Report'}
            >
              <Download className="w-3.5 h-3.5 text-indigo-600" />
              <span>{language === 'he' ? 'הורד דו"ח' : 'Download'}</span>
            </button>

            {/* Primary close button */}
            <button
              onClick={handleClose}
              className="px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl transition-colors cursor-pointer"
            >
              {language === 'he' ? 'הבנתי, סגור' : 'Got it, Close'}
            </button>

          </div>

        </div>

      </div>
    </div>
  );
};
export default EndOfMonthInsightsModal;
