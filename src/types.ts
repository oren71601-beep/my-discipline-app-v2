export type ExecutedOption = 'Y' | 'N' | null;

export type MentalStateOption = 'calm' | 'stressed' | 'tired' | 'indifferent' | 'revenge' | null;

export type NoEntryReasonOption = 'focus' | 'rr' | 'discipline' | 'fear' | 'other' | null;

export type DeviationOption = 'none' | 'early_entry' | 'move_stop' | 'raise_risk' | 'early_exit' | null;

export interface TradingDay {
  day: number;
  executed: ExecutedOption;
  mentalState: MentalStateOption;
  noEntryReason: NoEntryReasonOption;
  deviation: DeviationOption;
  confidence: number | null; // 1-5
  rating: number | null; // 1-10
  resultR: number | null; // R unit size, e.g. +2.5, -1.0
  notes?: string; // Additional short comment
}

export interface MonthlyTradingData {
  monthId: string; // e.g., "2026-06"
  days: TradingDay[];
}

// Translations and configurations
export const MENTAL_STATE_TRANSLATIONS: Record<Exclude<MentalStateOption, null>, string> = {
  calm: 'רגוע',
  stressed: 'לחוץ',
  tired: 'עייף',
  indifferent: 'אדיש',
  revenge: 'נקמה',
};

export const MENTAL_STATE_EMOJIS: Record<Exclude<MentalStateOption, null>, string> = {
  calm: '🧘‍♂️',
  stressed: '😰',
  tired: '😴',
  indifferent: '😐',
  revenge: '😡',
};

export const NO_ENTRY_REASON_TRANSLATIONS: Record<Exclude<NoEntryReasonOption, null>, string> = {
  focus: 'פוקוס',
  rr: 'RR',
  discipline: 'משמעת',
  fear: 'פחד',
  other: 'אחר',
};

export const DEVIATION_TRANSLATIONS: Record<Exclude<DeviationOption, null>, string> = {
  none: 'ללא',
  early_entry: 'כ.מוקדמת',
  move_stop: 'ה.סטופ',
  raise_risk: 'ה.סיכון',
  early_exit: 'י.מוקדמת',
};

export const DEVIATION_DESCRIPTIONS: Record<Exclude<DeviationOption, null>, string> = {
  none: 'ללא חריגה',
  early_entry: 'כניסה מוקדמת לפני האישור',
  move_stop: 'הזזת סטופ בניגוד לתוכנית',
  raise_risk: 'הגדלת סיכון מעבר לקביעה R',
  early_exit: 'יציאה מוקדמת מהעסקה',
};

export const HEBREW_WEEKDAYS = [
  'ראשון',
  'שני',
  'שלישי',
  'רביעי',
  'חמישי',
  'שישי',
  'שבת'
];

export const HEBREW_WEEKDAYS_SHORT = [
  'א\'',
  'ב\'',
  'ג\'',
  'ד\'',
  'ה\'',
  'ו\'',
  'ש\''
];

export const HEBREW_MONTH_NAMES = [
  { id: 1, name: 'ינואר' },
  { id: 2, name: 'פברואר' },
  { id: 3, name: 'מרץ' },
  { id: 4, name: 'אפריל' },
  { id: 5, name: 'מאי' },
  { id: 6, name: 'יוני' },
  { id: 7, name: 'יולי' },
  { id: 8, name: 'אוגוסט' },
  { id: 9, name: 'ספטמבר' },
  { id: 10, name: 'אוקטובר' },
  { id: 11, name: 'נובמבר' },
  { id: 12, name: 'דצמבר' },
];

