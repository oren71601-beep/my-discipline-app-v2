import React, { useState, useRef, useEffect } from 'react';
import { 
  Volume2, 
  VolumeX, 
  Play, 
  Pause, 
  Sparkles, 
  Radio, 
  Bell, 
  Sliders, 
  Activity,
  CheckCircle2,
  Waves
} from 'lucide-react';

interface Props {
  language: 'he' | 'en' | 'ar' | 'ru';
}

export const AmbientFocusAudioLab: React.FC<Props> = ({ language }) => {
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [activeMode, setActiveMode] = useState<'432hz' | 'brown_noise' | 'alpha_binaural'>('432hz');
  const [volume, setVolume] = useState<number>(0.25);
  const [chimePlayed, setChimePlayed] = useState<boolean>(false);

  // Audio Context and Nodes Ref
  const audioCtxRef = useRef<AudioContext | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);
  const activeNodesRef = useRef<any[]>([]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopAudio();
      if (audioCtxRef.current && audioCtxRef.current.state !== 'closed') {
        audioCtxRef.current.close().catch(() => {});
      }
    };
  }, []);

  const initAudio = () => {
    if (!audioCtxRef.current) {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      audioCtxRef.current = new AudioCtx();
    }
    if (audioCtxRef.current.state === 'suspended') {
      audioCtxRef.current.resume();
    }
  };

  const stopAudio = () => {
    activeNodesRef.current.forEach(node => {
      try {
        if (node.stop) node.stop();
        if (node.disconnect) node.disconnect();
      } catch (e) {}
    });
    activeNodesRef.current = [];
    setIsPlaying(false);
  };

  const startAudio = (mode: '432hz' | 'brown_noise' | 'alpha_binaural') => {
    initAudio();
    stopAudio();

    const ctx = audioCtxRef.current;
    if (!ctx) return;

    const masterGain = ctx.createGain();
    masterGain.gain.setValueAtTime(volume, ctx.currentTime);
    masterGain.connect(ctx.destination);
    gainNodeRef.current = masterGain;

    if (mode === '432hz') {
      // Harmonic 432Hz sine wave with gentle overtone at 864Hz and 216Hz sub
      const oscRoot = ctx.createOscillator();
      oscRoot.type = 'sine';
      oscRoot.frequency.setValueAtTime(432, ctx.currentTime);

      const oscSub = ctx.createOscillator();
      oscSub.type = 'sine';
      oscSub.frequency.setValueAtTime(216, ctx.currentTime);

      const oscOvertone = ctx.createOscillator();
      oscOvertone.type = 'triangle';
      oscOvertone.frequency.setValueAtTime(864, ctx.currentTime);

      const subGain = ctx.createGain();
      subGain.gain.setValueAtTime(0.4, ctx.currentTime);

      const overGain = ctx.createGain();
      overGain.gain.setValueAtTime(0.15, ctx.currentTime);

      oscRoot.connect(masterGain);
      oscSub.connect(subGain);
      subGain.connect(masterGain);
      oscOvertone.connect(overGain);
      overGain.connect(masterGain);

      oscRoot.start();
      oscSub.start();
      oscOvertone.start();

      activeNodesRef.current = [oscRoot, oscSub, oscOvertone, subGain, overGain, masterGain];
    } else if (mode === 'alpha_binaural') {
      // Binaural beat: Left ear 200Hz, Right ear 210Hz (10Hz Alpha brainwave difference)
      const merger = ctx.createChannelMerger(2);

      const oscL = ctx.createOscillator();
      oscL.type = 'sine';
      oscL.frequency.setValueAtTime(200, ctx.currentTime);

      const oscR = ctx.createOscillator();
      oscR.type = 'sine';
      oscR.frequency.setValueAtTime(210, ctx.currentTime); // 10Hz Alpha difference

      oscL.connect(merger, 0, 0); // left channel
      oscR.connect(merger, 0, 1); // right channel
      merger.connect(masterGain);

      oscL.start();
      oscR.start();

      activeNodesRef.current = [oscL, oscR, merger, masterGain];
    } else if (mode === 'brown_noise') {
      // Synthetic Brown Noise (smooth integrated white noise)
      const bufferSize = ctx.sampleRate * 2;
      const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const output = noiseBuffer.getChannelData(0);
      let lastOut = 0.0;
      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        output[i] = (lastOut + (0.02 * white)) / 1.02;
        lastOut = output[i];
        output[i] *= 3.5; // Gain compensation
      }

      const whiteNoise = ctx.createBufferSource();
      whiteNoise.buffer = noiseBuffer;
      whiteNoise.loop = true;

      const lowpass = ctx.createBiquadFilter();
      lowpass.type = 'lowpass';
      lowpass.frequency.setValueAtTime(320, ctx.currentTime);

      whiteNoise.connect(lowpass);
      lowpass.connect(masterGain);
      whiteNoise.start();

      activeNodesRef.current = [whiteNoise, lowpass, masterGain];
    }

    setIsPlaying(true);
  };

  const handleTogglePlay = () => {
    if (isPlaying) {
      stopAudio();
    } else {
      startAudio(activeMode);
    }
  };

  const handleModeChange = (mode: '432hz' | 'brown_noise' | 'alpha_binaural') => {
    setActiveMode(mode);
    if (isPlaying) {
      startAudio(mode);
    }
  };

  const handleVolumeChange = (newVol: number) => {
    setVolume(newVol);
    if (gainNodeRef.current && audioCtxRef.current) {
      gainNodeRef.current.gain.setValueAtTime(newVol, audioCtxRef.current.currentTime);
    }
  };

  // Play a soothing Tibetan singing bowl chime (Discipline Bell)
  const playDisciplineBell = () => {
    initAudio();
    const ctx = audioCtxRef.current;
    if (!ctx) return;

    const chimeGain = ctx.createGain();
    chimeGain.gain.setValueAtTime(0.4, ctx.currentTime);
    chimeGain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 3.5);
    chimeGain.connect(ctx.destination);

    // Fundamental + Harmonics
    [528, 1056, 1584, 2112].forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, ctx.currentTime);

      const harmonicGain = ctx.createGain();
      harmonicGain.gain.setValueAtTime(0.3 / (idx + 1), ctx.currentTime);
      harmonicGain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 3.0);

      osc.connect(harmonicGain);
      harmonicGain.connect(chimeGain);
      osc.start();
      osc.stop(ctx.currentTime + 3.5);
    });

    setChimePlayed(true);
    setTimeout(() => setChimePlayed(false), 2000);
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      
      {/* Header */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-mono">
          <Waves className="w-3.5 h-3.5" />
          <span>HIGGSFIELD AUDIO LAB // BIOFEEDBACK FOCUS SYNTHESIZER</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
          {language === 'he' ? 'מעבדת שמע וריכוז מנטלי: צלילי אלפא ו-432Hz' : 'Ambient Focus Audio Lab & Mindset Soundscape'}
        </h2>
        <p className="text-slate-400 text-sm max-w-2xl mx-auto">
          {language === 'he'
            ? 'מחולל גלי מוח וצלילי מיקוד ישירות מהדפדפן להפחתת דופק, חסימת רעשי רקע וכניסה למצב Flow בזמן המסחר'
            : 'Generative Web Audio binaural beats and soothing soundscapes designed to stabilize heart rate and eliminate emotional trading impulses.'}
        </p>
      </div>

      {/* Main Synthesizer Console */}
      <div className="rounded-3xl bg-white/[0.02] border border-white/[0.08] p-6 sm:p-8 backdrop-blur-xl space-y-8">
        
        {/* Mode Selector */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          
          <button
            onClick={() => handleModeChange('432hz')}
            className={`p-4 rounded-2xl border text-start transition-all cursor-pointer flex flex-col justify-between gap-3 ${
              activeMode === '432hz'
                ? 'bg-emerald-500/15 border-emerald-500 text-white shadow-lg shadow-emerald-500/10'
                : 'bg-white/[0.02] border-white/[0.08] text-slate-300 hover:border-white/20'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="font-mono text-xs text-emerald-400 font-bold">432Hz ZEN DRONE</span>
              {activeMode === '432hz' && isPlaying && (
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              )}
            </div>
            <div>
              <div className="text-sm font-bold">Sacred Harmonic Tuning</div>
              <p className="text-xs text-slate-400 mt-1">
                Relaxes sympathetic nervous system, lowering blood pressure and impulsive urges.
              </p>
            </div>
          </button>

          <button
            onClick={() => handleModeChange('alpha_binaural')}
            className={`p-4 rounded-2xl border text-start transition-all cursor-pointer flex flex-col justify-between gap-3 ${
              activeMode === 'alpha_binaural'
                ? 'bg-emerald-500/15 border-emerald-500 text-white shadow-lg shadow-emerald-500/10'
                : 'bg-white/[0.02] border-white/[0.08] text-slate-300 hover:border-white/20'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="font-mono text-xs text-teal-400 font-bold">10Hz ALPHA WAVES</span>
              {activeMode === 'alpha_binaural' && isPlaying && (
                <span className="w-2 h-2 rounded-full bg-teal-400 animate-ping" />
              )}
            </div>
            <div>
              <div className="text-sm font-bold">Binaural Flow State</div>
              <p className="text-xs text-slate-400 mt-1">
                Synchronizes left and right brain hemispheres for peak analytical focus.
              </p>
            </div>
          </button>

          <button
            onClick={() => handleModeChange('brown_noise')}
            className={`p-4 rounded-2xl border text-start transition-all cursor-pointer flex flex-col justify-between gap-3 ${
              activeMode === 'brown_noise'
                ? 'bg-emerald-500/15 border-emerald-500 text-white shadow-lg shadow-emerald-500/10'
                : 'bg-white/[0.02] border-white/[0.08] text-slate-300 hover:border-white/20'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="font-mono text-xs text-cyan-400 font-bold">DEEP BROWN NOISE</span>
              {activeMode === 'brown_noise' && isPlaying && (
                <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
              )}
            </div>
            <div>
              <div className="text-sm font-bold">Acoustic Shield</div>
              <p className="text-xs text-slate-400 mt-1">
                Low-frequency waterfall drone that masks distracting sounds and terminal noise.
              </p>
            </div>
          </button>

        </div>

        {/* Master Control Bar */}
        <div className="p-6 rounded-2xl bg-[#09090e] border border-white/[0.08] flex flex-col sm:flex-row items-center justify-between gap-6">
          
          {/* Main Play / Stop */}
          <div className="flex items-center gap-4">
            <button
              onClick={handleTogglePlay}
              className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all cursor-pointer shadow-xl ${
                isPlaying
                  ? 'bg-rose-500 hover:bg-rose-600 text-white shadow-rose-500/20'
                  : 'bg-gradient-to-r from-emerald-500 to-emerald-400 hover:from-emerald-400 hover:to-emerald-300 text-black shadow-emerald-500/20 active:scale-95'
              }`}
            >
              {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6 fill-black ml-0.5" />}
            </button>

            <div className="text-start">
              <div className="text-xs font-mono text-slate-400 uppercase">SYNTHESIZER STATUS</div>
              <div className="text-base font-bold text-white flex items-center gap-2">
                <span>{isPlaying ? 'Audio Stream Active' : 'Synthesizer Standby'}</span>
                {isPlaying && <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />}
              </div>
            </div>
          </div>

          {/* Volume Control */}
          <div className="flex items-center gap-3 w-full sm:w-64">
            <Volume2 className="w-4 h-4 text-slate-400 shrink-0" />
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={volume}
              onChange={(e) => handleVolumeChange(parseFloat(e.target.value))}
              className="w-full accent-emerald-400 bg-white/10 rounded-lg h-2 cursor-pointer"
            />
            <span className="text-xs font-mono text-slate-300 w-10 text-end">
              {Math.round(volume * 100)}%
            </span>
          </div>

          {/* Discipline Reset Chime (Singing Bowl) */}
          <button
            onClick={playDisciplineBell}
            className={`px-4 py-2.5 rounded-xl border font-mono text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
              chimePlayed
                ? 'bg-amber-400 text-black border-amber-400 shadow-lg shadow-amber-400/20'
                : 'bg-white/[0.04] hover:bg-white/[0.08] text-amber-300 border-amber-500/30'
            }`}
            title="Play Tibetan singing bowl chime to interrupt racing thoughts"
          >
            <Bell className="w-4 h-4 text-amber-400" />
            <span>{chimePlayed ? 'Chime Active 🔔' : 'Ring Reset Bell 🔔'}</span>
          </button>

        </div>

      </div>

    </div>
  );
};
