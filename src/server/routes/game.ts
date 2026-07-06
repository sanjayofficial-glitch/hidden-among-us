import { Hono } from 'hono';
import { context, reddit } from '@devvit/web/server';
import { redis as sortedRedis } from '@devvit/redis';
import {
  getGame,
  createGame,
  addPlayer,
  removePlayer,
  startGame,
  submitNightAction,
  resolveNight,
  submitVote,
  resolveVotes,
  advanceToNight,
  advanceToVoting,
  advanceFromRoleReveal,
  advanceFromEliminationReveal,
  checkAllNightActionsSubmitted,
  checkAllVotesSubmitted,
} from '../storage/rooms';

type ErrorResponse = {
  status: 'error';
  message: string;
};

export const game = new Hono();

game.get('/state', async (c) => {
  const { postId } = context;
  if (!postId) {
    return c.json<ErrorResponse>(
      { status: 'error', message: 'postId required' },
      400
    );
  }

  try {
    let gameRoom = await getGame(postId);
    if (!gameRoom) {
      const username = await reddit.getCurrentUsername();
      gameRoom = await createGame(postId, username ?? 'anonymous');
    }

    return c.json({
      status: 'ok',
      game: gameRoom,
      username: await reddit.getCurrentUsername(),
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return c.json<ErrorResponse>({ status: 'error', message }, 400);
  }
});

game.post('/join', async (c) => {
  const { postId } = context;
  if (!postId) {
    return c.json<ErrorResponse>(
      { status: 'error', message: 'postId required' },
      400
    );
  }

  try {
    const username = await reddit.getCurrentUsername();
    if (!username) {
      return c.json<ErrorResponse>(
        { status: 'error', message: 'Login required' },
        401
      );
    }

    const { game: gameRoom } = await addPlayer(postId, username);
    return c.json({ status: 'ok', game: gameRoom, username });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return c.json<ErrorResponse>({ status: 'error', message }, 400);
  }
});

game.post('/leave', async (c) => {
  const { postId } = context;
  if (!postId) {
    return c.json<ErrorResponse>(
      { status: 'error', message: 'postId required' },
      400
    );
  }

  try {
    const username = await reddit.getCurrentUsername();
    if (!username) {
      return c.json<ErrorResponse>(
        { status: 'error', message: 'Login required' },
        401
      );
    }

    const gameRoom = await removePlayer(postId, username);
    return c.json({ status: 'ok', game: gameRoom });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return c.json<ErrorResponse>({ status: 'error', message }, 400);
  }
});

game.post('/start', async (c) => {
  const { postId } = context;
  if (!postId) {
    return c.json<ErrorResponse>(
      { status: 'error', message: 'postId required' },
      400
    );
  }

  try {
    const username = await reddit.getCurrentUsername();
    if (!username) {
      return c.json<ErrorResponse>(
        { status: 'error', message: 'Login required' },
        401
      );
    }

    const gameRoom = await getGame(postId);
    if (!gameRoom) {
      return c.json<ErrorResponse>(
        { status: 'error', message: 'Game not found' },
        404
      );
    }

    if (gameRoom.host !== username) {
      return c.json<ErrorResponse>(
        { status: 'error', message: 'Only host can start' },
        403
      );
    }

    const updated = await startGame(postId);
    return c.json({ status: 'ok', game: updated });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return c.json<ErrorResponse>({ status: 'error', message }, 400);
  }
});

game.post('/night-action', async (c) => {
  const { postId } = context;
  if (!postId) {
    return c.json<ErrorResponse>(
      { status: 'error', message: 'postId required' },
      400
    );
  }

  try {
    const username = await reddit.getCurrentUsername();
    if (!username) {
      return c.json<ErrorResponse>(
        { status: 'error', message: 'Login required' },
        401
      );
    }

    const body = await c.req.json<{ target: string }>();
    if (!body.target) {
      return c.json<ErrorResponse>(
        { status: 'error', message: 'Target required' },
        400
      );
    }

    const gameRoom = await submitNightAction(postId, username, body.target);

    if (checkAllNightActionsSubmitted(gameRoom)) {
      const resolved = await resolveNight(postId);
      return c.json({ status: 'ok', game: resolved });
    }

    return c.json({ status: 'ok', game: gameRoom });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return c.json<ErrorResponse>({ status: 'error', message }, 400);
  }
});

game.post('/resolve-night', async (c) => {
  const { postId } = context;
  if (!postId) {
    return c.json<ErrorResponse>(
      { status: 'error', message: 'postId required' },
      400
    );
  }

  try {
    const gameRoom = await getGame(postId);
    if (!gameRoom) {
      return c.json<ErrorResponse>(
        { status: 'error', message: 'Game not found' },
        404
      );
    }

    if (gameRoom.phase !== 'night') {
      return c.json<ErrorResponse>(
        { status: 'error', message: 'Not night phase' },
        400
      );
    }

    if (!checkAllNightActionsSubmitted(gameRoom)) {
      return c.json<ErrorResponse>(
        { status: 'error', message: 'Not all night actions submitted' },
        400
      );
    }

    const resolved = await resolveNight(postId);
    return c.json({ status: 'ok', game: resolved });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return c.json<ErrorResponse>({ status: 'error', message }, 400);
  }
});

game.post('/vote', async (c) => {
  const { postId } = context;
  if (!postId) {
    return c.json<ErrorResponse>(
      { status: 'error', message: 'postId required' },
      400
    );
  }

  try {
    const username = await reddit.getCurrentUsername();
    if (!username) {
      return c.json<ErrorResponse>(
        { status: 'error', message: 'Login required' },
        401
      );
    }

    const body = await c.req.json<{ target: string }>();
    if (!body.target) {
      return c.json<ErrorResponse>(
        { status: 'error', message: 'Target required' },
        400
      );
    }

    const gameRoom = await submitVote(postId, username, body.target);

    if (checkAllVotesSubmitted(gameRoom)) {
      const resolved = await resolveVotes(postId);
      return c.json({ status: 'ok', game: resolved });
    }

    return c.json({ status: 'ok', game: gameRoom });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return c.json<ErrorResponse>({ status: 'error', message }, 400);
  }
});

game.post('/resolve-votes', async (c) => {
  const { postId } = context;
  if (!postId) {
    return c.json<ErrorResponse>(
      { status: 'error', message: 'postId required' },
      400
    );
  }

  try {
    const gameRoom = await getGame(postId);
    if (!gameRoom) {
      return c.json<ErrorResponse>(
        { status: 'error', message: 'Game not found' },
        404
      );
    }

    if (gameRoom.phase !== 'voting') {
      return c.json<ErrorResponse>(
        { status: 'error', message: 'Not voting phase' },
        400
      );
    }

    const resolved = await resolveVotes(postId);
    return c.json({ status: 'ok', game: resolved });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return c.json<ErrorResponse>({ status: 'error', message }, 400);
  }
});

game.post('/advance-to-night', async (c) => {
  const { postId } = context;
  if (!postId) {
    return c.json<ErrorResponse>(
      { status: 'error', message: 'postId required' },
      400
    );
  }

  try {
    const gameRoom = await advanceToNight(postId);
    return c.json({ status: 'ok', game: gameRoom });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return c.json<ErrorResponse>({ status: 'error', message }, 400);
  }
});

game.post('/advance-to-voting', async (c) => {
  const { postId } = context;
  if (!postId) {
    return c.json<ErrorResponse>(
      { status: 'error', message: 'postId required' },
      400
    );
  }

  try {
    const gameRoom = await advanceToVoting(postId);
    return c.json({ status: 'ok', game: gameRoom });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return c.json<ErrorResponse>({ status: 'error', message }, 400);
  }
});

game.post('/advance-from-role-reveal', async (c) => {
  const { postId } = context;
  if (!postId) {
    return c.json<ErrorResponse>(
      { status: 'error', message: 'postId required' },
      400
    );
  }

  try {
    const gameRoom = await advanceFromRoleReveal(postId);
    return c.json({ status: 'ok', game: gameRoom });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return c.json<ErrorResponse>({ status: 'error', message }, 400);
  }
});

game.post('/advance-from-elimination-reveal', async (c) => {
  const { postId } = context;
  if (!postId) {
    return c.json<ErrorResponse>(
      { status: 'error', message: 'postId required' },
      400
    );
  }

  try {
    const gameRoom = await advanceFromEliminationReveal(postId);
    return c.json({ status: 'ok', game: gameRoom });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return c.json<ErrorResponse>({ status: 'error', message }, 400);
  }
});

game.get('/comments', async (c) => {
  const { postId } = context;
  if (!postId) {
    return c.json<ErrorResponse>(
      { status: 'error', message: 'postId required' },
      400
    );
  }

  try {
    // Reddit comments are available via the post's comment thread
    // For now, return empty - discussion happens in the Reddit thread itself
    const formatted: Array<{ author: string; body: string; created: number }> =
      [];
    return c.json({ status: 'ok', comments: formatted });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return c.json<ErrorResponse>({ status: 'error', message }, 400);
  }
});

game.get('/leaderboard', async (c) => {
  try {
    const top = await sortedRedis.zRange('leaderboard:global', 0, 9, {
      by: 'rank',
    });

    const entries = await Promise.all(
      top.map(async (entry) => {
        const stats = await sortedRedis.hGetAll(`lb:${entry.member}`);
        return {
          username: entry.member,
          score: entry.score,
          citizenWins: Number(stats?.citizenWins ?? '0'),
          spyWins: Number(stats?.spyWins ?? '0'),
          gamesPlayed: Number(stats?.gamesPlayed ?? '0'),
        };
      })
    );

    return c.json({ status: 'ok', entries });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return c.json<ErrorResponse>({ status: 'error', message }, 400);
  }
});
