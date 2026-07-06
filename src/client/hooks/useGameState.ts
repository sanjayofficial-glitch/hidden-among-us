import { useState, useEffect, useCallback } from 'react';
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
  }, []);

  const startGame = useCallback(async () => {
    try {
      const res = await fetch('/api/game/start', { method: 'POST' });
      const data = await res.json();
      if (data.status === 'ok') {
        setState((s) => ({
          ...s,
          game: data.game,
          error: null,
        }));
      } else {
        setState((s) => ({ ...s, error: data.message }));
      }
    } catch {
      setState((s) => ({ ...s, error: 'Failed to start' }));
    }
  }, []);

  useEffect(() => {
    async function load() {
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
        setState((s) => ({
          ...s,
          loading: false,
          error: 'Failed to connect',
        }));
      }
    }
    void load();
  }, []);

  return {
    ...state,
    joinGame,
    leaveGame,
    startGame,
    refresh: fetchState,
  };
}
