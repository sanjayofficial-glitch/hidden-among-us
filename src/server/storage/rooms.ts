import { redis } from '@devvit/web/server';
import type { GameRoom, Player } from '../../shared/types';

const GAME_PREFIX = 'game:';

export const MISTERY_LIST = [
  "The subreddit mascot disappeared overnight.",
  "A moderator leaked secret information to the public.",
  "Someone stole Reddit Gold from the treasury.",
  "The community awards were mysteriously reset.",
  "A shadowy figure was seen lurking in the mod chat.",
  "The autoModerator went rogue and started deleting posts.",
  "A mysterious new flair appeared on every post.",
  "The subreddit rules were secretly changed at midnight.",
  "An anonymous donor left a cryptic message in the sidebar.",
  "The upvote bot malfunctioned and flagged innocent users.",
];

function getGameKey(postId: string): string {
  return `${GAME_PREFIX}${postId}`;
}

export async function getGame(postId: string): Promise<GameRoom | null> {
  const key = getGameKey(postId);
  const raw = await redis.get(key);
  if (!raw) return null;
  return JSON.parse(raw) as GameRoom;
}

export async function saveGame(game: GameRoom): Promise<void> {
  const key = getGameKey(game.postId);
  await redis.set(key, JSON.stringify(game));
}

export async function deleteGame(postId: string): Promise<void> {
  const key = getGameKey(postId);
  await redis.del(key);
}

export async function createGame(
  postId: string,
  hostUsername: string
): Promise<GameRoom> {
  const room: GameRoom = {
    roomId: `room_${postId}`,
    postId,
    players: {},
    phase: 'lobby',
    round: 0,
    votes: {},
    alivePlayers: [],
    deadPlayers: [],
    host: hostUsername,
    timer: 0,
    winner: null,
    investigationResult: null,
    nightActions: {},
    mystery: '',
    createdAt: Date.now(),
  };

  await saveGame(room);
  return room;
}

export async function addPlayer(
  postId: string,
  username: string
): Promise<{ game: GameRoom; player: Player }> {
  const game = await getGame(postId);
  if (!game) throw new Error('Game not found');

  if (game.players[username]) {
    return { game, player: game.players[username] };
  }

  const isFirstPlayer = Object.keys(game.players).length === 0;
  const player: Player = {
    username,
    role: 'citizen',
    alive: true,
    isHost: isFirstPlayer,
    joinedAt: Date.now(),
  };

  game.players[username] = player;
  if (isFirstPlayer) {
    game.host = username;
  }

  await saveGame(game);
  return { game, player };
}

export async function removePlayer(
  postId: string,
  username: string
): Promise<GameRoom> {
  const game = await getGame(postId);
  if (!game) throw new Error('Game not found');

  if (!game.players[username]) return game;

  delete game.players[username];

  if (Object.keys(game.players).length === 0) {
    await deleteGame(postId);
    return game;
  }

  if (game.host === username) {
    const remaining = Object.keys(game.players);
    const newHost = remaining[0];
    if (newHost && game.players[newHost]) {
      game.host = newHost;
      game.players[newHost]!.isHost = true;
    }
  }

  await saveGame(game);
  return game;
}

export async function startGame(postId: string): Promise<GameRoom> {
  const game = await getGame(postId);
  if (!game) throw new Error('Game not found');

  const playerCount = Object.keys(game.players).length;
  if (playerCount < 4) throw new Error('Need at least 4 players');

  const playerUsernames = Object.keys(game.players);
  const shuffled = [...playerUsernames].sort(() => Math.random() - 0.5);

  const spyName = shuffled[0];
  const detectiveName = shuffled[1];
  if (spyName && game.players[spyName]) game.players[spyName]!.role = 'spy';
  if (detectiveName && game.players[detectiveName])
    game.players[detectiveName]!.role = 'detective';
  for (let i = 2; i < shuffled.length; i++) {
    const name = shuffled[i];
    if (name && game.players[name]) game.players[name]!.role = 'citizen';
  }

  game.alivePlayers = playerUsernames;
  game.deadPlayers = [];
  game.phase = 'night';
  game.round = 1;

  const mysteryIndex = Math.floor(Math.random() * MISTERY_LIST.length);
  game.mystery = MISTERY_LIST[mysteryIndex] ?? '';

  await saveGame(game);
  return game;
}

export async function getDailyMystery(): Promise<string> {
  const mysteryIndex = Math.floor(Math.random() * MISTERY_LIST.length);
  return MISTERY_LIST[mysteryIndex] ?? '';
}
