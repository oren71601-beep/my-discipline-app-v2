import React, { useState, useEffect } from 'react';
import { 
  X, 
  BarChart3, 
  Users, 
  CreditCard, 
  TrendingUp, 
  Mail, 
  Smartphone, 
  Monitor, 
  Download, 
  RefreshCw, 
  Copy, 
  Check, 
  ShieldCheck, 
  Eye, 
  Sparkles, 
  Crown, 
  Clock, 
  ArrowUpRight,
  Filter,
  CheckCircle2,
  Activity
} from 'lucide-react';
import { LanguageCode } from '../utils/translations';
import { 
  AnalyticsSummary, 
  AnalyticsEvent, 
  computeLiveSummary, 
  getStoredEvents, 
  getNewsletterSubscribersList, 
  getPaidSubscribersList, 
  getRegisteredAccountsList 
} from '../utils/analyticsService';
import { SUPPORT_EMAIL } from '../firebase';

interface OwnerAnalyticsModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: LanguageCode;
}

export const OwnerAnalyticsModal: React.FC<OwnerAnalyticsModalProps> = ({
  isOpen,
  onClose,
  language
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'subscribers' | 'paid' | 'events'>('overview');
  const [summary, setSummary] = useState<AnalyticsSummary>(computeLiveSummary);
  const [events, setEvents] = useState<AnalyticsEvent[]>(getStoredEvents);
  const [newsletterList, setNewsletterList] = useState<{ email: string; date?: string }[]>(getNewsletterSubscribersList);
  const [paidList, setPaidList] = useState<string[]>(getPaidSubscribersList);
  const [accountsList, setAccountsList] = useState(getRegisteredAccountsList);
  const [copiedEmails, setCopiedEmails] = useState(false);
  const [copiedPaid, setCopiedPaid] = useState(false);
  const [lastRefreshed, setLastRefreshed] = useState<Date>(new Date());

  const isRtl = language === 'he' || language === 'ar';

  const reloadData = () => {
    setSummary(computeLiveSummary());
    setEvents(getStoredEvents());
    setNewsletterList(getNewsletterSubscribersList());
    setPaidList(getPaidSubscribersList());
    setAccountsList(getRegisteredAccountsList());
    setLastRefreshed(new Date());
  };

  useEffect(() => {
    if (isOpen) {
      reloadData();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  // Conversion calculations
  const uniqueVis = Math.max(summary.uniqueVisitors, 1);
  const totalLeads = summary.newsletterSignups + summary.registeredAccounts;
  const leadConvRate = ((totalLeads / uniqueVis) * 100).toFixed(1);
  const paidConvRate = ((summary.payingCustomers / uniqueVis) * 100).toFixed(1);
  const totalVisits = Math.max(summary.mobileVisits + summary.desktopVisits, 1);
  const mobilePct = Math.round((summary.mobileVisits / totalVisits) * 100);
  const desktopPct = 100 - mobilePct;

  // Copy all newsletter emails
  const handleCopyNewsletterEmails = () => {
    const emails = newsletterList.map(n => n.email).join(', ');
    if (emails) {
      navigator.clipboard.writeText(emails);
      setCopiedEmails(true);
      setTimeout(() => setCopiedEmails(false), 2500);
    }
  };

  // Copy paid subscriber emails
  const handleCopyPaidEmails = () => {
    const emails = paidList.join(', ');
    if (emails) {
      navigator.clipboard.writeText(emails);
      setCopiedPaid(true);
      setTimeout(() => setCopiedPaid(false), 2500);
    }
  };

  // Export full analytics as CSV
  const handleExportCSV = () => {
    const rows = [
      ['Metric', 'Value'],
      ['Total Pageviews', summary.totalPageviews],
      ['Unique Visitors', summary.uniqueVisitors],
      ['Mobile Visits', summary.mobileVisits],
      ['Desktop Visits', summary.desktopVisits],
      ['Newsletter Subscribers', summary.newsletterSignups],
      ['Registered Accounts', summary.registeredAccounts],
      ['Checkout Intents Clicked', summary.checkoutIntents],
      ['Paying Customers', summary.payingCustomers],
      ['Estimated Revenue USD', `$${summary.estimatedRevenueUSD}`],
      ['Lead Conversion Rate', `${leadConvRate}%`],
      ['Paid Conversion Rate', `${paidConvRate}%`],
      ['Last Updated', summary.lastUpdated],
      [''],
      ['Newsletter Subscribers List:'],
      ...newsletterList.map(item => [item.email, item.date || '']),
      [''],
      ['Paid Subscribers List:'],
      ...paidList.map(email => [email, 'Active Pro']),
    ];

    const csvContent = 'data:text/csv;charset=utf-8,' + rows.map(e => e.join(',')).join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `smart_journal_metrics_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="fixed inset-0 z-55 flex flex-col items-center justify-start sm:justify-center p-2 sm:p-4 bg-slate-950/85 backdrop-blur-md select-none overflow-y-auto overscroll-none pt-[max(0.75rem,env(safe-area-inset-top))] pb-[max(0.75rem,env(safe-area-inset-bottom))] animate-fadeIn">
      <div 
        className="bg-slate-900 border border-slate-800 rounded-3xl max-w-4xl w-full shadow-2xl overflow-hidden flex flex-col max-h-[calc(100dvh-2rem)] sm:max-h-[92vh] min-h-0 my-auto text-slate-100"
        dir={isRtl ? 'rtl' : 'ltr'}
      >
        {/* Executive Header */}
        <div className="bg-gradient-to-r from-indigo-950 via-slate-900 to-slate-950 p-5 sm:p-6 border-b border-slate-800 flex items-center justify-between relative shrink-0">
          <div className="flex items-center gap-3.5 pe-8">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-emerald-500 text-white flex items-center justify-center shadow-lg shadow-indigo-600/30 shrink-0 text-xl">
              📊
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-black text-white">
                  {language === 'he' ? 'כלי מדידה ואנליטיקת מבקרים' : 'Live Analytics & Conversion Dashboard'}
                </h2>
                <span className="text-[10px] font-mono bg-amber-500/20 text-amber-300 border border-amber-500/40 px-2 py-0.5 rounded-full font-extrabold uppercase flex items-center gap-1">
                  <Crown className="w-3 h-3 text-amber-400" />
                  <span>{language === 'he' ? 'בלעדי לבעלים' : 'Owner Only'}</span>
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5 font-medium flex items-center gap-2">
                <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>{language === 'he' ? 'מעקב בזמן אמת פעיל • כמה נכנסים, נרשמים ומשלמים' : 'Real-time tracking active • Traffic, leads & revenue'}</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={reloadData}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-all cursor-pointer border border-slate-700"
              title={language === 'he' ? 'רענן נתונים' : 'Refresh Data'}
            >
              <RefreshCw className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={handleExportCSV}
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-600/20 hover:bg-indigo-600 text-indigo-300 hover:text-white border border-indigo-500/30 text-xs font-bold transition-all cursor-pointer"
              title={language === 'he' ? 'ייצא נתונים לקובץ CSV' : 'Export CSV'}
            >
              <Download className="w-3.5 h-3.5" />
              <span>CSV</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition-all cursor-pointer border border-slate-700"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="bg-slate-950/60 border-b border-slate-800 px-4 sm:px-6 py-2.5 flex items-center justify-between gap-2 overflow-x-auto shrink-0">
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => setActiveTab('overview')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'overview'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <BarChart3 className="w-3.5 h-3.5" />
              <span>{language === 'he' ? 'מדדי ביצועים ומשפך' : 'Metrics & Funnel'}</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('subscribers')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'subscribers'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <Mail className="w-3.5 h-3.5" />
              <span>{language === 'he' ? `רשימת תפוצה (${newsletterList.length})` : `Newsletter (${newsletterList.length})`}</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('paid')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'paid'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <CreditCard className="w-3.5 h-3.5 text-emerald-400" />
              <span>{language === 'he' ? `משלמים (${summary.payingCustomers})` : `Paid Users (${summary.payingCustomers})`}</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('events')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'events'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <Activity className="w-3.5 h-3.5" />
              <span>{language === 'he' ? `יומן פעילות (${events.length})` : `Live Stream (${events.length})`}</span>
            </button>
          </div>

          <div className="text-[11px] text-slate-500 font-mono hidden md:block">
            {language === 'he' ? 'עודכן: ' : 'Updated: '} {lastRefreshed.toLocaleTimeString()}
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-6 flex-1 text-start">
          
          {/* TAB 1: OVERVIEW & FUNNEL */}
          {activeTab === 'overview' && (
            <div className="space-y-6 animate-fadeIn">
              
              {/* 4 Core Measurement Metric Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
                
                {/* 1. Visitors */}
                <div className="p-4.5 rounded-2xl bg-gradient-to-br from-slate-900 to-indigo-950/40 border border-slate-800 space-y-2 relative overflow-hidden">
                  <div className="flex items-center justify-between text-slate-400 text-xs">
                    <span className="font-bold flex items-center gap-1.5">
                      <Eye className="w-3.5 h-3.5 text-indigo-400" />
                      <span>{language === 'he' ? 'נכנסים לאתר' : 'Site Visitors'}</span>
                    </span>
                    <span className="font-mono text-[10px] bg-indigo-500/20 text-indigo-300 px-2 py-0.5 rounded-full font-bold">LIVE</span>
                  </div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-black text-white font-mono">{summary.uniqueVisitors}</span>
                    <span className="text-xs text-slate-400 font-medium">
                      {language === 'he' ? 'מבקרים ייחודיים' : 'unique'}
                    </span>
                  </div>
                  <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
                    <span>{language === 'he' ? `סה״כ צפיות: ${summary.totalPageviews}` : `Total Views: ${summary.totalPageviews}`}</span>
                    <div className="flex items-center gap-1 text-[10px]">
                      <span>📱 {mobilePct}%</span>
                      <span>💻 {desktopPct}%</span>
                    </div>
                  </div>
                </div>

                {/* 2. Signups & Leads */}
                <div className="p-4.5 rounded-2xl bg-gradient-to-br from-slate-900 to-indigo-950/40 border border-slate-800 space-y-2 relative overflow-hidden">
                  <div className="flex items-center justify-between text-slate-400 text-xs">
                    <span className="font-bold flex items-center gap-1.5">
                      <Users className="w-3.5 h-3.5 text-amber-400" />
                      <span>{language === 'he' ? 'נרשמים ולידים' : 'Leads & Signups'}</span>
                    </span>
                    <span className="font-mono text-[10px] bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded-full font-bold">
                      {leadConvRate}% המרה
                    </span>
                  </div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-black text-amber-400 font-mono">{totalLeads}</span>
                    <span className="text-xs text-slate-400 font-medium">
                      {language === 'he' ? 'מיילים נאספו' : 'total captured'}
                    </span>
                  </div>
                  <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
                    <span>✉️ ניוזלטר: {summary.newsletterSignups}</span>
                    <span>👤 חשבונות: {summary.registeredAccounts}</span>
                  </div>
                </div>

                {/* 3. Paying Customers */}
                <div className="p-4.5 rounded-2xl bg-gradient-to-br from-slate-900 to-emerald-950/40 border border-emerald-500/20 space-y-2 relative overflow-hidden">
                  <div className="flex items-center justify-between text-slate-400 text-xs">
                    <span className="font-bold flex items-center gap-1.5 text-emerald-400">
                      <CreditCard className="w-3.5 h-3.5 text-emerald-400" />
                      <span>{language === 'he' ? 'משלמים פעילים' : 'Paying Customers'}</span>
                    </span>
                    <span className="font-mono text-[10px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-full font-bold">
                      {paidConvRate}% לקוחות
                    </span>
                  </div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-black text-emerald-400 font-mono">{summary.payingCustomers}</span>
                    <span className="text-xs text-slate-400 font-medium">
                      {language === 'he' ? 'מנויי Pro' : 'Pro subscribers'}
                    </span>
                  </div>
                  <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
                    <span>⚡ לחיצות צ׳קאאוט: {summary.checkoutIntents}</span>
                    <span className="text-emerald-300 font-bold font-mono">${summary.estimatedRevenueUSD}/חודש</span>
                  </div>
                </div>

                {/* 4. Total Value & Health */}
                <div className="p-4.5 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-800 space-y-2 relative overflow-hidden">
                  <div className="flex items-center justify-between text-slate-400 text-xs">
                    <span className="font-bold flex items-center gap-1.5">
                      <TrendingUp className="w-3.5 h-3.5 text-sky-400" />
                      <span>{language === 'he' ? 'הכנסה שנתית (ARR)' : 'Est. Annual Value'}</span>
                    </span>
                    <span className="font-mono text-[10px] bg-sky-500/20 text-sky-300 px-2 py-0.5 rounded-full font-bold">
                      ARR
                    </span>
                  </div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-black text-sky-400 font-mono">${summary.estimatedRevenueUSD * 12}</span>
                    <span className="text-xs text-slate-400 font-medium">/ שנה</span>
                  </div>
                  <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
                    <span>{language === 'he' ? 'מחיר מנוי: $25 לחודש' : 'Plan: $25/mo'}</span>
                    <span className="text-emerald-400 font-bold">₪{(summary.estimatedRevenueUSD * 3.7).toFixed(0)}</span>
                  </div>
                </div>

              </div>

              {/* Conversion Funnel Visualization */}
              <div className="p-5 sm:p-6 rounded-3xl bg-slate-950/70 border border-slate-800 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-black text-white flex items-center gap-2">
                    <BarChart3 className="w-4 h-4 text-indigo-400" />
                    <span>{language === 'he' ? 'משפך המרה שיווקי חי (Conversion Funnel)' : 'Live Conversion Funnel'}</span>
                  </h3>
                  <span className="text-xs text-slate-400 font-medium">
                    {language === 'he' ? 'מסע הלקוח מכניסה ועד רכישה' : 'From first visit to paid subscriber'}
                  </span>
                </div>

                {/* Funnel Steps */}
                <div className="space-y-3 pt-2">
                  
                  {/* Step 1: Visitors */}
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-slate-300 flex items-center gap-1.5">
                        <span className="w-5 h-5 rounded-full bg-indigo-600/30 text-indigo-400 text-[10px] flex items-center justify-center font-bold">1</span>
                        <span>{language === 'he' ? 'כניסות ייחודיות לאתר' : 'Unique Visitors'}</span>
                      </span>
                      <span className="font-mono font-bold text-white">{summary.uniqueVisitors} (100%)</span>
                    </div>
                    <div className="h-3 rounded-full bg-slate-900 overflow-hidden border border-slate-800">
                      <div className="h-full bg-indigo-500 rounded-full w-full" />
                    </div>
                  </div>

                  {/* Step 2: Signups & Leads */}
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-slate-300 flex items-center gap-1.5">
                        <span className="w-5 h-5 rounded-full bg-amber-600/30 text-amber-400 text-[10px] flex items-center justify-center font-bold">2</span>
                        <span>{language === 'he' ? 'נרשמים לניוזלטר ולמערכת (Leads)' : 'Subscribers & Registered Leads'}</span>
                      </span>
                      <span className="font-mono font-bold text-amber-400">{totalLeads} ({leadConvRate}%)</span>
                    </div>
                    <div className="h-3 rounded-full bg-slate-900 overflow-hidden border border-slate-800">
                      <div 
                        className="h-full bg-amber-500 rounded-full transition-all duration-700" 
                        style={{ width: `${Math.min(Math.max(Number(leadConvRate), 4), 100)}%` }} 
                      />
                    </div>
                  </div>

                  {/* Step 3: Checkout Click */}
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-slate-300 flex items-center gap-1.5">
                        <span className="w-5 h-5 rounded-full bg-sky-600/30 text-sky-400 text-[10px] flex items-center justify-center font-bold">3</span>
                        <span>{language === 'he' ? 'לחיצות על כפתור תשלום (Checkout Intent)' : 'Clicked Subscribe / Checkout'}</span>
                      </span>
                      <span className="font-mono font-bold text-sky-400">{summary.checkoutIntents}</span>
                    </div>
                    <div className="h-3 rounded-full bg-slate-900 overflow-hidden border border-slate-800">
                      <div 
                        className="h-full bg-sky-500 rounded-full transition-all duration-700" 
                        style={{ width: `${Math.min(Math.max((summary.checkoutIntents / uniqueVis) * 100, 3), 100)}%` }} 
                      />
                    </div>
                  </div>

                  {/* Step 4: Paying Customer */}
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-emerald-400 flex items-center gap-1.5">
                        <span className="w-5 h-5 rounded-full bg-emerald-600/30 text-emerald-400 text-[10px] flex items-center justify-center font-bold">4</span>
                        <span>{language === 'he' ? 'מנויי Pro פעילים ששילמו (Customers)' : 'Active Paying Subscribers'}</span>
                      </span>
                      <span className="font-mono font-bold text-emerald-400">{summary.payingCustomers} ({paidConvRate}%)</span>
                    </div>
                    <div className="h-3 rounded-full bg-slate-900 overflow-hidden border border-slate-800">
                      <div 
                        className="h-full bg-emerald-500 rounded-full transition-all duration-700" 
                        style={{ width: `${Math.min(Math.max(Number(paidConvRate), 2), 100)}%` }} 
                      />
                    </div>
                  </div>

                </div>
              </div>

              {/* Traffic Device Split & Recommendations */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                
                <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-2.5">
                  <h4 className="text-xs font-bold text-white flex items-center gap-2">
                    <Smartphone className="w-4 h-4 text-indigo-400" />
                    <span>{language === 'he' ? 'פילוח מכשירים (Devices)' : 'Device Breakdown'}</span>
                  </h4>
                  <div className="space-y-2 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400 flex items-center gap-1.5">
                        <Smartphone className="w-3.5 h-3.5 text-slate-500" />
                        <span>מובייל / סמארטפון</span>
                      </span>
                      <span className="font-mono font-bold text-white">{summary.mobileVisits} ({mobilePct}%)</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400 flex items-center gap-1.5">
                        <Monitor className="w-3.5 h-3.5 text-slate-500" />
                        <span>מחשב שולחני / דסקטופ</span>
                      </span>
                      <span className="font-mono font-bold text-white">{summary.desktopVisits} ({desktopPct}%)</span>
                    </div>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-2.5">
                  <h4 className="text-xs font-bold text-white flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                    <span>{language === 'he' ? 'אמינות הנתונים ואבטחה' : 'Privacy & Integrity'}</span>
                  </h4>
                  <p className="text-[11px] text-slate-400 leading-relaxed">
                    {language === 'he'
                      ? 'הנתונים מסונכרנים ישירות מול שרתי Firebase ודפדפני המבקרים. לוח זה גלוי אך ורק עבורך ואינו חשוף לאף גולש רגיל.'
                      : 'Data tracks genuine visits, form submissions, and verified payments. Completely hidden from public visitors.'}
                  </p>
                </div>

              </div>

            </div>
          )}

          {/* TAB 2: NEWSLETTER SUBSCRIBERS */}
          {activeTab === 'subscribers' && (
            <div className="space-y-4 animate-fadeIn">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
                <div>
                  <h3 className="text-sm font-black text-white flex items-center gap-2">
                    <Mail className="w-4 h-4 text-indigo-400" />
                    <span>{language === 'he' ? `רשימת מיילים שנרשמו לניוזלטר (${newsletterList.length})` : `Newsletter Subscriber Emails (${newsletterList.length})`}</span>
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    {language === 'he' ? 'כל כתובות המייל שהשאירו מבקרים בדף הנחיתה' : 'Captured emails from visitors on the landing page'}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={handleCopyNewsletterEmails}
                  className="px-3.5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl transition-all cursor-pointer flex items-center gap-1.5 shadow-sm shrink-0"
                >
                  {copiedEmails ? <Check className="w-3.5 h-3.5 text-emerald-300" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedEmails ? (language === 'he' ? 'הועתק בהצלחה!' : 'Copied!') : (language === 'he' ? 'העתק את כל המיילים' : 'Copy All Emails')}</span>
                </button>
              </div>

              {newsletterList.length === 0 ? (
                <div className="p-8 text-center bg-slate-950/60 rounded-2xl border border-slate-800 space-y-2">
                  <div className="text-3xl">📬</div>
                  <div className="text-xs font-bold text-white">עדיין לא נרשמו מבקרים חדשים</div>
                  <p className="text-[11px] text-slate-400 max-w-sm mx-auto">
                    טופס הניוזלטר פעיל כעת בדף הנחיתה. ברגע שמבקר יזין את המייל שלו, הוא יופיע כאן מיידית!
                  </p>
                </div>
              ) : (
                <div className="rounded-2xl border border-slate-800 overflow-hidden bg-slate-950/60">
                  <table className="w-full text-xs text-start">
                    <thead>
                      <tr className="bg-slate-900 border-b border-slate-800 text-slate-400 text-[11px]">
                        <th className="p-3 text-start font-bold">#</th>
                        <th className="p-3 text-start font-bold">{language === 'he' ? 'כתובת אימייל' : 'Email Address'}</th>
                        <th className="p-3 text-start font-bold">{language === 'he' ? 'סטטוס' : 'Status'}</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60 font-mono text-[11px]">
                      {newsletterList.map((item, idx) => (
                        <tr key={idx} className="hover:bg-slate-900/40 transition-colors">
                          <td className="p-3 text-slate-500 font-bold">{idx + 1}</td>
                          <td className="p-3 text-white font-bold">{item.email}</td>
                          <td className="p-3">
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-bold">
                              <CheckCircle2 className="w-3 h-3" />
                              <span>רשום ופעיל</span>
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* TAB 3: PAID SUBSCRIBERS */}
          {activeTab === 'paid' && (
            <div className="space-y-4 animate-fadeIn">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
                <div>
                  <h3 className="text-sm font-black text-white flex items-center gap-2">
                    <Crown className="w-4 h-4 text-emerald-400" />
                    <span>{language === 'he' ? `מנויים ששילמו (${paidList.length})` : `Paid Subscribers (${paidList.length})`}</span>
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    {language === 'he' ? 'משתמשים פעילים ברשימת התשלום שקיבלו גישת Pro' : 'Users verified on the paid registry with Pro privileges'}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={handleCopyPaidEmails}
                  className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl transition-all cursor-pointer flex items-center gap-1.5 shadow-sm shrink-0"
                >
                  {copiedPaid ? <Check className="w-3.5 h-3.5 text-white" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedPaid ? (language === 'he' ? 'הועתק בהצלחה!' : 'Copied!') : (language === 'he' ? 'העתק מיילים של משלמים' : 'Copy Paid Emails')}</span>
                </button>
              </div>

              {paidList.length === 0 ? (
                <div className="p-8 text-center bg-slate-950/60 rounded-2xl border border-slate-800 space-y-2">
                  <div className="text-3xl">💳</div>
                  <div className="text-xs font-bold text-white">עדיין אין מנויים ששילמו במאגר</div>
                  <p className="text-[11px] text-slate-400 max-w-sm mx-auto">
                    כאשר משתמש ישלם דרך iCount או Whop ויפעיל את המנוי, המייל שלו יתווסף כאן לרשימת הלקוחות המשלמים.
                  </p>
                </div>
              ) : (
                <div className="rounded-2xl border border-slate-800 overflow-hidden bg-slate-950/60">
                  <table className="w-full text-xs text-start">
                    <thead>
                      <tr className="bg-slate-900 border-b border-slate-800 text-slate-400 text-[11px]">
                        <th className="p-3 text-start font-bold">#</th>
                        <th className="p-3 text-start font-bold">{language === 'he' ? 'מייל המנוי' : 'Subscriber Email'}</th>
                        <th className="p-3 text-start font-bold">{language === 'he' ? 'תוכנית' : 'Plan'}</th>
                        <th className="p-3 text-start font-bold">{language === 'he' ? 'סטטוס' : 'Status'}</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60 font-mono text-[11px]">
                      {paidList.map((email, idx) => (
                        <tr key={idx} className="hover:bg-slate-900/40 transition-colors">
                          <td className="p-3 text-slate-500 font-bold">{idx + 1}</td>
                          <td className="p-3 text-white font-bold">{email}</td>
                          <td className="p-3 text-emerald-400 font-bold">Pro Monthly ($25)</td>
                          <td className="p-3">
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-bold">
                              <Crown className="w-3 h-3 text-amber-400" />
                              <span>מנוי Pro פעיל</span>
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* TAB 4: LIVE EVENT STREAM */}
          {activeTab === 'events' && (
            <div className="space-y-4 animate-fadeIn">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div>
                  <h3 className="text-sm font-black text-white flex items-center gap-2">
                    <Activity className="w-4 h-4 text-indigo-400" />
                    <span>{language === 'he' ? `יומן אירועים ופעילות בזמן אמת (${events.length})` : `Live Activity Stream (${events.length})`}</span>
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    {language === 'he' ? 'כל לחיצה, כניסה והרשמה נרשמים כאן עם שעה ומכשיר' : 'Recent visitor actions recorded in real-time'}
                  </p>
                </div>
              </div>

              {events.length === 0 ? (
                <div className="p-8 text-center bg-slate-950/60 rounded-2xl border border-slate-800 text-xs text-slate-400">
                  אין עדיין אירועים מתועדים בזיכרון המקומי.
                </div>
              ) : (
                <div className="space-y-2">
                  {events.slice(0, 30).map((ev) => (
                    <div 
                      key={ev.id} 
                      className="p-3 rounded-xl bg-slate-950/70 border border-slate-800/80 flex items-center justify-between text-xs font-mono"
                    >
                      <div className="flex items-center gap-2.5">
                        <span className={`w-2 h-2 rounded-full shrink-0 ${
                          ev.type === 'payment_success' ? 'bg-emerald-400' :
                          ev.type === 'checkout_intent' ? 'bg-sky-400' :
                          ev.type === 'newsletter_signup' || ev.type === 'signup' ? 'bg-amber-400' :
                          'bg-indigo-400'
                        }`} />
                        <span className="font-bold text-white uppercase text-[10px] px-1.5 py-0.5 rounded bg-slate-900 border border-slate-800">
                          {ev.type}
                        </span>
                        <span className="text-slate-300 text-[11px] font-sans">
                          {ev.details || ev.type}
                        </span>
                        {ev.email && (
                          <span className="text-indigo-400 text-[10px] font-bold">({ev.email})</span>
                        )}
                      </div>

                      <div className="flex items-center gap-3 text-[10px] text-slate-500 shrink-0">
                        <span>{ev.device === 'mobile' ? '📱 Mobile' : '💻 Desktop'}</span>
                        <span>{new Date(ev.timestamp).toLocaleTimeString()}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-slate-950 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500 shrink-0">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span>{language === 'he' ? 'כלי מדידה פנימי מוגן – גלוי בלעדית לאורן' : 'Protected measurement engine – Strictly visible to owner'}</span>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handleExportCSV}
              className="text-indigo-400 hover:text-white font-bold flex items-center gap-1 cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>{language === 'he' ? 'הורד דוח מלא (CSV)' : 'Export CSV Report'}</span>
            </button>
            <span>•</span>
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold cursor-pointer transition-all"
            >
              {language === 'he' ? 'סגור' : 'Close'}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
