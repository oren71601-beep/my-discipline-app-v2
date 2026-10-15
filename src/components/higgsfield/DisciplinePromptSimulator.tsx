import React, { useState } from 'react';
import { 
  Terminal, 
  Sparkles, 
  AlertTriangle, 
  CheckCircle2, 
  ShieldAlert, 
  ArrowRight, 
  RotateCcw, 
  Copy, 
  Check, 
  Flame, 
  Activity,
  Zap,
  SlidersHorizontal
} from 'lucide-react';

interface ScenarioPreset {
  id: string;
  category: string;
  prompt: string;
  tiltRisk: 'LOW' | 'MEDIUM' | 'HIGH' | 'EXTREME';
  tiltRiskPercent: number;
  directive: string;
  steps: string[];
  mathImpact: string;
  disciplineScoreDelta: string;
  mindsetRule: string;
}

const SCENARIOS: ScenarioPreset[] = [
  {
    id: 'revenge_loss',
    category: 'REVENGE TRADING',
    prompt: 'Just suffered a -1R stop-loss on NASDAQ breakout. Market is retesting the level. My impulse is to enter instantly with double size to break even.',
    tiltRisk: 'EXTREME',
    tiltRiskPercent: 92,
    directive: 'IMMEDIATE TERMINAL LOCKOUT (COOL-OFF PROTOCOL)',
    steps: [
      'Hands off mouse immediately. Stand up from the desk for 15 minutes.',
      'Log the loss as a valid business expense of your system — not an ego defeat.',
      'Never double position size. The probability of consecutive losses in revenge mode is 82%.'
    ],
    mathImpact: 'Revenge trades yield an expected value (EV) of -0.74R per trade, completely destroying positive expectancy.',
    disciplineScoreDelta: '-25% if violated · +10% resilience bonus if avoided',
    mindsetRule: 'The market owes you nothing. Your sole job is flawless execution, not winning back yesterday’s money.'
  },
  {
    id: 'fomo_breakout',
    category: 'FOMO & CHASE',
    prompt: 'Missed my morning setup by 3 minutes. The stock surged +4% without me. I want to buy right now at the top of the green candle.',
    tiltRisk: 'HIGH',
    tiltRiskPercent: 78,
    directive: 'ABORT CHASE // WAIT FOR PULLBACK CONFLUENCE',
    steps: [
      'Recognize the pain is pure FOMO (Fear of Missing Out), not an edge.',
      'Buying at extended highs blows your risk/reward from 1:3 down to 1:0.7.',
      'Set an alert at the key Fibonacci/EMA pullback level. If it never returns, let it go.'
    ],
    mathImpact: 'Chasing extended candles increases stop-loss distance by 2.4x while halving upside potential.',
    disciplineScoreDelta: '-15% discipline penalty on chase',
    mindsetRule: 'Missing a move costs $0.00. Chasing a move costs both capital and psychological equilibrium.'
  },
  {
    id: 'profit_giveback',
    category: 'OVERTRADING',
    prompt: 'I am up +3.2R before 11:00 AM. I feel euphoric and invincible. I want to keep trading all afternoon to make this my biggest day ever.',
    tiltRisk: 'HIGH',
    tiltRiskPercent: 74,
    directive: 'SESSION CEILING HIT // CAPITAL PRESERVATION LOCK',
    steps: [
      'Acknowledge euphoric dopamine rush — this is the #1 cause of giving back daily profits.',
      'Close trading software or enable platform risk guard for the remainder of the day.',
      'Export and review today’s trades while the feeling of discipline is fresh.'
    ],
    mathImpact: 'Traders who continue trading after hitting a +3R session give back on average 68% of their gains.',
    disciplineScoreDelta: '+20% discipline score bonus for banking the day',
    mindsetRule: 'Professional traders know when the market is done paying them for the day. Take the profit and leave.'
  },
  {
    id: 'pre_news_gamble',
    category: 'NEWS EVENT GAMBLING',
    prompt: 'CPI inflation numbers are coming out in 4 minutes. I want to guess the direction with high leverage because volatility will be huge.',
    tiltRisk: 'EXTREME',
    tiltRiskPercent: 96,
    directive: 'FLAT BEFORE NEWS // ZERO TOLERANCE PROTOCOL',
    steps: [
      'Cancel all resting market and limit orders immediately.',
      'Spread widening and slippage during CPI events make stop-losses completely unpredictable.',
      'Wait at least 5 minutes post-release for the market to establish genuine institutional structure.'
    ],
    mathImpact: 'News guessing is a 50/50 coin toss subject to negative asymmetric slippage of up to 4x standard spread.',
    disciplineScoreDelta: '-30% severe system violation',
    mindsetRule: 'You are a disciplined risk manager, not a roulette player. Never gamble on macro data.'
  },
  {
    id: 'drawdown_defense',
    category: 'PROP FIRM SHIELD',
    prompt: 'My funded account drawdown is at 3.2% (maximum allowed is 4%). I have 0.8% room left. I need to choose my next position size.',
    tiltRisk: 'MEDIUM',
    tiltRiskPercent: 65,
    directive: 'DEFENSIVE CONTRACT DOWNSIZING (SURVIVAL MODE)',
    steps: [
      'Reduce standard risk per trade from 1.0% down to 0.25% or 0.20%.',
      'This buys you 4 to 5 independent attempts rather than risking a single-trade account breach.',
      'Only accept A+ grade setups with clean higher-timeframe confluence.'
    ],
    mathImpact: 'Cutting risk to 0.25% drops probability of account breach from 63% down to under 8%.',
    disciplineScoreDelta: '+15% strategic risk management rating',
    mindsetRule: 'Account survival always precedes profit maximization. Live to trade another day.'
  }
];

