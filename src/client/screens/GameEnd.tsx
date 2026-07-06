import type { GameRoom } from '../../shared/types';
import { Avatar, PremiumButton } from '../components/DesignSystem';

type GameEndProps = {
  game: GameRoom;
  username: string;
  onPlayAgain: () => void;
  onLeave: () => void;
  onLeaderboard: () => void;
};

const ROLE_BADGES: Record<string, { label: string; cls: string }> = {
  spy: { label: 'SPY', cls: 'bg-red-800 text-red-200 border-red-500' },
  detective: {
    label: 'DETECTIVE',
    cls: 'bg-blue-800 text-blue-200 border-blue-500',
  },
  citizen: {
    label: 'CITIZEN',
    cls: 'bg-gray-700 text-gray-300 border-gray-500',
  },
};

export const GameEnd = ({
  game,
  username,
  onPlayAgain,
  onLeave,
  onLeaderboard,
}: GameEndProps) => {
  const player = game.players[username];
  const isSpyWinner = game.winner === 'spy';
  const playerWon =
    player &&
    ((player.role === 'spy' && isSpyWinner) ||
      (player.role !== 'spy' && !isSpyWinner));

  const seedMap: Record<string, string> = {};
  for (const p of Object.values(game.players)) {
    seedMap[p.username] = p.username.slice(0, 8);
  }

  return (
    <div className="flex flex-col h-screen px-4 pt-12 pb-8 max-w-md mx-auto w-full relative z-10 overflow-y-auto">
      <div className="flex flex-col items-center pb-8 pt-4">
        <div className="relative mb-6 stagger-1">
          <div className="absolute inset-0 bg-emerald-500/40 blur-[40px] rounded-full scale-[2] animate-[breathe_3s_infinite]" />
          <div className="text-8xl animate-[ambient-drift_5s_infinite] filter drop-shadow-[0_10px_20px_rgba(0,0,0,0.5)] relative z-10">
            🏆
          </div>
        </div>

        <h1
          className={`text-5xl font-black font-display text-transparent bg-clip-text bg-gradient-to-b mb-2 tracking-tighter filter drop-shadow-lg text-center leading-none stagger-2 ${
            isSpyWinner
              ? 'from-red-300 to-red-600 glow-text-red'
              : 'from-emerald-300 to-emerald-600 glow-text-green'
          }`}
        >
          {isSpyWinner ? 'SPY WINS' : 'CITIZENS WIN'}
        </h1>
        <p
          className={`text-sm mb-10 uppercase tracking-[0.3em] font-bold stagger-3 px-4 py-1.5 rounded-full border ${
            isSpyWinner
              ? 'text-red-300/80 bg-red-950/50 border-red-500/30'
              : 'text-emerald-300/80 bg-emerald-950/50 border-emerald-500/30'
          }`}
        >
          {isSpyWinner
            ? 'The Spy outsmarted everyone'
            : 'The Spy has been eliminated'}
        </p>

        {player && (
          <div
            className={`glass-panel border-t-2 rounded-[2rem] p-6 w-full mb-8 relative overflow-hidden stagger-4 ${
              playerWon
                ? 'border-emerald-500/50 shadow-[0_15px_50px_rgba(16,185,129,0.2)]'
                : 'border-red-500/50 shadow-[0_15px_50px_rgba(239,68,68,0.2)]'
            }`}
          >
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-6 border-b border-white/10 pb-3">
              Your Result
            </p>

            <div className="flex items-center gap-5 mb-6 bg-[#050B14]/40 p-4 rounded-2xl border border-white/5 shadow-inner">
              <Avatar
                seed={seedMap[username] ?? 'Sherlock'}
                size="lg"
                role={player.role}
              />
              <div>
                <h2 className="text-xl font-bold text-white tracking-wide">
                  u/{username}
                </h2>
                <p
                  className={`text-[10px] font-bold uppercase tracking-widest mt-1 inline-block px-2 py-0.5 rounded border ${
                    ROLE_BADGES[player.role]?.cls ?? ''
                  }`}
                >
                  {ROLE_BADGES[player.role]?.label ?? player.role}
                </p>
              </div>
            </div>

            <div className="text-center">
              <p
                className={`text-3xl mb-2 ${
                  playerWon ? 'text-emerald-400' : 'text-red-400'
                }`}
              >
                {playerWon ? '🎉' : '💔'}
              </p>
              <p
                className={`text-lg font-bold ${
                  playerWon ? 'text-emerald-400' : 'text-red-400'
                }`}
              >
                {playerWon ? 'You Won!' : 'You Lost!'}
              </p>
            </div>
          </div>
        )}

        <div className="glass-panel rounded-[2rem] p-6 w-full mb-8 stagger-5">
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-4 border-b border-white/10 pb-3">
            Roles Revealed
          </p>
          <div className="space-y-2">
            {Object.values(game.players).map((p) => {
              const badge = ROLE_BADGES[p.role];
              return (
                <div
                  key={p.username}
                  className="flex items-center justify-between bg-slate-800/50 rounded-xl px-3 py-2"
                >
                  <div className="flex items-center gap-3">
                    <Avatar
                      seed={seedMap[p.username] ?? 'Sherlock'}
                      size="sm"
                      role={p.role}
                      isDead={!p.alive}
                    />
                    <span className="text-sm text-gray-300">
                      u/{p.username}
                      {p.username === username && (
                        <span className="text-gray-500 ml-1 text-xs">
                          (you)
                        </span>
                      )}
                    </span>
                  </div>
                  <span
                    className={`text-[9px] font-bold uppercase tracking-widest px-2 py-0.5 rounded border ${
                      badge?.cls ?? ''
                    }`}
                  >
                    {badge?.label ?? p.role}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        <div className="glass-panel rounded-[2rem] p-6 w-full mb-8 stagger-5">
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-4 border-b border-white/10 pb-3">
            Game Stats
          </p>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between text-gray-400">
              <span>Rounds Played</span>
              <span className="text-white font-bold">{game.round}</span>
            </div>
            <div className="flex justify-between text-gray-400">
              <span>Players</span>
              <span className="text-white font-bold">
                {Object.keys(game.players).length}
              </span>
            </div>
            <div className="flex justify-between text-gray-400">
              <span>Eliminated</span>
              <span className="text-white font-bold">
                {game.deadPlayers.length}
              </span>
            </div>
          </div>
        </div>

        <div className="space-y-3 w-full stagger-5">
          <PremiumButton onClick={onPlayAgain} icon="🔄">
            Play Again
          </PremiumButton>
          <PremiumButton onClick={onLeaderboard} variant="secondary" className="py-3">
            View Global Rankings
          </PremiumButton>
          <PremiumButton onClick={onLeave} variant="secondary" className="py-3 text-xs">
            Leave Game
          </PremiumButton>
        </div>
      </div>
    </div>
  );
};
