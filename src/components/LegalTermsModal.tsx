import React, { useState } from 'react';
import { 
  X, 
  FileText, 
  ShieldCheck, 
  RotateCcw, 
  AlertTriangle, 
  CheckCircle2, 
  HelpCircle,
  ExternalLink,
  Scale,
  Lock,
  Calendar,
  CreditCard
} from 'lucide-react';
import { LanguageCode } from '../utils/translations';

export type LegalTab = 'terms' | 'cancellation' | 'privacy';

interface LegalTermsModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTab?: LegalTab;
  language: LanguageCode;
  onAccept?: () => void;
}

export const LegalTermsModal: React.FC<LegalTermsModalProps> = ({
  isOpen,
  onClose,
  initialTab = 'terms',
  language,
  onAccept
}) => {
  const [activeTab, setActiveTab] = useState<LegalTab>(initialTab);

  // Sync tab if initialTab changes when opened
  React.useEffect(() => {
    if (isOpen) {
      setActiveTab(initialTab);
    }
  }, [isOpen, initialTab]);

  if (!isOpen) return null;

  const isRTL = language === 'he' || language === 'ar';

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-start sm:justify-center p-2.5 sm:p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in overflow-y-auto overscroll-none pt-[max(0.75rem,env(safe-area-inset-top))] pb-[max(0.75rem,env(safe-area-inset-bottom))]">
      <div 
        className="bg-white rounded-3xl shadow-2xl w-full max-w-3xl max-h-[calc(100dvh-2rem)] sm:max-h-[90vh] flex flex-col min-h-0 shrink-0 my-auto overflow-hidden border border-slate-200"
        dir={isRTL ? 'rtl' : 'ltr'}
      >
        {/* Modal Top Header */}
        <div className="bg-slate-900 text-white px-5 sm:px-6 py-4 flex items-center justify-between shrink-0 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-500/20 border border-indigo-400/30 flex items-center justify-center text-indigo-300">
              <Scale className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-black tracking-tight text-white flex items-center gap-2">
                <span>
                  {language === 'he' 
                    ? 'תקנון, תנאי שימוש ומדיניות ביטול' 
                    : language === 'ar' 
                    ? 'الشروط والأحكام وسياسة الإلغاء' 
                    : language === 'ru' 
                    ? 'Условия использования и политика отмены' 
                    : 'Terms of Service & Cancellation Policy'}
                </span>
                <span className="text-[10px] bg-indigo-950 text-indigo-300 border border-indigo-800/60 px-2 py-0.5 rounded-full font-mono">
                  v2026.1
                </span>
              </h3>
              <p className="text-xs text-slate-400">
                {language === 'he' 
                  ? 'מסמך משפטי רשמי לשירות דיגיטלי בהתאם להוראות הדין וחוק הגנת הצרכן' 
                  : 'Official Legal Agreement for Digital Services under Consumer Protection Laws'}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-slate-100/90 border-b border-slate-200 px-4 sm:px-6 py-2 flex items-center gap-2 overflow-x-auto shrink-0">
          <button
            type="button"
            onClick={() => setActiveTab('terms')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
              activeTab === 'terms'
                ? 'bg-white text-indigo-700 shadow-xs border border-slate-200/80 font-black'
                : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>{language === 'he' ? '📜 תקנון ותנאי שימוש' : '📜 Terms of Service'}</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('cancellation')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
              activeTab === 'cancellation'
                ? 'bg-white text-rose-700 shadow-xs border border-slate-200/80 font-black'
                : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
            }`}
          >
            <RotateCcw className="w-3.5 h-3.5 text-rose-500" />
            <span>{language === 'he' ? '⚖️ מדיניות ביטול עסקה (חוק הגנת הצרכן)' : '⚖️ Cancellation Policy (By Law)'}</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('privacy')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
              activeTab === 'privacy'
                ? 'bg-white text-emerald-700 shadow-xs border border-slate-200/80 font-black'
                : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
            }`}
          >
            <Lock className="w-3.5 h-3.5 text-emerald-600" />
            <span>{language === 'he' ? '🔒 פרטיות ואבטחת מידע' : '🔒 Privacy & Security'}</span>
          </button>
        </div>

        {/* Scrollable Content Body */}
        <div 
          className="flex-1 min-h-0 overflow-y-auto overscroll-contain touch-pan-y p-5 sm:p-7 pb-10 text-xs sm:text-sm text-slate-700 leading-relaxed space-y-6"
          style={{ WebkitOverflowScrolling: 'touch' }}
        >
          
          {/* TAB 1: TERMS OF SERVICE */}
          {activeTab === 'terms' && (
            <div className="space-y-5 animate-fade-in">
              <div className="bg-amber-50 border border-amber-200 p-4 rounded-2xl flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                <div className="text-xs text-amber-900 space-y-1">
                  <div className="font-bold text-amber-950">
                    {language === 'he' 
                      ? 'הבהרה משפטית מפורשת: אי-מתן ייעוץ השקעות או פיננסי' 
                      : 'Regulatory Disclaimer: Not Financial or Investment Advice'}
                  </div>
                  <p>
                    {language === 'he' 
                      ? 'האתר, השירות, האלגוריתמים והתכנים הינם כלי עזר דיגיטלי, פסיכולוגי וסטטיסטי לניהול יומן מסחר אישי בלבד. מפעיל האתר אינו בעל רישיון לייעוץ השקעות, שיווק השקעות או ניהול תיקי השקעות לפי חוק הסדרת העיסוק בייעוץ השקעות, בשיווק השקעות ובניהול תיקי השקעות, התשנ"ה-1995. אין לראות באמור באתר המלצה, שידול או חוות דעת לביצוע פעולות מסחר בניירות ערך או במכשירים פיננסיים כלשהם. כל פעולה ומסחר נעשים באחריותו המלאה והבלעדית של המשתמש.'
                      : 'This platform is an analytical and psychological trading journal tool. It does not provide financial or investment advice. Trading in financial markets involves substantial risk of loss. Users bear full and exclusive responsibility for their investment decisions.'}
                  </p>
                </div>
              </div>

              <section className="space-y-2">
                <h4 className="text-sm font-black text-slate-900 flex items-center gap-1.5">
                  <span className="w-1.5 h-3 bg-indigo-600 rounded-full inline-block" />
                  <span>1. מבוא והסכמה לתנאים</span>
                </h4>
                <p>
                  ברוכים הבאים ליומן המסחר והמשמעת המנטלית (להלן: "האתר" או "השירות"). השימוש באתר, לרבות גלישה, הרשמה, רכישת מנוי דיגיטלי ושימוש בתוכנה, כפוף להסכמתך המלאה לתנאי תקנון זה ולמדיניות הפרטיות והביטולים. לחיצה על כפתור ההרשמה ("Subscribe") מהווה אישור מפורש כי קראת, הבנת והסכמת לתנאים במלואם.
                </p>
              </section>

              <section className="space-y-2">
                <h4 className="text-sm font-black text-slate-900 flex items-center gap-1.5">
                  <span className="w-1.5 h-3 bg-indigo-600 rounded-full inline-block" />
                  <span>2. מהות השירות והגישה הדיגיטלית</span>
                </h4>
                <p>
                  השירות הינו תוכנה כשירות (SaaS) המספקת ממשק אינטראקטיבי לתיעוד עסקאות, בקרה על תוכניות מסחר, ניתוח פסיכולוגיה מנטלית, מעקב עמידה בחוקי משמעת, וסנכרון ענן בין מכשירים שונים. הגישה ניתנת במתכונת רישיון שימוש אישי, שאינו בלעדי ושאינו ניתן להעברה.
                </p>
              </section>

              <section className="space-y-2">
                <h4 className="text-sm font-black text-slate-900 flex items-center gap-1.5">
                  <span className="w-1.5 h-3 bg-indigo-600 rounded-full inline-block" />
                  <span>3. תקופת ניסיון חינם (7 ימים) ומנוי מתחדש</span>
                </h4>
                <p>
                  כל נרשם חדש זכאי לתקופת ניסיון חינמית למשך 7 ימים קלנדריים, שבמהלכה ניתנת גישה מלאה לכלל תכונות הפרימיום ללא תשלום (0.00 ש"ח / $0). בסיום 7 ימי הניסיון, יימשך המנוי במתכונת מתחדשת חודשית בעלות של $25 לחודש (או הסכום המקביל בש"ח), אלא אם כן הודיע המשתמש על ביטול המנוי לפני תום תקופת הניסיון כמפורט במדיניות הביטול.
                </p>
              </section>

              <section className="space-y-2">
                <h4 className="text-sm font-black text-slate-900 flex items-center gap-1.5">
                  <span className="w-1.5 h-3 bg-indigo-600 rounded-full inline-block" />
                  <span>4. תשלומים וסליקה מאובטחת</span>
                </h4>
                <p>
                  הסליקה מתבצעת באמצעות ספק הסליקה המורשה והמאובטח Payoneer העומד בתקן המחמיר PCI-DSS. פרטי כרטיס האשראי אינם נשמרים בשרתי האתר אלא מעובדים ישירות בסביבת הסליקה המאובטחת של Payoneer.
                </p>
              </section>

              <section className="space-y-2">
                <h4 className="text-sm font-black text-slate-900 flex items-center gap-1.5">
                  <span className="w-1.5 h-3 bg-indigo-600 rounded-full inline-block" />
                  <span>5. קניין רוחני וזכויות יוצרים</span>
                </h4>
                <p>
                  כל זכויות היוצרים, סימני המסחר, קוד המקור, הממשק הגרפי, המודלים המתמטיים, התובנות והעיצובים באתר הינם קניינו הבלעדי של מפעיל האתר. חל איסור מוחלט להעתיק, להפיץ, להנדס לאחור (Reverse Engineer) או להעמיד לרשות צדדים שלישיים כל חלק מהשירות ללא אישור מראש ובכתב.
                </p>
              </section>

              <section className="space-y-2">
                <h4 className="text-sm font-black text-slate-900 flex items-center gap-1.5">
                  <span className="w-1.5 h-3 bg-indigo-600 rounded-full inline-block" />
                  <span>6. הגבלת אחריות</span>
                </h4>
                <p>
                  השירות ניתן במתכונת "כפי שהוא" ("AS IS") ועל בסיס זמינותו ("AS AVAILABLE"). מפעיל האתר עושה מאמצים רבים להבטיח רציפות ותקינות השירות, אך אינו מתחייב שהשירות יפעל ללא הפסקות, עיכובים או תקלות רשת. מפעיל האתר לא יישא בכל אחריות לנזק ישיר, עקיף או תוצאתי, לרבות הפסדי מסחר, אובדן נתונים או מניעת רווח, הנובעים משימוש בשירות.
                </p>
              </section>

              <section className="space-y-2">
                <h4 className="text-sm font-black text-slate-900 flex items-center gap-1.5">
                  <span className="w-1.5 h-3 bg-indigo-600 rounded-full inline-block" />
                  <span>7. דין וסמכות שיפוט</span>
                </h4>
                <p>
                  על תקנון זה ועל כל סכסוך הנובע מהשימוש באתר יחולו אך ורק דיני מדינת ישראל. סמכות השיפוט הבלעדית בכל עניין נתונה לבתי המשפט המוסמכים במחוז תל אביב-יפו או מרכז.
                </p>
              </section>
            </div>
          )}

          {/* TAB 2: CANCELLATION POLICY ACCORDING TO ISRAELI LAW */}
          {activeTab === 'cancellation' && (
            <div className="space-y-5 animate-fade-in">
              <div className="bg-emerald-50 border border-emerald-200 p-4 rounded-2xl flex items-start gap-3">
                <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                <div className="text-xs text-emerald-900 space-y-1">
                  <div className="font-bold text-emerald-950">
                    {language === 'he' 
                      ? 'מדיניות ביטול שקופה והוגנת לפי חוק הגנת הצרכן, התשמ"א-1981' 
                      : 'Consumer Protection Cancellation Policy by Law'}
                  </div>
                  <p>
                    {language === 'he' 
                      ? 'אנו מכבדים באופן מלא את זכויות הצרכן. ניתן לבטל את המנוי בכל עת ובקלות בלחיצת כפתור אחת מתוך הגדרות החשבון באפליקציה, ללא כל התחייבות וללא דמי ביטול.' 
                      : 'You can cancel your subscription easily at any time from your account settings without cancellation fees.'}
                  </p>
                </div>
              </div>

              <section className="space-y-2">
                <h4 className="text-sm font-black text-slate-900 flex items-center gap-1.5">
                  <span className="w-1.5 h-3 bg-rose-600 rounded-full inline-block" />
                  <span>1. ביטול במהלך תקופת הניסיון החינמית (7 ימים)</span>
                </h4>
                <p>
                  כל מנוי זכאי ל-7 ימי ניסיון מלאים ללא עלות. במידה ותבחר לבטל את המנוי במהלך 7 ימי הניסיון, <strong>כרטיס האשראי שלך לא יחויב כלל (חיוב של 0.00 ש"ח)</strong> והשירות ייפסק ללא שום עלות.
                </p>
              </section>

              <section className="space-y-2">
                <h4 className="text-sm font-black text-slate-900 flex items-center gap-1.5">
                  <span className="w-1.5 h-3 bg-rose-600 rounded-full inline-block" />
                  <span>2. ביטול עסקת שירות מתמשך (ביטול בכל עת)</span>
                </h4>
                <p>
                  בהתאם לסעיף 14ט לחוק הגנת הצרכן, בעסקת שירות מתמשך רשאי הצרכן להודיע על ביטול העסקה בכל עת:
                </p>
                <ul className="list-disc list-inside space-y-1 text-xs text-slate-600 ps-2">
                  <li>עם מסירת הודעת הביטול, ייפסק החיוב עבור תקופת החיוב הבאה.</li>
                  <li>הגישה לתכונות המנוי תישאר פתוחה עד לסיום החודש שעבורו שולם, ולא תתבצע שום גבייה נוספת.</li>
                  <li><strong>אין כל דמי ביטול</strong> ואין כל קנס בגין ביטול המנוי.</li>
                </ul>
              </section>

              <section className="space-y-2">
                <h4 className="text-sm font-black text-slate-900 flex items-center gap-1.5">
                  <span className="w-1.5 h-3 bg-rose-600 rounded-full inline-block" />
                  <span>3. זכות ביטול עסקת מכר מרחוק תוך 14 יום</span>
                </h4>
                <p>
                  בהתאם לסעיפים 14ג ו-14ה לחוק הגנת הצרכן, בעסקת מכר מרחוק רשאי הצרכן לבטל את העסקה בתוך 14 ימים מיום עשיית העסקה או מיום קבלת מסמך הגילוי (לפי המאוחר מבניהם).
                </p>
                <p>
                  במקרה של ביטול שירות מתמשך שהוחל במתן השירות לאחר תום ימי הניסיון, יחויב הצרכן אך ורק בסכום היחסי עבור השירות שניתן עד למועד מסירת הודעת הביטול.
                </p>
              </section>

              <section className="space-y-2">
                <h4 className="text-sm font-black text-slate-900 flex items-center gap-1.5">
                  <span className="w-1.5 h-3 bg-rose-600 rounded-full inline-block" />
                  <span>4. ביטול לאוכלוסיות מיוחדות (אזרח ותיק, עולה חדש, אדם עם מוגבלות)</span>
                </h4>
                <p>
                  בהתאם לסעיף 14ג1 לחוק הגנת הצרכן, צרכן שהוא אדם עם מוגבלות, אזרח ותיק או עולה חדש, רשאי לבטל עסקת מכר מרחוק בתוך <strong>4 חודשים</strong> מיום עשיית העסקה, מיום קבלת הנכס או מיום קבלת מסמך פרטי העסקה, לפי המאוחר, ובלבד שההתקשרות בעסקה כללה שיחה או התכתבות בין העוסק לצרכן.
                </p>
              </section>

              <section className="space-y-2">
                <h4 className="text-sm font-black text-slate-900 flex items-center gap-1.5">
                  <span className="w-1.5 h-3 bg-rose-600 rounded-full inline-block" />
                  <span>5. דרכי מסירת הודעת ביטול</span>
                </h4>
                <div className="bg-slate-50 border border-slate-200 p-3.5 rounded-2xl space-y-2 text-xs">
                  <p className="font-bold text-slate-900">הצרכן רשאי למסור הודעת ביטול בכל אחת מהדרכים הבאות:</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <div className="p-2.5 bg-white border border-slate-200/80 rounded-xl">
                      <div className="font-bold text-indigo-700 flex items-center gap-1.5">
                        <CreditCard className="w-3.5 h-3.5" />
                        <span>בלחיצה עצמאית באפליקציה</span>
                      </div>
                      <p className="text-[11px] text-slate-500 mt-0.5">
                        בסרגל התחתון: "ניהול מנוי וחשבון" ← כפתור "ביטול מנוי". הביטול מתבצע מיידית.
                      </p>
                    </div>

                    <div className="p-2.5 bg-white border border-slate-200/80 rounded-xl">
                      <div className="font-bold text-indigo-700 flex items-center gap-1.5">
                        <FileText className="w-3.5 h-3.5" />
                        <span>בדואר אלקטרוני לשירות</span>
                      </div>
                      <p className="text-[11px] text-slate-500 mt-0.5">
                        משלוח מייל לכתובת התמיכה עם כתובת המייל שבה נרשמת.
                      </p>
                    </div>
                  </div>
                </div>
              </section>
            </div>
          )}

          {/* TAB 3: PRIVACY & DATA SECURITY */}
          {activeTab === 'privacy' && (
            <div className="space-y-5 animate-fade-in">
              <div className="bg-indigo-50 border border-indigo-200 p-4 rounded-2xl flex items-start gap-3">
                <Lock className="w-5 h-5 text-indigo-600 shrink-0 mt-0.5" />
                <div className="text-xs text-indigo-900 space-y-1">
                  <div className="font-bold text-indigo-950">
                    {language === 'he' ? 'שמירה קפדנית על פרטיות הנתונים והעסקאות' : 'Strict Data Privacy & Encryption'}
                  </div>
                  <p>
                    {language === 'he' 
                      ? 'המידע האישי, יומן העסקאות, ההערות והרגשות המוזנים על ידך הינם אישיים וסודיים לחלוטין. איננו מוכרים, משכירים או מעבירים את המידע שלך לצדדים שלישיים כלשהם.' 
                      : 'Your trading logs and personal notes are confidential and encrypted. We never sell your data.'}
                  </p>
                </div>
              </div>

              <section className="space-y-2">
                <h4 className="text-sm font-black text-slate-900 flex items-center gap-1.5">
                  <span className="w-1.5 h-3 bg-emerald-600 rounded-full inline-block" />
                  <span>1. איזה מידע נאסף?</span>
                </h4>
                <p>
                  אנו אוספים אך ורק מידע הנחוץ לתפעול השירות: כתובת דוא"ל לזיהוי המנוי, עסקאות ונתוני משמעת שאתה מזין ביומן, והגדרות תצוגה מועדפות (כגון חודש/שנה פעילים ושפה).
                </p>
              </section>

              <section className="space-y-2">
                <h4 className="text-sm font-black text-slate-900 flex items-center gap-1.5">
                  <span className="w-1.5 h-3 bg-emerald-600 rounded-full inline-block" />
                  <span>2. אבטחת ענן וסנכרון</span>
                </h4>
                <p>
                  המידע מאוחסן בשרתי ענן מאובטחים (Google Cloud / Firebase) תוך שימוש בהצפנה במעבר (SSL/TLS) ובהצפנה במנוחה. הגישה לנתונים שלך מתאפשרת אך ורק למשתמש המאומת של חשבונך, בהתאם לכללי אבטחת מידע קפדניים.
                </p>
              </section>

              <section className="space-y-2">
                <h4 className="text-sm font-black text-slate-900 flex items-center gap-1.5">
                  <span className="w-1.5 h-3 bg-emerald-600 rounded-full inline-block" />
                  <span>3. שליטה מלאה בנתונים – ייצוא ומחיקה</span>
                </h4>
                <p>
                  המשתמש זכאי בכל עת לייצא את כל נתוני המסחר שלו לקובץ גיבוי חיצוני (JSON) ישירות מתוך הממשק, וכן לבקש מחיקה מלאה ובלתי חוזרת של החשבון והמידע משרתי החברה.
                </p>
              </section>
            </div>
          )}

        </div>

        {/* Modal Bottom Footer Actions */}
        <div className="bg-slate-50 px-5 sm:px-6 py-3.5 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
          <div className="text-[11px] text-slate-500 text-center sm:text-start">
            {language === 'he' 
              ? 'על ידי הרשמה למנוי, הנך מאשר כי קראת והסכמת לתקנון ולמדיניות הביטול.' 
              : 'By subscribing, you confirm that you have read and agreed to the terms & cancellation policy.'}
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            {onAccept && (
              <button
                type="button"
                onClick={() => {
                  onAccept();
                  onClose();
                }}
                className="w-full sm:w-auto px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-sm transition-all flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <CheckCircle2 className="w-4 h-4 text-white" />
                <span>{language === 'he' ? 'קראתי והבנתי • אישור' : 'I Understand & Agree'}</span>
              </button>
            )}

            <button
              type="button"
              onClick={onClose}
              className="w-full sm:w-auto px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold text-xs rounded-xl transition-all cursor-pointer text-center"
            >
              <span>{language === 'he' ? 'סגור' : 'Close'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
