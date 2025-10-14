import { Injectable } from '@angular/core';
import { Player, GameState } from './options.service';
import { SuspicionService } from './suspicion.service';


@Injectable({ providedIn: 'root' })
export class WolflogicService {

  constructor(
    private suspicionService: SuspicionService
  ) { }



  wolfVote(votes: number[]) {
    const voteCount = votes.reduce((acc, vote) => {
      acc[vote] = (acc[vote] || 0) + 1;
      return acc;
    }, {} as Record<number, number>);
    const maxVotes = Math.max(...Object.values(voteCount));
    const candidates = Object.keys(voteCount)
      .filter(key => voteCount[Number(key)] === maxVotes)
      .map(Number);
    return candidates[Math.floor(Math.random() * candidates.length)];
  }

  night(state: GameState){
    const prophetGroup = state.players.filter(p => p.role === 'prophet' && p.isAlive || p.jumpRole === 'prophet' && p.isAlive);
    // 计算每个玩家的怀疑度

    
    
    return state;
  }
}