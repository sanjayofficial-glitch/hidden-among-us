import { useState } from 'react';
import type { GameRoom } from '../../shared/types';

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
  const [selectedTarget, setSelectedTarget] = useState<string | null>(null);
  const player = game.players[username];

  if (!player) return null;

  const hasSubmitted = game.nightActions[username] !== undefined;
  const isSpy = player.role === 'spy';
  const isCitizen = player.role === 'citizen';

  const targets = game.alivePlayers.filter((u) => u !== username);

  if (isCitizen) {
    return (
      <div className="flex flex-col items-center min-h-screen bg-slate-950 text-white p-4">
        <div className="mt-12 text-center mb-8">
          <p className="text-purple-400 text-3xl font-bold mb-2">🌙 NIGHT</p>
          <p className="text-gray-400 text-sm">Round {game.round}</p>
        </div>

        <div className="bg-slate-900 rounded-xl p-6 w-full max-w-md text-center">
          <p className="text-5xl mb-4">😴</p>
          <p className="text-lg text-gray-300">
            You are sleeping. The Spy and Detective are taking actions...
          </p>
          <p className="text-gray-500 text-sm mt-4">
            Wait for the night to end.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center min-h-screen bg-slate-950 text-white p-4">
      <div className="mt-12 text-center mb-6">
        <p className="text-purple-400 text-3xl font-bold mb-2">🌙 NIGHT</p>
        <p className="text-gray-400 text-sm">Round {game.round}</p>
      </div>

      <div
        className={`w-full max-w-md rounded-xl p-4 mb-4 ${
          isSpy
            ? 'bg-red-900/30 border border-red-600'
            : 'bg-blue-900/30 border border-blue-600'
        }`}
      >
        <p
          className={`text-sm font-semibold mb-2 ${
            isSpy ? 'text-red-400' : 'text-blue-400'
          }`}
        >
          {isSpy ? 'SELECT TARGET TO ELIMINATE' : 'SELECT PLAYER TO INVESTIGATE'}
        </p>
        <p className="text-gray-400 text-xs">
          {isSpy
            ? 'Choose a citizen to eliminate this night.'
            : 'Choose a player to learn if they are the Spy.'}
        </p>
      </div>

      {hasSubmitted ? (
        <div className="bg-slate-900 rounded-xl p-6 w-full max-w-md text-center">
          <p className="text-4xl mb-3">⏳</p>
          <p className="text-gray-300">Action submitted!</p>
          <p className="text-gray-500 text-sm mt-2">
            Waiting for other players...
          </p>
        </div>
      ) : (
        <>
          <div className="w-full max-w-md space-y-2 mb-4">
            {targets.map((targetUsername) => {
              const targetPlayer = game.players[targetUsername];
              if (!targetPlayer) return null;

              return (
                <button
                  key={targetUsername}
                  onClick={() => setSelectedTarget(targetUsername)}
                  className={`w-full flex items-center justify-between rounded-lg px-4 py-3 transition-colors ${
                    selectedTarget === targetUsername
                      ? isSpy
                        ? 'bg-red-700 border border-red-400'
                        : 'bg-blue-700 border border-blue-400'
                      : 'bg-slate-800 hover:bg-slate-700'
                  }`}
                >
                  <span className="text-sm">{targetUsername}</span>
                  {targetUsername === username && (
                    <span className="text-xs text-gray-500">(you)</span>
                  )}
                </button>
              );
            })}
          </div>

          {selectedTarget && (
            <button
              onClick={() => {
                onSubmitAction(selectedTarget);
                setSelectedTarget(null);
              }}
              className={`w-full max-w-md rounded-lg py-3 text-lg font-semibold transition-colors ${
                isSpy
                  ? 'bg-red-600 hover:bg-red-700'
                  : 'bg-blue-600 hover:bg-blue-700'
              }`}
            >
              {isSpy ? 'Eliminate' : 'Investigate'} {selectedTarget}
            </button>
          )}
        </>
      )}
    </div>
  );
};
