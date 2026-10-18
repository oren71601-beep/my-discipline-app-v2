import React, { useState, useEffect } from 'react';
import { 
  Play, 
  Pause, 
  Download, 
  Copy, 
  Check, 
  Sparkles, 
  Video, 
  Image as ImageIcon, 
  ArrowLeft, 
  ArrowRight,
  ExternalLink, 
  TrendingUp, 
  Zap, 
  RotateCcw,
  Volume2,
  Tv,
  Eye,
  Flame,
  User,
  Mail,
  ShieldCheck,
  Activity,
  Layers,
  Cpu,
  Sliders,
  ChevronRight,
  CheckCircle2,
  Lock,
  Globe,
  Radio,
  BarChart3,
  Terminal,
  Target,
  Waves,
  Award,
  Users
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { NewsletterSignup } from './NewsletterSignup';
import { SocialLinks } from './SocialLinks';
import { SUPPORT_EMAIL } from '../firebase';

// Import Trading Discipline Studio Components
import { DisciplinePromptSimulator } from './DisciplinePromptSimulator';
import { CinematicTradeVisualizer } from './CinematicTradeVisualizer';
import { AmbientFocusAudioLab } from './AmbientFocusAudioLab';
import { PropFirmShieldCalculator } from './PropFirmShieldCalculator';
import { DisciplinePassportGenerator } from './DisciplinePassportGenerator';
import { DisciplineCommunityFeed } from './DisciplineCommunityFeed';

// Import promotional assets
// @ts-ignore
import promoPhoneImg from '../assets/images/trading_promo_phone_mockup_1782954819150.jpg';
// @ts-ignore
import promoDisciplineImg from '../assets/images/trading_discipline_chart_promo_1782954834008.jpg';
// @ts-ignore
import promoAdStoryImg from '../assets/images/discipline_story_ad_1791068170946.jpg';

interface LandingPageProps {
  onLaunchApp: () => void;
  onOpenAdPoster?: () => void;
  onOpenAboutMe?: () => void;
  onOpenAnalytics?: () => void;
  language: 'he' | 'en' | 'ar' | 'ru';
  isRtl: boolean;
  onLanguageChange?: (lang: 'he' | 'en' | 'ar' | 'ru') => void;
  isPremium: boolean;
  onTogglePremium?: () => void;
  isOwnerView?: boolean;
}

type TabType = 
  | 'portal' 
  | 'prompt_lab' 
  | 'motion_replay' 
  | 'audio_focus' 
  | 'prop_shield' 
  | 'passport' 
  | 'community'
  | 'videos' 
  | 'images' 
  | 'ad_poster';

export default function LandingPage({ 
  onLaunchApp, 
  onOpenAdPoster,
  onOpenAboutMe,
  onOpenAnalytics,
  language, 
  isRtl, 
  onLanguageChange,
  isPremium, 
  onTogglePremium,
  isOwnerView 
}: LandingPageProps) {
  const [activeTab, setActiveTab] = useState<TabType>('portal');

  // Interactive Hebrew / English Language Switcher State
  const [currentLang, setCurrentLang] = useState<'he' | 'en'>(() => {
    return language === 'en' ? 'en' : 'he';
  });

  // Keep synchronized if external language prop updates
  useEffect(() => {
    if (language === 'en' || language === 'he') {
      setCurrentLang(language);
    }
  }, [language]);

  const switchLanguage = (newLang: 'he' | 'en') => {
    setCurrentLang(newLang);
    onLanguageChange?.(newLang);
  };

  const isCurrentRtl = currentLang === 'he';
  
  // Interactive Hero Preview Controls
  const [heroActiveView, setHeroActiveView] = useState<'cockpit' | 'discipline' | 'risk' | 'mockup'>('cockpit');
  
  // Video player simulator states
  const [selectedVideoTemplate, setSelectedVideoTemplate] = useState<number>(0);
  const [isVideoPlaying, setIsVideoPlaying] = useState<boolean>(false);
  const [videoProgress, setVideoProgress] = useState<number>(0);
  const [videoCurrentTime, setVideoCurrentTime] = useState<number>(0);
  
  // Custom Post Generator states
  const [postDiscipline, setPostDiscipline] = useState<string>('94.8%');
  const [postProfit, setPostProfit] = useState<string>('+18.5 R');
  const [postMentalState, setPostMentalState] = useState<string>('Calm & Focused');
  const [generatedCaption, setGeneratedCaption] = useState<string>('');
  const [isCopied, setIsCopied] = useState<boolean>(false);

  // Interactive Hero Command Bar State
  const [heroPromptInput, setHeroPromptInput] = useState<string>('');
  const [commandFeedback, setCommandFeedback] = useState<string | null>(null);

  const handleExecuteHeroCommand = (customQuery?: string) => {
    const query = (customQuery !== undefined ? customQuery : heroPromptInput).trim().toLowerCase();
    if (!query) {
      onLaunchApp();
      return;
    }

    if (query.includes('נקמה') || query.includes('revenge') || query.includes('tilt') || query.includes('fomo') || query.includes('תרחיש') || query.includes('scenario')) {
      setActiveTab('prompt_lab');
      setCommandFeedback(currentLang === 'he' ? 'טוען סימולטור תרחישים ומניעת Tilt ⚡' : 'Loading Tilt & Scenario Simulator ⚡');
    } else if (query.includes('שמע') || query.includes('432') || query.includes('מוזיקה') || query.includes('audio') || query.includes('ריכוז') || query.includes('focus')) {
      setActiveTab('audio_focus');
      setCommandFeedback(currentLang === 'he' ? 'טוען מעבדת שמע בינאורלית 432Hz 🎧' : 'Loading 432Hz Audio Focus Lab 🎧');
    } else if (query.includes('מגן') || query.includes('נוסטרו') || query.includes('drawdown') || query.includes('shield') || query.includes('prop')) {
      setActiveTab('prop_shield');
      setCommandFeedback(currentLang === 'he' ? 'טוען מגן נוסטרו ובקרת Drawdown 🛡️' : 'Loading Prop Shield & Risk Gate 🛡️');
    } else if (query.includes('הדמיה') || query.includes('replay') || query.includes('סרט') || query.includes('motion')) {
      setActiveTab('motion_replay');
      setCommandFeedback(currentLang === 'he' ? 'טוען הדמיית מסחר סינמטית 🎬' : 'Loading Cinematic Trade Replay 🎬');
    } else if (query.includes('דרכון') || query.includes('passport') || query.includes('תעודה')) {
      setActiveTab('passport');
      setCommandFeedback(currentLang === 'he' ? 'טוען דרכון הישגים הולוגרפי 🏆' : 'Loading Holographic Passport 🏆');
    } else if (query.includes('סרטון') || query.includes('video') || query.includes('tiktok') || query.includes('reels')) {
      setActiveTab('videos');
      setCommandFeedback(currentLang === 'he' ? 'טוען יוצר סרטוני מדיה 9:16 📱' : 'Loading 9:16 Media Studio 📱');
    } else {
      onLaunchApp();
    }

    setTimeout(() => {
      setCommandFeedback(null);
    }, 2800);
  };

  // Multilingual content
  const texts = {
    he: {
      brandKicker: 'DISCIPLINE STUDIO // TRADING DISCIPLINE SUITE',
      portalBadge: 'משמעת מסחר מדעית ✦',
      heroTitlePrefix: 'הפוך מסחר אמוציונלי למערכת',
      heroTitleHighlight: 'מדעית ומדויקת',
      heroSubtitle: 'סוויטת המסחר הראשונה מסוגה המבוססת על פסיכולוגיה מנטלית, זיהוי סטיות משמעת בזמן אמת, והגנה בלתי מתפשרת על יחידות הסיכון (R-Units) שלך.',
      btnLaunchStudio: 'כניסה לסוויטת המסחר ⚡',
      btnExploreSuite: 'סיור במעבדות ✦',
      promptPlaceholder: 'מדוד את הביצועים שלך: ציון משמעת, פסיכולוגיה מנטלית ורווחי R...',
      statsDiscipline: '94.8%',
      statsDisciplineLabel: 'מדד משמעת ממוצע',
      statsRUnits: '+18.5 R',
      statsRUnitsLabel: 'רווח נטו ביחידות סיכון',
      statsStreak: '28 ימים',
      statsStreakLabel: 'רצף מסחר ממושמע ללא נקמה',
      navStudio: 'יומן מסחר',
      navTools: 'כלי המשמעת',
      navAnalytics: 'אנליטיקה',
      navAbout: 'הסיפור שלי',
      featuresTitle: 'כלי הסטודיו למסחר ממושמע',
      featuresSubtitle: 'שילוב עמוק בין פסיכולוגיה קוגניטיבית לניהול מתמטי קפדני של יחידות סיכון',
      tool1Title: 'מנוע משמעת אוטומטי (Discipline Engine)',
      tool1Desc: 'אלגוריתם חכם שמזהה סטיות מסחר (FOMO, יציאה מוקדמת, הזזת סטופ) ומחשב ציון משמעת מ-1 עד 10.',
      tool2Title: 'רדאר מצב מנטלי (Mental Flow Radar)',
      tool2Desc: 'מעקב בזמן אמת אחרי רמות הלחץ, הדחף לנקמה, והאופוריה כדי למנוע את העסקה ההרסנית הבאה.',
      tool3Title: 'מחשבון R-Factor אובייקטיבי',
      tool3Desc: 'מנטרל לחלוטין את החרדה מהכסף הדולרי ומודד הצלחה לפי מכפילי סיכון מקצועיים (R-Multiples).',
      tool4Title: 'מטריצת ביצועים כרונולוגית',
      tool4Desc: 'לוח שנה אינטראקטיבי הממפה קשרים ישירים בין המצב הפסיכולוגי לתוצאות המסחר לאורך חודשים.',
      tool5Title: 'מגן חשבונות נוסטרו (Prop Firm Shield)',
      tool5Desc: 'הגנה מקסימלית על יתרת ה-Drawdown ובקרה הדוקה על עמידה בחוקי סיכון נוקשים.',
      tool6Title: 'יוצר תוכן וסרטונים 9:16 (Media Kit)',
      tool6Desc: 'סימולטור סרטוני טיקטוק ורילס, יצירת פוסטים שיווקיים מעוצבים, ומודעות ויזואליות בלחיצת כפתור.',
      ctaTitle: 'מוכן לעבור מסחר של הימורים למסחר של אלופים?',
      ctaSubtitle: 'הצטרף למסע המשמעת המקצועי — ביצוע חוקים בלתי מתפשר, ניהול סיכונים קפדני ועקביות מתמשכת.',
      ctaButton: 'הפעל את יומן המסחר עכשיו ⚡',
      adPosterTab: 'מודעת פרסום 9:16 🔥',
      tabPortal: 'פורטל ראשי',
      tabPromptLab: 'תרחישי AI ✦',
      tabMotionReplay: 'הדמיית מסחר 🎬',
      tabAudioFocus: 'מעבדת שמע 432Hz 🎧',
      tabPropShield: 'מגן נוסטרו 🛡️',
      tabPassport: 'דרכון הישגים 🏆',
      tabCommunity: 'קהילה וניצחונות 🌐',
      tabVideos: 'סרטונים 📱',
      tabImages: 'פוסטים 🖼️',
      creatorLabel: 'פותח ע״י אורן כהן · My Discipline Journey',
      inputDiscipline: 'ציון משמעת להצגה',
      inputProfit: 'רווח ביחידות R',
      inputMental: 'מצב מנטלי',
      btnGeneratePost: 'צור פוסט שיווקי מוכן',
      btnCopyPost: 'העתק פוסט לרשתות 📋',
      postCopied: 'הועתק בהצלחה! ✨'
    },
    en: {
      brandKicker: 'DISCIPLINE STUDIO // TRADING DISCIPLINE SUITE',
      portalBadge: 'PROFESSIONAL TRADING DISCIPLINE ✦',
      heroTitlePrefix: 'Turn Emotional Trading Into',
      heroTitleHighlight: 'Cinematic Discipline',
      heroSubtitle: 'The premier AI-native trading performance suite engineered around mental psychology, instant deviation detection, and uncompromising risk-unit (R) capital protection.',
      btnLaunchStudio: 'Enter Discipline Studio ⚡',
      btnExploreSuite: 'Explore Suite ✦',
      promptPlaceholder: 'Analyze today\'s execution: discipline rating, psychological flow, and R-factor...',
      statsDiscipline: '94.8%',
      statsDisciplineLabel: 'Average Discipline Index',
      statsRUnits: '+18.5 R',
      statsRUnitsLabel: 'Accumulated Net Risk Units',
      statsStreak: '28 Days',
      statsStreakLabel: 'Revenge-Free Discipline Streak',
      navStudio: 'Journal Studio',
      navTools: 'Discipline Tools',
      navAnalytics: 'Analytics',
      navAbout: 'My Story',
      featuresTitle: 'Professional Trading Discipline Tools',
      featuresSubtitle: 'Seamless fusion of behavioral psychology and strict mathematical risk-unit management',
      tool1Title: 'Automated Discipline Engine',
      tool1Desc: 'Real-time algorithm detecting trading rule deviations (FOMO, early exits, stop-widening) scoring execution 1-10.',
      tool2Title: 'Mental Flow State Radar',
      tool2Desc: 'Tracks stress, fatigue, euphoric overconfidence, and revenge urges to eliminate catastrophic tilt.',
      tool3Title: 'Objective R-Factor Cockpit',
      tool3Desc: 'Eliminates dollar-based anxiety by measuring performance strictly in objective risk multiples (R-Units).',
      tool4Title: 'Psychological Execution Matrix',
      tool4Desc: 'Interactive calendar correlating emotional states directly with P&L outcomes over monthly horizons.',
      tool5Title: 'Prop Firm & Drawdown Shield',
      tool5Desc: 'Safeguard funded accounts with strict daily drawdown guards and discipline enforcement gates.',
      tool6Title: '9:16 Video & Social Creative Studio',
      tool6Desc: 'Interactive TikTok/Reels video simulator, automated viral captions generator, and high-impact poster studio.',
      ctaTitle: 'Ready to Replace Gambling With Systematic Precision?',
      ctaSubtitle: 'Join the professional discipline journey — uncompromising rule execution, strict risk management, and lasting consistency.',
      ctaButton: 'Launch Discipline Journal Now ⚡',
      adPosterTab: '9:16 Vertical Ad 🔥',
      tabPortal: 'Discipline Portal',
      tabPromptLab: 'AI Scenarios ✦',
      tabMotionReplay: 'Trade Replay 🎬',
      tabAudioFocus: '432Hz Audio 🎧',
      tabPropShield: 'Prop Shield 🛡️',
      tabPassport: 'Discipline Passport 🏆',
      tabCommunity: 'Community Feed 🌐',
      tabVideos: 'Videos 📱',
      tabImages: 'Social Posts 🖼️',
      creatorLabel: 'Crafted by Oren Cohen · My Discipline Journey',
      inputDiscipline: 'Discipline Score to Display',
      inputProfit: 'Profit in R-Units',
      inputMental: 'Dominant Mental State',
      btnGeneratePost: 'Generate Viral Post',
      btnCopyPost: 'Copy Post to Clipboard 📋',
      postCopied: 'Copied to Clipboard! ✨'
    },
    ar: {
      brandKicker: 'DISCIPLINE STUDIO // منصة انضباط التداول',
      portalBadge: 'انضباط التداول العلمي ✦',
      heroTitlePrefix: 'حوّل التداول العاطفي إلى نظام',
      heroTitleHighlight: 'علمي ودقيق',
      heroSubtitle: 'الجناح الأول من نوعه لإدارة علم النفس التجاري، ورصد الانحرافات اللحظية، وحماية وحدات المخاطر (R).',
      btnLaunchStudio: 'الدخول إلى المنصة ⚡',
      btnExploreSuite: 'استكشف الأدوات ✦',
      promptPlaceholder: 'سجل أداء اليوم: تقييم الانضباط، الحالة النفسية ووحدات المخاطر...',
      statsDiscipline: '94.8%',
      statsDisciplineLabel: 'مؤشر الانضباط',
      statsRUnits: '+18.5 R',
      statsRUnitsLabel: 'صافي وحدات المخاطر R',
      statsStreak: '28 يوماً',
      statsStreakLabel: 'تداول منتظم بدون انتقام',
      navStudio: 'دفتر التداول',
      navTools: 'أدوات الانضباط',
      navAnalytics: 'التحليلات',
      navAbout: 'قصتي',
      featuresTitle: 'أدوات احترافية للانضباط في التداول',
      featuresSubtitle: 'مزيج فريد بين علم النفس السلوكي وإدارة المخاطر الرياضية الصارمة',
      tool1Title: 'محرك الانضباط التلقائي',
      tool1Desc: 'يرصد الانحرافات العاطفية ويحدد درجة انضباط التداول من 1 إلى 10.',
      tool2Title: 'رادار الحالة النفسية',
      tool2Desc: 'مراقبة التوتر والرغبة في الانتقام لمنع الخسائر الفادحة.',
      tool3Title: 'حاسبة وحدات المخاطرة R',
      tool3Desc: 'إلغاء الخوف من الأرقام المالية وقياس النتائج بوحدات R الدقيقة.',
      tool4Title: 'مصفوفة التداول النفسي',
      tool4Desc: 'تقويم يربط بين المزاج اليومي والنتائج المالية بوضوح.',
      tool5Title: 'درع حسابات التمويل',
      tool5Desc: 'حماية رأس المال من التراجع والالتزام الصارم بالقواعد.',
      tool6Title: 'استوديو الفيديو والمحتوى 9:16',
      tool6Desc: 'محاكي فيديوهات تيك توك وريلز مع نصوص احترافية وتصاميم متميزة.',
      ctaTitle: 'جاهز للتداول باحترافية وانضباط كامل؟',
      ctaSubtitle: 'انضم إلى رحلة الانضباط الاحترافية — التزام صارم بالقواعد وإدارة متقدمة للمخاطر.',
      ctaButton: 'تشغيل المنصة الآن ⚡',
      adPosterTab: 'إعلان 9:16 🔥',
      tabPortal: 'بوابة الانضباط',
      tabPromptLab: 'سيناريوهات AI ✦',
      tabMotionReplay: 'محاكي الصفقات 🎬',
      tabAudioFocus: 'صوتيات 432Hz 🎧',
      tabPropShield: 'درع التمويل 🛡️',
      tabPassport: 'جواز الانضباط 🏆',
      tabCommunity: 'المجتمع 🌐',
      tabVideos: 'الفيديو 📱',
      tabImages: 'المنشورات 🖼️',
      creatorLabel: 'تطوير אורין כהן · My Discipline Journey',
      inputDiscipline: 'نسبة الانضباط',
      inputProfit: 'الربח بوحدات R',
      inputMental: 'الحالة النفسية',
      btnGeneratePost: 'إنشاء منشور تسويقي',
      btnCopyPost: 'نسخ المنשור 📋',
      postCopied: 'تم النسخ بنجاح! ✨'
    },
    ru: {
      brandKicker: 'DISCIPLINE STUDIO // СИСТЕМА ТОРГОВОЙ ДИСЦИПЛИНЫ',
      portalBadge: 'ДИСЦИПЛИНА ТРЕЙДИНГА ✦',
      heroTitlePrefix: 'Превратите эмоции в',
      heroTitleHighlight: 'Кинематографическую Дисциплину',
      heroSubtitle: 'Передовая рабочая среда трейдера, основанная на контроле психологии, мгновенном выявлении нарушений правил и строгой защите единиц риска (R).',
      btnLaunchStudio: 'Войти в студию трейдинга ⚡',
      btnExploreSuite: 'Обзор студии ✦',
      promptPlaceholder: 'Оцените исполнение сегодня: индекс дисциплины, фокус и фактор R...',
      statsDiscipline: '94.8%',
      statsDisciplineLabel: 'Индекс дисциплины',
      statsRUnits: '+18.5 R',
      statsRUnitsLabel: 'Чистая прибыль в R-единицах',
      statsStreak: '28 дней',
      statsStreakLabel: 'Без импульсивных сделок',
      navStudio: 'Дневник трейдера',
      navTools: 'Инструменты дисциплины',
      navAnalytics: 'Аналитика',
      navAbout: 'Обо мне',
      featuresTitle: 'Профессиональные инструменты торговой дисциплины',
      featuresSubtitle: 'Глубокий синтез поведенческой психологии и математического риск-менеджмента',
      tool1Title: 'Движок дисциплины (Discipline Engine)',
      tool1Desc: 'Автоматически определяет нарушения правил (FOMO, ранний выход, перетягивание стопа) с оценкой от 1 до 10.',
      tool2Title: 'Радар психологического состояния',
      tool2Desc: 'Отслеживание стресса, усталости и импульса отыгрыша для предотвращения тильта.',
      tool3Title: 'Калькулятор R-фактора',
      tool3Desc: 'Устраняет денежную панику, рассчитывая результат строго в объективных единицах риска.',
      tool4Title: 'Матрица психологических сделок',
      tool4Desc: 'Интерактивный календарь, связывающий настроение трейдера с финансовым результатом месяца.',
      tool5Title: 'Защита проп-счетов (Prop Shield)',
      tool5Desc: 'Защита от просадки и строгий контроль за соблюдением торгового регламента.',
      tool6Title: 'Студия видео и постеров 9:16',
      tool6Desc: 'Симулятор роликов для TikTok и Reels с готовыми сценариями и генератором постов.',
      ctaTitle: 'Готовы заменить казино на математическую дисциплину?',
      ctaSubtitle: 'Присоединяйтесь к профессиональной дисциплине — строгое соблюдение правил и безупречный риск-менеджмент.',
      ctaButton: 'Запустить дневник сейчас ⚡',
      adPosterTab: 'Реклама 9:16 🔥',
      tabPortal: 'Портал дисциплины',
      tabPromptLab: 'AI Сценарии ✦',
      tabMotionReplay: 'Реплей сделок 🎬',
      tabAudioFocus: '432Гц Звук 🎧',
      tabPropShield: 'Проп-Щит 🛡️',
      tabPassport: 'Паспорт трейдера 🏆',
      tabCommunity: 'Комьюнити 🌐',
      tabVideos: 'Видео 📱',
      tabImages: 'Посты 🖼️',
      creatorLabel: 'Создано Ореном Коэном · My Discipline Journey',
      inputDiscipline: 'Индекс дисциплины',
      inputProfit: 'Прибыль в R-единицах',
      inputMental: 'Психологическое состояние',
      btnGeneratePost: 'Создать готовый пост',
      btnCopyPost: 'Копировать пост 📋',
      postCopied: 'Скопировано! ✨'
    }
  };

  const currentTexts = texts[currentLang] || texts.he;

  // Video Templates for Simulator
  const videoTemplates = [
    {
      id: 0,
      title: currentLang === 'he' ? 'קונספט 1: סוד ה-R-Units נגד חרדת כסף' : 'Concept 1: The R-Factor Formula',
      duration: '0:15',
      aspect: '9:16',
      tags: ['#TradingPsychology', '#Discipline', '#RiskReward'],
      captions: [
        currentLang === 'he' ? 'סוחרים מפסידים לא בגלל האסטרטגיה... אלא בגלל הפחד מהכסף! 💸' : 'Traders lose not because of strategy... but fear of money! 💸',
        currentLang === 'he' ? 'כשאתה מודד עסקאות בדולרים, הדופק שלך עולה פי 3 בכל תנועה.' : 'When you measure trades in cash, your heart rate triples on every tick.',
        currentLang === 'he' ? 'ב-Smart Journal אנחנו מודדים הכל ב-R-Units אובייקטיביות 🎯' : 'In Smart Journal, we measure strictly in objective R-Units 🎯',
        currentLang === 'he' ? 'תוצאה: ראש שקט, משמעת של קרן גידור, ורווחיות עקבית!' : 'Result: Calm mind, hedge fund discipline, and consistent alpha!'
      ]
    },
    {
      id: 1,
      title: currentLang === 'he' ? 'קונספט 2: מניעת עסקאות נקמה (Revenge Trading)' : 'Concept 2: Zero Revenge Trades',
      duration: '0:18',
      aspect: '9:16',
      tags: ['#NoRevengeTrading', '#MentalTrading', '#Mindset'],
      captions: [
        currentLang === 'he' ? 'הפסדת עסקה אחת? אל תיתן לאגו למחוק לך את כל החשבון 🛑' : 'Took a loss? Don’t let ego wipe out your entire account 🛑',
        currentLang === 'he' ? 'היומן מזהה רמות תסכול ועוצר אותך לפני שאתה לוחץ שוב.' : 'The journal detects emotional frustration before you click again.',
        currentLang === 'he' ? 'ציון המשמעת היומי שלך יראה לך בדיוק מתי לכבות את המסך.' : 'Your daily Discipline Score tells you exactly when to step away.',
        currentLang === 'he' ? 'שמור על ההון שלך. המשמעת היא היתרון היחיד שלך בשוק!' : 'Protect your capital. Discipline is your only true edge!'
      ]
    }
  ];

  // Video Simulator Timer
  useEffect(() => {
    let interval: any;
    if (isVideoPlaying) {
      interval = setInterval(() => {
        setVideoProgress((prev) => {
          if (prev >= 100) {
            setIsVideoPlaying(false);
            return 0;
          }
          return prev + 1.25;
        });
        setVideoCurrentTime((prev) => (prev >= 15 ? 0 : prev + 0.2));
      }, 200);
    }
    return () => clearInterval(interval);
  }, [isVideoPlaying]);

  // Social Caption Generator
  const handleGenerateCaption = () => {
    const text = currentLang === 'he'
      ? `📈 משמעת היא המפתח היחיד לרווחיות עקבית במסחר!
החודש עברתי מהימורים למסחר מבוסס מערכת מדעית עם Smart Journal 🧠

המדדים המאומתים שלי:
🎯 ציון משמעת: ${postDiscipline}
💰 רווח מצטבר: ${postProfit}
🧘‍♂️ מצב מנטלי דומיננטי: ${postMentalState}

מדידת ביצועים ביחידות סיכון (R-Units) מנטרלת את החרדה מהכסף ומביאה לשליטה עצמית מוחלטת!
✨ מסע המשמעת הרשמי: ניהול סיכונים קפדני וציות מלא לכללים ⚡
#מסחר_בשוק_ההון #משמעת_עצמית #פסיכולוגיית_מסחר #R_Units`
      : `📈 Discipline is the ONLY key to long-term profitability in trading!
This month I stopped gambling and operated with hedge-fund precision using Smart Journal 🧠

My verified metrics:
🎯 Discipline Index: ${postDiscipline}
💰 Accumulated Net: ${postProfit}
🧘‍♂️ Dominant Psychology: ${postMentalState}

Measuring performance in objective R-Units eliminates monetary panic and secures consistent alpha!
✨ Official Discipline Suite: Strict Risk Management & Rule Adherence ⚡
#trading #tradingpsychology #discipline #stocks #investing`;

    setGeneratedCaption(text);
    setIsCopied(false);
  };

  useEffect(() => {
    handleGenerateCaption();
  }, [postDiscipline, postProfit, postMentalState, currentLang]);

  const handleCopyCaption = () => {
    navigator.clipboard.writeText(generatedCaption);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 3000);
  };

  const activeCaptionIndex = Math.floor((videoProgress / 100) * videoTemplates[selectedVideoTemplate].captions.length);
  const activeCaption = videoTemplates[selectedVideoTemplate].captions[Math.min(activeCaptionIndex, videoTemplates[selectedVideoTemplate].captions.length - 1)];

  return (
    <div className="min-h-screen bg-[#07070a] text-slate-100 flex flex-col selection:bg-emerald-500 selection:text-black font-sans relative overflow-x-hidden" dir={isCurrentRtl ? 'rtl' : 'ltr'}>
      
      {/* Background Ambient Glows (Discipline Laser Emerald & Precision Cyan) */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        {/* Discipline Glow - Laser Emerald */}
        <div className="absolute -top-40 left-1/3 -translate-x-1/2 w-[850px] h-[520px] bg-gradient-to-b from-emerald-500/15 via-emerald-600/5 to-transparent rounded-full blur-[130px]" />
        {/* Precision Metrics Glow - Electric Cyan */}
        <div className="absolute top-[22%] right-[-80px] w-[650px] h-[550px] bg-gradient-to-b from-cyan-500/15 via-sky-600/5 to-transparent rounded-full blur-[140px]" />
        {/* Subtle matrix dots */}
        <div className="absolute inset-0 bg-[radial-gradient(#ffffff0a_1px,transparent_1px)] [background-size:24px_24px] opacity-40" />
      </div>

      {/* Sleek Top Bar */}
      <header className="sticky top-0 z-40 border-b border-white/[0.08] bg-[#07070a]/85 backdrop-blur-xl px-4 py-3 sm:px-8">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          
          {/* Brand Identity */}
          <div 
            onClick={() => setActiveTab('portal')}
            className="flex items-center gap-3 cursor-pointer group select-none"
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-400 via-teal-400 to-cyan-400 text-black flex items-center justify-center font-black shadow-lg shadow-emerald-500/20 text-base group-hover:scale-105 transition-transform">
              ✦
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-black text-sm tracking-tight text-white font-mono uppercase">DISCIPLINE</span>
                <span className="text-emerald-400/40 text-xs font-mono">/</span>
                <span className="font-bold text-xs tracking-wider text-emerald-400 font-mono">JOURNEY</span>
              </div>
              <div className="text-[10px] font-mono tracking-wider text-slate-400">
                {currentLang === 'he' ? 'מערכת משמעת וניהול סיכונים' : 'Trading Psychology & Risk Engine'}
              </div>
            </div>
          </div>

          {/* Center Navigation Bar (Desktop) */}
          <nav className="hidden lg:flex items-center gap-1 bg-white/[0.03] p-1 rounded-xl border border-white/[0.06]">
            {[
              { id: 'portal', label: currentTexts.tabPortal, icon: Cpu },
              { id: 'prompt_lab', label: currentTexts.tabPromptLab, icon: Terminal },
              { id: 'motion_replay', label: currentTexts.tabMotionReplay, icon: Video },
              { id: 'audio_focus', label: currentTexts.tabAudioFocus, icon: Waves },
              { id: 'prop_shield', label: currentTexts.tabPropShield, icon: ShieldCheck },
              { id: 'videos', label: currentTexts.tabVideos, icon: Tv },
            ].map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id as TabType)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                    isActive
                      ? 'bg-emerald-500 text-black font-black shadow-xs'
                      : 'text-slate-400 hover:text-white hover:bg-white/[0.04]'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Quick Links & Actions */}
          <div className="flex items-center gap-2 sm:gap-3">
            
            {/* Dual Language Switcher: Hebrew / English */}
            <div className="flex items-center bg-white/[0.05] p-1 rounded-xl border border-white/[0.1] shadow-inner font-mono text-xs shrink-0">
              <button
                type="button"
                onClick={() => switchLanguage('he')}
                className={`px-2.5 sm:px-3 py-1 rounded-lg font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                  currentLang === 'he'
                    ? 'bg-emerald-500 text-black shadow-md font-black'
                    : 'text-slate-400 hover:text-white hover:bg-white/[0.05]'
                }`}
                title="צפה בעברית"
              >
                <span>🇮🇱</span>
                <span>עברית</span>
              </button>
              <button
                type="button"
                onClick={() => switchLanguage('en')}
                className={`px-2.5 sm:px-3 py-1 rounded-lg font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                  currentLang === 'en'
                    ? 'bg-emerald-500 text-black shadow-md font-black'
                    : 'text-slate-400 hover:text-white hover:bg-white/[0.05]'
                }`}
                title="View in English"
              >
                <span>🇺🇸</span>
                <span>English</span>
              </button>
            </div>

            {onOpenAboutMe && (
              <button
                type="button"
                onClick={onOpenAboutMe}
                className="hidden sm:flex px-3 py-1.5 rounded-xl bg-white/[0.03] hover:bg-white/[0.08] text-slate-300 hover:text-white text-xs font-semibold border border-white/[0.08] items-center gap-1.5 transition-all cursor-pointer"
                title="About Me / The Discipline Story"
              >
                <User className="w-3.5 h-3.5 text-amber-400" />
                <span>{currentTexts.navAbout}</span>
              </button>
            )}

            {onOpenAnalytics && (
              <button
                type="button"
                onClick={onOpenAnalytics}
                className="hidden sm:flex px-3 py-1.5 rounded-xl bg-white/[0.03] hover:bg-white/[0.08] text-slate-300 hover:text-white text-xs font-semibold border border-white/[0.08] items-center gap-1.5 transition-all cursor-pointer"
                title="Analytics"
              >
                <Activity className="w-3.5 h-3.5 text-indigo-400" />
                <span>{currentTexts.navAnalytics}</span>
              </button>
            )}

            {/* Launch Workspace Primary Button */}
            <button
              onClick={onLaunchApp}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-500 via-teal-400 to-emerald-400 hover:from-emerald-400 hover:to-teal-300 text-black font-extrabold text-xs transition-all shadow-lg shadow-emerald-500/25 flex items-center gap-1.5 cursor-pointer active:scale-95 group"
            >
              <span>{currentTexts.btnLaunchStudio}</span>
              <ChevronRight className="w-3.5 h-3.5 stroke-[2.5] group-hover:translate-x-0.5 transition-transform" />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile/Compact Subnav Strip */}
      <div className="lg:hidden border-b border-white/[0.06] bg-[#07070a]/95 py-2 px-3 sticky top-[57px] z-30 backdrop-blur-md overflow-x-auto no-scrollbar">
        <div className="flex items-center gap-1.5 min-w-max">
          {[
            { id: 'portal', label: currentTexts.tabPortal, icon: Cpu },
            { id: 'prompt_lab', label: currentTexts.tabPromptLab, icon: Terminal },
            { id: 'motion_replay', label: currentTexts.tabMotionReplay, icon: Video },
            { id: 'audio_focus', label: currentTexts.tabAudioFocus, icon: Waves },
            { id: 'prop_shield', label: currentTexts.tabPropShield, icon: ShieldCheck },
            { id: 'videos', label: currentTexts.tabVideos, icon: Tv },
          ].map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id as TabType)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                  isActive
                    ? 'bg-emerald-500 text-black font-black'
                    : 'text-slate-400 hover:text-white bg-white/[0.02]'
                }`}
              >
                <Icon className="w-3 h-3" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Studio Canvas */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 py-8 sm:px-8 relative z-10">
        
        {/* Navigation Breadcrumb when inside dedicated tool tab */}
        {activeTab !== 'portal' && (
          <div className="mb-6 flex items-center justify-between pb-3 border-b border-white/[0.08]">
            <button
              onClick={() => setActiveTab('portal')}
              className="flex items-center gap-2 text-xs font-mono text-emerald-400 hover:text-emerald-300 transition-colors cursor-pointer group"
            >
              <ArrowLeft className={`w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform ${isCurrentRtl ? 'rotate-180 group-hover:translate-x-0.5' : ''}`} />
              <span>{currentLang === 'he' ? 'חזרה לפורטל הראשי' : 'Back to Main Portal'}</span>
            </button>
            <div className="flex items-center gap-2 text-[11px] font-mono text-slate-400">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>DISCIPLINE // ACTIVE SUITE</span>
            </div>
          </div>
        )}

        {/* TAB 1: MAIN DISCIPLINE PORTAL EXPERIENCE */}
        {activeTab === 'portal' && (
          <div className="space-y-24 py-4 animate-fade-in">
            
            {/* HERO SECTION */}
            <div className="relative pt-6 sm:pt-12 text-center max-w-4xl mx-auto space-y-6">
              
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-mono tracking-wider shadow-sm">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>{currentTexts.brandKicker}</span>
                <span className="text-white/20">|</span>
                <span className="text-emerald-300 font-semibold">{currentTexts.portalBadge}</span>
              </div>

              <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight leading-[1.08] text-white">
                <span>{currentTexts.heroTitlePrefix} </span>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-300 drop-shadow-sm">
                  {currentTexts.heroTitleHighlight}
                </span>
              </h1>

              {/* Core Principle Badge */}
              <div className="flex flex-wrap items-center justify-center gap-3 pt-1">
                <div className="flex items-center gap-2.5 px-4 py-2 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-mono shadow-xs backdrop-blur-md">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="font-bold">
                    {currentLang === 'he' ? 'משמעת ברזל' : 'Iron Discipline'}
                  </span>
                  <span className="text-white/30">•</span>
                  <span className="text-slate-200">
                    {currentLang === 'he' ? 'ניהול סיכונים מתמטי ושליטה עצמית מוחלטת' : 'Mathematical Risk & Unwavering Self-Control'}
                  </span>
                </div>
              </div>

              <p className="text-slate-400 text-base sm:text-lg leading-relaxed max-w-2xl mx-auto font-normal">
                {currentTexts.heroSubtitle}
              </p>

              {/* Interactive Command Launcher */}
              <div className="pt-2 max-w-2xl mx-auto space-y-3">
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleExecuteHeroCommand();
                  }}
                  className="p-2 sm:p-2.5 rounded-2xl bg-white/[0.04] border border-white/[0.12] hover:border-emerald-500/40 focus-within:border-emerald-500/60 shadow-2xl backdrop-blur-xl flex flex-col sm:flex-row items-center gap-2 transition-all"
                >
                  <div className="flex-1 px-3 py-1.5 text-start flex items-center gap-2.5 w-full">
                    <Terminal className="w-4 h-4 text-emerald-400 shrink-0" />
                    <input
                      type="text"
                      value={heroPromptInput}
                      onChange={(e) => setHeroPromptInput(e.target.value)}
                      placeholder={currentTexts.promptPlaceholder}
                      className="w-full bg-transparent border-none text-xs text-slate-200 placeholder-slate-400/80 font-mono focus:outline-none"
                    />
                    {heroPromptInput && (
                      <button
                        type="button"
                        onClick={() => setHeroPromptInput('')}
                        className="text-slate-400 hover:text-white text-xs cursor-pointer px-1"
                      >
                        ✕
                      </button>
                    )}
                  </div>

                  <div className="flex items-center gap-2 w-full sm:w-auto shrink-0">
                    <button
                      type="submit"
                      className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 via-teal-400 to-emerald-400 hover:from-emerald-400 hover:to-teal-300 text-black font-extrabold text-xs transition-all shadow-md shadow-emerald-500/25 flex items-center justify-center gap-1.5 cursor-pointer active:scale-95 shrink-0"
                    >
                      <Zap className="w-3.5 h-3.5 fill-black" />
                      <span>{currentLang === 'he' ? 'הפעל פקודה ⚡' : 'Run Directive ⚡'}</span>
                    </button>
                  </div>
                </form>

                {commandFeedback && (
                  <div className="px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-mono animate-fade-in inline-flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                    <span>{commandFeedback}</span>
                  </div>
                )}

                {/* Quick Suggestion Chips */}
                <div className="flex items-center justify-center gap-1.5 flex-wrap pt-1">
                  <span className="text-[11px] font-mono text-slate-400 shrink-0">
                    {currentLang === 'he' ? 'פקודות מהירות:' : 'Quick Directives:'}
                  </span>
                  {(currentLang === 'he' ? [
                    { label: '🛑 עסקת נקמה (Revenge)', query: 'עסקת נקמה' },
                    { label: '🎯 בדיקת ציון משמעת', query: 'ציון משמעת' },
                    { label: '📊 יחידות סיכון R', query: 'יחידות R' },
                    { label: '🎧 מעבדת פוקוס 432Hz', query: 'שמע 432Hz' },
                    { label: '🛡️ מגן נוסטרו Drawdown', query: 'מגן נוסטרו' },
                  ] : [
                    { label: '🛑 Revenge Tilt Guard', query: 'revenge' },
                    { label: '🎯 Discipline Score', query: 'discipline' },
                    { label: '📊 Risk-Units (R)', query: 'risk units' },
                    { label: '🎧 432Hz Focus Lab', query: 'audio focus' },
                    { label: '🛡️ Prop Firm Shield', query: 'prop shield' },
                  ]).map((chip, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => {
                        setHeroPromptInput(chip.query);
                        handleExecuteHeroCommand(chip.query);
                      }}
                      className="px-2.5 py-1 rounded-lg bg-white/[0.03] hover:bg-emerald-500/15 border border-white/[0.08] hover:border-emerald-500/30 text-[11px] font-mono text-slate-300 hover:text-emerald-300 transition-all cursor-pointer"
                    >
                      {chip.label}
                    </button>
                  ))}
                </div>

                {/* Trust Badges */}
                <div className="flex items-center justify-center gap-4 sm:gap-6 pt-2 text-xs text-slate-400 font-mono flex-wrap">
                  {(currentLang === 'he' ? [
                    'סנכרון ענן בזמן אמת',
                    'הגנה מלאה מעסקאות נקמה ו-Tilt',
                    'מדידת יחידות סיכון R מתמטית'
                  ] : [
                    'Real-Time Cloud Persistence',
                    'Zero Tilt & Revenge Protection',
                    'Hedge-Fund R-Factor Precision'
                  ]).map((badge, idx) => (
                    <div key={idx} className="flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      <span>{badge}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* DISCIPLINE HERO COCKPIT */}
              <div className="pt-8 relative">
                <div className="rounded-3xl bg-gradient-to-b from-white/[0.08] to-transparent p-[1px] shadow-2xl">
                  <div className="rounded-[23px] bg-[#0d0d12]/95 border border-white/[0.08] overflow-hidden backdrop-blur-2xl">
                    
                    <div className="px-5 py-3 border-b border-white/[0.07] bg-white/[0.02] flex items-center justify-between gap-3 text-xs">
                      <div className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full bg-rose-500/80 inline-block" />
                        <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80 inline-block" />
                        <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80 inline-block" />
                        <span className="ml-2 font-mono text-slate-400 font-bold hidden sm:inline">DISCIPLINE_STUDIO_COCKPIT // v3.2</span>
                      </div>

                      <div className="flex items-center gap-1 bg-black/40 p-1 rounded-xl border border-white/[0.06]">
                        <button
                          onClick={() => setHeroActiveView('cockpit')}
                          className={`px-2.5 py-1 rounded-lg font-mono text-[11px] font-bold transition-all cursor-pointer ${
                            heroActiveView === 'cockpit'
                              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                              : 'text-slate-400 hover:text-white'
                          }`}
                        >
                          Studio Cockpit
                        </button>
                        <button
                          onClick={() => setHeroActiveView('discipline')}
                          className={`px-2.5 py-1 rounded-lg font-mono text-[11px] font-bold transition-all cursor-pointer ${
                            heroActiveView === 'discipline'
                              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                              : 'text-slate-400 hover:text-white'
                          }`}
                        >
                          Discipline Radar
                        </button>
                        <button
                          onClick={() => setHeroActiveView('risk')}
                          className={`px-2.5 py-1 rounded-lg font-mono text-[11px] font-bold transition-all cursor-pointer ${
                            heroActiveView === 'risk'
                              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                              : 'text-slate-400 hover:text-white'
                          }`}
                        >
                          R-Factor
                        </button>
                        <button
                          onClick={() => setHeroActiveView('mockup')}
                          className={`px-2.5 py-1 rounded-lg font-mono text-[11px] font-bold transition-all cursor-pointer ${
                            heroActiveView === 'mockup'
                              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                              : 'text-slate-400 hover:text-white'
                          }`}
                        >
                          Mobile App
                        </button>
                      </div>

                      <div className="hidden md:flex items-center gap-2 font-mono text-[11px] text-emerald-400">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                        <span>LIVE PERSISTENCE</span>
                      </div>
                    </div>

                    <div className="p-6 sm:p-8">
                      {heroActiveView === 'cockpit' && (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-start">
                          {/* Pillar 1: Discipline (Emerald) */}
                          <div className="p-5 rounded-2xl bg-white/[0.02] border border-emerald-500/25 space-y-3 relative overflow-hidden group hover:border-emerald-500/50 transition-all shadow-sm">
                            <div className="flex items-center justify-between text-xs text-slate-400 font-mono">
                              <span className="flex items-center gap-1.5 text-emerald-400 font-bold">
                                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                                <span>משמעת // DISCIPLINE</span>
                              </span>
                              <span className="px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-300 font-bold text-[10px]">OPTIMAL</span>
                            </div>
                            <div className="flex items-baseline gap-2">
                              <span className="text-4xl font-black text-white font-mono">{currentTexts.statsDiscipline}</span>
                              <span className="text-xs text-emerald-400 font-bold">+4.2% vs last mo</span>
                            </div>
                            <div className="w-full bg-white/[0.06] h-2 rounded-full overflow-hidden">
                              <div className="bg-gradient-to-r from-emerald-500 to-teal-400 h-full w-[94.8%]" />
                            </div>
                            <p className="text-xs text-slate-400 leading-relaxed font-sans">
                              {currentTexts.statsDisciplineLabel} · אפס חריגות מכללי המסחר ב-28 ימי מסחר רצופים.
                            </p>
                          </div>

                          {/* Pillar 2: Risk Precision (Cyan) */}
                          <div className="p-5 rounded-2xl bg-white/[0.02] border border-cyan-500/25 space-y-3 relative overflow-hidden group hover:border-cyan-500/50 transition-all shadow-sm">
                            <div className="flex items-center justify-between text-xs text-slate-400 font-mono">
                              <span className="flex items-center gap-1.5 text-cyan-400 font-bold">
                                <span className="w-2 h-2 rounded-full bg-cyan-400" />
                                <span>{currentLang === 'en' ? 'RISK PRECISION' : 'דיוק וניהול סיכונים // RISK PRECISION'}</span>
                              </span>
                              <span className="px-1.5 py-0.5 rounded bg-cyan-500/10 text-cyan-300 font-bold text-[10px]">1:2.8 AVG R</span>
                            </div>
                            <div className="flex items-baseline gap-2">
                              <span className="text-4xl font-black text-cyan-300 font-mono">{currentTexts.statsRUnits}</span>
                              <span className="text-xs text-slate-400 font-bold">{currentLang === 'en' ? 'Net Risk Units' : 'יחידות סיכון נטו'}</span>
                            </div>
                            <div className="flex items-center gap-1.5 text-xs font-mono text-slate-300">
                              <span className="px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-300 border border-cyan-500/30 font-bold">+3.2R TP</span>
                              <span className="px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-300 border border-cyan-500/30 font-bold">+2.0R TP</span>
                              <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-400 border border-white/10 font-bold">-1.0R SL</span>
                            </div>
                            <p className="text-xs text-slate-400 leading-relaxed font-sans">
                              {currentTexts.statsRUnitsLabel} · {currentLang === 'en' ? 'Total neutralization of money anxiety via objective R-multiples.' : 'נטרול מלא של חרדת הכסף על ידי מדידה מדויקת ב-R.'}
                            </p>
                          </div>

                          {/* Pillar 3: Mental Mastery (Emerald / Amber) */}
                          <div className="p-5 rounded-2xl bg-white/[0.02] border border-amber-500/25 space-y-3 relative overflow-hidden group hover:border-amber-500/50 transition-all shadow-sm">
                            <div className="flex items-center justify-between text-xs text-slate-400 font-mono">
                              <span className="flex items-center gap-1.5 text-amber-400 font-bold">
                                <span className="w-2 h-2 rounded-full bg-amber-400" />
                                <span>{currentLang === 'en' ? 'MENTAL MASTERY // FLOW' : 'שליטה מנטלית // MENTAL MASTERY'}</span>
                              </span>
                              <span className="px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-300 font-bold text-[10px]">CALM & ZEN</span>
                            </div>
                            <div className="flex items-baseline gap-2">
                              <span className="text-4xl font-black text-amber-300 font-mono">{currentTexts.statsStreak}</span>
                              <span className="text-xs text-amber-400 font-bold">{currentLang === 'en' ? 'Steady Streak' : 'רצף יציב'}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                              <span className="text-xs font-mono text-emerald-300">
                                {currentLang === 'en' ? 'Revenge Radar: 0 Impulsive Trades' : 'רדאר נקמה: 0 עסקאות אימפולסיביות'}
                              </span>
                            </div>
                            <p className="text-xs text-slate-400 leading-relaxed font-sans">
                              {currentTexts.statsStreakLabel} · {currentLang === 'en' ? 'Eliminating emotional tilt and maintaining long-term equity growth.' : 'יציאה מהפסדים ועלייה למסלול של צמיחה מתמשכת.'}
                            </p>
                          </div>
                        </div>
                      )}

                      {heroActiveView === 'discipline' && (
                        <div className="space-y-4 text-start">
                          <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.06] flex items-center justify-between">
                            <span className="font-mono text-sm text-white font-bold">Rule Deviation Radar</span>
                            <span className="text-xs font-mono text-emerald-400">Strict Enforcement Active</span>
                          </div>
                          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono">
                            <div className="p-3 rounded-lg bg-black/40 border border-white/[0.06]">
                              <div className="text-slate-400">FOMO Entries</div>
                              <div className="text-lg font-bold text-emerald-400">0%</div>
                            </div>
                            <div className="p-3 rounded-lg bg-black/40 border border-white/[0.06]">
                              <div className="text-slate-400">Early Exits</div>
                              <div className="text-lg font-bold text-emerald-400">2% (Controlled)</div>
                            </div>
                            <div className="p-3 rounded-lg bg-black/40 border border-white/[0.06]">
                              <div className="text-slate-400">Stop Widening</div>
                              <div className="text-lg font-bold text-emerald-400">0% (Strict)</div>
                            </div>
                            <div className="p-3 rounded-lg bg-black/40 border border-white/[0.06]">
                              <div className="text-slate-400">Daily Trade Cap</div>
                              <div className="text-lg font-bold text-emerald-400">3 Trades Max</div>
                            </div>
                          </div>
                        </div>
                      )}

                      {heroActiveView === 'risk' && (
                        <div className="p-6 rounded-2xl bg-black/40 border border-white/[0.06] space-y-4 text-start font-mono">
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-slate-200 font-bold">Objective Mathematical Expectancy</span>
                            <span className="text-xs text-emerald-400">+1.45 R per trade avg</span>
                          </div>
                          <div className="h-32 w-full flex items-end gap-2 pt-4 border-b border-white/[0.08]">
                            {[1.2, 2.5, -1.0, 3.4, 1.8, -0.8, 2.9, 3.1, -1.0, 4.2].map((val, idx) => (
                              <div key={idx} className="flex-1 flex flex-col items-center gap-1 h-full justify-end">
                                <div 
                                  className={`w-full rounded-t transition-all ${val > 0 ? 'bg-emerald-500' : 'bg-rose-500'}`} 
                                  style={{ height: `${Math.abs(val) * 22}px` }}
                                />
                                <span className="text-[9px] text-slate-500">{val > 0 ? `+${val}` : val}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {heroActiveView === 'mockup' && (
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-8 py-4">
                          <div className="w-56 rounded-3xl overflow-hidden border border-white/[0.1] shadow-2xl">
                            <img src={promoPhoneImg} alt="Phone Mockup" className="w-full h-auto object-cover" />
                          </div>
                          <div className="max-w-sm text-start space-y-3">
                            <div className="text-xs font-mono text-emerald-400">CROSS-PLATFORM SUITE</div>
                            <h3 className="text-xl font-bold text-white">Always in Sync</h3>
                            <p className="text-xs text-slate-400 leading-relaxed">
                              Open your trading cockpit on desktop or mobile browser. Real-time Firestore synchronization guarantees your discipline history is everywhere you trade.
                            </p>
                            <button
                              onClick={onLaunchApp}
                              className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-extrabold text-xs cursor-pointer shadow-md"
                            >
                              Open Mobile Workspace 📱
                            </button>
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="px-6 py-4 bg-white/[0.02] border-t border-white/[0.06] flex flex-col sm:flex-row items-center justify-between gap-4">
                      <div className="flex items-center gap-3 text-xs font-mono">
                        <span className="flex items-center gap-1.5 text-emerald-400 font-semibold">
                          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                          <span>{currentLang === 'en' ? 'Discipline: 94.8%' : 'משמעת: 94.8%'}</span>
                        </span>
                        <span className="text-white/20">•</span>
                        <span className="flex items-center gap-1.5 text-cyan-400 font-semibold">
                          <span className="w-2 h-2 rounded-full bg-cyan-400" />
                          <span>{currentLang === 'en' ? 'Profit: +18.5 R' : 'רווח: +18.5 R'}</span>
                        </span>
                        <span className="text-white/20">•</span>
                        <span className="flex items-center gap-1.5 text-amber-400 font-semibold">
                          <span className="w-2 h-2 rounded-full bg-amber-400" />
                          <span>{currentLang === 'en' ? 'Execution: 100% Rules' : 'ציות: 100% לכללים'}</span>
                        </span>
                      </div>

                      <button
                        onClick={onLaunchApp}
                        className="px-5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-black text-xs transition-all shadow-md cursor-pointer flex items-center gap-1.5"
                      >
                        <span>{currentTexts.btnLaunchStudio}</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>

                  </div>
                </div>
              </div>

            </div>

            {/* SECTION 2: DISCIPLINE SCENARIO & TILT PROMPT SIMULATOR */}
            <div className="pt-12 border-t border-white/[0.06]">
              <DisciplinePromptSimulator language={language} onLaunchApp={onLaunchApp} />
            </div>

            {/* SECTION 3: CINEMATIC TRADE REPLAY VISUALIZER */}
            <div className="pt-12 border-t border-white/[0.06]">
              <CinematicTradeVisualizer language={language} onLaunchApp={onLaunchApp} />
            </div>

            {/* SECTION 4: 6 DISCIPLINE TOOLS SHOWCASE */}
            <div className="space-y-12 max-w-6xl mx-auto pt-12 border-t border-white/[0.06]">
              <div className="text-center space-y-3">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-mono">
                  <span>✦ PROFESSIONAL DISCIPLINE SUITE</span>
                </div>
                <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
                  {currentTexts.featuresTitle}
                </h2>
                <p className="text-slate-400 text-sm max-w-2xl mx-auto">
                  {currentTexts.featuresSubtitle}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div 
                  onClick={() => setActiveTab('prompt_lab')}
                  className="p-6 rounded-2xl bg-white/[0.02] border border-white/[0.07] hover:border-emerald-500/40 transition-all space-y-4 group cursor-pointer"
                >
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center text-lg font-mono font-bold group-hover:scale-105 transition-transform">
                    <Cpu className="w-5 h-5 text-emerald-400" />
                  </div>
                  <h3 className="text-base font-bold text-white group-hover:text-emerald-300 transition-colors">
                    {currentTexts.tool1Title}
                  </h3>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    {currentTexts.tool1Desc}
                  </p>
                </div>

                <div 
                  onClick={() => setActiveTab('audio_focus')}
                  className="p-6 rounded-2xl bg-white/[0.02] border border-white/[0.07] hover:border-emerald-500/40 transition-all space-y-4 group cursor-pointer"
                >
                  <div className="w-10 h-10 rounded-xl bg-teal-500/10 border border-teal-500/20 text-teal-400 flex items-center justify-center text-lg font-mono font-bold group-hover:scale-105 transition-transform">
                    <Activity className="w-5 h-5 text-teal-400" />
                  </div>
                  <h3 className="text-base font-bold text-white group-hover:text-teal-300 transition-colors">
                    {currentTexts.tool2Title}
                  </h3>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    {currentTexts.tool2Desc}
                  </p>
                </div>

                <div 
                  onClick={() => setActiveTab('prop_shield')}
                  className="p-6 rounded-2xl bg-white/[0.02] border border-white/[0.07] hover:border-emerald-500/40 transition-all space-y-4 group cursor-pointer"
                >
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center text-lg font-mono font-bold group-hover:scale-105 transition-transform">
                    <Target className="w-5 h-5 text-emerald-400" />
                  </div>
                  <h3 className="text-base font-bold text-white group-hover:text-emerald-300 transition-colors">
                    {currentTexts.tool3Title}
                  </h3>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    {currentTexts.tool3Desc}
                  </p>
                </div>

                <div 
                  onClick={onLaunchApp}
                  className="p-6 rounded-2xl bg-white/[0.02] border border-white/[0.07] hover:border-emerald-500/40 transition-all space-y-4 group cursor-pointer"
                >
                  <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center text-lg font-mono font-bold group-hover:scale-105 transition-transform">
                    <Layers className="w-5 h-5 text-indigo-400" />
                  </div>
                  <h3 className="text-base font-bold text-white group-hover:text-indigo-300 transition-colors">
                    {currentTexts.tool4Title}
                  </h3>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    {currentTexts.tool4Desc}
                  </p>
                </div>

                <div 
                  onClick={() => setActiveTab('prop_shield')}
                  className="p-6 rounded-2xl bg-white/[0.02] border border-white/[0.07] hover:border-emerald-500/40 transition-all space-y-4 group cursor-pointer"
                >
                  <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center text-lg font-mono font-bold group-hover:scale-105 transition-transform">
                    <ShieldCheck className="w-5 h-5 text-amber-400" />
                  </div>
                  <h3 className="text-base font-bold text-white group-hover:text-amber-300 transition-colors">
                    {currentTexts.tool5Title}
                  </h3>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    {currentTexts.tool5Desc}
                  </p>
                </div>

                <div 
                  onClick={() => setActiveTab('passport')}
                  className="p-6 rounded-2xl bg-white/[0.02] border border-white/[0.07] hover:border-emerald-500/40 transition-all space-y-4 group cursor-pointer"
                >
                  <div className="w-10 h-10 rounded-xl bg-pink-500/10 border border-pink-500/20 text-pink-400 flex items-center justify-center text-lg font-mono font-bold group-hover:scale-105 transition-transform">
                    <Award className="w-5 h-5 text-pink-400" />
                  </div>
                  <h3 className="text-base font-bold text-white group-hover:text-pink-300 transition-colors">
                    {currentTexts.tool6Title}
                  </h3>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    {currentTexts.tool6Desc}
                  </p>
                </div>
              </div>
            </div>

            {/* SECTION 5: AMBIENT FOCUS AUDIO LAB */}
            <div className="pt-12 border-t border-white/[0.06]">
              <AmbientFocusAudioLab language={language} />
            </div>

            {/* SECTION 6: PROP FIRM CAPITAL SHIELD */}
            <div className="pt-12 border-t border-white/[0.06]">
              <PropFirmShieldCalculator language={language} onLaunchApp={onLaunchApp} />
            </div>

            {/* SECTION 7: COMMUNITY DISCIPLINE FEED */}
            <div className="pt-12 border-t border-white/[0.06]">
              <DisciplineCommunityFeed language={language} onLaunchApp={onLaunchApp} />
            </div>

            {/* SECTION 8: HOLOGRAPHIC PASSPORT GENERATOR */}
            <div className="pt-12 border-t border-white/[0.06]">
              <DisciplinePassportGenerator language={language} isPremium={isPremium} />
            </div>

            {/* CALL TO ACTION BANNER */}
            <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-br from-emerald-950/40 via-[#0d0d14] to-black border border-emerald-500/25 relative overflow-hidden max-w-5xl mx-auto shadow-2xl">
              <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8 text-center md:text-start">
                <div className="space-y-3 max-w-xl">
                  <span className="text-xs font-mono text-emerald-400 font-bold uppercase tracking-wider">
                    ✦ ACCREDITED DISCIPLINE PORTAL
                  </span>
                  <h2 className="text-2xl sm:text-3xl font-black text-white leading-tight">
                    {currentTexts.ctaTitle}
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                    {currentTexts.ctaSubtitle}
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0">
                  <button
                    onClick={onLaunchApp}
                    className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-gradient-to-r from-emerald-500 to-emerald-400 hover:from-emerald-400 hover:to-emerald-300 text-black font-extrabold text-sm transition-all shadow-xl shadow-emerald-500/30 flex items-center justify-center gap-2 cursor-pointer active:scale-95"
                  >
                    <span>{currentTexts.ctaButton}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>

                  <button
                    type="button"
                    onClick={() => setActiveTab('prompt_lab')}
                    className="w-full sm:w-auto px-5 py-3.5 rounded-2xl bg-gradient-to-r from-cyan-500/10 via-amber-500/10 to-emerald-500/10 hover:from-cyan-500/20 hover:to-emerald-500/20 text-cyan-300 hover:text-white font-mono text-sm transition-all border border-cyan-500/40 flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Sparkles className="w-4 h-4 text-amber-400" />
                    <span>{currentTexts.btnExploreSuite}</span>
                  </button>
                </div>
              </div>
            </div>

            {/* NEWSLETTER SIGNUP */}
            <div className="max-w-2xl mx-auto">
              <NewsletterSignup language={language} isRtl={isRtl} />
            </div>

          </div>
        )}

        {/* TAB 2: PROMPT LAB */}
        {activeTab === 'prompt_lab' && (
          <div className="py-4 animate-fade-in">
            <DisciplinePromptSimulator language={language} onLaunchApp={onLaunchApp} />
          </div>
        )}

        {/* TAB 3: MOTION REPLAY */}
        {activeTab === 'motion_replay' && (
          <div className="py-4 animate-fade-in">
            <CinematicTradeVisualizer language={language} onLaunchApp={onLaunchApp} />
          </div>
        )}

        {/* TAB 4: AUDIO FOCUS LAB */}
        {activeTab === 'audio_focus' && (
          <div className="py-4 animate-fade-in">
            <AmbientFocusAudioLab language={language} />
          </div>
        )}

        {/* TAB 5: PROP FIRM SHIELD */}
        {activeTab === 'prop_shield' && (
          <div className="py-4 animate-fade-in">
            <PropFirmShieldCalculator language={language} onLaunchApp={onLaunchApp} />
          </div>
        )}

        {/* TAB 6: PASSPORT GENERATOR */}
        {activeTab === 'passport' && (
          <div className="py-4 animate-fade-in">
            <DisciplinePassportGenerator language={language} isPremium={isPremium} />
          </div>
        )}

        {/* TAB 7: COMMUNITY FEED */}
        {activeTab === 'community' && (
          <div className="py-4 animate-fade-in">
            <DisciplineCommunityFeed language={language} onLaunchApp={onLaunchApp} />
          </div>
        )}

        {/* TAB 8: VIDEOS (TikTok / Reels Simulator) */}
        {activeTab === 'videos' && (
          <div className="space-y-8 max-w-5xl mx-auto py-4 animate-fade-in">
            <div className="text-center space-y-2">
              <span className="text-xs font-mono text-emerald-400 uppercase tracking-widest font-bold">
                ✦ TIKTOK & REELS VIRAL SIMULATOR
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-white">
                {language === 'he' ? 'סימולטור סרטונים שיווקיים 9:16' : '9:16 Marketing Video Simulator'}
              </h2>
              <p className="text-xs sm:text-sm text-slate-400 max-w-xl mx-auto">
                {language === 'he' ? 'בחר קונספט, צפה בהדמיית הסרטון וקבל תסריט קריינות וכתוביות מוכן להקלטה!' : 'Pick a concept, simulate video playback, and get production-ready viral trading scripts!'}
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              <div className="lg:col-span-5 flex flex-col items-center">
                <div className="relative w-64 aspect-[9/16] bg-black rounded-[2.5rem] border-4 border-slate-800 shadow-2xl overflow-hidden flex flex-col justify-between p-4">
                  <div className="flex items-center justify-between text-[10px] text-white/60 font-mono z-10">
                    <span>9:16 STUDIO</span>
                    <span className="flex items-center gap-1 text-rose-500 font-bold">
                      <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
                      REC
                    </span>
                  </div>

                  <div className="my-auto px-2 py-4 bg-black/70 backdrop-blur-md rounded-2xl border border-white/10 text-center space-y-2 z-10">
                    <span className="text-xs">🎯</span>
                    <p className="text-xs font-black text-emerald-300 leading-snug">
                      "{activeCaption}"
                    </p>
                  </div>

                  <div className="space-y-2 z-10">
                    <div className="w-full bg-white/20 h-1.5 rounded-full overflow-hidden">
                      <div className="bg-emerald-400 h-full transition-all" style={{ width: `${videoProgress}%` }} />
                    </div>
                    <div className="flex items-center justify-between">
                      <button
                        onClick={() => setIsVideoPlaying(!isVideoPlaying)}
                        className="p-2 rounded-full bg-emerald-500 text-black hover:bg-emerald-400 transition-all cursor-pointer"
                      >
                        {isVideoPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 fill-black" />}
                      </button>
                      <span className="text-[10px] font-mono text-white/70">
                        0:{Math.floor(videoCurrentTime).toString().padStart(2, '0')} / {videoTemplates[selectedVideoTemplate].duration}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-7 space-y-4">
                <div className="text-xs font-mono text-slate-400 font-bold">CHOOSE CONCEPT:</div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {videoTemplates.map((template, idx) => (
                    <button
                      key={template.id}
                      onClick={() => {
                        setSelectedVideoTemplate(idx);
                        setVideoProgress(0);
                        setVideoCurrentTime(0);
                        setIsVideoPlaying(true);
                      }}
                      className={`p-4 rounded-2xl border text-start transition-all cursor-pointer ${
                        selectedVideoTemplate === idx
                          ? 'bg-emerald-500/10 border-emerald-500 text-white'
                          : 'bg-white/[0.02] border-white/[0.08] text-slate-300 hover:border-white/20'
                      }`}
                    >
                      <div className="text-xs font-bold">{template.title}</div>
                      <div className="text-[10px] font-mono text-slate-400 mt-1">{template.duration} · {template.aspect}</div>
                    </button>
                  ))}
                </div>

                <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/[0.08] space-y-3 text-start">
                  <div className="text-xs font-mono text-emerald-400 font-bold">VOICEOVER SCRIPT:</div>
                  <div className="space-y-2">
                    {videoTemplates[selectedVideoTemplate].captions.map((cap, i) => (
                      <div key={i} className="text-xs text-slate-300 flex items-start gap-2">
                        <span className="font-mono text-emerald-500">{i + 1}.</span>
                        <span>{cap}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 9: IMAGES (Social Media Post Generator) */}
        {activeTab === 'images' && (
          <div className="space-y-8 max-w-4xl mx-auto py-4 animate-fade-in">
            <div className="text-center space-y-2">
              <span className="text-xs font-mono text-emerald-400 uppercase tracking-widest font-bold">
                ✦ SOCIAL PROOF & POST GENERATOR
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-white">
                {language === 'he' ? 'יוצר פוסטים שיווקיים לרשתות' : 'Viral Trading Post Generator'}
              </h2>
            </div>

            <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/[0.08] grid grid-cols-1 md:grid-cols-2 gap-6 text-start">
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-mono text-slate-300">{currentTexts.inputDiscipline}</label>
                  <input
                    type="text"
                    value={postDiscipline}
                    onChange={(e) => setPostDiscipline(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-black border border-white/[0.1] text-xs font-mono text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-mono text-slate-300">{currentTexts.inputProfit}</label>
                  <input
                    type="text"
                    value={postProfit}
                    onChange={(e) => setPostProfit(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-black border border-white/[0.1] text-xs font-mono text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-mono text-slate-300">{currentTexts.inputMental}</label>
                  <input
                    type="text"
                    value={postMentalState}
                    onChange={(e) => setPostMentalState(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-black border border-white/[0.1] text-xs font-mono text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div className="flex flex-col justify-between space-y-4">
                <textarea
                  readOnly
                  value={generatedCaption}
                  rows={8}
                  className="w-full p-4 rounded-xl bg-black border border-white/[0.1] text-xs text-slate-300 font-sans leading-relaxed resize-none focus:outline-none select-all"
                />

                <button
                  onClick={handleCopyCaption}
                  className={`w-full py-3 rounded-xl font-bold text-xs transition-all flex items-center justify-center gap-2 cursor-pointer ${
                    isCopied
                      ? 'bg-emerald-600 text-white'
                      : 'bg-emerald-500 hover:bg-emerald-400 text-black'
                  }`}
                >
                  {isCopied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  <span>{isCopied ? currentTexts.postCopied : currentTexts.btnCopyPost}</span>
                </button>
              </div>
            </div>
          </div>
        )}

      </main>

      {/* Footer */}
      <footer className="border-t border-white/[0.06] bg-[#050508] py-10 px-4 sm:px-8 mt-16 text-xs text-slate-400">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex flex-col sm:flex-row items-center gap-3">
            <span className="font-bold text-white">© 2026 My Discipline Journey</span>
            <span className="hidden sm:inline text-white/20">·</span>
            <span>{currentTexts.creatorLabel}</span>
          </div>

          <div className="flex items-center gap-4 flex-wrap justify-center font-mono">
            <div className="flex items-center gap-2 text-xs font-mono">
              <span className="text-emerald-400 font-bold">{currentLang === 'en' ? 'DISCIPLINE' : 'משמעת מדעית'}</span>
              <span className="text-white/20">•</span>
              <span className="text-cyan-400 font-bold">{currentLang === 'en' ? 'RISK PRECISION' : 'ניהול סיכונים'}</span>
              <span className="text-white/20">•</span>
              <span className="text-amber-400 font-bold">{currentLang === 'en' ? 'MENTAL MASTERY' : 'שליטה מנטלית'}</span>
              <span className="px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 text-[10px] border border-emerald-500/30">
                OFFICIAL SUITE
              </span>
            </div>

            <a
              href={`mailto:${SUPPORT_EMAIL}`}
              className="text-slate-300 hover:text-white flex items-center gap-1"
            >
              <Mail className="w-3.5 h-3.5 text-emerald-400" />
              <span>{SUPPORT_EMAIL}</span>
            </a>
          </div>

          <SocialLinks language={language} variant="compact" />
        </div>
      </footer>

    </div>
  );
}
