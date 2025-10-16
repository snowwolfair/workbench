import { Injectable } from '@angular/core';
import { Player, GameState} from './options';
import { SuspicionService } from './suspicion.service';



@Injectable({ providedIn: 'root' })
export class WolflogicService {
  constructor(
    private suspicionService: SuspicionService
  ) { }

  // wolfVote(votes: number[]) {
  //   const voteCount = votes.reduce((acc, vote) => {
  //     acc[vote] = (acc[vote] || 0) + 1;
  //     return acc;
  //   }, {} as Record<number, number>);
  //   const maxVotes = Math.max(...Object.values(voteCount));
  //   const candidates = Object.keys(voteCount)
  //     .filter(key => voteCount[Number(key)] === maxVotes)
  //     .map(Number);
  //   return candidates[Math.floor(Math.random() * candidates.length)];
  // }

  night(currentPlayer: Player, state: GameState){
    const wolfGroup = state.players.filter(p => p.role === 'wolf' && p.isAlive);
    const prophetGroup = state.players.filter(p => p.jumpRole === 'prophet' && p.isAlive && p.role !== 'wolf');
    const suspicion = this.suspicionService.calculateSuspicion(wolfGroup[0], state);
    // 如果在场非狼人预言家大于0
    if(prophetGroup.length > 0){
      // 狼人投票
      // const wolfVote = this.wolfVote(Array.from(suspicion.keys()));
      const wolfVote = prophetGroup[0].id;
      console.log(wolfVote);
      // 刀人
      if(currentPlayer.id === wolfGroup[0].id){
        state.nightActions.push({ type: 'kill', targetId: wolfVote, actorId: wolfGroup[0].id });
        
      }
    }else{
      // 狼人投票
      // const wolfVote = this.wolfVote(Array.from(suspicion.keys()));
      const wolfVote = state.players.filter(p => p.role !== 'wolf' && p.isAlive)[Math.floor(Math.random() * state.players.filter(p => p.role !== 'wolf' && p.isAlive).length)].id;
      console.log(wolfVote);
      // 刀人
      if(currentPlayer.id === wolfGroup[0].id){
        state.nightActions.push({ type: 'kill', targetId: wolfVote, actorId: wolfGroup[0].id });
      }
    }
    console.log(state.nightActions);
    
    
    
    return state;
  }


  day(state: GameState){
    const allPlayers = state.players.filter(p => p.isAlive);
    const wolfGroup = state.players.filter(p => p.role === 'wolf' && p.isAlive);
    const nonWolfPlayers = state.players.filter(p => p.role !== 'wolf' && p.isAlive);
    // 第一日
    if(state.currentDay === 1){
      wolfGroup[0].jumpRole = 'prophet';








      if(wolfGroup[0].jumpRole === 'prophet'){
        // 预言家发言
        // 高概率第一天发查杀
        if(Math.random() < 0.8){
          state.daySpeeches.push({ 
            playerId: wolfGroup[0].id, 
            say: [
              { type: 'see', 
                targetId: nonWolfPlayers[Math.floor(Math.random() * nonWolfPlayers.length)].id, 
                actorId: wolfGroup[0].id , 
                result: true
              },
            ], 
            content: 'claim_prophet', 
            day: state.currentDay 
          });
        }else{
          // 低概率第一天发 金水
          state.daySpeeches.push({ 
            playerId: wolfGroup[0].id, 
            say: [
              { 
                type: 'see', 
                targetId: state.players.filter(p => p.isAlive && p.id !== wolfGroup[0].id)[Math.floor(Math.random() * state.players.filter(p => p.isAlive && p.id !== wolfGroup[0].id).length)].id, 
                actorId: wolfGroup[0].id , 
                result: false
              },
            ], 
            content: 'accuse_wolf', 
            day: state.currentDay 
          });
        }
      }


      
    }






    return state;
  }
}