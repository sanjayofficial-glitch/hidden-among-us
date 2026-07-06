import './index.css';

import { requestExpandedMode, context } from '@devvit/web/client';
import { StrictMode, useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import {
  CustomStyles,
  LivingBackground,
  Avatar,
  LoadingText,
} from './components/DesignSystem';
import type { GameRoom } from '../shared/types';

export const Splash = () => {
  const [playerCount, setPlayerCount] = useState(0);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch('/api/game/state');
        const data = await res.json();
        if (data.status === 'ok') {
          const game = data.game as GameRoom;
          setPlayerCount(Object.keys(game.players).length);
        }
      } catch {
        // fallback to 0
      }
    }
    void load();
  }, []);

  return (
    <>
      <CustomStyles />
      <LivingBackground phase="lobby" />
      <div className="flex flex-col items-center justify-center h-screen px-6 relative z-10">
        <div className="absolute inset-0 bg-aurora opacity-30 mix-blend-screen pointer-events-none" />

        <div className="w-full max-w-sm flex flex-col items-center">
          <div className="relative mb-8 stagger-1">
            <div className="absolute inset-0 bg-orange-500/20 blur-3xl rounded-full scale-150 animate-[breathe_4s_infinite]" />
            <div className="text-8xl filter drop-shadow-[0_0_20px_rgba(255,255,255,0.6)] animate-[ambient-drift_6s_infinite] relative z-10">
              🕵️
            </div>
          </div>

          <h1 className="text-6xl font-black font-display text-transparent bg-clip-text bg-gradient-to-br from-orange-400 to-rose-600 text-center tracking-tighter leading-none mb-4 glow-text-orange stagger-2">
            HIDDEN
            <br />
            AGENTS
          </h1>

          <p className="text-sm font-medium text-blue-200/60 uppercase tracking-[0.2em] mb-12 text-center stagger-3">
            Reddit Undercover
          </p>

          <div className="glass-panel rounded-3xl p-6 w-full flex flex-col items-center relative overflow-hidden stagger-4 mb-8">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-orange-500 to-transparent opacity-50" />

            <Avatar seed="Sherlock" size="lg" />
            <h2 className="text-xl font-bold text-white mt-4 mb-1">
              {context.username}
            </h2>
            <p className="text-xs text-orange-400 font-bold tracking-widest uppercase mb-6">
              Level 1 Agent
            </p>

            <div className="w-full bg-slate-950/50 rounded-xl p-3 border border-white/5 mb-6 flex justify-between items-center">
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />{' '}
                Network Status
              </span>
              <span className="text-xs font-bold text-white">
                {playerCount} Online
              </span>
            </div>

            <button
              className="relative w-full font-display font-bold text-sm tracking-widest uppercase rounded-2xl py-4 px-6 overflow-hidden transition-all duration-300 transform active:scale-95 flex items-center justify-center gap-3 bg-gradient-to-br from-orange-500 to-red-600 text-white shadow-[0_0_20px_rgba(255,69,0,0.4)] border border-orange-400/50 hover:shadow-[0_0_30px_rgba(255,69,0,0.6)] hover:brightness-110 group"
              onClick={(e) =>
                requestExpandedMode(e.nativeEvent, 'game')
              }
            >
              <span className="relative z-10 flex items-center gap-2">
                <span className="text-lg">🔥</span>
                Enter Matchmaking
              </span>
            </button>
          </div>

          <div className="stagger-5 w-full">
            <LoadingText />
          </div>
        </div>
      </div>
    </>
  );
};

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Splash />
  </StrictMode>
);
