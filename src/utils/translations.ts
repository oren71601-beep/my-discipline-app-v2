import { MentalStateOption, NoEntryReasonOption, DeviationOption } from '../types';

export type LanguageCode = 'he' | 'en' | 'ar' | 'ru';

export interface LanguageConfig {
  code: LanguageCode;
  name: string;
  flag: string;
  dir: 'rtl' | 'ltr';
}

export const LANGUAGES: LanguageConfig[] = [
  { code: 'he', name: 'עברית', flag: '🇮🇱', dir: 'rtl' },
  { code: 'en', name: 'English', flag: '🇺🇸', dir: 'ltr' },
  { code: 'ar', name: 'العربية', flag: '🇸🇦', dir: 'rtl' },
  { code: 'ru', name: 'Русский', flag: '🇷🇺', dir: 'ltr' }
];

export interface TranslationDictionary {
  // General UI
  appTitle: string;
  appSubtitle: string;
  tableMode: string;
  calendarMode: string;
  showAnalytics: string;
  hideAnalytics: string;
  clearMonth: string;
  loadSampleData: string;
  backupData: string;
  uploadData: string;
  selectYear: string;
  selectMonth: string;
  
  // Table Columns
  colDay: string;
  colExecuted: string;
  colMentalState: string;
  colNoEntryReason: string;
  colDeviation: string;
  colConfidence: string;
  colRating: string;
  colResultR: string;
  colNotes: string;
  colActions: string;

  // Options Translations
  executedY: string;
  executedN: string;
  executedNone: string;
  
  mentalState: Record<Exclude<MentalStateOption, null>, string>;
  noEntryReason: Record<Exclude<NoEntryReasonOption, null>, string>;
  deviation: Record<Exclude<DeviationOption, null>, string>;
  deviationDesc: Record<Exclude<DeviationOption, null>, string>;

  // Weekdays & Months
  weekdaysShort: string[];
  months: string[];

  // Confirmations & Toast messages
  confirmClearTitle: string;
  confirmClearText: string;
  confirmCancel: string;
  confirmApprove: string;
  toastSuccessClear: string;
  toastSuccessSample: string;
  toastSuccessBackup: string;
  toastSuccessUpload: string;
  toastErrorUpload: string;

  // Paywall & Monetization Header
  monetizationHeaderTitle: string;
  monetizationHeaderSub: string;
  statusPremium: string;
  statusFree: string;
  btnToggleFree: string;
  btnTogglePremium: string;
  btnAppStoreGuide: string;
  
  // Paywall Modal
  paywallLockedTitle: string;
  paywallLockedDesc: string;
  paywallUnlockBtn: string;
  devBypassBtn: string;
  
  paywallFeaturesTitle: string;
  paywallFeature1Title: string;
  paywallFeature1Desc: string;
  paywallFeature2Title: string;
  paywallFeature2Desc: string;
  paywallFeature3Title: string;
  paywallFeature3Desc: string;
  paywallPriceSub: string;
  paywallPriceDetails: string;
  paywallBtnStart: string;
  paywallConnecting: string;
  paywallSecuredText: string;
  
  // Guide Modal
  guideTitle: string;
  guideSub: string;
  guideModelTitle: string;
  guideModelDesc: string;
  guideStep1Title: string;
  guideStep1Desc: string;
  guideStep2Title: string;
  guideStep2Desc: string;
  guideStep3Title: string;
  guideStep3Desc: string;
  guideStep4Title: string;
  guideStep4Desc: string;
  guideAppStoreTips: string;
  guideEulaTitle: string;
  guideEulaDesc: string;
  guideValueTitle: string;
  guideValueDesc: string;
  guideRestoreTitle: string;
  guideRestoreDesc: string;
}

