import './index.css';

import { StrictMode, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { useGameState } from './hooks/useGameState';
import {
  CustomStyles,
  LivingBackground,
  PremiumButton,
} from './components/DesignSystem';
import { Lobby } from './screens/Lobby';
import { RoleReveal } from './screens/RoleReveal';
import { NightPhase } from './screens/NightPhase';
import { DiscussionPhase } from './screens/DiscussionPhase';
import { VotingPhase } from './screens/VotingPhase';
import { EliminationReveal } from './screens/EliminationReveal';
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
    advanceFromRoleReveal,
    advanceFromEliminationReveal,
  } = useGameState();

  const [showLeaderboard, setShowLeaderboard] = useState(false);

  if (loading) {
    return (
      <>
        <CustomStyles />
        <LivingBackground phase="default" />
        <div className="flex items-center justify-center min-h-screen relative z-10">
          <div className="text-center">
            <div className="text-6xl mb-6 animate-[breathe_2s_infinite]">
              🕵️
            </div>
            <p className="text-gray-400 font-medium tracking-widest uppercase text-sm">
              Loading game...
            </p>
          </div>
        </div>
      </>
    );
  }

  if (error) {
    return (
      <>
        <CustomStyles />
        <LivingBackground phase="default" />
        <div className="flex items-center justify-center min-h-screen relative z-10">
          <div className="text-center glass-panel rounded-3xl p-8 max-w-sm">
            <p className="text-red-400 mb-6 font-medium">{error}</p>
            <PremiumButton
              onClick={() => window.location.reload()}
              variant="secondary"
            >
              Retry
            </PremiumButton>
          </div>
        </div>
      </>
    );
  }

  if (!game) {
    return (
      <>
        <CustomStyles />
        <LivingBackground phase="default" />
        <div className="flex items-center justify-center min-h-screen relative z-10">
          <p className="text-gray-400">Game not found</p>
        </div>
      </>
    );
  }

  if (showLeaderboard) {
    return (
      <>
        <CustomStyles />
        <LivingBackground phase="ended" />
        <Leaderboard onClose={() => setShowLeaderboard(false)} />
      </>
    );
  }

  return (
    <>
      <CustomStyles />
      <LivingBackground phase={game.phase} />
      <div className="relative z-10">
        {game.phase === 'lobby' && (
          <>
            <Lobby
              game={game}
              username={username}
              isJoined={!!game.players[username]}
              onJoin={joinGame}
              onLeave={leaveGame}
              onStart={startGame}
            />
            <div className="fixed bottom-20 right-4 z-50">
              <button
                onClick={() => setShowLeaderboard(true)}
                className="glass-panel rounded-full p-3 shadow-lg transition-all hover:scale-110 border border-orange-500/30"
                title="Leaderboard"
              >
                🏆
              </button>
            </div>
          </>
        )}

        {game.phase === 'role_reveal' && (
          <RoleReveal game={game} username={username} onContinue={advanceFromRoleReveal} />
        )}

        {game.phase === 'night' && (
          <NightPhase
            game={game}
            username={username}
            onSubmitAction={submitNightAction}
          />
        )}

        {game.phase === 'discussion' && (
          <DiscussionPhase
            game={game}
            username={username}
            onAdvanceToVoting={advanceToVoting}
          />
        )}

        {game.phase === 'voting' && (
          <VotingPhase
            game={game}
            username={username}
            onSubmitVote={submitVote}
          />
        )}

        {game.phase === 'elimination_reveal' && (
          <EliminationReveal
            game={game}
            onContinue={advanceFromEliminationReveal}
          />
        )}

        {game.phase === 'reveal' && (
          <div className="flex flex-col items-center justify-center min-h-screen px-4">
            <div className="glass-panel rounded-3xl p-8 text-center max-w-md">
              <p className="text-3xl font-bold mb-4">📋 REVEAL</p>
              <p className="text-gray-400 text-sm mb-4">Round {game.round}</p>
              {game.lastEliminated ? (
                <p className="text-gray-300 mb-6">
                  <span className="text-red-400 font-bold">
                    {game.lastEliminated}
                  </span>{' '}
                  was a{' '}
                  <span className="font-bold capitalize">
                    {game.lastEliminatedRole}
                  </span>
                </p>
              ) : (
                <p className="text-yellow-400 mb-6">No elimination this round</p>
              )}
              <PremiumButton onClick={advanceToNight}>
                Next Round → Night
              </PremiumButton>
            </div>
          </div>
        )}

        {game.phase === 'ended' && (
          <GameEnd
            game={game}
            username={username}
            onPlayAgain={startGame}
            onLeave={leaveGame}
            onLeaderboard={() => setShowLeaderboard(true)}
          />
        )}
      </div>
    </>
  );
};

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
