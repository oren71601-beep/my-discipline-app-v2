import React, { useState, useEffect } from 'react';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  CheckCircle2, 
  XCircle, 
  Heart, 
  Activity, 
  TrendingUp, 
  ShieldCheck, 
  AlertTriangle,
  ChevronRight,
  ChevronLeft
} from 'lucide-react';

interface Props {
  language: 'he' | 'en' | 'ar' | 'ru';
  onLaunchApp: () => void;
}

interface StepData {
  stepNumber: number;
  phase: string;
  disciplined: {
    title: string;
    action: string;
    heartRate: number;
    mentalState: string;
    rStatus: string;
    rColor: string;
  };
  emotional: {
    title: string;
    action: string;
    heartRate: number;
    mentalState: string;
    rStatus: string;
    rColor: string;
  };
}

const STEPS: StepData[] = [
  {
    stepNumber: 1,
    phase: 'PRE-MARKET & SETUP IDENTIFICATION',
    disciplined: {
      title: 'Patience & Confluence Check',
      action: 'Marks key 4H support level. Writes down entry, invalidation level, and target. Waits 45 minutes for market to reach price.',
      heartRate: 64,
      mentalState: 'Calm, detached, objective',
      rStatus: '0.0 R (Risk defined: 1R)',
      rColor: 'text-slate-300'
    },
    emotional: {
      title: 'Impulsive Screen Staring',
      action: 'Opens charts with no plan. Sees a fast green 1-minute candle and feels urgent FOMO to press Buy before it "runs away".',
      heartRate: 112,
      mentalState: 'Anxious, FOMO, dopamine spike',
      rStatus: 'Undefined Risk (? R)',
      rColor: 'text-amber-400'
    }
  },
  {
    stepNumber: 2,
    phase: 'ORDER ENTRY & RISK ALLOCATION',
    disciplined: {
      title: 'Fixed Risk Limit Order',
      action: 'Places limit order at planned retest. Sets non-negotiable stop-loss with exact 1% account risk calculated automatically.',
      heartRate: 66,
      mentalState: 'Acceptance of loss before entry',
      rStatus: '-1.0 R max risk locked',
      rColor: 'text-emerald-400'
    },
    emotional: {
      title: 'Market Order & Oversizing',
      action: 'Clicks Market Buy at high of day. Doesn’t place stop-loss ("I will close it manually if it drops"). Takes 3x normal position.',
      heartRate: 128,
      mentalState: 'Greed, hoping, heart racing',
      rStatus: '-3.0 R open exposure',
      rColor: 'text-rose-400'
    }
  },
  {
    stepNumber: 3,
    phase: 'ADVERSITY & MID-TRADE TEST',
    disciplined: {
      title: 'Hands Off Terminal',
      action: 'Market pulls back to test entry. Price dips -0.6R into drawdown. Trader trusts stop-loss, takes a sip of water, and lets edge play out.',
      heartRate: 68,
      mentalState: 'Relaxed focus, stoic mindset',
      rStatus: '-0.6 R unrealized (within rules)',
      rColor: 'text-slate-300'
    },
    emotional: {
      title: 'Panic & Stop Widening',
      action: 'Market dips against position. Panics at the dollar loss. Drags mental stop further down ("It will bounce!"). Averages down with more lots.',
      heartRate: 148,
      mentalState: 'Terror, denial, prayer mode',
      rStatus: '-3.8 R catastrophic float',
      rColor: 'text-rose-500'
    }
  },
  {
    stepNumber: 4,
    phase: 'RESOLUTION & SESSION REVIEW',
    disciplined: {
      title: 'Target Hit // Systematic Alpha',
      action: 'Market rallies into key resistance. Take-profit order executes cleanly for +2.4R profit. Logs trade into Smart Journal and closes terminal.',
      heartRate: 65,
      mentalState: 'Disciplined satisfaction (10/10 Score)',
      rStatus: '+2.4 R Net Profit Banked',
      rColor: 'text-emerald-400 font-bold'
    },
    emotional: {
      title: 'Account Blowup // Revenge Cycle',
      action: 'Price keeps tanking. Hits margin liquidation or rage closes for massive loss. Immediately revenge trades in opposite direction and loses again.',
      heartRate: 156,
      mentalState: 'Severe depression, anger, tilt (1/10)',
      rStatus: '-6.2 R Total Destruction',
      rColor: 'text-rose-500 font-bold'
    }
  }
];

