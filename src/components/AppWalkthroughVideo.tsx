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
  TrendingUp, 
  ShieldCheck, 
  Calendar, 
  BarChart3, 
  Lock, 
  Maximize2,
  Sliders,
  ChevronRight,
  Flame,
  Clock
} from 'lucide-react';
import { LanguageCode } from '../utils/translations';

interface AppWalkthroughVideoProps {
  language: LanguageCode;
  onOpenPaywall: () => void;
  onTogglePremium: () => void;
}

interface SceneData {
  id: number;
  duration: number; // in seconds
  title: string;
  badge: string;
  caption: string;
  highlights: string[];
}

export const AppWalkthroughVideo: React.FC<AppWalkthroughVideoProps> = ({
  language,
  onOpenPaywall,
  onTogglePremium,
}) => {
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [isMuted, setIsMuted] = useState<boolean>(true);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1);
  const totalDuration = 44; // 44 seconds walkthrough
  const audioContextRef = useRef<AudioContext | null>(null);

  // Multilingual content
  const texts = {
    he: {
      headerBadge: '🎬 סרטון הדרכה בלעדי • 44 שניות',
      mainTitle: 'איך עובד יומן המסחר המנטלי וכיצד הוא מזניק את הרווחיות שלך',
      mainSubtitle: 'צפה בהסבר המהיר על מערכת תיעוד העסקאות, ציון המשמעת הפסיכולוגי ואנליטיקת הביצועים – שדרג ל-Pro כדי לפתוח את היומן שלך.',
      liveBadge: 'הדגמת מערכת חיה',
      scenes: [
        {
          id: 1,
          duration: 11,
          title: 'מבוא והגדרת עסקאות ב-R',
          badge: 'שלב 1 מתוך 4',
          caption: 'כל חודש מתחיל ברישום מסודר של עסקאות לפי יחסי סיכון (R), במקום כסף עיוור. זה מנטרל לחץ ומונע הימורים.',
          highlights: ['הזנה פשוטה ומהירה תוך שניות', 'חישוב רווח/הפסד ביחידות סיכון R', 'סיכום חודשי אוטומטי']
        },
        {
          id: 2,
          duration: 11,
          title: 'ציון משמעת פסיכולוגי ומניעת FOMO',
          badge: 'שלב 2 מתוך 4',
          caption: 'האם סחרת מתוך נקמה? האם הגדלת לוט בלי תוכנית? היומן מזהה סטיות ומחשב ציון משמעת יומי מדויק מ-1 עד 10.',
          highlights: ['תיעוד סטיות (FOMO, כניסה מוקדמת)', 'דירוג מצב רגשי ומנטלי', 'חישוב Discipline Score יומי']
        },
        {
          id: 3,
          duration: 11,
          title: 'אנליטיקה מתקדמת ולוח שנה חזותי',
          badge: 'שלב 3 מתוך 4',
          caption: 'גרף רווח מצטבר בזמן אמת, אחוזי הצלחה, ויחס מתמטי בין ימי משמעת גבוהה לבין רווחיות מקסימלית.',
          highlights: ['גרף צבירת R חודשי דינמי', 'תצוגת לוח שנה פסיכולוגי', 'ניתוח פילוח רווח מול סטיות']
        },
        {
          id: 4,
          duration: 11,
          title: 'פתיחת גישה מלאה ליומן ב-Pro',
          badge: 'שלב 4 מתוך 4',
          caption: 'סוחרים ממושמעים הם סוחרים רווחיים. לחץ על שדרוג ל-Pro כדי לפתוח מיד את היומן המלא וכל כלי הניתוח!',
          highlights: ['פתיחה מיידית של כל הכלים', 'שמירה מקומית ואפשרות גיבוי מלא', 'ללא התחייבות, ביטול בכל עת']
        }
      ],
      ctaTitle: 'אהבת את מה שראית? היומן המלא מחכה לך עכשיו',
      ctaSubtitle: 'שדרג לחשבון Pro כדי לפתוח את לוח המעקב החודשי, הזנת העסקאות, הגרפים והגיבויים המלאים.',
      btnUpgrade: 'פתח את היומן המלא עכשיו 👑',
      btnBypass: 'בדוק הדמיית פרימיום (לבדיקה בלבד)',
      features: [
        'יומן מעקב חודשי מלא עם חישוב R אוטומטי',
        'מעקב סטיות פסיכולוגיות וציון משמעת יומי',
        'גרפים אינטראקטיביים ולוח שנה מנטלי',
        'גיבוי נתונים ושחזור מלא ב-JSON'
      ]
    },
    en: {
      headerBadge: '🎬 Exclusive Video Walkthrough • 44s',
      mainTitle: 'How the Mental Trading Journal Works & Boosts Your Profitability',
      mainSubtitle: 'Watch this quick walkthrough showing trade logging, psychological discipline scoring, and advanced analytics – upgrade to Pro to unlock your full journal.',
      liveBadge: 'Live System Demo',
      scenes: [
        {
          id: 1,
          duration: 11,
          title: 'Introduction & R-Multiple Tracking',
          badge: 'Step 1 of 4',
          caption: 'Every month starts by tracking trades using standard risk units (R) instead of blind dollar figures, eliminating emotional stress.',
          highlights: ['Rapid logging in seconds', 'Automatic R-Multiple calculations', 'Real-time monthly summaries']
        },
        {
          id: 2,
          duration: 11,
          title: 'Mental Discipline & FOMO Tracking',
          badge: 'Step 2 of 4',
          caption: 'Did you revenge trade or break your rules? The journal flags emotional deviations and calculates your daily Discipline Score from 1 to 10.',
          highlights: ['Deviation tracking (FOMO, early exits)', 'Emotional sentiment logging', 'Daily Discipline Score']
        },
        {
          id: 3,
          duration: 11,
          title: 'Advanced Analytics & Visual Calendar',
          badge: 'Step 3 of 4',
          caption: 'Visual cumulative equity curve, win-rate metrics, and correlation analysis between strict discipline and trading profits.',
          highlights: ['Dynamic cumulative R equity curve', 'Visual psychological calendar', 'Profit-vs-deviation breakdowns']
        },
        {
          id: 4,
          duration: 11,
          title: 'Unlock Full Access with Pro',
          badge: 'Step 4 of 4',
          caption: 'Disciplined traders are profitable traders. Click Upgrade to Pro to immediately unlock the full journal and all analytical engines!',
          highlights: ['Instant full journal unlock', 'Local persistence & JSON backup', 'No lock-in, cancel anytime']
        }
      ],
      ctaTitle: 'Liked what you saw? Your full journal is ready',
      ctaSubtitle: 'Upgrade to Pro to unlock the monthly workspace, interactive trade logging, calendar view, and deep analytics.',
      btnUpgrade: 'Unlock Full Journal Now 👑',
      btnBypass: 'Test Premium Simulation',
      features: [
        'Full monthly interactive trading journal with R calculations',
        'Psychological rule deviation & discipline scoring',
        'Interactive analytics dashboards & mental calendar',
        'JSON data export & local device backup'
      ]
    },
    ar: {
      headerBadge: '🎬 فيديو توضيحي حصري • 44 ثانية',
      mainTitle: 'كيف يعمل دفتر التداول الذهني وكيف يعزز انضباطك وأرباحك',
      mainSubtitle: 'شاهد الشرح السريع لكيفية تسجيل الصفقات، حساب نقاط الانضباط النفسي، والتحليلات البيانية – اشترك في Pro لفتح دفترك بالكامل.',
      liveBadge: 'عرض عملي مباشر',
      scenes: [
        {
          id: 1,
          duration: 11,
          title: 'مقدمة وتتبع الصفقات بوحدات R',
          badge: 'الخطوة 1 من 4',
          caption: 'يبدأ كل شهر بتسجيل الصفقات بنسب المخاطرة R بدلاً من الأرقام العشوائية لتحييد التوتر النفسي.',
          highlights: ['تسجيل سريع ودقيق', 'حساب تلقائي لنسب المخاطرة R', 'ملخص شهري فوري']
        },
        {
          id: 2,
          duration: 11,
          title: 'تقييم الانضباط ومكافحة FOMO',
          badge: 'الخطوة 2 من 4',
          caption: 'يرصد الدفتر السلوكيات الانتقامية والدخول المبكر ويحسب لك مؤشر انضباط يومي من 1 إلى 10.',
          highlights: ['رصد أخطاء الانضباط والـ FOMO', 'تقييم الحالة الذهنية', 'معدل انضباط يومי متطور']
        },
        {
          id: 3,
          duration: 11,
          title: 'التحليلات المتقدمة والتقويم',
          badge: 'الخطوة 3 من 4',
          caption: 'منحنى أرباح تراكمي مباشر، نسب الفوز، ومعدل الارتباط المباشر بين الالتزام بالخطة والأرباح المحققة.',
          highlights: ['منحنى نمو R التراكمي', 'تقويم تداول ذهني', 'تحليل شامل للأداء']
        },
        {
          id: 4,
          duration: 11,
          title: 'الترقية والوصول الكامل لـ Pro',
          badge: 'الخطوة 4 من 4',
          caption: 'المتداول المنضبط هو المتداول الرابح. اشترك الآن في Pro لفتح الدفتر بالكامل وجميع أدوات التحليل!',
          highlights: ['فتح فوري للدفتر الكامل', 'حفظ ومزامنة مع نسخ احتياطي', 'إلغاء الاشتراك في أي وقت']
        }
      ],
      ctaTitle: 'هل أعجبك العرض؟ دفترك الكامل في انتظارك الآن',
      ctaSubtitle: 'اشترك في باقة Pro لتفعيل دفتر التداول التفاعلي الشهري، تسجيل الصفقات والتحليلات المتقدمة.',
      btnUpgrade: 'فتح الدفتر الكامل الآن 👑',
      btnBypass: 'تجربة محاكاة المشتركين',
      features: [
        'دفتر تداول شهري كامل مع حساب R التلقائي',
        'متابعة الانضباط النفسي وتقييم المشاعر',
        'رسوم بيانية متقدمة وتقويم ذهني',
        'تصدير واستيراد النسخ الاحتياطية JSON'
      ]
    },
    ru: {
      headerBadge: '🎬 Видеообзор возможностей • 44 сек',
      mainTitle: 'Как работает ментальный дневник трейдера и увеличивает вашу прибыль',
      mainSubtitle: 'Посмотрите короткий обзор учета сделок, расчета дисциплины и продвинутой аналитики. Оформите Pro, чтобы открыть полный дневник.',
      liveBadge: 'Живая демонстрация',
      scenes: [
        {
          id: 1,
          duration: 11,
          title: 'Введение и учет сделок в R',
          badge: 'Шаг 1 из 4',
          caption: 'Каждый месяц начинается с учета сделок в единицах риска (R), что снимает эмоциональное напряжение от сумм в долларах.',
          highlights: ['Быстрый ввод за секунды', 'Автоматический расчет R', 'Мгновенный итог месяца']
        },
        {
          id: 2,
          duration: 11,
          title: 'Ментальная дисциплина и борьба с FOMO',
          badge: 'Шаг 2 из 4',
          caption: 'Дневник фиксирует отклонения от плана (FOMO, тильт) и вычисляет ежедневный балл дисциплины от 1 до 10.',
          highlights: ['Учет нарушений правил', 'Оценка психологического состояния', 'Индекс дисциплины Discipline Score']
        },
        {
          id: 3,
          duration: 11,
          title: 'Аналитика и визуальный календарь',
          badge: 'Шаг 3 из 4',
          caption: 'Кривая доходности в реальном времени, винрейт и корреляция между дисциплиной и ростом депозита.',
          highlights: ['Динамический график прироста R', 'Визуальный ментальный календарь', 'Анализ распределения сделок']
        },
        {
          id: 4,
          duration: 11,
          title: 'Открытие полного доступа в Pro',
          badge: 'Шаг 4 из 4',
          caption: 'Дисциплинированные трейдеры — прибыльные трейдеры. Переходите на Pro, чтобы получить полный функционал!',
          highlights: ['Мгновенный доступ ко всем функциям', 'Локальное сохранение и бэкап JSON', 'Без обязательств, отмена в любой момент']
        }
      ],
      ctaTitle: 'Понравился обзор? Ваш дневник готов к работе',
      ctaSubtitle: 'Оформите Pro-подписку, чтобы разблокировать интерактивную таблицу месяца, календарь и аналитику.',
      btnUpgrade: 'Открыть полный дневник сейчас 👑',
      btnBypass: 'Проверить режим Premium',
      features: [
        'Полноценный интерактивный дневник месяца с расчетом R',
        'Учет дисциплины, тильта и психологических состояний',
        'Интерактивные графики и ментальный календарь',
        'Экспорт и восстановление бэкапов в JSON'
      ]
    }
  };

  const currentTexts = texts[language] || texts.en;

  // Playback timer
  useEffect(() => {
    let interval: any = null;
    if (isPlaying) {
      interval = setInterval(() => {
        setCurrentTime((prev) => {
          const next = prev + 0.25 * playbackSpeed;
          if (next >= totalDuration) {
            return 0; // Loop seamlessly
          }
          return next;
        });
      }, 250);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isPlaying, playbackSpeed]);

  // Determine current active scene
  const scene1End = 11;
  const scene2End = 22;
  const scene3End = 33;

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

  // Soft pleasant audio chime when unmuted and scene changes
  const playChime = () => {
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
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(587.33, ctx.currentTime); // D5
      osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.15); // A5
      gain.gain.setValueAtTime(0.05, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.3);
    } catch (e) {
      // AudioContext not allowed or unsupported
    }
  };

  const handleJumpToScene = (index: number) => {
    const starts = [0, 11, 22, 33];
    setCurrentTime(starts[index]);
    playChime();
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
    <div className="space-y-6 animate-fade-in">
      
      {/* Header presentation */}
      <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 border border-slate-800 shadow-xl relative overflow-hidden">
        {/* Glow ambient background accents */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/4 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-400/30 text-indigo-300 text-xs font-bold">
            <span className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse" />
            <span>{currentTexts.headerBadge}</span>
          </div>

          <h1 className="text-xl sm:text-3xl font-black text-white tracking-tight leading-snug">
            {currentTexts.mainTitle}
          </h1>

          <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
            {currentTexts.mainSubtitle}
          </p>
        </div>

        {/* Video Player Showcase Frame */}
        <div className="mt-6 relative rounded-2xl overflow-hidden border border-slate-800 bg-slate-950 shadow-2xl">
          
          {/* Top Mac-style window chrome bar */}
          <div className="bg-slate-900/90 backdrop-blur-md px-4 py-2.5 border-b border-slate-800 flex items-center justify-between text-xs text-slate-400">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500/80 inline-block" />
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80 inline-block" />
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80 inline-block" />
              <span className="ms-2 font-mono text-[11px] text-slate-300 font-semibold flex items-center gap-1.5">
                <span>Trading-Journal-Walkthrough.mp4</span>
                <span className="text-[9px] bg-indigo-900/60 text-indigo-300 px-1.5 py-0.2 rounded border border-indigo-700/40">1080p 60fps</span>
              </span>
            </div>

            <div className="flex items-center gap-2">
              <span className="flex items-center gap-1 text-[10px] text-emerald-400 bg-emerald-950/60 border border-emerald-800/40 px-2 py-0.5 rounded-full font-bold">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                <span>{currentTexts.liveBadge}</span>
              </span>
            </div>
          </div>

          {/* Video Stage / Visual Simulation Area */}
          <div className="relative aspect-[16/9] min-h-[300px] sm:min-h-[420px] bg-gradient-to-b from-slate-950 via-[#070b14] to-slate-950 flex flex-col justify-between p-4 sm:p-7 overflow-hidden select-none">
            
            {/* Top in-video scene badge */}
            <div className="flex items-center justify-between z-10">
              <div className="flex items-center gap-2 bg-slate-900/80 backdrop-blur-md border border-slate-800 px-3 py-1 rounded-xl text-white text-xs font-bold">
                <span className="w-2 h-2 rounded-full bg-amber-400" />
                <span className="text-amber-300">{activeScene.badge}:</span>
                <span className="text-white font-extrabold">{activeScene.title}</span>
              </div>

              <div className="bg-black/50 backdrop-blur-md px-2.5 py-1 rounded-lg text-[11px] font-mono font-bold text-slate-300 border border-white/10">
                {formatTime(currentTime)} / {formatTime(totalDuration)}
              </div>
            </div>

            {/* Middle Live Animated Demonstration Graphic based on Active Scene */}
            <div className="relative my-auto flex flex-col items-center justify-center text-center p-2 z-10">
              
              {/* SCENE 1: Trade Logging & R Units */}
              {currentSceneIndex === 0 && (
                <div className="w-full max-w-xl space-y-3.5 animate-fade-in">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-[11px] font-bold border border-indigo-500/30">
                    <TrendingUp className="w-3.5 h-3.5" />
                    <span>Focus on Risk Units (R), Not Money</span>
                  </div>

                  {/* Simulated interactive trade row */}
                  <div className="bg-slate-900/90 border border-indigo-500/40 rounded-2xl p-4 shadow-xl space-y-3 text-start">
                    <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono font-bold bg-indigo-600 text-white px-2 py-0.5 rounded">Day 14</span>
                        <span className="text-xs font-bold text-white">NQ Nasdaq 100 - Breakout</span>
                      </div>
                      <span className="text-xs font-extrabold text-emerald-400 font-mono bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/30">
                        +3.2R Profit
                      </span>
                    </div>

                    <div className="grid grid-cols-3 gap-2 text-center text-xs">
                      <div className="bg-slate-950 p-2 rounded-xl border border-slate-800">
                        <div className="text-[10px] text-slate-400">Risk Plan</div>
                        <div className="font-extrabold text-white">1.0 R</div>
                      </div>
                      <div className="bg-slate-950 p-2 rounded-xl border border-slate-800">
                        <div className="text-[10px] text-slate-400">Target</div>
                        <div className="font-extrabold text-emerald-400">3.2 R</div>
                      </div>
                      <div className="bg-slate-950 p-2 rounded-xl border border-slate-800">
                        <div className="text-[10px] text-slate-400">Execution</div>
                        <div className="font-extrabold text-indigo-400">100% Rules Met</div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* SCENE 2: Psychology & Discipline Score */}
              {currentSceneIndex === 1 && (
                <div className="w-full max-w-xl space-y-3.5 animate-fade-in">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-[11px] font-bold border border-amber-500/30">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>Psychology & Deviation Engine</span>
                  </div>

                  {/* Simulated Psychology Card */}
                  <div className="bg-slate-900/90 border border-amber-500/40 rounded-2xl p-4 shadow-xl space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="text-start">
                        <div className="text-[11px] text-slate-400">Mental Sentiment Check:</div>
                        <div className="text-sm font-black text-white flex items-center gap-1.5">
                          <span>Calm, Focused, No FOMO</span>
                          <span className="text-emerald-400">✓</span>
                        </div>
                      </div>
                      
                      <div className="text-center bg-slate-950 px-3 py-1.5 rounded-xl border border-slate-800">
                        <div className="text-[9px] text-slate-400 uppercase font-bold">Discipline Score</div>
                        <div className="text-lg font-black text-amber-400 font-mono">9.8 / 10</div>
                      </div>
                    </div>

                    <div className="w-full bg-slate-950 rounded-full h-2 overflow-hidden border border-slate-800">
                      <div className="bg-gradient-to-r from-amber-500 to-emerald-400 h-full w-[98%] transition-all duration-500" />
                    </div>
                  </div>
                </div>
              )}

              {/* SCENE 3: Advanced Charts & Visual Calendar */}
              {currentSceneIndex === 2 && (
                <div className="w-full max-w-xl space-y-3.5 animate-fade-in">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-[11px] font-bold border border-emerald-500/30">
                    <BarChart3 className="w-3.5 h-3.5" />
                    <span>Performance Analytics & Growth Curve</span>
                  </div>

                  {/* Simulated Chart visual */}
                  <div className="bg-slate-900/90 border border-emerald-500/40 rounded-2xl p-4 shadow-xl space-y-3">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-extrabold text-white">Monthly Equity Curve (Net R)</span>
                      <span className="font-mono text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded-md border border-emerald-500/20">+14.6R (Win Rate 71%)</span>
                    </div>

                    {/* Bars visualizer */}
                    <div className="h-20 flex items-end justify-between gap-1.5 pt-4 px-2">
                      {[15, 30, 25, 45, 40, 65, 55, 80, 75, 95, 88, 100].map((h, i) => (
                        <div key={i} className="flex-1 flex flex-col items-center gap-1">
                          <div 
                            className="w-full rounded-t-md bg-gradient-to-t from-indigo-600 to-emerald-400 transition-all duration-300"
                            style={{ height: `${h}%` }}
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* SCENE 4: Full Access & Pro Activation */}
              {currentSceneIndex === 3 && (
                <div className="w-full max-w-xl space-y-3.5 animate-fade-in">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gradient-to-r from-amber-500/20 to-indigo-500/20 text-amber-300 text-[11px] font-bold border border-amber-400/40">
                    <Crown className="w-3.5 h-3.5 text-amber-300" />
                    <span>Unlock Your Full Trading Potential</span>
                  </div>

                  <div className="bg-slate-900/95 border border-indigo-500/50 rounded-2xl p-5 shadow-2xl space-y-3">
                    <div className="w-12 h-12 mx-auto rounded-2xl bg-gradient-to-tr from-amber-500 to-indigo-600 flex items-center justify-center text-white shadow-lg">
                      <Crown className="w-6 h-6 text-amber-200" />
                    </div>

                    <h3 className="text-base font-black text-white">
                      {currentTexts.ctaTitle}
                    </h3>

                    <button
                      onClick={onOpenPaywall}
                      className="px-6 py-2.5 bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 text-white font-extrabold text-xs rounded-xl shadow-lg shadow-indigo-600/30 cursor-pointer transition-all inline-flex items-center gap-2"
                    >
                      <Crown className="w-4 h-4 text-amber-300" />
                      <span>{currentTexts.btnUpgrade}</span>
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Bottom In-Video Subtitle Caption */}
            <div className="z-10 bg-slate-900/90 backdrop-blur-md p-3.5 rounded-2xl border border-slate-800 text-start space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-extrabold text-white text-xs sm:text-sm">
                  {activeScene.caption}
                </span>
              </div>

              {/* Scene feature tags */}
              <div className="flex flex-wrap items-center gap-2 pt-1">
                {activeScene.highlights.map((h, i) => (
                  <span key={i} className="inline-flex items-center gap-1 text-[10px] text-slate-300 bg-slate-950/80 px-2.5 py-0.5 rounded-lg border border-slate-800 font-medium">
                    <CheckCircle2 className="w-3 h-3 text-emerald-400 shrink-0" />
                    <span>{h}</span>
                  </span>
                ))}
              </div>
            </div>

            {/* Overlay play button when paused */}
            {!isPlaying && (
              <div 
                onClick={() => setIsPlaying(true)}
                className="absolute inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center cursor-pointer z-20"
              >
                <div className="w-16 h-16 rounded-full bg-indigo-600 hover:bg-indigo-500 text-white flex items-center justify-center shadow-2xl transition-transform hover:scale-105">
                  <Play className="w-7 h-7 ms-1 text-white fill-current" />
                </div>
              </div>
            )}
          </div>

          {/* Interactive Player Controls Toolbar */}
          <div className="bg-slate-900 p-3 sm:p-4 border-t border-slate-800 space-y-3">
            
            {/* Scrubber timeline bar */}
            <div 
              onClick={(e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                const clickX = e.clientX - rect.left;
                const ratio = Math.max(0, Math.min(1, clickX / rect.width));
                setCurrentTime(ratio * totalDuration);
              }}
              className="w-full bg-slate-800 hover:bg-slate-700/80 h-2 rounded-full overflow-hidden cursor-pointer relative transition-all"
              title="לחץ לגלילה בציר הזמן"
            >
              <div 
                className="bg-gradient-to-r from-indigo-500 to-emerald-400 h-full transition-all duration-150 relative"
                style={{ width: `${progressPercent}%` }}
              >
                <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-white shadow-md" />
              </div>
            </div>

            {/* Buttons control row */}
            <div className="flex items-center justify-between text-xs text-slate-300">
              <div className="flex items-center gap-2 sm:gap-3">
                
                {/* Play / Pause */}
                <button
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white transition-colors cursor-pointer"
                  title={isPlaying ? 'השהה' : 'נגן'}
                >
                  {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-current" />}
                </button>

                {/* Restart */}
                <button
                  onClick={() => {
                    setCurrentTime(0);
                    setIsPlaying(true);
                  }}
                  className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer"
                  title="הפעל מחדש מההתחלה"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>

                {/* Sound toggle */}
                <button
                  onClick={() => {
                    setIsMuted(!isMuted);
                    if (isMuted) playChime();
                  }}
                  className={`p-2 rounded-xl border transition-colors cursor-pointer ${
                    !isMuted 
                      ? 'bg-indigo-600/30 text-indigo-300 border-indigo-500/40' 
                      : 'bg-slate-800 text-slate-400 border-slate-700 hover:text-white'
                  }`}
                  title={isMuted ? 'הפעל צליל' : 'השתק'}
                >
                  {!isMuted ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
                </button>

                {/* Speed toggle */}
                <button
                  onClick={() => {
                    const speeds = [1, 1.25, 1.5];
                    const nextIdx = (speeds.indexOf(playbackSpeed) + 1) % speeds.length;
                    setPlaybackSpeed(speeds[nextIdx]);
                  }}
                  className="px-2.5 py-1 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white font-mono font-bold text-[11px] cursor-pointer"
                  title="מהירות ניגון"
                >
                  {playbackSpeed}x
                </button>

                {/* Time readout */}
                <span className="font-mono text-[11px] text-slate-400 hidden sm:inline-block">
                  {formatTime(currentTime)} / {formatTime(totalDuration)}
                </span>
              </div>

              {/* Scene Quick Jump Tabs */}
              <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800 overflow-x-auto">
                {currentTexts.scenes.map((scene, idx) => (
                  <button
                    key={scene.id}
                    onClick={() => handleJumpToScene(idx)}
                    className={`px-2 py-1 rounded-lg text-[10px] font-extrabold whitespace-nowrap transition-all cursor-pointer ${
                      currentSceneIndex === idx
                        ? 'bg-indigo-600 text-white shadow-xs'
                        : 'text-slate-400 hover:text-white hover:bg-slate-800'
                    }`}
                  >
                    <span>{idx + 1}. {scene.title.split(' ')[0]}</span>
                  </button>
                ))}
              </div>
            </div>

          </div>
        </div>

      </div>

      {/* CTA Box right below video */}
      <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/90 shadow-sm flex flex-col md:flex-row items-center justify-between gap-5">
        <div className="space-y-2 text-start">
          <div className="inline-flex items-center gap-1.5 text-xs font-extrabold text-indigo-700 bg-indigo-50 border border-indigo-200/60 px-2.5 py-0.5 rounded-full">
            <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
            <span>{language === 'he' ? 'מוכן להתחיל?' : 'Ready to Start?'}</span>
          </div>

          <h3 className="text-lg sm:text-xl font-black text-slate-900 tracking-tight">
            {currentTexts.ctaTitle}
          </h3>

          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed max-w-xl">
            {currentTexts.ctaSubtitle}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2">
            {currentTexts.features.map((feat, i) => (
              <div key={i} className="flex items-center gap-2 text-xs font-semibold text-slate-700">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>{feat}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col items-center gap-2.5 w-full md:w-auto shrink-0">
          <button
            onClick={onOpenPaywall}
            className="w-full md:w-auto px-8 py-3.5 bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 text-white font-extrabold text-sm rounded-2xl shadow-lg shadow-indigo-600/30 cursor-pointer transition-all flex items-center justify-center gap-2 group"
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
