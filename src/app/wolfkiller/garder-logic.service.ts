import { Injectable } from '@angular/core';
import { Player, GameState, NightAction } from './options';
import { SuspicionService } from './suspicion.service';

@Injectable({ providedIn: 'root' })
export class GarderLogicService {
  constructor(private suspicionService: SuspicionService) {}

  lastNightAction: NightAction = {
    type: 'sleep'
  };

  night(currentPlayer: Player, state: GameState) {
    const allPlayers = state.players.filter(p => p.isAlive && p.id !== currentPlayer.id);

    let role = currentPlayer.role;
    let name = currentPlayer.name;

    // 随机指定一个守卫目标
    let targetPlayer: Player;
    targetPlayer = allPlayers[Math.floor(Math.random() * allPlayers.length)];

    if (state.targetGuard) {
      // 如果有指定的守卫目标，就守卫指定的目标
      if (!!state.targetGuard && state.targetGuard.length === 2) {
        targetPlayer = state.targetGuard[1];
      }

      // 判断守卫目标是否是前一晚的守卫目标, 循环随机指定到不是前一晚的守卫目标
      while (targetPlayer === state.targetGuard[0]) {
        state.log.push(`(${role})${name} 守卫目标 ${targetPlayer.name} 是前一晚的守卫目标, 随机指定到其他目标`);
        targetPlayer = allPlayers[Math.floor(Math.random() * allPlayers.length)];
      }
    }

    // 清空守卫目标记录
    state.targetGuard = [];

    this.lastNightAction = {
      type: 'guard',
      targetId: targetPlayer.id,
      actorId: currentPlayer.id
    };

    state.nightActions.push(this.lastNightAction);
    // 记录今晚的守卫目标
    state.targetGuard.push(targetPlayer);

    console.log(JSON.parse(JSON.stringify(state)));
    state.log.push(`(${role})${name} 守卫 ${targetPlayer.name}`);
    return state;
  }

  day(currentPlayer: Player, state: GameState) {
    const allPlayers = state.players.filter(p => p.isAlive && p.id !== currentPlayer.id);

    let role = currentPlayer.role;
    let name = currentPlayer.name;

    if (state.currentDay === 1) {
      currentPlayer.jumpRole = 'villager';
      state.log.push(`(${role})${name} 说明他的身份是 ${currentPlayer.jumpRole}`);
      state.daySpeeches.push({
        playerId: currentPlayer.id,
        say: {
          type: 'sleep'
        },
        content: `我是${currentPlayer.jumpRole}`,
        day: state.currentDay
      });
    }

    return state;
  }
}
