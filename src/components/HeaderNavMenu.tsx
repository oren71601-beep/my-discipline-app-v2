import React, { useState, useRef, useEffect } from 'react';
import { 
  Menu, 
  X, 
  CreditCard, 
  Flame, 
  Globe, 
  User as UserIcon, 
  Activity, 
  Crown, 
  Sparkles, 
  ChevronDown, 
  LogOut,
  ExternalLink,
  ShieldCheck,
  Check
} from 'lucide-react';
import { LanguageCode, LANGUAGES } from '../utils/translations';
import { User } from 'firebase/auth';

interface HeaderNavMenuProps {
  language: LanguageCode;
  onOpenBilling: () => void;
  onOpenAdStudio: () => void;
  onOpenMarketingHub: () => void;
  onOpenAboutMe: () => void;
  onOpenAnalytics: () => void;
  isOwnerView: boolean;
  isPremium: boolean;
  onTogglePremium: () => void;
  onPopulateSampleData?: () => void;
  onChangeLanguage: (lang: LanguageCode) => void;
  currentUser: User | null;
  onLogout?: () => void;
  accountName?: string;
  btnSimulateLabel?: string;
}

export const HeaderNavMenu: React.FC<HeaderNavMenuProps> = ({
  language,
  onOpenBilling,
  onOpenAdStudio,
  onOpenMarketingHub,
  onOpenAboutMe,
  onOpenAnalytics,
  isOwnerView,
  isPremium,
  onTogglePremium,
  onPopulateSampleData,
  onChangeLanguage,
  currentUser,
  onLogout,
  accountName,
  btnSimulateLabel
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const isRtl = language === 'he' || language === 'ar';

  // Close when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent | TouchEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('touchstart', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, [isOpen]);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsOpen(false);
    };
    if (isOpen) window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  const menuTitles = {
    he: {
      menuBtn: 'תפריט',
      pagesSection: 'דפים וכלים',
      accountSection: 'ניהול ומנוי',
      languageSection: 'שפת ממשק',
      marketingHub: 'דף נחיתה ראשי',
      marketingHubSub: 'צפייה בדף השיווקי',
      adStudio: 'דף פרסום ומודעות (9:16)',
      adStudioSub: 'עיצוב מודעות לסטורי ולרשתות',
      aboutMe: 'מי אני – המסע שלי',
      aboutMeSub: 'הסיפור של אורן והמשמעת',
      billing: 'ניהול מנוי וחיובים (Billing)',
      billingSub: 'חשבוניות, כרטיס אשראי וביטול',
      analytics: 'כלי מדידה ואנליטיקה',
      analyticsSub: 'כמה נכנסים, נרשמים ומשלמים',
      adminToggle: 'מצב מנהל (אורן)',
      adminToggleSub: 'החלפה בין Pro לתצוגת חינם',
      simulate: 'סימולציית נתוני מסחר',
      simulateSub: 'טעינת עסקאות דמה לדוגמה',
      logout: 'התנתק מהחשבון',
      ownerBadge: 'בעלים'
    },
    en: {
      menuBtn: 'Menu',
      pagesSection: 'Pages & Tools',
      accountSection: 'Account & Billing',
      languageSection: 'Language',
      marketingHub: 'Marketing Hub',
      marketingHubSub: 'Public landing page view',
      adStudio: 'Ad Studio (9:16)',
      adStudioSub: 'Social media story posters',
      aboutMe: 'About Me',
      aboutMeSub: 'Discipline journey story',
      billing: 'Subscription & Billing',
      billingSub: 'Invoices, cards & plan management',
      analytics: 'Live Analytics & Metrics',
      analyticsSub: 'Traffic, signups & paying leads',
      adminToggle: 'Owner Admin (Oren)',
      adminToggleSub: 'Toggle Pro vs Free tier preview',
      simulate: 'Simulate Demo Data',
      simulateSub: 'Populate sample trade history',
      logout: 'Sign Out',
      ownerBadge: 'Owner'
    },
    ar: {
      menuBtn: 'القائمة',
      pagesSection: 'الصفحات والأدوات',
      accountSection: 'الحساب والاشتراك',
      languageSection: 'اللغة',
      marketingHub: 'مركز التسويق',
      marketingHubSub: 'صفحة الهبوط الرئيسية',
      adStudio: 'استوديو الإعلانات (9:16)',
      adStudioSub: 'تصميم بوسترات ترويجية',
      aboutMe: 'من أنا – رحلتي',
      aboutMeSub: 'قصة أورين والانضباط',
      billing: 'إدارة الاشتراك والفواتير',
      billingSub: 'الفواتير وإعدادات الدفع',
      analytics: 'أدوات القياس والتحليلات',
      analyticsSub: 'الزيارات والتسجيلات والمشتركون',
      adminToggle: 'وضع المشرف (أورين)',
      adminToggleSub: 'التبديل بين Pro والمجاني',
      simulate: 'محاكاة بيانات تجريبية',
      simulateSub: 'تحميل صفقات نموذجية',
      logout: 'تسجيل الخروج',
      ownerBadge: 'المالك'
    },
    ru: {
      menuBtn: 'Меню',
      pagesSection: 'Страницы и инструменты',
      accountSection: 'Управление и подписка',
      languageSection: 'Язык интерфейса',
      marketingHub: 'Маркетинговый хаб',
      marketingHubSub: 'Главный лендинг',
      adStudio: 'Студия рекламы (9:16)',
      adStudioSub: 'Постеры для сторис и сетей',
      aboutMe: 'Обо мне',
      aboutMeSub: 'История дисциплины Орена',
      billing: 'Управление подпиской (Billing)',
      billingSub: 'Счета, карта и тариф',
      analytics: 'Аналитика и метрики',
      analyticsSub: 'Посетители, лиды и оплаты',
      adminToggle: 'Панель владельца (Орен)',
      adminToggleSub: 'Переключение Pro / Free',
      simulate: 'Демо-данные',
      simulateSub: 'Загрузить примеры сделок',
      logout: 'Выйти из аккаунта',
      ownerBadge: 'Владелец'
    }
  }[language];

  return (
    <div className="relative inline-block text-start" ref={menuRef}>
      {/* Menu Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        aria-haspopup="true"
        className={`inline-flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold transition-all border cursor-pointer shadow-xs active:scale-95 ${
          isOpen
            ? 'bg-slate-700 text-white border-indigo-500/50 ring-2 ring-indigo-500/20'
            : 'bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white border-slate-700'
        }`}
        title={menuTitles.menuBtn}
      >
        <div className="relative flex items-center justify-center">
          {isOpen ? (
            <X className="w-4 h-4 text-slate-300" />
          ) : (
            <Menu className="w-4 h-4 text-indigo-400" />
          )}
          {isOwnerView && (
            <span className="absolute -top-1.5 -right-1.5 w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
          )}
        </div>
        <span>{menuTitles.menuBtn}</span>
        <ChevronDown
          className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-200 ${
            isOpen ? 'rotate-180 text-white' : ''
          }`}
        />
      </button>

      {/* Dropdown Menu Panel */}
      {isOpen && (
        <div
          className={`absolute top-full mt-2 z-50 w-72 sm:w-80 rounded-2xl bg-slate-900 border border-slate-700/80 shadow-2xl shadow-black/60 overflow-hidden backdrop-blur-xl animate-fade-in text-slate-200 divide-y divide-slate-800 ${
            isRtl ? 'left-0 sm:left-auto sm:right-0' : 'right-0'
          }`}
          dir={isRtl ? 'rtl' : 'ltr'}
        >
          {/* Section 1: Pages & Content Hubs */}
          <div className="p-2 space-y-1">
            <div className="px-2.5 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center justify-between">
              <span>{menuTitles.pagesSection}</span>
            </div>

            {/* Marketing Hub Landing Page */}
            <button
              type="button"
              onClick={() => {
                setIsOpen(false);
                onOpenMarketingHub();
              }}
              className="w-full flex items-center gap-3 px-2.5 py-2 rounded-xl hover:bg-slate-800 transition-colors text-start group cursor-pointer"
            >
              <div className="w-8 h-8 rounded-lg bg-indigo-500/15 border border-indigo-500/30 text-indigo-400 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                <Globe className="w-4 h-4" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-xs font-bold text-slate-100 group-hover:text-indigo-300 transition-colors flex items-center gap-1.5">
                  <span>{menuTitles.marketingHub}</span>
                  <span className="text-[10px]">📱</span>
                </div>
                <div className="text-[10px] text-slate-400 truncate">{menuTitles.marketingHubSub}</div>
              </div>
            </button>

            {/* Ad Studio (9:16 Poster Creator) - Strictly Owner Only */}
            {isOwnerView && (
              <button
                type="button"
                onClick={() => {
                  setIsOpen(false);
                  onOpenAdStudio();
                }}
                className="w-full flex items-center gap-3 px-2.5 py-2 rounded-xl hover:bg-slate-800 transition-colors text-start group cursor-pointer"
              >
                <div className="w-8 h-8 rounded-lg bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                  <Flame className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-bold text-slate-100 group-hover:text-emerald-300 transition-colors flex items-center justify-between">
                    <span className="flex items-center gap-1.5">
                      <span>{menuTitles.adStudio}</span>
                      <span className="text-[10px]">🔥</span>
                    </span>
                    <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 border border-amber-500/40">
                      {menuTitles.ownerBadge}
                    </span>
                  </div>
                  <div className="text-[10px] text-slate-400 truncate">{menuTitles.adStudioSub}</div>
                </div>
              </button>
            )}

            {/* About Me Story Modal */}
            <button
              type="button"
              onClick={() => {
                setIsOpen(false);
                onOpenAboutMe();
              }}
              className="w-full flex items-center gap-3 px-2.5 py-2 rounded-xl hover:bg-slate-800 transition-colors text-start group cursor-pointer"
            >
              <div className="w-8 h-8 rounded-lg bg-amber-500/15 border border-amber-500/30 text-amber-400 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                <UserIcon className="w-4 h-4" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-xs font-bold text-slate-100 group-hover:text-amber-300 transition-colors flex items-center gap-1.5">
                  <span>{menuTitles.aboutMe}</span>
                  <span className="text-[10px]">🧘‍♂️</span>
                </div>
                <div className="text-[10px] text-slate-400 truncate">{menuTitles.aboutMeSub}</div>
              </div>
            </button>
          </div>

          {/* Section 2: Account & Management */}
          <div className="p-2 space-y-1">
            <div className="px-2.5 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              {menuTitles.accountSection}
            </div>

            {/* Billing & Subscription */}
            <button
              type="button"
              onClick={() => {
                setIsOpen(false);
                onOpenBilling();
              }}
              className="w-full flex items-center gap-3 px-2.5 py-2 rounded-xl hover:bg-slate-800 transition-colors text-start group cursor-pointer"
            >
              <div className="w-8 h-8 rounded-lg bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                <CreditCard className="w-4 h-4" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-xs font-bold text-slate-100 group-hover:text-emerald-300 transition-colors flex items-center gap-1.5">
                  <span>{menuTitles.billing}</span>
                  <span className="text-[10px]">💳</span>
                </div>
                <div className="text-[10px] text-slate-400 truncate">{menuTitles.billingSub}</div>
              </div>
            </button>

            {/* Live Analytics & Metrics (Owner / Measurement tool) */}
            <button
              type="button"
              onClick={() => {
                setIsOpen(false);
                onOpenAnalytics();
              }}
              className="w-full flex items-center gap-3 px-2.5 py-2 rounded-xl hover:bg-slate-800 transition-colors text-start group cursor-pointer"
            >
              <div className="w-8 h-8 rounded-lg bg-indigo-600/20 border border-indigo-500/40 text-indigo-400 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                <Activity className="w-4 h-4 animate-pulse" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-xs font-bold text-slate-100 group-hover:text-indigo-300 transition-colors flex items-center gap-1.5">
                  <span>{menuTitles.analytics}</span>
                  <span className="text-[10px]">📊</span>
                  <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 border border-amber-500/40">
                    {menuTitles.ownerBadge}
                  </span>
                </div>
                <div className="text-[10px] text-slate-400 truncate">{menuTitles.analyticsSub}</div>
              </div>
            </button>

            {/* Admin Pro/Free Tier Switcher (Oren Only) */}
            {isOwnerView && (
              <button
                type="button"
                onClick={() => {
                  onTogglePremium();
                }}
                className="w-full flex items-center gap-3 px-2.5 py-2 rounded-xl hover:bg-slate-800 transition-colors text-start group cursor-pointer"
              >
                <div className="w-8 h-8 rounded-lg bg-amber-500/20 border border-amber-500/40 text-amber-300 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                  <Crown className="w-4 h-4 text-amber-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-bold text-slate-100 group-hover:text-amber-300 transition-colors flex items-center justify-between">
                    <span>{menuTitles.adminToggle}</span>
                    <span className={`text-[9px] font-mono font-bold px-1.5 py-0.2 rounded border ${
                      isPremium 
                        ? 'bg-amber-500/30 text-amber-200 border-amber-500/50' 
                        : 'bg-slate-700 text-slate-400 border-slate-600'
                    }`}>
                      {isPremium ? 'PRO' : 'FREE'}
                    </span>
                  </div>
                  <div className="text-[10px] text-slate-400 truncate">{menuTitles.adminToggleSub}</div>
                </div>
              </button>
            )}

            {/* Simulate Sample Data (Only available in Pro) */}
            {isPremium && onPopulateSampleData && (
              <button
                type="button"
                onClick={() => {
                  setIsOpen(false);
                  onPopulateSampleData();
                }}
                className="w-full flex items-center gap-3 px-2.5 py-2 rounded-xl hover:bg-slate-800 transition-colors text-start group cursor-pointer"
              >
                <div className="w-8 h-8 rounded-lg bg-amber-500/20 border border-amber-500/40 text-amber-300 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                  <Sparkles className="w-4 h-4 text-amber-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-bold text-slate-100 group-hover:text-amber-300 transition-colors">
                    {btnSimulateLabel || menuTitles.simulate}
                  </div>
                  <div className="text-[10px] text-slate-400 truncate">{menuTitles.simulateSub}</div>
                </div>
              </button>
            )}
          </div>

          {/* Section 3: Language Selector */}
          <div className="p-3 bg-slate-950/40">
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <Globe className="w-3.5 h-3.5 text-slate-400" />
              <span>{menuTitles.languageSection}</span>
            </div>

            <div className="grid grid-cols-2 gap-1.5">
              {LANGUAGES.map((lang) => {
                const isSelected = language === lang.code;
                return (
                  <button
                    key={lang.code}
                    type="button"
                    onClick={() => {
                      onChangeLanguage(lang.code);
                    }}
                    className={`flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all border cursor-pointer ${
                      isSelected
                        ? 'bg-indigo-600/30 text-indigo-200 border-indigo-500/60 shadow-xs'
                        : 'bg-slate-800/80 hover:bg-slate-800 text-slate-300 border-slate-700/60 hover:text-white'
                    }`}
                  >
                    <span className="flex items-center gap-1.5 truncate">
                      <span>{lang.flag}</span>
                      <span className="truncate">{lang.name}</span>
                    </span>
                    {isSelected && <Check className="w-3 h-3 text-indigo-400 shrink-0" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Footer: User status / Log out if logged in */}
          {currentUser && onLogout && (
            <div className="p-2 bg-slate-950/60">
              <button
                type="button"
                onClick={() => {
                  setIsOpen(false);
                  onLogout();
                }}
                className="w-full flex items-center justify-between px-3 py-2 rounded-xl hover:bg-rose-950/30 text-slate-400 hover:text-rose-400 transition-colors text-xs font-bold cursor-pointer"
              >
                <span className="flex items-center gap-2">
                  <LogOut className="w-3.5 h-3.5" />
                  <span>{menuTitles.logout}</span>
                </span>
                <span className="text-[10px] text-slate-500 font-normal truncate max-w-[120px]">
                  {currentUser.email}
                </span>
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
