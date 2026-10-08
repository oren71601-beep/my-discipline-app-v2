import { 
  TradingDay, 
  ExecutedOption, 
  MentalStateOption, 
  NoEntryReasonOption, 
  DeviationOption,
} from '../types';
import { SlashOptionSelector } from './SlashOptionSelector';
import { Star, CheckCircle2, Briefcase, Plus } from 'lucide-react';
import React, { useState, useEffect } from 'react';
import { LanguageCode, TRANSLATIONS } from '../utils/translations';
import { DailyTradesModal } from './DailyTradesModal';
import { DayNoteModal } from './DayNoteModal';

interface InteractiveTableProps {
  days: TradingDay[];
  onUpdateDay: (dayNumber: number, fieldOrUpdates: keyof TradingDay | Partial<TradingDay>, value?: any) => void;
  selectedYear: number;
  selectedMonth: number;
  language?: LanguageCode;
  lastSelectedDay?: number | null;
  onSelectDay?: (dayNumber: number) => void;
}

export function InteractiveTable({ 
  days, 
  onUpdateDay, 
  selectedYear, 
  selectedMonth, 
  language = 'he',
  lastSelectedDay,
  onSelectDay,
}: InteractiveTableProps) {
  // Collapsed states to permit a highly responsive workspace
  const [collapsedDayNotes, setCollapsedDayNotes] = useState<Record<number, boolean>>({});
  const [dayForTradesModal, setDayForTradesModal] = useState<TradingDay | null>(null);
  const [dayForNoteModal, setDayForNoteModal] = useState<TradingDay | null>(null);

  const t = TRANSLATIONS[language];
  const isRtl = language === 'he' || language === 'ar';

  // Auto-scroll to the last active / edited day when table mounts or lastSelectedDay changes
  useEffect(() => {
    if (lastSelectedDay) {
      const timer = setTimeout(() => {
        const el = document.getElementById(`day-row-${lastSelectedDay}`);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }, 150);
      return () => clearTimeout(timer);
    }
  }, [lastSelectedDay, selectedMonth, selectedYear]);

  const toggleNotes = (day: number) => {
    setCollapsedDayNotes(prev => ({
      ...prev,
      [day]: !prev[day]
    }));
  };

  // Convert types to simple option arrays for the SlashOptionSelector
  const executedOptions = [
    { value: 'Y' as const, label: t.executedY },
    { value: 'N' as const, label: t.executedN }
  ];

  const mentalStateOptions = (Object.keys(t.mentalState) as MentalStateOption[]).map(key => ({
    value: key!,
    label: t.mentalState[key!]
  }));

  const noEntryReasonOptions = (Object.keys(t.noEntryReason) as NoEntryReasonOption[]).map(key => ({
    value: key!,
    label: t.noEntryReason[key!]
  }));

  const deviationOptions = (Object.keys(t.deviation) as DeviationOption[]).map(key => ({
    value: key!,
    label: t.deviation[key!]
  }));

  // Extra headers or description texts based on active language
  const subLabels = {
    he: {
      title: 'לוח רישום יומי אינטראקטיבי',
      desc: 'לחץ על האפשרויות בתוך הרשימה על מנת לסמן אותן בעיגול. המערכת תנעל אוטומטית עמודות בהתאם לביצוע העסקה לעקביות מירבית.',
      badgeY: 'עסקה בוצעה (כן) - סטייה, ביטחון, דירוג, תוצאה',
      badgeN: 'ללא עסקה (לא) - סיבת אי-כניסה מודגשת',
      colExecutedEx: 'בוצעה עסקה?',
      colMentalEx: 'מצב מנטלי',
      colNoEntryEx: 'סיבת אי-כניסה (רק אם "לא")',
      colDeviationEx: 'סטייה מהתוכנית (רק אם "כן")',
      weekdayLabel: 'יום',
      addNoteTitle: 'ערוך הערה (קיימת)',
      addNoteNone: 'הוסף הערה ליום זה',
      noteLabel: 'הערות וסיכום ביצוע ליום מסחר',
      notePlaceholder: 'רשום הערות עסקה...',
      noteCloseBtn: 'סגור אזור הערה',
      colTrend: 'מגמת R חודשית',
    },
    en: {
      title: 'Interactive Daily Trading Log',
      desc: 'Click on choices to select. The system automatically enables/disables columns depending on execution state to maintain perfect data integrity.',
      badgeY: 'Executed (Yes) - Active',
      badgeN: 'No Trade (No) - Reason',
      colExecutedEx: 'Executed?',
      colMentalEx: 'Mental Mood',
      colNoEntryEx: 'Skip Reason',
      colDeviationEx: 'Plan Deviation',
      weekdayLabel: '',
      addNoteTitle: 'Edit Notes (Existing)',
      addNoteNone: 'Add Notes for this day',
      noteLabel: 'Execution Notes for Trading Day',
      notePlaceholder: 'Write down trading notes, screenshot link, setup details...',
      noteCloseBtn: 'Close notes area',
      colTrend: 'R Trend',
    },
    ar: {
      title: 'جدول تسجيل التداول اليومي التفاعلي',
      desc: 'اضغط على الخيارات لتحديدها. يقوم النظام تلقائياً بقفل الأعمدة أو تفعيلها بناءً على تنفيذ الصفقة لضمان دقة البيانات.',
      badgeY: 'صفقة (نعم) - نشط',
      badgeN: 'لا صفقة (لا) - تخطي',
      colExecutedEx: 'نُفذت؟',
      colMentalEx: 'المزاج الذهني',
      colNoEntryEx: 'سبب عدم الدخول',
      colDeviationEx: 'الانحراف عن الخطة',
      weekdayLabel: 'يوم',
      addNoteTitle: 'تعديل الملاحظة (موجودة)',
      addNoteNone: 'إضافة ملاحظة لهذا اليوم',
      noteLabel: 'الملاحظات وملخص الأداء ليوم التداول',
      notePlaceholder: 'اكتب ملاحظات الصفقة أو أسباب اختيار الزوج والتوقيت...',
      noteCloseBtn: 'إغلاق منطقة الملاحظات',
      colTrend: 'مسار R',
    },
    ru: {
      title: 'Интерактивная Таблица Сделок',
      desc: 'Нажимайте на варианты для выбора. Система автоматически блокирует или активирует столбцы в зависимости от факта сделки.',
      badgeY: 'Сделка (Да) - Активно',
      badgeN: 'Без сделки (Нет)',
      colExecutedEx: 'Сделка?',
      colMentalEx: 'Ментальное состояние',
      colNoEntryEx: 'Причина пропуска',
      colDeviationEx: 'Нарушение плана',
      weekdayLabel: '',
      addNoteTitle: 'Редактировать заметку',
      addNoteNone: 'Добавить заметку',
      noteLabel: 'Заметки и итоги торгового дня',
      notePlaceholder: 'Опишите детали сделки, скриншот, разметку...',
      noteCloseBtn: 'Закрыть',
      colTrend: 'Тренд R',
    }
  }[language];

  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden" dir={isRtl ? 'rtl' : 'ltr'}>
      {/* Table Title and Instructions */}
      <div className="p-5 border-b border-slate-100 bg-slate-50 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h3 className="font-bold text-slate-800 text-lg">{subLabels.title}</h3>
          <p className="text-slate-500 text-xs mt-1">
            {subLabels.desc}
          </p>
        </div>
        <div className="flex flex-wrap gap-2 text-xs">
          <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-700 px-2.5 py-1 rounded-md font-medium">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            {subLabels.badgeY}
          </span>
          <span className="inline-flex items-center gap-1 bg-rose-50 text-rose-700 px-2.5 py-1 rounded-md font-medium">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
            {subLabels.badgeN}
          </span>
        </div>
      </div>

      {/* Main Responsive Container */}
      <div className="overflow-x-auto max-w-full">
        <table className="w-full text-center border-collapse min-w-[700px]">
          <thead>
            <tr className="bg-slate-50 text-slate-600 text-[11px] sm:text-xs font-semibold uppercase tracking-wider border-b border-slate-100">
              <th className="py-2.5 px-2 w-14 shrink-0">{t.colDay}</th>
              <th className="py-2.5 px-2 w-24 shrink-0">{subLabels.colExecutedEx}</th>
              <th className="py-2.5 px-2 border-r border-slate-100 w-44">{subLabels.colMentalEx}</th>
              <th className="py-2.5 px-2 border-r border-slate-100 w-44 text-rose-800">{subLabels.colNoEntryEx}</th>
              <th className="py-2.5 px-2 border-r border-slate-100 w-48 text-teal-800">{subLabels.colDeviationEx}</th>
              <th className="py-2.5 px-2 border-r border-slate-100 w-28 shrink-0">{t.colConfidence}</th>
              <th className="py-2.5 px-2 border-r border-slate-100 w-32 shrink-0">{t.colRating}</th>
              <th className="py-2.5 px-2 border-r border-slate-100 w-36 shrink-0">{t.colResultR}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {days.map((row) => {
              const isTradeExecuted = row.executed === 'Y';
              const isTradeMissed = row.executed === 'N';
              const isClean = row.executed === null;
              const isLastSelected = lastSelectedDay === row.day;

              // Derive weekday index and names
              const dateObj = new Date(selectedYear, selectedMonth - 1, row.day);
              const weekdayIndex = dateObj.getDay();
              const weekdayShort = t.weekdaysShort[weekdayIndex];
              const isWeekend = weekdayIndex === 5 || weekdayIndex === 6; // Friday / Saturday

              // Row highlight styles based on active row choices
              let rowBg = 'bg-white hover:bg-slate-50/50';
              if (isTradeExecuted) rowBg = 'bg-emerald-50/10 hover:bg-emerald-50/20';
              if (isTradeMissed) rowBg = 'bg-rose-50/10 hover:bg-rose-50/20';
              if (isClean && isWeekend) rowBg = 'bg-slate-50/30 hover:bg-slate-100/50';
              if (isLastSelected) rowBg += ' ring-2 ring-indigo-500/80 ring-inset bg-indigo-50/20';

              return (
                <React.Fragment key={row.day}>
                  <tr 
                    id={`day-row-${row.day}`}
                    onClick={() => onSelectDay?.(row.day)}
                    className={`transition-all duration-150 ${rowBg}`}
                  >
                  
                  {/* Column 1: Day */}
                  <td className="py-3 px-3 font-bold text-slate-800 text-sm">
                    <div className="flex flex-col items-center justify-center select-none">
                      <span className={`flex items-center justify-center h-6.5 w-6.5 rounded-lg text-[11px] font-black shadow-2xs relative ${
                        isLastSelected
                          ? 'bg-indigo-600 text-white ring-2 ring-indigo-400'
                          : isWeekend 
                            ? 'bg-amber-100/75 text-amber-800 border border-amber-200/30' 
                            : 'bg-indigo-50 text-indigo-800 border border-indigo-100/50'
                      }`}>
                        {row.day}
                      </span>
                      <span className={`text-[9px] font-bold mt-1.5 whitespace-nowrap ${
                        isWeekend ? 'text-amber-600' : 'text-slate-400'
                      }`}>
                        {subLabels.weekdayLabel ? `${subLabels.weekdayLabel} ${weekdayShort}` : weekdayShort}
                      </span>
                      {row.notes ? (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setDayForNoteModal(row);
                          }}
                          className="mt-1 inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md text-[10px] font-bold bg-amber-100 text-amber-900 border border-amber-300 hover:bg-amber-200 hover:scale-105 transition-all cursor-pointer shadow-2xs"
                          title={language === 'he' ? `לחץ לפתיחת ההערה: ${row.notes}` : `Click to view/edit note: ${row.notes}`}
                        >
                          <span>📝</span>
                          <span className="truncate max-w-[42px]">{row.notes}</span>
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setDayForNoteModal(row);
                          }}
                          className="mt-1 inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[9px] font-semibold text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 border border-transparent hover:border-indigo-200 transition-all cursor-pointer"
                          title={language === 'he' ? 'הוסף הערה ליום זה' : 'Add note for this day'}
                        >
                          <Plus className="w-2.5 h-2.5" />
                          <span>{language === 'he' ? 'הערה' : 'Note'}</span>
                        </button>
                      )}
                    </div>
                  </td>

                  {/* Column 2: Trade Executed? */}
                  <td className="py-3 px-2">
                    <div className="flex flex-col items-center gap-1.5">
                      <SlashOptionSelector
                        options={executedOptions}
                        selectedValue={row.executed}
                        onChange={(val) => {
                          if (val === 'Y') {
                            onUpdateDay(row.day, {
                              executed: 'Y',
                              noEntryReason: null,
                              deviation: row.deviation || 'none'
                            });
                          } else if (val === 'N') {
                            onUpdateDay(row.day, {
                              executed: 'N',
                              noEntryReason: row.noEntryReason || null,
                              deviation: null,
                              resultR: 0
                            });
                          } else {
                            onUpdateDay(row.day, {
                              executed: null,
                              noEntryReason: null,
                              deviation: null,
                              resultR: null
                            });
                          }
                        }}
                        highlightColor="indigo"
                        markStyle="circle"
                      />

                      {/* 1-10 Trades detail trigger */}
                      {isTradeExecuted && (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setDayForTradesModal(row);
                          }}
                          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold border transition-all cursor-pointer ${
                            row.trades && row.trades.length > 0
                              ? 'bg-indigo-50 border-indigo-200 text-indigo-700 hover:bg-indigo-100 hover:border-indigo-300 shadow-2xs'
                              : 'bg-white border-slate-200 text-slate-500 hover:text-indigo-600 hover:border-indigo-200 hover:bg-indigo-50/50'
                          }`}
                          title={language === 'he' ? 'פירוט 1 עד 10 עסקאות ליום זה' : 'Breakdown of 1-10 trades'}
                        >
                          <Briefcase className="w-3 h-3 text-indigo-500 shrink-0" />
                          <span>
                            {row.trades && row.trades.length > 0 
                              ? `${row.trades.length} ${language === 'he' ? 'עסקאות' : 'trades'}` 
                              : (language === 'he' ? 'פירוט עסקאות' : 'Trades')}
                          </span>
                        </button>
                      )}
                    </div>
                  </td>

                  {/* Column 3: Mental State */}
                  <td className="py-3 px-2 border-r border-slate-100">
                    <SlashOptionSelector
                      options={mentalStateOptions}
                      selectedValue={row.mentalState}
                      onChange={(val) => onUpdateDay(row.day, 'mentalState', val)}
                      highlightColor={row.mentalState === 'revenge' ? 'red' : 'amber'}
                      markStyle="circle"
                    />
                  </td>

                  {/* Column 4: Reason for No Entry */}
                  <td className="py-3 px-2 border-r border-slate-100">
                    <SlashOptionSelector
                      options={noEntryReasonOptions}
                      selectedValue={row.noEntryReason}
                      onChange={(val) => onUpdateDay(row.day, 'noEntryReason', val)}
                      disabled={!isTradeMissed}
                      highlightColor="rose"
                      markStyle="circle"
                    />
                  </td>

                  {/* Column 5: Deviation from Plan */}
                  <td className="py-3 px-2 border-r border-slate-100">
                    <SlashOptionSelector
                      options={deviationOptions}
                      selectedValue={row.deviation}
                      onChange={(val) => onUpdateDay(row.day, 'deviation', val)}
                      disabled={!isTradeExecuted}
                      highlightColor={row.deviation === 'none' ? 'green' : 'amber'}
                      markStyle="circle"
                    />
                  </td>

                  {/* Column 6: Confidence Star System */}
                  <td className="py-3 px-2 border-r border-slate-100">
                    <div className="flex items-center justify-center gap-0.5">
                      {[1, 2, 3, 4, 5].map((star) => {
                        const filled = (row.confidence || 0) >= star;
                        return (
                          <button
                            key={star}
                            type="button"
                            disabled={!isTradeExecuted}
                            onClick={() => onUpdateDay(row.day, 'confidence', star)}
                            className={`p-0.5 transition-all duration-200 cursor-pointer ${
                              !isTradeExecuted ? 'opacity-30 cursor-not-allowed' : 'hover:scale-125'
                            } ${filled ? 'text-amber-400' : 'text-slate-200'}`}
                          >
                            <Star className="w-4 h-4 fill-current stroke-current" />
                          </button>
                        );
                      })}
                    </div>
                  </td>

                  {/* Column 7: Rating (1-10) Slider/Score */}
                  <td className="py-3 px-2 border-r border-slate-100">
                    {isTradeExecuted ? (
                      <div className="flex items-center gap-2 justify-center px-1">
                        <input
                          type="range"
                          min="1"
                          max="10"
                          value={row.rating || 5}
                          onChange={(e) => onUpdateDay(row.day, 'rating', parseInt(e.target.value, 10))}
                          className="w-20 accent-indigo-600 h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer"
                        />
                        <span className="text-xs font-semibold bg-indigo-50 text-indigo-700 px-1.5 py-0.5 rounded min-w-[22px] text-center">
                          {row.rating || 5}
                        </span>
                      </div>
                    ) : (
                      <span className="text-slate-300 text-xs">-</span>
                    )}
                  </td>

                  {/* Column 8: Result (R) - with weighted average calculation for days with > 1 trade */}
                  <td className="py-3 px-3 border-r border-slate-100">
                    {isTradeExecuted ? (() => {
                      const validTrades = (row.trades || []).filter(
                        (t) => t.resultR !== null && t.resultR !== undefined && !isNaN(t.resultR)
                      );
                      const hasMultipleTrades = validTrades.length > 1;

                      // Weighting / average calculation of R only on days with more than 1 trade
                      let effectiveR = row.resultR;
                      let totalSumR = 0;
                      if (hasMultipleTrades) {
                        const sum = validTrades.reduce((acc, t) => acc + (t.resultR || 0), 0);
                        totalSumR = Math.round(sum * 100) / 100;
                        effectiveR = Math.round((sum / validTrades.length) * 100) / 100;
                      } else if (validTrades.length === 1) {
                        effectiveR = validTrades[0].resultR;
                      }

                      return (
                        <div className="flex flex-col items-center gap-1">
                          <div className="relative inline-flex items-center rounded-md max-w-[110px]">
                            <input
                              type="number"
                              step="0.01"
                              placeholder="0.0"
                              value={effectiveR === null ? '' : effectiveR}
                              onChange={(e) => {
                                const val = e.target.value === '' ? null : parseFloat(e.target.value);
                                onUpdateDay(row.day, 'resultR', val);
                              }}
                              className={`w-full px-2 py-1 text-sm bg-white border rounded text-center font-bold focus:outline-none focus:ring-1 focus:ring-indigo-500 max-w-[90px] ${
                                (effectiveR || 0) > 0 
                                  ? 'border-emerald-300 text-emerald-700 bg-emerald-50/20' 
                                  : (effectiveR || 0) < 0 
                                    ? 'border-rose-300 text-rose-700 bg-rose-50/20' 
                                    : 'border-slate-300 text-slate-700'
                              }`}
                            />
                            <span className="text-xs font-semibold text-slate-400 absolute right-1.5 pointer-events-none">R</span>
                          </div>

                          {/* Multiple trades indicator: displays average and opens breakdown */}
                          {hasMultipleTrades ? (
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                setDayForTradesModal(row);
                              }}
                              className="text-[10px] font-bold text-indigo-700 bg-indigo-50/90 hover:bg-indigo-100 border border-indigo-200 px-2 py-0.5 rounded-md cursor-pointer transition-colors flex items-center gap-1 shadow-2xs"
                              title={
                                language === 'he'
                                  ? `שקלול ממוצע של ${validTrades.length} עסקאות ביום זה (סה״כ מצטבר: ${totalSumR > 0 ? `+${totalSumR}` : totalSumR}R)`
                                  : `Weighted average of ${validTrades.length} trades today (Total: ${totalSumR > 0 ? `+${totalSumR}` : totalSumR}R)`
                              }
                            >
                              <span className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
                              <span>
                                {language === 'he'
                                  ? `ממוצע (${validTrades.length})`
                                  : `Avg (${validTrades.length})`}
                              </span>
                            </button>
                          ) : row.trades && row.trades.length === 1 ? (
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                setDayForTradesModal(row);
                              }}
                              className="text-[10px] font-semibold text-slate-500 hover:text-indigo-600 hover:underline cursor-pointer"
                              title={language === 'he' ? 'פירוט עסקה יחידה' : 'Single trade breakdown'}
                            >
                              <span>{language === 'he' ? 'עסקה 1' : '1 Trade'}</span>
                            </button>
                          ) : null}
                        </div>
                      );
                    })() : isTradeMissed ? (
                      <span className="text-slate-400 text-xs font-mono">0 R</span>
                    ) : (
                      <span className="text-slate-300 text-xs">-</span>
                    )}
                  </td>
                </tr>

                {/* Inline expandable notes row directly under this day */}
                {collapsedDayNotes[row.day] && (
                  <tr className="bg-amber-50/70 border-b border-amber-200/60 animate-in fade-in duration-150">
                    <td colSpan={8} className="p-3 text-right">
                      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
                        <div className="flex items-center gap-1.5 text-xs text-amber-800 font-bold shrink-0">
                          <CheckCircle2 className="w-4 h-4 text-amber-600 shrink-0" />
                          <span>{subLabels.noteLabel} #{row.day}:</span>
                        </div>
                        <input
                          type="text"
                          placeholder={subLabels.notePlaceholder}
                          value={row.notes || ''}
                          onChange={(e) => onUpdateDay(row.day, 'notes', e.target.value)}
                          className="flex-1 w-full px-3 py-1.5 text-sm bg-white border border-amber-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 placeholder:text-slate-400 text-slate-700"
                        />
                        <div className="flex items-center gap-2 self-end sm:self-center">
                          <button
                            type="button"
                            onClick={() => setDayForNoteModal(row)}
                            className="text-xs bg-indigo-50 hover:bg-indigo-100 text-indigo-700 px-2.5 py-1 rounded-md cursor-pointer font-medium"
                          >
                            {language === 'he' ? 'עריכה מלאה 📝' : 'Full edit 📝'}
                          </button>
                          <button
                            type="button"
                            onClick={() => toggleNotes(row.day)}
                            className="text-xs bg-slate-100 hover:bg-slate-200 text-slate-600 px-2.5 py-1 rounded-md cursor-pointer"
                          >
                            {subLabels.noteCloseBtn}
                          </button>
                        </div>
                      </div>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            );
          })}
        </tbody>
      </table>
    </div>

      {/* 1-10 Daily Trades Modal */}
      {dayForTradesModal && (
        <DailyTradesModal
          isOpen={Boolean(dayForTradesModal)}
          day={dayForTradesModal}
          selectedYear={selectedYear}
          selectedMonth={selectedMonth}
          language={language}
          onClose={() => setDayForTradesModal(null)}
          onSaveDayTrades={(dayNum, updatedDay) => {
            onUpdateDay(dayNum, updatedDay);
            setDayForTradesModal(null);
          }}
        />
      )}

      {/* Dedicated Day Note Modal */}
      {dayForNoteModal && (
        <DayNoteModal
          isOpen={Boolean(dayForNoteModal)}
          day={dayForNoteModal}
          selectedYear={selectedYear}
          selectedMonth={selectedMonth}
          language={language}
          onClose={() => setDayForNoteModal(null)}
          onSaveNote={(dayNum, noteText) => {
            onUpdateDay(dayNum, 'notes', noteText);
            setDayForNoteModal(null);
          }}
        />
      )}
    </div>
  );
}
