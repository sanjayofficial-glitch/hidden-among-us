import './index.css';

import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { useGameState } from './hooks/useGameState';
import { Lobby } from './screens/Lobby';

export const App = () => {
  const { game, username, loading, error, joinGame, leaveGame, startGame } =
    useGameState();

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

  const isJoined = !!game.players[username];

  return (
    <Lobby
      game={game}
      username={username}
      isJoined={isJoined}
      onJoin={joinGame}
      onLeave={leaveGame}
      onStart={startGame}
    />
  );
};

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
