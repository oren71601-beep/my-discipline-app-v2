import React, { useState } from 'react';
import { 
  ShieldCheck, 
  AlertTriangle, 
  Sliders, 
  DollarSign, 
  Target, 
  Percent, 
  Copy, 
  Check, 
  Zap, 
  TrendingUp,
  Activity
} from 'lucide-react';

interface Props {
  language: 'he' | 'en' | 'ar' | 'ru';
  onLaunchApp: () => void;
}

export const PropFirmShieldCalculator: React.FC<Props> = ({ language, onLaunchApp }) => {
  const [accountSize, setAccountSize] = useState<number>(100000);
  const [maxDrawdownPercent, setMaxDrawdownPercent] = useState<number>(4);
  const [riskPerTradePercent, setRiskPerTradePercent] = useState<number>(0.5);
  const [profitTargetPercent, setProfitTargetPercent] = useState<number>(8);
  const [isCopied, setIsCopied] = useState<boolean>(false);

  // Calculations
  const maxDrawdownDollar = (accountSize * maxDrawdownPercent) / 100;
  const riskPerTradeDollar = (accountSize * riskPerTradePercent) / 100;
  const profitTargetDollar = (accountSize * profitTargetPercent) / 100;

  // Consecutive losses survivable before breach
  const consecutiveLosses = Math.floor(maxDrawdownDollar / riskPerTradeDollar);

  // Required R to hit target
  const requiredR = (profitTargetDollar / riskPerTradeDollar).toFixed(1);

  // Safety rating
  const isHighRisk = consecutiveLosses < 5;
  const isMediumRisk = consecutiveLosses >= 5 && consecutiveLosses < 8;
  const isSafe = consecutiveLosses >= 8;

  const handleCopyPlan = () => {
    const text = `HIGGSFIELD PROP FIRM CAPITAL SHIELD:
Account Size: $${accountSize.toLocaleString()}
Max Drawdown: ${maxDrawdownPercent}% ($${maxDrawdownDollar.toLocaleString()})
Risk Per Trade (1R): ${riskPerTradePercent}% ($${riskPerTradeDollar.toLocaleString()})
Consecutive Losses Survivable: ${consecutiveLosses} trades
Profit Target: ${profitTargetPercent}% ($${profitTargetDollar.toLocaleString()}) = ${requiredR} R
Safety Rating: ${isSafe ? 'OPTIMAL' : isMediumRisk ? 'MODERATE' : 'DANGEROUS (OVERSIZED)'}`;

    navigator.clipboard.writeText(text);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2500);
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      
      {/* Header */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-mono">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>HIGGSFIELD PRECISION LAB // PROP FIRM DRAWDOWN SHIELD</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
          {language === 'he' ? 'מחשבון שרידות חשבונות נוסטרו (Prop Firm Shield)' : 'Prop Firm & Drawdown Capital Shield Calculator'}
        </h2>
        <p className="text-slate-400 text-sm max-w-2xl mx-auto">
          {language === 'he'
            ? 'חשב במדויק את יחידות הסיכון (R) והשרידות המקסימלית כדי למנוע שריפת חשבונות ממומנים'
            : 'Mathematically calibrate risk per trade to maximize funded account survival probability.'}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
        
        {/* Sliders Input Panel */}
        <div className="lg:col-span-7 p-6 sm:p-8 rounded-3xl bg-white/[0.02] border border-white/[0.08] space-y-6 text-start">
          
          {/* Account Size */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-slate-300">Account Size</span>
              <span className="text-emerald-400 font-bold text-sm">${accountSize.toLocaleString()}</span>
            </div>
            <div className="grid grid-cols-5 gap-1.5">
              {[25000, 50000, 100000, 150000, 200000].map((size) => (
                <button
                  key={size}
                  onClick={() => setAccountSize(size)}
                  className={`py-2 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer border ${
                    accountSize === size
                      ? 'bg-emerald-500 text-black border-emerald-500 shadow-sm'
                      : 'bg-black/40 border-white/[0.08] text-slate-300 hover:border-white/20'
                  }`}
                >
                  ${size / 1000}k
                </button>
              ))}
            </div>
          </div>

          {/* Max Drawdown */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-slate-300">Maximum Allowed Drawdown</span>
              <span className="text-rose-400 font-bold text-sm">{maxDrawdownPercent}% (${maxDrawdownDollar.toLocaleString()})</span>
            </div>
            <input
              type="range"
              min="3"
              max="12"
              step="0.5"
              value={maxDrawdownPercent}
              onChange={(e) => setMaxDrawdownPercent(parseFloat(e.target.value))}
              className="w-full accent-rose-400 bg-white/10 rounded-lg h-2 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] font-mono text-slate-500">
              <span>3% (Strict)</span>
              <span>6% (Standard)</span>
              <span>12% (Generous)</span>
            </div>
          </div>

          {/* Risk Per Trade (1R) */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-slate-300">Risk Per Trade (1R)</span>
              <span className="text-emerald-400 font-bold text-sm">{riskPerTradePercent}% (${riskPerTradeDollar.toLocaleString()})</span>
            </div>
            <input
              type="range"
              min="0.2"
              max="2.0"
              step="0.05"
              value={riskPerTradePercent}
              onChange={(e) => setRiskPerTradePercent(parseFloat(e.target.value))}
              className="w-full accent-emerald-400 bg-white/10 rounded-lg h-2 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] font-mono text-slate-500">
              <span>0.25% (Hedge Fund)</span>
              <span>0.5% (Pro Sweetspot)</span>
              <span>1.0%+ (High Volatility)</span>
            </div>
          </div>

          {/* Target Profit */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-slate-300">Profit Target</span>
              <span className="text-indigo-300 font-bold text-sm">{profitTargetPercent}% (${profitTargetDollar.toLocaleString()})</span>
            </div>
            <input
              type="range"
              min="4"
              max="15"
              step="1"
              value={profitTargetPercent}
              onChange={(e) => setProfitTargetPercent(parseFloat(e.target.value))}
              className="w-full accent-indigo-400 bg-white/10 rounded-lg h-2 cursor-pointer"
            />
          </div>

        </div>

        {/* Output Metrics Panel */}
        <div className="lg:col-span-5 p-6 sm:p-8 rounded-3xl bg-[#09090e] border border-white/[0.08] flex flex-col justify-between space-y-6 text-start">
          
          <div className="space-y-5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono text-slate-400 uppercase">SURVIVAL MATRIX</span>
              <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full border ${
                isSafe 
                  ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40' 
                  : isMediumRisk 
                  ? 'bg-amber-500/20 text-amber-300 border-amber-500/40' 
                  : 'bg-rose-500/20 text-rose-300 border-rose-500/40'
              }`}>
                {isSafe ? 'OPTIMAL SAFETY' : isMediumRisk ? 'MODERATE RISK' : 'EXTREME BREACH RISK'}
              </span>
            </div>

            {/* Consecutive Losses Metric */}
            <div className="p-4 rounded-2xl bg-black/40 border border-white/[0.06] space-y-1">
              <div className="text-[10px] font-mono text-slate-400">SURVIVABLE CONSECUTIVE LOSSES:</div>
              <div className="flex items-baseline gap-2">
                <span className={`text-3xl font-black font-mono ${
                  isSafe ? 'text-emerald-400' : isMediumRisk ? 'text-amber-400' : 'text-rose-400'
                }`}>
                  {consecutiveLosses}
                </span>
                <span className="text-xs text-slate-400">Full 1R Stop-Outs</span>
              </div>
              <p className="text-[11px] text-slate-400 mt-1 font-sans">
                {isSafe 
                  ? 'Excellent breathing room. The odds of 8+ consecutive losses with a proven edge are under 2%.'
                  : 'Danger: fewer than 5 consecutive losses exposes account to standard statistical variance.'}
              </p>
            </div>

            {/* Required R to Pass */}
            <div className="p-4 rounded-2xl bg-black/40 border border-white/[0.06] space-y-1">
              <div className="text-[10px] font-mono text-slate-400">REQUIRED R-MULTIPLES TO PASS:</div>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-black font-mono text-indigo-400">
                  +{requiredR} R
                </span>
                <span className="text-xs text-slate-400">Net Units Needed</span>
              </div>
              <p className="text-[11px] text-slate-400 mt-1 font-sans">
                Achievable in 6 to 8 disciplined trades with a standard 1:2.5 risk-reward ratio.
              </p>
            </div>
          </div>

          <div className="space-y-3 pt-4 border-t border-white/[0.08]">
            <button
              onClick={handleCopyPlan}
              className="w-full py-2.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] text-slate-300 hover:text-white font-mono text-xs border border-white/[0.08] flex items-center justify-center gap-2 cursor-pointer transition-all"
            >
              {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-slate-400" />}
              <span>{isCopied ? 'Risk Plan Copied' : 'Copy Risk Plan'}</span>
            </button>

            <button
              onClick={onLaunchApp}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-400 text-black font-black text-xs cursor-pointer shadow-md shadow-emerald-500/20 active:scale-95"
            >
              Apply to Trading Journal ⚡
            </button>
          </div>

        </div>

      </div>

    </div>
  );
};