export const TRANSLATIONS: Record<LanguageCode, TranslationDictionary> = {
  he: {
    appTitle: 'יומן מסחר מנטלי וביצועים',
    appSubtitle: 'עקוב אחר משמעת עצמית, מצב פסיכולוגי ורווחיות R של עסקאות המסחר שלך',
    tableMode: 'תצוגת טבלה',
    calendarMode: 'לוח שנה מנטלי',
    showAnalytics: 'הצג אנליטיקה',
    hideAnalytics: 'הסתר אנליטיקה',
    clearMonth: 'איפוס חודש',
    loadSampleData: 'טען נתוני דוגמה',
    backupData: 'גיבוי נתונים',
    uploadData: 'העלאת גיבוי',
    selectYear: 'בחר שנה',
    selectMonth: 'בחר חודש',

    colDay: 'יום',
    colExecuted: 'בוצע?',
    colMentalState: 'מצב מנטלי',
    colNoEntryReason: 'סיבת אי-כניסה',
    colDeviation: 'חריגה מהתוכנית',
    colConfidence: 'ביטחון (1-5)',
    colRating: 'ציון (1-10)',
    colResultR: 'תוצאה (R)',
    colNotes: 'הערות קצרות',
    colActions: 'פעולות',

    executedY: 'כן (Y)',
    executedN: 'לא (N)',
    executedNone: 'טרם הוזן',

    mentalState: {
      calm: 'רגוע',
      stressed: 'לחוץ',
      tired: 'עייף',
      indifferent: 'אדיש',
      revenge: 'נקמה',
    },
    noEntryReason: {
      focus: 'פוקוס',
      rr: 'RR',
      discipline: 'משמעת',
      fear: 'פחד',
      other: 'אחר',
    },
    deviation: {
      none: 'ללא חריגה',
      early_entry: 'כ.מוקדמת',
      move_stop: 'ה.סטופ',
      raise_risk: 'ה.סיכון',
      early_exit: 'י.מוקדמת',
    },
    deviationDesc: {
      none: 'ללא חריגה מהתוכנית',
      early_entry: 'כניסה מוקדמת לפני האישור',
      move_stop: 'הזזת סטופ בניגוד לתוכנית',
      raise_risk: 'הגדלת סיכון מעבר לקביעה R',
      early_exit: 'יציאה מוקדמת מהעסקה',
    },

    weekdaysShort: ['א\'', 'ב\'', 'ג\'', 'ד\'', 'ה\'', 'ו\'', 'ש\''],
    months: [
      'ינואר', 'פברואר', 'מרץ', 'אפריל', 'מאי', 'יוני',
      'יולי', 'אוגוסט', 'ספטמבר', 'אוקטובר', 'נובמבר', 'דצמבר'
    ],

    confirmClearTitle: 'האם אתה בטוח שברצונך לאפס?',
    confirmClearText: 'כל הנתונים שהזנת עבור החודש הנוכחי יימחקו לחלוטין. פעולה זו אינה ניתנת לביטול!',
    confirmCancel: 'ביטול',
    confirmApprove: 'כן, מחק הכל',
    toastSuccessClear: 'נתוני החודש אופסו בהצלחה!',
    toastSuccessSample: 'נתוני ההדגמה החודשיים הוזנו בהצלחה!',
    toastSuccessBackup: 'הנתונים יוצאו לקובץ גיבוי בהצלחה!',
    toastSuccessUpload: 'קובץ הגיבוי נטען וסונכרן בהצלחה!',
    toastErrorUpload: 'שגיאה בטעינת הקובץ. ודא כי מדובר בקובץ JSON תקין.',

    monetizationHeaderTitle: 'מרכז בקרה ומוניטיזציה',
    monetizationHeaderSub: 'סמלץ את מודל המנוי שלך בחנויות האפליקציות ($25 לחודש):',
    statusPremium: '👑 פרימיום פעיל',
    statusFree: '🔓 גרסה חינמית (חלק נעול)',
    btnToggleFree: 'העבר למצב חינמי',
    btnTogglePremium: 'הפעל מנוי פרימיום',
    btnAppStoreGuide: 'איך להעלות ל-App Store? 📱',

    paywallLockedTitle: 'האנליטיקה המתקדמת נעולה 🔒',
    paywallLockedDesc: 'מעקב פילוח אחוזים, גרפי תנודתיות, חלוקת סטיות משמעת וציון פסיכולוגי מנטלי זמינים רק לחברי פרימיום.',
    paywallUnlockBtn: '⚡ שחרר פרימיום ב-$25 לחודש',
    devBypassBtn: '(מפתחים: עקוף חסימה וסמלץ מנוי פעיל)',
    
    paywallFeaturesTitle: 'מה כלול בגרסת הפרימיום:',
    paywallFeature1Title: 'אנליטיקה וגרפים מתקדמים 📊',
    paywallFeature1Desc: 'פילוח רווחים מפורט, מדד סטיית משמעת, גרף הצטברות סיכון R וחלוקת סנטימנט.',
    paywallFeature2Title: 'לוח שנה מנטלי חצי-אישי 📅',
    paywallFeature2Desc: 'מעקב ויזואלי מהיר של הסטטיסטיקה היומית שלכם, הציון וההערות לאורך כל החודש.',
    paywallFeature3Title: 'גיבוי וסנכרון מלא (JSON) 💾',
    paywallFeature3Desc: 'ייצוא קבצי גיבוי של העסקאות וטעינתם בכל זמן מכל מכשיר לשליטה מוחלטת במידע שלכם.',
    paywallPriceSub: 'מנוי מתחדש אוטומטית',
    paywallPriceDetails: 'הורדה בחינם מהאפליקציה, ביטול מנוי קל ומהיר בכל עת דרך ה-App Store / Google Play',
    paywallBtnStart: '⚡ Subscribe Now ($25/month)',
    paywallConnecting: 'מתחבר ל-App Store ומאשר תשלום...',
    paywallSecuredText: 'רכישה מאובטחת. חיוב יחל רק לאחר אישור Apple ID או Google Account.',

    guideTitle: 'מדריך העלאת האפליקציה ל-App Store ומוניטיזציה 📱',
    guideSub: 'מדריך מעשי שלב-אחר-שלב להפיכת קוד ה-Vite שלך לאפליקציית iOS/Android עם מנוי $25',
    guideModelTitle: 'איך המודל העסקי עובד בפועל?',
    guideModelDesc: 'משתמשים מורידים את האפליקציה בחינם מה-App Store. הם יכולים למלא את טבלת העסקאות היומית הבסיסית שלהם, אך ברגע שהם מנסים לצפות בגרפי האנליטיקה, בלוח השנה הויזואלי, או לייצא/לייבא קבצים, האפליקציה מציגה להם את דף הרכישה (Paywall) המאובטח לרכישת מנוי חודשי ב- 25$ בחודש.',
    guideStep1Title: 'שלב 1: הפיכת קוד ה-Web לקוד נייטיב (iOS / Android)',
    guideStep1Desc: 'כדי להריץ את האפליקציה הזו כקוד טבעי (Native) על אייפון או אנדרואיד, אנו משתמשים בכלי הרשמי של חברת Ionic שנקרא Capacitor. הוא עוטף את ה-Vite App בתוך Web-View קל ומספק חיבור ישיר לחנויות האפליקציות.',
    guideStep2Title: 'שלב 2: פתיחת קוד נייטיב ב-Xcode וב-Android Studio',
    guideStep2Desc: 'לאחר ביצוע Build לקוד ה-React שלכם, Capacitor מסנכרן את קבצי ה-Build ישירות לפרויקט ה-Xcode (עבור iOS) או ה-Android Studio.',
    guideStep3Title: 'שלב 3: הגדרת מנויים ב-App Store Connect & RevenueCat',
    guideStep3Desc: 'כדי לחייב את המשתמשים ב-$25 לחודש, אנו מגדירים פריט מנוי מתחדש ב-App Store Connect וב-Google Play Console:',
    guideStep4Title: 'שלב 4: הגשת האפליקציה לבדיקה ואישור של Apple (App Review)',
    guideStep4Desc: 'לפני שתוכל להעלות את האפליקציה לציבור, Apple תבדוק אותה. הנה 3 טיפים חשובים כדי לעבור את הסינון שלהם בהצלחה:',
    guideAppStoreTips: '3 טיפים חשובים לעבור את בדיקת Apple:',
    guideEulaTitle: 'תנאי שימוש (EULA)',
    guideEulaDesc: 'חובה לכלול קישור לתנאי השימוש הסטנדרטיים ומדיניות הפרטיות שלכם במסך ה-Paywall.',
    guideValueTitle: 'תוכן ממשי למשתמשים',
    guideValueDesc: 'האפליקציה צריכה להציע ערך מוסף שימושי מעבר לאתר אינטרנט פשוט. היומן החודשי והאנליטיקה המנטלית הם דוגמה מצוינת לכך!',
    guideRestoreTitle: 'כפתור שחזור רכישות',
    guideRestoreDesc: 'Apple מחייבת שיהיה כפתור "Restore Purchases" בולט במסך הרכישה עבור משתמשים שהחליפו מכשיר.',
  },
  en: {
    appTitle: 'Mental Trading Journal & Performance',
    appSubtitle: 'Track self-discipline, mental psychology, and R-multiple profitability of your trading days',
    tableMode: 'Table View',
    calendarMode: 'Mental Calendar',
    showAnalytics: 'Show Analytics',
    hideAnalytics: 'Hide Analytics',
    clearMonth: 'Reset Month',
    loadSampleData: 'Load Sample Data',
    backupData: 'Export Backup',
    uploadData: 'Import Backup',
    selectYear: 'Select Year',
    selectMonth: 'Select Month',

    colDay: 'Day',
    colExecuted: 'Executed?',
    colMentalState: 'Mental State',
    colNoEntryReason: 'No Entry Reason',
    colDeviation: 'Rule Deviation',
    colConfidence: 'Confidence (1-5)',
    colRating: 'Rating (1-10)',
    colResultR: 'Result (R)',
    colNotes: 'Short Notes',
    colActions: 'Actions',

    executedY: 'Yes (Y)',
    executedN: 'No (N)',
    executedNone: 'Not Entered',

    mentalState: {
      calm: 'Calm',
      stressed: 'Stressed',
      tired: 'Tired',
      indifferent: 'Indifferent',
      revenge: 'Revenge Trade',
    },
    noEntryReason: {
      focus: 'Focus',
      rr: 'Risk-Reward',
      discipline: 'Discipline',
      fear: 'Fear of Missing Out',
      other: 'Other',
    },
    deviation: {
      none: 'No Deviation',
      early_entry: 'Early Entry',
      move_stop: 'Moved Stop',
      raise_risk: 'Increased Risk',
      early_exit: 'Early Exit',
    },
    deviationDesc: {
      none: 'Followed plan flawlessly',
      early_entry: 'Entered early before setup trigger',
      move_stop: 'Moved stop loss against trading plan',
      raise_risk: 'Increased position risk beyond maximum R limit',
      early_exit: 'Exited early out of anxiety',
    },

    weekdaysShort: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
    months: [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ],

    confirmClearTitle: 'Are you absolutely sure you want to reset?',
    confirmClearText: 'All entry logs for the selected month will be permanently deleted. This action cannot be undone!',
    confirmCancel: 'Cancel',
    confirmApprove: 'Yes, Delete All',
    toastSuccessClear: 'Month logs have been reset successfully!',
    toastSuccessSample: 'Monthly sample demo data loaded successfully!',
    toastSuccessBackup: 'Data exported to backup file successfully!',
    toastSuccessUpload: 'Backup file loaded and synchronized successfully!',
    toastErrorUpload: 'Error loading file. Please make sure it is a valid JSON backup file.',

    monetizationHeaderTitle: 'App Store Monetization Control Center',
    monetizationHeaderSub: 'Simulate your App Store subscription model ($25/month):',
    statusPremium: '👑 Premium Plan Active',
    statusFree: '🔓 Free Plan (Locked Features)',
    btnToggleFree: 'Switch to Free Mode',
    btnTogglePremium: 'Activate Premium Plan',
    btnAppStoreGuide: 'How to upload to App Store? 📱',

    paywallLockedTitle: 'Advanced Analytics is Locked 🔒',
    paywallLockedDesc: 'Performance percentage breakdowns, psychological metrics, rule discipline charts, and R-distribution are premium features.',
    paywallUnlockBtn: '⚡ Unlock Premium for $25/mo',
    devBypassBtn: '(Developers: Bypass lock & simulate active subscription)',

    paywallFeaturesTitle: 'What is included in Premium:',
    paywallFeature1Title: 'Advanced Analytics & Metrics 📊',
    paywallFeature1Desc: 'Detailed profit/loss ratios, emotional state correlation, and R-multiplier curves.',
    paywallFeature2Title: 'Visual Mental Calendar 📅',
    paywallFeature2Desc: 'Intuitive month view showcasing daily emotional stats and fast journaling metrics.',
    paywallFeature3Title: 'Secure Import/Export 💾',
    paywallFeature3Desc: 'Download entire backup files and load them anywhere to maintain absolute data control.',
    paywallPriceSub: 'Auto-Renewable Subscription',
    paywallPriceDetails: 'Free download, cancel easily anytime directly in App Store / Google Play account settings.',
    paywallBtnStart: '⚡ Subscribe Now ($25/month)',
    paywallConnecting: 'Connecting to App Store & authorizing...',
    paywallSecuredText: 'Secured purchase. Billing starts only after Apple ID or Google Play confirmation.',

    guideTitle: 'App Store Submission & Monetization Guide 📱',
    guideSub: 'Step-by-step framework to wrap your Vite project into a $25/mo iOS & Android App',
    guideModelTitle: 'How does the business model work?',
    guideModelDesc: 'Users download the app for free. They can record standard daily logs, but when accessing advanced charts, the mental calendar, or file import/export, the app prompts a conversion screen (Paywall) to purchase a $25/month subscription.',
    guideStep1Title: 'Step 1: Wrap the Web App to Native iOS/Android Code',
    guideStep1Desc: 'To run this app as a native application, we use Ionic Capacitor. It embeds the built Vite web files into a lightweight native container and bridges to app store payments.',
    guideStep2Title: 'Step 2: Open Native Files in Xcode & Android Studio',
    guideStep2Desc: 'After running Vite production build, Capacitor mirrors the files to the Xcode (for iOS) or Android Studio (for Android) project folders.',
    guideStep3Title: 'Step 3: Define Products in App Store Connect & RevenueCat',
    guideStep3Desc: 'Create an Auto-Renewable Subscription product in App Store Connect. We strongly recommend RevenueCat to simplify verification with a single code call.',
    guideStep4Title: 'Step 4: Prepare and Submit to App Store Review',
    guideStep4Desc: 'Apple reviews all apps. Follow these 3 critical compliance tips to avoid quick rejections:',
    guideAppStoreTips: '3 Essential tips to pass App Store review:',
    guideEulaTitle: 'Terms of Use (EULA)',
    guideEulaDesc: 'You must link standard Apple EULA and privacy policies clearly on the paywall screen.',
    guideValueTitle: 'Genuine Application Value',
    guideValueDesc: 'The app must offer rich native utility beyond a simple website wrap. Our journal and mental calendar are excellent examples.',
    guideRestoreTitle: 'Restore Purchases Button',
    guideRestoreDesc: 'Apple strictly requires a visible "Restore Purchases" button in the paywall for users upgrading devices.',
  },
  ar: {
    appTitle: 'دفتر تداول العقلية والأداء',
    appSubtitle: 'تتبع الانضباط الذاتي، علم النفس المالي، وربحية عوائد صفقاتك',
    tableMode: 'عرض الجدول',
    calendarMode: 'التقويم الذهني',
    showAnalytics: 'عرض التحليلات',
    hideAnalytics: 'إخفاء التحليلات',
    clearMonth: 'إعادة ضبط الشهر',
    loadSampleData: 'تحميل بيانات تجريبية',
    backupData: 'تصدير البيانات',
    uploadData: 'استيراد البيانات',
    selectYear: 'اختر السنة',
    selectMonth: 'اختر الشهر',

    colDay: 'اليوم',
    colExecuted: 'تم التنفيذ؟',
    colMentalState: 'الحالة الذهنية',
    colNoEntryReason: 'سبب عدم الدخول',
    colDeviation: 'الانحراف عن الخطة',
    colConfidence: 'الثقة (1-5)',
    colRating: 'التقييم (1-10)',
    colResultR: 'النتيجة (R)',
    colNotes: 'ملاحظات قصيرة',
    colActions: 'الإجراءات',

    executedY: 'نعم (Y)',
    executedN: 'لا (N)',
    executedNone: 'لم يتم الإدخال',

    mentalState: {
      calm: 'هادئ',
      stressed: 'متوتر',
      tired: 'متعب',
      indifferent: 'لامبالي',
      revenge: 'تداول انتقامي',
    },
    noEntryReason: {
      focus: 'التركيز',
      rr: 'معدل المخاطرة/العائد',
      discipline: 'الانضباط',
      fear: 'الخوف من الفوات',
      other: 'آخر',
    },
    deviation: {
      none: 'لا انحراف',
      early_entry: 'دخول مبكر',
      move_stop: 'تحريك الوقف',
      raise_risk: 'زيادة المخاطرة',
      early_exit: 'خروج مبكر',
    },
    deviationDesc: {
      none: 'اتباع الخطة تماماً',
      early_entry: 'الدخول مبكراً قبل تأكيد الاستراتيجية',
      move_stop: 'تحريك وقف الخسارة خلافاً للخطة',
      raise_risk: 'زيادة حجم المخاطرة عن الحد المسموح',
      early_exit: 'الخروج المبكر بدافع القلق والتوتر',
    },

    weekdaysShort: ['الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'],
    months: [
      'يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو',
      'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'
    ],

    confirmClearTitle: 'هل أنت متأكد من إعادة الضبط؟',
    confirmClearText: 'سيتم مسح جميع البيانات المدخلة للشهر الحالي نهائياً. لا يمكن التراجع عن هذا الإجراء!',
    confirmCancel: 'إلغاء',
    confirmApprove: 'نعم، احذف الكل',
    toastSuccessClear: 'تمت إعادة ضبط بيانات الشهر بنجاح!',
    toastSuccessSample: 'تم تحميل البيانات التجريبية بنجاح!',
    toastSuccessBackup: 'تم تصدير نسخة احتياطية من البيانات بنجاح!',
    toastSuccessUpload: 'تم استيراد ومزامنة البيانات بنجاح!',
    toastErrorUpload: 'خطأ في تحميل الملف. تأكد من أنه ملف JSON سليم للنسخ الاحتياطي.',

    monetizationHeaderTitle: 'مركز التحكم والربح لحساب المطور',
    monetizationHeaderSub: 'قم بمحاكاة نموذج الاشتراك الشهري لتطبيقات الجوال (25$ شهرياً):',
    statusPremium: '👑 حساب متميز نشط',
    statusFree: '🔓 النسخة المجانية (ميزات مقفلة)',
    btnToggleFree: 'التحويل إلى مجاني',
    btnTogglePremium: 'تفعيل الاشتراك المتميز',
    btnAppStoreGuide: 'كيف ترفع التطبيق لمتجر آبل؟ 📱',

    paywallLockedTitle: 'التحليلات المتقدمة مقفلة 🔒',
    paywallLockedDesc: 'إحصائيات الأرباح المتقدمة، نسب الانضباط، توزيع المخاطرة R، والتقييم النفسي متاحة فقط لمشتركي باقة بريميوم.',
    paywallUnlockBtn: '⚡ افتح باقة بريميوم بـ 25$ شهرياً',
    devBypassBtn: '(للمطورين: تخطي القفل ومحاكاة تفعيل الاشتراك)',

    paywallFeaturesTitle: 'ما تتضمنه الباقة المتميزة:',
    paywallFeature1Title: 'تحليلات ورسوم بيانية متقدمة 📊',
    paywallFeature1Desc: 'تفصيل العوائد والنتائج، الارتباط النفسي مع الصفقات، ومنحنى العوائد التراكمي R.',
    paywallFeature2Title: 'التقويم الذهني المرئي 📅',
    paywallFeature2Desc: 'واجهة شهرية سريعة وسهلة لمتابعة حالتك الذهنية وملاحظات التداول يومياً.',
    paywallFeature3Title: 'تصدير واستيراد البيانات 💾',
    paywallFeature3Desc: 'تصدير كامل بياناتك واستيرادها في أي وقت ومن أي جهاز للتحكم الكامل ببياناتك.',
    paywallPriceSub: 'اشتراك يتجدد تلقائياً',
    paywallPriceDetails: 'تحميل مجاني، يمكنك إلغاء الاشتراك بسهولة وفي أي وقت من إعدادات حسابك في متجر التطبيقات.',
    paywallBtnStart: '⚡ اشترك الآن (25$/شهرياً)',
    paywallConnecting: 'جاري الاتصال بمتجر التطبيقات وإتمام الدفع...',
    paywallSecuredText: 'عملية شراء آمنة. يبدأ الخصم فقط بعد تأكيد الهوية وحساب المتجر.',

    guideTitle: 'دليل النشر والربح في متجر التطبيقات 📱',
    guideSub: 'خطوات عملية لتحويل كود React الويب الخاص بك إلى تطبيق هاتف بمردود شهري',
    guideModelTitle: 'كيف يعمل نموذج الربح فعلياً؟',
    guideModelDesc: 'يقوم المستخدمون بتنزيل التطبيق مجاناً. يمكنهم استخدام الجدول اليومي الأساسي، ولكن عند محاولة فتح الرسوم البيانية المتطورة، أو التقويم النفسي، أو استيراد وتصدير الملفات، يعرض التطبيق شاشة شراء (Paywall) للاشتراك بمبلغ 25 دولاراً شهرياً.',
    guideStep1Title: 'الخطوة 1: تحويل كود الويب إلى كود أصلي للأجهزة الذكية',
    guideStep1Desc: 'لتشغيل هذا التطبيق كتطبيق أصلي على آيفون أو أندرويد، نستخدم أداة Capacitor الرسمية من شركة Ionic. تقوم بتغليف ملفات الويب داخل حاوية أصلية خفيفة.',
    guideStep2Title: 'الخطوة 2: فتح الملفات في Xcode و Android Studio',
    guideStep2Desc: 'بعد بناء كود الويب للإنتاج، تقوم أداة Capacitor بنسخها ومزامنتها مباشرة لمجلدات مشروع Xcode أو Android Studio.',
    guideStep3Title: 'الخطوة 3: تحديد المنتجات في المتجر وأداة RevenueCat',
    guideStep3Desc: 'قم بإنشاء منتج اشتراك دوري متجدد في حساب المطور الخاص بك. نوصي بشدة باستخدام RevenueCat لربط الاشتراكات برمجياً بسهولة متناهية.',
    guideStep4Title: 'الخطوة 4: مراجعة التطبيق وتأكيد متطلبات آبل',
    guideStep4Desc: 'تقوم آبل بمراجعة وفحص التطبيق. اتبع هذه النصائح الـ 3 لتفادي الرفض السريع:',
    guideAppStoreTips: '3 نصائح ضرورية لاجتياز مراجعة آبل بنجاح:',
    guideEulaTitle: 'اتفاقية الاستخدام (EULA)',
    guideEulaDesc: 'يجب توفير روابط واضحة لشروط الاستخدام ومדיניות الخصوصية داخل شاشة الدفع والاشتراك.',
    guideValueTitle: 'تقديم قيمة حقيقية وفائدة واضحة',
    guideValueDesc: 'يجب أن يقدم التطبيق فائدة عملية تبرر كونه تطبيقاً مستقلاً. دفتر التداول والتقويم النفسي هما أمثلة ممتازة.',
    guideRestoreTitle: 'زر استعادة المشتريات',
    guideRestoreDesc: 'تشترط آبل وجود زر واضح لاستعادة المشتريات لمن قاموا بتغيير هواتفهم أو إعادة تنزيل التطبيق.',
  },
  ru: {
    appTitle: 'Психологический Дневник Трейдинга',
    appSubtitle: 'Отслеживайте дисциплину, психологию и прибыльность ваших торговых дней в R-кратностях',
    tableMode: 'Вид Таблицы',
    calendarMode: 'Ментальный Календарь',
    showAnalytics: 'Показать Аналитику',
    hideAnalytics: 'Скрыть Аналитику',
    clearMonth: 'Сбросить Месяц',
    loadSampleData: 'Загрузить Демо',
    backupData: 'Экспорт Данных',
    uploadData: 'Импорт Данных',
    selectYear: 'Выбрать Год',
    selectMonth: 'Выбрать Месяц',

    colDay: 'День',
    colExecuted: 'Исполнено?',
    colMentalState: 'Ментальное Состояние',
    colNoEntryReason: 'Причина Бездействия',
    colDeviation: 'Нарушение Дисциплины',
    colConfidence: 'Уверенность (1-5)',
    colRating: 'Оценка Дня (1-10)',
    colResultR: 'Результат (R)',
    colNotes: 'Краткие Заметки',
    colActions: 'Действия',

    executedY: 'Да (Y)',
    executedN: 'Нет (N)',
    executedNone: 'Не введено',

    mentalState: {
      calm: 'Спокойствие',
      stressed: 'Стресс',
      tired: 'Усталость',
      indifferent: 'Безразличие',
      revenge: 'Тильт / Месть',
    },
    noEntryReason: {
      focus: 'Фокус',
      rr: 'Риск/Прибыль (R:R)',
      discipline: 'Дисциплина',
      fear: 'Страх упущенного (FOMO)',
      other: 'Другое',
    },
    deviation: {
      none: 'Без нарушений',
      early_entry: 'Ранний Вход',
      move_stop: 'Двигал Стоп',
      raise_risk: 'Завысил Риск',
      early_exit: 'Ранний Выход',
    },
    deviationDesc: {
      none: 'Полное соблюдение торгового плана',
      early_entry: 'Ранний вход в рынок до получения подтверждения',
      move_stop: 'Перемещение стоп-лосса вопреки стратегии',
      raise_risk: 'Завышение риска на сделку сверх установленного лимита R',
      early_exit: 'Преждевременный выход из сделки из-за беспокойства',
    },

    weekdaysShort: ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'],
    months: [
      'Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь',
      'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'
    ],

    confirmClearTitle: 'Вы уверены, что хотите сбросить данные?',
    confirmClearText: 'Все записи за текущий месяц будут удалены навсегда. Это действие нельзя отменить!',
    confirmCancel: 'Отмена',
    confirmApprove: 'Да, удалить всё',
    toastSuccessClear: 'Данные за месяц успешно очищены!',
    toastSuccessSample: 'Демонстрационные данные успешно загружены!',
    toastSuccessBackup: 'Данные успешно экспортированы в резервную копию!',
    toastSuccessUpload: 'Резервная копия успешно загружена и синхронизирована!',
    toastErrorUpload: 'Ошибка при чтении файла. Убедитесь, что это корректный файл JSON.',

    monetizationHeaderTitle: 'Панель Монетизации и Публикации',
    monetizationHeaderSub: 'Эмулируйте подписочную модель в App Store / Google Play ($25/мес):',
    statusPremium: '👑 Премиум Подписка Активна',
    statusFree: '🔓 Бесплатная Версия (Функции ограничены)',
    btnToggleFree: 'Переключить на Бесплатную',
    btnTogglePremium: 'Активировать Премиум',
    btnAppStoreGuide: 'Как загрузить в App Store? 📱',

    paywallLockedTitle: 'Продвинутая Аналитика Заблокирована 🔒',
    paywallLockedDesc: 'Распределение прибыльности, психологическая статистика корреляции, учет дисциплины и ментальный календарь доступны только по премиум-подписке.',
    paywallUnlockBtn: '⚡ Разблокировать Премиум за $25/мес',
    devBypassBtn: '(Разработчикам: Обойти блокировку и симулировать подписку)',

    paywallFeaturesTitle: 'Что входит в Премиум подписку:',
    paywallFeature1Title: 'Продвинутая Аналитика и Графики 📊',
    paywallFeature1Desc: 'Детальные соотношения прибылей, корреляция эмоций со сделками и кумулятивная кривая R-кратности.',
    paywallFeature2Title: 'Визуальный Ментальный Календарь 📅',
    paywallFeature2Desc: 'Интуитивный вид месяца с ежедневными оценками настроения и быстрой статистикой.',
    paywallFeature3Title: 'Полный Импорт/Экспорт 💾',
    paywallFeature3Desc: 'Выгружайте файлы бэкапа и загружайте их на любом устройстве для полного контроля над данными.',
    paywallPriceSub: 'Автопродлеваемая подписка',
    paywallPriceDetails: 'Скачивание бесплатно, отмена в любое время в настройках учетной записи App Store / Google Play.',
    paywallBtnStart: '⚡ Оформить Подписку ($25/месяц)',
    paywallConnecting: 'Подключение к App Store и авторизация платежа...',
    paywallSecuredText: 'Безопасная покупка. Списание начнется только после подтверждения Apple ID или Google Play.',

    guideTitle: 'Руководство по публикации в App Store 📱',
    guideSub: 'Пошаговый фреймворк по упаковке вашего веб-кода в приложение для iOS и Android',
    guideModelTitle: 'Как это работает на практике?',
    guideModelDesc: 'Пользователи скачивают приложение бесплатно. Они могут заполнять базовую таблицу сделок, но при попытке открыть аналитику, ментальный календарь или экспортировать бэкапы, приложение показывает экран оплаты (Paywall) за $25/месяц.',
    guideStep1Title: 'Шаг 1: Конвертация веб-кода в нативный код (iOS / Android)',
    guideStep1Desc: 'Чтобы запустить это приложение на iPhone или Android, мы используем Capacitor от Ionic. Он оборачивает код Vite в легковесный нативный контейнер и открывает доступ к системным API и платежам.',
    guideStep2Title: 'Шаг 2: Открытие проекта в Xcode & Android Studio',
    guideStep2Desc: 'После сборки веб-приложения, Capacitor синхронизирует билд-файлы напрямую в директории Xcode или Android Studio.',
    guideStep3Title: 'Шаг 3: Настройка подписок в App Store Connect & RevenueCat',
    guideStep3Desc: 'Создайте подписку в панели разработчика Apple. Мы крайне рекомендуем использовать RevenueCat для мгновенной интеграции без сложной серверной проверки квитанций.',
    guideStep4Title: 'Шаг 4: Подача приложения на проверку (App Review)',
    guideStep4Desc: 'Apple вручную проверяет все приложения. Соблюдайте эти 3 важнейших правила для прохождения ревью с первого раза:',
    guideAppStoreTips: '3 главных совета по прохождению проверки:',
    guideEulaTitle: 'Пользовательское Соглашение (EULA)',
    guideEulaDesc: 'Вы должны обязательно разместить ссылки на стандартные правила Apple EULA и Политику Конфиденциальности на экране оплаты.',
    guideValueTitle: 'Уникальная Ценность Приложения',
    guideValueDesc: 'Приложение должно нести реальную практическую пользу для пользователя. Торговый журнал и ментальный календарь подходят идеально.',
    guideRestoreTitle: 'Кнопка Восстановления Покупок',
    guideRestoreDesc: 'Apple строго требует наличия заметной кнопки «Restore Purchases» на экране оплаты для пользователей, сменивших устройство.',
  }
};
