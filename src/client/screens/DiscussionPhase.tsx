import { useState, useEffect } from 'react';
import type { GameRoom } from '../../shared/types';

type DiscussionPhaseProps = {
  game: GameRoom;
  username: string;
  onAdvanceToVoting: () => void;
};

export const DiscussionPhase = ({
  game,
  username,
  onAdvanceToVoting,
}: DiscussionPhaseProps) => {
  const [timer, setTimer] = useState(60);
  const player = game.players[username];
  const isHost = game.host === username;

  useEffect(() => {
    if (timer <= 0) {
      if (isHost) {
        onAdvanceToVoting();
      }
      return;
    }

    const interval = setInterval(() => {
      setTimer((t) => t - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [timer, isHost, onAdvanceToVoting]);

  if (!player) return null;

  const investigationResult = game.investigationResult[username];

  return (
    <div className="flex flex-col items-center min-h-screen bg-slate-950 text-white p-4">
      <div className="mt-12 text-center mb-6">
        <p className="text-yellow-400 text-3xl font-bold mb-2">
          💬 DISCUSSION
        </p>
        <p className="text-gray-400 text-sm">Round {game.round}</p>
      </div>

      <div className="bg-slate-900 rounded-xl p-4 w-full max-w-md mb-4 text-center">
        <p className="text-orange-400 text-sm mb-1">MYSTERY</p>
        <p className="text-gray-300 text-sm italic">{game.mystery}</p>
      </div>

      <div className="bg-slate-900 rounded-xl p-4 w-full max-w-md mb-4">
        <div className="flex items-center justify-center gap-3">
          <div className="text-5xl font-bold text-yellow-400">
            {Math.floor(timer / 60)}:{(timer % 60).toString().padStart(2, '0')}
          </div>
        </div>
        <p className="text-gray-500 text-sm text-center mt-2">
          Discuss who the Spy might be!
        </p>
      </div>

      {player.role === 'detective' && investigationResult && (
        <div className="bg-blue-900/30 border border-blue-600 rounded-xl p-4 w-full max-w-md mb-4">
          <p className="text-blue-400 text-sm font-semibold mb-1">
            🔍 INVESTIGATION RESULT
          </p>
          <p className="text-gray-300">
            {(() => {
              const investigatedPlayer = Object.values(game.players).find(
                (p) => p.role === 'detective'
              );
              const actionEntry = Object.entries(game.nightActions).find(
                ([voter]) => investigatedPlayer?.username === voter
              );
              if (actionEntry) {
                return `You investigated ${actionEntry[1]}: They are ${investigationResult === 'spy' ? 'THE SPY!' : 'NOT the Spy.'}`;
              }
              return investigationResult === 'spy'
                ? 'Your target IS the Spy!'
                : 'Your target is NOT the Spy.';
            })()}
          </p>
        </div>
      )}

      <div className="bg-slate-900 rounded-xl p-4 w-full max-w-md mb-4">
        <p className="text-sm font-semibold mb-3">ALIVE PLAYERS</p>
        <div className="space-y-2">
          {game.alivePlayers.map((u) => {
            const p = game.players[u];
            if (!p) return null;
            return (
              <div
                key={u}
                className="flex items-center gap-2 bg-slate-800 rounded-lg px-3 py-2"
              >
                <span className="w-2 h-2 rounded-full bg-green-400" />
                <span className="text-sm">
                  {u}
                  {u === username && (
                    <span className="text-gray-500 ml-1">(you)</span>
                  )}
                </span>
                {u === game.host && (
                  <span className="text-xs bg-orange-600 rounded px-1 ml-auto">
                    HOST
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {game.deadPlayers.length > 0 && (
        <div className="bg-slate-900 rounded-xl p-4 w-full max-w-md mb-4">
          <p className="text-sm font-semibold mb-3 text-red-400">
            ELIMINATED
          </p>
          <div className="space-y-1">
            {game.deadPlayers.map((u) => (
              <div
                key={u}
                className="flex items-center gap-2 bg-slate-800/50 rounded-lg px-3 py-2"
              >
                <span className="w-2 h-2 rounded-full bg-red-400" />
                <span className="text-sm text-gray-500 line-through">{u}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {isHost && (
        <button
          onClick={onAdvanceToVoting}
          className="w-full max-w-md bg-yellow-600 hover:bg-yellow-700 rounded-lg py-3 text-lg font-semibold transition-colors"
        >
          Start Voting
        </button>
      )}
      {!isHost && (
        <p className="text-gray-500 text-sm">
          Waiting for host to start voting...
        </p>
      )}
    </div>
  );
};
