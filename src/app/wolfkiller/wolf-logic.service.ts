import { Injectable } from '@angular/core';
import { Player, GameState} from './options.service';
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
    const wolfGroup = state.players.filter(p => p.role === 'wolf' && p.isAlive);
    const prophetGroup = state.players.filter(p => p.jumpRole === 'prophet' && p.isAlive && p.role !== 'wolf');
    const suspicion = this.suspicionService.calculateSuspicion(wolfGroup[0], state);
    // 计算每个玩家的怀疑度
    if(prophetGroup.length > 0){
      // 狼人投票
      // const wolfVote = this.wolfVote(Array.from(suspicion.keys()));
      const wolfVote = prophetGroup[0].id;
      // 刀人
      state.nightActions.push({ type: 'kill', targetId: wolfVote, actorId: wolfGroup[0].id });
    }else{
      // 狼人投票
      const wolfVote = this.wolfVote(Array.from(suspicion.keys()));
      // 刀人
      state.nightActions.push({ type: 'kill', targetId: wolfVote, actorId: wolfGroup[0].id });
    }
    
    
    
    return state;
  }
}