import { Injectable } from '@angular/core';
import { Player, GameState } from './options';

@Injectable({ providedIn: 'root' })
export class SuspicionService {
  calculateSuspicion(aiplayer: Player, state: GameState) {
    //设置怀疑度表
    const suspicion = new Map<number, number>();
    //检测当前的玩家是否存在
    const currentPlayer = state.players.find(p => p.id === aiplayer.id)!;
    //随机选择一个玩家作为当前玩家的仇人（怀疑度+10）
    const randomSuspicionUP = Math.floor(Math.random() * state.players.length);
    if (!suspicion.get(randomSuspicionUP)) {
      suspicion.set(randomSuspicionUP, 60);
    }
    //遍历每个玩家
    for (const player of state.players) {
      // 初始化怀疑度
      let score = suspicion.get(player.id) || 50;
      // console.log(player.id,score);

      // 自己和死人的怀疑度设为0
      if (player.id === currentPlayer.id || !player.isAlive) {
        suspicion.set(player.id, 0);
        continue;
      }

      // 狼人不怀疑其他狼人
      if (currentPlayer.role === 'wolf') {
        if (player.role === 'wolf') {
          score -= 20;
        }
      }

      // 神职不被怀疑
      if (player.jumpRole !== 'villager') {
        score -= 20;
      }

      if (
        state.daySpeeches
          .filter(s => s.say.type === 'see' && s.say.result)
          .map(s => s.say.targetId)
          .includes(player.id)
      ) {
        score += 20;
      } else if (
        state.daySpeeches
          .filter(s => s.say.type === 'see' && !s.say.result)
          .map(s => s.say.targetId)
          .includes(player.id)
      ) {
        score -= 20;
      }

      //设置怀疑度
      suspicion.set(player.id, score);
    }
    //返回怀疑度表
    return suspicion;
  }
}
