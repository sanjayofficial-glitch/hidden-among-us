import { useState } from 'react';
import type { GameRoom } from '../../shared/types';
import { Avatar, PremiumButton } from '../components/DesignSystem';

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
  const [voted, setVoted] = useState<string | null>(null);
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

  const seedMap: Record<string, string> = {};
  for (const p of Object.values(game.players)) {
    seedMap[p.username] = p.username.slice(0, 8);
  }

  if (hasVoted) {
    return (
      <div className="flex flex-col h-screen px-4 pt-12 pb-8 max-w-md mx-auto w-full relative z-10">
        <div className="text-center mb-8 stagger-1">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full glass-panel border border-orange-500/50 mb-4 shadow-[0_0_30px_rgba(255,69,0,0.4)] relative">
            <div className="absolute inset-0 bg-orange-500/20 rounded-full animate-[breathe_2s_infinite]" />
            <span className="text-4xl relative z-10">🗳️</span>
          </div>
          <h1 className="text-3xl font-display font-black text-white tracking-widest uppercase mb-1 glow-text-orange">
            Vote Cast
          </h1>
          <p className="text-xs text-gray-400 font-medium tracking-[0.2em] uppercase">
            Round {game.round}
          </p>
        </div>

        <div className="glass-panel rounded-2xl p-6 text-center mb-6 stagger-2">
          <span className="text-5xl mb-4 block">✋</span>
          <p className="text-lg text-gray-300 font-medium mb-2">
            Vote submitted!
          </p>
          <p className="text-sm text-gray-500 mb-2">
            {votedCount} / {totalAlive} players voted
          </p>
          <p className="text-yellow-400 text-xs font-bold tracking-widest uppercase">
            Waiting for other players...
          </p>
        </div>

        <div className="glass-panel rounded-2xl p-4 stagger-3">
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3">
            Current Votes
          </p>
          <div className="space-y-2">
            {Object.entries(voteCounts).map(([target, count]) => (
              <div
                key={target}
                className="flex items-center justify-between bg-slate-800/50 rounded-xl px-3 py-2"
              >
                <span className="text-sm text-gray-300">u/{target}</span>
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
    <div className="flex flex-col h-screen px-4 pt-12 pb-8 max-w-md mx-auto w-full relative z-10 perspective-container">
      <div className="text-center mb-8 stagger-1">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full glass-panel border border-orange-500/50 mb-4 shadow-[0_0_30px_rgba(255,69,0,0.4)] relative">
          <div className="absolute inset-0 bg-orange-500/20 rounded-full animate-[breathe_2s_infinite]" />
          <span className="text-4xl relative z-10">🗳️</span>
        </div>
        <h1 className="text-3xl font-display font-black text-white tracking-widest uppercase mb-1 glow-text-orange">
          Cast Vote
        </h1>
        <p className="text-xs text-gray-400 font-medium tracking-[0.2em] uppercase">
          Who is the Spy?
        </p>
      </div>

      <div className="glass-panel rounded-2xl p-4 mb-6 border-t border-white/10 shadow-inner stagger-2">
        <div className="flex justify-between items-center text-[10px] text-gray-400 font-bold uppercase mb-3 px-1 tracking-widest">
          <span>Voting Progress</span>
          <span className="text-orange-400 bg-orange-500/10 px-2 py-1 rounded">
            {votedCount} of {totalAlive} Votes Cast
          </span>
        </div>
        <div className="h-2 w-full bg-[#050B14] rounded-full overflow-hidden shadow-inner border border-white/5">
          <div
            className="h-full bg-gradient-to-r from-orange-600 to-yellow-400 relative overflow-hidden rounded-full shadow-[0_0_10px_rgba(255,69,0,0.8)] transition-all duration-500"
            style={{
              width: `${totalAlive > 0 ? (votedCount / totalAlive) * 100 : 0}%`,
            }}
          />
        </div>
      </div>

      <div className="space-y-4 flex-1 overflow-y-auto pb-4 px-1 stagger-3">
        {targets.map((targetUsername) => {
          const isVoted = voted === targetUsername;
          const targetVotes = voteCounts[targetUsername] ?? 0;

          return (
            <div
              key={targetUsername}
              onClick={() => setVoted(targetUsername)}
              className="relative cursor-pointer group"
              style={{ minHeight: '88px' }}
            >
              <div
                className={`card-3d-wrapper ${isVoted ? 'is-flipped' : ''}`}
                style={{ height: '88px' }}
              >
                <div className="card-face glass-panel rounded-2xl flex items-center justify-between p-4 group-hover:bg-white/10 transition-colors">
                  <div className="flex items-center gap-4 relative z-10">
                    <Avatar
                      seed={seedMap[targetUsername] ?? 'Sherlock'}
                      size="md"
                    />
                    <p className="text-base font-bold text-white tracking-wide">
                      u/{targetUsername}
                    </p>
                  </div>
                  {targetVotes > 0 && (
                    <div className="flex flex-col items-end relative z-10">
                      <span className="text-xl font-black text-orange-400 font-display leading-none">
                        {targetVotes}
                      </span>
                      <span className="text-[9px] font-bold text-gray-500 uppercase tracking-widest mt-1">
                        Votes
                      </span>
                    </div>
                  )}
                </div>

                <div className="card-face card-face-back rounded-2xl border-2 border-orange-500 bg-orange-950/90 overflow-hidden flex items-center justify-between p-4 shadow-[0_10px_30px_rgba(255,69,0,0.4)] backdrop-blur-xl">
                  <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-orange-500/30 via-transparent to-transparent animate-[breathe_3s_infinite]" />
                  <div className="flex items-center gap-4 relative z-10">
                    <Avatar
                      seed={seedMap[targetUsername] ?? 'Sherlock'}
                      size="md"
                      glow="orange"
                    />
                    <div>
                      <p className="text-[9px] text-orange-400 uppercase font-bold tracking-[0.2em] mb-0.5">
                        Verdict Locked
                      </p>
                      <p className="text-base font-bold text-white tracking-wide">
                        u/{targetUsername}
                      </p>
                    </div>
                  </div>
                  <div className="w-10 h-10 rounded-full bg-orange-500 text-white flex items-center justify-center font-bold relative z-10 shadow-[0_0_20px_rgba(255,255,255,0.4)] text-xl border-2 border-white/20">
                    ✓
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="stagger-4 pt-2">
        <PremiumButton
          onClick={() => {
            if (voted) onSubmitVote(voted);
          }}
          variant={voted ? 'primary' : 'disabled'}
          disabled={!voted}
        >
          {voted ? 'Confirm Verdict' : 'Select a Suspect'}
        </PremiumButton>
      </div>
    </div>
  );
};
