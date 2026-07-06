import { redis } from '@devvit/web/server';
import { redis as sortedRedis } from '@devvit/redis';
import type { GameRoom, Player, Role } from '../../shared/types';

const GAME_PREFIX = 'game:';

export const MYSTERY_LIST = [
  'The subreddit mascot disappeared overnight.',
  'A moderator leaked secret information to the public.',
  'Someone stole Reddit Gold from the treasury.',
  'The community awards were mysteriously reset.',
  'A shadowy figure was seen lurking in the mod chat.',
  'The autoModerator went rogue and started deleting posts.',
  'A mysterious new flair appeared on every post.',
  'The subreddit rules were secretly changed at midnight.',
  'An anonymous donor left a cryptic message in the sidebar.',
  'The upvote bot malfunctioned and flagged innocent users.',
];

export const ROLE_DESCRIPTIONS: Record<Role, string> = {
  spy: 'You are the Spy. Eliminate citizens one by one until you equal their number.',
  detective:
    'You are the Detective. Investigate one player each night to uncover the Spy.',
  citizen: 'You are a Citizen. Discuss with others and vote to find the Spy.',
};

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
    winner: null,
    nightActions: {},
    mystery: MYSTERY_LIST[0] ?? '',
    lastEliminated: null,
    lastEliminatedRole: null,
    investigationResult: {},
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
  if (spyName && game.players[spyName])
    game.players[spyName]!.role = 'spy';
  if (detectiveName && game.players[detectiveName])
    game.players[detectiveName]!.role = 'detective';
  for (let i = 2; i < shuffled.length; i++) {
    const name = shuffled[i];
    if (name && game.players[name])
      game.players[name]!.role = 'citizen';
  }

  game.alivePlayers = playerUsernames;
  game.deadPlayers = [];
  game.phase = 'role_reveal';
  game.round = 1;
  game.votes = {};
  game.nightActions = {};
  game.lastEliminated = null;
  game.lastEliminatedRole = null;
  game.investigationResult = {};

  const mysteryIndex = Math.floor(Math.random() * MYSTERY_LIST.length);
  game.mystery = MYSTERY_LIST[mysteryIndex] ?? '';

  await saveGame(game);
  return game;
}

export async function submitNightAction(
  postId: string,
  username: string,
  target: string
): Promise<GameRoom> {
  const game = await getGame(postId);
  if (!game) throw new Error('Game not found');
  if (game.phase !== 'night') throw new Error('Not night phase');

  const player = game.players[username];
  if (!player) throw new Error('Not in game');
  if (!player.alive) throw new Error('You are eliminated');

  if (player.role === 'spy') {
    if (!game.alivePlayers.includes(target)) {
      throw new Error('Invalid target');
    }
    game.nightActions[username] = target;
  } else if (player.role === 'detective') {
    if (!game.alivePlayers.includes(target)) {
      throw new Error('Invalid target');
    }
    game.nightActions[username] = target;
  }

  await saveGame(game);
  return game;
}

export async function resolveNight(postId: string): Promise<GameRoom> {
  const game = await getGame(postId);
  if (!game) throw new Error('Game not found');

  const spy = Object.values(game.players).find((p) => p.role === 'spy');
  const detective = Object.values(game.players).find(
    (p) => p.role === 'detective'
  );

  if (spy && game.nightActions[spy.username]) {
    const target = game.nightActions[spy.username]!;
    if (game.players[target]) {
      game.players[target]!.alive = false;
      game.alivePlayers = game.alivePlayers.filter((u) => u !== target);
      game.deadPlayers.push(target);
      game.lastEliminated = target;
      game.lastEliminatedRole = game.players[target]!.role;
    }
  }

  if (detective && game.nightActions[detective.username]) {
    const target = game.nightActions[detective.username]!;
    const targetPlayer = game.players[target];
    if (targetPlayer) {
      game.investigationResult[detective.username] =
        targetPlayer.role === 'spy' ? 'spy' : 'not_spy';
    }
  }

  const spyCount = game.alivePlayers.filter(
    (u) => game.players[u]?.role === 'spy'
  ).length;
  const citizenCount = game.alivePlayers.filter(
    (u) => game.players[u]?.role !== 'spy'
  ).length;

  if (spyCount === 0) {
    game.winner = 'citizens';
    game.phase = 'ended';
    await updateLeaderboard(game, 'citizens');
    await saveGame(game);
    return game;
  }

  if (spyCount >= citizenCount) {
    game.winner = 'spy';
    game.phase = 'ended';
    await updateLeaderboard(game, 'spy');
    await saveGame(game);
    return game;
  }

  game.nightActions = {};
  game.phase = 'discussion';
  await saveGame(game);
  return game;
}

export async function submitVote(
  postId: string,
  username: string,
  target: string
): Promise<GameRoom> {
  const game = await getGame(postId);
  if (!game) throw new Error('Game not found');
  if (game.phase !== 'voting') throw new Error('Not voting phase');

  const player = game.players[username];
  if (!player) throw new Error('Not in game');
  if (!player.alive) throw new Error('You are eliminated');

  game.votes[username] = target;
  await saveGame(game);
  return game;
}

