import React, { useState } from 'react';
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
  ArrowLeft
} from 'lucide-react';
import { LanguageCode } from '../utils/translations';

interface AccountBillingModalProps {
  isOpen: boolean;
  onClose: () => void;
  isPremium: boolean;
  onCancelSubscription: () => void;
  onReactivateSubscription: () => void;
  userEmail?: string;
  language: LanguageCode;
}

export const AccountBillingModal: React.FC<AccountBillingModalProps> = ({
  isOpen,
  onClose,
  isPremium,
  onCancelSubscription,
  onReactivateSubscription,
  userEmail = 'oren71601@gmail.com',
  language,
}) => {
  const [showConfirmCancel, setShowConfirmCancel] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
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
      activeDesc: 'יש לך גישה מלאה לכל הכלים המנטליים והאנליטיים של הפלטפורמה.',
      freeDesc: 'החשבון שלך במצב חינמי. הכלים המתקדמים (אנליטיקה ולוח שנה) נעולים.',
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
      cancelSectionDesc: 'תוכל לבטל את המנוי בכל עת. לאחר הביטול, המנוי לא יחודש במחזור הבא והחשבון יחזור למצב חינמי.',
      btnCancelSub: 'בטל מנוי (Cancel Subscription)',
      btnReactivate: 'חדש והפעל מנוי ($25/חודש)',
      confirmTitle: 'האם אתה בטוח שברצונך לבטל את המנוי?',
      confirmDesc: 'ביטול המנוי יפסיק את החיוב החודשי של $25, אך תאבד גישה לגרפי האנליטיקה וללוח השנה המנטלי.',
      confirmYes: 'כן, אשר ביטול מנוי',
      confirmNo: 'השאר את המנוי שלי פעיל',
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
      activeDesc: 'You have full unlimited access to all advanced mental analytics and performance tools.',
      freeDesc: 'Your account is currently on the free tier. Advanced analytics and the mental calendar are locked.',
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
      cancelSectionDesc: 'You can cancel anytime. Canceling prevents future $25 charges and reverts your account to the Free tier.',
      btnCancelSub: 'Cancel Subscription',
      btnReactivate: 'Reactivate Pro Subscription ($25/mo)',
      confirmTitle: 'Are you sure you want to cancel your subscription?',
      confirmDesc: 'Canceling will stop your $25 monthly billing. You will lose access to advanced analytics and the mental calendar.',
      confirmYes: 'Yes, Confirm Cancellation',
      confirmNo: 'Keep My Subscription',
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
      activeDesc: 'لديك وصول كامل لجميع أدوات التحليل النفسي وجداول الأداء المتقدمة.',
      freeDesc: 'أنت حالياً على الباقة المجانية. التحليلات المتقدمة والتقويم الذهني مقفلة.',
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
      cancelSectionDesc: 'يمكنك إلغاء الاشتراك في أي وقت. الإلغاء يوقف الخصم الشهري 25$ ويعيد الحساب للباقة المجانية.',
      btnCancelSub: 'إلغاء الاشتراك (Cancel Subscription)',
      btnReactivate: 'إعادة تفعيل الاشتراك (25$/شهرياً)',
      confirmTitle: 'هل أنت متأكد من رغبتك في إلغاء الاشتراك؟',
      confirmDesc: 'سيؤدي الإلغاء إلى وقف الخصم الشهري وفقدان الوصول للرسوم البيانية المتقدمة والتقويم الذهني.',
      confirmYes: 'نعم، قم بإلغاء الاشتراك',
      confirmNo: 'إبقاء اشتراكي نشطاً',
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
      activeDesc: 'У вас полный неограниченный доступ ко всем аналитическим графикам и ментальному календарю.',
      freeDesc: 'Вы используете бесплатный тариф. Продвинутая аналитика и ментальный календарь заблокированы.',
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
      cancelSectionDesc: 'Вы можете отменить подписку в любое время. Списание $25 прекратится, аккаунт перейдет на бесплатный тариф.',
      btnCancelSub: 'Отменить Подписку (Cancel Subscription)',
      btnReactivate: 'Возобновить Подписку ($25/мес)',
      confirmTitle: 'Вы уверены, что хотите отменить подписку?',
      confirmDesc: 'Отмена остановит ежемесячные списания $25. Вы потеряете доступ к ментальному календарю и расширенной аналитике.',
      confirmYes: 'Да, подтвердить отмену',
      confirmNo: 'Оставить подписку активной',
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

  const handleConfirmCancel = () => {
    setIsProcessing(true);
    setTimeout(() => {
      onCancelSubscription();
      setIsProcessing(false);
      setShowConfirmCancel(false);
    }, 400);
  };

  const handleReactivate = () => {
    setIsProcessing(true);
    setTimeout(() => {
      onReactivateSubscription();
      setIsProcessing(false);
    }, 400);
  };

  return (
    <div className="fixed inset-0 z-55 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-md select-none overflow-y-auto">
      <div 
        className="bg-white rounded-3xl border border-slate-200 max-w-xl w-full shadow-2xl overflow-hidden flex flex-col my-auto transition-all"
        dir={isRtl ? 'rtl' : 'ltr'}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-900 via-slate-950 to-indigo-950 text-white p-5 sm:p-6 relative border-b border-indigo-500/20">
          <div className="absolute top-4.5 end-4.5">
            <button 
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition-colors cursor-pointer text-sm font-bold"
              aria-label="Close"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-indigo-600 flex items-center justify-center text-white shadow-lg shadow-indigo-600/30 shrink-0">
              <CreditCard className="w-5 h-5 text-indigo-100" />
            </div>
            <div>
              <h2 className="text-lg font-black text-white">{l.modalTitle}</h2>
              <p className="text-slate-400 text-xs mt-0.5">{l.modalSubtitle}</p>
            </div>
          </div>
        </div>

        {/* Body Content */}
        <div className="p-5 sm:p-6 space-y-5 max-h-[75vh] overflow-y-auto bg-slate-50/50">
          
          {/* User Profile Card */}
          <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-indigo-700 flex items-center justify-center text-white font-black text-sm shadow-sm shrink-0">
                {userEmail.charAt(0).toUpperCase()}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-black text-slate-900">{userEmail}</span>
                  <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200/60 px-2 py-0.5 rounded-full">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    {l.userStatus}
                  </span>
                </div>
                <div className="text-[11px] text-slate-500 flex items-center gap-2 mt-0.5">
                  <span className="font-semibold text-indigo-600">{l.userRole}</span>
                  <span>•</span>
                  <span className="font-mono text-slate-400 text-[10px]">STJ-44354-PRO</span>
                </div>
              </div>
            </div>

            <div className="self-end sm:self-center">
              <span className="text-[10px] bg-slate-100 text-slate-600 font-mono font-medium px-2.5 py-1 rounded-lg border border-slate-200">
                oren71601@gmail.com
              </span>
            </div>
          </div>

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
                  {isPremium ? (language === 'he' ? 'חודשי' : 'monthly') : (language === 'he' ? 'חינם' : 'free tier')}
                </span>
              </div>

              <p className="text-xs text-slate-600 leading-relaxed">
                {isPremium ? l.activeDesc : l.freeDesc}
              </p>
            </div>

            {/* Plan Details Grid */}
            <div className="p-4 sm:p-5 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs bg-white">
              <div className="p-3 bg-slate-50/70 rounded-xl border border-slate-100">
                <div className="text-slate-400 text-[10px] font-bold uppercase tracking-wider">{l.billingCycle}</div>
                <div className="font-bold text-slate-800 mt-0.5">{isPremium ? l.billingCycleVal : (language === 'he' ? 'ללא חיוב' : 'None')}</div>
              </div>

              <div className="p-3 bg-slate-50/70 rounded-xl border border-slate-100">
                <div className="text-slate-400 text-[10px] font-bold uppercase tracking-wider">{l.nextBillingDate}</div>
                <div className="font-bold text-slate-800 mt-0.5">
                  {isPremium ? l.nextBillingDateVal : (language === 'he' ? 'אין חידוש מתוכנן' : 'No renewal pending')}
                </div>
              </div>

              <div className="p-3 bg-slate-50/70 rounded-xl border border-slate-100 sm:col-span-2">
                <div className="text-slate-400 text-[10px] font-bold uppercase tracking-wider">{l.paymentMethod}</div>
                <div className="font-bold text-slate-800 mt-0.5 flex items-center justify-between">
                  <span>{isPremium ? l.paymentMethodVal : (language === 'he' ? 'אין אמצעי תשלום פעיל' : 'No active payment method')}</span>
                  {isPremium && (
                    <span className="text-[10px] font-extrabold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-100">
                      Apple Pay / Google Play
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
                      <span>{l.confirmYes}</span>
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
            <div className="bg-indigo-50/70 border border-indigo-200/80 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h4 className="text-xs font-black text-indigo-950">
                  {language === 'he' ? 'רוצה להחזיר את כל הפיצ׳רים?' : 'Ready to restore full Pro access?'}
                </h4>
                <p className="text-indigo-800/80 text-[11px] mt-0.5">
                  {language === 'he' ? 'הפעל מחדש את המנוי ב-$25 לחודש וקבל גישה מיידית ללוח השנה ולאנליטיקה.' : 'Reactivate your $25/mo plan to instantly unlock the mental calendar & analytics.'}
                </p>
              </div>

              <button
                type="button"
                disabled={isProcessing}
                onClick={handleReactivate}
                className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-xs rounded-xl shadow-md shadow-indigo-600/20 transition-all flex items-center justify-center gap-1.5 cursor-pointer shrink-0 disabled:opacity-50"
              >
                <Crown className="w-4 h-4 text-amber-300" />
                <span>{l.btnReactivate}</span>
              </button>
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
        <div className="p-4 border-t border-slate-200 bg-white flex items-center justify-between">
          <div className="text-[11px] text-slate-400 flex items-center gap-1 font-medium">
            <Shield className="w-3.5 h-3.5 text-slate-400" />
            <span>Secure 256-Bit SSL Billing</span>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl transition-all cursor-pointer shadow-xs"
          >
            {l.btnClose}
          </button>
        </div>

      </div>
    </div>
  );
};
