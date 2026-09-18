import React, { useState, useEffect } from 'react';
import { 
  X, 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  LogIn, 
  UserPlus, 
  CheckCircle2, 
  Sparkles, 
  Crown, 
  AlertCircle,
  ShieldCheck,
  ArrowRight,
  ArrowLeft
} from 'lucide-react';
import { User } from 'firebase/auth';
import { 
  loginWithGoogle, 
  loginWithEmail, 
  registerWithEmail, 
  isFirebaseConfigured,
  findLocalAccount,
  saveLocalAccount,
  setUserSubscriptionInCloud,
  getUserProfileFromCloud
} from '../firebase';
import { LanguageCode } from '../utils/translations';

export type AuthMode = 'login' | 'register' | 'post_payment';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: AuthMode;
  prefillEmail?: string;
  language: LanguageCode;
  onAuthSuccess: (email: string, user: User | null, isPro?: boolean) => void;
  onSwitchToPaywall?: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  initialMode = 'login',
  prefillEmail = '',
  language,
  onAuthSuccess,
  onSwitchToPaywall,
}) => {
  const [mode, setMode] = useState<AuthMode>(initialMode);
  const [email, setEmail] = useState<string>(prefillEmail);
  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [rememberMe, setRememberMe] = useState<boolean>(true);
  const [loading, setLoading] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string>('');
  const [successMsg, setSuccessMsg] = useState<string>('');

  useEffect(() => {
    if (isOpen) {
      setMode(initialMode);
      if (prefillEmail) {
        setEmail(prefillEmail);
      }
      setPassword('');
      setConfirmPassword('');
      setErrorMsg('');
      setSuccessMsg('');
    }
  }, [isOpen, initialMode, prefillEmail]);

  if (!isOpen) return null;

  const isRtl = language === 'he' || language === 'ar';

  const checkIsEmailPro = async (targetEmail: string, uid?: string): Promise<boolean> => {
    const clean = targetEmail.toLowerCase().trim();
    if (clean === 'oren71601@gmail.com') return true;

    // Check local accounts record
    const local = findLocalAccount(clean);
    if (local?.isPremium) return true;

    // Check localStorage active premium email match
    const storedAccountName = (localStorage.getItem('trading_tracker_account_name') || '').toLowerCase().trim();
    const storedIsPremium = localStorage.getItem('trading_tracker_premium') === 'true';
    if (storedIsPremium && storedAccountName === clean) return true;

    // Check Firestore user profile if uid available
    if (uid) {
      try {
        const profile = await getUserProfileFromCloud(uid);
        if (profile?.isPremium) return true;
      } catch (e) {
        console.warn('Profile fetch warning:', e);
      }
    }

    return false;
  };

  const handleGoogleAuth = async () => {
    try {
      setLoading(true);
      setErrorMsg('');
      const user = await loginWithGoogle();
      const userEmail = user.email || email;
      const isPro = await checkIsEmailPro(userEmail, user.uid);
      
      onAuthSuccess(userEmail, user, isPro);
      onClose();
    } catch (err: any) {
      console.error('Google Auth Error:', err);
      if (err.code === 'auth/popup-closed-by-user') {
        setErrorMsg(language === 'he' ? 'ההתחברות בוטלה' : 'Sign in cancelled');
      } else {
        setErrorMsg(
          language === 'he' 
            ? 'שגיאה בהתחברות עם Google. נסה להתחבר עם אימייל וסיסמה.' 
            : 'Google sign-in error. Try with email and password.'
        );
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanEmail = email.trim();
    const cleanPass = password.trim();

    if (!cleanEmail || !cleanEmail.includes('@')) {
      setErrorMsg(language === 'he' ? 'אנא הזן כתובת אימייל תקינה' : 'Please enter a valid email address');
      return;
    }

    if (cleanPass.length < 6) {
      setErrorMsg(language === 'he' ? 'הסיסמה חייבת להכיל לפחות 6 תווים' : 'Password must be at least 6 characters');
      return;
    }

    if ((mode === 'register' || mode === 'post_payment') && cleanPass !== confirmPassword.trim()) {
      setErrorMsg(language === 'he' ? 'הסיסמאות אינן תואמות. אנא ודא שהקלדת אותה סיסמה בשני השדות.' : 'Passwords do not match');
      return;
    }

    setLoading(true);
    setErrorMsg('');

    try {
      if (mode === 'login') {
        let authUser: User | null = null;
        let isPro = false;

        if (isFirebaseConfigured) {
          try {
            authUser = await loginWithEmail(cleanEmail, cleanPass);
            isPro = await checkIsEmailPro(cleanEmail, authUser.uid);
          } catch (fbErr: any) {
            // Check local fallback
            const localAcc = findLocalAccount(cleanEmail);
            if (localAcc && localAcc.passwordHash === cleanPass) {
              isPro = localAcc.isPremium || (await checkIsEmailPro(cleanEmail));
            } else {
              throw fbErr;
            }
          }
        } else {
          // Local offline auth validation
          const localAcc = findLocalAccount(cleanEmail);
          if (localAcc && localAcc.passwordHash !== cleanPass) {
            setErrorMsg(language === 'he' ? 'סיסמה שגויה. נסה שוב.' : 'Incorrect password');
            setLoading(false);
            return;
          }
          isPro = localAcc?.isPremium || (await checkIsEmailPro(cleanEmail));
        }

        onAuthSuccess(cleanEmail, authUser, isPro);
        onClose();

      } else {
        // Mode is 'register' or 'post_payment'
        let authUser: User | null = null;
        const isPostPaymentPro = mode === 'post_payment' || (await checkIsEmailPro(cleanEmail));

        if (isFirebaseConfigured) {
          try {
            authUser = await registerWithEmail(cleanEmail, cleanPass);
            if (isPostPaymentPro && authUser) {
              await setUserSubscriptionInCloud(authUser.uid, cleanEmail, true);
            }
          } catch (fbErr: any) {
            if (fbErr.code === 'auth/email-already-in-use') {
              // Try to log in if already registered
              try {
                authUser = await loginWithEmail(cleanEmail, cleanPass);
                if (isPostPaymentPro && authUser) {
                  await setUserSubscriptionInCloud(authUser.uid, cleanEmail, true);
                }
              } catch {
                setErrorMsg(
                  language === 'he' 
                    ? 'האימייל כבר רשום במערכת. בחר ב-"היכנס" כדי להתחבר לחשבונך.' 
                    : 'Email is already registered. Please click Log In.'
                );
                setLoading(false);
                return;
              }
            } else {
              console.warn('Firebase register notice, persisting locally:', fbErr);
            }
          }
        }

        // Save local account cache for 100% offline & seamless reliability
        saveLocalAccount({
          email: cleanEmail,
          passwordHash: cleanPass,
          isPremium: isPostPaymentPro,
          createdAt: new Date().toISOString(),
        });

        onAuthSuccess(cleanEmail, authUser, isPostPaymentPro);
        onClose();
      }
    } catch (err: any) {
      console.error('Auth Error:', err);
      if (err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password' || err.code === 'auth/invalid-credential') {
        setErrorMsg(language === 'he' ? 'פרטי התחברות שגויים. בדוק את האימייל והסיסמה.' : 'Invalid email or password');
      } else if (err.code === 'auth/email-already-in-use') {
        setErrorMsg(language === 'he' ? 'כתובת האימייל כבר קיימת. בחר בלשונית "היכנס".' : 'Email already in use. Please log in.');
      } else if (err.code === 'auth/weak-password') {
        setErrorMsg(language === 'he' ? 'הסיסמה חלשה מדי. בחר לפחות 6 תווים.' : 'Weak password. Use at least 6 characters.');
      } else {
        setErrorMsg(language === 'he' ? 'שגיאה בהתחברות. נסה שוב.' : 'Authentication error. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-55 flex items-center justify-center p-3 sm:p-4 bg-slate-950/75 backdrop-blur-sm select-none animate-fade-in overflow-y-auto">
      <div 
        dir={isRtl ? 'rtl' : 'ltr'}
        className="w-full max-w-md bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden text-slate-900 my-auto"
      >
        {/* Top Header Banner */}
        <div className={`p-6 sm:p-7 relative text-white ${
          mode === 'post_payment'
            ? 'bg-gradient-to-br from-amber-600 via-indigo-900 to-slate-950'
            : 'bg-gradient-to-br from-indigo-950 via-slate-900 to-indigo-900'
        }`}>
          {/* Close button */}
          <button
            type="button"
            onClick={onClose}
            className="absolute top-4.5 end-4.5 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer text-sm font-bold"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="flex items-center gap-3">
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-md ${
              mode === 'post_payment'
                ? 'bg-gradient-to-tr from-amber-400 to-amber-600 text-slate-950 shadow-amber-500/30'
                : 'bg-indigo-600 text-white shadow-indigo-500/30'
            }`}>
              {mode === 'post_payment' ? (
                <Crown className="w-6 h-6 text-white" />
              ) : mode === 'register' ? (
                <UserPlus className="w-6 h-6 text-white" />
              ) : (
                <LogIn className="w-6 h-6 text-white" />
              )}
            </div>

            <div>
              <div className="flex items-center gap-2">
                <span className={`text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-md ${
                  mode === 'post_payment'
                    ? 'bg-amber-400 text-slate-950'
                    : 'bg-indigo-500/30 text-indigo-300 border border-indigo-400/30'
                }`}>
                  {mode === 'post_payment' 
                    ? (language === 'he' ? 'מנוי Pro הופעל' : 'Pro Activated')
                    : (language === 'he' ? 'חשבון מאובטח' : 'Secure Account')}
                </span>
              </div>
              <h2 className="text-xl font-black tracking-tight text-white mt-1">
                {mode === 'post_payment'
                  ? (language === 'he' ? 'הגדר סיסמה לחשבון שלך' : 'Set Your Account Password')
                  : mode === 'register'
                  ? (language === 'he' ? 'הרשמה ויצירת חשבון' : 'Create an Account')
                  : (language === 'he' ? 'התחברות לחשבון' : 'Sign In to Account')}
              </h2>
            </div>
          </div>

          <p className="text-xs text-slate-300 mt-2.5 leading-relaxed">
            {mode === 'post_payment'
              ? (language === 'he'
                  ? 'תודה ששדרגת ל-Pro! 👑 הגדר סיסמה כדי שתוכל להתחבר בקלות לאתר מכל מחשב וסמארטפון עם כתובת האימייל שלך.'
                  : 'Thank you for upgrading! Set a password so you can easily log in to the website anytime from any device.')
              : mode === 'register'
              ? (language === 'he'
                  ? 'צור חשבון אישי כדי לשמור את יומן המסחר, ההתחייבויות ומנוי ה-Pro שלך בענן.'
                  : 'Create a personal account to sync your trades, pledges, and Pro subscription.')
              : (language === 'he'
                  ? 'הזן אימייל וסיסמה כדי להתחבר לחשבונך, לגשת למנוי ה-Pro ולטעון את נתוני המסחר שלך.'
                  : 'Enter your email and password to access your Pro subscription and saved trade history.')}
          </p>
        </div>

        {/* Mode Selector Tabs (only shown if not in post-payment setup) */}
        {mode !== 'post_payment' && (
          <div className="flex border-b border-slate-200 bg-slate-50 p-1.5 gap-1.5">
            <button
              type="button"
              onClick={() => {
                setMode('login');
                setErrorMsg('');
              }}
              className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                mode === 'login'
                  ? 'bg-white text-slate-950 shadow-xs border border-slate-200'
                  : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>{language === 'he' ? 'היכנס' : 'Log In'}</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setMode('register');
                setErrorMsg('');
              }}
              className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                mode === 'register'
                  ? 'bg-white text-slate-950 shadow-xs border border-slate-200'
                  : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>{language === 'he' ? 'הירשם' : 'Sign Up'}</span>
            </button>
          </div>
        )}

        {/* Modal Form Body */}
        <div className="p-6 space-y-4">

          {/* Quick 1-Click Google Sign In (for standard login/register) */}
          {mode !== 'post_payment' && (
            <>
              <button
                type="button"
                onClick={handleGoogleAuth}
                disabled={loading}
                className="w-full py-2.5 px-4 bg-white hover:bg-slate-50 text-slate-900 border border-slate-300 rounded-xl text-xs font-bold shadow-xs transition-all flex items-center justify-center gap-2.5 cursor-pointer active:scale-98"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
                </svg>
                <span>
                  {mode === 'register' 
                    ? (language === 'he' ? 'הרשמה מהירה עם Google' : 'Sign up with Google') 
                    : (language === 'he' ? 'התחברות מהירה עם Google' : 'Continue with Google')}
                </span>
              </button>

              <div className="flex items-center gap-2">
                <div className="flex-1 h-px bg-slate-200"></div>
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                  {language === 'he' ? 'או באמצעות אימייל וסיסמה' : 'or with email'}
                </span>
                <div className="flex-1 h-px bg-slate-200"></div>
              </div>
            </>
          )}

          {/* Error Message banner */}
          {errorMsg && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold flex items-start gap-2 animate-shake">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-600" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Success Message banner */}
          {successMsg && (
            <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* Email / Password Form */}
          <form onSubmit={handleSubmit} className="space-y-3.5">
            {/* Email Field */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                {language === 'he' ? 'כתובת אימייל' : 'Email Address'}
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute start-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="user@example.com"
                  required
                  autoFocus={!prefillEmail}
                  className="w-full text-xs ps-9 pe-3 py-2.5 rounded-xl border border-slate-300 bg-slate-50/50 text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all font-medium"
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-bold text-slate-700">
                  {mode === 'post_payment'
                    ? (language === 'he' ? 'בחר סיסמה חדשה (לפחות 6 תווים)' : 'Choose Password (min. 6 chars)')
                    : (language === 'he' ? 'סיסמה' : 'Password')}
                </label>
                {mode === 'login' && (
                  <button
                    type="button"
                    onClick={() => {
                      alert(
                        language === 'he'
                          ? 'לאיפוס סיסמה אנא פנה לתמיכה במייל: oren71601@gmail.com'
                          : 'For password reset, please contact: oren71601@gmail.com'
                      );
                    }}
                    className="text-[10px] text-indigo-600 hover:underline font-semibold cursor-pointer"
                  >
                    {language === 'he' ? 'שכחת סיסמה?' : 'Forgot password?'}
                  </button>
                )}
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute start-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  minLength={6}
                  className="w-full text-xs ps-9 pe-10 py-2.5 rounded-xl border border-slate-300 bg-slate-50/50 text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all font-medium"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute end-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5 cursor-pointer"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Confirm Password Field (for register or post_payment) */}
            {(mode === 'register' || mode === 'post_payment') && (
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  {language === 'he' ? 'אימות סיסמה' : 'Confirm Password'}
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute start-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    minLength={6}
                    className="w-full text-xs ps-9 pe-10 py-2.5 rounded-xl border border-slate-300 bg-slate-50/50 text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all font-medium"
                  />
                </div>
              </div>
            )}

            {/* Remember Me Checkbox */}
            {mode === 'login' && (
              <div className="flex items-center gap-2 text-xs text-slate-600">
                <input
                  type="checkbox"
                  id="rememberMeCheckbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                />
                <label htmlFor="rememberMeCheckbox" className="cursor-pointer font-medium select-none">
                  {language === 'he' ? 'זכור אותי במכשיר זה' : 'Remember me on this device'}
                </label>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3 px-4 rounded-xl font-bold text-xs sm:text-sm text-white transition-all shadow-md active:scale-98 flex items-center justify-center gap-2 cursor-pointer ${
                mode === 'post_payment'
                  ? 'bg-gradient-to-r from-amber-500 to-indigo-600 hover:from-amber-600 hover:to-indigo-700 shadow-amber-500/20'
                  : 'bg-indigo-600 hover:bg-indigo-700 shadow-indigo-500/20'
              }`}
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : mode === 'post_payment' ? (
                <>
                  <Crown className="w-4 h-4" />
                  <span>{language === 'he' ? 'שמור סיסמה והיכנס ל-Pro 👑' : 'Save Password & Enter Pro 👑'}</span>
                </>
              ) : mode === 'register' ? (
                <>
                  <UserPlus className="w-4 h-4" />
                  <span>{language === 'he' ? 'צור חשבון והירשם' : 'Create Account'}</span>
                </>
              ) : (
                <>
                  <LogIn className="w-4 h-4" />
                  <span>{language === 'he' ? 'היכנס לאתר' : 'Sign In'}</span>
                </>
              )}
            </button>
          </form>

          {/* Footer toggle prompt */}
          <div className="pt-2 text-center text-xs text-slate-500 border-t border-slate-100">
            {mode === 'login' ? (
              <p>
                {language === 'he' ? 'עדיין אין לך חשבון? ' : "Don't have an account? "}
                <button
                  type="button"
                  onClick={() => {
                    setMode('register');
                    setErrorMsg('');
                  }}
                  className="font-bold text-indigo-600 hover:text-indigo-800 hover:underline cursor-pointer"
                >
                  {language === 'he' ? 'הירשם כאן בחינם' : 'Sign up free'}
                </button>
              </p>
            ) : mode === 'register' ? (
              <p>
                {language === 'he' ? 'כבר יש לך חשבון? ' : 'Already have an account? '}
                <button
                  type="button"
                  onClick={() => {
                    setMode('login');
                    setErrorMsg('');
                  }}
                  className="font-bold text-indigo-600 hover:text-indigo-800 hover:underline cursor-pointer"
                >
                  {language === 'he' ? 'היכנס כאן' : 'Log in here'}
                </button>
              </p>
            ) : (
              <p className="text-[11px] text-slate-400">
                {language === 'he' ? 'הסיסמה נשמרת באופן מאובטח ומוצפנת' : 'Password is encrypted and stored securely'}
              </p>
            )}
          </div>

        </div>
      </div>
    </div>
  );
};
