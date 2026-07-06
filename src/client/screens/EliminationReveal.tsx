import { useState, useEffect } from 'react';
import type { GameRoom } from '../../shared/types';
import { Avatar, PremiumButton } from '../components/DesignSystem';

type EliminationRevealProps = {
  game: GameRoom;
  onContinue: () => void;
};

type Stage = 'spotlight' | 'boom' | 'role';

export const EliminationReveal = ({
  game,
  onContinue,
}: EliminationRevealProps) => {
  const [stage, setStage] = useState<Stage>('spotlight');

  useEffect(() => {
    const t1 = setTimeout(() => setStage('boom'), 2500);
    const t2 = setTimeout(() => setStage('role'), 3000);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, []);

  if (!game.lastEliminated) {
    return (
      <div className="flex flex-col items-center justify-center h-screen px-6 relative z-10">
        <div className="glass-panel rounded-3xl p-8 text-center max-w-md">
          <span className="text-6xl mb-4 block">🤝</span>
          <h2 className="text-2xl font-bold text-yellow-400 mb-2 font-display">
            NO ELIMINATION
          </h2>
          <p className="text-gray-400 text-sm mb-6">
            Votes were tied. The round continues.
          </p>
          <PremiumButton onClick={onContinue}>Continue</PremiumButton>
        </div>
      </div>
    );
  }

  const eliminatedPlayer = game.players[game.lastEliminated];
  const seedMap: Record<string, string> = {};
  for (const p of Object.values(game.players)) {
    seedMap[p.username] = p.username.slice(0, 8);
  }
  const seed = seedMap[game.lastEliminated] ?? 'Kitty';

  if (stage === 'spotlight') {
    return (
      <div className="fixed inset-0 bg-[#02050A] z-50 flex flex-col items-center justify-center overflow-hidden">
        <div className="absolute top-[-20%] left-1/2 -translate-x-1/2 w-[150vw] h-[150vh] bg-[radial-gradient(circle_at_50%_30%,_rgba(255,255,255,0.15)_0%,_transparent_30%)] pointer-events-none mix-blend-screen animate-[breathe_3s_infinite]" />
        <div className="relative animate-[slide-up-fade_1s_var(--ease-out-expo)_both]">
          <Avatar seed={seed} size="xl" isDead />
        </div>
        <p className="text-white mt-8 font-display font-black text-3xl tracking-widest uppercase relative z-10 animate-[slide-up-fade_1s_var(--ease-out-expo)_0.2s_both]">
          {game.lastEliminated}
        </p>
        <p className="text-gray-500 mt-3 text-xs uppercase tracking-[0.4em] relative z-10 font-bold animate-[slide-up-fade_1s_var(--ease-out-expo)_0.4s_both]">
          Awaiting Verdict...
        </p>
      </div>
    );
  }

  if (stage === 'boom') {
    return <div className="fixed inset-0 bg-red-600 z-50 pointer-events-none" />;
  }

  const ROLE_BADGE: Record<string, { label: string; cls: string }> = {
    spy: { label: 'THE SPY', cls: 'border-red-500 text-red-500 bg-red-950/80' },
    detective: {
      label: 'DETECTIVE',
      cls: 'border-blue-500 text-blue-500 bg-blue-950/80',
    },
    citizen: {
      label: 'CITIZEN',
      cls: 'border-green-500 text-green-500 bg-green-950/80',
    },
  };

  const badge: { label: string; cls: string } = ROLE_BADGE[eliminatedPlayer?.role ?? 'citizen'] ?? { label: 'CITIZEN', cls: 'border-green-500 text-green-500 bg-green-950/80' };

  return (
    <div className="flex flex-col items-center justify-center h-screen px-6 relative z-10 animate-[cinematic-shake_0.5s_ease-out]">
      <div className="absolute inset-0 bg-red-950/80 mix-blend-multiply pointer-events-none" />

      <p className="text-[10px] text-red-300 tracking-[0.4em] font-bold mb-6 uppercase opacity-80">
        Elimination Confirmed
      </p>

      <div className="relative mb-12 flex items-center justify-center animate-[stamp-slam_0.8s_var(--spring)]">
        <div className="absolute inset-0 bg-red-600/40 blur-3xl rounded-full scale-[2] animate-[breathe_2s_infinite]" />
        <Avatar seed={seed} size="xl" isDead />
        <div className="absolute -bottom-6 -right-6 text-7xl z-20 transform rotate-12 filter drop-shadow-[0_10px_20px_rgba(0,0,0,0.8)]">
          💀
        </div>
      </div>

      <div className="text-center mb-10 animate-[slide-up-fade_0.6s_var(--ease-out-expo)_0.3s_both]">
        <h2 className="text-3xl font-bold text-white mb-2 tracking-wide">
          {game.lastEliminated}
        </h2>
        <h3 className="text-sm text-gray-400 font-medium">
          Was eliminated by the town.
        </h3>
      </div>

      <div className="glass-panel border-2 border-red-500 bg-red-950/60 rounded-3xl p-8 w-full transform scale-110 shadow-[0_20px_50px_rgba(239,68,68,0.5)] relative overflow-hidden text-center animate-[slide-up-fade_0.6s_var(--ease-out-expo)_0.6s_both]">
        <p className="text-[10px] text-red-300 uppercase tracking-[0.3em] font-bold mb-3 relative z-10">
          True Identity
        </p>
        <h1
          className={`text-5xl font-black font-display tracking-widest relative z-10 filter drop-shadow-[0_0_15px_rgba(239,68,68,0.8)] border-4 inline-block px-6 py-3 rotate-[-4deg] ${badge.cls}`}
        >
          {badge.label}
        </h1>
      </div>

      <div className="absolute bottom-12 w-full px-6 max-w-sm animate-[slide-up-fade_0.6s_var(--ease-out-expo)_0.9s_both]">
        <PremiumButton onClick={onContinue} variant="primary">
          Continue to Debrief
        </PremiumButton>
      </div>
    </div>
  );
};
