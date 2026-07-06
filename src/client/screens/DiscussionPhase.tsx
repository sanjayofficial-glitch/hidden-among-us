import { useState, useEffect, useCallback } from 'react';
import type { GameRoom } from '../../shared/types';
import { Avatar, PremiumButton } from '../components/DesignSystem';

type DiscussionPhaseProps = {
  game: GameRoom;
  username: string;
  onAdvanceToVoting: () => void;
};

type RedditComment = {
  author: string;
  body: string;
  created: number;
};

export const DiscussionPhase = ({
  game,
  username,
  onAdvanceToVoting,
}: DiscussionPhaseProps) => {
  const [timer, setTimer] = useState(60);
  const [comments, setComments] = useState<RedditComment[]>([]);
  const player = game.players[username];
  const isHost = game.host === username;

  const fetchComments = useCallback(async () => {
    try {
      const res = await fetch('/api/game/comments');
      const data = await res.json();
      if (data.status === 'ok') {
        setComments(data.comments);
      }
    } catch {
      // ignore
    }
  }, []);

  useEffect(() => {
    void fetchComments();
    const pollInterval = setInterval(() => {
      void fetchComments();
    }, 5000);
    return () => clearInterval(pollInterval);
  }, [fetchComments]);

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

  const seedMap: Record<string, string> = {};
  for (const p of Object.values(game.players)) {
    seedMap[p.username] = p.username.slice(0, 8);
  }

  return (
    <div className="flex flex-col h-screen px-4 pt-8 pb-8 max-w-md mx-auto w-full relative z-10">
      <div className="glass-panel rounded-3xl p-4 mb-4 flex items-center justify-between shadow-[0_10px_30px_rgba(245,158,11,0.2)] border-t-2 border-orange-500 stagger-1 relative overflow-hidden">
        <div className="absolute right-0 top-0 w-32 h-32 bg-orange-500/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4" />
        <div className="flex items-center gap-4 relative z-10">
          <div className="w-12 h-12 rounded-2xl bg-orange-500/20 border border-orange-500/30 flex items-center justify-center text-2xl animate-[breathe_2s_infinite]">
            💬
          </div>
          <div>
            <h2 className="text-sm font-bold font-display uppercase tracking-[0.2em] text-orange-400">
              Discussion
            </h2>
            <p className="text-[10px] text-gray-400 uppercase tracking-widest mt-0.5">
              Round {game.round}
            </p>
          </div>
        </div>
        <div className="text-4xl font-black font-display text-white filter drop-shadow-[0_0_15px_rgba(255,255,255,0.6)] relative z-10 glow-text-orange">
          {Math.floor(timer / 60)}:{(timer % 60).toString().padStart(2, '0')}
        </div>
      </div>

      {player.role === 'detective' && investigationResult && (
        <div className="glass-panel border-l-4 border-blue-500 bg-blue-950/40 rounded-2xl p-4 mb-4 flex gap-4 items-start relative overflow-hidden stagger-2">
          <div className="absolute right-[-10px] top-[-10px] text-5xl opacity-10">
            🔎
          </div>
          <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center text-xl flex-shrink-0">
            🔎
          </div>
          <div>
            <p className="text-[10px] font-bold text-blue-400 uppercase tracking-[0.2em] mb-1">
              Verified Intel
            </p>
            <p className="text-xs text-gray-200 leading-relaxed">
              Investigation confirms{' '}
              <span className="font-bold text-white px-1 bg-white/10 rounded">
                {Object.entries(game.nightActions).find(
                  ([voter]) => voter === username
                )?.[1] ?? 'unknown'}
              </span>{' '}
              is{' '}
              <span className="font-bold text-red-400 bg-red-950/80 px-1.5 py-0.5 rounded shadow-[0_0_10px_rgba(239,68,68,0.5)]">
                {investigationResult === 'spy' ? 'THE SPY' : 'NOT the Spy'}
              </span>
              .
            </p>
          </div>
        </div>
      )}

      <div className="flex-1 overflow-y-auto mb-4 pr-1 space-y-5 relative stagger-3">
        <div className="flex items-center justify-center gap-4 my-6 opacity-60">
          <div className="h-px bg-white/20 flex-1" />
          <p className="text-[9px] text-gray-300 uppercase tracking-[0.3em] font-bold">
            Dawn Breaks
          </p>
          <div className="h-px bg-white/20 flex-1" />
        </div>

        {game.lastEliminated && (
          <div className="flex justify-center animate-[slide-up-fade_0.4s_var(--ease-out-expo)_both]">
            <div className="bg-red-950/60 border border-red-500/30 px-5 py-2.5 rounded-2xl flex items-center gap-3 shadow-[0_5px_15px_rgba(239,68,68,0.2)] backdrop-blur-md">
              <span className="text-lg">💀</span>
              <span className="text-xs font-bold text-red-400 tracking-wide">
                u/{game.lastEliminated} was eliminated.
              </span>
            </div>
          </div>
        )}

        {comments.length > 0 ? (
          comments.slice(0, 10).map((comment, idx) => (
            <div
              key={idx}
              className="flex gap-3 animate-[slide-up-fade_0.4s_var(--ease-out-expo)_both] group"
              style={{ animationDelay: `${idx * 0.1}s` }}
            >
              <Avatar
                seed={seedMap[comment.author] ?? 'Sherlock'}
                size="sm"
              />
              <div className="flex flex-col max-w-[85%]">
                <div className="flex items-baseline gap-2 mb-1.5 pl-1">
                  <span className="text-[10px] font-bold text-gray-400 tracking-wide">
                    u/{comment.author}
                  </span>
                </div>
                <div className="glass-panel bg-white/5 border-white/5 rounded-2xl rounded-tl-sm p-3.5 shadow-md group-hover:bg-white/10 transition-colors">
                  <p className="text-sm text-gray-200 leading-relaxed font-medium">
                    {comment.body}
                  </p>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-500 text-sm">
              No comments yet. Discuss in the Reddit thread!
            </p>
          </div>
        )}
      </div>

      <div className="mt-auto stagger-4 relative z-10">
        {isHost ? (
          <PremiumButton
            onClick={onAdvanceToVoting}
            variant="primary"
            icon="🗳️"
          >
            Proceed to Vote
          </PremiumButton>
        ) : (
          <p className="text-gray-500 text-xs font-bold tracking-widest uppercase text-center">
            Waiting for host to start voting...
          </p>
        )}
      </div>
    </div>
  );
};