export const CinematicTradeVisualizer: React.FC<Props> = ({ language, onLaunchApp }) => {
  const [activeStep, setActiveStep] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);

  useEffect(() => {
    let timer: any;
    if (isPlaying) {
      timer = setInterval(() => {
        setActiveStep((prev) => (prev >= STEPS.length - 1 ? 0 : prev + 1));
      }, 4500);
    }
    return () => clearInterval(timer);
  }, [isPlaying]);

  const current = STEPS[activeStep];

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      
      {/* Header */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-mono">
          <Activity className="w-3.5 h-3.5" />
          <span>CINEMATIC MOTION // SIDE-BY-SIDE VISUALIZER</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
          {language === 'he' ? 'סימולציית מסחר חיה: סוחר ממושמע מול מהמר אמוציונלי' : 'Disciplined Pro vs Emotional Gambler: Execution Replay'}
        </h2>
        <p className="text-slate-400 text-sm max-w-2xl mx-auto">
          {language === 'he'
            ? 'השווה שלב אחר שלב את ההבדל הדרמטי בין פסיכולוגיה ממושמעת המגינה על ה-R לבין מלכודת ההימורים של מסחר רגשי'
            : 'Explore step-by-step how strict psychological discipline turns volatility into consistent positive mathematical expectancy.'}
        </p>
      </div>

      {/* Step Navigator */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-2 rounded-2xl bg-white/[0.03] border border-white/[0.08] max-w-2xl mx-auto">
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
          {STEPS.map((step, idx) => (
            <button
              key={idx}
              onClick={() => {
                setActiveStep(idx);
                setIsPlaying(false);
              }}
              className={`px-3 py-1.5 rounded-xl font-mono text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                activeStep === idx
                  ? 'bg-emerald-500 text-black shadow-md'
                  : 'text-slate-400 hover:text-white hover:bg-white/[0.05]'
              }`}
            >
              <span>Phase {step.stepNumber}</span>
            </button>
          ))}
        </div>

        <button
          onClick={() => setIsPlaying(!isPlaying)}
          className="px-3 py-1.5 rounded-xl bg-white/[0.06] hover:bg-white/[0.1] text-emerald-300 font-mono text-xs flex items-center gap-1.5 border border-white/[0.08] cursor-pointer transition-all"
        >
          {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 fill-emerald-300" />}
          <span>{isPlaying ? 'Pause' : 'Auto Play'}</span>
        </button>
      </div>

      {/* Main Side-by-Side Arena */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
        
        {/* Disciplined Pro Column */}
        <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-b from-emerald-950/20 via-[#0a0f0d] to-[#070908] border border-emerald-500/30 shadow-2xl space-y-6 text-start relative overflow-hidden">
          <div className="absolute top-0 right-0 w-48 h-48 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="flex items-center justify-between border-b border-emerald-500/20 pb-4">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <div>
                <span className="text-[10px] font-mono text-emerald-400 font-bold tracking-widest uppercase">DISCIPLINED OPERATOR</span>
                <div className="text-sm font-bold text-white">Smart Trading System</div>
              </div>
            </div>

            <div className="flex items-center gap-1.5 font-mono text-xs text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/30">
              <Heart className="w-3.5 h-3.5 fill-emerald-400 animate-pulse" />
              <span>{current.disciplined.heartRate} BPM</span>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <div className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">PHASE {current.stepNumber}: {current.phase}</div>
              <h3 className="text-lg font-bold text-white mt-1">{current.disciplined.title}</h3>
            </div>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-sans">
              {current.disciplined.action}
            </p>

            <div className="p-4 rounded-2xl bg-black/40 border border-emerald-500/20 space-y-2 font-mono text-xs">
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Mental State:</span>
                <span className="text-emerald-300 font-bold">{current.disciplined.mentalState}</span>
              </div>
              <div className="flex items-center justify-between border-t border-white/[0.05] pt-2">
                <span className="text-slate-400">R-Multiple Outcome:</span>
                <span className={current.disciplined.rColor}>{current.disciplined.rStatus}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs font-mono text-emerald-400 pt-2">
            <CheckCircle2 className="w-4 h-4" />
            <span>Positive Asymmetric Mathematical Edge Secured</span>
          </div>
        </div>

        {/* Emotional Gambler Column */}
        <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-b from-rose-950/20 via-[#120a0b] to-[#0a0708] border border-rose-500/25 shadow-2xl space-y-6 text-start relative overflow-hidden">
          <div className="absolute top-0 right-0 w-48 h-48 bg-rose-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="flex items-center justify-between border-b border-rose-500/20 pb-4">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-rose-500/20 border border-rose-500/40 text-rose-400 flex items-center justify-center">
                <AlertTriangle className="w-4 h-4" />
              </div>
              <div>
                <span className="text-[10px] font-mono text-rose-400 font-bold tracking-widest uppercase">EMOTIONAL GAMBLER</span>
                <div className="text-sm font-bold text-white">FOMO & Revenge Mode</div>
              </div>
            </div>

            <div className="flex items-center gap-1.5 font-mono text-xs text-rose-400 bg-rose-500/10 px-2.5 py-1 rounded-full border border-rose-500/30">
              <Heart className="w-3.5 h-3.5 fill-rose-500 animate-ping" />
              <span className="font-bold">{current.emotional.heartRate} BPM (Panic)</span>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <div className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">PHASE {current.stepNumber}: {current.phase}</div>
              <h3 className="text-lg font-bold text-white mt-1">{current.emotional.title}</h3>
            </div>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-sans">
              {current.emotional.action}
            </p>

            <div className="p-4 rounded-2xl bg-black/40 border border-rose-500/20 space-y-2 font-mono text-xs">
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Mental State:</span>
                <span className="text-rose-300 font-bold">{current.emotional.mentalState}</span>
              </div>
              <div className="flex items-center justify-between border-t border-white/[0.05] pt-2">
                <span className="text-slate-400">R-Multiple Outcome:</span>
                <span className={current.emotional.rColor}>{current.emotional.rStatus}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs font-mono text-rose-400 pt-2">
            <XCircle className="w-4 h-4" />
            <span>Negative Mathematical Expectancy (-0.85R average)</span>
          </div>
        </div>

      </div>

      {/* Interactive Navigation Footer */}
      <div className="flex items-center justify-between pt-2">
        <button
          onClick={() => setActiveStep((prev) => (prev > 0 ? prev - 1 : STEPS.length - 1))}
          className="px-4 py-2 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] text-slate-300 font-mono text-xs flex items-center gap-1.5 cursor-pointer border border-white/[0.08]"
        >
          <ChevronLeft className="w-3.5 h-3.5" />
          <span>Previous Phase</span>
        </button>

        <button
          onClick={onLaunchApp}
          className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-400 text-black font-extrabold text-xs cursor-pointer shadow-lg shadow-emerald-500/20 active:scale-95 flex items-center gap-1.5"
        >
          <span>{language === 'he' ? 'סחר כמו מקצוען ממושמע ⚡' : 'Trade with System Discipline ⚡'}</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </button>

        <button
          onClick={() => setActiveStep((prev) => (prev < STEPS.length - 1 ? prev + 1 : 0))}
          className="px-4 py-2 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] text-slate-300 font-mono text-xs flex items-center gap-1.5 cursor-pointer border border-white/[0.08]"
        >
          <span>Next Phase</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>

    </div>
  );
};
