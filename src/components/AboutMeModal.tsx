import React from 'react';
import { 
  X, 
  User, 
  ShieldCheck, 
  Target, 
  TrendingUp, 
  Heart, 
  Mail, 
  ExternalLink,
  Award,
  Sparkles,
  Compass,
  CheckCircle2,
  BookOpen
} from 'lucide-react';
import { LanguageCode } from '../utils/translations';
import { SUPPORT_EMAIL } from '../firebase';

interface AboutMeModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: LanguageCode;
  onOpenNewsletter?: () => void;
}

export const AboutMeModal: React.FC<AboutMeModalProps> = ({
  isOpen,
  onClose,
  language,
  onOpenNewsletter
}) => {
  if (!isOpen) return null;

  const isRtl = language === 'he' || language === 'ar';

  return (
    <div className="fixed inset-0 z-55 flex flex-col items-center justify-start sm:justify-center p-2.5 sm:p-4 bg-slate-950/80 backdrop-blur-md select-none overflow-y-auto overscroll-none pt-[max(0.75rem,env(safe-area-inset-top))] pb-[max(0.75rem,env(safe-area-inset-bottom))] animate-fadeIn">
      <div 
        className="bg-slate-900 border border-slate-800 rounded-3xl max-w-2xl w-full shadow-2xl overflow-hidden flex flex-col max-h-[calc(100dvh-2rem)] sm:max-h-[90vh] min-h-0 my-auto text-slate-100"
        dir={isRtl ? 'rtl' : 'ltr'}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-950 via-slate-900 to-slate-950 p-5 sm:p-6 border-b border-slate-800 flex items-center justify-between relative shrink-0">
          <div className="flex items-center gap-3.5 pe-8">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-indigo-600 to-indigo-500 text-white flex items-center justify-center shadow-lg shadow-indigo-600/30 shrink-0 text-xl">
              🧘‍♂️
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-black text-white">
                  {language === 'he' ? 'מי אני – המסע שלי למשמעת' : 'About Me – My Discipline Journey'}
                </h2>
                <span className="text-[10px] font-mono bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 px-2 py-0.5 rounded-full font-bold uppercase">
                  Story
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5 font-medium">
                {language === 'he' ? 'הסיפור האמיתי מאחורי יומן המסחר המנטלי' : 'The authentic philosophy behind the journal'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white flex items-center justify-center transition-colors cursor-pointer shrink-0"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable Body Content */}
        <div className="p-5 sm:p-7 space-y-6 flex-1 min-h-0 overflow-y-auto overscroll-contain text-xs sm:text-sm leading-relaxed text-slate-300">
          
          {/* Hero Quote Card */}
          <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-indigo-950/60 to-purple-950/40 border border-indigo-500/30 text-white space-y-2 relative overflow-hidden">
            <div className="flex items-center gap-2 text-indigo-400 font-extrabold text-[11px] uppercase tracking-wider">
              <Sparkles className="w-4 h-4" />
              <span>{language === 'he' ? 'החזון והמוטו המוביל' : 'Core Philosophy'}</span>
            </div>
            <p className="text-xs sm:text-sm italic font-medium leading-relaxed text-slate-200">
              {language === 'he'
                ? '״השוק לא שובר סוחרים – חוסר המשמעת והאגו של הסוחר שוברים אותו. המסע שלי במסחר הפך לרווחי רק ברגע שהפסקתי לחפש אינדיקטורים קסומים, והתחלתי למדוד את השליטה העצמית ואת יחידות ה-R שלי.״'
                : '"The market does not break traders; lack of discipline and unchecked ego do. My trading turned consistent only when I stopped chasing holy grails and began measuring my psychological control and R-Units."'}
            </p>
            <div className="text-end text-[11px] font-bold text-indigo-300">
              — My Discipline Journey
            </div>
          </div>

          {/* Section: Who am I & The Journey */}
          <div className="space-y-3">
            <h3 className="text-sm sm:text-base font-black text-white flex items-center gap-2">
              <Compass className="w-4 h-4 text-indigo-400" />
              <span>{language === 'he' ? 'איך הגעתי לכאן? הכאב שהוביל לפתרון' : 'How It Started: The Pain That Sparked Change'}</span>
            </h3>
            
            <p className="text-slate-300">
              {language === 'he' ? (
                <>
                  שלום, שמי אורן ואני סוחר פעיל בשוק ההון. במשך שנים חוויתי בדיוק את מה שרוב הסוחרים עוברים: ימים של רווחים יפים שנמחקו ברגע של טירוף, כניסות מתוך פחד מהחמצה (<strong>FOMO</strong>), הזזת סטופים ברגע האמת, ועסקאות נקמה (<strong>Revenge Trading</strong>) ששרפו חשבונות.
                </>
              ) : (
                <>
                  Hello, I am Oren, an active trader. For years, I experienced what almost every trader suffers: steady profitable days completely erased by a single impulsive hour, entering late due to <strong>FOMO</strong>, moving stops under pressure, and blowing accounts with <strong>Revenge Trading</strong>.
                </>
              )}
            </p>

            <p className="text-slate-300">
              {language === 'he' ? (
                <>
                  בכל פעם שהפסדתי, פתחתי יומן אקסל רגיל וראיתי רק מספרים באדום. האקסל לא שאל אותי: <em>״האם היית עייף?״</em>, <em>״האם נכנסת מתוך עצבים?״</em>, <em>״האם הזזת את הסטופ?״</em>. הבנתי שאי אפשר לשפר משהו שלא מודדים אותו.
                </>
              ) : (
                <>
                  Whenever I lost, my regular spreadsheets only showed red dollars. They never asked: <em>"Were you exhausted?"</em>, <em>"Were you tilting?"</em>, <em>"Did you widen your stop loss?"</em>. I realized you cannot master what you don't objectively measure.
                </>
              )}
            </p>
          </div>

          {/* Section: Why Smart Trading Journal? */}
          <div className="space-y-3">
            <h3 className="text-sm sm:text-base font-black text-white flex items-center gap-2">
              <Target className="w-4 h-4 text-emerald-400" />
              <span>{language === 'he' ? 'למה יצרתי את יומן המסחר הזה?' : 'Why I Built Smart Trading Journal'}</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              <div className="p-3.5 bg-slate-950/60 rounded-xl border border-slate-800 space-y-1">
                <div className="flex items-center gap-2 font-bold text-white text-xs">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span>{language === 'he' ? 'ציון משמעת יומי' : 'Daily Discipline Score'}</span>
                </div>
                <p className="text-[11px] text-slate-400">
                  {language === 'he'
                    ? 'אלגוריתם שבודק האם פעלת לפי החוקים שלך ומעניק ציון אובייקטיבי – בלי קשר לשאלה אם העסקה הרוויחה או הפסידה.'
                    : 'An objective rating evaluating rule adherence regardless of whether the market awarded a win or loss.'}
                </p>
              </div>

              <div className="p-3.5 bg-slate-950/60 rounded-xl border border-slate-800 space-y-1">
                <div className="flex items-center gap-2 font-bold text-white text-xs">
                  <CheckCircle2 className="w-3.5 h-3.5 text-indigo-400" />
                  <span>{language === 'he' ? 'חשבונאות יחידות R' : 'R-Unit Accounting'}</span>
                </div>
                <p className="text-[11px] text-slate-400">
                  {language === 'he'
                    ? 'מדידה ביחידות סיכון קבועות מנטרלת את החרדה וההטיות הנגרמות ממספרי דולרים ומאפשרת שיפור מתמטי טהור.'
                    : 'Evaluating trades in defined risk multiples neutralizes dollar anxiety and fosters mathematical execution.'}
                </p>
              </div>

              <div className="p-3.5 bg-slate-950/60 rounded-xl border border-slate-800 space-y-1">
                <div className="flex items-center gap-2 font-bold text-white text-xs">
                  <CheckCircle2 className="w-3.5 h-3.5 text-amber-400" />
                  <span>{language === 'he' ? 'לוח שנה מנטלי חזותי' : 'Visual Mental Calendar'}</span>
                </div>
                <p className="text-[11px] text-slate-400">
                  {language === 'he'
                    ? 'תצוגה חזותית בצבעים המציגה את הקשר בין ימים רגועים ומפוקסים לבין יציבות התוצאות לאורך חודשים.'
                    : 'Color-coded calendar isolating how calm, focused states consistently outperform impulsive tilt.'}
                </p>
              </div>

              <div className="p-3.5 bg-slate-950/60 rounded-xl border border-slate-800 space-y-1">
                <div className="flex items-center gap-2 font-bold text-white text-xs">
                  <CheckCircle2 className="w-3.5 h-3.5 text-rose-400" />
                  <span>{language === 'he' ? 'עצירת סטיות בזמן אמת' : 'Deviation Isolation'}</span>
                </div>
                <p className="text-[11px] text-slate-400">
                  {language === 'he'
                    ? 'זיהוי מיידי של כניסה מוקדמת, הגדלת סיכון או יציאה בפאניקה כדי לנטרל אותם לפני שהם חוזרים.'
                    : 'Instant diagnosis of early entries, widened stops, or panic exits before they compound.'}
                </p>
              </div>
            </div>
          </div>

          {/* Section: Transparency & Brand Promise */}
          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
            <div className="flex items-center gap-2 text-emerald-400 font-extrabold text-xs">
              <ShieldCheck className="w-4 h-4" />
              <span>{language === 'he' ? 'המחויבות שלי לאמינות ולשקיפות מלאה' : 'Our Commitment to Integrity & Transparency'}</span>
            </div>
            <ul className="space-y-1.5 text-slate-300 text-[11px]">
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0" />
                <span>{language === 'he' ? 'ללא הבטחות לעושר מהיר או מכירת אשליות – מסחר הוא מקצוע מורכב הדורש עבודה יומיומית.' : 'Zero get-rich-quick claims: trading is a serious, probability-based business.'}</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0" />
                <span>{language === 'he' ? 'שמירה מלאה על פרטיותך – הנתונים שלך שייכים אך ורק לך ומאובטחים.' : 'Complete data privacy: your trades belong strictly to you and remain secure.'}</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0" />
                <span>{language === 'he' ? 'תמיכה אישית ואמיתית מסוחר שמבין את האתגרים שלך.' : 'Genuine personal support from an active trader who understands the grind.'}</span>
              </li>
            </ul>
          </div>

          {/* Official Contact & Socials Bar */}
          <div className="p-4 rounded-2xl bg-indigo-950/30 border border-indigo-500/20 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-start">
            <div className="space-y-1">
              <div className="text-xs font-bold text-white flex items-center justify-center sm:justify-start gap-1.5">
                <Mail className="w-3.5 h-3.5 text-indigo-400" />
                <span>{language === 'he' ? 'כתובת התמיכה והקשר הרשמית:' : 'Official Brand Support Email:'}</span>
              </div>
              <a 
                href={`mailto:${SUPPORT_EMAIL}`}
                className="text-xs font-mono font-bold text-indigo-300 hover:text-white underline"
              >
                {SUPPORT_EMAIL}
              </a>
            </div>

            {onOpenNewsletter && (
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onOpenNewsletter();
                }}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl transition-all shadow-xs shrink-0 cursor-pointer flex items-center gap-1.5"
              >
                <BookOpen className="w-3.5 h-3.5" />
                <span>{language === 'he' ? 'הרשם לרשימת התפוצה 📩' : 'Join Email Newsletter 📩'}</span>
              </button>
            )}
          </div>

        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-950 border-t border-slate-800 flex items-center justify-between shrink-0">
          <div className="text-[11px] text-slate-500 font-medium">
            © 2026 My Discipline Journey. All rights reserved.
          </div>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold rounded-xl transition-colors cursor-pointer"
          >
            {language === 'he' ? 'סגור ✕' : 'Close ✕'}
          </button>
        </div>

      </div>
    </div>
  );
};
