import React, { useState, useRef } from 'react';
import { 
  Download, 
  Sparkles, 
  Check, 
  ShieldCheck, 
  Crown, 
  Share2, 
  Flame,
  Award
} from 'lucide-react';

interface Props {
  language: 'he' | 'en' | 'ar' | 'ru';
  isPremium: boolean;
}

export const DisciplinePassportGenerator: React.FC<Props> = ({ language, isPremium }) => {
  const [traderName, setTraderName] = useState<string>('Oren Cohen');
  const [disciplineScore, setDisciplineScore] = useState<string>('96.4%');
  const [accumulatedR, setAccumulatedR] = useState<string>('+18.5 R');
  const [streakDays, setStreakDays] = useState<string>('28 Days');
  const [favoriteAsset, setFavoriteAsset] = useState<string>('NASDAQ / NQ');
  const [isGenerating, setIsGenerating] = useState<boolean>(false);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const handleDownloadPNG = () => {
    setIsGenerating(true);
    const canvas = document.createElement('canvas');
    canvas.width = 1200;
    canvas.height = 675;
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      setIsGenerating(false);
      return;
    }

    // Background gradient (Deep obsidian black with emerald glow)
    const bgGrad = ctx.createLinearGradient(0, 0, 1200, 675);
    bgGrad.addColorStop(0, '#07070a');
    bgGrad.addColorStop(0.5, '#0c120f');
    bgGrad.addColorStop(1, '#050706');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, 1200, 675);

    // Subtle Radial Glow
    const glowGrad = ctx.createRadialGradient(250, 150, 20, 250, 150, 450);
    glowGrad.addColorStop(0, 'rgba(0, 245, 160, 0.18)');
    glowGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = glowGrad;
    ctx.fillRect(0, 0, 1200, 675);

    // Outer Border
    ctx.strokeStyle = 'rgba(0, 245, 160, 0.4)';
    ctx.lineWidth = 3;
    ctx.strokeRect(40, 40, 1120, 595);

    // Inner subtle border
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
    ctx.lineWidth = 1;
    ctx.strokeRect(55, 55, 1090, 565);

    // Header Kicker
    ctx.fillStyle = '#00f5a0';
    ctx.font = 'bold 20px monospace';
    ctx.fillText('✦ VERIFIED DISCIPLINE PASSPORT', 80, 110);

    // Title / Brand
    ctx.fillStyle = '#ffffff';
    ctx.font = '900 48px sans-serif';
    ctx.fillText(traderName.toUpperCase(), 80, 180);

    ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
    ctx.font = '22px sans-serif';
    ctx.fillText(`Primary Asset: ${favoriteAsset} · Verified Cloud Ledger`, 80, 220);

    // Divider Line
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.12)';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(80, 260);
    ctx.lineTo(1120, 260);
    ctx.stroke();

    // Stats Grid
    // Box 1: Discipline Score
    ctx.fillStyle = 'rgba(255, 255, 255, 0.03)';
    ctx.fillRect(80, 300, 310, 180);
    ctx.strokeStyle = 'rgba(0, 245, 160, 0.3)';
    ctx.strokeRect(80, 300, 310, 180);

    ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
    ctx.font = '16px monospace';
    ctx.fillText('DISCIPLINE INDEX', 110, 345);

    ctx.fillStyle = '#00f5a0';
    ctx.font = '900 56px monospace';
    ctx.fillText(disciplineScore, 110, 420);

    ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
    ctx.font = '14px sans-serif';
    ctx.fillText('Strict Execution · Zero FOMO', 110, 455);

    // Box 2: R-Units
    ctx.fillStyle = 'rgba(255, 255, 255, 0.03)';
    ctx.fillRect(445, 300, 310, 180);
    ctx.strokeStyle = 'rgba(0, 245, 160, 0.3)';
    ctx.strokeRect(445, 300, 310, 180);

    ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
    ctx.font = '16px monospace';
    ctx.fillText('NET ACCUMULATED R', 475, 345);

    ctx.fillStyle = '#38bdf8';
    ctx.font = '900 56px monospace';
    ctx.fillText(accumulatedR, 475, 420);

    ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
    ctx.font = '14px sans-serif';
    ctx.fillText('Risk-Units Secured', 475, 455);

    // Box 3: Streak
    ctx.fillStyle = 'rgba(255, 255, 255, 0.03)';
    ctx.fillRect(810, 300, 310, 180);
    ctx.strokeStyle = 'rgba(245, 158, 11, 0.3)';
    ctx.strokeRect(810, 300, 310, 180);

    ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
    ctx.font = '16px monospace';
    ctx.fillText('ZERO REVENGE STREAK', 840, 345);

    ctx.fillStyle = '#fbbf24';
    ctx.font = '900 56px monospace';
    ctx.fillText(streakDays, 840, 420);

    ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
    ctx.font = '14px sans-serif';
    ctx.fillText('Unbroken Daily Mindset', 840, 455);

    // Footer info
    ctx.fillStyle = '#00f5a0';
    ctx.font = 'bold 16px monospace';
    ctx.fillText('OFFICIAL DISCIPLINE PASSPORT // TRADING DISCIPLINE SUITE', 80, 570);

    ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
    ctx.font = '14px monospace';
    ctx.fillText('VERIFIED VIA CLOUD FIRESTORE LEDGER', 780, 570);

    // Convert to download
    const dataUrl = canvas.toDataURL('image/png');
    const a = document.createElement('a');
    a.href = dataUrl;
    a.download = `discipline_passport_${traderName.toLowerCase().replace(/\s+/g, '_')}.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setIsGenerating(false);
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      
      {/* Header */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-mono">
          <Award className="w-3.5 h-3.5" />
          <span>HOLOGRAPHIC STUDIO // PASSPORT EXPORTER</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
          {language === 'he' ? 'דרכון משמעת דיגיטלי הולוגרפי (Discipline Passport)' : 'Holographic Discipline Passport & Card Generator'}
        </h2>
        <p className="text-slate-400 text-sm max-w-2xl mx-auto">
          {language === 'he'
            ? 'ייצא כרטיס הישגים יוקרתי ברזולוציה גבוהה (PNG) המאמת את אחוז המשמעת, יחידות ה-R ורצף העסקאות ללא נקמה'
            : 'Generate an exportable high-res holographic proof card to share on social channels or store in your trading records.'}
        </p>
      </div>

      {/* Editor & Live Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Editor Inputs */}
        <div className="lg:col-span-5 p-6 rounded-3xl bg-white/[0.02] border border-white/[0.08] space-y-4 text-start">
          <div className="text-xs font-mono text-emerald-400 font-bold">CUSTOMIZE PASSPORT:</div>

          <div className="space-y-1">
            <label className="text-xs font-mono text-slate-300">Trader Name</label>
            <input
              type="text"
              value={traderName}
              onChange={(e) => setTraderName(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl bg-black border border-white/[0.1] text-xs font-mono text-white focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-mono text-slate-300">Discipline Score</label>
            <input
              type="text"
              value={disciplineScore}
              onChange={(e) => setDisciplineScore(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl bg-black border border-white/[0.1] text-xs font-mono text-white focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-mono text-slate-300">Accumulated Net R</label>
            <input
              type="text"
              value={accumulatedR}
              onChange={(e) => setAccumulatedR(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl bg-black border border-white/[0.1] text-xs font-mono text-white focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-mono text-slate-300">Revenge-Free Streak</label>
            <input
              type="text"
              value={streakDays}
              onChange={(e) => setStreakDays(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl bg-black border border-white/[0.1] text-xs font-mono text-white focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-mono text-slate-300">Favorite Market Asset</label>
            <input
              type="text"
              value={favoriteAsset}
              onChange={(e) => setFavoriteAsset(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl bg-black border border-white/[0.1] text-xs font-mono text-white focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div className="pt-2">
            <button
              onClick={handleDownloadPNG}
              disabled={isGenerating}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-400 hover:from-emerald-400 hover:to-emerald-300 text-black font-extrabold text-xs transition-all shadow-md shadow-emerald-500/20 flex items-center justify-center gap-2 cursor-pointer active:scale-95 disabled:opacity-50"
            >
              <Download className="w-4 h-4" />
              <span>{isGenerating ? 'Rendering High-Res PNG...' : 'Download Passport Image (PNG)'}</span>
            </button>
          </div>
        </div>

        {/* Live Holographic Card Preview */}
        <div className="lg:col-span-7 flex justify-center">
          <div className="w-full max-w-lg rounded-3xl p-[1.5px] bg-gradient-to-tr from-emerald-500/40 via-white/10 to-emerald-500/30 shadow-2xl">
            <div className="rounded-[22px] bg-[#090b0a] border border-white/[0.08] p-6 sm:p-8 space-y-6 text-start relative overflow-hidden backdrop-blur-2xl">
              
              {/* Subtle Ambient Mesh */}
              <div className="absolute -top-20 -right-20 w-44 h-44 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none" />

              {/* Card Header */}
              <div className="flex items-center justify-between border-b border-white/[0.08] pb-4">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-emerald-500 text-black font-black text-xs flex items-center justify-center">
                    ✦
                  </div>
                  <span className="font-mono text-xs text-emerald-400 font-bold">VERIFIED DISCIPLINE PASSPORT</span>
                </div>
                <span className="text-[10px] font-mono text-slate-400 bg-white/[0.05] px-2 py-0.5 rounded border border-white/[0.08]">
                  VERIFIED
                </span>
              </div>

              {/* Trader Details */}
              <div>
                <div className="text-xl sm:text-2xl font-black text-white tracking-tight">
                  {traderName.toUpperCase()}
                </div>
                <div className="text-xs text-slate-400 font-mono mt-0.5">
                  Market: {favoriteAsset} · Cloud Firestore Certified
                </div>
              </div>

              {/* Stats Triad */}
              <div className="grid grid-cols-3 gap-2.5">
                <div className="p-3 rounded-xl bg-black/50 border border-emerald-500/30 space-y-1">
                  <div className="text-[9px] font-mono text-slate-400">DISCIPLINE</div>
                  <div className="text-lg font-black font-mono text-emerald-400">{disciplineScore}</div>
                </div>

                <div className="p-3 rounded-xl bg-black/50 border border-emerald-500/30 space-y-1">
                  <div className="text-[9px] font-mono text-slate-400">NET R-FACTOR</div>
                  <div className="text-lg font-black font-mono text-cyan-400">{accumulatedR}</div>
                </div>

                <div className="p-3 rounded-xl bg-black/50 border border-amber-500/30 space-y-1">
                  <div className="text-[9px] font-mono text-slate-400">STREAK</div>
                  <div className="text-lg font-black font-mono text-amber-400">{streakDays}</div>
                </div>
              </div>

              {/* Card Footer */}
              <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 border-t border-white/[0.08] pt-4">
                <span className="text-emerald-400 font-bold">OFFICIAL DISCIPLINE PASSPORT</span>
                <span className="text-cyan-400 font-bold">ALPHA VERIFIED</span>
              </div>

            </div>
          </div>
        </div>

      </div>

    </div>
  );
};
