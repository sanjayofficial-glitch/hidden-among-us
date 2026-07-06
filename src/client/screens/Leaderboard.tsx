import { useState, useEffect } from 'react';
import { Avatar, PremiumButton } from '../components/DesignSystem';

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

  const top3 = entries.slice(0, 3);
  const rest = entries.slice(3);

  const seedMap: Record<string, string> = {};
  for (const e of entries) {
    seedMap[e.username] = e.username.slice(0, 8);
  }

  return (
    <div className="flex flex-col h-screen px-4 pt-12 max-w-md mx-auto w-full relative z-10 overflow-hidden">
      <div className="text-center mb-10 stagger-1">
        <h1 className="text-4xl font-display font-black text-white mb-2 tracking-tight drop-shadow-lg">
          🏆 HALL OF FAME
        </h1>
        <p className="text-xs text-orange-400 uppercase tracking-[0.3em] font-bold bg-orange-950/50 px-4 py-1.5 rounded-full inline-block border border-orange-500/30">
          Global Rankings
        </p>
      </div>

      {loading ? (
        <div className="text-center py-12">
          <span className="text-4xl block mb-4 animate-pulse">🏆</span>
          <p className="text-gray-500 text-sm">Loading rankings...</p>
        </div>
      ) : entries.length === 0 ? (
        <div className="text-center py-12">
          <span className="text-4xl block mb-4">🏆</span>
          <p className="text-gray-500 text-sm">
            No games played yet. Be the first!
          </p>
        </div>
      ) : (
        <>
          <div className="flex justify-center items-end gap-1 mb-6 h-56 px-2 stagger-2">
            {top3[1] && (
              <div className="flex flex-col items-center w-[30%] relative z-10 group cursor-pointer hover:-translate-y-2 transition-transform duration-300">
                <Avatar
                  seed={seedMap[top3[1].username] ?? 'Pro'}
                  size="md"
                />
                <p className="text-[9px] text-gray-300 font-bold uppercase tracking-widest truncate w-full text-center mt-3 mb-2">
                  u/{top3[1].username}
                </p>
                <div className="w-full bg-gradient-to-t from-[#050B14] to-slate-700 h-24 rounded-t-2xl flex justify-center pt-3 border-t-2 border-slate-400 shadow-[0_0_20px_rgba(0,0,0,0.8)] relative overflow-hidden">
                  <div className="absolute inset-0 bg-white/5" />
                  <span className="text-slate-200 font-black text-2xl font-display opacity-80">
                    2
                  </span>
                </div>
              </div>
            )}

            {top3[0] && (
              <div className="flex flex-col items-center w-[40%] relative z-20 group cursor-pointer hover:-translate-y-2 transition-transform duration-300">
                <div className="relative mb-3">
                  <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 text-4xl z-20 animate-[breathe_2s_infinite] filter drop-shadow-[0_5px_10px_rgba(0,0,0,0.5)]">
                    👑
                  </div>
                  <div className="absolute inset-0 bg-yellow-400/40 blur-2xl rounded-full scale-150" />
                  <Avatar
                    seed={seedMap[top3[0].username] ?? 'Ghost'}
                    size="lg"
                    glow="orange"
                  />
                </div>
                <p className="text-[10px] text-yellow-400 font-bold uppercase tracking-widest truncate w-full text-center mb-2">
                  u/{top3[0].username}
                </p>
                <div className="w-full bg-gradient-to-t from-yellow-900 to-yellow-500 h-36 rounded-t-2xl flex justify-center pt-4 border-t-2 border-yellow-300 shadow-[0_0_40px_rgba(250,204,21,0.3)] relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-b from-white/20 to-transparent" />
                  <span className="text-white font-black text-4xl font-display drop-shadow-md">
                    1
                  </span>
                </div>
              </div>
            )}

            {top3[2] && (
              <div className="flex flex-col items-center w-[30%] relative z-10 group cursor-pointer hover:-translate-y-2 transition-transform duration-300">
                <Avatar
                  seed={seedMap[top3[2].username] ?? 'Sherlock'}
                  size="md"
                />
                <p className="text-[9px] text-orange-400 font-bold uppercase tracking-widest truncate w-full text-center mt-3 mb-2">
                  u/{top3[2].username}
                </p>
                <div className="w-full bg-gradient-to-t from-[#050B14] to-orange-900 h-20 rounded-t-2xl flex justify-center pt-2 border-t-2 border-orange-700 shadow-[0_0_20px_rgba(0,0,0,0.8)] relative overflow-hidden">
                  <div className="absolute inset-0 bg-white/5" />
                  <span className="text-orange-300 font-black text-xl font-display opacity-80">
                    3
                  </span>
                </div>
              </div>
            )}
          </div>

          {top3.length > 0 && (
            <div className="flex justify-between px-4 mb-6 stagger-3">
              {top3.map((entry, i) => (
                <div key={entry.username} className="text-center">
                  <p className="text-[9px] text-gray-500 uppercase tracking-widest font-bold">
                    {entry.citizenWins + entry.spyWins} wins
                  </p>
                  <p
                    className={`text-sm font-bold ${
                      i === 0
                        ? 'text-yellow-400'
                        : i === 1
                          ? 'text-gray-300'
                          : 'text-orange-400'
                    }`}
                  >
                    {entry.score} pts
                  </p>
                </div>
              ))}
            </div>
          )}

          {rest.length > 0 && (
            <div className="glass-panel rounded-2xl p-4 flex-1 overflow-y-auto stagger-4">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3">
                More Players
              </p>
              <div className="space-y-2">
                {rest.map((entry, i) => (
                  <div
                    key={entry.username}
                    className="flex items-center justify-between bg-slate-800/50 rounded-xl px-3 py-2"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-bold text-gray-500 w-6">
                        #{i + 4}
                      </span>
                      <Avatar
                        seed={seedMap[entry.username] ?? 'Sherlock'}
                        size="sm"
                      />
                      <span className="text-sm text-gray-300">
                        u/{entry.username}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 text-xs text-gray-400">
                      <span title="Citizen wins">🛡️ {entry.citizenWins}</span>
                      <span title="Spy wins">🕵️ {entry.spyWins}</span>
                      <span className="text-orange-400 font-bold">
                        {entry.score}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}

      <div className="mt-6 pb-4 stagger-5">
        <PremiumButton onClick={onClose} variant="secondary">
          Back to Game
        </PremiumButton>
      </div>
    </div>
  );
};
