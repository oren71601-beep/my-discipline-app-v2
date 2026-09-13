import React, { useState, useEffect, useRef } from 'react';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  Volume2, 
  VolumeX, 
  Crown, 
  Sparkles, 
  CheckCircle2, 
  Lock, 
  Unlock,
  FileText,
  MousePointer,
  Maximize2,
  Minimize2,
  Zap,
  Check,
  Edit3
} from 'lucide-react';
import { LanguageCode } from '../utils/translations';

interface AppWalkthroughVideoProps {
  language: LanguageCode;
  onOpenPaywall: () => void;
  onTogglePremium: () => void;
}

export const AppWalkthroughVideo: React.FC<AppWalkthroughVideoProps> = ({
  language,
  onOpenPaywall,
  onTogglePremium,
}) => {
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1);
  const [clickRipple, setClickRipple] = useState<boolean>(false);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  
  const videoContainerRef = useRef<HTMLDivElement>(null);
  const audioContextRef = useRef<AudioContext | null>(null);

  // Exact 20 seconds duration
  const totalDuration = 20;

  // Scene boundaries: 4 scenes x 5 seconds each = 20 seconds
  const scene1End = 5;   // 0-5s: Subscribe click & instant unlock
  const scene2End = 10;  // 5-10s: Interactive Monthly Table (Screenshot 3)
  const scene3End = 15;  // 10-15s: Analytics Dashboard (Screenshot 2)
  // 15-20s: Live fast logging simulation ("ממלא את היומן בחפיף ובמהירות קליקים") instead of static screenshot 1

  // Multilingual translations
  const texts = {
    he: {
      headerBadge: '🎬 סרטון הדגמה מהיר • 20 שניות',
      mainTitle: 'כיצד מנוי Pro פותח את האתר: מההרשמה ועד מילוי יומן מהיר',
      mainSubtitle: 'צפה בלחיצה על Subscribe, פתיחת האתר, השימוש ביומן המעקב, לוח הניתוחים ומילוי יומן מהיר ואינטואיטיבי בקליקים ספורים.',
      liveBadge: 'הדגמת מנוי חיה',
      scenes: [
        {
          id: 1,
          duration: 5,
          title: 'לחיצה על Subscribe ופתיחת האתר',
          badge: 'שלב 1 (0-5 שנ\')',
          caption: 'הסוחר לוחץ על כפתור Subscribe — המערכת נפתחת מיידית וכל הכלים נחשפים!',
          highlights: ['לחיצה על Subscribe', 'אישור מנוי Pro מיידי', 'פתיחת האתר']
        },
        {
          id: 2,
          duration: 5,
          title: 'יומן מעקב חודשי - רישום יומי אינטראקטיבי',
          badge: 'שלב 2 (5-10 שנ\')',
          caption: 'נפתח לוח הרישום: תיעוד עסקאות ב-R, סימון סטיות (כ.מוקדמת), ביטחון (1-5) וציון איכות.',
          highlights: ['תיעוד עסקאות ב-R', 'חריגה: כ.מוקדמת', 'דירוג איכות וביטחון']
        },
        {
          id: 3,
          duration: 5,
          title: 'לוח אנליטיקה ומדדי משמעת פסיכולוגיים',
          badge: 'שלב 3 (10-15 שנ\')',
          caption: 'לוח בקרה חכם: מאזן נטו +0.20R, ציון משמעת 75%, פילוח עסקאות ומצב מנטלי (רגוע 100%).',
          highlights: ['ציון משמעת 75%', 'מאזן נטו +0.20R', '100% רגוע בביצוע']
        },
        {
          id: 4,
          duration: 5,
          title: 'הדמיית מילוי יומן סופר-מהיר (בחפיף בקליק)',
          badge: 'שלב 4 (15-20 שנ\')',
          caption: 'הסוחר ממלא את יום 4 תוך שניות בודדות: קליק על "כן", קליק "רגוע", כוכב ביטחון, ורווח +2R!',
          highlights: ['הזנה קלילה ומהירה', 'חישוב מיידי ב-R', 'שמירה אוטומטית']
        }
      ],
      ctaTitle: 'היומן המלא מוכן עבורך עכשיו',
      ctaSubtitle: 'לחץ על Subscribe עכשיו כדי לפתוח את לוח המעקב החודשי, הזנת העסקאות ולוח הניתוחים המנטלי.',
      btnUpgrade: 'הצטרף עכשיו ל-Pro • Subscribe 👑',
      btnBypass: 'בדוק הדמיית פרימיום (לבדיקה בלבד)',
      fullscreenTip: 'מסך מלא',
      exitFullscreenTip: 'יציאה ממסך מלא',
      features: [
        'מילוי יומי סופר-מהיר בקליקים ספורים',
        'ציון משמעת תוכנית (75% Discipline Score)',
        'לוח אנליטיקה מלא עם פילוח עסקאות',
        'מעקב פסיכולוגיה ומחיר רגשות'
      ]
    },
    en: {
      headerBadge: '🎬 Quick Demo • 20s',
      mainTitle: 'How Pro Unlocks the Site: From Subscribe to Fast Logging',
      mainSubtitle: 'Watch clicking Subscribe, instant workspace unlock, monthly table, analytics dashboard, and quick effortless daily logging.',
      liveBadge: 'Live Subscription Demo',
      scenes: [
        {
          id: 1,
          duration: 5,
          title: 'Clicking Subscribe & Instant Unlock',
          badge: 'Step 1 (0-5s)',
          caption: 'The trader clicks Subscribe to activate Pro — the site unlocks instantly and reveals the workspace!',
          highlights: ['Subscribe button click', 'Instant Pro activation', 'Full site unlocked']
        },
        {
          id: 2,
          duration: 5,
          title: 'Interactive Monthly Journal Table',
          badge: 'Step 2 (5-10s)',
          caption: 'The daily journal opens: log trades in R, record deviations (Early Entry), confidence stars, and rating.',
          highlights: ['R-Multiple logging', 'Deviation: Early Entry', 'Quality & Confidence']
        },
        {
          id: 3,
          duration: 5,
          title: 'Analytics Dashboard & Mental Metrics',
          badge: 'Step 3 (10-15s)',
          caption: 'Advanced dashboard: Net R +0.20R, 75% Plan Discipline Score, win/loss breakdown, and 100% calm state.',
          highlights: ['75% Discipline Score', 'Net PnL +0.20R', '100% Calm Execution']
        },
        {
          id: 4,
          duration: 5,
          title: 'Fast & Effortless Daily Trade Logging',
          badge: 'Step 4 (15-20s)',
          caption: 'Quickly logging Day 4 in seconds: click "Yes", click "Calm", tap confidence stars, and lock in +2R!',
          highlights: ['Ultra-fast logging', 'Instant R calculations', 'Auto-saved to journal']
        }
      ],
      ctaTitle: 'Your Full Journal is Ready',
      ctaSubtitle: 'Click Subscribe now to unlock your monthly table, trade logging, and intelligent review.',
      btnUpgrade: 'Join Pro Now • Subscribe 👑',
      btnBypass: 'Test Premium Simulation',
      fullscreenTip: 'Fullscreen',
      exitFullscreenTip: 'Exit Fullscreen',
      features: [
        'Super-fast daily trade logging with R calculations',
        'Psychology tracking & 75% Discipline Score',
        'Deep performance dashboard & mental analytics',
        'Automatic tracking of deviations and emotions'
      ]
    },
    ar: {
      headerBadge: '🎬 عرض سريع • 20 ثانية',
      mainTitle: 'كيف يفتح اشتراك Pro الموقع: من الاشتراك إلى التسجيل السريع',
      mainSubtitle: 'شاهد النقر على زر الاشتراك، فتح الموقع فوراً، استخدام جدول التسجيل، لوحة التحليلات والتسجيل اليومي السريع.',
      liveBadge: 'عرض مباشر',
      scenes: [
        {
          id: 1,
          duration: 5,
          title: 'النقر على Subscribe وفتح الموقع',
          badge: 'الخطوة 1 (0-5 ث)',
          caption: 'ينقر المتداول على زر الاشتراك — يفتح الموقع فوراً وتظهر كل الأدوات الاحترافية!',
          highlights: ['النقر على زر الاشتراك', 'تفعيل فوري لـ Pro', 'فتح الموقع بالكامل']
        },
        {
          id: 2,
          duration: 5,
          title: 'جدول المتابعة الشهري التفاعلي',
          badge: 'الخطوة 2 (5-10 ث)',
          caption: 'فتح جدول التسجيل اليومي: صفقات بوحدات R، رصد التجاوزات، نجوم الثقة، وتقييم الجودة.',
          highlights: ['تسجيل الصفقات بوحدات R', 'رصد الدخول المبكر', 'تقييم الثقة والجودة']
        },
        {
          id: 3,
          duration: 5,
          title: 'لوحة التحليلات ومؤشر الانضباط',
          badge: 'الخطوة 3 (10-15 ث)',
          caption: 'لوحة ذكية: رصيد نقي +0.20R، نسبة انضباط 75%، وتوزيع الصفقات والحالة النفسية.',
          highlights: ['نسبة انضباط 75%', 'رصيد +0.20R', '100% هدوء عند التنفيذ']
        },
        {
          id: 4,
          duration: 5,
          title: 'محاكاة تسجيل يومي سريع وخفيف',
          badge: 'الخطوة 4 (15-20 ث)',
          caption: 'تسجيل سريع لصفقة اليوم بنقرات بسيطة: تحديد التنفيذ، الحالة النفسية، والثقة والربح +2R!',
          highlights: ['تسجيل فوري وخفيف', 'حساب تلقائي لـ R', 'حفظ فوري للبيانات']
        }
      ],
      ctaTitle: 'دفترك الكامل جاهז للعمل الآن',
      ctaSubtitle: 'اشترك الآن في Pro لفتح جدول المتابعة الشهري، تسجيل الصفقات ولوحة التحليلات.',
      btnUpgrade: 'اشترك الآن في Pro • Subscribe 👑',
      btnBypass: 'تجربة محاكاة المشتركين',
      fullscreenTip: 'ملء الشاشة',
      exitFullscreenTip: 'خروج من ملء الشاشة',
      features: [
        'تسجيل يومي فائق السرعة بنقرات خفيفة',
        'متابعة الانضباط وتجاوزات الخطة',
        'لوحة تحليلات متقدمة ورسوم بيانية',
        'حسابات تلقائية لوحدات R'
      ]
    },
    ru: {
      headerBadge: '🎬 Быстрое демо • 20 сек',
      mainTitle: 'Как подписка Pro открывает сайт: от клика Subscribe до быстрого заполнения',
      mainSubtitle: 'Посмотрите, как пользователь кликает Subscribe, сайт открывается, появляется интерактивный дневник, аналитика и быстрый ввод сделки.',
      liveBadge: 'Живое демо',
      scenes: [
        {
          id: 1,
          duration: 5,
          title: 'Клик по Subscribe и открытие сайта',
          badge: 'Шаг 1 (0-5 сек)',
          caption: 'Трейдер нажимает Subscribe — сайт мгновенно разблокируется и открывает весь функционал!',
          highlights: ['Клик по Subscribe', 'Мгновенная активация Pro', 'Сайт открыт']
        },
        {
          id: 2,
          duration: 5,
          title: 'Интерактивная таблица месяца',
          badge: 'Шаг 2 (5-10 сек)',
          caption: 'Открывается журнал сделок: учет в R, фиксация нарушений (Ранний вход), оценка сделки.',
          highlights: ['Учет в единицах R', 'Фиксация: Ранний вход', 'Оценка качества']
        },
        {
          id: 3,
          duration: 5,
          title: 'Панель аналитики и индекс дисциплины',
          badge: 'Шаг 3 (10-15 сек)',
          caption: 'Интеллектуальная панель: результат +0.20R, индекс дисциплины 75%, 100% спокойствие.',
          highlights: ['Индекс дисциплины 75%', 'Результат +0.20R', '100% контроль эмоций']
        },
        {
          id: 4,
          duration: 5,
          title: 'Быстрое заполнение дневника на лету',
          badge: 'Шаг 4 (15-20 сек)',
          caption: 'Заполнение дня за считанные секунды: клик "Да", клик "Спокойно", выбор звезд и результат +2R!',
          highlights: ['Быстрый ввод за секунды', 'Мгновенный расчет R', 'Автосохранение']
        }
      ],
      ctaTitle: 'Ваш дневник готов к работе',
      ctaSubtitle: 'Оформите подписку Pro сейчас, чтобы разблокировать журнал, календарь и отчеты.',
      btnUpgrade: 'Оформить Pro сейчас • Subscribe 👑',
      btnBypass: 'Проверить режим Premium',
      fullscreenTip: 'Во весь экран',
      exitFullscreenTip: 'Выйти из полноэкранного режима',
      features: [
        'Быстрый ввод сделок в пару кликов',
        'Учет эмоций и Discipline Score 75%',
        'Полная панель аналитики и календарь',
        'Автоматический расчет единиц R'
      ]
    }
  };

  const currentTexts = texts[language] || texts.en;

  // Determine current active scene based on 20s duration
  let currentSceneIndex = 0;
  if (currentTime < scene1End) {
    currentSceneIndex = 0;
  } else if (currentTime < scene2End) {
    currentSceneIndex = 1;
  } else if (currentTime < scene3End) {
    currentSceneIndex = 2;
  } else {
    currentSceneIndex = 3;
  }

  const activeScene = currentTexts.scenes[currentSceneIndex];
  const progressPercent = Math.min(100, (currentTime / totalDuration) * 100);

  // Playback timer (runs at exact intervals)
  useEffect(() => {
    let interval: any = null;
    if (isPlaying) {
      interval = setInterval(() => {
        setCurrentTime((prev) => {
          const next = prev + 0.2 * playbackSpeed;
          if (next >= totalDuration) {
            return 0; // Seamless loop after 20 seconds
          }
          return next;
        });
      }, 200);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isPlaying, playbackSpeed, totalDuration]);

  // Audio effects synthesizer
  const playSoundEffect = (type: 'click' | 'unlock' | 'chime' | 'tap') => {
    if (isMuted) return;
    try {
      if (!audioContextRef.current) {
        const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
        audioContextRef.current = new AudioCtx();
      }
      const ctx = audioContextRef.current;
      if (ctx.state === 'suspended') {
        ctx.resume();
      }

      const now = ctx.currentTime;

      if (type === 'click') {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(480, now);
        osc.frequency.exponentialRampToValueAtTime(140, now + 0.05);
        gain.gain.setValueAtTime(0.25, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.05);
      } else if (type === 'tap') {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(600, now);
        osc.frequency.exponentialRampToValueAtTime(300, now + 0.04);
        gain.gain.setValueAtTime(0.15, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.04);
      } else if (type === 'unlock') {
        const freqs = [523.25, 659.25, 783.99, 1046.5];
        freqs.forEach((freq, idx) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(freq, now + idx * 0.06);
          gain.gain.setValueAtTime(0.1, now + idx * 0.06);
          gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.06 + 0.25);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(now + idx * 0.06);
          osc.stop(now + idx * 0.06 + 0.25);
        });
      } else {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(587.33, now);
        osc.frequency.exponentialRampToValueAtTime(880, now + 0.12);
        gain.gain.setValueAtTime(0.05, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.2);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.2);
      }
    } catch (e) {
      // AudioContext unavailable
    }
  };

  // Trigger click sound & ripple at 2.0s in Scene 1
  useEffect(() => {
    if (currentTime >= 1.9 && currentTime <= 2.2) {
      setClickRipple(true);
      playSoundEffect('click');
      setTimeout(() => {
        playSoundEffect('unlock');
      }, 250);
      const timer = setTimeout(() => setClickRipple(false), 700);
      return () => clearTimeout(timer);
    }
  }, [currentTime]);

  // Audio cues for fast logging simulation in Scene 4 (15s to 20s)
  useEffect(() => {
    // 16.0s: clicks Yes
    if (currentTime >= 15.9 && currentTime <= 16.2) {
      playSoundEffect('tap');
    }
    // 17.0s: clicks Calm
    if (currentTime >= 16.9 && currentTime <= 17.2) {
      playSoundEffect('tap');
    }
    // 18.0s: clicks stars
    if (currentTime >= 17.9 && currentTime <= 18.2) {
      playSoundEffect('tap');
    }
    // 19.0s: submits profit +2R
    if (currentTime >= 18.9 && currentTime <= 19.2) {
      playSoundEffect('chime');
    }
  }, [currentTime]);

  // Fullscreen support
  const toggleFullscreen = () => {
    if (!videoContainerRef.current) return;

    if (!isFullscreen) {
      if (videoContainerRef.current.requestFullscreen) {
        videoContainerRef.current.requestFullscreen().catch(() => {});
      } else if ((videoContainerRef.current as any).webkitRequestFullscreen) {
        (videoContainerRef.current as any).webkitRequestFullscreen();
      }
      setIsFullscreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen().catch(() => {});
      } else if ((document as any).webkitExitFullscreen) {
        (document as any).webkitExitFullscreen();
      }
      setIsFullscreen(false);
    }
  };

  // Sync fullscreen change with ESC key or browser native exit
  useEffect(() => {
    const handleFsChange = () => {
      const isCurrentlyFs = !!(document.fullscreenElement || (document as any).webkitFullscreenElement);
      setIsFullscreen(isCurrentlyFs);
    };

    document.addEventListener('fullscreenchange', handleFsChange);
    document.addEventListener('webkitfullscreenchange', handleFsChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFsChange);
      document.removeEventListener('webkitfullscreenchange', handleFsChange);
    };
  }, []);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  // Timeline click scrubber
  const handleTimelineClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const clickRatio = Math.max(0, Math.min(1, clickX / rect.width));
    setCurrentTime(clickRatio * totalDuration);
  };

  return (
    <div className="space-y-4 sm:space-y-6 animate-fade-in">
      
      {/* Header presentation */}
      <div className="bg-slate-900 text-white rounded-2xl sm:rounded-3xl p-4 sm:p-7 border border-slate-800 shadow-xl relative overflow-hidden">
        
        {/* Glow ambient background accents */}
        <div className="absolute top-0 right-0 w-80 sm:w-96 h-80 sm:h-96 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/4 w-60 sm:w-80 h-60 sm:h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl space-y-2 sm:space-y-3">
          <div className="inline-flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-400/30 text-indigo-300 text-[11px] sm:text-xs font-bold">
            <span className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse" />
            <span>{currentTexts.headerBadge}</span>
          </div>

          <h1 className="text-lg sm:text-2xl md:text-3xl font-black text-white tracking-tight leading-snug">
            {currentTexts.mainTitle}
          </h1>

          <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
            {currentTexts.mainSubtitle}
          </p>
        </div>

        {/* Video Player Showcase Frame with Ref for Fullscreen */}
        <div 
          ref={videoContainerRef}
          className={`mt-4 sm:mt-6 relative rounded-2xl overflow-hidden border border-slate-800 bg-slate-950 shadow-2xl transition-all ${
            isFullscreen ? 'fixed inset-0 z-50 rounded-none m-0 p-0 flex flex-col justify-between bg-black' : ''
          }`}
        >
          
          {/* Top browser chrome with Fullscreen button */}
          <div className="bg-slate-900/95 backdrop-blur-md px-3 sm:px-4 py-2 sm:py-2.5 border-b border-slate-800 flex items-center justify-between text-xs text-slate-400 shrink-0">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500/80 inline-block" />
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80 inline-block" />
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80 inline-block" />
              <div className="ms-1.5 hidden sm:flex items-center gap-1 px-2.5 py-0.5 rounded-lg bg-slate-950/80 border border-slate-800 text-[11px] text-slate-300 font-mono">
                <span className="text-emerald-400">🔒</span>
                <span>mindset-trading-journal.app</span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="flex items-center gap-1 text-[10px] text-emerald-400 bg-emerald-950/60 border border-emerald-800/40 px-2 py-0.5 rounded-full font-bold">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                <span>{currentTexts.liveBadge}</span>
              </span>

              {/* Fullscreen Toggle in Top Header */}
              <button
                onClick={toggleFullscreen}
                className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer"
                title={isFullscreen ? currentTexts.exitFullscreenTip : currentTexts.fullscreenTip}
              >
                {isFullscreen ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>

          {/* Video Stage / Visual Simulation Area */}
          <div className={`relative ${
            isFullscreen 
              ? 'flex-1 min-h-0 py-2 px-3 sm:px-6' 
              : 'aspect-[16/11] sm:aspect-[16/9] min-h-[360px] sm:min-h-[460px] p-2.5 sm:p-4'
          } bg-slate-950 flex flex-col justify-between overflow-y-auto sm:overflow-hidden select-none`}>
            
            {/* Top in-video timestamp */}
            <div className="flex items-center justify-end z-20 mb-2 shrink-0">
              <div className="bg-black/60 backdrop-blur-md px-2 sm:px-2.5 py-1 rounded-lg text-[10px] sm:text-[11px] font-mono font-bold text-slate-300 border border-white/10 shrink-0">
                {formatTime(currentTime)} / 0:20
              </div>
            </div>

            {/* Middle Screen Display: Switches dynamically based on scene */}
            <div className="relative my-auto flex-1 flex items-center justify-center p-1 sm:p-2 z-10 w-full overflow-x-auto">
              
              {/* ========================================================================= */}
              {/* SCENE 1 (0-5s): The Subscribe Click & Site Unlock Simulation              */}
              {/* ========================================================================= */}
              {currentSceneIndex === 0 && (
                <div className="w-full max-w-xl space-y-3 sm:space-y-4 text-center animate-fade-in relative py-1 sm:py-2">
                  
                  {currentTime < 2.2 ? (
                    // Paywall lock card before clicking Subscribe
                    <div className="bg-slate-900/95 border border-amber-500/40 rounded-2xl sm:rounded-3xl p-4 sm:p-7 shadow-2xl relative overflow-hidden transition-all duration-300">
                      <div className="w-12 h-12 sm:w-14 sm:h-14 mx-auto rounded-2xl bg-amber-500/20 border border-amber-400/40 flex items-center justify-center text-amber-300 mb-2.5 shadow-lg">
                        <Lock className="w-6 h-6 sm:w-7 sm:h-7" />
                      </div>

                      <h2 className="text-base sm:text-xl font-black text-white">
                        {language === 'he' ? 'פתח גישה מלאה ליומן המסחר המנטלי' : 'Unlock Full Access to Mental Trading Journal'}
                      </h2>
                      
                      <p className="text-[11px] sm:text-xs text-slate-300 max-w-md mx-auto mt-1 mb-4 sm:mb-5">
                        {language === 'he' 
                          ? 'לחץ על Subscribe עכשיו כדי לפתוח את לוח הרישום היומי, הניתוחים והמילוי המהיר.'
                          : 'Click Subscribe now to unlock daily tracking, analytics, and fast trade logging.'}
                      </p>

                      {/* Prominent Subscribe Button targeted by simulated cursor */}
                      <div className="relative inline-block">
                        <div className={`px-6 sm:px-8 py-2.5 sm:py-3.5 bg-gradient-to-r from-amber-500 via-indigo-600 to-indigo-700 text-white font-black text-xs sm:text-sm rounded-2xl shadow-xl shadow-indigo-600/40 flex items-center gap-2 transition-transform duration-200 ${
                          currentTime >= 1.9 ? 'scale-95 ring-4 ring-amber-400/50' : 'scale-100'
                        }`}>
                          <Crown className="w-4 h-4 sm:w-5 sm:h-5 text-amber-200" />
                          <span>{language === 'he' ? 'הצטרף עכשיו ל-Pro • Subscribe' : 'Subscribe to Pro Now'}</span>
                        </div>

                        {/* Simulated Animated Mouse Cursor moving towards Subscribe Button */}
                        <div 
                          className="absolute pointer-events-none transition-all duration-500 ease-out z-30"
                          style={{
                            top: currentTime < 0.8 ? '90px' : currentTime < 1.9 ? '18px' : '16px',
                            right: currentTime < 0.8 ? '-40px' : currentTime < 1.9 ? '20px' : '25px',
                            opacity: 1
                          }}
                        >
                          <div className="relative">
                            <MousePointer className="w-6 h-6 sm:w-7 sm:h-7 text-white fill-white drop-shadow-[0_4px_10px_rgba(0,0,0,0.8)] filter -rotate-12" />
                            {clickRipple && (
                              <span className="absolute -top-3 -left-3 w-12 h-12 rounded-full bg-amber-400/60 animate-ping" />
                            )}
                          </div>
                        </div>
                      </div>

                    </div>
                  ) : (
                    // Unlocked Success Banner & Instant Reveal
                    <div className="bg-gradient-to-r from-indigo-950 via-slate-900 to-emerald-950 border border-emerald-500/50 rounded-2xl sm:rounded-3xl p-4 sm:p-7 shadow-2xl relative overflow-hidden transition-all duration-300 scale-100 animate-fade-in">
                      
                      <div className="w-12 h-12 sm:w-16 sm:h-16 mx-auto rounded-2xl bg-emerald-500/20 border border-emerald-400/50 flex items-center justify-center text-emerald-300 mb-2 sm:mb-3 shadow-lg shadow-emerald-500/20 animate-bounce">
                        <Unlock className="w-6 h-6 sm:w-8 sm:h-8" />
                      </div>

                      <div className="inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-0.5 sm:py-1 rounded-full bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 text-[11px] sm:text-xs font-black mb-1.5 sm:mb-2">
                        <Sparkles className="w-3.5 h-3.5 text-emerald-300" />
                        <span>{language === 'he' ? 'המנוי הופעל בהצלחה!' : 'Subscription Activated!'}</span>
                      </div>

                      <h2 className="text-lg sm:text-2xl font-black text-white">
                        {language === 'he' ? '🎉 נפתח האתר בהצלחה!' : '🎉 Website Successfully Unlocked!'}
                      </h2>

                      <p className="text-[11px] sm:text-sm text-slate-300 max-w-md mx-auto mt-1 sm:mt-2">
                        {language === 'he'
                          ? 'ברוך הבא למנוי Pro! כל הכלים נפתחו כעת: יומן המעקב החודשי, האנליטיקה והזנת העסקאות המהירה.'
                          : 'Welcome to Pro! All tools unlocked: monthly journal table, analytics dashboard, and fast trade logging.'}
                      </p>

                      <div className="mt-3 sm:mt-5 inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl bg-slate-900/90 border border-slate-700 text-[11px] sm:text-xs font-mono text-amber-300">
                        <Crown className="w-3.5 h-3.5 text-amber-400" />
                        <span>Status: Pro Active Member 👑</span>
                      </div>
                    </div>
                  )}

                </div>
              )}

              {/* ========================================================================= */}
              {/* SCENE 2 (5-10s): Interactive Monthly Journal Table (Screenshot 3)         */}
              {/* ========================================================================= */}
              {currentSceneIndex === 1 && (
                <div className="w-full max-w-3xl bg-white rounded-xl sm:rounded-2xl p-2.5 sm:p-4 shadow-2xl border border-slate-200 text-slate-900 animate-fade-in overflow-x-auto text-xs text-start">
                  
                  {/* Table Header exact match to Screenshot 3 */}
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-1.5 border-b border-slate-200 pb-2">
                    <div className="flex items-center gap-1.5">
                      <FileText className="w-4 h-4 text-indigo-600 shrink-0" />
                      <h3 className="text-xs sm:text-sm font-black text-slate-900 truncate">
                        {language === 'he' ? 'יומן מעקב חודשי - ספטמבר 2026' : 'Monthly Tracking Journal - September 2026'}
                      </h3>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <span className="px-2 py-0.5 rounded-lg bg-slate-900 text-white text-[9px] sm:text-[10px] font-bold shadow-xs">
                        {language === 'he' ? 'טבלה אינטראקטיבית' : 'Interactive Table'}
                      </span>
                      <span className="px-2 py-0.5 rounded-lg bg-slate-100 text-slate-600 text-[9px] sm:text-[10px] font-bold">
                        {language === 'he' ? 'לוח שנה' : 'Calendar'}
                      </span>
                    </div>
                  </div>

                  <div className="text-[10px] sm:text-[11px] text-slate-500 py-1 border-b border-slate-100 flex items-center justify-between">
                    <span className="font-bold text-slate-800">
                      {language === 'he' ? 'לוח רישום יומי אינטראקטיבי' : 'Daily Logging Table'}
                    </span>
                    <span className="text-[9px] sm:text-[10px] text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200 font-semibold">
                      ● {language === 'he' ? 'עסקה בוצעה (כן)' : 'Trade Executed (Y)'}
                    </span>
                  </div>

                  {/* Simulated Table Rows representing Screenshot 3 */}
                  <div className="overflow-x-auto mt-1 sm:mt-2">
                    <table className="w-full text-[10px] sm:text-[11px] border-collapse min-w-[500px]">
                      <thead>
                        <tr className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200">
                          <th className="p-1 sm:p-1.5 text-center">{language === 'he' ? 'יום' : 'Day'}</th>
                          <th className="p-1 sm:p-1.5 text-center">{language === 'he' ? 'בוצעה עסקה?' : 'Executed?'}</th>
                          <th className="p-1 sm:p-1.5 text-center">{language === 'he' ? 'מצב מנטלי' : 'Mental'}</th>
                          <th className="p-1 sm:p-1.5 text-center">{language === 'he' ? 'סטייה מהתוכנית' : 'Deviation'}</th>
                          <th className="p-1 sm:p-1.5 text-center">{language === 'he' ? 'ביטחון (1-5)' : 'Confidence'}</th>
                          <th className="p-1 sm:p-1.5 text-center">{language === 'he' ? 'ציון (1-10)' : 'Rating'}</th>
                          <th className="p-1 sm:p-1.5 text-center">{language === 'he' ? 'תוצאה (R)' : 'Result (R)'}</th>
                        </tr>
                      </thead>
                      <tbody>
                        {/* Day 1: No Trade */}
                        <tr className="border-b border-slate-100 text-slate-400">
                          <td className="p-1.5 sm:p-2 text-center font-bold text-slate-700">1</td>
                          <td className="p-1.5 sm:p-2 text-center">-</td>
                          <td className="p-1.5 sm:p-2 text-center">-</td>
                          <td className="p-1.5 sm:p-2 text-center">-</td>
                          <td className="p-1.5 sm:p-2 text-center">☆☆☆☆☆</td>
                          <td className="p-1.5 sm:p-2 text-center">-</td>
                          <td className="p-1.5 sm:p-2 text-center font-mono">-</td>
                        </tr>

                        {/* Day 2: Highlighted Executed Trade with Deviation as in Screenshot 3 */}
                        <tr className="border-b border-indigo-100 bg-indigo-50/50 relative">
                          <td className="p-1.5 sm:p-2 text-center font-black text-indigo-950">2</td>
                          <td className="p-1.5 sm:p-2 text-center">
                            <span className="px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-800 border border-indigo-300 font-bold">
                              {language === 'he' ? 'כן (Y)' : 'Yes (Y)'}
                            </span>
                          </td>
                          <td className="p-1.5 sm:p-2 text-center">
                            <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 border border-amber-300 font-bold">
                              {language === 'he' ? 'רגוע' : 'Calm'}
                            </span>
                          </td>
                          <td className="p-1.5 sm:p-2 text-center">
                            <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 border border-amber-400 font-extrabold ring-2 ring-amber-300">
                              {language === 'he' ? 'כ.מוקדמת' : 'Early Entry'}
                            </span>
                          </td>
                          <td className="p-1.5 sm:p-2 text-center text-amber-500 font-bold">★★★☆☆</td>
                          <td className="p-1.5 sm:p-2 text-center">
                            <span className="px-1.5 py-0.5 bg-indigo-600 text-white font-bold rounded text-[9px] sm:text-[10px]">3</span>
                          </td>
                          <td className="p-1.5 sm:p-2 text-center">
                            <span className="font-mono font-black text-rose-600 border border-rose-300 bg-rose-50 px-1.5 sm:px-2 py-0.5 rounded">
                              -1 R
                            </span>
                          </td>
                        </tr>

                        {/* Day 3: Disciplined Skip as in Screenshot 3 */}
                        <tr className="border-b border-slate-100">
                          <td className="p-1.5 sm:p-2 text-center font-bold text-slate-700">3</td>
                          <td className="p-1.5 sm:p-2 text-center">
                            <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 font-bold">
                              {language === 'he' ? 'לא (N)' : 'No (N)'}
                            </span>
                          </td>
                          <td className="p-1.5 sm:p-2 text-center">
                            <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold">
                              {language === 'he' ? 'רגוע' : 'Calm'}
                            </span>
                          </td>
                          <td className="p-1.5 sm:p-2 text-center">
                            <span className="text-slate-400">{language === 'he' ? 'ללא חריגה' : 'None'}</span>
                          </td>
                          <td className="p-1.5 sm:p-2 text-center text-slate-300">☆☆☆☆☆</td>
                          <td className="p-1.5 sm:p-2 text-center text-slate-400">-</td>
                          <td className="p-1.5 sm:p-2 text-center font-mono font-bold text-slate-600">0 R</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>

                  {/* Callout Footer */}
                  <div className="mt-2 pt-1.5 border-t border-slate-100 flex items-center justify-between text-[9px] sm:text-[10px] text-slate-500">
                    <span className="text-indigo-700 font-bold">
                      💡 {language === 'he' ? 'הזנה נוחה בלחיצת קליק אחת לכל סעיף' : 'Quick 1-click tagging for psychology and deviations'}
                    </span>
                    <span className="font-mono font-semibold text-slate-700">
                      {language === 'he' ? 'סה"כ ספטמבר: 4 עסקאות' : 'Total September: 4 trades'}
                    </span>
                  </div>

                </div>
              )}

              {/* ========================================================================= */}
              {/* SCENE 3 (10-15s): The Performance Analytics Dashboard (Screenshot 2)      */}
              {/* ========================================================================= */}
              {currentSceneIndex === 2 && (
                <div className="w-full max-w-3xl space-y-2 sm:space-y-2.5 animate-fade-in text-start">
                  
                  {/* Top Stats Cards exact match to Screenshot 2 */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 sm:gap-2 text-slate-900">
                    
                    {/* Card 1: Confidence & Quality */}
                    <div className="bg-white rounded-xl p-2 sm:p-2.5 border border-slate-200 shadow-sm">
                      <div className="text-[9px] sm:text-[10px] text-slate-500 font-bold">
                        {language === 'he' ? 'ביטחון ודירוג ממוצע' : 'Confidence & Rating'}
                      </div>
                      <div className="text-xs sm:text-sm font-black font-mono mt-0.5 sm:mt-1 text-slate-800">
                        2.8 / 5 <span className="text-[9px] font-normal text-slate-400">({language === 'he' ? 'ביטחון' : 'Conf'})</span>
                      </div>
                      <div className="text-[11px] sm:text-xs font-black font-mono text-indigo-600">
                        5.7 / 10 <span className="text-[9px] font-normal text-slate-400">({language === 'he' ? 'איכות' : 'Quality'})</span>
                      </div>
                    </div>

                    {/* Card 2: Trade Breakdown */}
                    <div className="bg-white rounded-xl p-2 sm:p-2.5 border border-slate-200 shadow-sm">
                      <div className="text-[9px] sm:text-[10px] text-slate-500 font-bold">
                        {language === 'he' ? 'פילוח עסקאות' : 'Trade Breakdown'}
                      </div>
                      <div className="flex items-center justify-between text-[11px] sm:text-xs font-bold mt-1">
                        <span className="text-emerald-600">1 {language === 'he' ? 'רווחיות' : 'Wins'}</span>
                        <span className="text-rose-600">3 {language === 'he' ? 'הפסדיות' : 'Losses'}</span>
                      </div>
                      <div className="text-[9px] sm:text-[10px] text-slate-400 mt-0.5">
                        5 {language === 'he' ? 'ימי מעקב מלאים' : 'Tracked Days'}
                      </div>
                    </div>

                    {/* Card 3: Plan Discipline Score 75% */}
                    <div className="bg-white rounded-xl p-2 sm:p-2.5 border border-amber-200 shadow-sm bg-gradient-to-br from-white to-amber-50/50">
                      <div className="text-[9px] sm:text-[10px] text-amber-800 font-bold">
                        {language === 'he' ? 'ציון משמעת תוכנית' : 'Plan Discipline Score'}
                      </div>
                      <div className="text-lg sm:text-xl font-black font-mono text-amber-500 mt-0.5">
                        75%
                      </div>
                      <div className="text-[9px] sm:text-[10px] text-slate-500">
                        3 {language === 'he' ? 'מתוך 4 עמדו בתוכנית' : 'out of 4 on plan'}
                      </div>
                    </div>

                    {/* Card 4: Net PnL (R) +0.20R */}
                    <div className="bg-white rounded-xl p-2 sm:p-2.5 border border-emerald-200 shadow-sm bg-gradient-to-br from-white to-emerald-50/50">
                      <div className="text-[9px] sm:text-[10px] text-emerald-800 font-bold">
                        {language === 'he' ? 'מאזן רווח/הפסד (R)' : 'Net PnL (R)'}
                      </div>
                      <div className="text-lg sm:text-xl font-black font-mono text-emerald-600 mt-0.5">
                        +0.20R
                      </div>
                      <div className="text-[9px] sm:text-[10px] text-slate-500">
                        25.0% {language === 'he' ? 'אחוז הצלחה' : 'Win Rate'}
                      </div>
                    </div>

                  </div>

                  {/* 3 Lower Cards from Screenshot 2 */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-1.5 sm:gap-2">
                    
                    {/* Emotional States */}
                    <div className="bg-white rounded-xl p-2 sm:p-3 border border-slate-200 shadow-sm text-xs">
                      <div className="font-bold text-slate-900 text-[10px] sm:text-[11px] mb-1.5 flex items-center justify-between">
                        <span>{language === 'he' ? 'מצב מנטלי בעת ביצוע' : 'Mental State at Execution'}</span>
                        <span className="text-emerald-600 font-mono font-bold">100%</span>
                      </div>
                      <div className="flex items-center justify-between text-[10px] text-slate-600 mb-1">
                        <span>🧘‍♂️ {language === 'he' ? 'רגוע' : 'Calm'}</span>
                        <span className="font-bold">4 {language === 'he' ? 'עסקאות' : 'trades'}</span>
                      </div>
                      <div className="w-full bg-slate-100 rounded-full h-1.5 sm:h-2 overflow-hidden">
                        <div className="bg-emerald-500 h-full w-full" />
                      </div>
                    </div>

                    {/* Deviations */}
                    <div className="bg-white rounded-xl p-2 sm:p-3 border border-slate-200 shadow-sm text-xs">
                      <div className="font-bold text-slate-900 text-[10px] sm:text-[11px] mb-1.5 flex items-center justify-between">
                        <span>{language === 'he' ? 'סטיות ומשמעת מסחר' : 'Deviations & Discipline'}</span>
                        <span className="text-amber-600 font-mono font-bold">25% סטיות</span>
                      </div>
                      <div className="space-y-1 text-[10px]">
                        <div className="flex justify-between text-slate-600">
                          <span>{language === 'he' ? 'ללא חריגה' : 'No deviation'}</span>
                          <span className="font-bold">3 (75%)</span>
                        </div>
                        <div className="flex justify-between text-amber-700 font-bold">
                          <span>{language === 'he' ? 'כ.מוקדמת' : 'Early Entry'}</span>
                          <span>1 (25%)</span>
                        </div>
                      </div>
                    </div>

                    {/* Reasons for no trade */}
                    <div className="bg-white rounded-xl p-2 sm:p-3 border border-slate-200 shadow-sm text-xs">
                      <div className="font-bold text-slate-900 text-[10px] sm:text-[11px] mb-1.5">
                        {language === 'he' ? 'סיבות אי-כניסה לעסקה' : 'Reasons for No Entry'}
                      </div>
                      <div className="flex items-center justify-between text-[10px] text-emerald-800 font-bold mb-1">
                        <span>🛡️ {language === 'he' ? 'משמעת' : 'Discipline'}</span>
                        <span>1 {language === 'he' ? 'מקרים (100%)' : 'case (100%)'}</span>
                      </div>
                      <div className="w-full bg-slate-100 rounded-full h-1.5 sm:h-2 overflow-hidden">
                        <div className="bg-emerald-500 h-full w-full" />
                      </div>
                    </div>

                  </div>

                </div>
              )}

              {/* ========================================================================= */}
              {/* SCENE 4 (15-20s): Live Simulation: Fast, Effortless Logging ("בחפיף")     */}
              {/* ========================================================================= */}
              {currentSceneIndex === 3 && (
                <div className="w-full max-w-2xl bg-white rounded-2xl sm:rounded-3xl p-3 sm:p-5 shadow-2xl border border-slate-200 text-slate-900 animate-fade-in overflow-hidden text-start relative">
                  
                  {/* Top Bar showing Quick Logging Mode */}
                  <div className="flex items-center justify-between border-b border-slate-100 pb-2.5 mb-2.5">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
                        <Zap className="w-4 h-4 text-indigo-600 animate-pulse" />
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <h4 className="text-xs sm:text-sm font-black text-slate-900">
                            {language === 'he' ? 'רישום עסקה מהיר בלחיצות כפתור' : 'Ultra-Fast Trade Logging'}
                          </h4>
                          <span className="px-1.5 py-0.5 rounded bg-amber-100 text-amber-800 text-[9px] font-bold">
                            {language === 'he' ? 'בחפיף תוך 3 שניות!' : 'Fast 3s flow!'}
                          </span>
                        </div>
                        <p className="text-[10px] text-slate-500">
                          {language === 'he' ? 'יום 4 • ללא סיבוכים, רק קליק-קליק-שמור' : 'Day 4 • No clutter, just fast clicks and auto-save'}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-1 bg-emerald-50 border border-emerald-200 px-2 py-1 rounded-lg text-emerald-700 text-[10px] font-bold">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>{currentTime >= 19.0 ? (language === 'he' ? 'נשמר בהצלחה!' : 'Saved!') : (language === 'he' ? 'מזין כעת...' : 'Typing...')}</span>
                    </div>
                  </div>

                  {/* Interactive Quick Form being filled in real-time */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3 text-xs">
                    
                    {/* Step A: Executed? Click YES */}
                    <div className={`p-2.5 rounded-xl border transition-all duration-300 ${
                      currentTime >= 16.0 
                        ? 'bg-indigo-50/80 border-indigo-300 ring-2 ring-indigo-400/30' 
                        : 'bg-slate-50 border-slate-200'
                    }`}>
                      <div className="text-[10px] font-bold text-slate-500 mb-1 flex items-center justify-between">
                        <span>1. {language === 'he' ? 'האם נכנסת לעסקה היום?' : 'Did you take a trade?'}</span>
                        {currentTime >= 16.0 && <Check className="w-3.5 h-3.5 text-indigo-600" />}
                      </div>
                      <div className="grid grid-cols-2 gap-1.5">
                        <div className={`py-1.5 px-2 rounded-lg font-bold text-center text-[11px] transition-all flex items-center justify-center gap-1 ${
                          currentTime >= 16.0
                            ? 'bg-indigo-600 text-white shadow-xs scale-102'
                            : 'bg-white border border-slate-200 text-slate-600'
                        }`}>
                          <span>✓ {language === 'he' ? 'כן (בוצעה)' : 'Yes (Trade)'}</span>
                        </div>
                        <div className="py-1.5 px-2 rounded-lg font-medium text-center text-[11px] bg-white border border-slate-200 text-slate-400 opacity-60">
                          <span>{language === 'he' ? 'לא' : 'No'}</span>
                        </div>
                      </div>
                    </div>

                    {/* Step B: Mental State -> Click CALM */}
                    <div className={`p-2.5 rounded-xl border transition-all duration-300 ${
                      currentTime >= 17.0 
                        ? 'bg-emerald-50/80 border-emerald-300 ring-2 ring-emerald-400/30' 
                        : 'bg-slate-50 border-slate-200'
                    }`}>
                      <div className="text-[10px] font-bold text-slate-500 mb-1 flex items-center justify-between">
                        <span>2. {language === 'he' ? 'איך הרגשת בעת הכניסה?' : 'Mental state at execution'}</span>
                        {currentTime >= 17.0 && <Check className="w-3.5 h-3.5 text-emerald-600" />}
                      </div>
                      <div className="flex items-center gap-1">
                        <div className={`flex-1 py-1.5 px-1.5 rounded-lg text-center font-bold text-[10px] transition-all ${
                          currentTime >= 17.0 
                            ? 'bg-emerald-600 text-white shadow-xs' 
                            : 'bg-white border border-slate-200 text-slate-600'
                        }`}>
                          🧘‍♂️ {language === 'he' ? 'רגוע' : 'Calm'}
                        </div>
                        <div className="flex-1 py-1.5 px-1.5 rounded-lg text-center font-medium text-[10px] bg-white border border-slate-200 text-slate-400 opacity-60">
                          ⚡ {language === 'he' ? 'FOMO' : 'FOMO'}
                        </div>
                        <div className="flex-1 py-1.5 px-1.5 rounded-lg text-center font-medium text-[10px] bg-white border border-slate-200 text-slate-400 opacity-60">
                          🔥 {language === 'he' ? 'כעס' : 'Revenge'}
                        </div>
                      </div>
                    </div>

                    {/* Step C: Confidence stars */}
                    <div className={`p-2.5 rounded-xl border transition-all duration-300 ${
                      currentTime >= 18.0 
                        ? 'bg-amber-50/80 border-amber-300 ring-2 ring-amber-400/30' 
                        : 'bg-slate-50 border-slate-200'
                    }`}>
                      <div className="text-[10px] font-bold text-slate-500 mb-1 flex items-center justify-between">
                        <span>3. {language === 'he' ? 'רמת ביטחון בעסקה' : 'Confidence rating'}</span>
                        {currentTime >= 18.0 && <span className="font-mono text-amber-700 font-bold">4/5</span>}
                      </div>
                      <div className="flex items-center justify-center gap-1 text-base sm:text-lg">
                        <span className="text-amber-400 cursor-pointer">★</span>
                        <span className="text-amber-400 cursor-pointer">★</span>
                        <span className="text-amber-400 cursor-pointer">★</span>
                        <span className={`cursor-pointer transition-all ${currentTime >= 18.0 ? 'text-amber-400 scale-125' : 'text-slate-300'}`}>★</span>
                        <span className="text-slate-200">☆</span>
                      </div>
                    </div>

                    {/* Step D: Result in R -> Instant +2.0R */}
                    <div className={`p-2.5 rounded-xl border transition-all duration-300 ${
                      currentTime >= 18.8 
                        ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/30 scale-102' 
                        : 'bg-slate-50 border-slate-200'
                    }`}>
                      <div className={`text-[10px] font-bold mb-1 flex items-center justify-between ${
                        currentTime >= 18.8 ? 'text-emerald-100' : 'text-slate-500'
                      }`}>
                        <span>4. {language === 'he' ? 'תוצאה ביחידות סיכון (R)' : 'Result in R-Units'}</span>
                        {currentTime >= 18.8 && <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-spin" />}
                      </div>
                      <div className="flex items-center justify-between">
                        <span className={`font-mono text-lg sm:text-xl font-black ${
                          currentTime >= 18.8 ? 'text-white' : 'text-slate-400'
                        }`}>
                          {currentTime >= 18.8 ? '+2.00 R' : '0.00 R'}
                        </span>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                          currentTime >= 18.8 ? 'bg-emerald-600 text-emerald-100' : 'bg-slate-200 text-slate-500'
                        }`}>
                          {currentTime >= 18.8 ? (language === 'he' ? 'עסקת יעד!' : 'Take Profit!') : (language === 'he' ? 'ממתין' : 'Waiting')}
                        </span>
                      </div>
                    </div>

                  </div>

                  {/* Animated Hand/Cursor tapping in Scene 4 */}
                  <div 
                    className="absolute pointer-events-none transition-all duration-500 ease-out z-30"
                    style={{
                      top: currentTime < 16.2 
                        ? '115px' 
                        : currentTime < 17.2 
                        ? '115px' 
                        : currentTime < 18.2 
                        ? '200px' 
                        : '200px',
                      left: currentTime < 16.2 
                        ? '120px' 
                        : currentTime < 17.2 
                        ? '320px' 
                        : currentTime < 18.2 
                        ? '140px' 
                        : '420px',
                      opacity: 1
                    }}
                  >
                    <div className="relative">
                      <MousePointer className="w-6 h-6 sm:w-7 sm:h-7 text-indigo-600 fill-indigo-600 drop-shadow-[0_4px_10px_rgba(0,0,0,0.5)] filter -rotate-12" />
                      <span className="absolute -top-2 -left-2 w-8 h-8 rounded-full bg-indigo-500/40 animate-ping" />
                    </div>
                  </div>

                  {/* Bottom reassurance caption */}
                  <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-500">
                    <span className="flex items-center gap-1 text-indigo-700 font-bold">
                      <Edit3 className="w-3.5 h-3.5" />
                      <span>{language === 'he' ? 'תוך 5 שניות בסוף יום המסחר — והכל מתעדכן בגרפים וברווח!' : 'Takes 5 seconds after market close — everything auto-updates!'}</span>
                    </span>
                    <span className="text-emerald-600 font-mono font-bold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                      ✓ {language === 'he' ? 'נשמר בטבלה' : 'Saved to table'}
                    </span>
                  </div>

                </div>
              )}

            </div>

            {/* Bottom In-Video Controls Bar: Clean scrubber, Play/Pause, Sound, Speed, Time & Fullscreen */}
            <div className="relative z-20 mt-2 pt-2 border-t border-slate-800/80 space-y-2 shrink-0">
              
              {/* Scrubber Timeline Bar (0 to 20 seconds) with Click-to-seek */}
              <div 
                onClick={handleTimelineClick}
                className="w-full bg-slate-800 hover:bg-slate-700/80 h-2 rounded-full overflow-hidden cursor-pointer relative transition-all"
                title="לחץ לגלילה בציר הזמן (0-20 שניות)"
              >
                <div 
                  className="bg-gradient-to-r from-amber-400 via-indigo-500 to-emerald-400 h-full transition-all duration-100 relative"
                  style={{ width: `${progressPercent}%` }}
                >
                  <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-white shadow-md" />
                </div>
              </div>

              {/* Controls Toolbar: No scene buttons, pure clean media player bar */}
              <div className="flex items-center justify-between gap-2 text-xs text-slate-300">
                <div className="flex items-center gap-1.5 sm:gap-2">
                  
                  {/* Play / Pause */}
                  <button
                    onClick={() => setIsPlaying(!isPlaying)}
                    className="p-1.5 sm:p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white transition-colors cursor-pointer"
                    title={isPlaying ? 'השהה' : 'נגן'}
                  >
                    {isPlaying ? <Pause className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> : <Play className="w-3.5 h-3.5 sm:w-4 sm:h-4 fill-current" />}
                  </button>

                  {/* Restart */}
                  <button
                    onClick={() => {
                      setCurrentTime(0);
                      setIsPlaying(true);
                    }}
                    className="p-1.5 sm:p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer"
                    title="הפעל מחדש (00:00)"
                  >
                    <RotateCcw className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  </button>

                  {/* Sound toggle */}
                  <button
                    onClick={() => {
                      setIsMuted(!isMuted);
                      if (isMuted) playSoundEffect('chime');
                    }}
                    className={`p-1.5 sm:p-2 rounded-xl border transition-colors cursor-pointer ${
                      !isMuted 
                        ? 'bg-indigo-600/30 text-indigo-300 border-indigo-500/40' 
                        : 'bg-slate-800 text-slate-400 border-slate-700 hover:text-white'
                    }`}
                    title={isMuted ? 'הפעל צליל' : 'השתק'}
                  >
                    {!isMuted ? <Volume2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> : <VolumeX className="w-3.5 h-3.5 sm:w-4 sm:h-4" />}
                  </button>

                  {/* Fullscreen Button in Controls Toolbar */}
                  <button
                    onClick={toggleFullscreen}
                    className={`p-1.5 sm:p-2 rounded-xl border transition-colors cursor-pointer ${
                      isFullscreen
                        ? 'bg-indigo-600 text-white border-indigo-500'
                        : 'bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border-slate-700'
                    }`}
                    title={isFullscreen ? currentTexts.exitFullscreenTip : currentTexts.fullscreenTip}
                  >
                    {isFullscreen ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
                  </button>

                  {/* Speed toggle */}
                  <button
                    onClick={() => {
                      const speeds = [1, 1.25, 1.5];
                      const nextIdx = (speeds.indexOf(playbackSpeed) + 1) % speeds.length;
                      setPlaybackSpeed(speeds[nextIdx]);
                    }}
                    className="px-2 py-1 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white font-mono font-bold text-[10px] sm:text-[11px] cursor-pointer"
                    title="מהירות ניגון"
                  >
                    {playbackSpeed}x
                  </button>

                  {/* Time readout 0:XX / 0:20 */}
                  <span className="font-mono text-[10px] sm:text-[11px] text-slate-400 font-bold">
                    {formatTime(currentTime)} / 0:20
                  </span>
                </div>

                {/* Right side status */}
                <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="hidden sm:inline font-bold text-slate-300">20s Walkthrough</span>
                </div>
              </div>

            </div>
          </div>

        </div>

      </div>

      {/* CTA Box right below video */}
      <div className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-7 border border-slate-200/90 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4 sm:gap-5">
        <div className="space-y-1.5 sm:space-y-2 text-start w-full md:w-auto">
          <div className="inline-flex items-center gap-1.5 text-xs font-extrabold text-indigo-700 bg-indigo-50 border border-indigo-200/60 px-2.5 py-0.5 rounded-full">
            <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
            <span>{language === 'he' ? 'מוכן להתחיל?' : 'Ready to Start?'}</span>
          </div>

          <h3 className="text-base sm:text-xl font-black text-slate-900 tracking-tight">
            {currentTexts.ctaTitle}
          </h3>

          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed max-w-xl">
            {currentTexts.ctaSubtitle}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 sm:gap-2 pt-1 sm:pt-2">
            {currentTexts.features.map((feat, i) => (
              <div key={i} className="flex items-center gap-1.5 sm:gap-2 text-[11px] sm:text-xs font-semibold text-slate-700">
                <CheckCircle2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-500 shrink-0" />
                <span>{feat}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col items-center gap-2 w-full md:w-auto shrink-0">
          <button
            onClick={onOpenPaywall}
            className="w-full md:w-auto px-6 sm:px-8 py-3 sm:py-3.5 bg-gradient-to-r from-amber-500 via-indigo-600 to-indigo-700 hover:from-amber-400 hover:to-indigo-600 text-white font-extrabold text-xs sm:text-sm rounded-2xl shadow-lg shadow-indigo-600/30 cursor-pointer transition-all flex items-center justify-center gap-2 group"
          >
            <Crown className="w-4 h-4 text-amber-300 group-hover:rotate-12 transition-transform" />
            <span>{currentTexts.btnUpgrade}</span>
          </button>

          <button
            onClick={onTogglePremium}
            className="text-xs text-indigo-600 hover:text-indigo-700 font-bold underline cursor-pointer bg-transparent border-none py-1"
          >
            {currentTexts.btnBypass}
          </button>
        </div>
      </div>

    </div>
  );
};

export default AppWalkthroughVideo;
