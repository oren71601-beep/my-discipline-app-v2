import { 
  TradingDay, 
  MentalStateOption, 
  NoEntryReasonOption, 
  DeviationOption,
  MENTAL_STATE_EMOJIS,
} from '../types';
import { useState, useEffect } from 'react';
import { 
  Star, 
  X, 
  Sparkles, 
  Check, 
  Smile, 
  BookOpen, 
  Info,
  Calendar as CalendarIcon
} from 'lucide-react';
import { LanguageCode, TRANSLATIONS } from '../utils/translations';

interface CalendarViewProps {
  days: TradingDay[];
  selectedYear: number;
  selectedMonth: number;
  onUpdateDay: (dayNumber: number, fieldOrUpdates: keyof TradingDay | Partial<TradingDay>, value?: any) => void;
  language?: LanguageCode;
  lastSelectedDay?: number | null;
  onSelectDay?: (dayNumber: number) => void;
}

export function CalendarView({ 
  days, 
  selectedYear, 
  selectedMonth, 
  onUpdateDay, 
  language = 'he',
  lastSelectedDay,
  onSelectDay,
}: CalendarViewProps) {
  // Modal State
  const [editingDay, setEditingDay] = useState<TradingDay | null>(null);

  const t = TRANSLATIONS[language];
  const isRtl = language === 'he' || language === 'ar';

  // Auto-scroll to the last active / edited day in calendar view
  useEffect(() => {
    if (lastSelectedDay) {
      const timer = setTimeout(() => {
        const el = document.getElementById(`calendar-day-${lastSelectedDay}`);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }, 150);
      return () => clearTimeout(timer);
    }
  }, [lastSelectedDay, selectedMonth, selectedYear]);

  // Derive month start weekday index: 0 for Sunday, 6 for Saturday
  const firstDayIndex = new Date(selectedYear, selectedMonth - 1, 1).getDay();

  // Create grid cells
  const gridCells: ({ isPlaceholder: true; id: string } | { isPlaceholder: false; row: TradingDay })[] = [];
  
  // Fill initial blanks for days prior to the 1st of the month
  for (let i = 0; i < firstDayIndex; i++) {
    gridCells.push({ isPlaceholder: true, id: `empty-start-${i}` });
  }
  
  // Fill with actual days
  days.forEach((row) => {
    gridCells.push({ isPlaceholder: false, row });
  });

  const handleDayClick = (dayRow: TradingDay) => {
    onSelectDay?.(dayRow.day);
    // Clone to keep temporary values during editing
    setEditingDay({ ...dayRow });
  };

  const handleSaveModal = () => {
    if (!editingDay) return;
    
    // Save all fields to the parent state as a single batch update
    onUpdateDay(editingDay.day, {
      executed: editingDay.executed,
      mentalState: editingDay.mentalState,
      noEntryReason: editingDay.noEntryReason,
      deviation: editingDay.deviation,
      confidence: editingDay.confidence,
      rating: editingDay.rating,
      resultR: editingDay.resultR,
      notes: editingDay.notes
    });
    
    setEditingDay(null);
  };

  const mentalStateArr = Object.keys(t.mentalState) as MentalStateOption[];
  const noEntryReasonArr = Object.keys(t.noEntryReason) as NoEntryReasonOption[];
  const deviationArr = Object.keys(t.deviation) as DeviationOption[];

  // Sub component translations
  const labels = {
    he: {
      title: 'מבט לוח שנה חודשי מסונכרן',
      desc: 'הימים מיושרים במדויק לימי השבוע ראשון עד שבת. לחץ על כל יום בלוח השנה על מנת לעדכן, למלא או לערוך את יומן העסקאות ישירות מהתצוגה!',
      missedLabel: 'אי כניסה',
      editTitle: 'עדכון יום מסחר',
      editDateSub: 'הזן ועדכן את הנתונים המלאים עבור יום המסחר הנוכחי',
      colDayLabel: 'יום',
      executedQ: 'האם בוצעה עסקה ביום זה?',
      yes: 'כן (בוצעה עסקה)',
      no: 'לא (יום ללא עסקה)',
      unspecified: 'טרם הוזן / לא רלוונטי',
      mentalTitle: 'מצב מנטלי ופסיכולוגי',
      mentalDesc: 'מה היה המצב הרגשי הדומיננטי שלך במהלך יום המסחר?',
      missedTitle: 'סיבת אי-כניסה',
      missedDesc: 'אם לא ביצעת עסקה למרות שהיה יום מסחר, מה מנע ממך להיכנס?',
      deviationTitle: 'חריגה מהתוכנית ומשמעת עצמית',
      deviationDesc: 'האם נצמדת לתוכנית המסחר שלך או שחרגת באחד מהפרמטרים הבאים?',
      confidenceTitle: 'רמת ביטחון בעסקה (1-5 כוכבים)',
      ratingTitle: 'ציון כללי לניהול היום (1-10)',
      resultTitle: 'תוצאה כספית במונחי סיכון (R)',
      notesTitle: 'הערות קצרות וסיכום אישי',
      notesPlaceholder: 'הערות נוספות על המצב המנטלי, החלטות מעניינות או תובנות לעתיד...',
      cancel: 'ביטול',
      save: 'שמור שינויים',
    },
    en: {
      title: 'Synchronized Monthly Calendar View',
      desc: 'Days are aligned with standard weekdays (Sunday - Saturday). Click on any day to add, modify, or edit trading journal metrics instantly!',
      missedLabel: 'No Entry',
      editTitle: 'Update Trading Day',
      editDateSub: 'Set and synchronize performance metrics for this day',
      colDayLabel: 'Day',
      executedQ: 'Was a trade executed on this day?',
      yes: 'Yes (Executed Trade)',
      no: 'No (No Trade Day)',
      unspecified: 'Not Entered Yet',
      mentalTitle: 'Mental & Psychological State',
      mentalDesc: 'What was your dominant emotional state during the trading hours?',
      missedTitle: 'Reason for No Entry',
      missedDesc: 'If you did not trade despite active market hours, what was the primary reason?',
      deviationTitle: 'Rule Deviation & Self-Discipline',
      deviationDesc: 'Did you follow your trading plan flawlessly or deviate on any parameter?',
      confidenceTitle: 'Trade Confidence Level (1-5 stars)',
      ratingTitle: 'Overall Day Performance Rating (1-10)',
      resultTitle: 'Financial Result in Risk Multiples (R)',
      notesTitle: 'Short Notes & Personal Reflections',
      notesPlaceholder: 'Write down details of psychological challenges, screenshots, or lessons learned...',
      cancel: 'Cancel',
      save: 'Save Changes',
    },
    ar: {
      title: 'عرض التقويم الشهري المتزامن',
      desc: 'يتم محاذاة الأيام بدقة مع أيام الأسبوع (الأحد - السبت). انقر فوق أي يوم لتحديث أو ملء أو تعديل دفتر التداول مباشرة!',
      missedLabel: 'لم يدخل',
      editTitle: 'تعديل يوم التداول',
      editDateSub: 'أدخل وقم بمزامنة المقاييس الكاملة ليوم التداول الحالي',
      colDayLabel: 'اليوم',
      executedQ: 'هل تم تنفيذ صفقة في هذا اليوم؟',
      yes: 'نعم (تم تنفيذ صفقة)',
      no: 'لا (يوم بدون تداول)',
      unspecified: 'لم يتم الإدخال بعد',
      mentalTitle: 'الحالة الذهنية والنفسية',
      mentalDesc: 'ما هي الحالة العاطفية السائدة لديك أثناء ساعات التداول؟',
      missedTitle: 'سبب عدم الدخول',
      missedDesc: 'إذا لم تتداول على الرغم من وجود فرصة بالماركت، فما هو السبب الرئيسي؟',
      deviationTitle: 'الانحراف عن الخطة والانضباط الذاتي',
      deviationDesc: 'هل التزمت بخطتك تماماً أم انحرفت في أحد المعايير التالية؟',
      confidenceTitle: 'مستوى الثقة في الصفقة (1-5 نجوم)',
      ratingTitle: 'التقييم العام لإدارة اليوم (1-10)',
      resultTitle: 'النتيجة المالية بوحدات المخاطرة (R)',
      notesTitle: 'ملاحظات قصيرة وملخص شخصي',
      notesPlaceholder: 'ملاحظات إضافية عن الحالة الذهنية، القرارات المتخذة أو دروس للمستقبل...',
      cancel: 'إلغاء',
      save: 'حفظ التغييرات',
    },
    ru: {
      title: 'Синхронизированный Календарь',
      desc: 'Дни выстроены по стандартной неделе (Вс - Сб). Нажмите на любой день, чтобы мгновенно заполнить или отредактировать показатели сделок!',
      missedLabel: 'Пропуск',
      editTitle: 'Обновить показатели дня',
      editDateSub: 'Введите подробные метрики за выбранный торговый день',
      colDayLabel: 'День',
      executedQ: 'Сделка была выполнена в этот день?',
      yes: 'Да (Сделка была)',
      no: 'Нет (Торговли не было)',
      unspecified: 'Не введено',
      mentalTitle: 'Психологическое состояние',
      mentalDesc: 'Какая эмоция доминировала во время торговой сессии?',
      missedTitle: 'Причина отсутствия сделки',
      missedDesc: 'Если вы не торговали, что послужило главной причиной?',
      deviationTitle: 'Нарушение правил и дисциплина',
      deviationDesc: 'Следовали ли вы плану или допустили одно из нарушений?',
      confidenceTitle: 'Уровень уверенности в сделке (1-5 звезд)',
      ratingTitle: 'Общая оценка дня (1-10)',
      resultTitle: 'Финансовый результат в коэффициентах риска (R)',
      notesTitle: 'Краткие заметки и выводы',
      notesPlaceholder: 'Напишите о психологических сложностях, интересных решениях или планах на будущее...',
      cancel: 'Отмена',
      save: 'Сохранить изменения',
    }
  }[language];

  return (
    <div className="space-y-6" dir={isRtl ? 'rtl' : 'ltr'}>
      
      {/* Calendar Header Weekdays Line */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 sm:p-6 overflow-hidden">
        
        {/* Helper Instructions bar */}
        <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 bg-slate-50 p-4 rounded-xl border border-slate-100">
          <div className="flex items-start gap-2">
            <CalendarIcon className="w-5 h-5 text-indigo-600 shrink-0 mt-0.5" />
            <div>
              <h4 className="font-bold text-slate-800 text-sm">{labels.title}</h4>
              <p className="text-slate-500 text-xs mt-0.5">
                {labels.desc}
              </p>
            </div>
          </div>
        </div>

        {/* Weekday Column Titles */}
        <div className="grid grid-cols-7 gap-2 text-center border-b border-slate-100 pb-3 font-semibold text-slate-600 text-xs sm:text-sm">
          {t.weekdaysShort.map((weekday, index) => {
            const isWeekend = index === 5 || index === 6; // Friday/Saturday
            return (
              <div 
                key={weekday} 
                className={`py-1 rounded-md ${
                  isWeekend ? 'text-amber-600 bg-amber-50/30' : 'text-slate-700'
                }`}
              >
                <span>{weekday}</span>
              </div>
            );
          })}
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-7 gap-2 sm:gap-3 mt-4">
          {gridCells.map((cell, index) => {
            if ('id' in cell) {
              return (
                <div 
                  key={cell.id} 
                  className="aspect-square rounded-xl bg-slate-50/50 border border-dashed border-slate-100"
                />
              );
            }

            const { row } = cell;
            const weekdayIndex = index % 7;
            const isWeekend = weekdayIndex === 5 || weekdayIndex === 6; // Friday / Saturday
            const isExecuted = row.executed === 'Y';
            const isMissed = row.executed === 'N';
            const isLastSelected = lastSelectedDay === row.day;

            // Styles for customized status look
            let cellStyle = "bg-white border-slate-200 hover:border-slate-300 hover:shadow-md";
            let statusPill = null;
            let miniRating = null;

            if (isExecuted) {
              const rValue = row.resultR || 0;
              const isProfit = rValue > 0;
              const isLoss = rValue < 0;
              
              cellStyle = isProfit 
                ? "bg-emerald-50/30 border-emerald-200 hover:border-emerald-300 shadow-xs hover:shadow-md" 
                : isLoss
                  ? "bg-rose-50/20 border-rose-200 hover:border-rose-300 shadow-xs hover:shadow-md"
                  : "bg-slate-50/40 border-slate-200 hover:border-slate-300 shadow-xs hover:shadow-md";

              statusPill = (
                <div className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded-md mt-1.5 text-center ${
                  isProfit 
                    ? 'bg-emerald-100 text-emerald-800 border border-emerald-200/50' 
                    : isLoss
                      ? 'bg-rose-100 text-rose-800 border border-rose-200/50'
                      : 'bg-slate-200 text-slate-800 border border-slate-300/50'
                }`}>
                  {rValue >= 0 ? `+${rValue.toFixed(1)}` : `${rValue.toFixed(1)}`}R
                </div>
              );

              const emoji = row.mentalState ? MENTAL_STATE_EMOJIS[row.mentalState] : '';
              miniRating = (
                <div className="flex items-center justify-between text-[10px] text-slate-500 mt-1 pointer-events-none w-full px-1">
                  <span>{emoji}</span>
                  {row.rating && (
                    <span className="font-mono bg-indigo-50 text-indigo-700 px-1 rounded">
                      {row.rating}/10
                    </span>
                  )}
                </div>
              );
            } else if (isMissed) {
              cellStyle = "bg-rose-50/5 border-rose-100 hover:border-rose-200 shadow-xs hover:shadow-md";
              statusPill = (
                <div className="text-[9px] font-semibold px-1 rounded-md mt-1.5 text-rose-700 bg-rose-50 text-center border border-rose-100/40 truncate">
                  {row.noEntryReason ? t.noEntryReason[row.noEntryReason] : labels.missedLabel}
                </div>
              );
            } else {
              // Weekend default vs default blank weekday
              cellStyle = isWeekend 
                ? "bg-slate-50/40 border-slate-100 hover:border-indigo-200/50 opacity-80"
                : "bg-white border-slate-100 hover:border-indigo-300/40";
            }

            if (isLastSelected) {
              cellStyle += " ring-2 ring-indigo-500 shadow-md border-indigo-400 font-bold scale-[1.02]";
            }

            return (
              <button
                key={`calendar-day-${row.day}`}
                id={`calendar-day-${row.day}`}
                type="button"
                onClick={() => handleDayClick(row)}
                className={`aspect-square rounded-xl border p-1.5 sm:p-2.5 transition-all text-right flex flex-col justify-between cursor-pointer focus:outline-none focus:ring-1 focus:ring-indigo-500/30 ${cellStyle}`}
              >
                <div className="flex items-center justify-between w-full">
                  <span className={`text-[11px] font-bold h-5.5 w-5.5 flex items-center justify-center rounded-lg ${
                    isLastSelected
                      ? 'bg-indigo-600 text-white'
                      : isWeekend ? 'bg-amber-100/60 text-amber-800' : 'bg-slate-100 text-slate-700'
                  }`}>
                    {row.day}
                  </span>
                  
                  {row.notes && (
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400" title={row.notes} />
                  )}
                </div>

                {statusPill}
                {miniRating}
              </button>
            );
          })}
        </div>
      </div>

      {/* Synchronized Popup Overlay modal editor */}
      {editingDay && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
          <div 
            className="bg-white rounded-3xl shadow-2xl max-w-lg w-full overflow-hidden border border-slate-100 flex flex-col max-h-[90vh]"
            dir={isRtl ? 'rtl' : 'ltr'}
          >
            
            {/* Modal Header */}
            <div className="p-6 bg-slate-50 border-b border-slate-100 flex justify-between items-start">
              <div>
                <div className="flex items-center gap-2">
                  <span className="bg-indigo-600 text-white font-extrabold text-xs px-2.5 py-1 rounded-full">
                    {labels.colDayLabel} {editingDay.day}
                  </span>
                  <h3 className="text-lg font-bold text-slate-800">{labels.editTitle}</h3>
                </div>
                <p className="text-slate-500 text-xs mt-1">{labels.editDateSub}</p>
              </div>
              <button 
                type="button"
                onClick={() => setEditingDay(null)}
                className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-200/50 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Scrollable Body */}
            <div className="p-6 overflow-y-auto space-y-5 text-sm">
              
              {/* Question 1: Did you trade? */}
              <div className="space-y-2">
                <label className="block font-bold text-slate-700">{labels.executedQ}</label>
                <div className="grid grid-cols-3 gap-2.5">
                  <button
                    type="button"
                    onClick={() => setEditingDay(prev => prev ? { ...prev, executed: 'Y', noEntryReason: null, deviation: prev.deviation || 'none' } : null)}
                    className={`p-3 rounded-2xl border font-semibold text-xs flex flex-col items-center gap-1 transition-all cursor-pointer ${
                      editingDay.executed === 'Y'
                        ? 'border-emerald-500 bg-emerald-50/40 text-emerald-800 shadow-sm'
                        : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <Check className="w-4 h-4 text-emerald-600" />
                    <span>{labels.yes}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setEditingDay(prev => prev ? { ...prev, executed: 'N', noEntryReason: prev.noEntryReason || null, deviation: null, resultR: 0 } : null)}
                    className={`p-3 rounded-2xl border font-semibold text-xs flex flex-col items-center gap-1 transition-all cursor-pointer ${
                      editingDay.executed === 'N'
                        ? 'border-rose-500 bg-rose-50/40 text-rose-800 shadow-sm'
                        : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <X className="w-4 h-4 text-rose-600" />
                    <span>{labels.no}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setEditingDay(prev => prev ? { ...prev, executed: null, noEntryReason: null, deviation: null, resultR: null } : null)}
                    className={`p-3 rounded-2xl border font-semibold text-xs flex flex-col items-center gap-1 transition-all cursor-pointer ${
                      editingDay.executed === null
                        ? 'border-slate-400 bg-slate-50 text-slate-700 shadow-sm'
                        : 'border-slate-200 text-slate-400 hover:bg-slate-50'
                    }`}
                  >
                    <Info className="w-4 h-4 text-slate-400" />
                    <span>{labels.unspecified}</span>
                  </button>
                </div>
              </div>

              {/* Question 2: Mental Mood */}
              <div className="space-y-2">
                <label className="block font-bold text-slate-700">{labels.mentalTitle}</label>
                <p className="text-slate-400 text-xs">{labels.mentalDesc}</p>
                <div className="flex flex-wrap gap-1.5">
                  {mentalStateArr.map(state => {
                    const isSelected = editingDay.mentalState === state;
                    const emoji = MENTAL_STATE_EMOJIS[state];
                    return (
                      <button
                        key={state}
                        type="button"
                        onClick={() => setEditingDay(prev => prev ? { ...prev, mentalState: state } : null)}
                        className={`px-3 py-2 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                          isSelected
                            ? 'border-amber-400 bg-amber-50 text-amber-900 shadow-xs'
                            : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                        }`}
                      >
                        <span>{emoji}</span>
                        <span>{t.mentalState[state]}</span>
                      </button>
                    );
                  })}
                  <button
                    type="button"
                    onClick={() => setEditingDay(prev => prev ? { ...prev, mentalState: null } : null)}
                    className={`px-3 py-2 rounded-xl border text-xs font-medium transition-all cursor-pointer ${
                      editingDay.mentalState === null
                        ? 'border-slate-400 bg-slate-100 text-slate-600'
                        : 'border-slate-200 text-slate-400 hover:bg-slate-50'
                    }`}
                  >
                    ❌ {labels.unspecified}
                  </button>
                </div>
              </div>

              {/* Question 3: Missed Reason (Active if N) */}
              {editingDay.executed === 'N' && (
                <div className="space-y-2 p-4 bg-rose-50/30 rounded-2xl border border-rose-100/50">
                  <label className="block font-bold text-rose-950">{labels.missedTitle}</label>
                  <p className="text-rose-600/80 text-xs">{labels.missedDesc}</p>
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {noEntryReasonArr.map(reason => {
                      const isSelected = editingDay.noEntryReason === reason;
                      return (
                        <button
                          key={reason}
                          type="button"
                          onClick={() => setEditingDay(prev => prev ? { ...prev, noEntryReason: reason } : null)}
                          className={`px-3 py-1.5 rounded-xl border text-xs font-semibold transition-all cursor-pointer ${
                            isSelected
                              ? 'border-rose-400 bg-rose-100/70 text-rose-900'
                              : 'border-slate-200 text-slate-600 hover:bg-white bg-white'
                          }`}
                        >
                          {t.noEntryReason[reason]}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Question 4: Deviation (Active if Y) */}
              {editingDay.executed === 'Y' && (
                <div className="space-y-2 p-4 bg-emerald-50/20 rounded-2xl border border-emerald-100/40">
                  <label className="block font-bold text-emerald-950">{labels.deviationTitle}</label>
                  <p className="text-emerald-700/80 text-xs">{labels.deviationDesc}</p>
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {deviationArr.map(dev => {
                      const isSelected = editingDay.deviation === dev;
                      return (
                        <button
                          key={dev}
                          type="button"
                          onClick={() => setEditingDay(prev => prev ? { ...prev, deviation: dev } : null)}
                          className={`px-3 py-1.5 rounded-xl border text-xs font-semibold transition-all cursor-pointer ${
                            isSelected
                              ? 'border-emerald-400 bg-emerald-100/60 text-emerald-900'
                              : 'border-slate-200 text-slate-600 hover:bg-white bg-white'
                          }`}
                          title={t.deviationDesc[dev]}
                        >
                          {t.deviation[dev]}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Slider details (Active if Y) */}
              {editingDay.executed === 'Y' && (
                <div className="grid grid-cols-2 gap-4">
                  {/* Star system */}
                  <div className="space-y-1.5">
                    <label className="block font-bold text-slate-700 text-xs">{labels.confidenceTitle}</label>
                    <div className="flex gap-1 items-center bg-slate-50 px-3 py-2 rounded-xl border border-slate-100">
                      {[1, 2, 3, 4, 5].map((star) => {
                        const filled = (editingDay.confidence || 0) >= star;
                        return (
                          <button
                            key={star}
                            type="button"
                            onClick={() => setEditingDay(prev => prev ? { ...prev, confidence: star } : null)}
                            className={`p-0.5 transition-all hover:scale-125 cursor-pointer ${filled ? 'text-amber-400' : 'text-slate-200'}`}
                          >
                            <Star className="w-5 h-5 fill-current stroke-current" />
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Rating selection */}
                  <div className="space-y-1.5">
                    <label className="block font-bold text-slate-700 text-xs">{labels.ratingTitle}</label>
                    <div className="flex items-center gap-2 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-100">
                      <input
                        type="range"
                        min="1"
                        max="10"
                        value={editingDay.rating || 5}
                        onChange={(e) => {
                          const val = parseInt(e.target.value, 10);
                          setEditingDay(prev => prev ? { ...prev, rating: val } : null);
                        }}
                        className="w-full accent-indigo-600 h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer"
                      />
                      <span className="text-xs font-black bg-indigo-100 text-indigo-800 px-1.5 py-0.5 rounded">
                        {editingDay.rating || 5}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* R Result (Active if Y) */}
              {editingDay.executed === 'Y' && (
                <div className="space-y-1.5">
                  <label className="block font-bold text-slate-700">{labels.resultTitle}</label>
                  <div className="relative inline-flex items-center w-full">
                    <input
                      type="number"
                      step="0.1"
                      placeholder="0.0"
                      value={editingDay.resultR === null ? '' : editingDay.resultR}
                      onChange={(e) => {
                        const val = e.target.value === '' ? null : parseFloat(e.target.value);
                        setEditingDay(prev => prev ? { ...prev, resultR: val } : null);
                      }}
                      className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl font-bold text-sm text-center focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    />
                    <span className="text-xs font-bold text-slate-400 absolute right-4">R Unit Size</span>
                  </div>
                </div>
              )}

              {/* Personal notes */}
              <div className="space-y-1.5">
                <label className="block font-bold text-slate-700">{labels.notesTitle}</label>
                <textarea
                  rows={2}
                  placeholder={labels.notesPlaceholder}
                  value={editingDay.notes || ''}
                  onChange={(e) => {
                    const val = e.target.value;
                    setEditingDay(prev => prev ? { ...prev, notes: val } : null);
                  }}
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500 placeholder:text-slate-400"
                />
              </div>

            </div>

            {/* Modal Actions */}
            <div className="p-6 bg-slate-50 border-t border-slate-100 flex gap-3 justify-end">
              <button
                type="button"
                onClick={() => setEditingDay(null)}
                className="px-5 py-2.5 rounded-xl border border-slate-200 text-slate-600 bg-white hover:bg-slate-50 font-bold cursor-pointer"
              >
                {labels.cancel}
              </button>
              <button
                type="button"
                onClick={handleSaveModal}
                className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold flex items-center gap-1.5 shadow-md shadow-indigo-600/10 cursor-pointer"
              >
                <Sparkles className="w-4 h-4" />
                <span>{labels.save}</span>
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
