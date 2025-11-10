import { Injectable } from '@angular/core';
import { Player, GameState, NightAction } from './options';
import { SuspicionService } from './suspicion.service';

@Injectable({ providedIn: 'root' })
export class HunterLogicService {
  constructor(private suspicionService: SuspicionService) {}

  lastNightAction: NightAction = {
    type: 'sleep'
  };

  night(currentPlayer: Player, state: GameState) {
    let role = currentPlayer.role;
    let name = currentPlayer.name;

    let targetPlayer: Player;

    if (state.targetHunter) {
      if (state.targetHunter.id === currentPlayer.id) {
        state.log.push(`(${role})${name} 指定目标为自己，复仇失败`);
      } else {
        targetPlayer = state.targetHunter;
        state.nightActions.push({
          type: 'kill',
          targetId: targetPlayer.id,
          actorId: currentPlayer.id
        });
        state.log.push(`(${role})${name} 复仇猎杀了 (${targetPlayer.role})${targetPlayer.name}`);
      }
    }
    return state;
  }

  day(currentPlayer: Player, state: GameState) {
    let role = currentPlayer.role;
    let name = currentPlayer.name;

    if (state.currentDay === 1) {
      currentPlayer.jumpRole = 'villager';
      state.log.push(`(${role})${name} 说明他的身份是 ${currentPlayer.jumpRole}`);
    }

    state.daySpeeches.push({
      playerId: currentPlayer.id,
      say: {
        type: 'sleep'
      },
      content: `我是${currentPlayer.jumpRole}`,
      day: state.currentDay
    });

    return state;
  }

  chat() {}
}
