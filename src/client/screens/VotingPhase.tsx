import { useState } from 'react';
import type { GameRoom } from '../../shared/types';

type VotingPhaseProps = {
  game: GameRoom;
  username: string;
  onSubmitVote: (target: string) => void;
};

export const VotingPhase = ({
  game,
  username,
  onSubmitVote,
}: VotingPhaseProps) => {
  const [selectedTarget, setSelectedTarget] = useState<string | null>(null);
  const player = game.players[username];

  if (!player) return null;

  const hasVoted = game.votes[username] !== undefined;
  const votedCount = Object.keys(game.votes).length;
  const totalAlive = game.alivePlayers.length;

  const targets = game.alivePlayers.filter((u) => u !== username);

  const voteCounts: Record<string, number> = {};
  for (const target of Object.values(game.votes)) {
    voteCounts[target] = (voteCounts[target] ?? 0) + 1;
  }

  if (hasVoted) {
    return (
      <div className="flex flex-col items-center min-h-screen bg-slate-950 text-white p-4">
        <div className="mt-12 text-center mb-6">
          <p className="text-orange-400 text-3xl font-bold mb-2">
            🗳️ VOTING
          </p>
          <p className="text-gray-400 text-sm">Round {game.round}</p>
        </div>

        <div className="bg-slate-900 rounded-xl p-6 w-full max-w-md text-center mb-4">
          <p className="text-4xl mb-3">✋</p>
          <p className="text-gray-300">Vote submitted!</p>
          <p className="text-gray-500 text-sm mt-2">
            {votedCount} / {totalAlive} players voted
          </p>
          <p className="text-yellow-400 text-sm mt-2">
            Waiting for other players to vote...
          </p>
        </div>

        <div className="bg-slate-900 rounded-xl p-4 w-full max-w-md">
          <p className="text-sm font-semibold mb-3">CURRENT VOTES</p>
          <div className="space-y-2">
            {Object.entries(voteCounts).map(([target, count]) => (
              <div
                key={target}
                className="flex items-center justify-between bg-slate-800 rounded-lg px-3 py-2"
              >
                <span className="text-sm">{target}</span>
                <span className="text-orange-400 text-sm font-bold">
                  {count} vote{count !== 1 ? 's' : ''}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center min-h-screen bg-slate-950 text-white p-4">
      <div className="mt-12 text-center mb-6">
        <p className="text-orange-400 text-3xl font-bold mb-2">🗳️ VOTING</p>
        <p className="text-gray-400 text-sm">Round {game.round}</p>
      </div>

      <div className="bg-slate-900 rounded-xl p-4 w-full max-w-md mb-4 text-center">
        <p className="text-gray-300">
          Vote to eliminate the player you suspect is the Spy!
        </p>
        <p className="text-gray-500 text-sm mt-2">
          {votedCount} / {totalAlive} players voted
        </p>
      </div>

      <div className="w-full max-w-md space-y-2 mb-4">
        {targets.map((targetUsername) => {
          const targetPlayer = game.players[targetUsername];
          if (!targetPlayer) return null;
          const currentVotes = voteCounts[targetUsername] ?? 0;

          return (
            <button
              key={targetUsername}
              onClick={() => setSelectedTarget(targetUsername)}
              className={`w-full flex items-center justify-between rounded-lg px-4 py-3 transition-colors ${
                selectedTarget === targetUsername
                  ? 'bg-orange-600 border border-orange-400'
                  : 'bg-slate-800 hover:bg-slate-700'
              }`}
            >
              <span className="text-sm">{targetUsername}</span>
              {currentVotes > 0 && (
                <span className="text-orange-400 text-xs">
                  {currentVotes} vote{currentVotes !== 1 ? 's' : ''}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {selectedTarget && (
        <button
          onClick={() => {
            onSubmitVote(selectedTarget);
            setSelectedTarget(null);
          }}
          className="w-full max-w-md bg-orange-600 hover:bg-orange-700 rounded-lg py-3 text-lg font-semibold transition-colors"
        >
          Vote for {selectedTarget}
        </button>
      )}
    </div>
  );
};
