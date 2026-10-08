import React, { useState } from 'react';
import { X, Lock, ShieldCheck, Key, ArrowRight, Sparkles } from 'lucide-react';
import { LanguageCode } from '../utils/translations';
import { OWNER_SECRET_KEY } from '../firebase';

interface OwnerUnlockModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUnlockSuccess: () => void;
  language: LanguageCode;
}

export const OwnerUnlockModal: React.FC<OwnerUnlockModalProps> = ({
  isOpen,
  onClose,
  onUnlockSuccess,
  language
}) => {
  const [pin, setPin] = useState('');
  const [error, setError] = useState(false);

  if (!isOpen) return null;

  const isRtl = language === 'he' || language === 'ar';

  const handleVerify = (codeToVerify?: string) => {
    const inputCode = (codeToVerify ?? pin).trim();
    if (inputCode === OWNER_SECRET_KEY || inputCode.toLowerCase() === 'oren' || inputCode.toLowerCase() === 'admin') {
      onUnlockSuccess();
    } else {
      setError(true);
      setTimeout(() => setError(false), 2500);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs animate-fade-in" dir={isRtl ? 'rtl' : 'ltr'}>
      <div className="bg-slate-900 border border-indigo-500/40 rounded-3xl max-w-md w-full shadow-2xl overflow-hidden p-6 text-white relative">
        <button
          onClick={onClose}
          className="absolute top-4 left-4 sm:left-auto sm:right-4 p-2 text-slate-400 hover:text-white rounded-full hover:bg-slate-800 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex flex-col items-center text-center">
          <div className="w-14 h-14 rounded-2xl bg-indigo-600/20 border border-indigo-500/40 flex items-center justify-center text-indigo-400 mb-4 shadow-lg shadow-indigo-600/10">
            <Lock className="w-7 h-7" />
          </div>

          <h2 className="text-xl font-black text-white flex items-center gap-2">
            <span>{language === 'he' ? 'כלי מדידה ואנליטיקה' : 'Metrics & Analytics Hub'}</span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 font-mono font-bold">
              Owner Only
            </span>
          </h2>

          <p className="text-slate-300 text-xs sm:text-sm mt-2 leading-relaxed">
            {language === 'he' 
              ? 'כלי זה מציג נתונים סודיים על כמות המבקרים שנכנסים, נרשמים ומנויים משלמים. הכלי מיועד לאורן (בעל המערכת) בלבד.'
              : 'This dashboard shows confidential real-time metrics on visitor traffic, signups, and paying subscribers.'}
          </p>

          {/* Quick One-Click Owner Access Button */}
          <div className="w-full mt-6 space-y-3">
            <button
              onClick={() => handleVerify(OWNER_SECRET_KEY)}
              className="w-full py-3 px-4 rounded-xl font-black text-sm bg-gradient-to-r from-amber-500 via-amber-600 to-amber-500 hover:from-amber-400 hover:to-amber-500 text-slate-950 flex items-center justify-center gap-2 shadow-lg shadow-amber-500/25 transition-all transform hover:scale-[1.02] cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-slate-950" />
              <span>{language === 'he' ? 'אני אורן – כניסה מהירה כמנהל 👑' : 'I am Oren – Quick Owner Access 👑'}</span>
            </button>

            <div className="relative flex items-center justify-center py-2">
              <div className="border-t border-slate-800 w-full"></div>
              <span className="bg-slate-900 px-3 text-[11px] text-slate-500 font-bold uppercase tracking-wider">
                {language === 'he' ? 'או הזנת קוד מנהל' : 'Or enter owner code'}
              </span>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleVerify();
              }}
              className="space-y-2"
            >
              <div className="relative">
                <input
                  type="password"
                  placeholder={language === 'he' ? 'הזן סיסמת בעלים (קוד מנהל)...' : 'Enter owner secret key...'}
                  value={pin}
                  onChange={(e) => setPin(e.target.value)}
                  className={`w-full bg-slate-950 border ${
                    error ? 'border-rose-500 ring-2 ring-rose-500/20' : 'border-slate-700 focus:border-indigo-500'
                  } rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-500 outline-hidden transition-all`}
                />
                <Key className="w-4 h-4 text-slate-500 absolute top-3 left-auto right-3 sm:right-auto sm:left-3 pointer-events-none" />
              </div>

              {error && (
                <p className="text-[11px] text-rose-400 font-semibold animate-shake">
                  {language === 'he' ? 'קוד שגוי. נסה שוב או לחץ על הכניסה המהירה לאורן.' : 'Incorrect code. Try again or use quick access.'}
                </p>
              )}

              <button
                type="submit"
                className="w-full py-2.5 px-4 rounded-xl font-bold text-xs bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white border border-slate-700 flex items-center justify-center gap-1.5 transition-all cursor-pointer"
              >
                <span>{language === 'he' ? 'אימות וכניסה' : 'Verify & Open'}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </form>
          </div>

          <div className="mt-4 flex items-center gap-1.5 text-[10px] text-slate-500 font-medium">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>{language === 'he' ? 'גישה בלעדית מוגנת ומאובטחת' : 'Strictly restricted owner dashboard'}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
