import React, { useState, useEffect } from 'react';
import { TradingDay, HEBREW_WEEKDAYS, HEBREW_MONTH_NAMES } from '../types';
import { X, Check, Trash2, StickyNote, Sparkles } from 'lucide-react';
import { LanguageCode } from '../utils/translations';

interface DayNoteModalProps {
  isOpen: boolean;
  day: TradingDay;
  selectedYear: number;
  selectedMonth: number;
  language?: LanguageCode;
  onClose: () => void;
  onSaveNote: (dayNumber: number, noteText: string) => void;
}

export const DayNoteModal: React.FC<DayNoteModalProps> = ({
  isOpen,
  day,
  selectedYear,
  selectedMonth,
  language = 'he',
  onClose,
  onSaveNote,
}) => {
  const isRtl = language === 'he' || language === 'ar';
  const [noteText, setNoteText] = useState<string>(day.notes || '');

  // Keep note text in sync with day when opened
  useEffect(() => {
    setNoteText(day.notes || '');
  }, [day.day, day.notes]);

  if (!isOpen) return null;

  const dateObj = new Date(selectedYear, selectedMonth - 1, day.day);
  const weekdayName = HEBREW_WEEKDAYS[dateObj.getDay()] || '';
  const monthName = HEBREW_MONTH_NAMES.find(m => m.id === selectedMonth)?.name || `${selectedMonth}`;

  const quickTags = language === 'he' ? [
    '🎯 מימוש מלא ביעד',
    '🧘‍♂️ משמעת גבוהה לפי התוכנית',
    '⚠️ יציאה מוקדמת מחשש להפסד',
    '🛑 עצירה בסטופ לוס מתוכנן',
    '⚡ פריצה טכנית נקייה',
    '☕ ללא כניסה - שמירה על ההון',
    '😡 כניסה מתוך נקמה / אימפולסיביות',
    '📊 תבנית טכנית מושלמת',
  ] : [
    '🎯 Full target hit',
    '🧘‍♂️ High discipline maintained',
    '⚠️ Early exit out of fear',
    '🛑 Planned stop loss executed',
    '⚡ Clean technical breakout',
    '☕ No trade - Capital protected',
    '😡 Impulsive / revenge trade',
    '📊 Perfect technical setup',
  ];

  const handleAddTag = (tag: string) => {
    setNoteText(prev => {
      if (!prev || !prev.trim()) return tag;
      return `${prev.trim()} | ${tag}`;
    });
  };

  const handleSave = () => {
    onSaveNote(day.day, noteText.trim());
    onClose();
  };

  const handleDelete = () => {
    onSaveNote(day.day, '');
    onClose();
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-sm overflow-y-auto animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div 
        dir={isRtl ? 'rtl' : 'ltr'}
        className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-400/40 flex items-center justify-center text-amber-300 font-bold text-lg shadow-xs">
              {day.day}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <StickyNote className="w-4 h-4 text-amber-400" />
                <h3 className="text-base sm:text-lg font-bold">
                  {language === 'he' 
                    ? `הערות ליום ${weekdayName}, ${day.day} ב${monthName} ${selectedYear}`
                    : `Notes for Day ${day.day}, ${monthName} ${selectedYear}`}
                </h3>
              </div>
              <p className="text-xs text-slate-300 mt-0.5">
                {language === 'he' 
                  ? 'תיעוד מחשבות, תובנות פסיכולוגיות וסיכום ביצוע'
                  : 'Document reflections, psychological takeaways & trade review'}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            title={language === 'he' ? 'סגור' : 'Close'}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-5 space-y-4 overflow-y-auto">
          {/* Day trades summary if present */}
          {day.trades && day.trades.length > 0 && (
            <div className="bg-indigo-50/70 border border-indigo-100 rounded-xl p-3 text-xs">
              <span className="font-bold text-indigo-950">
                {language === 'he' ? `עסקאות שבוצעו ביום זה (${day.trades.length}):` : `Trades on this day (${day.trades.length}):`}
              </span>
              <div className="flex flex-wrap gap-1.5 mt-2">
                {day.trades.map((tr) => (
                  <span key={tr.id} className="bg-white border border-indigo-200 text-slate-800 px-2 py-0.5 rounded-md text-[11px] font-mono shadow-2xs">
                    #{tr.tradeNumber} {tr.symbol ? `(${tr.symbol})` : ''} · {tr.resultR !== null ? `${(tr.resultR || 0) > 0 ? `+${tr.resultR}` : tr.resultR}R` : '0 R'}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Quick tags */}
          <div>
            <div className="flex items-center gap-1.5 mb-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <label className="text-xs font-bold text-slate-700">
                {language === 'he' ? 'תגיות מהירות להוספה בלחיצה:' : 'Quick tags to insert:'}
              </label>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {quickTags.map((tag, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleAddTag(tag)}
                  className="text-[11px] bg-slate-50 hover:bg-indigo-50 hover:text-indigo-700 hover:border-indigo-300 text-slate-700 px-2.5 py-1 rounded-lg border border-slate-200 transition-colors cursor-pointer"
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>

          {/* Textarea */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-700">
              {language === 'he' ? 'פירוט ההערה:' : 'Note Content:'}
            </label>
            <textarea
              autoFocus
              rows={4}
              value={noteText}
              onChange={(e) => setNoteText(e.target.value)}
              placeholder={language === 'he' 
                ? 'רשום הערות עסקה, קישור לצילום מסך, סיבות לכניסה או יציאה, תחושות מנטליות, דגשים לשיפור...'
                : 'Write trade notes, screenshot link, setup details, mental review...'}
              className="w-full p-3.5 bg-white border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 leading-relaxed placeholder:text-slate-400"
            />
            <div className="flex justify-between items-center text-[10px] text-slate-400 px-1">
              <span>{noteText.length} {language === 'he' ? 'תווים' : 'chars'}</span>
              <span>{language === 'he' ? 'נשמר ומסונכרן ליומן' : 'Saved to trading journal'}</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between gap-2 px-5 py-3.5 bg-slate-50 border-t border-slate-200">
          <div>
            {day.notes && (
              <button
                type="button"
                onClick={handleDelete}
                className="inline-flex items-center gap-1 px-3 py-1.5 text-xs text-rose-600 hover:text-rose-700 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer font-medium"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>{language === 'he' ? 'מחק הערה' : 'Delete'}</span>
              </button>
            )}
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-slate-300 text-xs font-semibold text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
            >
              {language === 'he' ? 'ביטול' : 'Cancel'}
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="inline-flex items-center gap-1.5 px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs sm:text-sm font-bold shadow-md shadow-indigo-200 transition-all cursor-pointer"
            >
              <Check className="w-4 h-4" />
              <span>{language === 'he' ? 'שמור הערה' : 'Save Note'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
