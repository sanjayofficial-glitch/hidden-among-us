import { useState, useEffect } from 'react';

type LeaderboardEntry = {
  username: string;
  score: number;
  citizenWins: number;
  spyWins: number;
  gamesPlayed: number;
};

type LeaderboardProps = {
  onClose: () => void;
};

export const Leaderboard = ({ onClose }: LeaderboardProps) => {
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch('/api/game/leaderboard');
        const data = await res.json();
        if (data.status === 'ok') {
          setEntries(data.entries);
        }
      } catch {
        // ignore
      } finally {
        setLoading(false);
      }
    }
    void load();
  }, []);

  return (
    <div className="flex flex-col items-center min-h-screen bg-slate-950 text-white p-4">
      <div className="mt-12 text-center mb-8">
        <p className="text-3xl font-bold mb-2">🏆 LEADERBOARD</p>
        <p className="text-gray-400 text-sm">Top players all time</p>
      </div>

      <div className="bg-slate-900 rounded-xl p-4 w-full max-w-md">
        {loading ? (
          <p className="text-gray-500 text-center py-8">Loading...</p>
        ) : entries.length === 0 ? (
          <p className="text-gray-500 text-center py-8">
            No games played yet. Be the first!
          </p>
        ) : (
          <div className="space-y-2">
            {entries.map((entry, index) => (
              <div
                key={entry.username}
                className="flex items-center justify-between bg-slate-800 rounded-lg px-3 py-2"
              >
                <div className="flex items-center gap-3">
                  <span
                    className={`text-lg font-bold ${
                      index === 0
                        ? 'text-yellow-400'
                        : index === 1
                          ? 'text-gray-300'
                          : index === 2
                            ? 'text-orange-400'
                            : 'text-gray-500'
                    }`}
                  >
                    #{index + 1}
                  </span>
                  <span className="text-sm">{entry.username}</span>
                </div>
                <div className="flex items-center gap-3 text-xs text-gray-400">
                  <span title="Citizen wins">
                    🛡️ {entry.citizenWins}
                  </span>
                  <span title="Spy wins">
                    🕵️ {entry.spyWins}
                  </span>
                  <span className="text-orange-400 font-bold">
                    {entry.score} pts
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <button
        onClick={onClose}
        className="mt-6 bg-slate-800 hover:bg-slate-700 rounded-lg px-6 py-2 text-sm font-semibold transition-colors"
      >
        Back
      </button>
    </div>
  );
};
