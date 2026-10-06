import React from 'react';
import { 
  Youtube, 
  Send as TelegramIcon, 
  Instagram, 
  Mail, 
  ExternalLink,
  Share2
} from 'lucide-react';
import { SUPPORT_EMAIL } from '../firebase';
import { LanguageCode } from '../utils/translations';

interface SocialLinksProps {
  language: LanguageCode;
  className?: string;
  variant?: 'pills' | 'grid' | 'compact';
}

export const SOCIAL_CHANNELS = [
  {
    name: 'YouTube',
    handle: 'My Discipline Journey',
    url: 'https://youtube.com/@MyDisciplineJourney',
    icon: Youtube,
    color: 'hover:text-red-400 hover:border-red-500/40 hover:bg-red-950/20',
    badge: 'הדרכות וידאו',
    badgeEn: 'Video Guides'
  },
  {
    name: 'Twitter / X',
    handle: '@DisciplineJourn',
    url: 'https://x.com/DisciplineJourn',
    icon: Share2,
    color: 'hover:text-sky-400 hover:border-sky-500/40 hover:bg-sky-950/20',
    badge: 'עדכונים יומיים',
    badgeEn: 'Daily Insights'
  },
  {
    name: 'Telegram',
    handle: 't.me/MyDisciplineJourney',
    url: 'https://t.me/MyDisciplineJourney',
    icon: TelegramIcon,
    color: 'hover:text-blue-400 hover:border-blue-500/40 hover:bg-blue-950/20',
    badge: 'קהילת סוחרים',
    badgeEn: 'Community'
  },
  {
    name: 'Instagram',
    handle: '@mydisciplinejourney',
    url: 'https://instagram.com/mydisciplinejourney',
    icon: Instagram,
    color: 'hover:text-pink-400 hover:border-pink-500/40 hover:bg-pink-950/20',
    badge: 'ציטוטים ומשמעת',
    badgeEn: 'Mindset & Quotes'
  }
];

export const SocialLinks: React.FC<SocialLinksProps> = ({
  language,
  className = '',
  variant = 'pills'
}) => {
  const isRtl = language === 'he' || language === 'ar';

  if (variant === 'compact') {
    return (
      <div className={`flex flex-wrap items-center gap-2 ${className}`}>
        {SOCIAL_CHANNELS.map((item) => {
          const Icon = item.icon;
          return (
            <a
              key={item.name}
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 text-xs font-semibold transition-all ${item.color}`}
              title={`${item.name} (${item.handle})`}
            >
              <Icon className="w-3.5 h-3.5 shrink-0" />
              <span>{item.name}</span>
            </a>
          );
        })}
        <a
          href={`mailto:${SUPPORT_EMAIL}`}
          className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-slate-900 border border-slate-800 text-indigo-400 hover:text-white hover:border-indigo-500/40 text-xs font-semibold transition-all"
          title={`Email: ${SUPPORT_EMAIL}`}
        >
          <Mail className="w-3.5 h-3.5 shrink-0" />
          <span>{language === 'he' ? 'אימייל תמיכה' : 'Support'}</span>
        </a>
      </div>
    );
  }

  return (
    <div className={`space-y-3 ${className}`} dir={isRtl ? 'rtl' : 'ltr'}>
      <div className="flex items-center justify-between gap-2">
        <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
          <span>{language === 'he' ? 'ערוצי קהילה ורשתות חברתיות' : 'Official Channels & Socials'}</span>
        </h4>
        <span className="text-[10px] text-indigo-400 font-bold">@MyDisciplineJourney</span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
        {SOCIAL_CHANNELS.map((item) => {
          const Icon = item.icon;
          return (
            <a
              key={item.name}
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              className={`p-3 rounded-2xl bg-slate-900/80 border border-slate-800 text-slate-300 transition-all flex flex-col items-start justify-between gap-2 group cursor-pointer ${item.color}`}
            >
              <div className="flex items-center justify-between w-full">
                <div className="w-7 h-7 rounded-lg bg-slate-950 flex items-center justify-center text-slate-400 group-hover:text-white border border-slate-800">
                  <Icon className="w-3.5 h-3.5" />
                </div>
                <ExternalLink className="w-3 h-3 text-slate-600 group-hover:text-slate-300" />
              </div>

              <div>
                <div className="font-extrabold text-xs text-white group-hover:text-indigo-200">
                  {item.name}
                </div>
                <div className="text-[10px] text-slate-500 group-hover:text-slate-400 truncate max-w-[120px]">
                  {language === 'he' ? item.badge : item.badgeEn}
                </div>
              </div>
            </a>
          );
        })}
      </div>
    </div>
  );
};
