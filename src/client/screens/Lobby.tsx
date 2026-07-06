import type { GameRoom } from '../../shared/types';

type LobbyProps = {
  game: GameRoom;
  username: string;
  isJoined: boolean;
  onJoin: () => void;
  onLeave: () => void;
  onStart: () => void;
};

const ROLE_EMOJI: Record<string, string> = {
  spy: '🕵️',
  detective: '🔍',
  citizen: '👤',
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

  return (
    <div className="flex flex-col items-center min-h-screen bg-slate-950 text-white p-4">
      <h1 className="text-3xl font-bold mb-2 mt-8">
        🕵️ Hidden Agents
      </h1>

      <div className="bg-slate-900 rounded-xl p-4 w-full max-w-md mb-4">
        <p className="text-orange-400 text-sm mb-1">TODAY'S MYSTERY</p>
        <p className="text-gray-300 text-sm italic">
          {game.mystery || 'A new mystery awaits...'}
        </p>
      </div>

      <div className="bg-slate-900 rounded-xl p-4 w-full max-w-md mb-4">
        <div className="flex justify-between items-center mb-3">
          <h2 className="text-lg font-semibold">Players</h2>
          <span className="text-sm text-gray-400">
            {playerCount} / 10
          </span>
        </div>

        {players.length === 0 && (
          <p className="text-gray-500 text-center py-4">
            No players yet. Join to start!
          </p>
        )}

        <div className="space-y-2">
          {players.map((player) => (
            <div
              key={player.username}
              className="flex items-center justify-between bg-slate-800 rounded-lg px-3 py-2"
            >
              <div className="flex items-center gap-2">
                <span className="text-lg">{ROLE_EMOJI[player.role] || '👤'}</span>
                <span className="text-sm">
                  {player.username}
                  {player.username === username && (
                    <span className="text-gray-500 ml-1">(you)</span>
                  )}
                </span>
              </div>
              {player.isHost && (
                <span className="text-xs bg-orange-600 rounded px-2 py-0.5">
                  HOST
                </span>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="bg-slate-900 rounded-xl p-4 w-full max-w-md mb-4">
        <div className="flex justify-between text-sm text-gray-400 mb-3">
          <span>Status</span>
          <span className="text-green-400 capitalize">{game.phase}</span>
        </div>
        <div className="flex justify-between text-sm text-gray-400">
          <span>Round</span>
          <span>{game.round}</span>
        </div>
      </div>

      <div className="w-full max-w-md space-y-2">
        {!isJoined ? (
          <button
            onClick={onJoin}
            className="w-full bg-orange-600 hover:bg-orange-700 rounded-lg py-3 text-lg font-semibold transition-colors"
          >
            JOIN GAME
          </button>
        ) : (
          <>
            {canStart && (
              <button
                onClick={onStart}
                className="w-full bg-green-600 hover:bg-green-700 rounded-lg py-3 text-lg font-semibold transition-colors"
              >
                START GAME ({playerCount}/10 players)
              </button>
            )}
            {isHost && playerCount < 4 && (
              <p className="text-center text-yellow-400 text-sm">
                Need at least 4 players to start
              </p>
            )}
            {!isHost && (
              <p className="text-center text-gray-500 text-sm">
                Waiting for host to start the game...
              </p>
            )}
            <button
              onClick={onLeave}
              className="w-full bg-slate-800 hover:bg-slate-700 rounded-lg py-3 text-sm font-semibold transition-colors"
            >
              Leave Game
            </button>
          </>
        )}
      </div>

      <p className="mt-8 text-gray-600 text-xs">
        Reddit Hackathon 2026
      </p>
    </div>
  );
};
