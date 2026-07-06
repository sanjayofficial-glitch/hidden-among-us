import { Hono } from 'hono';
import { context, reddit } from '@devvit/web/server';
import {
  getGame,
  createGame,
  addPlayer,
  removePlayer,
  startGame,
} from '../storage/rooms';

type ErrorResponse = {
  status: 'error';
  message: string;
};

export const game = new Hono();

game.get('/state', async (c) => {
  const { postId } = context;
  if (!postId) {
    return c.json<ErrorResponse>({ status: 'error', message: 'postId required' }, 400);
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
    return c.json<ErrorResponse>({ status: 'error', message: 'postId required' }, 400);
  }

  try {
    const username = await reddit.getCurrentUsername();
    if (!username) {
      return c.json<ErrorResponse>({ status: 'error', message: 'Login required' }, 401);
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
    return c.json<ErrorResponse>({ status: 'error', message: 'postId required' }, 400);
  }

  try {
    const username = await reddit.getCurrentUsername();
    if (!username) {
      return c.json<ErrorResponse>({ status: 'error', message: 'Login required' }, 401);
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
    return c.json<ErrorResponse>({ status: 'error', message: 'postId required' }, 400);
  }

  try {
    const username = await reddit.getCurrentUsername();
    if (!username) {
      return c.json<ErrorResponse>({ status: 'error', message: 'Login required' }, 401);
    }

    const gameRoom = await getGame(postId);
    if (!gameRoom) {
      return c.json<ErrorResponse>({ status: 'error', message: 'Game not found' }, 404);
    }

    if (gameRoom.host !== username) {
      return c.json<ErrorResponse>({ status: 'error', message: 'Only host can start' }, 403);
    }

    const updated = await startGame(postId);
    return c.json({ status: 'ok', game: updated });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return c.json<ErrorResponse>({ status: 'error', message }, 400);
  }
});
