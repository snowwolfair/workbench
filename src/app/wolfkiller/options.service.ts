// types.ts
export type Role = 'villager' | 'wolf' | 'witch' | 'garder' | 'prophet' | 'psychic';

export interface Player {
  id: number;
  name: string;
  role: Role;
  jumpRole?: Role; // 跳转到的角色（如预言家跳了）
  isAlive: boolean;
}

export interface GameState {
  players: Player[];
  nightActions: NightAction[];     // 夜晚行为记录（谁被刀、谁被验等）
  daySpeeches: Speech[];           // 白天发言记录
  currentDay: number;
}

export interface NightAction {
  type: 'kill' | 'see' | 'heal' | 'guard' | 'poison';
  targetId: number;
  actorId: number;
}

export interface Speech {
  playerId: number;
  content: string; // 可简化为关键词或标签，如 ['claim_seer', 'accuse_3']
  day: number;
}