import React, { useState } from 'react';
import { 
  Users, 
  Flame, 
  CheckCircle2, 
  ShieldCheck, 
  TrendingUp, 
  Heart, 
  MessageSquare, 
  Sparkles,
  ArrowRight,
  Filter
} from 'lucide-react';

interface FeedItem {
  id: string;
  traderName: string;
  badge: string;
  date: string;
  disciplineScore: string;
  rOutcome: string;
  category: 'TILT_PREVENTION' | 'FUNDED_PASSED' | 'STREAK' | 'R_ALPHA';
  story: string;
  likes: number;
}

const INITIAL_FEED: FeedItem[] = [
  {
    id: '1',
    traderName: 'Sagi M.',
    badge: 'Pro Trader',
    date: '2 hours ago',
    disciplineScore: '10/10',
    rOutcome: '+0.0R (Saved 3R)',
    category: 'TILT_PREVENTION',
    story: 'Took two quick stop-outs on market open. My old self would have tripled position size on revenge. Instead, I opened Smart Journal, saw my tilt warning, and walked away. Saved at least $1,500.',
    likes: 38
  },
  {
    id: '2',
    traderName: 'Daniel K.',
    badge: 'Funded Master',
    date: '5 hours ago',
    disciplineScore: '9.8/10',
    rOutcome: '+16.4 R',
    category: 'FUNDED_PASSED',
    story: 'Just officially passed Phase 2 of my $100K prop firm challenge! Strictly followed 0.5% risk per trade and only traded A+ setups. No late entries, no gambling.',
    likes: 84
  },
  {
    id: '3',
    traderName: 'Oren Cohen',
    badge: 'Discipline Pioneer',
    date: 'Yesterday',
    disciplineScore: '10/10',
    rOutcome: '+3.8 R',
    category: 'R_ALPHA',
    story: 'Market surged after CPI. I didn’t guess or gamble pre-news. Waited 10 minutes for the institutional retest and executed a clean 1:3.8 risk-to-reward winner.',
    likes: 92
  },
  {
    id: '4',
    traderName: 'Tomer R.',
    badge: '30-Day Streak',
    date: '2 days ago',
    disciplineScore: '9.5/10',
    rOutcome: '+22.1 R',
    category: 'STREAK',
    story: '30 continuous trading days without a single FOMO trade. My equity curve has never looked smoother. When you master your psychology, the numbers take care of themselves.',
    likes: 115
  }
];

interface Props {
  language: 'he' | 'en' | 'ar' | 'ru';
  onLaunchApp: () => void;
}

export const DisciplineCommunityFeed: React.FC<Props> = ({ language, onLaunchApp }) => {
  const [feed, setFeed] = useState<FeedItem[]>(INITIAL_FEED);
  const [activeFilter, setActiveFilter] = useState<string>('ALL');
  const [likedIds, setLikedIds] = useState<string[]>([]);

  const handleToggleLike = (id: string) => {
    if (likedIds.includes(id)) {
      setLikedIds(likedIds.filter(item => item !== id));
      setFeed(feed.map(item => item.id === id ? { ...item, likes: item.likes - 1 } : item));
    } else {
      setLikedIds([...likedIds, id]);
      setFeed(feed.map(item => item.id === id ? { ...item, likes: item.likes + 1 } : item));
    }
  };

  const filteredFeed = activeFilter === 'ALL'
    ? feed
    : feed.filter(item => item.category === activeFilter);

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      
      {/* Header */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-mono">
          <Users className="w-3.5 h-3.5" />
          <span>COMMUNITY FEED // DISCIPLINE RADAR</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
          {language === 'he' ? 'זרם ההצלחות והמשמעת של קהילת הסוחרים' : 'Live Community Discipline & Milestone Feed'}
        </h2>
        <p className="text-slate-400 text-sm max-w-2xl mx-auto">
          {language === 'he'
            ? 'סוחרים אמיתיים שמשתפים ניצחונות פסיכולוגיים, עצירת הפסדים בזמן, ומעבר חשבונות נוסטרו'
            : 'Real traders sharing verified psychological breakthroughs, tilt prevention wins, and R-factor gains.'}
        </p>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center justify-center gap-2 flex-wrap">
        {[
          { id: 'ALL', label: 'All Breakthroughs' },
          { id: 'TILT_PREVENTION', label: 'Tilt Prevention 🛡️' },
          { id: 'FUNDED_PASSED', label: 'Funded Passed 🎯' },
          { id: 'STREAK', label: 'Discipline Streaks 🔥' },
          { id: 'R_ALPHA', label: 'High R-Alpha 📈' }
        ].map(filter => (
          <button
            key={filter.id}
            onClick={() => setActiveFilter(filter.id)}
            className={`px-3 py-1.5 rounded-xl font-mono text-xs font-bold transition-all cursor-pointer border ${
              activeFilter === filter.id
                ? 'bg-emerald-500 text-black border-emerald-500 shadow-md'
                : 'bg-white/[0.03] border-white/[0.08] text-slate-400 hover:text-white'
            }`}
          >
            {filter.label}
          </button>
        ))}
      </div>

      {/* Feed Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-start">
        {filteredFeed.map(item => {
          const isLiked = likedIds.includes(item.id);
          return (
            <div
              key={item.id}
              className="p-6 rounded-2xl bg-white/[0.02] border border-white/[0.07] hover:border-emerald-500/30 transition-all space-y-4 relative overflow-hidden group flex flex-col justify-between"
            >
              <div className="space-y-3">
                
                {/* Author Bar */}
                <div className="flex items-center justify-between border-b border-white/[0.06] pb-3">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-black text-xs flex items-center justify-center font-mono">
                      {item.traderName.slice(0, 1)}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-white text-xs">{item.traderName}</span>
                        <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-1.5 py-0.2 rounded border border-emerald-500/20">
                          {item.badge}
                        </span>
                      </div>
                      <span className="text-[10px] text-slate-500 font-mono">{item.date}</span>
                    </div>
                  </div>

                  <div className="text-end">
                    <div className="text-xs font-mono font-bold text-emerald-400">{item.rOutcome}</div>
                    <div className="text-[10px] font-mono text-slate-400">Score: {item.disciplineScore}</div>
                  </div>
                </div>

                {/* Story Body */}
                <p className="text-xs text-slate-300 leading-relaxed font-sans">
                  "{item.story}"
                </p>

              </div>

              {/* Action Bar */}
              <div className="flex items-center justify-between pt-2 border-t border-white/[0.04] text-xs font-mono">
                <button
                  onClick={() => handleToggleLike(item.id)}
                  className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                    isLiked 
                      ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40' 
                      : 'text-slate-400 hover:text-white bg-white/[0.02]'
                  }`}
                >
                  <Heart className={`w-3.5 h-3.5 ${isLiked ? 'fill-rose-400 text-rose-400' : ''}`} />
                  <span>{item.likes}</span>
                </button>

                <button
                  onClick={onLaunchApp}
                  className="text-emerald-400 hover:text-emerald-300 font-bold flex items-center gap-1 cursor-pointer"
                >
                  <span>Log Your Trade</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>

            </div>
          );
        })}
      </div>

    </div>
  );
};