export async function resolveVotes(postId: string): Promise<GameRoom> {
  const game = await getGame(postId);
  if (!game) throw new Error('Game not found');

  const voteCounts: Record<string, number> = {};
  for (const target of Object.values(game.votes)) {
    voteCounts[target] = (voteCounts[target] ?? 0) + 1;
  }

  let maxVotes = 0;
  let eliminated = '';
  let tie = false;

  for (const [target, count] of Object.entries(voteCounts)) {
    if (count > maxVotes) {
      maxVotes = count;
      eliminated = target;
      tie = false;
    } else if (count === maxVotes) {
      tie = true;
    }
  }

  if (tie || !eliminated || maxVotes === 0) {
    game.lastEliminated = null;
    game.lastEliminatedRole = null;
    game.votes = {};
    game.phase = 'elimination_reveal';
    await saveGame(game);
    return game;
  }

  if (game.players[eliminated]) {
    game.players[eliminated]!.alive = false;
    game.alivePlayers = game.alivePlayers.filter((u) => u !== eliminated);
    game.deadPlayers.push(eliminated);
    game.lastEliminated = eliminated;
    game.lastEliminatedRole = game.players[eliminated]!.role;
  }

  const spyCount = game.alivePlayers.filter(
    (u) => game.players[u]?.role === 'spy'
  ).length;
  const citizenCount = game.alivePlayers.filter(
    (u) => game.players[u]?.role !== 'spy'
  ).length;

  if (spyCount === 0) {
    game.winner = 'citizens';
    game.phase = 'ended';
    await updateLeaderboard(game, 'citizens');
    await saveGame(game);
    return game;
  }

  if (spyCount >= citizenCount) {
    game.winner = 'spy';
    game.phase = 'ended';
    await updateLeaderboard(game, 'spy');
    await saveGame(game);
    return game;
  }

  game.votes = {};
  game.phase = 'elimination_reveal';
  await saveGame(game);
  return game;
}

export async function advanceToNight(postId: string): Promise<GameRoom> {
  const game = await getGame(postId);
  if (!game) throw new Error('Game not found');

  game.phase = 'night';
  game.round += 1;
  game.votes = {};
  game.nightActions = {};
  game.lastEliminated = null;
  game.lastEliminatedRole = null;
  game.investigationResult = {};

  await saveGame(game);
  return game;
}

export async function advanceFromRoleReveal(postId: string): Promise<GameRoom> {
  const game = await getGame(postId);
  if (!game) throw new Error('Game not found');

  game.phase = 'night';
  game.round = 1;
  game.votes = {};
  game.nightActions = {};
  game.lastEliminated = null;
  game.lastEliminatedRole = null;
  game.investigationResult = {};

  await saveGame(game);
  return game;
}

export async function advanceFromEliminationReveal(
  postId: string
): Promise<GameRoom> {
  const game = await getGame(postId);
  if (!game) throw new Error('Game not found');

  game.phase = 'night';
  game.round += 1;
  game.votes = {};
  game.nightActions = {};
  game.lastEliminated = null;
  game.lastEliminatedRole = null;
  game.investigationResult = {};

  await saveGame(game);
  return game;
}

export async function advanceToVoting(postId: string): Promise<GameRoom> {
  const game = await getGame(postId);
  if (!game) throw new Error('Game not found');

  game.votes = {};
  game.phase = 'voting';

  await saveGame(game);
  return game;
}

export function checkAllNightActionsSubmitted(game: GameRoom): boolean {
  const spy = Object.values(game.players).find((p) => p.role === 'spy');
  const detective = Object.values(game.players).find(
    (p) => p.role === 'detective'
  );

  if (spy && spy.alive && !game.nightActions[spy.username]) return false;
  if (detective && detective.alive && !game.nightActions[detective.username])
    return false;

  return true;
}

export function checkAllVotesSubmitted(game: GameRoom): boolean {
  return game.alivePlayers.every((u) => game.votes[u] !== undefined);
}

async function updateLeaderboard(
  game: GameRoom,
  winner: 'citizens' | 'spy'
): Promise<void> {
  for (const username of game.alivePlayers) {
    const player = game.players[username];
    if (!player) continue;

    const key = `lb:${username}`;
    const field = player.role === 'spy' ? 'spyWins' : 'citizenWins';
    await sortedRedis.hIncrBy(key, field, 1);
    await sortedRedis.hIncrBy(key, 'gamesPlayed', 1);
  }

  for (const username of game.deadPlayers) {
    const key = `lb:${username}`;
    await sortedRedis.hIncrBy(key, 'gamesPlayed', 1);
  }

  const allPlayers = [...game.alivePlayers, ...game.deadPlayers];
  for (const username of allPlayers) {
    const player = game.players[username];
    if (!player) continue;

    const key = `lb:${username}`;
    if (winner === 'citizens' && player.role !== 'spy') {
      await sortedRedis.hIncrBy(key, 'citizenWins', 1);
    } else if (winner === 'spy' && player.role === 'spy') {
      await sortedRedis.hIncrBy(key, 'spyWins', 1);
    }
  }

  const leaderboardKey = 'leaderboard:global';
  for (const username of allPlayers) {
    const player = game.players[username];
    if (!player) continue;

    let score = 0;
    const key = `lb:${username}`;
    const stats = await sortedRedis.hGetAll(key);
    if (stats) {
      score =
        Number(stats.citizenWins ?? '0') * 10 +
        Number(stats.spyWins ?? '0') * 15 +
        Number(stats.detectiveWins ?? '0') * 20;
    }
    await sortedRedis.zAdd(leaderboardKey, { member: username, score });
  }
}
