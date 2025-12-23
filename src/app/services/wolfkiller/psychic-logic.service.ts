import { Injectable, inject } from '@angular/core';

import { Player, GameState, NightAction } from './options';
import { SuspicionService } from './suspicion.service';
import { ReplyService } from '../../services/speakmodal/replay.service';

@Injectable({ providedIn: 'root' })
export class PsychicLogicService {
  private suspicionService = inject(SuspicionService);
  private replyService = inject(ReplyService);

  lastNightAction: NightAction = {
    type: 'sleep'
  };

  night(currentPlayer: Player, state: GameState) {
    // const allPlayers = state.players.filter(p => p.isAlive && p.id !== currentPlayer.id);

    let role = currentPlayer.role;
    let name = currentPlayer.name;

    let targetPlayer: Player;
    targetPlayer = state.vote;

    if (!targetPlayer) {
      this.lastNightAction = {
        type: 'sleep'
      };
      return state;
    } else {
      this.lastNightAction = {
        type: 'psychic',
        targetId: targetPlayer.id,
        actorId: currentPlayer.id,
        result: targetPlayer.role === 'wolf'
      };

      state.nightActions.push(this.lastNightAction);

      console.log(JSON.parse(JSON.stringify(state)));
      state.log.push(`(${role})${name} 通灵了 ${targetPlayer.name} 是 ${targetPlayer.role === 'wolf' ? '狼人' : '村民'}`);
      return state;
    }
  }

  async day(currentPlayer: Player, state: GameState) {
    // const allPlayers = state.players.filter(p => p.isAlive && p.id !== currentPlayer.id);

    let role = currentPlayer.role;
    let name = currentPlayer.name;
    if (state.currentDay === 1) {
      currentPlayer.jumpRole = 'villager';
      state.log.push(`(${role})${name} 说明他的身份是 ${currentPlayer.jumpRole}`);
      let context = {
        role: currentPlayer.jumpRole
      };
      const speechMessage = await this.replyService.getRandomMessageAsync('villager_speech', context);

      state.daySpeeches.push({
        playerId: currentPlayer.id,
        say: this.lastNightAction,
        content: speechMessage,
        day: state.currentDay
      });
    } else {
      if (state.currentDay === 1) {
        currentPlayer.jumpRole = role;
        state.log.push(`(${role})${name} 说明他的身份是 ${currentPlayer.jumpRole}`);
      }

      state.daySpeeches.push({
        playerId: currentPlayer.id,
        say: this.lastNightAction,
        content: `我是${role}，${state.players[this.lastNightAction.targetId].name} 是 ${this.lastNightAction.result ? '狼人' : '村民'}`,
        day: state.currentDay
      });
      state.log.push(
        `(${role})${name} 说 ${state.players[this.lastNightAction.targetId].name} 是 ${this.lastNightAction.result ? '狼人' : '村民'}`
      );
    }

    return state;
  }
}
