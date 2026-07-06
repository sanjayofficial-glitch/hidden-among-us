import './index.css';

import { StrictMode, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { useGameState } from './hooks/useGameState';
import { Lobby } from './screens/Lobby';
import { NightPhase } from './screens/NightPhase';
import { DiscussionPhase } from './screens/DiscussionPhase';
import { VotingPhase } from './screens/VotingPhase';
import { GameEnd } from './screens/GameEnd';
import { Leaderboard } from './screens/Leaderboard';

export const App = () => {
  const {
    game,
    username,
    loading,
    error,
    joinGame,
    leaveGame,
    startGame,
    submitNightAction,
    submitVote,
    advanceToNight,
    advanceToVoting,
    refresh,
  } = useGameState();

  const [showLeaderboard, setShowLeaderboard] = useState(false);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-950 text-white">
        <div className="text-center">
          <div className="text-4xl mb-4 animate-pulse">🕵️</div>
          <p className="text-gray-400">Loading game...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-950 text-white">
        <div className="text-center bg-slate-900 rounded-xl p-6">
          <p className="text-red-400 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-orange-600 hover:bg-orange-700 rounded-lg px-4 py-2"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!game) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-950 text-white">
        <p className="text-gray-400">Game not found</p>
      </div>
    );
  }

  if (showLeaderboard) {
    return <Leaderboard onClose={() => setShowLeaderboard(false)} />;
  }

  const isJoined = !!game.players[username];

  if (game.phase === 'lobby') {
    return (
      <div>
        <Lobby
          game={game}
          username={username}
          isJoined={isJoined}
          onJoin={joinGame}
          onLeave={leaveGame}
          onStart={startGame}
        />
        <div className="fixed bottom-4 right-4">
          <button
            onClick={() => setShowLeaderboard(true)}
            className="bg-slate-800 hover:bg-slate-700 rounded-full p-3 shadow-lg transition-colors"
            title="Leaderboard"
          >
            🏆
          </button>
        </div>
      </div>
    );
  }

  if (game.phase === 'night') {
    const hasSubmittedAction =
      game.nightActions[username] !== undefined;
    const player = game.players[username];
    const isNightActive =
      player?.alive && (player.role === 'spy' || player.role === 'detective');

    if (!isNightActive || hasSubmittedAction) {
      return (
        <NightPhase
          game={game}
          username={username}
          onSubmitAction={submitNightAction}
        />
      );
    }

    return (
      <NightPhase
        game={game}
        username={username}
        onSubmitAction={submitNightAction}
      />
    );
  }

  if (game.phase === 'discussion') {
    return (
      <DiscussionPhase
        game={game}
        username={username}
        onAdvanceToVoting={advanceToVoting}
      />
    );
  }

  if (game.phase === 'voting') {
    return (
      <VotingPhase
        game={game}
        username={username}
        onSubmitVote={submitVote}
      />
    );
  }

  if (game.phase === 'reveal') {
    const isHost = game.host === username;

    return (
      <div className="flex flex-col items-center min-h-screen bg-slate-950 text-white p-4">
        <div className="mt-12 text-center mb-8">
          <p className="text-3xl font-bold mb-2">📋 REVEAL</p>
          <p className="text-gray-400 text-sm">Round {game.round}</p>
        </div>

        {game.lastEliminated ? (
          <div className="bg-red-900/30 border border-red-600 rounded-xl p-6 w-full max-w-md text-center mb-6">
            <p className="text-4xl mb-3">💀</p>
            <p className="text-xl text-red-400 font-bold">
              {game.lastEliminated}
            </p>
            <p className="text-gray-400 text-sm mt-2">
              Was eliminated. They were a{' '}
              <span className="font-bold capitalize">
                {game.lastEliminatedRole}
              </span>
              .
            </p>
          </div>
        ) : (
          <div className="bg-slate-900 rounded-xl p-6 w-full max-w-md text-center mb-6">
            <p className="text-4xl mb-3">🤝</p>
            <p className="text-xl text-yellow-400 font-bold">NO ELIMINATION</p>
            <p className="text-gray-400 text-sm mt-2">
              Votes were tied. The round continues.
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
                  <span className="text-sm">{u}</span>
                </div>
              );
            })}
          </div>
        </div>

        {isHost && (
          <button
            onClick={advanceToNight}
            className="w-full max-w-md bg-purple-600 hover:bg-purple-700 rounded-lg py-3 text-lg font-semibold transition-colors"
          >
            Next Round → Night
          </button>
        )}
        {!isHost && (
          <p className="text-gray-500 text-sm">
            Waiting for host to start next round...
          </p>
        )}
      </div>
    );
  }

  if (game.phase === 'ended') {
    return (
      <GameEnd
        game={game}
        username={username}
        onPlayAgain={async () => {
          await startGame();
          void refresh();
        }}
        onLeave={leaveGame}
      />
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-slate-950 text-white">
      <p className="text-gray-400">Unknown game state</p>
    </div>
  );
};

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
