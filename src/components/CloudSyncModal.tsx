import React, { useState } from 'react';
import { 
  X, 
  Cloud, 
  Smartphone, 
  Monitor, 
  CheckCircle2, 
  Lock, 
  Mail, 
  ArrowRight, 
  LogOut, 
  RefreshCw,
  Sparkles,
  ShieldCheck
} from 'lucide-react';
import { User } from 'firebase/auth';
import { loginWithGoogle, loginWithEmail, registerWithEmail, logoutUser, isFirebaseConfigured } from '../firebase';
import { LanguageCode } from '../utils/translations';

interface CloudSyncModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: User | null;
  language: LanguageCode;
  onSuccessToast: (msg: string) => void;
}

export const CloudSyncModal: React.FC<CloudSyncModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  language,
  onSuccessToast,
}) => {
  const [isRegisterMode, setIsRegisterMode] = useState<boolean>(false);
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string>('');

  if (!isOpen) return null;

  const isRtl = language === 'he' || language === 'ar';

  const handleGoogleLogin = async () => {
    try {
      setLoading(true);
      setErrorMsg('');
      const user = await loginWithGoogle();
      onSuccessToast(
        language === 'he' 
          ? `ברוך הבא ${user.displayName || user.email}! הנתונים שלך מסונכרנים כעת בענן` 
          : `Connected! Your data is now synced to the cloud.`
      );
      onClose();
    } catch (err: any) {
      console.error(err);
      setErrorMsg(
        err.code === 'auth/popup-closed-by-user' 
          ? (language === 'he' ? 'ההתחברות בוטלה' : 'Sign in cancelled')
          : (language === 'he' ? 'שגיאה בהתחברות עם גוגל. נסה שוב או השתמש באימייל.' : 'Google sign-in error. Try email.')
      );
    } finally {
      setLoading(false);
    }
  };

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;
    if (password.length < 6) {
      setErrorMsg(language === 'he' ? 'סיסמה חייבת להכיל לפחות 6 תווים' : 'Password must be at least 6 characters');
      return;
    }

    try {
      setLoading(true);
      setErrorMsg('');
      if (isRegisterMode) {
        const user = await registerWithEmail(email, password);
        onSuccessToast(
          language === 'he' 
            ? `החשבון נוצר בהצלחה! הנתונים שלך מסונכרנים כעת` 
            : `Account created! Your data is now synced.`
        );
      } else {
        const user = await loginWithEmail(email, password);
        onSuccessToast(
          language === 'he' 
            ? `התחברת בהצלחה! הנתונים נטענו ומסונכרנים` 
            : `Logged in successfully! Data synchronized.`
        );
      }
      onClose();
    } catch (err: any) {
      console.error(err);
      if (err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password' || err.code === 'auth/invalid-credential') {
        setErrorMsg(language === 'he' ? 'פרטי התחברות שגויים. בדוק את האימייל והסיסמה.' : 'Invalid email or password.');
      } else if (err.code === 'auth/email-already-in-use') {
        setErrorMsg(language === 'he' ? 'אימייל זה כבר קיים במערכת. בחר באפשרות "התחבר".' : 'Email already in use. Please sign in.');
      } else {
        setErrorMsg(language === 'he' ? 'שגיאה בחיבור. נסה שוב.' : 'Connection error. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      setLoading(true);
      await logoutUser();
      onSuccessToast(language === 'he' ? 'התנתקת מהסנכרון' : 'Disconnected from cloud sync');
      onClose();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-fade-in">
      <div 
        dir={isRtl ? 'rtl' : 'ltr'}
        className="w-full max-w-md bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden text-slate-900"
      >
        {/* Header with visual cloud sync graphic */}
        <div className="relative bg-gradient-to-br from-indigo-900 via-slate-900 to-indigo-950 text-white p-6 sm:p-7 overflow-hidden">
          <div className="absolute top-0 end-0 p-4">
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 rounded-2xl bg-indigo-500/20 border border-indigo-400/30 flex items-center justify-center text-indigo-400">
              <Cloud className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[11px] font-bold text-indigo-300 uppercase tracking-wider flex items-center gap-1">
                <Sparkles className="w-3 h-3" />
                {language === 'he' ? 'סנכרון ענן מאובטח' : 'Secure Cloud Sync'}
              </span>
              <h3 className="text-lg font-black text-white">
                {language === 'he' ? 'סנכרון מלא מחשב 💻 ופלאפון 📱' : 'Full Computer 💻 & Phone 📱 Sync'}
              </h3>
            </div>
          </div>

          {/* Sync visual illustration */}
          <div className="mt-4 bg-white/10 rounded-2xl p-3 border border-white/10 flex items-center justify-around text-center text-xs">
            <div className="flex flex-col items-center gap-1">
              <div className="w-8 h-8 rounded-xl bg-indigo-600/50 flex items-center justify-center text-white">
                <Monitor className="w-4 h-4" />
              </div>
              <span className="font-bold text-[11px]">{language === 'he' ? 'מחשב נייח/נייד' : 'Computer'}</span>
            </div>

            <div className="flex flex-col items-center justify-center text-indigo-300">
              <RefreshCw className="w-4 h-4 animate-spin" style={{ animationDuration: '8s' }} />
              <span className="text-[9px] font-extrabold mt-0.5 text-emerald-400">
                {language === 'he' ? 'בזמן אמת' : 'Real-time'}
              </span>
            </div>

            <div className="flex flex-col items-center gap-1">
              <div className="w-8 h-8 rounded-xl bg-indigo-600/50 flex items-center justify-center text-white">
                <Smartphone className="w-4 h-4" />
              </div>
              <span className="font-bold text-[11px]">{language === 'he' ? 'סמארטפון / טאבלט' : 'Smartphone'}</span>
            </div>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-4">
          {currentUser ? (
            /* Logged in state */
            <div className="space-y-4">
              <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-emerald-600 text-white flex items-center justify-center font-black shrink-0">
                  {currentUser.photoURL ? (
                    <img src={currentUser.photoURL} alt="User" className="w-10 h-10 rounded-full" />
                  ) : (
                    currentUser.displayName?.[0] || currentUser.email?.[0]?.toUpperCase() || 'U'
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5 text-emerald-800 font-bold text-xs">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>{language === 'he' ? 'מחובר ומסונכרן בזמן אמת' : 'Connected & Synced'}</span>
                  </div>
                  <p className="text-xs text-slate-700 font-bold truncate mt-0.5">
                    {currentUser.displayName || currentUser.email}
                  </p>
                </div>
              </div>

              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 text-xs text-slate-600 space-y-2">
                <p className="font-bold text-slate-800">
                  {language === 'he' ? 'איך לגשת מאותו חשבון בפלאפון?' : 'How to access on your phone?'}
                </p>
                <ol className="list-decimal list-inside space-y-1 text-slate-600">
                  <li>{language === 'he' ? 'פתח את האפליקציה בדפדפן בטלפון הנייד' : 'Open the app in your mobile browser'}</li>
                  <li>{language === 'he' ? `התחבר עם אותו החשבון (${currentUser.email})` : `Sign in with the same account (${currentUser.email})`}</li>
                  <li>{language === 'he' ? 'כל העסקאות, ההערות וההתחייבויות יופיעו אוטומטית!' : 'All trades, notes and goals sync automatically!'}</li>
                </ol>
              </div>

              <button
                type="button"
                onClick={handleLogout}
                disabled={loading}
                className="w-full py-2.5 px-4 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <LogOut className="w-4 h-4 text-rose-500" />
                <span>{language === 'he' ? 'התנתק מסנכרון ענן' : 'Disconnect / Sign Out'}</span>
              </button>
            </div>
          ) : (
            /* Not logged in: offer Google or Email login */
            <div className="space-y-4">
              <p className="text-xs text-slate-600 leading-relaxed">
                {language === 'he'
                  ? 'התחבר לחשבונך כדי שכל עסקה, חודש והתחייבות שאתה מזין יישמרו בענן ויופיעו באופן זהה לחלוטין גם במחשב וגם בפלאפון.'
                  : 'Sign in so every trade and note is saved securely in the cloud and synced across computer and phone.'}
              </p>

              {!isFirebaseConfigured && (
                <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs space-y-1">
                  <div className="font-bold flex items-center gap-1.5 text-amber-800">
                    <ShieldCheck className="w-4 h-4 text-amber-600" />
                    <span>{language === 'he' ? 'מצב שמירה מקומי פעיל (Local Offline)' : 'Local Offline Mode Active'}</span>
                  </div>
                  <p className="text-[11px] text-amber-800/90 leading-relaxed">
                    {language === 'he'
                      ? 'כל הנתונים נשמרים כרגע בדפדפן המקומי במכשיר זה. לסנכרון אוטומטי בין מכשירים (מחשב ונייד), יש להגדיר את פרטי Firebase (VITE_FIREBASE_API_KEY) בקובץ הסביבה.'
                      : 'All your data is saved locally on this device. To sync seamlessly across devices, configure your Firebase keys (VITE_FIREBASE_API_KEY).'}
                  </p>
                </div>
              )}

              {errorMsg && (
                <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold animate-shake">
                  {errorMsg}
                </div>
              )}

              {/* 1-Click Google Sign In */}
              <button
                type="button"
                onClick={handleGoogleLogin}
                disabled={loading}
                className="w-full py-3 px-4 bg-white hover:bg-slate-50 text-slate-900 border-2 border-slate-200 hover:border-slate-300 rounded-2xl text-xs sm:text-sm font-bold shadow-xs transition-all flex items-center justify-center gap-3 cursor-pointer"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
                </svg>
                <span>{language === 'he' ? 'התחבר בלחיצה אחת עם Google' : 'Continue with Google'}</span>
              </button>

              <div className="flex items-center gap-2 my-2">
                <div className="flex-1 h-px bg-slate-200"></div>
                <span className="text-[11px] text-slate-400 font-bold uppercase tracking-wider">
                  {language === 'he' ? 'או עם אימייל וסיסמה' : 'or with email'}
                </span>
                <div className="flex-1 h-px bg-slate-200"></div>
              </div>

              {/* Email Form */}
              <form onSubmit={handleEmailAuth} className="space-y-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    {language === 'he' ? 'כתובת אימייל' : 'Email Address'}
                  </label>
                  <div className="relative">
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="trader@example.com"
                      required
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    {language === 'he' ? 'סיסמה' : 'Password'}
                  </label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-2.5 px-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition-all shadow-xs flex items-center justify-center gap-2 cursor-pointer"
                >
                  {loading ? (
                    <RefreshCw className="w-4 h-4 animate-spin" />
                  ) : (
                    <span>
                      {isRegisterMode 
                        ? (language === 'he' ? 'צור חשבון והפעל סנכרון' : 'Create Account & Sync')
                        : (language === 'he' ? 'התחבר לחשבון וסנכרן' : 'Sign In & Sync')}
                    </span>
                  )}
                </button>
              </form>

              <div className="text-center pt-1">
                <button
                  type="button"
                  onClick={() => {
                    setIsRegisterMode(!isRegisterMode);
                    setErrorMsg('');
                  }}
                  className="text-xs text-indigo-600 hover:text-indigo-800 font-bold cursor-pointer"
                >
                  {isRegisterMode 
                    ? (language === 'he' ? 'יש לך כבר חשבון? התחבר כאן' : 'Already have an account? Sign in')
                    : (language === 'he' ? 'אין לך חשבון? הירשם כאן בחינם' : "Don't have an account? Sign up free")}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