interface Props {
  language: 'he' | 'en' | 'ar' | 'ru';
  onLaunchApp: () => void;
}

export const DisciplinePromptSimulator: React.FC<Props> = ({ language, onLaunchApp }) => {
  const [selectedId, setSelectedId] = useState<string>(SCENARIOS[0].id);
  const [customPrompt, setCustomPrompt] = useState<string>('');
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [isCopied, setIsCopied] = useState<boolean>(false);

  const activeScenario = SCENARIOS.find(s => s.id === selectedId) || SCENARIOS[0];

  const handleSelectPreset = (scenario: ScenarioPreset) => {
    setSelectedId(scenario.id);
    setCustomPrompt('');
    setIsAnalyzing(true);
    setTimeout(() => setIsAnalyzing(false), 300);
  };

  const handleCopyDirective = () => {
    const text = `HIGGSFIELD DISCIPLINE DIRECTIVE:
Scenario: ${customPrompt || activeScenario.prompt}
Tilt Risk: ${activeScenario.tiltRisk} (${activeScenario.tiltRiskPercent}%)
Directive: ${activeScenario.directive}
Action Steps:
${activeScenario.steps.map((s, i) => `${i + 1}. ${s}`).join('\n')}
Golden Rule: ${activeScenario.mindsetRule}`;

    navigator.clipboard.writeText(text);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2500);
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      
      {/* Header */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-mono">
          <Terminal className="w-3.5 h-3.5" />
          <span>HIGGSFIELD PROMPT STUDIO // SCENARIO SIMULATOR</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
          {language === 'he' ? 'סימולטור תרחישי מסחר ומשמעת מנטלית' : 'Discipline Scenario & Tilt AI Simulator'}
        </h2>
        <p className="text-slate-400 text-sm max-w-2xl mx-auto">
          {language === 'he'
            ? 'הזן תרחיש מסחר פסיכולוגי או בחר מקרה בוחן אמיתי וקבל הנחיית פעולה מיידית לנטרול דחפים הרסניים'
            : 'Simulate high-stakes trading psychology moments and receive strict algorithmic execution directives.'}
        </p>
      </div>

      {/* Preset Selector Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5">
        {SCENARIOS.map((sc) => {
          const isSelected = selectedId === sc.id && !customPrompt;
          return (
            <button
              key={sc.id}
              onClick={() => handleSelectPreset(sc)}
              className={`p-3 rounded-xl border text-start transition-all cursor-pointer flex flex-col justify-between gap-2 ${
                isSelected
                  ? 'bg-emerald-500/15 border-emerald-500 text-white shadow-lg shadow-emerald-500/10'
                  : 'bg-white/[0.02] border-white/[0.08] text-slate-300 hover:border-white/20 hover:bg-white/[0.04]'
              }`}
            >
              <div className="flex items-center justify-between text-[10px] font-mono">
                <span className="text-emerald-400 font-bold">{sc.category}</span>
                <span className={sc.tiltRisk === 'EXTREME' ? 'text-rose-400 font-bold' : 'text-amber-400'}>
                  {sc.tiltRisk}
                </span>
              </div>
              <div className="text-xs font-bold line-clamp-2 leading-snug">
                {sc.prompt}
              </div>
            </button>
          );
        })}
      </div>

      {/* Interactive Prompt Cockpit */}
      <div className="rounded-3xl bg-white/[0.02] border border-white/[0.08] p-6 sm:p-8 backdrop-blur-xl space-y-6">
        
        {/* Active Prompt Box */}
        <div className="space-y-2 text-start">
          <div className="flex items-center justify-between text-xs font-mono text-slate-400">
            <span className="flex items-center gap-1.5 text-emerald-400 font-bold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>ACTIVE SCENARIO PROMPT</span>
            </span>
            <span>Category: {activeScenario.category}</span>
          </div>

          <div className="p-4 rounded-2xl bg-black/60 border border-white/[0.08] text-white text-sm leading-relaxed font-sans font-medium">
            "{customPrompt || activeScenario.prompt}"
          </div>
        </div>

        {/* Results Console */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch text-start">
          
          {/* Left Column: Directive & Execution Checklist */}
          <div className="lg:col-span-8 p-6 rounded-2xl bg-[#09090e] border border-white/[0.08] space-y-5">
            
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/[0.08] pb-4">
              <div>
                <div className="text-[10px] font-mono text-slate-400 uppercase tracking-widest">SENTINEL DIRECTIVE</div>
                <div className="text-base sm:text-lg font-black text-emerald-400 font-mono tracking-tight flex items-center gap-2">
                  <ShieldAlert className="w-5 h-5 text-emerald-400 shrink-0" />
                  <span>{activeScenario.directive}</span>
                </div>
              </div>

              <button
                onClick={handleCopyDirective}
                className="px-3 py-1.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] text-slate-300 hover:text-white font-mono text-xs border border-white/[0.08] flex items-center gap-1.5 cursor-pointer self-start sm:self-auto transition-all"
              >
                {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-slate-400" />}
                <span>{isCopied ? 'Copied' : 'Copy Protocol'}</span>
              </button>
            </div>

            {/* Step-by-Step Action Plan */}
            <div className="space-y-3">
              <div className="text-xs font-mono text-slate-300 font-bold">MANDATORY PROTOCOL STEPS:</div>
              <div className="space-y-2.5">
                {activeScenario.steps.map((step, idx) => (
                  <div key={idx} className="flex items-start gap-3 p-3 rounded-xl bg-white/[0.02] border border-white/[0.05]">
                    <span className="w-5 h-5 rounded-md bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono font-bold flex items-center justify-center shrink-0">
                      {idx + 1}
                    </span>
                    <span className="text-xs sm:text-sm text-slate-200 leading-relaxed font-sans">{step}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Golden Mindset Rule */}
            <div className="p-4 rounded-xl bg-emerald-500/[0.04] border border-emerald-500/20 space-y-1">
              <div className="text-[10px] font-mono text-emerald-400 font-bold">CORE PSYCHOLOGICAL PRINCIPLE:</div>
              <p className="text-xs text-emerald-200 italic font-sans leading-relaxed">
                "{activeScenario.mindsetRule}"
              </p>
            </div>

          </div>

          {/* Right Column: Tilt & Risk Gauges */}
          <div className="lg:col-span-4 p-6 rounded-2xl bg-[#09090e] border border-white/[0.08] flex flex-col justify-between space-y-6">
            
            <div className="space-y-4">
              <div className="text-xs font-mono text-slate-400 font-bold">PSYCHOLOGICAL METRICS</div>

              {/* Tilt Risk Gauge */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-slate-300">Tilt Risk Index</span>
                  <span className={`font-black ${
                    activeScenario.tiltRisk === 'EXTREME' ? 'text-rose-400' :
                    activeScenario.tiltRisk === 'HIGH' ? 'text-amber-400' : 'text-emerald-400'
                  }`}>
                    {activeScenario.tiltRiskPercent}% ({activeScenario.tiltRisk})
                  </span>
                </div>
                <div className="w-full bg-white/[0.06] h-2.5 rounded-full overflow-hidden">
                  <div 
                    className={`h-full transition-all duration-500 ${
                      activeScenario.tiltRisk === 'EXTREME' ? 'bg-gradient-to-r from-amber-500 to-rose-500' :
                      activeScenario.tiltRisk === 'HIGH' ? 'bg-gradient-to-r from-emerald-500 to-amber-500' : 'bg-emerald-500'
                    }`}
                    style={{ width: `${activeScenario.tiltRiskPercent}%` }}
                  />
                </div>
              </div>

              {/* Mathematical Expectancy Impact */}
              <div className="p-3.5 rounded-xl bg-black/40 border border-white/[0.06] space-y-1">
                <div className="text-[10px] font-mono text-slate-400 uppercase">MATHEMATICAL EXPECTANCY (EV)</div>
                <p className="text-xs text-slate-300 leading-relaxed font-sans">
                  {activeScenario.mathImpact}
                </p>
              </div>

              {/* Discipline Rating Delta */}
              <div className="p-3.5 rounded-xl bg-black/40 border border-white/[0.06] space-y-1">
                <div className="text-[10px] font-mono text-slate-400 uppercase">DISCIPLINE RATING IMPACT</div>
                <p className="text-xs text-emerald-400 font-mono font-bold">
                  {activeScenario.disciplineScoreDelta}
                </p>
              </div>
            </div>

            {/* Launch App to Log Trade */}
            <button
              onClick={onLaunchApp}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-400 hover:from-emerald-400 hover:to-emerald-300 text-black font-extrabold text-xs transition-all shadow-md shadow-emerald-500/20 flex items-center justify-center gap-2 cursor-pointer active:scale-95"
            >
              <span>{language === 'he' ? 'פתח יומן לתעד יום ממושמע' : 'Launch Journal to Log Session'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>

          </div>

        </div>

      </div>

    </div>
  );
};
