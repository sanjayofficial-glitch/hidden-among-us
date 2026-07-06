import type { GameRoom } from './types';

export type InitResponse = {
  type: 'init';
  postId: string;
  count: number;
  username: string;
};

export type IncrementResponse = {
  type: 'increment';
  postId: string;
  count: number;
};

export type DecrementResponse = {
  type: 'decrement';
  postId: string;
  count: number;
};

export type GameStateResponse = {
  status: 'ok';
  game: GameRoom;
  username: string;
};

export type JoinResponse = {
  status: 'ok';
  game: GameRoom;
  username: string;
};

export type LeaveResponse = {
  status: 'ok';
  game: GameRoom;
};

export type StartResponse = {
  status: 'ok';
  game: GameRoom;
};

export type ErrorResponse = {
  status: 'error';
  message: string;
};
