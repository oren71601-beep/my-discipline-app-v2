import React, { useState, useEffect } from 'react';
import { Target, X, Check, Trash2, Sparkles, ShieldCheck, TrendingUp, Flame, AlertCircle } from 'lucide-react';
import { LanguageCode } from '../utils/translations';

interface MonthlyGoalsModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentGoals: string;
  onSaveGoals: (goals: string) => void;
  monthName: string;
  selectedYear: number;
  language: LanguageCode;
}

export const MonthlyGoalsModal: React.FC<MonthlyGoalsModalProps> = ({
  isOpen,
  onClose,
  currentGoals,
  onSaveGoals,
  monthName,
  selectedYear,
  language,
}) => {
  const [goalsText, setGoalsText] = useState<string>('');

  useEffect(() => {
    if (isOpen) {
      setGoalsText(currentGoals || '');
    }
  }, [isOpen, currentGoals]);

  if (!isOpen) return null;

  const isRtl = language === 'he' || language === 'ar';

  const handleSave = () => {
    onSaveGoals(goalsText.trim());
    onClose();
  };

  const handleClear = () => {
    setGoalsText('');
  };

  // Quick suggestion chips to inspire traders
  const suggestions = language === 'he' ? [
    { label: '🎯 יעד חודשי: 10R', text: 'יעד חודשי: 10R ברווח נקי' },
    { label: '🛡️ 100% משמעת (0 חריגות)', text: 'משמעת מלאה: אפס חריגות מתוכנית המסחר' },
    { label: '🛑 סטופ יומי מקסימלי: 2R', text: 'מגבלת הפסד יומית: סגירת מסכים לאחר הפסד מצטבר של 2R' },
    { label: '🧘‍♂️ הפסקת 45 דק\' לאחר הפסד', text: 'פרוטוקול צינון: 45 דקות התרחקות מוחלטת מהמסך לאחר כל הפסד' },
    { label: '📉 מקסימום 2 עסקאות ביום', text: 'מגבלת ביצוע: מקסימום 2 עסקאות בלבד ביום' },
    { label: '🕯️ כניסה בסגירת נר בלבד', text: 'חוק ברזל: שום כניסה לא תבוצע לפני סגירה מלאה של נר האישור' },
  ] : language === 'ar' ? [
    { label: '🎯 هدف شهري: +10R', text: 'الهدف الشهري: تحقيق 10R ربح صافي' },
    { label: '🛡️ انضباط 100% بدون انحراف', text: 'انضباط كامل: صفر انحرافات عن خطة التداول' },
    { label: '🛑 أقصى خسارة يومية: 2R', text: 'الحد الأقصى للخسارة اليومية: إغلاق الشاشات بعد خسارة 2R' },
    { label: '🧘‍♂️ استراحة 45 دقيقة بعد الخسارة', text: 'بروتوكول تهدئة: ابتعاد إلزامي عن الشاشة 45 دقيقة بعد أي خسارة' },
  ] : language === 'ru' ? [
    { label: '🎯 Цель на месяц: +10R', text: 'Цель на месяц: зафиксировать +10R чистой прибыли' },
    { label: '🛡️ 100% дисциплина (0 нарушений)', text: 'Строгая дисциплина: 0 отклонений от торгового плана' },
    { label: '🛑 Дневной лимит потерь: 2R', text: 'Максимальный дневной убыток: закрыть терминал при -2R' },
    { label: '🧘‍♂️ 45 мин перерыв после стопа', text: 'Охлаждение: 45 минут перерыва от графиков после любого стопа' },
  ] : [
    { label: '🎯 Monthly Target: +10R', text: 'Monthly Target: Net +10R profit with controlled sizing' },
    { label: '🛡️ 100% Discipline (0 Deviations)', text: 'Zero deviations: execute strictly according to written playbook' },
    { label: '🛑 Max Daily Loss: 2R', text: 'Daily stop-out: cease trading immediately after losing 2R' },
    { label: '🧘‍♂️ 45-min Break Post-Loss', text: 'Cooling protocol: walk away from screens for 45 minutes after any loss' },
    { label: '📉 Max 2 Trades Per Day', text: 'Patience filter: maximum 2 high-quality A+ setups per day' },
    { label: '🕯️ Wait for Candle Close', text: 'Iron execution: never enter before the confirmation candle closes' },
  ];

  const appendSuggestion = (text: string) => {
    if (!goalsText.trim()) {
      setGoalsText(text);
    } else if (!goalsText.includes(text)) {
      setGoalsText(prev => `${prev}\n• ${text}`);
    }
  };

  return (
    <div className="fixed inset-0 z-55 flex items-center justify-center p-2.5 sm:p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto animate-fade-in">
      <div 
        className="bg-white rounded-3xl border border-slate-200 max-w-xl w-full shadow-2xl overflow-hidden my-auto flex flex-col max-h-[calc(100dvh-1.5rem)] sm:max-h-[90vh] min-h-0"
        dir={isRtl ? 'rtl' : 'ltr'}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-amber-950 text-white p-4.5 sm:p-6 border-b border-amber-500/30 relative shrink-0">
          <button
            onClick={onClose}
            className="absolute top-3.5 left-3.5 sm:top-5 sm:left-5 text-slate-400 hover:text-white bg-slate-800/80 hover:bg-slate-700 p-2 rounded-xl transition-colors cursor-pointer"
            title={language === 'he' ? 'סגור' : 'Close'}
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2 mb-1.5 pe-8 sm:pe-0">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-bold border border-amber-400/30">
              <Target className="w-3.5 h-3.5 text-amber-400" />
              <span>{language === 'he' ? 'הגדרת יעדי חודש' : 'Monthly Trading Objectives'}</span>
            </span>
            <span className="text-xs text-slate-400 font-mono">
              {monthName} {selectedYear}
            </span>
          </div>

          <h2 className="text-lg sm:text-2xl font-black text-white tracking-tight pe-6 sm:pe-0">
            {language === 'he' 
              ? `יעדי מסחר לחודש ${monthName} ${selectedYear}`
              : `Trading Goals for ${monthName} ${selectedYear}`}
          </h2>

          <p className="text-slate-300 text-xs sm:text-sm mt-1 max-w-md leading-relaxed">
            {language === 'he' 
              ? 'הגדר יעדי רווח, גבולות סיכון וחוקי משמעת לחודש זה. היעדים יוצגו באופן בולט בראש המערכת כדי להנחות אותך בכל יום מסחר.'
              : 'Set profit targets, risk boundaries, and discipline rules for this month. These goals will be displayed prominently in the header area.'}
          </p>
        </div>

        {/* Modal Body */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-4 text-start flex-1 min-h-0">
          
          {/* Quick presets / inspiration chips */}
          <div className="space-y-1.5">
            <div className="text-[11px] font-bold text-slate-600 uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>{language === 'he' ? 'הצעות מהירות להוספה ביעדים:' : 'Quick objective suggestions:'}</span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {suggestions.map((s, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => appendSuggestion(s.text)}
                  className="text-[11px] font-semibold bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200/80 px-2.5 py-1 rounded-lg transition-colors cursor-pointer active:scale-95 shadow-2xs"
                  title={language === 'he' ? 'לחץ להוספת היעד' : 'Click to append objective'}
                >
                  {s.label} +
                </button>
              ))}
            </div>
          </div>

          {/* Main textarea */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs text-slate-600 font-bold">
              <span>{language === 'he' ? 'פירוט יעדי המסחר שלך לחודש זה:' : 'Your Monthly Objectives & Ground Rules:'}</span>
              <span className="text-[10px] font-mono text-slate-400">
                {goalsText.length} {language === 'he' ? 'תווים' : 'chars'}
              </span>
            </div>

            <textarea
              value={goalsText}
              onChange={(e) => setGoalsText(e.target.value)}
              rows={6}
              placeholder={
                language === 'he'
                  ? 'רשום כאן את היעדים שלך לחודש...\nלמשל:\n1. יעד רווח חודשי: +10R נטו\n2. אפס הזזת סטופים לוס (משמעת 100%)\n3. עצירת מסחר יומית לאחר הפסד של 2R\n4. לא אסחר אחרי השעה 18:00'
                  : 'Write your monthly objectives here...\nFor example:\n1. Achieve +10R net target with strict 1R risk sizing\n2. Zero moving of stop losses (100% rule adherence)\n3. Max daily loss limit of 2R\n4. Never trade after 18:00'
              }
              className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-3.5 text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white transition-all leading-relaxed"
              autoFocus
            />
          </div>

          {/* Value highlight tip */}
          <div className="bg-amber-50/80 border border-amber-200/80 rounded-xl p-3 flex items-start gap-2.5 text-xs text-amber-900">
            <ShieldCheck className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <p className="leading-relaxed">
              {language === 'he'
                ? 'סוחרים שמגדירים מטרות חודשיות ברורות ומציגים אותן מול העיניים משפרים את המשמעת ב-68% ומפחיתים מסחר רגשי באופן דרמטי.'
                : 'Traders who clearly define their monthly objectives and keep them visible achieve significantly higher discipline scores and avoid impulsive tilt.'}
            </p>
          </div>

        </div>

        {/* Footer controls */}
        <div className="bg-slate-50 border-t border-slate-200 p-4 sm:p-5 flex items-center justify-between gap-3 shrink-0">
          <div>
            {Boolean(goalsText.trim()) && (
              <button
                type="button"
                onClick={handleClear}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-rose-600 hover:text-rose-700 hover:bg-rose-50 px-3 py-1.5 rounded-xl transition-colors cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>{language === 'he' ? 'נקה הכל' : 'Clear'}</span>
              </button>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-bold text-slate-600 hover:text-slate-900 bg-white border border-slate-200 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
            >
              {language === 'he' ? 'ביטול' : 'Cancel'}
            </button>

            <button
              type="button"
              onClick={handleSave}
              className="inline-flex items-center gap-1.5 px-5 py-2 text-xs font-bold text-slate-950 bg-amber-400 hover:bg-amber-300 rounded-xl transition-all shadow-sm shadow-amber-200 cursor-pointer active:scale-95"
            >
              <Check className="w-3.5 h-3.5" />
              <span>{language === 'he' ? 'שמור יעדי חודש' : 'Save Monthly Goals'}</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default MonthlyGoalsModal;
