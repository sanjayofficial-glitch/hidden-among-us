import type { GameRoom } from '../../shared/types';
import { Avatar, PremiumButton, LoadingText } from '../components/DesignSystem';

type LobbyProps = {
  game: GameRoom;
  username: string;
  isJoined: boolean;
  onJoin: () => void;
  onLeave: () => void;
  onStart: () => void;
};

export const Lobby = ({
  game,
  username,
  isJoined,
  onJoin,
  onLeave,
  onStart,
}: LobbyProps) => {
  const players = Object.values(game.players);
  const playerCount = players.length;
  const isHost = game.host === username;
  const canStart = isHost && playerCount >= 4 && game.phase === 'lobby';

  const seedMap: Record<string, string> = {};
  for (const p of players) {
    seedMap[p.username] = p.username.slice(0, 8);
  }

  return (
    <div className="flex flex-col h-screen px-4 pt-12 pb-8 max-w-md mx-auto w-full relative z-10">
      <header className="flex justify-between items-end mb-6 stagger-1">
        <div>
          <h1 className="text-3xl font-display font-black text-white tracking-tight flex items-center gap-2">
            LOBBY
          </h1>
          <p className="text-xs text-orange-400 font-bold tracking-widest uppercase mt-1">
            Mission #{game.roomId.slice(-8)}
          </p>
        </div>
        <div className="glass-panel px-3 py-1.5 rounded-lg border-orange-500/30">
          <p className="text-[10px] text-gray-400 uppercase tracking-widest text-right">
            Assembling
          </p>
          <p className="text-sm font-bold text-orange-400">
            {playerCount} / 10
          </p>
        </div>
      </header>

      <div className="glass-panel rounded-2xl p-5 mb-6 relative overflow-hidden border-l-4 border-l-orange-500 stagger-2">
        <div className="absolute right-[-10px] top-[-10px] text-6xl opacity-10 rotate-12 blur-[1px]">
          📜
        </div>
        <p className="text-[10px] font-bold text-orange-400 mb-2 tracking-[0.2em] uppercase flex items-center gap-2">
          Current Directive
        </p>
        <p className="text-sm text-gray-200 font-medium leading-relaxed italic relative z-10">
          &ldquo;{game.mystery || 'A mystery awaits...'}&rdquo;
        </p>
      </div>

      <div className="flex-1 min-h-0 flex flex-col mb-4">
        <h2 className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] mb-3 px-1 stagger-3">
          Operatives
        </h2>

        <div className="space-y-3 overflow-y-auto pr-2 pb-4 flex-1">
          {players.map((p, i) => (
            <div
              key={p.username}
              className="glass-panel glass-card-hover rounded-2xl p-3 flex items-center justify-between animate-slide-up-fade"
              style={{
                animationDelay: `${0.3 + i * 0.1}s`,
                animationFillMode: 'both',
              }}
            >
              <div className="flex items-center gap-4">
                <Avatar
                  seed={seedMap[p.username] ?? 'Sherlock'}
                  size="md"
                  isHost={p.isHost}
                  isReady
                  {...(p.isHost ? { glow: 'orange' as const } : {})}
                />
                <div>
                  <p className="text-sm font-bold text-white tracking-wide">
                    u/{p.username}
                    {p.username === username && (
                      <span className="text-gray-500 ml-1 text-xs">
                        (you)
                      </span>
                    )}
                  </p>
                  <p className="text-[10px] uppercase font-bold tracking-widest mt-0.5 text-gray-400">
                    {p.isHost ? 'Host' : 'Ready'}
                  </p>
                </div>
              </div>
              {p.isHost && (
                <div className="w-8 h-8 rounded-full bg-orange-500/20 border border-orange-500/50 flex items-center justify-center text-orange-400">
                  <span className="animate-[breathe_2s_infinite]">👑</span>
                </div>
              )}
            </div>
          ))}

          <div className="glass-panel border-dashed border-white/20 rounded-2xl p-4 flex items-center justify-center h-[76px] stagger-5 opacity-50">
            <span className="text-xs text-gray-500 font-bold uppercase tracking-widest flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-gray-500 animate-ping" />{' '}
              Waiting for agent...
            </span>
          </div>
        </div>
      </div>

      <div className="stagger-5 pt-2">
        {!isJoined ? (
          <PremiumButton onClick={onJoin} icon="🔥">
            Join Game
          </PremiumButton>
        ) : (
          <>
            {canStart && (
              <PremiumButton onClick={onStart} icon="🚀">
                Deploy Team ({playerCount}/10)
              </PremiumButton>
            )}
            {isHost && playerCount < 4 && (
              <p className="text-center text-yellow-400 text-xs font-bold tracking-widest uppercase mb-3">
                Need at least 4 players to start
              </p>
            )}
            {!isHost && (
              <p className="text-center text-gray-500 text-xs font-bold tracking-widest uppercase mb-3">
                Waiting for host to start...
              </p>
            )}
            <PremiumButton onClick={onLeave} variant="secondary" className="text-xs py-3">
              Abort Mission
            </PremiumButton>
          </>
        )}
      </div>

      <div className="mt-4">
        <LoadingText />
      </div>
    </div>
  );
};
