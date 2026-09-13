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
  FileText
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
3. ACTIONABLE STRATEGIC DIRECTIVES FOR NEXT MONTH
========================================
${improvementDirectives.map((d, i) => `${i + 1}. [${d.title}]\n   ${d.desc}\n`).join('\n')}

========================================
4. TRADER'S COMMITMENT & PLEDGE
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

          {/* Section 3: Actionable Strategic Improvement Plan for Next Month */}
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
