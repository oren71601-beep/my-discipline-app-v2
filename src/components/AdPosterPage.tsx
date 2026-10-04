import React, { useState, useRef } from 'react';
import { 
  ArrowLeft, 
  Download, 
  Share2, 
  Copy, 
  Check, 
  ExternalLink, 
  Sparkles, 
  TrendingUp, 
  ShieldAlert, 
  CheckCircle2, 
  Eye, 
  RotateCcw,
  Zap,
  Globe,
  Sliders,
  DollarSign,
  Heart,
  MessageCircle,
  Bookmark
} from 'lucide-react';
import { WHOP_CHECKOUT_URL, ICOUNT_CHECKOUT_URL } from '../utils/geoIpService';
// @ts-ignore
import disciplineStoryAdImg from '../assets/images/discipline_story_ad_1791068170946.jpg';

interface AdPosterPageProps {
  onBack: () => void;
  language?: 'he' | 'en' | 'ar' | 'ru';
  isRtl?: boolean;
}

export default function AdPosterPage({ onBack, language = 'he' }: AdPosterPageProps) {
  // Preset customizable variables for the ad generator
  const [headline, setHeadline] = useState<'stop_loss' | 'prop_firm' | 'psychology'>('stop_loss');
  const [accentStyle, setAccentStyle] = useState<'dark_emerald' | 'gold_cyber' | 'electric_indigo'>('dark_emerald');
  const [targetPlatform, setTargetPlatform] = useState<'whop' | 'icount'>('whop');
  const [customLossAmount, setCustomLossAmount] = useState<string>('150');
  const [copiedLink, setCopiedLink] = useState<boolean>(false);
  const [copiedCaption, setCopiedCaption] = useState<boolean>(false);

  const checkoutUrl = targetPlatform === 'whop' ? WHOP_CHECKOUT_URL : ICOUNT_CHECKOUT_URL;

  const headlinesConfig = {
    stop_loss: {
      tagEn: 'STOP LOSS ADDICTION',
      tagHe: 'לפני הטרייד הבא שלך',
      titleEn: `Before you lose another $${customLossAmount} on emotional trades...`,
      titleHe: `לפני שאתה שורף עוד $${customLossAmount} בגלל הזזת סטופים ו-FOMO...`,
      subEn: 'The real problem is not your strategy. It is your lack of a discipline audit system.',
      subHe: 'הבעיה היא לא האסטרטגיה. הבעיה היא שאין לך מערכת שמודדת את הסטיות המנטליות שלך.',
      bullet1: '🛑 Track early exits & revenge trades',
      bullet2: '📊 Automated 1-10 Discipline Score',
      bullet3: '⚡ Measure in R-Units, not emotional dollars',
      caption: `🚨 Before you lose another $${customLossAmount} on emotional trading mistakes...

90% of traders fail NOT because their technical strategy is bad, but because they break discipline:
❌ Moving Stop Losses in panic
❌ Revenge trading after a loss
❌ Closing winning trades way too early

The Smart Trading Journal fixes this by acting as your personal discipline mirror.
✅ Automated Discipline Score (1-10)
✅ Net R-Unit risk tracking
✅ Identify exact emotional leak points

Start your 7-day free trial now:
👉 ${checkoutUrl}

#tradingdiscipline #daytrading #forex #stockmarket #tradingpsychology #smarttradingjournal`
    },
    prop_firm: {
      tagEn: 'PASS YOUR EVALUATION',
      tagHe: 'לעבור מבחן נוסטרו',
      titleEn: `Before you pay another $${customLossAmount} for a Prop Firm reset...`,
      titleHe: `לפני שאתה משלם עוד $${customLossAmount} על איפוס חשבון נוסטרו...`,
      subEn: '92% of funded account failures happen due to tilt on a single trading day.',
      subHe: '92% מהסוחרים נכשלים במבחני נוסטרו בגלל יום אחד של טילט ומסחר נקמה.',
      bullet1: '🛡️ Maximum Daily Drawdown Protection',
      bullet2: '🧠 Real-time Tilt & Revenge Alert System',
      bullet3: '🏆 Lock in consistency before scaling',
      caption: `🎯 Before you pay another $${customLossAmount} to reset your Prop Firm evaluation...

Did you know 92% of blown evaluations happen during just ONE emotional trading session?

Stop donating money to prop firms. Lock in iron-clad discipline with the Smart Trading Journal:
🔥 Track your emotional state before clicking BUY/SELL
🔥 Keep your discipline score above 85%
🔥 Pass and KEEP your funded accounts

Unlock 7-day free trial on Whop:
👉 ${checkoutUrl}

#propfirm #fundedtrader #fxtrading #tradingjourney #discipline #riskmanagement`
    },
    psychology: {
      tagEn: 'DISCIPLINE AUDIT',
      tagHe: 'משמעת ברזל',
      titleEn: 'Stop fighting the market. Start auditing your mind.',
      titleHe: 'תפסיק להילחם בשוק. תתחיל למדוד את המשמעת שלך.',
      subEn: 'Turn emotional trading chaos into a disciplined, data-backed business.',
      subHe: 'הפוך מסחר אמוציונלי ומלחיץ לעסק מדויק שמנוהל על פי חוקים בלתי מתפשרים.',
      bullet1: '🧘 Real-time Stress & Greed Monitor',
      bullet2: '📈 Visual Psychological Calendar',
      bullet3: '💰 Turn emotional leaks into retained profit',
      caption: `🧠 Stop fighting the charts. Start auditing your discipline.

Trading without tracking your psychology is like driving with your eyes closed. The Smart Journal gives you:
1. Daily Mental Logging (Calm, Greed, Revenge, Fear)
2. Objective Discipline Scoring
3. Net R-Units analysis

Master yourself, master your trading.
🔗 Start free for 7 days: ${checkoutUrl}

#tradingmindset #discipline #investing #stocks #crypto #tradingmotivation`
    }
  };

  const activeContent = headlinesConfig[headline];

  const handleCopyLink = () => {
    navigator.clipboard.writeText(checkoutUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 3000);
  };

  const handleCopyCaption = () => {
    navigator.clipboard.writeText(activeContent.caption);
    setCopiedCaption(true);
    setTimeout(() => setCopiedCaption(false), 3000);
  };

  const handleDownloadImage = () => {
    const link = document.createElement('a');
    link.href = disciplineStoryAdImg;
    link.download = `TradeReport_Ad_Poster_9_16.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-emerald-500 selection:text-black">
      
      {/* Top Navigation Bar */}
      <header className="border-b border-slate-900 bg-slate-950/90 backdrop-blur-md relative z-30 px-4 py-3 sm:px-8">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={onBack}
              className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white transition-all cursor-pointer border border-slate-800 flex items-center gap-2 text-xs font-bold"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>חזור / Return</span>
            </button>
            <div className="h-5 w-px bg-slate-800 hidden sm:block" />
            <div className="hidden sm:flex items-center gap-2">
              <span className="text-xs font-black uppercase tracking-wider text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-md border border-emerald-500/20">
                Ad Creative Center
              </span>
              <span className="text-xs text-slate-400 font-medium">דף מודעת פרסום לרשתות (Instagram / TikTok / Facebook / X)</span>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={handleCopyLink}
              className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 hover:text-white text-xs font-bold border border-slate-800 transition-all flex items-center gap-1.5 cursor-pointer"
            >
              {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-indigo-400" />}
              <span>{copiedLink ? 'הקישור הועתק!' : 'העתק קישור רכישה'}</span>
            </button>

            <a
              href={checkoutUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3.5 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-black transition-all shadow-md shadow-emerald-500/20 flex items-center gap-1.5"
            >
              <span>פתח Whop / Checkout</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 py-8 sm:px-8 space-y-10">
        
        {/* Header Hero */}
        <div className="text-center space-y-3 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-black uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            <span>High-Converting Vertical Ad Creative (9:16)</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight leading-tight">
            מודעת פרסום סוחפת מוכנה לסטורי, רילס וטיקטוק 📱
          </h1>
          <p className="text-slate-400 text-xs sm:text-sm leading-relaxed">
            בדיוק כמו המודעה שראית: פורמט 9:16 אנכי עם כותרת שתופסת ישר את הכאב הכי גדול של סוחרים, מפרקת את המחיר של חוסר משמעת, ומניעה ישירות להרשמה ב-Whop עם 7 ימי ניסיון בחינם!
          </p>
        </div>

        {/* Studio Workspace: Controls on Left, Live Ad Mockup on Right */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* LEFT COLUMN: Controls & Copy Tools (7 Cols) */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* 1. Angle / Headline Selector */}
            <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-6 space-y-4 shadow-xl">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800/80">
                <div className="flex items-center gap-2">
                  <Sliders className="w-4 h-4 text-emerald-400" />
                  <h3 className="text-sm font-extrabold text-white">1. בחר זווית שיווקית (Marketing Angle)</h3>
                </div>
                <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">3 וריאציות</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                <button
                  type="button"
                  onClick={() => setHeadline('stop_loss')}
                  className={`p-3.5 rounded-2xl border text-start transition-all cursor-pointer flex flex-col justify-between ${
                    headline === 'stop_loss'
                      ? 'bg-emerald-500/10 border-emerald-500 text-white shadow-md shadow-emerald-500/10'
                      : 'bg-slate-950/60 border-slate-800 hover:border-slate-700 text-slate-300'
                  }`}
                >
                  <span className="text-lg mb-1">🛑</span>
                  <div className="text-xs font-black">הזזת סטופים ו-FOMO</div>
                  <div className="text-[10px] text-slate-400 mt-0.5">כמו בתמונה: "Before you lose another $150"</div>
                </button>

                <button
                  type="button"
                  onClick={() => setHeadline('prop_firm')}
                  className={`p-3.5 rounded-2xl border text-start transition-all cursor-pointer flex flex-col justify-between ${
                    headline === 'prop_firm'
                      ? 'bg-emerald-500/10 border-emerald-500 text-white shadow-md shadow-emerald-500/10'
                      : 'bg-slate-950/60 border-slate-800 hover:border-slate-700 text-slate-300'
                  }`}
                >
                  <span className="text-lg mb-1">🏢</span>
                  <div className="text-xs font-black">מבחני נוסטרו (Prop Firms)</div>
                  <div className="text-[10px] text-slate-400 mt-0.5">איפוסים יקרים עקב יום טילט אחד</div>
                </button>

                <button
                  type="button"
                  onClick={() => setHeadline('psychology')}
                  className={`p-3.5 rounded-2xl border text-start transition-all cursor-pointer flex flex-col justify-between ${
                    headline === 'psychology'
                      ? 'bg-emerald-500/10 border-emerald-500 text-white shadow-md shadow-emerald-500/10'
                      : 'bg-slate-950/60 border-slate-800 hover:border-slate-700 text-slate-300'
                  }`}
                >
                  <span className="text-lg mb-1">🧠</span>
                  <div className="text-xs font-black">פסיכולוגיה ומשמעת</div>
                  <div className="text-[10px] text-slate-400 mt-0.5">המראה הפסיכולוגית לניטרול חרדה</div>
                </button>
              </div>

              {/* Loss amount customization */}
              <div className="pt-2 flex items-center gap-3 bg-slate-950/80 p-3 rounded-2xl border border-slate-800">
                <DollarSign className="w-4 h-4 text-emerald-400 shrink-0" />
                <span className="text-xs text-slate-300 font-bold shrink-0">סכום ההפסד בכותרת:</span>
                <div className="flex items-center gap-1.5 flex-1">
                  <span className="text-xs text-slate-400 font-mono">$</span>
                  <input
                    type="number"
                    value={customLossAmount}
                    onChange={(e) => setCustomLossAmount(e.target.value)}
                    className="w-24 px-2.5 py-1 bg-slate-900 border border-slate-700 rounded-lg text-xs font-bold text-emerald-400 focus:outline-none focus:border-emerald-500 font-mono"
                  />
                  <span className="text-[11px] text-slate-500">(למשל 150, 200, 500)</span>
                </div>
              </div>
            </div>

            {/* 2. Platform Destination & Link */}
            <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-6 space-y-4 shadow-xl">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800/80">
                <div className="flex items-center gap-2">
                  <Globe className="w-4 h-4 text-indigo-400" />
                  <h3 className="text-sm font-extrabold text-white">2. יעד הקישור במודעה (Call to Action Link)</h3>
                </div>
                <span className="text-[10px] font-mono text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded border border-indigo-500/20">Direct Checkout</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setTargetPlatform('whop')}
                  className={`p-3 rounded-2xl border text-start transition-all cursor-pointer flex items-center gap-3 ${
                    targetPlatform === 'whop'
                      ? 'bg-indigo-500/15 border-indigo-500 text-white'
                      : 'bg-slate-950/60 border-slate-800 hover:border-slate-700 text-slate-400'
                  }`}
                >
                  <div className="w-8 h-8 rounded-xl bg-[#ff5247] flex items-center justify-center font-black text-white text-xs">
                    W
                  </div>
                  <div>
                    <div className="text-xs font-extrabold text-white">Whop 🌐 (בינלאומי)</div>
                    <div className="text-[10px] text-slate-400">7 ימי ניסיון חינם + כרטיסי אשראי בינלאומיים</div>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setTargetPlatform('icount')}
                  className={`p-3 rounded-2xl border text-start transition-all cursor-pointer flex items-center gap-3 ${
                    targetPlatform === 'icount'
                      ? 'bg-indigo-500/15 border-indigo-500 text-white'
                      : 'bg-slate-950/60 border-slate-800 hover:border-slate-700 text-slate-400'
                  }`}
                >
                  <div className="w-8 h-8 rounded-xl bg-emerald-600 flex items-center justify-center font-black text-white text-xs">
                    iC
                  </div>
                  <div>
                    <div className="text-xs font-extrabold text-white">iCount 🇮🇱 (ישראל)</div>
                    <div className="text-[10px] text-slate-400">סליקה ישראלית + חשבונית מס מקורית</div>
                  </div>
                </button>
              </div>

              <div className="flex items-center gap-2 bg-slate-950 p-2.5 rounded-xl border border-slate-800">
                <input
                  type="text"
                  readOnly
                  value={checkoutUrl}
                  className="bg-transparent text-[11px] font-mono text-slate-300 w-full focus:outline-none select-all"
                />
                <button
                  type="button"
                  onClick={handleCopyLink}
                  className="shrink-0 px-3 py-1 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-xs font-bold transition-all flex items-center gap-1 cursor-pointer"
                >
                  {copiedLink ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  <span>{copiedLink ? 'הועתק' : 'העתק'}</span>
                </button>
              </div>
            </div>

            {/* 3. High-Converting Post Caption (Ready to Copy) */}
            <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-6 space-y-4 shadow-xl">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800/80">
                <div className="flex items-center gap-2">
                  <Share2 className="w-4 h-4 text-emerald-400" />
                  <h3 className="text-sm font-extrabold text-white">3. טקסט פוסט מוכן להעתקה (Post Caption & Hashtags)</h3>
                </div>
                <button
                  type="button"
                  onClick={handleCopyCaption}
                  className="text-xs font-extrabold text-emerald-400 hover:text-emerald-300 flex items-center gap-1 cursor-pointer"
                >
                  {copiedCaption ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedCaption ? 'הטקסט הועתק!' : 'העתק טקסט'}</span>
                </button>
              </div>

              <div className="relative">
                <textarea
                  readOnly
                  rows={8}
                  value={activeContent.caption}
                  className="w-full bg-slate-950 border border-slate-800 rounded-2xl p-4 text-xs font-sans text-slate-300 leading-relaxed focus:outline-none select-all"
                />
              </div>

              <button
                type="button"
                onClick={handleCopyCaption}
                className={`w-full py-3 rounded-2xl font-extrabold text-xs transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg ${
                  copiedCaption 
                    ? 'bg-emerald-500 text-slate-950 font-black' 
                    : 'bg-emerald-600 hover:bg-emerald-500 text-white'
                }`}
              >
                {copiedCaption ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                <span>{copiedCaption ? 'קאפשן הועתק ללוח! הדבק באינסטגרם/טיקטוק' : 'העתק את כל הפוסט לקליפבורד (Copy Caption)'}</span>
              </button>
            </div>

          </div>

          {/* RIGHT COLUMN: Live Vertical Ad Mockup (5 Cols) */}
          <div className="lg:col-span-5 flex flex-col items-center">
            
            {/* Phone Frame Mockup (9:16 Aspect Ratio) */}
            <div className="relative w-full max-w-[360px] bg-slate-900 rounded-[2.5rem] p-3 shadow-2xl border-4 border-slate-800 shadow-emerald-500/10">
              
              {/* Phone Speaker Notch */}
              <div className="absolute top-5 left-1/2 -translate-x-1/2 w-28 h-4 bg-slate-950 rounded-full z-30 flex items-center justify-center">
                <div className="w-12 h-1 bg-slate-800 rounded-full" />
              </div>

              {/* Ad Canvas (9:16 vertical poster) */}
              <div className="relative aspect-[9/16] w-full rounded-[2rem] overflow-hidden bg-slate-950 flex flex-col justify-between p-5 text-white select-none border border-slate-800">
                
                {/* Background Image with Dark Glow Overlay */}
                <img
                  src={disciplineStoryAdImg}
                  alt="Discipline Story Ad Graphic"
                  className="absolute inset-0 w-full h-full object-cover opacity-85 pointer-events-none scale-105"
                  referrerPolicy="no-referrer"
                />
                
                {/* Gradient vignette for extreme readability */}
                <div className="absolute inset-0 bg-gradient-to-b from-slate-950/90 via-slate-950/75 to-slate-950/95 pointer-events-none" />

                {/* Top Header of Ad */}
                <div className="relative z-10 pt-4 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-emerald-500 to-indigo-600 flex items-center justify-center text-white font-black text-xs shadow-md shadow-emerald-500/30">
                      📈
                    </div>
                    <div>
                      <div className="text-xs font-black tracking-tight flex items-center gap-1 text-white">
                        <span>TradeReport</span>
                        <span className="text-[9px] bg-emerald-500/20 text-emerald-300 font-extrabold px-1.5 py-0.2 rounded-md">PRO</span>
                      </div>
                      <div className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">Discipline Journal</div>
                    </div>
                  </div>

                  <span className="text-[9px] font-black uppercase tracking-widest bg-slate-900/90 text-emerald-400 border border-emerald-500/30 px-2.5 py-1 rounded-full">
                    {activeContent.tagEn}
                  </span>
                </div>

                {/* Center Content / Punchy Sales Message */}
                <div className="relative z-10 my-auto space-y-4 py-2">
                  
                  {/* Big Hook Headline */}
                  <div className="space-y-1.5">
                    <span className="text-[10px] font-extrabold uppercase tracking-widest text-amber-400 flex items-center gap-1">
                      <ShieldAlert className="w-3.5 h-3.5 text-amber-400" />
                      <span>THE COST OF BAD DISCIPLINE</span>
                    </span>
                    <h2 className="text-xl sm:text-2xl font-black text-white leading-tight tracking-tight drop-shadow-md">
                      {activeContent.titleEn}
                    </h2>
                    <p className="text-[11px] text-slate-300 leading-snug font-medium">
                      {activeContent.subEn}
                    </p>
                  </div>

                  {/* Visual Proof / R-Unit Leak Metric Card */}
                  <div className="bg-slate-900/90 backdrop-blur-md rounded-2xl p-3.5 border border-emerald-500/30 shadow-lg space-y-2.5">
                    <div className="flex items-center justify-between text-[10px] font-extrabold pb-1.5 border-b border-slate-800">
                      <span className="text-slate-400 uppercase tracking-wide">Monthly Leaks Audit</span>
                      <span className="text-rose-400 font-mono">-4.5 R Wiped Out</span>
                    </div>

                    <div className="space-y-1.5 text-[11px] font-medium text-slate-200">
                      <div className="flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                        <span>{activeContent.bullet1}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                        <span>{activeContent.bullet2}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                        <span>{activeContent.bullet3}</span>
                      </div>
                    </div>

                    {/* Score Bar */}
                    <div className="pt-1">
                      <div className="flex justify-between text-[9px] text-slate-400 font-bold mb-1">
                        <span>Average Trader Discipline</span>
                        <span className="text-emerald-400 font-mono font-black">Score: 9.2 / 10 👑</span>
                      </div>
                      <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                        <div className="bg-gradient-to-r from-emerald-500 to-indigo-500 h-full w-[92%]" />
                      </div>
                    </div>
                  </div>

                  {/* Social Proof Star Rating */}
                  <div className="flex items-center justify-between text-[10px] px-1 text-slate-400">
                    <div className="flex items-center gap-1 text-amber-400">
                      <span>★★★★★</span>
                      <span className="text-white font-bold font-mono">4.9/5</span>
                    </div>
                    <span>Used by 1,200+ disciplined traders</span>
                  </div>

                </div>

                {/* Bottom CTA Block */}
                <div className="relative z-10 space-y-2 pt-2">
                  <a
                    href={checkoutUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950 font-black text-xs transition-all shadow-lg shadow-emerald-500/25 flex items-center justify-center gap-1.5 cursor-pointer uppercase tracking-wider"
                  >
                    <span>Start 7-Day Free Trial</span>
                    <Zap className="w-3.5 h-3.5 fill-slate-950" />
                  </a>

                  <div className="flex items-center justify-center gap-3 text-[9px] text-slate-400 font-medium">
                    <span>✓ Cancel anytime</span>
                    <span>•</span>
                    <span>✓ Powered by {targetPlatform === 'whop' ? 'Whop' : 'iCount'}</span>
                    <span>•</span>
                    <span>✓ Zero Risk</span>
                  </div>
                </div>

                {/* Social icons overlay (Instagram/TikTok style mock) */}
                <div className="absolute right-3 bottom-24 flex flex-col items-center gap-3 text-white/80 z-20 pointer-events-none">
                  <div className="flex flex-col items-center">
                    <Heart className="w-5 h-5 fill-rose-500 text-rose-500" />
                    <span className="text-[9px] font-bold">2.4k</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <MessageCircle className="w-5 h-5" />
                    <span className="text-[9px] font-bold">142</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <Bookmark className="w-5 h-5" />
                    <span className="text-[9px] font-bold">589</span>
                  </div>
                </div>

              </div>
            </div>

            {/* Download poster button */}
            <div className="w-full max-w-[360px] pt-4 space-y-2">
              <button
                type="button"
                onClick={handleDownloadImage}
                className="w-full py-3 bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-xs rounded-2xl border border-slate-700 transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg active:scale-98"
              >
                <Download className="w-4 h-4 text-emerald-400" />
                <span>הורד את קובץ המודעה (High-Res 9:16 Image) 📥</span>
              </button>
              <p className="text-[10px] text-slate-500 text-center">
                מתאים במדויק לפרסום ב-Instagram Story / Reels, TikTok Ads, Facebook Ads או YouTube Shorts
              </p>
            </div>

          </div>

        </div>

      </main>

    </div>
  );
}
