import { Injectable, inject } from '@angular/core';

import { Player, GameState, NightAction } from './options';
import { SuspicionService } from './suspicion.service';
import { ReplyService } from '../../services/speakmodal/replay.service';

@Injectable({ providedIn: 'root' })
export class HunterLogicService {
  constructor() {}
  private suspicionService = inject(SuspicionService);
  private replyService = inject(ReplyService);

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

  async day(currentPlayer: Player, state: GameState) {
    let role = currentPlayer.role;
    let name = currentPlayer.name;

    if (state.currentDay === 1) {
      currentPlayer.jumpRole = 'villager';
      state.log.push(`(${role})${name} 说明他的身份是 ${currentPlayer.jumpRole}`);
    }

    let context = {
      role: currentPlayer.jumpRole
    };
    const speechMessage = await this.replyService.getRandomMessageAsync('villager_speech', context);

    state.daySpeeches.push({
      playerId: currentPlayer.id,
      say: {
        type: 'sleep'
      },
      content: speechMessage,
      day: state.currentDay
    });

    return state;
  }

  chat() {}
}
