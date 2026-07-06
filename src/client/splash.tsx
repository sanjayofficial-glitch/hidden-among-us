import './index.css';

import { requestExpandedMode, context } from '@devvit/web/client';
import { StrictMode, useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import type { GameRoom } from '../shared/types';

export const Splash = () => {
  const [playerCount, setPlayerCount] = useState(0);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch('/api/game/state');
        const data = await res.json();
        if (data.status === 'ok') {
          const game = data.game as GameRoom;
          setPlayerCount(Object.keys(game.players).length);
        }
      } catch {
        // fallback to 0
      }
    }
    void load();
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-slate-950 text-white">
      <h1 className="text-5xl font-bold mb-2">
        🕵️ Hidden Agents
      </h1>

      <p className="text-gray-300 mb-10 text-center">
        Someone among you is secretly the Spy...
      </p>

      <div className="bg-slate-900 rounded-xl p-6 w-80 shadow-xl">
        <p className="text-lg mb-2">
          Welcome
        </p>

        <h2 className="text-2xl font-bold mb-6">
          {context.username}
        </h2>

        <div className="flex justify-between mb-4">
          <span>Players Joined</span>
          <span>{playerCount} / 10</span>
        </div>

        <button
          className="w-full bg-orange-600 hover:bg-orange-700 rounded-lg py-3 text-lg font-semibold transition-colors"
          onClick={(e) => requestExpandedMode(e.nativeEvent, "game")}
        >
          JOIN GAME
        </button>
      </div>

      <p className="mt-8 text-gray-500 text-sm">
        Reddit Hackathon 2026
      </p>
    </div>
  );
};

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Splash />
  </StrictMode>
);
