import React, { useState, useEffect } from 'react';
import { 
  CreditCard, 
  UserCheck, 
  Crown, 
  Calendar, 
  ShieldCheck, 
  AlertTriangle, 
  CheckCircle2, 
  X, 
  ExternalLink, 
  FileText, 
  Sparkles, 
  RefreshCw,
  Mail,
  Shield,
  ArrowRight,
  ArrowLeft,
  Check,
  User,
  Edit3,
  Gift,
  Clock,
  Scale,
  RotateCcw
} from 'lucide-react';
import { LanguageCode } from '../utils/translations';
import { requestCancelSubscriptionAPI, CancelSubscriptionResponse } from '../utils/billingService';
import {
  ICOUNT_CHECKOUT_URL,
  PAYONEER_CHECKOUT_URL,
  detectGeoLocation,
  getCachedGeoLocation,
  detectIsraelHeuristic,
  GeoLocationState,
} from '../utils/geoIpService';

interface AccountBillingModalProps {
  isOpen: boolean;
  onClose: () => void;
  isPremium: boolean;
  onCancelSubscription: (info?: CancelSubscriptionResponse) => void;
  onReactivateSubscription: () => void;
  accountName?: string;
  onUpdateAccountName?: (name: string) => void;
  language: LanguageCode;
  onOpenLegalTerms?: (tab: 'terms' | 'cancellation') => void;
}

