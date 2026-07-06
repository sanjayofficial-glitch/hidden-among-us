import type { GameRoom } from '../../shared/types';

type GameEndProps = {
  game: GameRoom;
  username: string;
  onPlayAgain: () => void;
  onLeave: () => void;
};

const ROLE_EMOJI: Record<string, string> = {
  spy: '🕵️',
  detective: '🔍',
  citizen: '👤',
};

export const GameEnd = ({
  game,
  username,
  onPlayAgain,
  onLeave,
}: GameEndProps) => {
  const player = game.players[username];
  const isSpyWinner = game.winner === 'spy';
  const playerWon =
    player &&
    ((player.role === 'spy' && isSpyWinner) ||
      (player.role !== 'spy' && !isSpyWinner));

  return (
    <div className="flex flex-col items-center min-h-screen bg-slate-950 text-white p-4">
      <div className="mt-12 text-center mb-8">
        <div className="text-6xl mb-4">{isSpyWinner ? '🕵️' : '🛡️'}</div>
        <p
          className={`text-3xl font-bold mb-2 ${
            isSpyWinner ? 'text-red-400' : 'text-green-400'
          }`}
        >
          {isSpyWinner ? 'THE SPY WINS!' : 'CITIZENS WIN!'}
        </p>
        <p className="text-gray-400 text-sm">
          {isSpyWinner
            ? 'The Spy outsmarted everyone and remains hidden.'
            : 'The Spy has been identified and eliminated!'}
        </p>
      </div>

      {player && (
        <div
          className={`w-full max-w-md rounded-xl p-4 mb-4 ${
            playerWon
              ? 'bg-green-900/30 border border-green-600'
              : 'bg-red-900/30 border border-red-600'
          }`}
        >
          <div className="text-center">
            <p className="text-2xl mb-2">{playerWon ? '🎉' : '💔'}</p>
            <p className={`text-lg font-bold ${playerWon ? 'text-green-400' : 'text-red-400'}`}>
              {playerWon ? 'You Won!' : 'You Lost!'}
            </p>
            <p className="text-gray-400 text-sm mt-1">
              You were {player.role === 'spy' ? 'the Spy' : player.role === 'detective' ? 'the Detective' : 'a Citizen'}
            </p>
          </div>
        </div>
      )}

      <div className="bg-slate-900 rounded-xl p-4 w-full max-w-md mb-4">
        <p className="text-sm font-semibold mb-3">ROLES REVEALED</p>
        <div className="space-y-2">
          {Object.values(game.players).map((p) => (
            <div
              key={p.username}
              className="flex items-center justify-between bg-slate-800 rounded-lg px-3 py-2"
            >
              <div className="flex items-center gap-2">
                <span>{ROLE_EMOJI[p.role] ?? '👤'}</span>
                <span className="text-sm">
                  {p.username}
                  {p.username === username && (
                    <span className="text-gray-500 ml-1">(you)</span>
                  )}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span
                  className={`text-xs px-2 py-0.5 rounded ${
                    p.role === 'spy'
                      ? 'bg-red-800 text-red-200'
                      : p.role === 'detective'
                        ? 'bg-blue-800 text-blue-200'
                        : 'bg-gray-700 text-gray-300'
                  }`}
                >
                  {p.role.toUpperCase()}
                </span>
                {!p.alive && (
                  <span className="text-xs text-gray-500">💀</span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-slate-900 rounded-xl p-4 w-full max-w-md mb-6">
        <p className="text-sm font-semibold mb-3">GAME STATS</p>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between text-gray-400">
            <span>Rounds Played</span>
            <span>{game.round}</span>
          </div>
          <div className="flex justify-between text-gray-400">
            <span>Players</span>
            <span>{Object.keys(game.players).length}</span>
          </div>
          <div className="flex justify-between text-gray-400">
            <span>Eliminated</span>
            <span>{game.deadPlayers.length}</span>
          </div>
        </div>
      </div>

      <div className="w-full max-w-md space-y-2">
        <button
          onClick={onPlayAgain}
          className="w-full bg-orange-600 hover:bg-orange-700 rounded-lg py-3 text-lg font-semibold transition-colors"
        >
          Play Again
        </button>
        <button
          onClick={onLeave}
          className="w-full bg-slate-800 hover:bg-slate-700 rounded-lg py-3 text-sm font-semibold transition-colors"
        >
          Leave Game
        </button>
      </div>
    </div>
  );
};
