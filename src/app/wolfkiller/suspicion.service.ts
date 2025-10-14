import { Injectable } from '@angular/core';
import { Player, GameState } from './options.service';

@Injectable({ providedIn: 'root' })
export class SuspicionService {
  calculateSuspicion(aiplayer: Player,state: GameState){
    //设置怀疑度表
    const suspicion = new Map<number, number>();
    //检测当前的玩家是否存在
    const currentPlayer = state.players.find(p => p.id === aiplayer.id)!;
    //随机选择一个玩家作为当前玩家的仇人（怀疑度+1）
    const randomSuspicionUP = Math.floor(Math.random() * state.players.length);
    if(!suspicion.get(randomSuspicionUP)){
      suspicion.set(randomSuspicionUP, 51);
    }
    //遍历每个玩家
    for (const player of state.players) {
      // 初始化怀疑度
      let score = suspicion.get(player.id) || 50;
      console.log(score);
      
      // 自己和死人的怀疑度设为0
      if (player.id === currentPlayer.id || !player.isAlive) {
        suspicion.set(player.id, 0);
        continue;
      }

      // 狼人不怀疑其他狼人
      if(aiplayer.role === 'wolf'){
        if(player.role === 'wolf'){
          score -= 40;
        }
      }

      //设置怀疑度
      suspicion.set(player.id, score);
    }
    //返回怀疑度表
    return suspicion;
  }
}