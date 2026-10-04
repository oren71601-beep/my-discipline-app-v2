import React, { useState, useMemo } from 'react';
import { 
  TradingDay, 
  SingleTrade, 
  MentalStateOption, 
  DeviationOption, 
  ExecutedOption,
  MENTAL_STATE_TRANSLATIONS,
  MENTAL_STATE_EMOJIS,
  DEVIATION_TRANSLATIONS,
  DEVIATION_DESCRIPTIONS,
  HEBREW_WEEKDAYS,
  HEBREW_MONTH_NAMES
} from '../types';
import { 
  X, 
  Plus, 
  Trash2, 
  CheckCircle2, 
  AlertTriangle, 
  Star, 
  Save,
  ArrowRight,
  ArrowLeft,
  Copy
} from 'lucide-react';
import { LanguageCode, TRANSLATIONS } from '../utils/translations';

interface DailyTradesModalProps {
  isOpen: boolean;
  day: TradingDay;
  selectedYear: number;
  selectedMonth: number;
  language?: LanguageCode;
  onClose: () => void;
  onSaveDayTrades: (dayNumber: number, updatedDay: Partial<TradingDay>) => void;
}

export const DailyTradesModal: React.FC<DailyTradesModalProps> = ({
  isOpen,
  day,
  selectedYear,
  selectedMonth,
  language = 'he',
  onClose,
  onSaveDayTrades,
}) => {
  const isRtl = language === 'he' || language === 'ar';
  const t = TRANSLATIONS[language];

  // Initialize trade list (1 to 10 trades)
  const [trades, setTrades] = useState<SingleTrade[]>(() => {
    if (day.trades && day.trades.length > 0) {
      return JSON.parse(JSON.stringify(day.trades));
    }
    // If no individual trades yet, but the day has some executed data, seed trade #1 from day
    if (day.executed === 'Y') {
      return [{
        id: `trade_${Date.now()}_1`,
        tradeNumber: 1,
        symbol: '',
        direction: 'long',
        executed: 'Y',
        mentalState: day.mentalState || 'calm',
        deviation: day.deviation || 'none',
        confidence: day.confidence ?? 4,
        rating: day.rating ?? 7,
        resultR: day.resultR ?? 0,
        notes: day.notes || '',
        time: '',
      }];
    }
    // Default starting with 1 clean trade
    return [{
      id: `trade_${Date.now()}_1`,
      tradeNumber: 1,
      symbol: '',
      direction: 'long',
      executed: 'Y',
      mentalState: 'calm',
      deviation: 'none',
      confidence: 4,
      rating: 8,
      resultR: null,
      notes: '',
      time: '',
    }];
  });

  const [activeTradeIndex, setActiveTradeIndex] = useState<number>(0);

  // Sync state if day changes
  React.useEffect(() => {
    if (day.trades && day.trades.length > 0) {
      setTrades(JSON.parse(JSON.stringify(day.trades)));
    } else if (day.executed === 'Y') {
      setTrades([{
        id: `trade_${Date.now()}_1`,
        tradeNumber: 1,
        symbol: '',
        direction: 'long',
        executed: 'Y',
        mentalState: day.mentalState || 'calm',
        deviation: day.deviation || 'none',
        confidence: day.confidence ?? 4,
        rating: day.rating ?? 7,
        resultR: day.resultR ?? 0,
        notes: day.notes || '',
        time: '',
      }]);
    } else {
      setTrades([{
        id: `trade_${Date.now()}_1`,
        tradeNumber: 1,
        symbol: '',
        direction: 'long',
        executed: 'Y',
        mentalState: 'calm',
        deviation: 'none',
        confidence: 4,
        rating: 8,
        resultR: null,
        notes: '',
        time: '',
      }]);
    }
    setActiveTradeIndex(0);
  }, [day.day, day.trades]);

  if (!isOpen) return null;

  // Day metadata formatting
  const dateObj = new Date(selectedYear, selectedMonth - 1, day.day);
  const weekdayName = HEBREW_WEEKDAYS[dateObj.getDay()] || '';
  const monthName = HEBREW_MONTH_NAMES.find(m => m.id === selectedMonth)?.name || `${selectedMonth}`;

  // Current active trade
  const activeTrade = trades[activeTradeIndex] || trades[0];

  // Calculations for summary bar
  const totalR = useMemo(() => {
    const valid = trades.filter(t => t.resultR !== null && t.resultR !== undefined);
    if (valid.length === 0) return null;
    const sum = valid.reduce((acc, t) => acc + (t.resultR || 0), 0);
    return Math.round(sum * 100) / 100;
  }, [trades]);

  const winCount = trades.filter(t => (t.resultR || 0) > 0).length;
  const lossCount = trades.filter(t => (t.resultR || 0) < 0).length;
  const beCount = trades.filter(t => t.resultR === 0).length;
  const winRate = trades.length > 0 ? Math.round((winCount / trades.length) * 100) : 0;
  const disciplineCount = trades.filter(t => t.deviation === 'none').length;
  const disciplineRate = trades.length > 0 ? Math.round((disciplineCount / trades.length) * 100) : 100;

  // Actions on trades
  const handleUpdateActiveTrade = <K extends keyof SingleTrade>(field: K, value: SingleTrade[K]) => {
    setTrades(prev => prev.map((tr, idx) => {
      if (idx === activeTradeIndex) {
        return { ...tr, [field]: value };
      }
      return tr;
    }));
  };

  const handleAddTrade = () => {
    if (trades.length >= 10) return;
    const nextNum = trades.length + 1;
    const newTrade: SingleTrade = {
      id: `trade_${Date.now()}_${nextNum}`,
      tradeNumber: nextNum,
      symbol: activeTrade?.symbol || '',
      direction: 'long',
      executed: 'Y',
      mentalState: 'calm',
      deviation: 'none',
      confidence: 4,
      rating: 8,
      resultR: null,
      notes: '',
      time: '',
    };
    setTrades(prev => [...prev, newTrade]);
    setActiveTradeIndex(trades.length);
  };

  const handleDuplicateTrade = () => {
    if (trades.length >= 10) return;
    const nextNum = trades.length + 1;
    const duplicated: SingleTrade = {
      ...activeTrade,
      id: `trade_${Date.now()}_${nextNum}`,
      tradeNumber: nextNum,
      resultR: null,
      notes: '',
    };
    setTrades(prev => [...prev, duplicated]);
    setActiveTradeIndex(trades.length);
  };

  const handleDeleteTrade = (indexToDelete: number) => {
    if (trades.length <= 1) {
      // Reset the single trade instead of leaving an empty array
      setTrades([{
        id: `trade_${Date.now()}_1`,
        tradeNumber: 1,
        symbol: '',
        direction: 'long',
        executed: 'Y',
        mentalState: 'calm',
        deviation: 'none',
        confidence: 4,
        rating: 7,
        resultR: null,
        notes: '',
        time: '',
      }]);
      setActiveTradeIndex(0);
      return;
    }

    const filtered = trades.filter((_, idx) => idx !== indexToDelete).map((tr, idx) => ({
      ...tr,
      tradeNumber: idx + 1
    }));
    setTrades(filtered);
    if (activeTradeIndex >= filtered.length) {
      setActiveTradeIndex(filtered.length - 1);
    }
  };

  // Preset R values
  const rPresets = [-1, -0.5, 0, 1, 1.5, 2, 2.5, 3];

  // Save handler: compute daily row roll-up and sync
  const handleSaveAndSync = () => {
    // 1. Calculate aggregated Day Result R
    const finalTotalR = totalR;

    // 2. Determine day mental state (if any trade had revenge or stressed, highlight it, otherwise calm)
    const hasRevenge = trades.some(t => t.mentalState === 'revenge');
    const hasStressed = trades.some(t => t.mentalState === 'stressed');
    const aggregatedMental: MentalStateOption = hasRevenge 
      ? 'revenge' 
      : hasStressed 
        ? 'stressed' 
        : trades[0]?.mentalState || 'calm';

    // 3. Determine day deviation (if any trade deviated, pick the first deviation, else 'none')
    const deviatedTrade = trades.find(t => t.deviation && t.deviation !== 'none');
    const aggregatedDeviation: DeviationOption = deviatedTrade?.deviation || 'none';

    // 4. Calculate average confidence & rating
    const validConf = trades.filter(t => t.confidence !== null).map(t => t.confidence as number);
    const avgConfidence = validConf.length > 0 
      ? Math.round(validConf.reduce((a, b) => a + b, 0) / validConf.length) 
      : 4;

    const validRat = trades.filter(t => t.rating !== null).map(t => t.rating as number);
    const avgRating = validRat.length > 0 
      ? Math.round(validRat.reduce((a, b) => a + b, 0) / validRat.length) 
      : 7;

    // 5. Aggregate notes if day has multiple trade notes
    const combinedNotes = trades
      .filter(t => t.notes && t.notes.trim())
      .map(t => `#${t.tradeNumber}: ${t.notes?.trim()}`)
      .join(' | ');

    onSaveDayTrades(day.day, {
      executed: trades.length > 0 ? 'Y' : 'N',
      resultR: finalTotalR,
      mentalState: aggregatedMental,
      deviation: aggregatedDeviation,
      confidence: avgConfidence,
      rating: avgRating,
      notes: combinedNotes || day.notes || '',
      trades: trades,
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-sm overflow-y-auto">
      <div 
        dir={isRtl ? 'rtl' : 'ltr'} 
        className="relative w-full max-w-4xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh]"
      >
        {/* Top Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/20 border border-indigo-400/30 flex items-center justify-center text-indigo-300 font-bold text-lg">
              {day.day}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-bold">
                  {language === 'he' 
                    ? `פירוט עסקאות יומי - יום ${weekdayName}, ${day.day} ב${monthName} ${selectedYear}`
                    : `Daily Trades Breakdown - Day ${day.day}, ${monthName} ${selectedYear}`}
                </h2>
                <span className="text-xs bg-indigo-500/30 border border-indigo-400/40 text-indigo-200 px-2 py-0.5 rounded-full font-medium">
                  {trades.length} / 10 {language === 'he' ? 'עסקאות' : 'trades'}
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-0.5">
                {language === 'he' 
                  ? 'רישום מדויק של כל עסקה בנפרד (עד 10 עסקאות) עם סנכרון אוטומטי ללוח החודשי'
                  : 'Log each individual trade (up to 10) with automatic total R & discipline sync'}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            title="סגור"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Daily Summary Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 p-3 sm:px-6 sm:py-3 bg-slate-50 border-b border-slate-200 text-xs sm:text-sm">
          <div className="bg-white p-2.5 rounded-xl border border-slate-200 shadow-xs flex items-center justify-between">
            <span className="text-slate-500">{language === 'he' ? 'סה״כ תוצאה:' : 'Total Result:'}</span>
            <span className={`font-bold font-mono text-sm sm:text-base ${
              totalR === null 
                ? 'text-slate-500' 
                : totalR > 0 
                  ? 'text-emerald-600' 
                  : totalR < 0 
                    ? 'text-rose-600' 
                    : 'text-slate-700'
            }`}>
              {totalR === null ? '0.0 R' : `${totalR > 0 ? `+${totalR}` : totalR} R`}
            </span>
          </div>

          <div className="bg-white p-2.5 rounded-xl border border-slate-200 shadow-xs flex items-center justify-between">
            <span className="text-slate-500">{language === 'he' ? 'עסקאות מרוויחות:' : 'Win Rate:'}</span>
            <span className="font-bold text-slate-800">
              {winCount}W / {lossCount}L {beCount > 0 ? `(${beCount}BE)` : ''} · {winRate}%
            </span>
          </div>

          <div className="bg-white p-2.5 rounded-xl border border-slate-200 shadow-xs flex items-center justify-between">
            <span className="text-slate-500">{language === 'he' ? 'ציות לתוכנית:' : 'Discipline:'}</span>
            <span className={`font-bold flex items-center gap-1 ${
              disciplineRate === 100 ? 'text-emerald-600' : 'text-amber-600'
            }`}>
              {disciplineRate === 100 ? <CheckCircle2 className="w-3.5 h-3.5" /> : <AlertTriangle className="w-3.5 h-3.5" />}
              {disciplineRate}% ({disciplineCount}/{trades.length})
            </span>
          </div>

          <div className="bg-white p-2.5 rounded-xl border border-slate-200 shadow-xs flex items-center justify-between">
            <span className="text-slate-500">{language === 'he' ? 'עסקה פעילה:' : 'Active Trade:'}</span>
            <span className="font-bold text-indigo-600">
              #{activeTradeIndex + 1}
            </span>
          </div>
        </div>

        {/* Trade Selector Tabs (1 to 10) */}
        <div className="px-4 sm:px-6 pt-3 pb-2 bg-slate-100/70 border-b border-slate-200 overflow-x-auto flex items-center gap-1.5 scrollbar-thin">
          {trades.map((tr, idx) => {
            const isActive = idx === activeTradeIndex;
            const res = tr.resultR;
            return (
              <button
                key={tr.id}
                type="button"
                onClick={() => setActiveTradeIndex(idx)}
                className={`group shrink-0 flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer border ${
                  isActive 
                    ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm' 
                    : 'bg-white text-slate-700 border-slate-200 hover:border-indigo-300 hover:bg-indigo-50/50'
                }`}
              >
                <span>{language === 'he' ? `עסקה ${idx + 1}` : `Trade ${idx + 1}`}</span>
                {res !== null && res !== undefined && (
                  <span className={`text-xs font-mono font-bold ${
                    isActive 
                      ? 'text-white' 
                      : res > 0 
                        ? 'text-emerald-600' 
                        : res < 0 
                          ? 'text-rose-600' 
                          : 'text-slate-500'
                  }`}>
                    {res > 0 ? `+${res}` : res}R
                  </span>
                )}
              </button>
            );
          })}

          {trades.length < 10 && (
            <button
              type="button"
              onClick={handleAddTrade}
              className="shrink-0 inline-flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-bold text-indigo-700 bg-indigo-50 border border-indigo-200 hover:bg-indigo-100 hover:border-indigo-300 transition-colors cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>{language === 'he' ? 'הוסף עסקה (+)' : 'Add Trade (+)'}</span>
            </button>
          )}
        </div>

        {/* Active Trade Form Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5">
          {/* Active Trade Top Bar (Actions) */}
          <div className="flex items-center justify-between px-1 pb-1">
            <div className="flex items-center gap-2">
              <span className="w-7 h-7 rounded-xl bg-indigo-600 text-white text-xs font-bold flex items-center justify-center shadow-xs">
                #{activeTradeIndex + 1}
              </span>
              <span className="font-bold text-slate-800 text-sm sm:text-base">
                {language === 'he' ? `נתוני עסקה #${activeTradeIndex + 1}` : `Trade #${activeTradeIndex + 1}`}
              </span>
            </div>

            <div className="flex items-center gap-2">
              {trades.length < 10 && (
                <button
                  type="button"
                  onClick={handleDuplicateTrade}
                  className="inline-flex items-center gap-1.5 text-xs text-slate-700 hover:text-indigo-600 bg-white border border-slate-200 hover:border-indigo-300 px-3 py-1.5 rounded-xl transition-colors cursor-pointer shadow-2xs font-semibold"
                  title="שכפל עסקה זו כעסקה חדשה"
                >
                  <Copy className="w-3.5 h-3.5 text-indigo-500" />
                  <span>{language === 'he' ? 'שכפל עסקה' : 'Duplicate'}</span>
                </button>
              )}
              {trades.length > 1 && (
                <button
                  type="button"
                  onClick={() => handleDeleteTrade(activeTradeIndex)}
                  className="inline-flex items-center gap-1.5 text-xs text-rose-600 hover:text-rose-700 bg-white border border-rose-200 hover:bg-rose-50 px-3 py-1.5 rounded-xl transition-colors cursor-pointer shadow-2xs font-semibold"
                  title="מחק עסקה זו"
                >
                  <Trash2 className="w-3.5 h-3.5 text-rose-500" />
                  <span>{language === 'he' ? 'מחק עסקה' : 'Delete'}</span>
                </button>
              )}
            </div>
          </div>

          {/* Row 1: Result in R (The Core Metric) */}
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80 space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-700">
                {language === 'he' ? 'תוצאת העסקה ביחידות סיכון (R)' : 'Trade Result in Risk Units (R)'}
              </label>
              <span className="text-xs text-slate-500">
                {language === 'he' ? 'רווח של +2R, הפסד של -1R, או Breakeven (0)' : 'Profit (+2R), Loss (-1R), or Breakeven (0)'}
              </span>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-3">
              <div className="relative w-full sm:w-48">
                <input
                  type="number"
                  step="0.1"
                  placeholder="0.0"
                  value={activeTrade?.resultR === null || activeTrade?.resultR === undefined ? '' : activeTrade.resultR}
                  onChange={(e) => {
                    const val = e.target.value === '' ? null : parseFloat(e.target.value);
                    handleUpdateActiveTrade('resultR', val);
                  }}
                  className={`w-full px-4 py-2.5 text-lg font-bold font-mono border rounded-xl text-center focus:outline-none focus:ring-2 ${
                    (activeTrade?.resultR || 0) > 0 
                      ? 'border-emerald-300 text-emerald-700 bg-emerald-50/20 focus:ring-emerald-500' 
                      : (activeTrade?.resultR || 0) < 0 
                        ? 'border-rose-300 text-rose-700 bg-rose-50/20 focus:ring-rose-500' 
                        : 'border-slate-300 text-slate-800 bg-white focus:ring-indigo-500'
                  }`}
                />
                <span className="absolute right-3 top-3 text-xs font-bold text-slate-400">R</span>
              </div>

              {/* R Presets */}
              <div className="flex flex-wrap items-center gap-1.5 w-full">
                {rPresets.map(preset => {
                  const isSelected = activeTrade?.resultR === preset;
                  return (
                    <button
                      key={preset}
                      type="button"
                      onClick={() => handleUpdateActiveTrade('resultR', preset)}
                      className={`px-2.5 py-1.5 rounded-lg text-xs font-mono font-bold border transition-all cursor-pointer ${
                        isSelected 
                          ? preset > 0 
                            ? 'bg-emerald-600 text-white border-emerald-600' 
                            : preset < 0 
                              ? 'bg-rose-600 text-white border-rose-600' 
                              : 'bg-slate-800 text-white border-slate-800'
                          : preset > 0 
                            ? 'bg-white text-emerald-700 border-emerald-200 hover:bg-emerald-50' 
                            : preset < 0 
                              ? 'bg-white text-rose-700 border-rose-200 hover:bg-rose-50' 
                              : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {preset > 0 ? `+${preset}R` : `${preset}R`}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Row 3: Psychological & Mental State during Trade */}
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80 space-y-3">
            <div>
              <h3 className="font-bold text-slate-800 text-sm sm:text-base">
                {language === 'he' ? 'מצב מנטלי ופסיכולוגי בעסקה זו' : 'Mental State during this Trade'}
              </h3>
              <p className="text-xs text-slate-500">
                {language === 'he' ? 'איך הרגשת לפני ובמהלך ניהול העסקה?' : 'What was your primary emotional mindset?'}
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
              {(Object.keys(MENTAL_STATE_TRANSLATIONS) as Array<Exclude<MentalStateOption, null>>).map(st => {
                const isSelected = activeTrade?.mentalState === st;
                const emoji = MENTAL_STATE_EMOJIS[st];
                const label = language === 'he' ? MENTAL_STATE_TRANSLATIONS[st] : t.mentalState[st];
                return (
                  <button
                    key={st}
                    type="button"
                    onClick={() => handleUpdateActiveTrade('mentalState', st)}
                    className={`p-3 rounded-xl border text-center transition-all cursor-pointer flex flex-col items-center gap-1.5 ${
                      isSelected 
                        ? st === 'revenge'
                          ? 'bg-rose-600 text-white border-rose-600 shadow-md ring-2 ring-rose-300'
                          : st === 'stressed' || st === 'tired'
                            ? 'bg-amber-500 text-white border-amber-500 shadow-md ring-2 ring-amber-300'
                            : 'bg-indigo-600 text-white border-indigo-600 shadow-md ring-2 ring-indigo-300'
                        : 'bg-white text-slate-700 border-slate-200 hover:border-indigo-200 hover:bg-indigo-50/30'
                    }`}
                  >
                    <span className="text-2xl">{emoji}</span>
                    <span className="text-xs font-bold">{label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Row 4: Rule Deviation & Discipline */}
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80 space-y-3">
            <div>
              <h3 className="font-bold text-slate-800 text-sm sm:text-base">
                {language === 'he' ? 'חריגה מתוכנית המסחר (משמעת עצמית)' : 'Plan Deviation & Discipline'}
              </h3>
              <p className="text-xs text-slate-500">
                {language === 'he' 
                  ? 'האם נצמדת לחוקי האסטרטגיה שלך, או שהייתה חריגה כלשהי?' 
                  : 'Did you strictly adhere to rules or was there any plan deviation?'}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              {(Object.keys(DEVIATION_TRANSLATIONS) as Array<Exclude<DeviationOption, null>>).map(dev => {
                const isSelected = activeTrade?.deviation === dev;
                const label = language === 'he' ? DEVIATION_TRANSLATIONS[dev] : t.deviation[dev];
                const desc = language === 'he' ? DEVIATION_DESCRIPTIONS[dev] : '';
                return (
                  <button
                    key={dev}
                    type="button"
                    onClick={() => handleUpdateActiveTrade('deviation', dev)}
                    className={`p-3 rounded-xl border text-start transition-all cursor-pointer ${
                      isSelected 
                        ? dev === 'none'
                          ? 'bg-emerald-600 text-white border-emerald-600 shadow-md'
                          : 'bg-amber-600 text-white border-amber-600 shadow-md'
                        : 'bg-white text-slate-700 border-slate-200 hover:border-indigo-200 hover:bg-indigo-50/30'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xs sm:text-sm">{label}</span>
                      {dev === 'none' ? (
                        <CheckCircle2 className={`w-4 h-4 ${isSelected ? 'text-white' : 'text-emerald-500'}`} />
                      ) : (
                        <AlertTriangle className={`w-4 h-4 ${isSelected ? 'text-white' : 'text-amber-500'}`} />
                      )}
                    </div>
                    {desc && (
                      <p className={`text-[11px] mt-1 line-clamp-1 ${isSelected ? 'text-white/90' : 'text-slate-500'}`}>
                        {desc}
                      </p>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Row 5: Confidence (1-5) & Execution Rating (1-10) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Confidence */}
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80 space-y-2">
              <label className="block text-xs font-bold text-slate-700">
                {language === 'he' ? 'רמת ביטחון בעסקה (1 עד 5 כוכבים)' : 'Trade Confidence (1-5 Stars)'}
              </label>
              <div className="flex items-center gap-1.5 py-1">
                {[1, 2, 3, 4, 5].map((star) => {
                  const filled = (activeTrade?.confidence || 0) >= star;
                  return (
                    <button
                      key={star}
                      type="button"
                      onClick={() => handleUpdateActiveTrade('confidence', star)}
                      className="p-1 text-slate-300 hover:text-amber-400 hover:scale-125 transition-transform cursor-pointer"
                    >
                      <Star className={`w-6 h-6 ${filled ? 'fill-amber-400 text-amber-400' : 'text-slate-300'}`} />
                    </button>
                  );
                })}
                <span className="text-xs font-bold text-slate-600 mr-2 font-mono">
                  {activeTrade?.confidence || 0} / 5
                </span>
              </div>
            </div>

            {/* Rating 1-10 */}
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80 space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-700">
                  {language === 'he' ? 'ציון איכות הביצוע (1 עד 10)' : 'Execution Rating (1-10)'}
                </label>
                <span className="text-xs font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-md font-mono">
                  {activeTrade?.rating || 7} / 10
                </span>
              </div>
              <input
                type="range"
                min="1"
                max="10"
                value={activeTrade?.rating || 7}
                onChange={(e) => handleUpdateActiveTrade('rating', parseInt(e.target.value, 10))}
                className="w-full accent-indigo-600 h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                <span>1 (ביצוע לקוי)</span>
                <span>5 (בינוני)</span>
                <span>10 (מושלם)</span>
              </div>
            </div>
          </div>

          {/* Row 6: Personal Trade Notes */}
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80 space-y-2">
            <label className="block text-xs font-bold text-slate-700">
              {language === 'he' 
                ? `הערות ותובנות לעסקה #${activeTradeIndex + 1}` 
                : `Notes for Trade #${activeTradeIndex + 1}`}
            </label>
            <textarea
              rows={2}
              placeholder={language === 'he' 
                ? 'מה היה הטריגר לכניסה? למה יצאת? מה עבד טוב ומה כדאי לשפר בפעם הבאה?...' 
                : 'Entry trigger, execution review, lessons learned...'}
              value={activeTrade?.notes || ''}
              onChange={(e) => handleUpdateActiveTrade('notes', e.target.value)}
              className="w-full p-3 bg-white border border-slate-300 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 leading-relaxed"
            />
          </div>
        </div>

        {/* Footer / Navigation & Save */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-5 py-3.5 bg-slate-50 border-t border-slate-200">
          <div className="flex items-center gap-2 w-full sm:w-auto">
            {/* Prev / Next Trade Navigation */}
            <button
              type="button"
              disabled={activeTradeIndex === 0}
              onClick={() => setActiveTradeIndex(prev => Math.max(0, prev - 1))}
              className="px-3 py-1.5 rounded-lg border border-slate-300 bg-white text-xs font-medium text-slate-700 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1 cursor-pointer"
            >
              {isRtl ? <ArrowRight className="w-3.5 h-3.5" /> : <ArrowLeft className="w-3.5 h-3.5" />}
              <span>{language === 'he' ? 'עסקה קודמת' : 'Previous'}</span>
            </button>
            <button
              type="button"
              disabled={activeTradeIndex >= trades.length - 1}
              onClick={() => setActiveTradeIndex(prev => Math.min(trades.length - 1, prev + 1))}
              className="px-3 py-1.5 rounded-lg border border-slate-300 bg-white text-xs font-medium text-slate-700 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1 cursor-pointer"
            >
              <span>{language === 'he' ? 'עסקה הבאה' : 'Next'}</span>
              {isRtl ? <ArrowLeft className="w-3.5 h-3.5" /> : <ArrowRight className="w-3.5 h-3.5" />}
            </button>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-slate-300 text-xs font-semibold text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
            >
              {language === 'he' ? 'ביטול' : 'Cancel'}
            </button>
            <button
              type="button"
              onClick={handleSaveAndSync}
              className="inline-flex items-center justify-center gap-2 px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs sm:text-sm font-bold shadow-md shadow-indigo-200 transition-all cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>
                {language === 'he' 
                  ? `שמור וסנכרן ליומן (${trades.length} עסקאות)` 
                  : `Save & Sync to Journal (${trades.length} trades)`}
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
