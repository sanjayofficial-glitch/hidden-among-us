export type Role = 'spy' | 'detective' | 'citizen';

export type GamePhase =
  | 'lobby'
  | 'night'
  | 'discussion'
  | 'voting'
  | 'reveal'
  | 'ended';

export type Player = {
  username: string;
  role: Role;
  alive: boolean;
  isHost: boolean;
  joinedAt: number;
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
  winner: 'citizens' | 'spy' | null;
  nightActions: Record<string, string>;
  mystery: string;
  lastEliminated: string | null;
  lastEliminatedRole: Role | null;
  investigationResult: Record<string, 'spy' | 'not_spy'>;
  createdAt: number;
};
