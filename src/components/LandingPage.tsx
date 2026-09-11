import React, { useState, useEffect } from 'react';
import { 
  Smartphone, 
  Play, 
  Pause, 
  Download, 
  Copy, 
  Check, 
  Sparkles, 
  Share2, 
  Video, 
  Image as ImageIcon, 
  ArrowLeft, 
  ExternalLink, 
  Lock, 
  Unlock, 
  TrendingUp, 
  Award, 
  Zap, 
  RotateCcw,
  Volume2,
  Tv,
  Eye,
  ArrowRight,
  MessageSquare,
  Flame,
  MousePointerClick
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

// Import the generated images
// @ts-ignore
import promoPhoneImg from '../assets/images/trading_promo_phone_mockup_1782954819150.jpg';
// @ts-ignore
import promoDisciplineImg from '../assets/images/trading_discipline_chart_promo_1782954834008.jpg';

interface LandingPageProps {
  onLaunchApp: () => void;
  language: 'he' | 'en' | 'ar' | 'ru';
  isRtl: boolean;
  isPremium: boolean;
  onTogglePremium: () => void;
}

export default function LandingPage({ 
  onLaunchApp, 
  language, 
  isRtl, 
  isPremium, 
  onTogglePremium 
}: LandingPageProps) {
  // Tabs for marketing tools: 'landing' (the main page), 'videos' (video simulator), 'images' (media center)
  const [activeTab, setActiveTab] = useState<'landing' | 'videos' | 'images'>('landing');
  
  // Video player simulator states
  const [selectedVideoTemplate, setSelectedVideoTemplate] = useState<number>(0);
  const [isVideoPlaying, setIsVideoPlaying] = useState<boolean>(false);
  const [videoProgress, setVideoProgress] = useState<number>(0);
  const [videoCurrentTime, setVideoCurrentTime] = useState<number>(0);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  
  // Custom Post Generator states
  const [postDiscipline, setPostDiscipline] = useState<string>('92%');
  const [postProfit, setPostProfit] = useState<string>('+18.5 R');
  const [postMentalState, setPostMentalState] = useState<string>('Calm & Focused');
  const [generatedCaption, setGeneratedCaption] = useState<string>('');
  const [isCopied, setIsCopied] = useState<boolean>(false);

  // Hebrew and English texts for the Landing Page
  const texts = {
    he: {
      heroBadge: '📈 יומן מסחר מנטלי מבוסס משמעת',
      heroTitle: 'הפוך מסחר אמוציונלי למערכת מדעית ומדויקת',
      heroSubtitle: 'יומן המסחר הממוחשב הראשון שמתמקד בפסיכולוגיה שלך, מזהה סטיות משמעת בזמן אמת, ועוזר לך להגן על יחידות הסיכון (R-Units) שלך.',
      btnLaunchDemo: 'כניסה לגרסה האינטראקטיבית ⚡',
      btnMediaKit: 'יוצר סרטונים ותמונות שיווקיות 🎬',
      watchPromoBtn: 'צפה בסרטון קידום חי',
      featuresTitle: 'למה סוחרים מצליחים משתמשים ב-Smart Journal?',
      featuresSubtitle: 'השילוב המושלם בין פסיכולוגיה מתקדמת לניהול סיכונים חשבונאי קשוח',
      
      feature1Title: '🧘‍♂️ מעקב מנטלי יומי',
      feature1Desc: 'תעד את רמת הלחץ, העייפות, האדישות או הדחף לנקמה בכל עסקת מסחר שבוצעה.',
      feature2Title: '📊 ציון משמעת אוטומטי',
      feature2Desc: 'מערכת חכמה המנתחת סטיות כמו כניסות ויציאות מוקדמות ומחשבת לך ציון משמעת מ-1 עד 10.',
      feature3Title: '⚡ ניהול יחידות סיכון R',
      feature3Desc: 'מעקב מתקדם של תוצאות כספיות ביחידות R אובייקטיביות, מנטרל לחלוטין את החרדה מהסכום הכספי.',
      feature4Title: '📅 לוח שנה פסיכולוגי חכם',
      feature4Desc: 'זיהוי חזותי קל של קשרים בין מצב הרוח היומי שלך להפסדים או רווחים לאורך זמן.',

      mediaSectionTitle: 'מרכז שיווק ומדיה מוכן לרשתות 📱',
      mediaSectionSub: 'במיוחד בשבילך: תבניות סרטונים (TikTok/Reels), תמונות מרהיבות ויוצר פוסטים מותאמים אישית שיעזרו לך להפיץ את הבשורה!',
      tabLanding: 'דף נחיתה ראשי',
      tabVideos: '🎬 תסריטים וסימולטור סרטונים',
      tabImages: '🖼️ תמונות ויוצר פוסטים שיווקיים',

      videoKitTitle: 'סימולטור סרטוני טיקטוק ורילס שיווקיים',
      videoKitSub: 'בחר קונספט, הפעל את נגן הסימולציה החזותי וקבל תסריט קריינות וכתוביות מוכן להקלטה!',
      videoPlay: 'הפעל סימולציית וידאו',
      videoPause: 'השהה וידאו',
      videoMute: 'השתק',
      videoUnmute: 'הפעל שמע',
      videoTemplateHook: 'הוק:',
      videoTemplateVoiceover: '🎙️ קריינות בקול שלך (או קריין AI):',
      videoTemplateVisual: '🎬 מה רואים על המסך:',
      videoTemplateText: '💬 כתוביות (On-Screen Text):',
      videoMusic: '🎵 מוזיקה מומלצת:',

      postGeneratorTitle: 'יוצר פוסטים וקאפשנים שיווקיים',
      postGeneratorSub: 'הזן את הנתונים האישיים שלך וקבל פוסט סושיאל מוכן להעתקה לאינסטגרם, פייסבוק, טוויטר או קבוצות טלגרם!',
      inputDiscipline: 'ציון משמעת להצגה:',
      inputProfit: 'רווח R להצגה:',
      inputMental: 'מצב מנטלי דומיננטי:',
      btnGeneratePost: 'צור פוסט שיווקי מושך 🚀',
      btnCopyPost: 'העתק פוסט לקליפבורד',
      postCopied: 'הועתק בהצלחה!',

      promoImagesTitle: 'גלריית תמונות פרומו להורדה',
      promoImagesSub: 'לחץ על כפתור ההורדה כדי לשמור את התמונות המקוריות שנוצרו על ידי ה-AI במחשב שלך ולהעלות אותן כפרסום ברשת!',
      btnDownload: 'הורד קובץ תמונה מקורי 📥',
      backToApp: 'חזור למעקב המסחר 📈',
      downloadBadgeText: 'זמין כעת להורדה בחנויות',
      mockStoreLabel: 'סרוק להורדה או התקן כעת',
      featuresHeaderBadge: 'למה דווקא אנחנו',
      interactiveDemoTitle: 'חווית שימוש חיה ומיידית',
      interactiveDemoDesc: 'לחץ על כפתור הכניסה כדי לעבור ישירות ללוח הבקרה הפעיל, להזין נתונים ולראות את האנליטיקה עובדת בזמן אמת!',
      creatorLabel: 'פותח עבור סוחרים מקצועיים',
    },
    en: {
      heroBadge: '📈 Discipline-Based Mental Trading Journal',
      heroTitle: 'Transform Emotional Trading into a Scientific Machine',
      heroSubtitle: 'The first trading computer journal focusing on your mental biases, identifying execution deviations in real-time, and defending your R-Units.',
      btnLaunchDemo: 'Launch Interactive Demo ⚡',
      btnMediaKit: 'Marketing Videos & Promo Creator 🎬',
      watchPromoBtn: 'Watch Live Promo Concept',
      featuresTitle: 'Why Successful Traders Use Smart Journal',
      featuresSubtitle: 'The ultimate synthesis of psychological tracking and strict mathematical risk controls',
      
      feature1Title: '🧘‍♂️ Daily Mental Logging',
      feature1Desc: 'Log stress, fatigue, indifference, or revenge impulses for every single executed stock trade.',
      feature2Title: '📊 Automated Discipline Scoring',
      feature2Desc: 'An intelligent system that analyzes deviations (like early entry or exit) and scores your discipline from 1-10.',
      feature3Title: '⚡ Net R-Unit Accounting',
      feature3Desc: 'Neutralize cash anxiety by tracking financial outcomes in objective, stress-free R units of risk.',
      feature4Title: '📅 Psychological Calendar',
      feature4Desc: 'Easily isolate visual patterns linking your daily mood states to losses or profits over time.',

      mediaSectionTitle: 'Social Media & Marketing Kit 📱',
      mediaSectionSub: 'Specifically made for you: Short-form video templates (TikTok/Reels), magnificent visuals, and custom post builders to launch successfully!',
      tabLanding: 'Landing Page',
      tabVideos: '🎬 Video Simulator & Scripts',
      tabImages: '🖼️ Promo Images & Post Maker',

      videoKitTitle: 'Short-form TikTok / Reels Video Simulator',
      videoKitSub: 'Choose a high-converting concept, run the visual player simulation, and grab ready-to-record voiceovers & text overlays!',
      videoPlay: 'Play Video Simulation',
      videoPause: 'Pause Video',
      videoMute: 'Mute',
      videoUnmute: 'Unmute',
      videoTemplateHook: 'Hook:',
      videoTemplateVoiceover: '🎙️ Voiceover script (record or use AI voice):',
      videoTemplateVisual: '🎬 Screen View Visuals:',
      videoTemplateText: '💬 On-Screen Captions:',
      videoMusic: '🎵 Suggested Soundtrack:',

      postGeneratorTitle: 'High-Converting Social Post Generator',
      postGeneratorSub: 'Insert your custom journal metrics and generate an engaging, ready-to-publish social post for Instagram, X, Facebook, or Telegram!',
      inputDiscipline: 'Showcased Discipline Score:',
      inputProfit: 'Showcased Net profit (R):',
      inputMental: 'Dominant Mental State:',
      btnGeneratePost: 'Generate Social Caption 🚀',
      btnCopyPost: 'Copy Caption to Clipboard',
      postCopied: 'Copied to clipboard!',

      promoImagesTitle: 'Downloadable High-Fidelity Promo Graphics',
      promoImagesSub: 'Click download to save the original high-resolution AI generated images directly to your computer for social sharing!',
      btnDownload: 'Download Original Graphic 📥',
      backToApp: 'Return to Trading Tracker 📈',
      downloadBadgeText: 'Available now on popular platforms',
      mockStoreLabel: 'Scan to download or install now',
      featuresHeaderBadge: 'Features',
      interactiveDemoTitle: 'Instant Live Application Experience',
      interactiveDemoDesc: 'Click the launcher button to step straight into the active tracking control dashboard, enter mock data, and see live charts populate instantly!',
      creatorLabel: 'Designed for Professional Traders',
    }
  };

  const currentTexts = texts.en;

  // Video Concept Templates (TikTok / Reels)
  const videoTemplatesHE = [
    {
      id: 1,
      name: '🔴 הטעות שמוחקת 90% מהסוחרים',
      hook: '״הנה הסיבה האמיתית למה אתה מפסיד כסף במסחר, וזה לא בגלל האסטרטגיה שלך...״',
      voiceover: 'אתה חושב שאתה צריך אסטרטגיה יותר טובה, נכון? אבל האמת היא שאתה מפסיד כי אתה מזיז סטופים, נכנס מוקדם מפחד ומסיים עסקאות ברגשות אשם. יומן המסחר המנטלי הזה יחשוף את כל הסטיות שלך ויחנך אותך למשמעת ברזל. תתחיל לעקוב אחרי ה-R שלך בצורה מדעית!',
      visuals: 'סרטון נפתח בזום-אין מהיר על טבלת מעקב עם אימוג׳י נקמה אדום 😡 מהבהב. הופך במהרה לתרשים ירוק עולה עם גביע מוזהב מנצח ואימוג׳י רגוע 🧘‍♂️.',
      captions: ['זה לא האסטרטגיה', 'אתה נלחם בעצמך 🧠', 'הזזת סטופים = אסון ❌', 'תתחיל לעקוב ב-Smart Journal 👑'],
      music: 'Futuristic Dark synth-wave, fast tempo (e.g. Synthwave/Cyberpunk style)',
      visualColor: 'from-rose-500 via-purple-600 to-indigo-900',
      emoji: '🧠'
    },
    {
      id: 2,
      name: '🟢 איך להכפיל את הרווח בלי לשנות אסטרטגיה',
      hook: '״איך סוחר אחד הגדיל את אחוז הרווח שלו ב-45% רק על ידי שינוי דבר אחד במוח שלו...״',
      voiceover: 'הסוד הוא מעקב יחידות R וניטרול החרדה מהכסף. כשתפסיק להסתכל על הדולרים ותתחיל להעריך את המשמעת שלך לפי ציון קבוע, פתאום לא תצא מוקדם ותיתן לעסקאות להגיע ליעד. כנסו עכשיו ל-Demo של יומן המסחר ותתחילו להרוויח.',
      visuals: 'תרשים סימולציה מציג חישוב R-Unit חכם. הפעלה של שעון עצר שמראה איך ביצוע עסקאות לפי משמעת הופך עקום הפסדים לעקום רווחים יציב ומתוכנן.',
      captions: ['תפסיק להסתכל על הדולר 💸', 'תמדוד ביחידות R 🎯', 'ציון משמעת גבוה = כסף 📈', 'נסה את הקישור בפרופיל! 👇'],
      music: 'Sleek, chill Lo-Fi Hip Hop beat with glowing electric guitar chords',
      visualColor: 'from-emerald-500 via-teal-600 to-indigo-950',
      emoji: '💎'
    },
    {
      id: 3,
      name: '🔥 סריקה מהירה של האפליקציה שתשנה לך את הבוקר',
      hook: '״האפליקציה שכל סוחר חייב לפתוח בסוף יום מסחר...״',
      voiceover: 'זו לא סתם טבלה. זה המראה הפסיכולוגית שלכם. כאן אתם מזינים את המצב המנטלי, מדרגים את רמת הביטחון, רושמים את הסיבה האמיתית לכך שפספסתם סטאפים ורואים במדויק איך המשמעת שלכם משפיעה על תיק ההשקעות. תתחילו לעקוב ביומן המנטלי עכשיו.',
      visuals: 'מראה של טלפון נייד זז מצד לצד, מציג את לוח השנה הצבעוני של האפליקציה עם אימוג׳יז וציונים, המשתמש לוחץ על פרימיום ומקבל מדליות ופרסים.',
      captions: ['המראה של הסוחר 🪞', 'יומן מנטלי אישי 🧘‍♂️', 'נקה סטיות פסיכולוגיות 🚫', 'זמין עכשיו לשימוש! 📲'],
      music: 'Inspiring, energetic high-tech corporate synth with progressive build-up',
      visualColor: 'from-indigo-600 via-violet-600 to-slate-950',
      emoji: '🚀'
    }
  ];

  const videoTemplatesEN = [
    {
      id: 1,
      name: '🔴 The Mistake that Wipes Out 90% of Traders',
      hook: '"Here is the real reason you lose money in trading, and it has nothing to do with your strategy..."',
      voiceover: 'You think you need a better strategy, right? But the truth is you lose because you move your stops, enter early out of fear, and exit early out of greed. This mental trading journal exposes your hidden emotional habits and forces you into pure discipline. Start tracking your R-units today!',
      visuals: 'Video starts with a fast zoom-in on a trading journal table with a flashing red revenge emoji 😡. Quickly transitions to a rising green growth chart with a golden cup trophy and a serene calm emoji 🧘‍♂️.',
      captions: ['It is not the strategy', 'You are fighting yourself 🧠', 'Moving stops = disaster ❌', 'Track with Smart Journal 👑'],
      music: 'Futuristic Dark synth-wave, fast tempo (e.g. Synthwave/Cyberpunk style)',
      visualColor: 'from-rose-500 via-purple-600 to-indigo-900',
      emoji: '🧠'
    },
    {
      id: 2,
      name: '🟢 How to Double Profits without Changing Strategies',
      hook: '"How a retail trader boosted his profitability by 45% by shifting just one psychological metric..."',
      voiceover: 'The secret is tracking R-Units and neutralizing cash anxiety. When you stop staring at dollar figures and start scoring your discipline, you stop exiting early out of fear and let your trades hit target. Try the free mental journal demo now!',
      visuals: 'Animated interactive mockup showing dynamic R-unit calculations. A stopwatch simulation showing how staying disciplined turns a losing curve into a beautifully ascending equity line.',
      captions: ['Stop staring at dollars 💸', 'Measure in R-units 🎯', 'High discipline = consistency 📈', 'Try the link in bio! 👇'],
      music: 'Sleek, chill Lo-Fi Hip Hop beat with glowing electric guitar chords',
      visualColor: 'from-emerald-500 via-teal-600 to-indigo-950',
      emoji: '💎'
    },
    {
      id: 3,
      name: '🔥 The App Walkthrough That Will Save Your Account',
      hook: '"The exact app every serious trader needs to open at the end of the market day..."',
      voiceover: 'This isn\'t just another spreadsheet. It\'s your psychological mirror. Here you log your mental state, rate your conviction, record the true reasons you missed setups, and see exactly how your self-control correlates to profit. Build your trading discipline now!',
      visuals: 'Visual of a phone screen moving dynamically, showcasing the colored interactive calendar with emojis, score cards, and unlocking beautiful certificates and awards.',
      captions: ['The ultimate mirror 🪞', 'Personal mental log 🧘‍♂️', 'Wipe out emotional errors 🚫', 'Available to use now! 📲'],
      music: 'Inspiring, energetic high-tech corporate synth with progressive build-up',
      visualColor: 'from-indigo-600 via-violet-600 to-slate-950',
      emoji: '🚀'
    }
  ];

  const videoTemplates = videoTemplatesEN;

  // Simulated video player tick
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isVideoPlaying) {
      interval = setInterval(() => {
        setVideoProgress((prev) => {
          if (prev >= 100) {
            setIsVideoPlaying(false);
            setVideoCurrentTime(0);
            return 0;
          }
          const nextProgress = prev + 2.5; // Represents ~8 seconds total duration (2.5% per 200ms)
          setVideoCurrentTime(Math.min(8, Number(((nextProgress / 100) * 8).toFixed(1))));
          return nextProgress;
        });
      }, 200);
    }
    return () => clearInterval(interval);
  }, [isVideoPlaying]);

  // Restart video simulation when changing templates
  useEffect(() => {
    setIsVideoPlaying(false);
    setVideoProgress(0);
    setVideoCurrentTime(0);
  }, [selectedVideoTemplate]);

  // Handle caption generator output
  const handleGenerateCaption = () => {
    const isHebrew = false;
    const text = isHebrew 
? `📈 משמעת היא המפתח היחיד לרווחיות בשוק ההון! 
החודש החלטתי להפסיק להמר ולהתחיל לסחור כמו מקצוען עם Smart Journal 🧠

הביצועים שלי לחודש זה:
🎯 ציון משמעת ממוצע: ${postDiscipline}
💰 רווח מצטבר נטו: ${postProfit}
🧘‍♂️ מצב מנטלי דומיננטי: ${postMentalState}

האפליקציה עוזרת לי לתעד לחץ, פחד ודחפים לנקמה, ולמדוד את הרווחים ביחידות סיכון (R-Units) בלי החרדה מהסכום הכספי!

👇 רוצים להפסיק להפסיד בגלל פסיכולוגיה? כנסו לקישור ונסו את ה-Demo בחינם!
#מסחר_בשוק_ההון #trading_journal #משמעת_עצמית #שוק_ההון #פסיכולוגיית_מסחר #מניות`
: `📈 Discipline is the ONLY key to long-term profitability in trading!
This month I stopped gambling and started tracking like a professional hedge fund using Smart Journal 🧠

My verified trading metrics for this month:
🎯 Average Discipline Score: ${postDiscipline}
💰 Accumulated Net Profit: ${postProfit}
🧘‍♂️ Dominant Psychological State: ${postMentalState}

This app allows me to track stress, fear, and revenge trading impulses in real-time, helping me secure my R-Units without cash-induced panic!

👇 Ready to conquer your mental biases? Head to the link and try the free live demo!
#trading #tradingpsychology #stocks #investing #tradingjournal #discipline`;

    setGeneratedCaption(text);
    setIsCopied(false);
  };

  // Generate initial caption on mount
  useEffect(() => {
    handleGenerateCaption();
  }, [postDiscipline, postProfit, postMentalState, language]);

  const handleCopyCaption = () => {
    navigator.clipboard.writeText(generatedCaption);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 3000);
  };

  // Handle simulated image download
  const downloadImageFile = (url: string, filename: string) => {
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Active caption text based on progress
  const activeCaptionIndex = Math.floor((videoProgress / 100) * videoTemplates[selectedVideoTemplate].captions.length);
  const activeCaption = videoTemplates[selectedVideoTemplate].captions[Math.min(activeCaptionIndex, videoTemplates[selectedVideoTemplate].captions.length - 1)];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-indigo-500 selection:text-white" dir="ltr">
      
      {/* Landing Header */}
      <header className="border-b border-slate-900 bg-slate-950/80 backdrop-blur-md sticky top-0 z-40 px-4 py-3.5 sm:px-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-500 to-indigo-600 flex items-center justify-center text-white font-black shadow-md shadow-indigo-500/20 text-lg">
              📈
            </div>
            <div>
              <span className="font-extrabold text-sm text-white tracking-tight">Smart Trading Journal</span>
              <div className="text-[10px] text-indigo-400 font-bold -mt-0.5 tracking-wider uppercase">Marketing Hub</div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Quick launch app */}
            <button
              onClick={onLaunchApp}
              className="px-4 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold text-xs transition-all shadow-md shadow-indigo-600/20 flex items-center gap-1 cursor-pointer border border-indigo-500/30"
            >
              <span>{currentTexts.backToApp}</span>
              <ArrowLeft className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </header>

      {/* Tabs Menu - High Visibility */}
      <div className="bg-slate-900 border-b border-slate-800 py-3 px-4 shrink-0">
        <div className="max-w-xl mx-auto grid grid-cols-3 gap-1 bg-slate-950 p-1.5 rounded-2xl border border-slate-800">
          <button
            onClick={() => setActiveTab('landing')}
            className={`py-2 px-3 rounded-xl text-xs font-black transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
              activeTab === 'landing' 
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/10' 
                : 'text-slate-400 hover:text-white hover:bg-slate-900'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span>{currentTexts.tabLanding}</span>
          </button>
          <button
            onClick={() => setActiveTab('videos')}
            className={`py-2 px-3 rounded-xl text-xs font-black transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
              activeTab === 'videos' 
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/10' 
                : 'text-slate-400 hover:text-white hover:bg-slate-900'
            }`}
          >
            <Video className="w-3.5 h-3.5" />
            <span>{currentTexts.tabVideos}</span>
          </button>
          <button
            onClick={() => setActiveTab('images')}
            className={`py-2 px-3 rounded-xl text-xs font-black transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
              activeTab === 'images' 
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/10' 
                : 'text-slate-400 hover:text-white hover:bg-slate-900'
            }`}
          >
            <ImageIcon className="w-3.5 h-3.5" />
            <span>{currentTexts.tabImages}</span>
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 py-8 sm:px-6">
        
        {/* LANDING TAB */}
        {activeTab === 'landing' && (
          <div className="space-y-16 py-4 animate-fadeIn">
            
            {/* Hero Section */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
              
              <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
                <span className="inline-flex items-center gap-1.5 bg-indigo-500/10 text-indigo-400 font-extrabold px-3.5 py-1.5 rounded-full border border-indigo-500/20 text-xs tracking-wide">
                  <Sparkles className="w-3.5 h-3.5" />
                  {currentTexts.heroBadge}
                </span>

                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-none">
                  {currentTexts.heroTitle}
                </h1>

                <p className="text-slate-400 text-sm sm:text-base leading-relaxed max-w-2xl mx-auto lg:mx-0">
                  {currentTexts.heroSubtitle}
                </p>

                {/* CTA Buttons */}
                <div className="flex flex-col sm:flex-row items-center gap-3 justify-center lg:justify-start pt-2">
                  <button
                    onClick={onLaunchApp}
                    className="w-full sm:w-auto px-6 py-3.5 bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold rounded-2xl shadow-lg shadow-indigo-600/30 text-sm transition-all flex items-center justify-center gap-2 border border-indigo-500/30 cursor-pointer"
                  >
                    <span>{currentTexts.btnLaunchDemo}</span>
                    <ArrowLeft className="w-4 h-4 rotate-180" />
                  </button>
                  <button
                    onClick={() => setActiveTab('videos')}
                    className="w-full sm:w-auto px-6 py-3.5 bg-slate-900 hover:bg-slate-800 text-indigo-300 hover:text-white font-black rounded-2xl border border-slate-800 text-sm transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Video className="w-4 h-4 text-indigo-400" />
                    <span>{currentTexts.btnMediaKit}</span>
                  </button>
                </div>

                {/* Simulated Stores Badges */}
                <div className="pt-6 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 text-slate-400 text-xs">
                  <div className="flex items-center gap-1">
                    <Award className="w-4 h-4 text-amber-500" />
                    <span className="font-bold text-slate-300">Apple Editors Choice 2026</span>
                  </div>
                  <div className="hidden sm:block text-slate-800">|</div>
                  <div className="flex items-center gap-1">
                    <TrendingUp className="w-4 h-4 text-emerald-500" />
                    <span className="font-bold text-slate-300">4.9 App Store Rating</span>
                  </div>
                </div>
              </div>

              {/* Hero Image Mockup Area */}
              <div className="lg:col-span-5 flex justify-center relative">
                <div className="absolute -inset-1.5 bg-gradient-to-tr from-indigo-500 to-purple-500 rounded-3xl opacity-20 blur-xl animate-pulse" />
                
                <div className="relative bg-slate-900 p-3 rounded-[2.5rem] border border-slate-800 shadow-2xl max-w-sm w-full overflow-hidden">
                  <div className="absolute top-0 inset-x-0 h-5 bg-slate-900 flex items-center justify-center z-10">
                    <div className="w-20 h-4 bg-black rounded-b-xl" />
                  </div>
                  
                  {/* Aspect Ratio 16:9 or phone visual */}
                  <div className="rounded-[2rem] overflow-hidden border border-slate-800 relative bg-black aspect-[9/16]">
                    <img 
                      src={promoPhoneImg} 
                      alt="Smart Journal Phone Mockup" 
                      className="w-full h-full object-cover select-none"
                      referrerPolicy="no-referrer"
                    />
                    
                    {/* Floating Premium Label */}
                    <div className="absolute bottom-4 inset-x-4 bg-slate-950/90 backdrop-blur-md border border-slate-800 p-3 rounded-2xl flex items-center justify-between text-left" dir="ltr">
                      <div className="flex items-center gap-2">
                        <span className="text-xl">👑</span>
                        <div>
                          <div className="text-[10px] font-black text-indigo-400 tracking-wider uppercase">Subscription Mode</div>
                          <div className="text-xs font-extrabold text-white">Smart Trading Journal</div>
                        </div>
                      </div>
                      <span className="text-[10px] bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 px-2 py-0.5 rounded-full font-bold">Active</span>
                    </div>
                  </div>
                </div>
              </div>

            </div>

            {/* Features Showcase */}
            <div className="space-y-10 pt-8 border-t border-slate-900">
              <div className="text-center space-y-2">
                <span className="text-[11px] bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 px-2.5 py-1 rounded-full font-black uppercase tracking-widest">
                  {currentTexts.featuresHeaderBadge}
                </span>
                <h2 className="text-2xl sm:text-3xl font-black text-white">
                  {currentTexts.featuresTitle}
                </h2>
                <p className="text-slate-400 text-xs sm:text-sm max-w-2xl mx-auto">
                  {currentTexts.featuresSubtitle}
                </p>
              </div>

              {/* Bento Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-slate-900/40 border border-slate-900 hover:border-indigo-500/20 p-6 rounded-2xl space-y-3 transition-all hover:-translate-y-1">
                  <div className="text-2xl">🧘‍♂️</div>
                  <h3 className="text-sm font-extrabold text-white">{currentTexts.feature1Title}</h3>
                  <p className="text-slate-400 text-xs leading-relaxed">{currentTexts.feature1Desc}</p>
                </div>
                <div className="bg-slate-900/40 border border-slate-900 hover:border-indigo-500/20 p-6 rounded-2xl space-y-3 transition-all hover:-translate-y-1">
                  <div className="text-2xl">📊</div>
                  <h3 className="text-sm font-extrabold text-white">{currentTexts.feature2Title}</h3>
                  <p className="text-slate-400 text-xs leading-relaxed">{currentTexts.feature2Desc}</p>
                </div>
                <div className="bg-slate-900/40 border border-slate-900 hover:border-indigo-500/20 p-6 rounded-2xl space-y-3 transition-all hover:-translate-y-1">
                  <div className="text-2xl">⚡</div>
                  <h3 className="text-sm font-extrabold text-white">{currentTexts.feature3Title}</h3>
                  <p className="text-slate-400 text-xs leading-relaxed">{currentTexts.feature3Desc}</p>
                </div>
                <div className="bg-slate-900/40 border border-slate-900 hover:border-indigo-500/20 p-6 rounded-2xl space-y-3 transition-all hover:-translate-y-1">
                  <div className="text-2xl">📅</div>
                  <h3 className="text-sm font-extrabold text-white">{currentTexts.feature4Title}</h3>
                  <p className="text-slate-400 text-xs leading-relaxed">{currentTexts.feature4Desc}</p>
                </div>
              </div>
            </div>

            {/* Interactive Demo Block */}
            <div className="bg-gradient-to-r from-indigo-950 via-slate-900 to-slate-950 rounded-[2rem] border border-indigo-500/15 p-8 sm:p-12 relative overflow-hidden">
              <div className="absolute right-0 bottom-0 top-0 w-1/3 opacity-5 pointer-events-none" />
              
              <div className="max-w-2xl space-y-4">
                <h3 className="text-xl sm:text-2xl font-black text-white">
                  {currentTexts.interactiveDemoTitle}
                </h3>
                <p className="text-slate-400 text-xs sm:text-sm leading-relaxed">
                  {currentTexts.interactiveDemoDesc}
                </p>
                <div className="pt-2">
                  <button
                    onClick={onLaunchApp}
                    className="px-6 py-3 bg-white hover:bg-slate-150 text-slate-950 font-black text-xs rounded-xl shadow-lg transition-all flex items-center gap-1.5 cursor-pointer"
                  >
                    <span>{currentTexts.btnLaunchDemo}</span>
                    <MousePointerClick className="w-4 h-4 text-indigo-600" />
                  </button>
                </div>
              </div>
            </div>

          </div>
        )}

        {/* VIDEOS TAB */}
        {activeTab === 'videos' && (
          <div className="space-y-8 py-4 animate-fadeIn">
            
            <div className="border-b border-slate-900 pb-5">
              <h2 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2">
                <Video className="w-6 h-6 text-indigo-400" />
                <span>{currentTexts.videoKitTitle}</span>
              </h2>
              <p className="text-slate-400 text-xs sm:text-sm mt-1">
                {currentTexts.videoKitSub}
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              
              {/* Left Column: Video Template Selector & Scripts details */}
              <div className="lg:col-span-7 space-y-5">
                
                {/* Template Cards list */}
                <div className="space-y-3">
                  {videoTemplates.map((template, index) => (
                    <button
                      key={template.id}
                      onClick={() => setSelectedVideoTemplate(index)}
                      className={`w-full p-4 rounded-2xl border transition-all text-left flex items-center justify-between gap-3 cursor-pointer ${
                        selectedVideoTemplate === index 
                          ? 'bg-indigo-600/10 border-indigo-500 text-white' 
                          : 'bg-slate-900/40 border-slate-900 hover:border-slate-800 text-slate-300 hover:text-white'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{template.emoji}</span>
                        <div className="text-left">
                          <span className="text-[10px] text-indigo-400 font-bold block uppercase tracking-wide">Concept {index + 1}</span>
                          <span className="text-xs sm:text-sm font-extrabold">{template.name}</span>
                        </div>
                      </div>
                      <span className={`w-2 h-2 rounded-full ${selectedVideoTemplate === index ? 'bg-indigo-500' : 'bg-slate-700'}`} />
                    </button>
                  ))}
                </div>

                {/* Template Script Details Panel */}
                <div className="bg-slate-900/50 border border-slate-900 rounded-3xl p-6 space-y-5">
                  <div className="flex items-center gap-2 text-indigo-400 font-bold text-xs uppercase tracking-wider">
                    <Sparkles className="w-4 h-4 text-indigo-400" />
                    <span>Full Script Details & Audio Guide</span>
                  </div>

                  {/* Hook */}
                  <div className="space-y-1 bg-slate-950 p-4 rounded-xl border border-slate-900">
                    <div className="text-[10px] text-rose-400 font-black uppercase tracking-wider">{currentTexts.videoTemplateHook}</div>
                    <p className="text-xs sm:text-sm font-extrabold text-white leading-relaxed italic">{videoTemplates[selectedVideoTemplate].hook}</p>
                  </div>

                  {/* Voiceover */}
                  <div className="space-y-1">
                    <div className="text-[10px] text-indigo-400 font-black uppercase tracking-wider">{currentTexts.videoTemplateVoiceover}</div>
                    <p className="text-xs sm:text-sm text-slate-200 leading-relaxed bg-slate-950/40 p-3 rounded-xl border border-slate-900/50">{videoTemplates[selectedVideoTemplate].voiceover}</p>
                  </div>

                  {/* On-Screen Overlay Text */}
                  <div className="space-y-2">
                    <div className="text-[10px] text-emerald-400 font-black uppercase tracking-wider">{currentTexts.videoTemplateText}</div>
                    <div className="grid grid-cols-2 gap-2">
                      {videoTemplates[selectedVideoTemplate].captions.map((cap, i) => (
                        <div key={i} className="bg-slate-950 px-3 py-2 rounded-lg border border-slate-900 flex items-center gap-1.5 text-[11px] font-bold text-slate-300 font-mono">
                          <span className="text-[9px] text-emerald-500 font-bold bg-emerald-500/10 w-4 h-4 rounded-full flex items-center justify-center shrink-0">{i + 1}</span>
                          <span>{cap}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Visual Scene Storyboard */}
                  <div className="space-y-1">
                    <div className="text-[10px] text-amber-400 font-black uppercase tracking-wider">{currentTexts.videoTemplateVisual}</div>
                    <p className="text-xs text-slate-400 leading-relaxed italic">{videoTemplates[selectedVideoTemplate].visuals}</p>
                  </div>

                  {/* Soundtrack */}
                  <div className="space-y-1 border-t border-slate-900 pt-3 flex items-center justify-between text-xs">
                    <span className="text-slate-500">{currentTexts.videoMusic}</span>
                    <span className="font-mono text-indigo-300 font-bold bg-indigo-500/10 px-2.5 py-0.5 rounded-full">{videoTemplates[selectedVideoTemplate].music}</span>
                  </div>
                </div>

              </div>

              {/* Right Column: Simulated Live Video Player inside phone mockup */}
              <div className="lg:col-span-5 flex flex-col items-center">
                
                <div className="relative bg-slate-900 p-3.5 rounded-[3rem] border border-slate-800 shadow-2xl max-w-sm w-full overflow-hidden select-none">
                  
                  {/* Top Phone speaker notch */}
                  <div className="absolute top-0 inset-x-0 h-5 bg-slate-900 flex items-center justify-center z-10">
                    <div className="w-20 h-4 bg-black rounded-b-xl" />
                  </div>

                  {/* Live Simulated Reels screen */}
                  <div className={`rounded-[2.2rem] overflow-hidden border border-slate-800 relative bg-gradient-to-tr ${videoTemplates[selectedVideoTemplate].visualColor} aspect-[9/16] flex flex-col justify-between p-5`}>
                    
                    {/* Top overlay buttons */}
                    <div className="flex items-center justify-between text-white text-[10px] z-10 pt-2" dir="ltr">
                      <div className="flex items-center gap-1.5 font-bold">
                        <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-ping" />
                        <span className="tracking-wide uppercase">Simulated Live</span>
                      </div>
                      <span className="font-mono bg-black/40 px-2 py-0.5 rounded-full font-bold">{videoCurrentTime}s / 8.0s</span>
                    </div>

                    {/* Middle visual simulator - responsive glowing elements */}
                    <div className="flex-1 flex flex-col items-center justify-center text-center p-4 space-y-6 relative">
                      
                      {/* Interactive pulsing graph simulator */}
                      <div className="relative w-full max-w-[200px] h-28 bg-black/40 backdrop-blur-md rounded-2xl border border-white/15 p-3 flex flex-col justify-between overflow-hidden">
                        
                        <div className="flex items-center justify-between text-[9px] text-slate-400" dir="ltr">
                          <span>Discipline Trend</span>
                          <span className="text-emerald-400 font-bold font-mono">94% Compliance</span>
                        </div>

                        {/* Animated SVG Path Chart */}
                        <div className="flex-1 flex items-end justify-between relative mt-1">
                          <svg className="absolute inset-0 w-full h-full text-emerald-500" viewBox="0 0 100 50">
                            <defs>
                              <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%" stopColor="#10b981" stopOpacity="0.4" />
                                <stop offset="100%" stopColor="#10b981" stopOpacity="0.0" />
                              </linearGradient>
                            </defs>
                            {/* Static guideline */}
                            <line x1="0" y1="35" x2="100" y2="35" stroke="rgba(255,255,255,0.05)" strokeDasharray="2,2" />
                            {/* Animated line representing growing chart */}
                            <path 
                              d="M0,45 L20,38 L40,42 L60,20 L80,15 L100,2" 
                              fill="none" 
                              stroke="currentColor" 
                              strokeWidth="2.5" 
                              className={`transition-all duration-1000 ${isVideoPlaying ? 'stroke-dasharray-[100] stroke-dashoffset-0' : 'opacity-80'}`}
                            />
                            <path d="M0,45 L20,38 L40,42 L60,20 L80,15 L100,2 L100,50 L0,50 Z" fill="url(#chartGrad)" />
                          </svg>

                          {/* Pulsing indicator node */}
                          <div className="absolute right-0 top-0 w-2.5 h-2.5 rounded-full bg-emerald-400 shadow-md shadow-emerald-400/50 animate-ping" />
                        </div>

                        <div className="flex items-center justify-between text-[8px] text-slate-500 pt-1 font-mono" dir="ltr">
                          <span>Day 1</span>
                          <span>Day 15</span>
                          <span>Day 30</span>
                        </div>
                      </div>

                      {/* Captions burned into the video view - Simulated Real Reels Cap */}
                      <AnimatePresence mode="wait">
                        {isVideoPlaying && (
                          <motion.div
                            key={activeCaption}
                            initial={{ scale: 0.8, opacity: 0, y: 10 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.9, opacity: 0, y: -10 }}
                            className="bg-yellow-400 text-black font-black text-sm px-4 py-2.5 rounded-xl shadow-lg uppercase tracking-wide max-w-[220px]"
                          >
                            {activeCaption}
                          </motion.div>
                        )}
                        {!isVideoPlaying && (
                          <div className="bg-white/10 backdrop-blur-md text-white font-extrabold text-xs px-4 py-2 rounded-xl border border-white/20 uppercase tracking-wider">
                            Ready to Play Video Concept
                          </div>
                        )}
                      </AnimatePresence>
                    </div>

                    {/* Bottom simulated interface controls */}
                    <div className="space-y-3 shrink-0 bg-gradient-to-t from-black/80 to-transparent p-3 rounded-2xl">
                      
                      {/* Reel progress bar */}
                      <div className="w-full bg-white/25 h-1 rounded-full overflow-hidden">
                        <div 
                          className="bg-indigo-500 h-full transition-all duration-200"
                          style={{ width: `${videoProgress}%` }}
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => setIsVideoPlaying(!isVideoPlaying)}
                            className="w-9 h-9 rounded-full bg-indigo-600 hover:bg-indigo-500 text-white flex items-center justify-center transition-all shadow-md cursor-pointer"
                          >
                            {isVideoPlaying ? <Pause className="w-4 h-4 fill-white" /> : <Play className="w-4 h-4 fill-white ml-0.5" />}
                          </button>
                          
                          <button
                            onClick={() => setIsMuted(!isMuted)}
                            className="w-7 h-7 rounded-full bg-white/15 hover:bg-white/25 text-white flex items-center justify-center transition-all cursor-pointer"
                          >
                            <Volume2 className={`w-3.5 h-3.5 ${isMuted ? 'opacity-40' : 'opacity-100'}`} />
                          </button>
                        </div>

                        {/* Social stats mockups */}
                        <div className="flex items-center gap-2 text-white/80 text-[10px] font-bold" dir="ltr">
                          <span>❤️ 1,482</span>
                          <span>💬 89</span>
                        </div>
                      </div>

                    </div>

                  </div>
                </div>

                {/* Info Note */}
                <p className="text-[10px] text-slate-500 text-center mt-3 max-w-xs leading-relaxed">
                  💡 This simulator displays a visual simulation of the short-form video concept (chart animations & burned-in captions). You can record this preview screen or copy the ready scripts to record your own high-converting post!
                </p>

              </div>

            </div>

          </div>
        )}

        {/* IMAGES & POST CREATOR TAB */}
        {activeTab === 'images' && (
          <div className="space-y-12 py-4 animate-fadeIn">
            
            {/* Promo Images Download Center */}
            <div className="space-y-6">
              <div className="border-b border-slate-900 pb-4">
                <h2 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2">
                  <ImageIcon className="w-6 h-6 text-indigo-400" />
                  <span>{currentTexts.promoImagesTitle}</span>
                </h2>
                <p className="text-slate-400 text-xs sm:text-sm mt-1">
                  {currentTexts.promoImagesSub}
                </p>
              </div>

              {/* Grid with the 2 generated images */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                
                {/* Image Card 1 */}
                <div className="bg-slate-900/40 border border-slate-900 rounded-3xl overflow-hidden shadow-xl flex flex-col justify-between">
                  <div className="p-4 bg-slate-950 border-b border-slate-900 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-indigo-400 font-extrabold block uppercase tracking-wide">Image Asset #1</span>
                      <h4 className="text-xs font-black text-white uppercase tracking-tight">Trading Journal Phone Mockup</h4>
                    </div>
                    <span className="text-[10px] bg-indigo-500/10 text-indigo-300 font-bold px-2 py-0.5 rounded-md border border-indigo-500/20">Landscape 16:9</span>
                  </div>

                  <div className="relative aspect-[16/9] bg-slate-950 overflow-hidden group">
                    <img 
                      src={promoPhoneImg} 
                      alt="Promo Phone Mockup" 
                      className="w-full h-full object-cover select-none transition-transform duration-500 group-hover:scale-105"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 to-transparent pointer-events-none" />
                  </div>

                  <div className="p-5 bg-slate-900/60 border-t border-slate-900">
                    <button
                      onClick={() => downloadImageFile(promoPhoneImg, 'trading_promo_phone_mockup.jpg')}
                      className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold text-xs rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-md shadow-indigo-600/15"
                    >
                      <Download className="w-4 h-4" />
                      <span>{currentTexts.btnDownload}</span>
                    </button>
                  </div>
                </div>

                {/* Image Card 2 */}
                <div className="bg-slate-900/40 border border-slate-900 rounded-3xl overflow-hidden shadow-xl flex flex-col justify-between">
                  <div className="p-4 bg-slate-950 border-b border-slate-900 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-indigo-400 font-extrabold block uppercase tracking-wide">Image Asset #2</span>
                      <h4 className="text-xs font-black text-white uppercase tracking-tight">Discipline Stat Badge Promo</h4>
                    </div>
                    <span className="text-[10px] bg-indigo-500/10 text-indigo-300 font-bold px-2 py-0.5 rounded-md border border-indigo-500/20">Landscape 16:9</span>
                  </div>

                  <div className="relative aspect-[16/9] bg-slate-950 overflow-hidden group">
                    <img 
                      src={promoDisciplineImg} 
                      alt="Discipline Stat Promo" 
                      className="w-full h-full object-cover select-none transition-transform duration-500 group-hover:scale-105"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 to-transparent pointer-events-none" />
                  </div>

                  <div className="p-5 bg-slate-900/60 border-t border-slate-900">
                    <button
                      onClick={() => downloadImageFile(promoDisciplineImg, 'trading_discipline_chart_promo.jpg')}
                      className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold text-xs rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-md shadow-indigo-600/15"
                    >
                      <Download className="w-4 h-4" />
                      <span>{currentTexts.btnDownload}</span>
                    </button>
                  </div>
                </div>

              </div>
            </div>

            {/* Interactive Social Post Creator */}
            <div className="bg-slate-900/30 border border-slate-900 rounded-3xl p-6 sm:p-8 space-y-6">
              <div className="border-b border-slate-900 pb-4">
                <h3 className="text-lg font-black text-white flex items-center gap-2">
                  <Share2 className="w-5 h-5 text-indigo-400" />
                  <span>{currentTexts.postGeneratorTitle}</span>
                </h3>
                <p className="text-slate-400 text-xs">
                  {currentTexts.postGeneratorSub}
                </p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                
                {/* Inputs area */}
                <div className="lg:col-span-5 space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-300 block">{currentTexts.inputDiscipline}</label>
                    <input 
                      type="text" 
                      value={postDiscipline}
                      onChange={(e) => setPostDiscipline(e.target.value)}
                      placeholder="e.g. 94%"
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-indigo-500"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-300 block">{currentTexts.inputProfit}</label>
                    <input 
                      type="text" 
                      value={postProfit}
                      onChange={(e) => setPostProfit(e.target.value)}
                      placeholder="e.g. +14.5 R"
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-indigo-500"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-300 block">{currentTexts.inputMental}</label>
                    <input 
                      type="text" 
                      value={postMentalState}
                      onChange={(e) => setPostMentalState(e.target.value)}
                      placeholder="e.g. Calm & Focused"
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-indigo-500"
                    />
                  </div>

                  <div className="pt-2">
                    <button
                      onClick={handleGenerateCaption}
                      className="w-full py-2.5 bg-slate-800 hover:bg-slate-700 text-white font-extrabold text-xs rounded-xl border border-slate-700 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <RotateCcw className="w-3.5 h-3.5 text-slate-400" />
                      <span>{currentTexts.btnGeneratePost}</span>
                    </button>
                  </div>
                </div>

                {/* Text Box result and Copy buttons */}
                <div className="lg:col-span-7 flex flex-col justify-between space-y-4">
                  <div className="relative flex-1">
                    <textarea
                      readOnly
                      value={generatedCaption}
                      rows={10}
                      className="w-full p-4 rounded-2xl bg-slate-950 border border-slate-800 text-xs text-slate-200 focus:outline-none font-sans leading-relaxed select-all"
                    />
                    
                    <div className="absolute top-3 left-3 bg-indigo-500/10 text-indigo-400 font-mono text-[9px] font-black px-2 py-0.5 rounded border border-indigo-500/20">
                      COPYREADY
                    </div>
                  </div>

                  <button
                    onClick={handleCopyCaption}
                    className={`w-full py-3 rounded-xl font-extrabold text-xs transition-all flex items-center justify-center gap-2 cursor-pointer border ${
                      isCopied 
                        ? 'bg-emerald-600 text-white border-emerald-500' 
                        : 'bg-indigo-600 hover:bg-indigo-500 text-white border-indigo-500'
                    }`}
                  >
                    {isCopied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    <span>{isCopied ? currentTexts.postCopied : currentTexts.btnCopyPost}</span>
                  </button>
                </div>

              </div>
            </div>

          </div>
        )}

      </main>

      {/* Footer copyright */}
      <footer className="border-t border-slate-900 bg-slate-950/40 py-6 px-4 text-center mt-12">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-slate-500 text-[10px] font-medium" dir="ltr">
          <span>{currentTexts.creatorLabel}</span>
          <span>Smart Trading Journal marketing panel. All rights reserved.</span>
        </div>
      </footer>

    </div>
  );
}
