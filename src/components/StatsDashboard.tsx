import { TradingDay, MENTAL_STATE_EMOJIS, MentalStateOption, DeviationOption, NoEntryReasonOption } from '../types';
import { Target, Smile, AlertTriangle, Disc, BarChart, Award, Brain } from 'lucide-react';
import { LanguageCode, TRANSLATIONS } from '../utils/translations';

interface StatsDashboardProps {
  days: TradingDay[];
  language?: LanguageCode;
}

export function StatsDashboard({ days, language = 'he' }: StatsDashboardProps) {
  const t = TRANSLATIONS[language];
  const isRtl = language === 'he' || language === 'ar';

  // Filters to evaluate active stats
  const activeDays = days.filter(d => d.executed !== null);
  const executedDays = days.filter(d => d.executed === 'Y');
  const noTradeDays = days.filter(d => d.executed === 'N');

  // Basic counting metrics
  const totalTradesCount = executedDays.length;
  
  // Results calculations
  const profitableTrades = executedDays.filter(d => (d.resultR || 0) > 0);
  const losingTrades = executedDays.filter(d => (d.resultR || 0) < 0);
  const breakEvenTrades = executedDays.filter(d => (d.resultR || 0) === 0);
  
  const winRate = totalTradesCount > 0 ? (profitableTrades.length / totalTradesCount) * 100 : 0;
  
  // Total R
  const totalR = executedDays.reduce((acc, d) => acc + (d.resultR || 0), 0);
  const formattedTotalR = totalR >= 0 ? `+${totalR.toFixed(2)}` : `${totalR.toFixed(2)}`;

  // Average confidence & rating
  const confidenceRatings = executedDays.filter(d => d.confidence !== null) as { confidence: number }[];
  const averageConfidence = confidenceRatings.length > 0 
    ? confidenceRatings.reduce((sum, d) => sum + d.confidence, 0) / confidenceRatings.length
    : 0;

  const scoreRatings = executedDays.filter(d => d.rating !== null) as { rating: number }[];
  const averageRating = scoreRatings.length > 0 
    ? scoreRatings.reduce((sum, d) => sum + d.rating, 0) / scoreRatings.length
    : 0;

  // Mental State distribution
  const mentalStateCounts: Record<string, number> = { calm: 0, stressed: 0, tired: 0, indifferent: 0, revenge: 0 };
  executedDays.forEach(d => {
    if (d.mentalState) mentalStateCounts[d.mentalState]++;
  });

  // Deviation from plan distribution
  const deviationCounts: Record<string, number> = { none: 0, early_entry: 0, move_stop: 0, raise_risk: 0, early_exit: 0 };
  executedDays.forEach(d => {
    if (d.deviation) deviationCounts[d.deviation]++;
  });

  // No Entry Reasons distribution
  const noEntryCounts: Record<string, number> = { focus: 0, rr: 0, discipline: 0, fear: 0, other: 0 };
  noTradeDays.forEach(d => {
    if (d.noEntryReason) noEntryCounts[d.noEntryReason]++;
  });

  // Calculate Discipline score (percentage of trades with "none" deviation)
  const noDeviationsCount = deviationCounts.none || 0;
  const disciplineScore = totalTradesCount > 0 ? (noDeviationsCount / totalTradesCount) * 100 : 100;

  // Calculate premium mental performance logs
  // Average R by mental state
  const mentalStateRMeans = Object.keys(mentalStateCounts).map(state => {
    const stateTrades = executedDays.filter(d => d.mentalState === state);
    const sum = stateTrades.reduce((acc, d) => acc + (d.resultR || 0), 0);
    const mean = stateTrades.length > 0 ? sum / stateTrades.length : 0;
    return { state, count: stateTrades.length, mean };
  });

  // Intelligent insight triggers
  const insights: string[] = [];
  
  const revengeStats = mentalStateRMeans.find(m => m.state === 'revenge');
  const calmStats = mentalStateRMeans.find(m => m.state === 'calm');

  if (revengeStats && revengeStats.count > 0 && revengeStats.mean < 0) {
    if (language === 'he') {
      insights.push(`עסקאות שבוצעו במצב של <b>נקמה (😡)</b> הסתיימו בהפסד ממוצע של <span class="text-rose-600 font-semibold dir-ltr inline-block">${revengeStats.mean.toFixed(1)}R</span>. מומלץ לסגור את המחשב לאחר הפסד בודד.`);
    } else if (language === 'en') {
      insights.push(`Trades executed in a <b>Revenge (😡)</b> state ended in an average loss of <span class="text-rose-600 font-semibold inline-block">${revengeStats.mean.toFixed(1)}R</span>. It is recommended to stop trading after a single loss.`);
    } else if (language === 'ar') {
      insights.push(`الصفقات المنفذة في حالة <b>الانتقام (😡)</b> انتهت بمتوسط خسارة قدره <span class="text-rose-600 font-semibold inline-block">${revengeStats.mean.toFixed(1)}R</span>. يُنصح بالتوقف عن التداول بعد خسارة واحدة.`);
    } else {
      insights.push(`Сделки, совершенные в состоянии <b>мести/тильта (😡)</b>, завершились со средним убытком <span class="text-rose-600 font-semibold inline-block">${revengeStats.mean.toFixed(1)}R</span>. Рекомендуется прекратить торговлю после первого убытка.`);
    }
  }
  
  if (calmStats && calmStats.count > 1 && calmStats.mean > 0) {
    if (language === 'he') {
      insights.push(`מצב רוח <b>רגוע (🧘‍♂️)</b> מוכיח את עצמו! השגת רווח ממוצע של <span class="text-emerald-600 font-semibold dir-ltr inline-block">${calmStats.mean.toFixed(1)}R</span> בעסקאות אלו.`);
    } else if (language === 'en') {
      insights.push(`<b>Calm (🧘‍♂️)</b> state is proving itself! You achieved an average profit of <span class="text-emerald-600 font-semibold inline-block">${calmStats.mean.toFixed(1)}R</span> in these trades.`);
    } else if (language === 'ar') {
      insights.push(`الحالة <b>الهادئة (🧘‍♂️)</b> تُثبت نجاحها! حققت متوسط ربح قدره <span class="text-emerald-600 font-semibold inline-block">${calmStats.mean.toFixed(1)}R</span> في هذه الصفقات.`);
    } else {
      insights.push(`<b>Спокойное (🧘‍♂️)</b> состояние оправдывает себя! Вы получили среднюю прибыль <span class="text-emerald-600 font-semibold inline-block">${calmStats.mean.toFixed(1)}R</span> в этих сделках.`);
    }
  }

  const criticalDeviationsCount = (deviationCounts.move_stop || 0) + (deviationCounts.raise_risk || 0);
  if (criticalDeviationsCount > 0) {
    if (language === 'he') {
      insights.push(`נרשמו <b>${criticalDeviationsCount} סטיות קריטיות</b> מתוכנית המסחר (הזזת סטופ או הגדלת סיכון). אלו סטיות שמסכנות את שרידות החשבון.`);
    } else if (language === 'en') {
      insights.push(`Recorded <b>${criticalDeviationsCount} critical deviations</b> from your plan (moved stop or raised risk). These seriously endanger account survival.`);
    } else if (language === 'ar') {
      insights.push(`تم تسجيل <b>${criticalDeviationsCount} انحرافات خطيرة</b> عن خطة التداول (تحريك الوقف أو رفع المخاطرة). هذه الانحرافات تهدد بقاء الحساب.`);
    } else {
      insights.push(`Зафиксировано <b>${criticalDeviationsCount} критических нарушений</b> плана (перенос стопа или завышение риска). Это серьезно угрожает выживанию счета.`);
    }
  }

  const fearEntryCount = noEntryCounts.fear || 0;
  if (fearEntryCount > 1) {
    if (language === 'he') {
      insights.push(`בחרת לא להיכנס ל-<b>${fearEntryCount} עסקאות מפאת פחד</b>. מומלץ להקטין את גודל הפוזיציה (R) כדי להוריד את רמת החרדה.`);
    } else if (language === 'en') {
      insights.push(`You skipped <b>${fearEntryCount} trades due to fear</b>. Consider reducing position risk (R) to lower anxiety levels.`);
    } else if (language === 'ar') {
      insights.push(`لقد تجنبت <b>${fearEntryCount} صفقات بسبب الخوف</b>. يُنصح بتقليل حجم المخاطرة (R) لتخفيف مستويات القلق.`);
    } else {
      insights.push(`Вы пропустили <b>${fearEntryCount} сделок из-за страха</b>. Рассмотрите возможность снижения риска (R) для уменьшения тревожности.`);
    }
  }

  if (insights.length === 0) {
    if (language === 'he') {
      insights.push("היומן ריק או שהביצועים שלך עומדים בדרישות היציבות. המשך להזין נתונים כדי לקבל תובנות מותאמות אישית!");
    } else if (language === 'en') {
      insights.push("The journal is empty or your performance meets stability standards. Continue logging to receive personalized insights!");
    } else if (language === 'ar') {
      insights.push("الدفتر فارغ أو أدائك يطابق معايير الاستقرار. استمر في التدوين للحصول على إحصاءات مخصصة!");
    } else {
      insights.push("Журнал пуст или ваши показатели стабильны. Продолжайте заполнять дневник для получения персонального анализа!");
    }
  }

  // Translate basic metric strings
  const labels = {
    he: {
      netR: 'מאזן רווח/הפסד (R)',
      netRSub: `בסך הכל עבור ${totalTradesCount} עסקאות`,
      winRate: 'אחוז הצלחה (Win Rate)',
      discipline: 'ציון משמעת תוכנית',
      disciplineSub: `${noDeviationsCount} מתוך ${totalTradesCount} עסקאות עמדו בתוכנית`,
      deviationsCount: 'סה"כ סטיות שנרשמו',
      breakdown: 'פילוח עסקאות',
      profitable: 'רווחיות (R > 0)',
      losing: 'הפסדיות (R < 0)',
      breakEven: 'ללא רווח/הפסד (0R)',
      daysTracked: 'ימי מעקב מלאים',
      avgTitle: 'ביטחון ודירוג ממוצע',
      confidence: 'ביטחון בביצוע (1-5)',
      rating: 'ציон איכות עסקה (1-10)',
      basedOn: 'מבוסс על ימי מסחר בפועל',
      mentalStateTitle: 'מצב מנטלי בעת ביצוע עסקה',
      tradesLabel: 'עסקאות',
      disciplineTitle: 'סטיות ומשמעת מסחר',
      noEntryTitle: 'סיבות אי-כניסה לעסקה',
      casesLabel: 'מקרים',
      insightsTitle: 'תובנות מנטליות ואסטרטגיות לשיפור',
    },
    en: {
      netR: 'Net P&L Balance (R)',
      netRSub: `Total across ${totalTradesCount} trades`,
      winRate: 'Win Rate Percentage',
      discipline: 'Plan Discipline Score',
      disciplineSub: `${noDeviationsCount} of ${totalTradesCount} trades followed plan`,
      deviationsCount: 'Total Deviations Logged',
      breakdown: 'Trade Breakdown',
      profitable: 'Profitable (R > 0)',
      losing: 'Losing (R < 0)',
      breakEven: 'Break-Even (0R)',
      daysTracked: 'Tracked Days Total',
      avgTitle: 'Avg Confidence & Rating',
      confidence: 'Execution Confidence (1-5)',
      rating: 'Trade Quality Score (1-10)',
      basedOn: 'Based on active trading days',
      mentalStateTitle: 'Mental State at Execution',
      tradesLabel: 'trades',
      disciplineTitle: 'Rule Deviations & Discipline',
      noEntryTitle: 'Reasons for Skipping Setup',
      casesLabel: 'cases',
      insightsTitle: 'Mental Insights & Coaching Plan',
    },
    ar: {
      netR: 'صافي الأرباح والخسائر (R)',
      netRSub: `إجمالي الصفقات المنفذة: ${totalTradesCount}`,
      winRate: 'نسبة النجاح (Win Rate)',
      discipline: 'معدل الانضباط بالخطة',
      disciplineSub: `${noDeviationsCount} من أصل ${totalTradesCount} صفقة اتبعت الخطة`,
      deviationsCount: 'إجمالي الانحرافات المسجلة',
      breakdown: 'تفصيل الصفقات',
      profitable: 'رابحة (R > 0)',
      losing: 'خاسرة (R < 0)',
      breakEven: 'متعادلة (0R)',
      daysTracked: 'الأيام المكتملة للتتبع',
      avgTitle: 'متوسط الثقة والتقييم',
      confidence: 'الثقة في التنفيذ (1-5)',
      rating: 'تقييم جودة الصفقة (1-10)',
      basedOn: 'بناءً على أيام التداول الفعلية',
      mentalStateTitle: 'الحالة النفسية عند التنفيذ',
      tradesLabel: 'صفقات',
      disciplineTitle: 'الانحرافات والانضباط',
      noEntryTitle: 'أسباب عدم دخول صفقات',
      casesLabel: 'حالات',
      insightsTitle: 'رؤى عقلية وخطط تحسين استراتيجية',
    },
    ru: {
      netR: 'Чистый результат P&L (R)',
      netRSub: `Всего по ${totalTradesCount} сделкам`,
      winRate: 'Процент побед (Win Rate)',
      discipline: 'Показатель Дисциплины',
      disciplineSub: `${noDeviationsCount} из ${totalTradesCount} сделок по плану`,
      deviationsCount: 'Всего нарушений записано',
      breakdown: 'Распределение Сделок',
      profitable: 'Прибыльные (R > 0)',
      losing: 'Убыточные (R < 0)',
      breakEven: 'Безубыток (0R)',
      daysTracked: 'Всего дней отслежено',
      avgTitle: 'Ср. Уверенность и Оценка',
      confidence: 'Уверенность на входе (1-5)',
      rating: 'Оценка качества входа (1-10)',
      basedOn: 'На основе дней активной торговли',
      mentalStateTitle: 'Ментальное состояние на входе',
      tradesLabel: 'сделок',
      disciplineTitle: 'Нарушения и Торговая Дисциплина',
      noEntryTitle: 'Причины пропуска сигналов',
      casesLabel: 'раз',
      insightsTitle: 'Психологический анализ и рекомендации',
    }
  }[language];

  return (
    <div className="space-y-6" dir={isRtl ? 'rtl' : 'ltr'}>
      {/* Bento Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Net R Metric Card */}
        <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm relative overflow-hidden flex flex-col justify-between">
          <div className="absolute top-0 right-0 h-24 w-24 bg-gradient-to-br from-indigo-50/50 to-transparent rounded-bl-full pointer-events-none" />
          <div className="flex items-center justify-between">
            <span className="text-slate-500 font-medium">{labels.netR}</span>
            <div className={`p-2 rounded-xl ${totalR >= 0 ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
              <Target className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4">
            <h3 className={`text-4xl font-extrabold tracking-tight ${totalR >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
              {formattedTotalR} <span className="text-lg font-medium text-slate-400">R</span>
            </h3>
            <div className="text-slate-400 text-xs mt-1">
              {labels.netRSub}
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-100 flex justify-between items-center text-xs">
            <span className="text-slate-400">{labels.winRate}</span>
            <span className="font-semibold text-slate-700">{winRate.toFixed(1)}%</span>
          </div>
        </div>

        {/* Discipline Metric Card */}
        <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm relative overflow-hidden flex flex-col justify-between">
          <div className="absolute top-0 right-0 h-24 w-24 bg-gradient-to-br from-amber-50/50 to-transparent rounded-bl-full pointer-events-none" />
          <div className="flex items-center justify-between">
            <span className="text-slate-500 font-medium">{labels.discipline}</span>
            <div className={`p-2 rounded-xl ${disciplineScore >= 80 ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'}`}>
              <Award className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4">
            <h3 className={`text-4xl font-extrabold tracking-tight ${disciplineScore >= 80 ? 'text-emerald-600' : 'text-amber-500'}`}>
              {disciplineScore.toFixed(0)}<span className="text-xl font-bold">%</span>
            </h3>
            <div className="text-slate-400 text-xs mt-1">
              {labels.disciplineSub}
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-100 flex justify-between items-center text-xs">
            <span className="text-slate-400">{labels.deviationsCount}</span>
            <span className="font-semibold text-rose-600">{totalTradesCount - noDeviationsCount}</span>
          </div>
        </div>

        {/* Trade Execution Metrics */}
        <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-slate-500 font-medium">{labels.breakdown}</span>
            <div className="p-2 bg-indigo-50 text-indigo-600 rounded-xl">
              <BarChart className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4 space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-slate-500">{labels.profitable}</span>
              <span className="font-medium text-emerald-600">{profitableTrades.length}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-slate-500">{labels.losing}</span>
              <span className="font-medium text-rose-600">{losingTrades.length}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-slate-500">{labels.breakEven}</span>
              <span className="font-medium text-slate-600">{breakEvenTrades.length}</span>
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-100 flex justify-between items-center text-xs">
            <span className="text-slate-400">{labels.daysTracked}</span>
            <span className="font-semibold text-indigo-600">{activeDays.length}</span>
          </div>
        </div>

        {/* Focus and Rating Metrics */}
        <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-slate-500 font-medium">{labels.avgTitle}</span>
            <div className="p-2 bg-purple-50 text-purple-600 rounded-xl">
              <Brain className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4 space-y-3">
            <div>
              <div className="flex justify-between text-xs text-slate-400 mb-1">
                <span>{labels.confidence}</span>
                <span className="font-semibold text-slate-700">{averageConfidence.toFixed(1)} / 5</span>
              </div>
              <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                <div 
                  className="bg-purple-500 h-full rounded-full transition-all duration-500" 
                  style={{ width: `${(averageConfidence / 5) * 100}%` }}
                />
              </div>
            </div>
            <div>
              <div className="flex justify-between text-xs text-slate-400 mb-1">
                <span>{labels.rating}</span>
                <span className="font-semibold text-slate-700">{averageRating.toFixed(1)} / 10</span>
              </div>
              <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                <div 
                  className="bg-indigo-500 h-full rounded-full transition-all duration-500" 
                  style={{ width: `${(averageRating / 10) * 100}%` }}
                />
              </div>
            </div>
          </div>
          <div className="mt-3 pt-2 text-xs text-slate-400 text-center">
            {labels.basedOn}
          </div>
        </div>

      </div>

      {/* Dynamic Graphic Distribution Plots */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Box 1: Mindsets (Mental State) Dynamic Visual Layout */}
        <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
            <Smile className="w-5 h-5 text-indigo-500" />
            <h4 className="font-bold text-slate-800">{labels.mentalStateTitle}</h4>
          </div>
          <div className="space-y-3.5">
            {Object.keys(mentalStateCounts).map(stateKey => {
              const count = mentalStateCounts[stateKey];
              const percentage = totalTradesCount > 0 ? (count / totalTradesCount) * 100 : 0;
              const label = t.mentalState[stateKey as Exclude<MentalStateOption, null>];
              const emoji = MENTAL_STATE_EMOJIS[stateKey as Exclude<MentalStateOption, null>];
              
              // Color styles
              let barColor = 'bg-slate-300';
              if (stateKey === 'calm') barColor = 'bg-emerald-400';
              if (stateKey === 'stressed') barColor = 'bg-amber-400';
              if (stateKey === 'tired') barColor = 'bg-blue-400';
              if (stateKey === 'indifferent') barColor = 'bg-indigo-400';
              if (stateKey === 'revenge') barColor = 'bg-rose-500';

              return (
                <div key={stateKey} className="group">
                  <div className="flex justify-between items-center text-xs mb-1">
                    <span className="font-medium text-slate-700 flex items-center gap-1.5">
                      <span>{emoji}</span>
                      <span>{label}</span>
                    </span>
                    <span className="text-slate-400 font-medium">
                      {count} {labels.tradesLabel} ({percentage.toFixed(0)}%)
                    </span>
                  </div>
                  <div className="w-full bg-slate-50 h-2.5 rounded-full overflow-hidden border border-slate-100 p-[1px]">
                    <div 
                      className={`${barColor} h-full rounded-full transition-all duration-500`}
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Box 2: Deviations Distribution */}
        <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
            <AlertTriangle className="w-5 h-5 text-amber-500" />
            <h4 className="font-bold text-slate-800">{labels.disciplineTitle}</h4>
          </div>
          <div className="space-y-3.5">
            {Object.keys(deviationCounts).map(devKey => {
              const count = deviationCounts[devKey];
              const percentage = totalTradesCount > 0 ? (count / totalTradesCount) * 100 : 0;
              const label = t.deviation[devKey as Exclude<DeviationOption, null>];
              
              let barColor = 'bg-rose-400';
              if (devKey === 'none') barColor = 'bg-emerald-400';
              if (devKey === 'early_entry') barColor = 'bg-amber-400';
              if (devKey === 'move_stop') barColor = 'bg-red-500';
              if (devKey === 'raise_risk') barColor = 'bg-rose-600';
              if (devKey === 'early_exit') barColor = 'bg-indigo-400';

              return (
                <div key={devKey}>
                  <div className="flex justify-between items-center text-xs mb-1">
                    <span className="font-medium text-slate-700 flex items-center gap-1.5">
                      <span className={`w-2 h-2 rounded-full ${barColor}`} />
                      <span>{label}</span>
                    </span>
                    <span className="text-slate-400 font-medium">
                      {count} ({percentage.toFixed(0)}%)
                    </span>
                  </div>
                  <div className="w-full bg-slate-50 h-2.5 rounded-full overflow-hidden border border-slate-100 p-[1px]">
                    <div 
                      className={`${barColor} h-full rounded-full transition-all duration-500`}
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Box 3: Reasons for No Entry (when trade was 'N') */}
        <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
            <Disc className="w-5 h-5 text-rose-500" />
            <h4 className="font-bold text-slate-800">{labels.noEntryTitle}</h4>
          </div>
          <div className="space-y-3.5">
            {Object.keys(noEntryCounts).map(reasonKey => {
              const count = noEntryCounts[reasonKey];
              const totalNoTrades = noTradeDays.length;
              const percentage = totalNoTrades > 0 ? (count / totalNoTrades) * 100 : 0;
              const label = t.noEntryReason[reasonKey as Exclude<NoEntryReasonOption, null>];
              
              let barColor = 'bg-purple-400';
              if (reasonKey === 'focus') barColor = 'bg-blue-400';
              if (reasonKey === 'rr') barColor = 'bg-cyan-400';
              if (reasonKey === 'discipline') barColor = 'bg-teal-400';
              if (reasonKey === 'fear') barColor = 'bg-orange-400';
              if (reasonKey === 'other') barColor = 'bg-slate-400';

              return (
                <div key={reasonKey}>
                  <div className="flex justify-between items-center text-xs mb-1">
                    <span className="font-medium text-slate-700 flex items-center gap-1.5">
                      <span className={`w-2 h-2 rounded-full ${barColor}`} />
                      <span>{label}</span>
                    </span>
                    <span className="text-slate-400 font-medium">
                      {count} {labels.casesLabel} ({percentage.toFixed(0)}%)
                    </span>
                  </div>
                  <div className="w-full bg-slate-50 h-2.5 rounded-full overflow-hidden border border-slate-100 p-[1px]">
                    <div 
                      className={`${barColor} h-full rounded-full transition-all duration-500`}
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>

      {/* Intelligent AI Trading Insights / Coaching Panel */}
      <div className="bg-gradient-to-r from-indigo-50/70 via-indigo-50/30 to-slate-50 rounded-2xl p-5 border border-indigo-100 shadow-sm">
        <div className="flex items-center gap-2.5 mb-3.5">
          <Brain className="w-5 h-5 text-indigo-600" />
          <h4 className="font-bold text-indigo-950 text-base">{labels.insightsTitle}</h4>
        </div>
        <div className="space-y-3">
          {insights.map((insight, idx) => (
            <div key={idx} className="flex gap-2 text-slate-700 text-sm leading-relaxed items-start">
              <span className="text-indigo-500 mt-1 font-bold">•</span>
              <p dangerouslySetInnerHTML={{ __html: insight }} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
