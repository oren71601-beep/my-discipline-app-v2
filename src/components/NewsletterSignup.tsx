import React, { useState } from 'react';
import { Mail, CheckCircle2, Send, Sparkles, ShieldCheck, RefreshCw } from 'lucide-react';
import { subscribeToNewsletter } from '../firebase';
import { LanguageCode } from '../utils/translations';
import { recordAnalyticsEvent } from '../utils/analyticsService';

interface NewsletterSignupProps {
  language: LanguageCode;
  onSuccessToast?: (msg: string) => void;
  variant?: 'inline' | 'compact' | 'card';
  className?: string;
}

export const NewsletterSignup: React.FC<NewsletterSignupProps> = ({
  language,
  onSuccessToast,
  variant = 'card',
  className = ''
}) => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(() => {
    return localStorage.getItem('trading_tracker_newsletter_subscribed') === 'true';
  });
  const [errorMsg, setErrorMsg] = useState('');

  const isRtl = language === 'he' || language === 'ar';

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    const clean = email.trim().toLowerCase();

    if (!clean || !clean.includes('@') || !clean.includes('.')) {
      setErrorMsg(
        language === 'he' ? 'אנא הזן כתובת אימייל תקינה (למשל name@gmail.com) ✉️' : 'Please enter a valid email address ✉️'
      );
      return;
    }

    setLoading(true);
    try {
      await subscribeToNewsletter(clean);
      recordAnalyticsEvent('newsletter_signup', 'Newsletter subscription', clean);
      setIsSubscribed(true);
      localStorage.setItem('trading_tracker_newsletter_subscribed', 'true');
      localStorage.setItem('trading_tracker_newsletter_subscriber_email', clean);
      setEmail('');
      
      const successMsg = language === 'he' 
        ? 'תודה שהצטרפת לרשימת המשמעת! נשלח אליך בקרוב תובנות ומדריך למסחר 🚀' 
        : 'Welcome to the discipline list! Your weekly insights are on the way 🚀';
      
      if (onSuccessToast) {
        onSuccessToast(successMsg);
      }
    } catch {
      setErrorMsg(
        language === 'he' ? 'שגיאה בשמירת האימייל. נסה שוב בעוד מספר רגעים.' : 'Error saving email. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  if (isSubscribed) {
    return (
      <div 
        className={`p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-emerald-950/60 to-slate-900 border border-emerald-500/40 text-emerald-200 text-center space-y-2 animate-fadeIn ${className}`}
        dir={isRtl ? 'rtl' : 'ltr'}
      >
        <div className="w-9 h-9 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 mx-auto flex items-center justify-center">
          <CheckCircle2 className="w-5 h-5" />
        </div>
        <div className="font-black text-xs sm:text-sm text-white">
          {language === 'he' ? 'אתה רשום בהצלחה לרשימת התפוצה! 📬' : 'You are subscribed to weekly trading insights! 📬'}
        </div>
        <p className="text-[11px] text-emerald-300/80 max-w-md mx-auto leading-relaxed">
          {language === 'he' 
            ? 'נשלח אליך תובנות שבועיות על פסיכולוגיית מסחר, משמעת עצמית וניהול יחידות R ישירות למייל. תודה על האמון!' 
            : 'Expect weekly insights on discipline, mental framing, and R-Units directly to your inbox. Thank you!'}
        </p>
      </div>
    );
  }

  return (
    <div 
      className={`rounded-2xl p-5 sm:p-6 bg-gradient-to-br from-indigo-950/50 via-slate-900 to-slate-950 border border-indigo-500/30 text-start space-y-3.5 shadow-xl relative overflow-hidden ${className}`}
      dir={isRtl ? 'rtl' : 'ltr'}
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-indigo-600/30 border border-indigo-500/40 text-indigo-300 flex items-center justify-center shrink-0">
            <Mail className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-xs sm:text-sm font-black text-white flex items-center gap-1.5">
              <span>{language === 'he' ? 'רשימת תפוצה ומשמעת שבועית' : 'Weekly Discipline Newsletter'}</span>
              <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0" />
            </h3>
            <p className="text-[11px] text-slate-400 mt-0.5">
              {language === 'he' ? 'קבל טיפים שבועיים לשיפור המשמעת וניהול סיכונים בשוק ההון' : 'Free weekly psychology & risk management insights'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 text-[10px] text-emerald-400 font-bold bg-emerald-950/40 px-2.5 py-1 rounded-full border border-emerald-500/30 self-start sm:self-auto">
          <ShieldCheck className="w-3 h-3" />
          <span>{language === 'he' ? '100% חינם • ללא ספאם' : '100% Free • No Spam'}</span>
        </div>
      </div>

      <p className="text-xs text-slate-300 leading-relaxed">
        {language === 'he'
          ? 'הצטרף לסוחרים שלומדים איך למנוע כניסות מוקדמות, לחסל עסקאות נקמה ולסחור במקצועיות לפי יחידות R. תוכן איכותי אחת לשבוע בלבד.'
          : 'Join traders mastering emotional regulation, eliminating revenge trades, and executing strictly in R-Units. One high-value email per week.'}
      </p>

      <form onSubmit={handleSubscribe} className="space-y-2">
        <div className="flex flex-col sm:flex-row gap-2">
          <div className="relative flex-1">
            <Mail className={`w-4 h-4 text-slate-400 absolute top-1/2 -translate-y-1/2 pointer-events-none ${isRtl ? 'right-3' : 'left-3'}`} />
            <input
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (errorMsg) setErrorMsg('');
              }}
              placeholder={language === 'he' ? 'הזן את כתובת האימייל שלך (name@gmail.com)' : 'Enter your email (name@gmail.com)'}
              className={`w-full text-xs py-2.5 rounded-xl border border-slate-700 bg-slate-950 text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all ${
                isRtl ? 'pr-9 pl-3 text-right' : 'pl-9 pr-3 text-left'
              }`}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 active:scale-95 text-white font-extrabold text-xs rounded-xl transition-all shadow-md shadow-indigo-600/30 cursor-pointer shrink-0 flex items-center justify-center gap-1.5 disabled:opacity-50"
          >
            {loading ? (
              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <Send className="w-3.5 h-3.5" />
            )}
            <span>{language === 'he' ? 'הצטרף עכשיו 🚀' : 'Subscribe Free 🚀'}</span>
          </button>
        </div>

        {errorMsg && (
          <p className="text-[11px] text-rose-400 font-semibold bg-rose-950/40 p-2 rounded-lg border border-rose-800 animate-fadeIn">
            {errorMsg}
          </p>
        )}
      </form>
    </div>
  );
};
