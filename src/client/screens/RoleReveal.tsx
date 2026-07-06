import { useState, useEffect } from 'react';
import type { GameRoom, Role } from '../../shared/types';
import { Avatar, PremiumButton } from '../components/DesignSystem';

type RoleRevealProps = {
  game: GameRoom;
  username: string;
  onContinue: () => void;
};

type Stage = 'blackout' | 'scan' | 'boom';

const ROLE_CONFIG: Record<
  Role,
  {
    title: string;
    icon: string;
    color: string;
    glow: string;
    bg: string;
    border: string;
    shadow: string;
    desc: string;
    btn: 'spy' | 'det' | 'primary';
  }
> = {
  spy: {
    title: 'THE SPY',
    icon: '🕵️',
    color: 'text-red-500',
    glow: 'glow-text-red',
    bg: 'bg-red-950/50',
    border: 'border-red-500',
    shadow: 'shadow-[0_0_50px_rgba(239,68,68,0.6)]',
    desc: 'Eliminate citizens one by one. Survive until you equal their numbers.',
    btn: 'spy',
  },
  detective: {
    title: 'DETECTIVE',
    icon: '🔍',
    color: 'text-blue-500',
    glow: 'glow-text-blue',
    bg: 'bg-blue-950/50',
    border: 'border-blue-500',
    shadow: 'shadow-[0_0_50px_rgba(14,165,233,0.6)]',
    desc: 'Investigate players at night to discover the Spy. Lead the vote.',
    btn: 'det',
  },
  citizen: {
    title: 'CITIZEN',
    icon: '👤',
    color: 'text-green-500',
    glow: 'glow-text-green',
    bg: 'bg-green-950/50',
    border: 'border-green-500',
    shadow: 'shadow-[0_0_50px_rgba(16,185,129,0.6)]',
    desc: 'Discuss with others, analyze behavior, and vote to find the Spy.',
    btn: 'primary',
  },
};

export const RoleReveal = ({
  game,
  username,
  onContinue,
}: RoleRevealProps) => {
  const [stage, setStage] = useState<Stage>('blackout');
  const player = game.players[username];

  useEffect(() => {
    const t1 = setTimeout(() => setStage('scan'), 1500);
    const t2 = setTimeout(() => setStage('boom'), 3500);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, []);

  if (!player) return null;

  const config = ROLE_CONFIG[player.role];

  if (stage !== 'boom') {
    return (
      <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#050B14]">
        <p className="text-[10px] text-gray-500 tracking-[0.5em] font-bold mb-12 uppercase animate-pulse">
          Decrypting Identity...
        </p>
        <div className="relative w-32 h-32 flex items-center justify-center">
          {player.role === 'spy' ? (
            <div className="absolute inset-0 bg-red-600 rounded-full blur-xl animate-[heartbeat_1s_infinite]" />
          ) : (
            <div className="absolute inset-0 rounded-full border border-blue-500/30 overflow-hidden">
              <div className="absolute top-1/2 left-1/2 w-[200%] h-[200%] bg-gradient-to-tr from-transparent via-blue-500/50 to-transparent origin-top-left animate-[radar-sweep_1.5s_linear_infinite]" />
            </div>
          )}
          <span className="text-4xl relative z-10 opacity-50">❓</span>
        </div>
      </div>
    );
  }

  const seedMap: Record<string, string> = {};
  for (const p of Object.values(game.players)) {
    seedMap[p.username] = p.username.slice(0, 8);
  }

  return (
    <div className="flex flex-col items-center justify-center h-screen px-6 relative z-10 animate-[cinematic-shake_0.5s_ease-out]">
      <div
        className={`absolute inset-0 ${config.bg} mix-blend-overlay pointer-events-none`}
      />
      <div
        className={`absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] pointer-events-none ${
          player.role === 'spy'
            ? 'from-red-900/60'
            : player.role === 'detective'
              ? 'from-blue-900/60'
              : 'from-green-900/60'
        } via-transparent to-transparent`}
      />

      <p className="text-[10px] text-white tracking-[0.5em] font-bold mb-12 uppercase animate-pulse opacity-80">
        Identity Confirmed
      </p>

      <div className="relative w-56 h-56 mb-12 flex items-center justify-center animate-[stamp-slam_0.8s_var(--spring)]">
        <div
          className={`absolute inset-0 border-2 ${config.border} rounded-3xl rotate-3`}
        />
        <div
          className={`absolute inset-0 border-2 ${config.border} rounded-3xl -rotate-3 opacity-50`}
        />
        <div
          className={`absolute inset-0 ${config.bg} rounded-3xl blur-2xl ${config.shadow} animate-[breathe_3s_infinite]`}
        />
        <Avatar seed={seedMap[username] ?? 'Sherlock'} size="xl" role={player.role} />
      </div>

      <div className="text-center mb-12 animate-[slide-up-fade_0.6s_var(--ease-out-expo)_0.3s_both]">
        <h2 className="text-sm text-gray-300 mb-2 uppercase tracking-widest font-bold">
          You Are
        </h2>
        <h1
          className={`text-6xl font-black font-display tracking-tighter mb-6 ${config.color} ${config.glow}`}
        >
          {config.title}
        </h1>

        <div className="glass-panel p-5 rounded-2xl max-w-[280px] mx-auto">
          <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3 border-b border-white/10 pb-2">
            Directives
          </h3>
          <p className="text-gray-200 text-sm font-medium leading-relaxed">
            {config.desc}
          </p>
        </div>
      </div>

      <div className="w-full max-w-sm absolute bottom-12 animate-[slide-up-fade_0.6s_var(--ease-out-expo)_0.6s_both]">
        <PremiumButton onClick={onContinue} variant={config.btn}>
          Acknowledge
        </PremiumButton>
      </div>
    </div>
  );
};
