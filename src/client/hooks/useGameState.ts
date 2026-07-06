import { useState, useEffect, useCallback, useRef } from 'react';
import type { GameRoom } from '../../shared/types';

type GameState = {
  game: GameRoom | null;
  username: string;
  loading: boolean;
  error: string | null;
};

export function useGameState() {
  const [state, setState] = useState<GameState>({
    game: null,
    username: '',
    loading: true,
    error: null,
  });
  const pollingRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const fetchState = useCallback(async () => {
    try {
      const res = await fetch('/api/game/state');
      const data = await res.json();
      if (data.status === 'ok') {
        setState({
          game: data.game,
          username: data.username,
          loading: false,
          error: null,
        });
      } else {
        setState((s) => ({ ...s, loading: false, error: data.message }));
      }
    } catch {
      setState((s) => ({ ...s, loading: false, error: 'Failed to connect' }));
    }
  }, []);

  const clearPolling = useCallback(() => {
    if (pollingRef.current) {
      clearInterval(pollingRef.current);
      pollingRef.current = null;
    }
  }, []);

  const startPolling = useCallback(() => {
    clearPolling();
    pollingRef.current = setInterval(() => {
      void fetchState();
    }, 2000);
  }, [fetchState, clearPolling]);

  const joinGame = useCallback(async () => {
    try {
      const res = await fetch('/api/game/join', { method: 'POST' });
      const data = await res.json();
      if (data.status === 'ok') {
        setState({
          game: data.game,
          username: data.username,
          loading: false,
          error: null,
        });
      } else {
        setState((s) => ({ ...s, error: data.message }));
      }
    } catch {
      setState((s) => ({ ...s, error: 'Failed to join' }));
    }
  }, []);

  const leaveGame = useCallback(async () => {
    try {
      clearPolling();
      const res = await fetch('/api/game/leave', { method: 'POST' });
      const data = await res.json();
      if (data.status === 'ok') {
        setState({
          game: data.game,
          username: '',
          loading: false,
          error: null,
        });
      }
    } catch {
      setState((s) => ({ ...s, error: 'Failed to leave' }));
    }
  }, [clearPolling]);

  const startGame = useCallback(async () => {
    try {
      const res = await fetch('/api/game/start', { method: 'POST' });
      const data = await res.json();
      if (data.status === 'ok') {
        setState((s) => ({ ...s, game: data.game, error: null }));
      } else {
        setState((s) => ({ ...s, error: data.message }));
      }
    } catch {
      setState((s) => ({ ...s, error: 'Failed to start' }));
    }
  }, []);

  const submitNightAction = useCallback(async (target: string) => {
    try {
      const res = await fetch('/api/game/night-action', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ target }),
      });
      const data = await res.json();
      if (data.status === 'ok') {
        setState((s) => ({ ...s, game: data.game, error: null }));
      } else {
        setState((s) => ({ ...s, error: data.message }));
      }
    } catch {
      setState((s) => ({ ...s, error: 'Failed to submit action' }));
    }
  }, []);

  const submitVote = useCallback(async (target: string) => {
    try {
      const res = await fetch('/api/game/vote', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ target }),
      });
      const data = await res.json();
      if (data.status === 'ok') {
        setState((s) => ({ ...s, game: data.game, error: null }));
      } else {
        setState((s) => ({ ...s, error: data.message }));
      }
    } catch {
      setState((s) => ({ ...s, error: 'Failed to vote' }));
    }
  }, []);

  const advanceToNight = useCallback(async () => {
    try {
      const res = await fetch('/api/game/advance-to-night', {
        method: 'POST',
      });
      const data = await res.json();
      if (data.status === 'ok') {
        setState((s) => ({ ...s, game: data.game, error: null }));
      }
    } catch {
      setState((s) => ({ ...s, error: 'Failed to advance' }));
    }
  }, []);

  const advanceToVoting = useCallback(async () => {
    try {
      const res = await fetch('/api/game/advance-to-voting', {
        method: 'POST',
      });
      const data = await res.json();
      if (data.status === 'ok') {
        setState((s) => ({ ...s, game: data.game, error: null }));
      }
    } catch {
      setState((s) => ({ ...s, error: 'Failed to advance' }));
    }
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void fetchState();
  }, [fetchState]);

  useEffect(() => {
    if (state.game && state.game.phase !== 'lobby' && state.game.phase !== 'ended') {
      startPolling();
    } else {
      clearPolling();
    }
    return () => clearPolling();
  }, [state.game, startPolling, clearPolling]);

  const advanceFromRoleReveal = useCallback(async () => {
    try {
      const res = await fetch('/api/game/advance-from-role-reveal', {
        method: 'POST',
      });
      const data = await res.json();
      if (data.status === 'ok') {
        setState((s) => ({ ...s, game: data.game, error: null }));
      }
    } catch {
      setState((s) => ({ ...s, error: 'Failed to advance' }));
    }
  }, []);

  const advanceFromEliminationReveal = useCallback(async () => {
    try {
      const res = await fetch('/api/game/advance-from-elimination-reveal', {
        method: 'POST',
      });
      const data = await res.json();
      if (data.status === 'ok') {
        setState((s) => ({ ...s, game: data.game, error: null }));
      }
    } catch {
      setState((s) => ({ ...s, error: 'Failed to advance' }));
    }
  }, []);

  return {
    ...state,
    joinGame,
    leaveGame,
    startGame,
    submitNightAction,
    submitVote,
    advanceToNight,
    advanceToVoting,
    advanceFromRoleReveal,
    advanceFromEliminationReveal,
    refresh: fetchState,
  };
}
