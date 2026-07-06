export type Role = 'spy' | 'detective' | 'citizen';

export type GamePhase = 'lobby' | 'night' | 'discussion' | 'voting' | 'reveal' | 'ended';

export type Player = {
  username: string;
  role: Role;
  alive: boolean;
  isHost: boolean;
  joinedAt: number;
};

export type Vote = {
  voter: string;
  target: string;
};

export type InvestigationResult = {
  target: string;
  result: 'spy' | 'not_spy';
};

export type WinCondition = {
  winner: 'citizens' | 'spy' | null;
  reason: string;
};

export type GameRoom = {
  roomId: string;
  postId: string;
  players: Record<string, Player>;
  phase: GamePhase;
  round: number;
  votes: Record<string, string>;
  alivePlayers: string[];
  deadPlayers: string[];
  host: string;
  timer: number;
  winner: 'citizens' | 'spy' | null;
  investigationResult: InvestigationResult | null;
  nightActions: Record<string, string>;
  mystery: string;
  createdAt: number;
};