export const AccountBillingModal: React.FC<AccountBillingModalProps> = ({
  isOpen,
  onClose,
  isPremium,
  onCancelSubscription,
  onReactivateSubscription,
  accountName = '',
  onUpdateAccountName,
  language,
  onOpenLegalTerms,
}) => {
  const [showConfirmCancel, setShowConfirmCancel] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isEditingName, setIsEditingName] = useState(false);
  const [currentName, setCurrentName] = useState(accountName || '');

  // Legal terms acceptance state in billing modal
  const [hasAcceptedBillingTerms, setHasAcceptedBillingTerms] = useState<boolean>(() => {
    return localStorage.getItem('trading_tracker_accepted_terms') === 'true';
  });
  const [billingTermsShake, setBillingTermsShake] = useState(false);

  useEffect(() => {
    if (accountName) {
      setCurrentName(accountName);
    }
  }, [accountName]);

  const handleSaveName = () => {
    setIsEditingName(false);
    const trimmed = currentName.trim();
    if (trimmed && onUpdateAccountName) {
      onUpdateAccountName(trimmed);
    }
  };
  const [geoInfo, setGeoInfo] = useState<GeoLocationState>(() => {
    const cached = getCachedGeoLocation();
    if (cached) return cached;
    const isIL = detectIsraelHeuristic();
    return {
      isIsrael: isIL,
      countryCode: isIL ? 'IL' : 'US',
      providerName: isIL ? 'iCount' : 'Payoneer',
      checkoutUrl: isIL ? ICOUNT_CHECKOUT_URL : PAYONEER_CHECKOUT_URL,
      source: 'heuristic',
    };
  });

  useEffect(() => {
    if (!isOpen) return;
    detectGeoLocation().then(setGeoInfo);
  }, [isOpen]);

  const [cancellationRecord, setCancellationRecord] = useState<CancelSubscriptionResponse | null>(() => {
    try {
      const saved = localStorage.getItem('trading_tracker_cancellation_record');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  // Keep cancellationRecord in sync with local storage
  useEffect(() => {
    if (!isOpen) return;
    try {
      const saved = localStorage.getItem('trading_tracker_cancellation_record');
      setCancellationRecord(saved ? JSON.parse(saved) : null);
    } catch {
      // ignore
    }
  }, [isOpen, isPremium]);

  const isRtl = language === 'he' || language === 'ar';

  if (!isOpen) return null;

  // Localized texts
  const labels = {
    he: {
      modalTitle: 'ניהול מנוי והגדרות חשבון',
      modalSubtitle: 'פרטי החשבון המחובר, סטטוס מנוי ואפשרויות חיוב',
      userTitle: 'משתמש מחובר',
      userStatus: 'חשבון פעיל ומאומת',
      userRole: 'סוחר מקצועי (Pro Trader)',
      userId: 'מזהה משתמש:',
      tabSubscription: 'מנוי וחיובים',
      tabHistory: 'היסטוריית חיובים',
      statusTitle: 'סטטוס מנוי נוכחי:',
      activeBadge: 'מנוי פעיל (Active Pro)',
      freeBadge: 'תוכנית בסיסית (חינם)',
      cancelBadge: 'מנוי מבוטל — לא יחויב בחודש הבא',
      activeDesc: 'יש לך גישה מלאה לכל הכלים המנטליים והאנליטיים של הפלטפורמה.',
      freeDesc: 'החשבון שלך במצב חינמי. הכלים המתקדמים (אנליטיקה ולוח שנה) נעולים.',
      cancelledDesc: 'המנוי שלך בוטל בהצלחה מול ספק הסליקה. לא יבוצע חיוב נוסף של $25 במחזור הבא.',
      planPrice: '$25.00 לחודש',
      billingCycle: 'מחזור חיוב:',
      billingCycleVal: 'חודשי (חידוש אוטומטי)',
      nextBillingDate: 'תאריך החידוש הבא:',
      nextBillingDateVal: '11 באוקטובר 2026',
      paymentMethod: 'אמצעי תשלום:',
      paymentMethodVal: 'Apple Pay / Google Play (•••• 4242)',
      featuresTitle: 'תכונות הכלולות במנוי שלך:',
      feat1: 'אנליטיקה מתקדמת ופילוח סטיות R',
      feat2: 'לוח שנה מנטלי ומעקב ציון יומי',
      feat3: 'ייצוא וסנכרון גיבויים ללא הגבלה',
      feat4: 'גישה חופשית לכל העדכונים העתידיים',
      cancelSectionTitle: 'ביטול מנוי (Cancel Subscription)',
      cancelSectionDesc: 'ביטול המנוי ישלח בקשה ישירה ל-API של ספק הסליקה (Payoneer / Gateway). המנוי יבוטל מיידית ולא יחויב בחודש הבא.',
      btnCancelSub: 'בטל מנוי (Cancel Subscription)',
      btnReactivate: 'חדש והפעל מנוי ($25/חודש)',
      confirmTitle: 'האם אתה בטוח שברצונך לבטל את המנוי?',
      confirmDesc: 'פעולה זו תשלח בקשת ביטול רשמית ל-API של ספק הסליקה. המנוי יבוטל ולא יחויב בחודש הבא ($25).',
      confirmYes: 'כן, אשר ביטול מנוי',
      confirmNo: 'השאר את המנוי שלי פעיל',
      cancelingWithApi: 'שולח בקשת ביטול ל-API של ספק הסליקה...',
      cancelSuccessTitle: 'המנוי בוטל בהצלחה מול ספק הסליקה',
      cancelSuccessDesc: 'בקשת הביטול אושרה ב-API. המנוי שלך בוטל ולא תחויב בחודש הבא ($25). החיוב הקרוב בוטל במלואו.',
      confirmationRef: 'אסמכתת ביטול:',
      appStoreNotice: 'מנויים שנרכשו דרך Apple App Store או Google Play ניתנים לניהול וביטול גם ישירות בהגדרות ה-Apple ID או Google Account של המכשיר שלך.',
      historyTitle: 'קבלות וחיובים אחרונים',
      receiptDate1: '11 ספטמבר 2026',
      receiptDate2: '11 אוגוסט 2026',
      receiptStatusPaid: 'שולם',
      receiptInvoice: 'חשבונית מס קבלה',
      btnClose: 'סגור',
    },
    en: {
      modalTitle: 'Billing & Account Settings',
      modalSubtitle: 'Logged-in user profile, subscription status & billing controls',
      userTitle: 'Connected Account',
      userStatus: 'Active & Verified',
      userRole: 'Pro Trader Account',
      userId: 'Account ID:',
      tabSubscription: 'Subscription & Plan',
      tabHistory: 'Billing History',
      statusTitle: 'Current Subscription Status:',
      activeBadge: 'Active Pro Plan',
      freeBadge: 'Free Tier (Basic)',
      cancelBadge: 'Cancelled — Will Not Be Charged Next Month',
      activeDesc: 'You have full unlimited access to all advanced mental analytics and performance tools.',
      freeDesc: 'Your account is currently on the free tier. Advanced analytics and the mental calendar are locked.',
      cancelledDesc: 'Your subscription was successfully cancelled with the billing provider. No further $25 charge will occur next month.',
      planPrice: '$25.00 / month',
      billingCycle: 'Billing Cycle:',
      billingCycleVal: 'Monthly (Auto-Renewable)',
      nextBillingDate: 'Next Renewal Date:',
      nextBillingDateVal: 'October 11, 2026',
      paymentMethod: 'Payment Method:',
      paymentMethodVal: 'Apple Pay / Google Play (•••• 4242)',
      featuresTitle: 'Included in your plan:',
      feat1: 'Advanced R-distribution & psychological analytics',
      feat2: 'Interactive Mental Calendar with daily scoring',
      feat3: 'Unlimited JSON data export and cross-device sync',
      feat4: 'Free access to all upcoming platform updates',
      cancelSectionTitle: 'Cancel Subscription',
      cancelSectionDesc: 'Canceling will send a direct cancellation request to the payment provider API (Payoneer / Gateway). The subscription will be cancelled and will not be charged next month.',
      btnCancelSub: 'Cancel Subscription',
      btnReactivate: 'Reactivate Pro Subscription ($25/mo)',
      confirmTitle: 'Are you sure you want to cancel your subscription?',
      confirmDesc: 'This will dispatch an official cancellation request to the billing gateway API. Your subscription will be cancelled and will not be charged next month ($25).',
      confirmYes: 'Yes, Confirm Cancellation',
      confirmNo: 'Keep My Subscription',
      cancelingWithApi: 'Sending cancellation request to billing provider API...',
      cancelSuccessTitle: 'Subscription Cancelled with Provider',
      cancelSuccessDesc: 'Cancellation request confirmed via API. Your subscription has been cancelled and you will not be charged next month ($25). All future recurring charges are stopped.',
      confirmationRef: 'Confirmation Ref:',
      appStoreNotice: 'Subscriptions purchased through the Apple App Store or Google Play can also be managed directly in your Apple ID or Google Play device settings.',
      historyTitle: 'Recent Invoices & Receipts',
      receiptDate1: 'September 11, 2026',
      receiptDate2: 'August 11, 2026',
      receiptStatusPaid: 'Paid',
      receiptInvoice: 'Official Receipt',
      btnClose: 'Close',
    },
    ar: {
      modalTitle: 'إدارة الاشتراك وإعدادات الحساب',
      modalSubtitle: 'ملف المستخدم المسجل، حالة الاشتراك وإعدادات الفواتير',
      userTitle: 'الحساب المتصل',
      userStatus: 'نشط ومؤكد',
      userRole: 'حساب متداول محترف (Pro)',
      userId: 'معرّف الحساب:',
      tabSubscription: 'الاشتراك والفوترة',
      tabHistory: 'سجل المدفوعات',
      statusTitle: 'حالة الاشتراك الحالية:',
      activeBadge: 'اشتراك بريميوم نشط',
      freeBadge: 'الباقة المجانية (الأساسية)',
      cancelBadge: 'اشتراك ملغي — لن يتم الخصم في الشهر القادم',
      activeDesc: 'لديك وصول كامل لجميع أدوات التحليل النفسي وجداول الأداء المتقدمة.',
      freeDesc: 'أنت حالياً على الباقة المجانية. التحليلات المتقدمة والتقويم الذهني مقفلة.',
      cancelledDesc: 'تم إلغاء اشتراكك بنجاح مع مزود الدفع. لن يتم خصم الـ 25$ في الشهر القادم.',
      planPrice: '25.00$ / شهرياً',
      billingCycle: 'دورة الفوترة:',
      billingCycleVal: 'شهري (يتجدد تلقائياً)',
      nextBillingDate: 'تاريخ التجديد القادم:',
      nextBillingDateVal: '11 أكتوبر 2026',
      paymentMethod: 'طريقة الدفع:',
      paymentMethodVal: 'Apple Pay / Google Play (•••• 4242)',
      featuresTitle: 'الميزات المضمنة في باقتك:',
      feat1: 'تحليلات R المتقدمة ومعدلات الانضباط النفسي',
      feat2: 'التقويم الذهني التفاعلي والتقييم اليومي',
      feat3: 'تصدير واستيراد النسخ الاحتياطية بلا حدود',
      feat4: 'وصول مجاني لجميع التحديثات القادمة',
      cancelSectionTitle: 'إلغاء الاشتراك (Cancel Subscription)',
      cancelSectionDesc: 'إلغاء الاشتراك يرسل طلباً مباشراً إلى API مزود الدفع. سيتم إلغاء الاشتراك ولن يتم الخصم في الشهر القادم.',
      btnCancelSub: 'إلغاء الاشتراك (Cancel Subscription)',
      btnReactivate: 'إعادة تفعيل الاشتراك (25$/شهرياً)',
      confirmTitle: 'هل أنت متأكد من رغبتك في إلغاء الاشتراك؟',
      confirmDesc: 'سيؤدي هذا إلى إرسال طلب إلغاء فوري إلى API مزود الدفع. سيتم إلغاء الاشتراك ولن يتم الخصم في الشهر القادم (25$).',
      confirmYes: 'نعم، قم بإلغاء الاشتراك',
      confirmNo: 'إبقاء اشتراكي نشطاً',
      cancelingWithApi: 'جارٍ إرسال طلب الإلغاء إلى API مزود الدفع...',
      cancelSuccessTitle: 'تم إلغاء الاشتراك بنجاح لدى مزود الدفع',
      cancelSuccessDesc: 'تم تأكيد طلب الإلغاء عبر API. تم إلغاء اشتراكك ولن يتم خصم أي مبالغ في الشهر القادم (25$). توقفت جميع الرسوم التلقائية.',
      confirmationRef: 'رمز التأكيد:',
      appStoreNotice: 'الاشتراكات المشتراة عبر متجر App Store أو Google Play يمكن إدارتها أو إلغاؤها مباشرة من إعدادات الحساب بهاتفك.',
      historyTitle: 'الفواتير والإيصالات الأخيرة',
      receiptDate1: '11 سبتمبر 2026',
      receiptDate2: '11 أغسطس 2026',
      receiptStatusPaid: 'تم الدفع',
      receiptInvoice: 'فاتورة رسمية',
      btnClose: 'إغلاق',
    },
    ru: {
      modalTitle: 'Управление Подпиской и Аккаунтом',
      modalSubtitle: 'Профиль авторизованного пользователя, статус тарифа и биллинг',
      userTitle: 'Подключенный Аккаунт',
      userStatus: 'Активен и Подтвержден',
      userRole: 'Профессиональный Трейдер (Pro)',
      userId: 'ID Аккаунта:',
      tabSubscription: 'Подписка и Тариф',
      tabHistory: 'История Платежей',
      statusTitle: 'Текущий Статус Подписки:',
      activeBadge: 'Премиум Тариф Активен',
      freeBadge: 'Бесплатный Тариф',
      cancelBadge: 'Отменено — в след. месяце списаний не будет',
      activeDesc: 'У вас полный неограниченный доступ ко всем аналитическим графикам и ментальному календарю.',
      freeDesc: 'Вы используете бесплатный тариф. Продвинутая аналитика и ментальный календарь заблокированы.',
      cancelledDesc: 'Ваша подписка успешно отменена у платежного провайдера. Списаний $25 в следующем месяце не будет.',
      planPrice: '$25.00 / месяц',
      billingCycle: 'Период Оплаты:',
      billingCycleVal: 'Ежемесячно (Автопродление)',
      nextBillingDate: 'Следующее списание:',
      nextBillingDateVal: '11 октября 2026',
      paymentMethod: 'Способ Оплаты:',
      paymentMethodVal: 'Apple Pay / Google Play (•••• 4242)',
      featuresTitle: 'Включено в ваш тариф:',
      feat1: 'Продвинутая аналитика R-распределения и дисциплины',
      feat2: 'Интерактивный Ментальный Календарь с оценками',
      feat3: 'Неограниченный экспорт/импорт бэкапов в JSON',
      feat4: 'Бесплатный доступ ко всем обновлениям платформы',
      cancelSectionTitle: 'Отмена Подписки (Cancel Subscription)',
      cancelSectionDesc: 'Отмена отправляет прямой запрос в API платежного шлюза. Подписка отменится, списание в следующем месяце не произойдет.',
      btnCancelSub: 'Отменить Подписку (Cancel Subscription)',
      btnReactivate: 'Возобновить Подписку ($25/мес)',
      confirmTitle: 'Вы уверены, что хотите отменить подписку?',
      confirmDesc: 'Запрос на отмену будет отправлен напрямую в API платежного шлюза. Подписка будет отменена и не будет списана в следующем месяце ($25).',
      confirmYes: 'Да, подтвердить отмену',
      confirmNo: 'Оставить подписку активной',
      cancelingWithApi: 'Отправка запроса на отмену в API платежного шлюза...',
      cancelSuccessTitle: 'Подписка успешно отменена у платежного провайдера',
      cancelSuccessDesc: 'Запрос на отмену подтвержден через API. Подписка отменена и в следующем месяце списание $25 не произойдет. Все регулярные платежи остановлены.',
      confirmationRef: 'Код подтверждения:',
      appStoreNotice: 'Подписки, оформленные через App Store или Google Play, можно также отменить в настройках вашей учетной записи на телефоне.',
      historyTitle: 'История Счетов и Квитанций',
      receiptDate1: '11 сентября 2026',
      receiptDate2: '11 августа 2026',
      receiptStatusPaid: 'Оплачено',
      receiptInvoice: 'Квитанция об оплате',
      btnClose: 'Закрыть',
    }
  };

  const l = labels[language] || labels.en;

  const handleConfirmCancel = async () => {
    setIsProcessing(true);
    try {
      // Send real cancellation request to billing provider API
      const result = await requestCancelSubscriptionAPI({
        email: accountName || 'subscriber@trading-tracker.pro',
        subscriptionId: 'STJ-44354-PRO',
        reason: 'User requested cancellation in Billing & Account Settings modal',
      });
      setCancellationRecord(result);
      localStorage.setItem('trading_tracker_cancellation_record', JSON.stringify(result));
      onCancelSubscription(result);
    } catch {
      onCancelSubscription();
    } finally {
      setIsProcessing(false);
      setShowConfirmCancel(false);
    }
  };

  const handleReactivate = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setCancellationRecord(null);
      localStorage.removeItem('trading_tracker_cancellation_record');
      onReactivateSubscription();
      setIsProcessing(false);
    }, 400);
  };

  return (
    <div className="fixed inset-0 z-55 flex flex-col items-center justify-start sm:justify-center p-2.5 sm:p-4 bg-slate-950/80 backdrop-blur-md select-none overflow-y-auto overscroll-none pt-[max(0.75rem,env(safe-area-inset-top))] pb-[max(0.75rem,env(safe-area-inset-bottom))]">
      <div 
        className="bg-white rounded-3xl border border-slate-200 max-w-xl w-full shadow-2xl overflow-hidden flex flex-col max-h-[calc(100dvh-2rem)] sm:max-h-[90vh] min-h-0 shrink-0 my-auto transition-all"
        dir={isRtl ? 'rtl' : 'ltr'}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-900 via-slate-950 to-indigo-950 text-white p-4 sm:p-6 relative border-b border-indigo-500/20 shrink-0">
          <div className="absolute top-3.5 end-3.5 sm:top-4.5 sm:end-4.5">
            <button 
              onClick={onClose}
              className="w-9 h-9 sm:w-8 sm:h-8 rounded-full bg-slate-800/90 hover:bg-slate-700 text-slate-300 hover:text-white flex items-center justify-center transition-colors cursor-pointer text-base sm:text-sm font-bold active:scale-95 shadow-xs"
              aria-label="Close"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="flex items-center gap-3 pe-10">
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-indigo-600 flex items-center justify-center text-white shadow-lg shadow-indigo-600/30 shrink-0">
              <CreditCard className="w-5 h-5 text-indigo-100" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-black text-white">{l.modalTitle}</h2>
              <p className="text-slate-400 text-[11px] sm:text-xs mt-0.5">{l.modalSubtitle}</p>
            </div>
          </div>
        </div>

        {/* Body Content */}
        <div 
          className="p-4 sm:p-6 pb-10 space-y-4 sm:space-y-5 flex-1 min-h-0 overflow-y-auto overscroll-contain touch-pan-y bg-slate-50/50"
          style={{ WebkitOverflowScrolling: 'touch' }}
        >
          
          {/* User Profile Card - Shown conditionally: Free vs. Active Pro Account Name */}
          <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-black text-sm shadow-sm shrink-0 ${
                isPremium 
                  ? 'bg-gradient-to-br from-indigo-500 to-indigo-700 text-white' 
                  : 'bg-slate-100 text-slate-500 border border-slate-200'
              }`}>
                {isPremium ? (
                  <Crown className="w-5 h-5 text-amber-300" />
                ) : (
                  <User className="w-5 h-5 text-slate-500" />
                )}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  {isPremium ? (
                    isEditingName ? (
                      <div className="flex items-center gap-1">
                        <input
                          type="text"
                          value={currentName}
                          onChange={(e) => setCurrentName(e.target.value)}
                          onKeyDown={(e) => e.key === 'Enter' && handleSaveName()}
                          className="text-xs font-black text-slate-900 border border-indigo-300 rounded-lg px-2 py-0.5 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                          autoFocus
                        />
                        <button
                          type="button"
                          onClick={handleSaveName}
                          className="p-1 text-emerald-600 hover:text-emerald-700 cursor-pointer"
                        >
                          <Check className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-black text-slate-900">
                          {accountName || (language === 'he' ? 'סוחר Pro' : 'Pro Trader')}
                        </span>
                        <button
                          type="button"
                          onClick={() => setIsEditingName(true)}
                          className="text-slate-400 hover:text-indigo-600 cursor-pointer p-0.5"
                          title={language === 'he' ? 'ערוך שם חשבון' : 'Edit Account Name'}
                        >
                          <Edit3 className="w-3 h-3" />
                        </button>
                      </div>
                    )
                  ) : (
                    <span className="text-xs font-bold text-slate-700">
                      {language === 'he' ? 'תוכנית חינמית (אורח)' : 'Free Tier (Guest)'}
                    </span>
                  )}

                  {isPremium ? (
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200/60 px-2 py-0.5 rounded-full">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      {l.userStatus}
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-700 bg-amber-50 border border-amber-200/60 px-2 py-0.5 rounded-full">
                      {language === 'he' ? 'גישה בסיסית' : 'Basic Tier'}
                    </span>
                  )}
                </div>

                <div className="text-[11px] text-slate-500 flex items-center gap-2 mt-0.5">
                  <span className="font-semibold text-indigo-600">
                    {isPremium ? l.userRole : (language === 'he' ? 'שם החשבון יופעל לאחר רכישת מנוי' : 'Account name appears after subscribing')}
                  </span>
                  {isPremium && (
                    <>
                      <span>•</span>
                      <span className="font-mono text-slate-400 text-[10px]">STJ-44354-PRO</span>
                    </>
                  )}
                </div>
              </div>
            </div>

            <div className="self-end sm:self-center">
              {isPremium ? (
                <span className="text-[10px] bg-indigo-50 text-indigo-700 font-extrabold px-2.5 py-1 rounded-lg border border-indigo-200 flex items-center gap-1">
                  <Crown className="w-3 h-3 text-amber-500" />
                  <span>PRO MEMBER</span>
                </span>
              ) : (
                <span className="text-[10px] bg-slate-100 text-slate-500 font-bold px-2.5 py-1 rounded-lg border border-slate-200">
                  {language === 'he' ? 'ללא מנוי' : 'FREE PLAN'}
                </span>
              )}
            </div>
          </div>

          {/* Cancellation Confirmation Notice Banner (Shown after API cancellation) */}
          {cancellationRecord && !isPremium && (
            <div className="bg-emerald-50 border border-emerald-300/80 rounded-2xl p-4 sm:p-5 shadow-xs space-y-2 animate-in fade-in slide-in-from-top-2">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                </div>
                <div className="flex-1">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <h4 className="text-xs font-black text-emerald-950 uppercase tracking-wide">
                      {l.cancelSuccessTitle}
                    </h4>
                    <span className="font-mono text-[10px] font-bold text-emerald-800 bg-emerald-100/70 border border-emerald-300 px-2 py-0.5 rounded-md">
                      {l.confirmationRef} {cancellationRecord.confirmationCode}
                    </span>
                  </div>
                  <p className="text-emerald-900/90 text-xs leading-relaxed font-semibold mt-1">
                    {l.cancelSuccessDesc}
                  </p>
                  <div className="pt-2 flex flex-wrap items-center gap-2.5 text-[11px] text-emerald-700 font-medium">
                    <span className="flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" />
                      {cancellationRecord.provider}
                    </span>
                    <span>•</span>
                    <span className="text-emerald-800 font-bold">
                      {language === 'he' ? 'סטטוס חיוב עתידי: 0$ (בוטל — ללא חיוב בחודש הבא)' : 'Future Billing: $0 (Cancelled — No charge next month)'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Current Subscription Status Card */}
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
            <div className="p-4 sm:p-5 border-b border-slate-100 bg-gradient-to-br from-white to-slate-50">
              <div className="flex items-center justify-between gap-2 flex-wrap mb-3">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                  {l.statusTitle}
                </span>

                {isPremium ? (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-extrabold bg-emerald-500/10 text-emerald-700 border border-emerald-500/20 shadow-xs">
                    <Crown className="w-3.5 h-3.5 text-amber-500" />
                    <span>{l.activeBadge}</span>
                  </span>
                ) : cancellationRecord ? (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-extrabold bg-amber-50 text-amber-800 border border-amber-300 shadow-xs">
                    <AlertTriangle className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                    <span>{l.cancelBadge}</span>
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-slate-200/70 text-slate-700 border border-slate-300">
                    <Shield className="w-3.5 h-3.5 text-slate-500" />
                    <span>{l.freeBadge}</span>
                  </span>
                )}
              </div>

              <div className="flex items-baseline gap-2 mb-2">
                <span className="text-2xl sm:text-3xl font-black text-slate-950">
                  {isPremium ? l.planPrice : '$0.00'}
                </span>
                <span className="text-xs font-medium text-slate-500">
                  {isPremium ? (language === 'he' ? 'חודשי' : 'monthly') : (language === 'he' ? 'חינם (בוטל)' : 'free tier (cancelled)')}
                </span>
              </div>

              <p className="text-xs text-slate-600 leading-relaxed">
                {isPremium ? l.activeDesc : cancellationRecord ? l.cancelledDesc : l.freeDesc}
              </p>
            </div>

            {/* Plan Details Grid */}
            <div className="p-4 sm:p-5 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs bg-white">
              <div className="p-3 bg-slate-50/70 rounded-xl border border-slate-100">
                <div className="text-slate-400 text-[10px] font-bold uppercase tracking-wider">{l.billingCycle}</div>
                <div className="font-bold text-slate-800 mt-0.5">
                  {isPremium ? l.billingCycleVal : (language === 'he' ? 'ללא חיוב (בוטל)' : 'None (Cancelled)')}
                </div>
              </div>

              <div className="p-3 bg-slate-50/70 rounded-xl border border-slate-100">
                <div className="text-slate-400 text-[10px] font-bold uppercase tracking-wider">{l.nextBillingDate}</div>
                <div className="font-bold text-slate-800 mt-0.5">
                  {isPremium ? (
                    l.nextBillingDateVal
                  ) : cancellationRecord ? (
                    <div className="flex flex-col sm:flex-row sm:items-center gap-1">
                      <span className="line-through text-slate-400 font-medium">11 באוקטובר 2026</span>
                      <span className="text-rose-600 font-extrabold text-[11px]">
                        ({language === 'he' ? 'בוטל מול ספק הסליקה — 0$' : 'Cancelled with API — $0'})
                      </span>
                    </div>
                  ) : (
                    (language === 'he' ? 'אין חידוש מתוכנן' : 'No renewal pending')
                  )}
                </div>
              </div>

              <div className="p-3 bg-slate-50/70 rounded-xl border border-slate-100 sm:col-span-2">
                <div className="text-slate-400 text-[10px] font-bold uppercase tracking-wider">{l.paymentMethod}</div>
                <div className="font-bold text-slate-800 mt-0.5 flex flex-wrap items-center justify-between gap-1.5">
                  <span>
                    {isPremium 
                      ? l.paymentMethodVal 
                      : cancellationRecord 
                        ? (language === 'he' ? 'בוטל מול ספק הסליקה (לא יחויב בחודש הבא)' : 'Cancelled via payment gateway (No next charge)')
                        : (language === 'he' ? 'אין אמצעי תשלום פעיל' : 'No active payment method')}
                  </span>
                  {isPremium && (
                    <span className="text-[10px] font-extrabold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-100">
                      Apple Pay / Google Play
                    </span>
                  )}
                  {cancellationRecord && !isPremium && (
                    <span className="text-[10px] font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded border border-rose-200">
                      {language === 'he' ? 'סליקה הופסקה' : 'Billing Halted'}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Features list */}
            <div className="px-4 sm:px-5 pb-4 pt-1 bg-white border-t border-slate-100">
              <div className="text-[11px] font-extrabold text-slate-900 mb-2.5 uppercase tracking-wider">
                {l.featuresTitle}
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-700">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>{l.feat1}</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>{l.feat2}</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>{l.feat3}</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>{l.feat4}</span>
                </div>
              </div>
            </div>

            {/* 7-Day Free Trial Policy Reminder */}
            <div className="px-4 sm:px-5 py-3 bg-emerald-50/70 border-t border-emerald-100 flex items-start gap-2.5 text-[11px] text-emerald-900">
              <Gift className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <div className="leading-relaxed">
                <span className="font-extrabold">
                  {language === 'he' ? 'מדיניות 7 ימי ניסיון חינם:' : '7-Day Free Trial Policy:'}{' '}
                </span>
                <span className="text-emerald-800">
                  {language === 'he'
                    ? 'כל מנוי חדש מתחיל ב-7 ימי ניסיון ללא חיוב ($0.00). החיוב החודשי ($25) מתבצע אוטומטית רק בסיום תקופת הניסיון, אלא אם המנוי מבוטל לפני כן. ניתן לבטל בכל עת בקליק אחד.'
                    : 'Every new subscription starts with a 7-day trial ($0.00). Monthly billing ($25) begins automatically after the 7-day trial ends unless cancelled beforehand. You can cancel anytime in 1 click.'}
                </span>
              </div>
            </div>
          </div>

          {/* Action Area: Cancel Subscription or Reactivate */}
          {isPremium ? (
            <div className="bg-rose-50/60 border border-rose-200/80 rounded-2xl p-4 sm:p-5 space-y-3">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-xl bg-rose-100 text-rose-700 flex items-center justify-center shrink-0 mt-0.5">
                  <AlertTriangle className="w-4 h-4" />
                </div>
                <div className="flex-1">
                  <h4 className="text-xs font-black text-rose-950 uppercase tracking-wide">
                    {l.cancelSectionTitle}
                  </h4>
                  <p className="text-rose-800/80 text-[11px] leading-relaxed mt-0.5">
                    {l.cancelSectionDesc}
                  </p>
                </div>
              </div>

              {!showConfirmCancel ? (
                <button
                  type="button"
                  onClick={() => setShowConfirmCancel(true)}
                  className="w-full sm:w-auto px-4 py-2.5 bg-white hover:bg-rose-50 text-rose-700 hover:text-rose-800 font-extrabold text-xs rounded-xl border border-rose-300 transition-all shadow-xs flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <X className="w-4 h-4" />
                  <span>{l.btnCancelSub}</span>
                </button>
              ) : (
                <div className="p-4 bg-white rounded-xl border border-rose-300 shadow-sm space-y-3 animate-in fade-in zoom-in-95">
                  <div className="text-xs font-extrabold text-slate-950">
                    {l.confirmTitle}
                  </div>
                  <p className="text-slate-600 text-[11px] leading-relaxed">
                    {l.confirmDesc}
                  </p>

                  <div className="flex flex-col sm:flex-row items-center gap-2 pt-1">
                    <button
                      type="button"
                      disabled={isProcessing}
                      onClick={handleConfirmCancel}
                      className="w-full sm:w-auto px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white font-extrabold text-xs rounded-xl transition-all shadow-xs cursor-pointer flex items-center justify-center gap-1.5 disabled:opacity-50"
                    >
                      {isProcessing ? (
                        <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      ) : (
                        <CheckCircle2 className="w-3.5 h-3.5" />
                      )}
                      <span>{isProcessing ? l.cancelingWithApi : l.confirmYes}</span>
                    </button>

                    <button
                      type="button"
                      disabled={isProcessing}
                      onClick={() => setShowConfirmCancel(false)}
                      className="w-full sm:w-auto px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-all cursor-pointer"
                    >
                      <span>{l.confirmNo}</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="bg-indigo-50/70 border border-indigo-200/80 rounded-2xl p-4 sm:p-5 space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h4 className="text-xs font-black text-indigo-950">
                    {language === 'he' ? 'רוצה להחזיר את כל הפיצ׳רים?' : 'Ready to restore full Pro access?'}
                  </h4>
                  <p className="text-indigo-800/80 text-[11px] mt-0.5">
                    {language === 'he' ? 'הפעל מחדש את המנוי ב-$25 לחודש וקבל גישה מיידית ללוח השנה ולאנליטיקה.' : 'Reactivate your $25/mo plan to instantly unlock the mental calendar & analytics.'}
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-2 shrink-0">
                  <a
                    href={hasAcceptedBillingTerms ? geoInfo.checkoutUrl : undefined}
                    target={hasAcceptedBillingTerms ? "_blank" : undefined}
                    rel={hasAcceptedBillingTerms ? "noopener noreferrer" : undefined}
                    onClick={(e) => {
                      if (!hasAcceptedBillingTerms) {
                        e.preventDefault();
                        setBillingTermsShake(true);
                        setTimeout(() => setBillingTermsShake(false), 800);
                        return;
                      }
                    }}
                    className={`w-full sm:w-auto px-4 py-2.5 font-extrabold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-1.5 shrink-0 group ${
                      hasAcceptedBillingTerms
                        ? 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-600/20 cursor-pointer'
                        : 'bg-slate-200 text-slate-400 border border-slate-300 cursor-not-allowed shadow-none'
                    }`}
                  >
                    <Crown className={`w-4 h-4 ${hasAcceptedBillingTerms ? 'text-amber-300' : 'text-slate-400'}`} />
                    <span>Subscribe Now ($25/month)</span>
                    <ExternalLink className="w-3.5 h-3.5 text-indigo-200 group-hover:text-white" />
                  </a>

                  <button
                    type="button"
                    disabled={isProcessing}
                    onClick={handleReactivate}
                    className="text-[10px] text-slate-500 hover:text-indigo-600 font-bold underline cursor-pointer py-1 px-2"
                    title="Test Reactivation"
                  >
                    {language === 'he' ? 'שחזור מהיר (בדיקה)' : 'Quick Test Restore'}
                  </button>
                </div>
              </div>

              {/* Checkbox and Terms Links directly under Subscribe in Billing Modal */}
              <div 
                className={`p-2.5 rounded-xl border text-start transition-all ${
                  billingTermsShake 
                    ? 'ring-2 ring-rose-500 bg-rose-50/80 border-rose-300 animate-shake' 
                    : hasAcceptedBillingTerms 
                    ? 'bg-white/90 border-emerald-300' 
                    : 'bg-white/80 border-indigo-100'
                }`}
              >
                <label className="flex items-start gap-2 cursor-pointer select-none text-[11px] text-slate-700">
                  <input
                    type="checkbox"
                    checked={hasAcceptedBillingTerms}
                    onChange={(e) => {
                      setHasAcceptedBillingTerms(e.target.checked);
                      localStorage.setItem('trading_tracker_accepted_terms', e.target.checked ? 'true' : 'false');
                    }}
                    className="mt-0.5 w-4 h-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer shrink-0"
                  />
                  <div>
                    <span className="font-semibold">
                      {language === 'he' ? 'קראתי ואישרתי את ' : 'I agree to the '}
                    </span>
                    <button
                      type="button"
                      onClick={() => onOpenLegalTerms?.('terms')}
                      className="font-bold text-indigo-600 hover:underline cursor-pointer inline-flex items-center gap-0.5"
                    >
                      <Scale className="w-3 h-3 text-indigo-600 inline" />
                      <span>{language === 'he' ? 'התקנון ותנאי השימוש' : 'Terms of Service'}</span>
                    </button>
                    <span className="font-semibold">{language === 'he' ? ' ואת ' : ' and '}</span>
                    <button
                      type="button"
                      onClick={() => onOpenLegalTerms?.('cancellation')}
                      className="font-bold text-rose-600 hover:underline cursor-pointer inline-flex items-center gap-0.5"
                    >
                      <RotateCcw className="w-3 h-3 text-rose-600 inline" />
                      <span>{language === 'he' ? 'מדיניות ביטול העסקה (חוק הגנת הצרכן)' : 'Cancellation Policy'}</span>
                    </button>
                  </div>
                </label>
              </div>
            </div>
          )}

          {/* App Store / Play Store Notice Banner */}
          <div className="p-3.5 bg-slate-100/80 rounded-xl border border-slate-200/70 flex items-start gap-2.5 text-[11px] text-slate-600 leading-relaxed">
            <ShieldCheck className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" />
            <span>{l.appStoreNotice}</span>
          </div>

          {/* Billing History Section */}
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-4 space-y-2.5">
            <div className="text-xs font-black text-slate-900 flex items-center gap-2">
              <FileText className="w-4 h-4 text-indigo-600" />
              <span>{l.historyTitle}</span>
            </div>

            <div className="divide-y divide-slate-100 text-xs">
              {cancellationRecord && (
                <div className="py-2.5 flex items-center justify-between bg-amber-50/60 -mx-2 px-2 rounded-xl">
                  <div>
                    <div className="font-bold text-slate-800 flex flex-wrap items-center gap-1.5">
                      <span>{language === 'he' ? 'ביטול מנוי מאושר (Payoneer API)' : 'Confirmed Cancellation (Payoneer API)'}</span>
                      <span className="text-[10px] font-mono text-slate-500 font-semibold bg-white border border-slate-200 px-1.5 py-0.5 rounded">
                        #{cancellationRecord.confirmationCode}
                      </span>
                    </div>
                    <div className="text-[10px] text-slate-500 mt-0.5">
                      {new Date(cancellationRecord.cancelledAt).toLocaleDateString(language === 'he' ? 'he-IL' : 'en-US', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric',
                      })} • {language === 'he' ? 'לא יחויב בחודש הבא' : 'No future charge next month'}
                    </div>
                  </div>
                  <div className="text-end">
                    <div className="font-mono font-bold text-slate-600">$0.00</div>
                    <span className="inline-block text-[10px] font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded border border-rose-200">
                      {language === 'he' ? 'בוטל (ללא חיוב)' : 'Cancelled (No Charge)'}
                    </span>
                  </div>
                </div>
              )}

              <div className="py-2.5 flex items-center justify-between">
                <div>
                  <div className="font-bold text-slate-800">{l.receiptInvoice} #STJ-2026-09</div>
                  <div className="text-[10px] text-slate-400">{l.receiptDate1}</div>
                </div>
                <div className="text-end">
                  <div className="font-mono font-bold text-slate-900">$25.00</div>
                  <span className="inline-block text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200/50">
                    {l.receiptStatusPaid}
                  </span>
                </div>
              </div>

              <div className="py-2.5 flex items-center justify-between">
                <div>
                  <div className="font-bold text-slate-800">{l.receiptInvoice} #STJ-2026-08</div>
                  <div className="text-[10px] text-slate-400">{l.receiptDate2}</div>
                </div>
                <div className="text-end">
                  <div className="font-mono font-bold text-slate-900">$25.00</div>
                  <span className="inline-block text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200/50">
                    {l.receiptStatusPaid}
                  </span>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-200 bg-white flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-3 text-[11px] text-slate-500">
            <div className="flex items-center gap-1 font-medium text-slate-400">
              <Shield className="w-3.5 h-3.5 text-slate-400" />
              <span>Secure 256-Bit SSL</span>
            </div>
            
            <span className="text-slate-300">•</span>

            <button
              type="button"
              onClick={() => onOpenLegalTerms?.('terms')}
              className="text-slate-500 hover:text-indigo-600 font-medium underline cursor-pointer"
            >
              {language === 'he' ? 'תקנון ותנאי שימוש' : 'Terms'}
            </button>

            <span className="text-slate-300">•</span>

            <button
              type="button"
              onClick={() => onOpenLegalTerms?.('cancellation')}
              className="text-slate-500 hover:text-rose-600 font-medium underline cursor-pointer"
            >
              {language === 'he' ? 'מדיניות ביטול עסקה (חוק הגנת הצרכן)' : 'Cancellation Policy'}
            </button>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-full sm:w-auto px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl transition-all cursor-pointer shadow-xs"
          >
            {l.btnClose}
          </button>
        </div>

      </div>
    </div>
  );
};
