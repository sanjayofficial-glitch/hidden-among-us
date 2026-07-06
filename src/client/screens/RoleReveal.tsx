import type { GameRoom, Role } from '../../shared/types';

type RoleRevealProps = {
  game: GameRoom;
  username: string;
  onContinue: () => void;
};

const ROLE_CONFIG: Record<
  Role,
  { emoji: string; title: string; color: string; bg: string }
> = {
  spy: {
    emoji: '🕵️',
    title: 'THE SPY',
    color: 'text-red-400',
    bg: 'bg-red-900/30 border-red-600',
  },
  detective: {
    emoji: '🔍',
    title: 'THE DETECTIVE',
    color: 'text-blue-400',
    bg: 'bg-blue-900/30 border-blue-600',
  },
  citizen: {
    emoji: '👤',
    title: 'A CITIZEN',
    color: 'text-gray-300',
    bg: 'bg-gray-800/30 border-gray-600',
  },
};

const ROLE_DESCRIPTIONS: Record<Role, string> = {
  spy: 'Eliminate citizens one by one until you equal their number. Stay hidden!',
  detective:
    'Investigate one player each night to uncover the Spy. Share your findings wisely.',
  citizen:
    'Discuss with others, analyze behavior, and vote to find the Spy. Trust no one.',
};

export const RoleReveal = ({
  game,
  username,
  onContinue,
}: RoleRevealProps) => {
  const player = game.players[username];
  if (!player) return null;

  const config = ROLE_CONFIG[player.role];
  const description = ROLE_DESCRIPTIONS[player.role];

  return (
    <div className="flex flex-col items-center min-h-screen bg-slate-950 text-white p-4">
      <div className="mt-12 text-center mb-8">
        <p className="text-gray-400 text-sm mb-2">ROUND {game.round}</p>
        <p className="text-orange-400 text-lg italic">{game.mystery}</p>
      </div>

      <div
        className={`w-full max-w-md rounded-xl border-2 p-6 mb-6 ${config.bg}`}
      >
        <div className="text-center">
          <div className="text-6xl mb-4">{config.emoji}</div>
          <p className={`text-3xl font-bold mb-2 ${config.color}`}>
            {config.title}
          </p>
          <p className="text-gray-300 mt-4">{description}</p>
        </div>
      </div>

      {player.role === 'detective' && (
        <div className="bg-slate-900 rounded-xl p-4 w-full max-w-md mb-4">
          <p className="text-blue-400 text-sm font-semibold mb-2">
            INVESTIGATION INFO
          </p>
          <p className="text-gray-400 text-sm">
            During Night phase, you can investigate one player to learn if they
            are the Spy.
          </p>
        </div>
      )}

      {player.role === 'spy' && (
        <div className="bg-slate-900 rounded-xl p-4 w-full max-w-md mb-4">
          <p className="text-red-400 text-sm font-semibold mb-2">
            SPY INTEL
          </p>
          <p className="text-gray-400 text-sm">
            During Night phase, choose a player to eliminate. If your number
            equals the citizens, you win.
          </p>
        </div>
      )}

      <button
        onClick={onContinue}
        className="w-full max-w-md bg-orange-600 hover:bg-orange-700 rounded-lg py-3 text-lg font-semibold transition-colors"
      >
        Enter the Night
      </button>
    </div>
  );
};
