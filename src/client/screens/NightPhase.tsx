import { useState } from 'react';
import type { GameRoom } from '../../shared/types';
import { Avatar, PremiumButton } from '../components/DesignSystem';

type NightPhaseProps = {
  game: GameRoom;
  username: string;
  onSubmitAction: (target: string) => void;
};

export const NightPhase = ({
  game,
  username,
  onSubmitAction,
}: NightPhaseProps) => {
  const [selected, setSelected] = useState<string | null>(null);
  const player = game.players[username];

  if (!player) return null;

  const hasSubmitted = game.nightActions[username] !== undefined;
  const isSpy = player.role === 'spy';
  const isCitizen = player.role === 'citizen';

  const targets = game.alivePlayers.filter((u) => u !== username);

  const seedMap: Record<string, string> = {};
  for (const p of Object.values(game.players)) {
    seedMap[p.username] = p.username.slice(0, 8);
  }

  const config = isSpy
    ? {
        title: 'ELIMINATE TARGET',
        color: 'text-red-500',
        btn: 'spy' as const,
        action: 'Eliminate',
        glow: 'shadow-[0_0_30px_rgba(239,68,68,0.5)]',
        border: 'border-red-500',
        ring: 'ring-red-500',
        gradient: 'from-red-500/10',
        bg: 'bg-red-950',
      }
    : {
        title: 'INVESTIGATE SUSPECT',
        color: 'text-blue-500',
        btn: 'det' as const,
        action: 'Investigate',
        glow: 'shadow-[0_0_30px_rgba(14,165,233,0.5)]',
        border: 'border-blue-500',
        ring: 'ring-blue-500',
        gradient: 'from-blue-500/10',
        bg: 'bg-blue-950',
      };

  if (isCitizen) {
    return (
      <div className="flex flex-col h-screen px-4 pt-12 pb-8 max-w-md mx-auto w-full relative z-10">
        <div className="text-center mb-8 stagger-1">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full glass-panel mb-4 shadow-[0_0_20px_rgba(139,92,246,0.3)]">
            <span className="text-3xl animate-[ambient-drift_4s_infinite]">
              🌙
            </span>
          </div>
          <h1 className="text-3xl font-display font-black text-white tracking-widest uppercase mb-1 glow-text-purple">
            Night Phase
          </h1>
          <p className="text-xs text-gray-400 font-medium tracking-[0.2em] uppercase">
            The City Sleeps
          </p>
        </div>
        <div className="glass-panel rounded-2xl p-8 text-center stagger-2">
          <span className="text-5xl mb-4 block">😴</span>
          <p className="text-lg text-gray-300 font-medium mb-2">
            You are sleeping.
          </p>
          <p className="text-sm text-gray-500">
            The Spy and Detective are taking actions...
          </p>
          <p className="text-xs text-gray-600 mt-4 uppercase tracking-widest font-bold">
            Wait for the night to end
          </p>
        </div>
      </div>
    );
  }

  if (hasSubmitted) {
    return (
      <div className="flex flex-col h-screen px-4 pt-12 pb-8 max-w-md mx-auto w-full relative z-10">
        <div className="text-center mb-8 stagger-1">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full glass-panel mb-4 shadow-[0_0_20px_rgba(139,92,246,0.3)]">
            <span className="text-3xl animate-[ambient-drift_4s_infinite]">
              🌙
            </span>
          </div>
          <h1 className="text-3xl font-display font-black text-white tracking-widest uppercase mb-1 glow-text-purple">
            Night Phase
          </h1>
          <p className="text-xs text-gray-400 font-medium tracking-[0.2em] uppercase">
            The City Sleeps
          </p>
        </div>
        <div className="glass-panel rounded-2xl p-8 text-center stagger-2">
          <span className="text-5xl mb-4 block">⏳</span>
          <p className="text-lg text-gray-300 font-medium mb-2">
            Action submitted!
          </p>
          <p className="text-sm text-gray-500">
            Waiting for other players...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen px-4 pt-12 pb-8 max-w-md mx-auto w-full relative z-10">
      <div className="text-center mb-8 stagger-1">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full glass-panel mb-4 shadow-[0_0_20px_rgba(139,92,246,0.3)]">
          <span className="text-3xl animate-[ambient-drift_4s_infinite]">
            🌙
          </span>
        </div>
        <h1 className="text-3xl font-display font-black text-white tracking-widest uppercase mb-1 glow-text-purple">
          Night Phase
        </h1>
        <p className="text-xs text-gray-400 font-medium tracking-[0.2em] uppercase">
          The City Sleeps
        </p>
      </div>

      <div
        className={`glass-panel rounded-2xl p-4 mb-6 text-center border-t-2 ${config.border} stagger-2 relative overflow-hidden`}
      >
        <div
          className={`absolute top-0 left-0 w-full h-full bg-gradient-to-b ${config.gradient} to-transparent pointer-events-none`}
        />
        <p
          className={`text-[10px] font-bold uppercase tracking-widest mb-1 ${config.color}`}
        >
          {config.title}
        </p>
        <p className="text-sm text-gray-300 relative z-10">
          Select a player to {config.action.toLowerCase()} tonight.
        </p>
      </div>

      <div className="space-y-3 flex-1 overflow-y-auto pb-4 px-1 stagger-3">
        {targets.map((targetUsername) => {
          const isSelected = selected === targetUsername;
          return (
            <div
              key={targetUsername}
              onClick={() => setSelected(targetUsername)}
              className={`relative glass-panel rounded-2xl p-3 flex items-center justify-between cursor-pointer transition-all duration-400 ${
                isSelected
                  ? `${config.glow} ${config.border} scale-[1.03] -translate-y-1 bg-white/10`
                  : 'hover:-translate-y-1 hover:bg-white/5'
              }`}
            >
              <div className="flex items-center gap-4 relative z-10">
                <Avatar
                  seed={seedMap[targetUsername] ?? 'Sherlock'}
                  size="md"
                />
                <p
                  className={`text-sm font-bold ${
                    isSelected ? 'text-white' : 'text-gray-300'
                  }`}
                >
                  u/{targetUsername}
                </p>
              </div>
              <div
                className={`w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all duration-300 relative z-10 ${
                  isSelected
                    ? `border-transparent ${config.bg} text-white scale-110`
                    : 'border-white/20 text-transparent scale-90'
                }`}
              >
                {isSelected && (
                  <div
                    className={`absolute inset-0 rounded-full ${config.ring} ring-2 animate-ping opacity-50`}
                  />
                )}
                <span className="relative z-10 font-bold text-sm">✓</span>
              </div>
            </div>
          );
        })}
      </div>

      <div className="stagger-4 pt-2">
        <PremiumButton
          onClick={() => {
            if (selected) onSubmitAction(selected);
          }}
          variant={selected ? config.btn : 'disabled'}
          disabled={!selected}
        >
          {selected
            ? `Confirm ${config.action}`
            : 'Awaiting Selection'}
        </PremiumButton>
      </div>
    </div>
  );
};
