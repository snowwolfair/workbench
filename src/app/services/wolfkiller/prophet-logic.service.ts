import { inject, Injectable } from '@angular/core';

import { Player, GameState, NightAction } from './options';
import { SuspicionService } from './suspicion.service';
import { ReplyService } from '../../services/speakmodal/replay.service';

@Injectable({ providedIn: 'root' })
export class ProphetLogicService {
  private suspicionService = inject(SuspicionService);
  private replyService = inject(ReplyService);

  lastNightAction: NightAction | null = null;
  prophecySet = new Map<number, boolean>();

  night(currentPlayer: Player, state: GameState) {
    const allPlayers = state.players.filter(p => p.isAlive && p.id !== currentPlayer.id);

    let role = currentPlayer.role;
    let name = currentPlayer.name;

    let targetPlayer: Player;
    do {
      targetPlayer = allPlayers[Math.floor(Math.random() * allPlayers.length)];
    } while (this.prophecySet.has(targetPlayer.id));

    if (state.targetProphecy) {
      targetPlayer = state.targetProphecy;
    }

    this.lastNightAction = {
      type: 'see',
      targetId: targetPlayer.id,
      actorId: currentPlayer.id,
      result: targetPlayer.role === 'wolf'
    };

    this.prophecySet.set(targetPlayer.id, targetPlayer.role === 'wolf');

    state.nightActions.push(this.lastNightAction);

    state.players.find(p => p.id === currentPlayer.id).prophecySet = this.prophecySet;

    console.log(JSON.parse(JSON.stringify(state)));
    state.log.push(`(${role})${name} 预言了 ${targetPlayer.name} 是 ${targetPlayer.role === 'wolf' ? '狼人' : '村民'}`);
    return state;
  }

  async day(currentPlayer: Player, state: GameState) {
    let role = currentPlayer.role;
    let name = currentPlayer.name;
    currentPlayer.jumpRole = currentPlayer.role;
    if (state.currentDay === 1) {
      state.log.push(`(${role})${name} 说明他的身份是 ${currentPlayer.jumpRole}`);
      let context = {
        role: currentPlayer.jumpRole,
        name: state.players[this.lastNightAction.targetId].name,
        result: this.lastNightAction.result ? '狼人' : '村民'
      };

      const speechMessage = await this.replyService.getRandomMessageAsync('prophet_speech_d1', context);

      this.pushState(
        state,
        currentPlayer.id,
        speechMessage,
        this.lastNightAction.type,
        this.lastNightAction.actorId,
        this.lastNightAction.targetId,
        this.lastNightAction.result
      );
    } else {
      let context = {
        role: currentPlayer.jumpRole,
        name: state.players[this.lastNightAction.targetId].name,
        result: this.lastNightAction.result ? '狼人' : '村民'
      };

      const speechMessage = await this.replyService.getRandomMessageAsync('prophet_speech', context);

      this.pushState(
        state,
        currentPlayer.id,
        speechMessage,
        this.lastNightAction.type,
        this.lastNightAction.actorId,
        this.lastNightAction.targetId,
        this.lastNightAction.result
      );
    }

    state.log.push(
      `(${role})${name} 说 ${state.players[this.lastNightAction.targetId].name} 是 ${this.lastNightAction.result ? '狼人' : '村民'}`
    );
    return state;
  }

  pushState(
    state: GameState,
    playerId: number,
    speechMessage: string,
    type: 'psychic' | 'kill' | 'see' | 'heal' | 'guard' | 'poison' | 'sleep' | 'hunt',
    actorId?: number,
    targetId?: number,
    result?: boolean
  ) {
    state.daySpeeches.push({
      playerId: playerId,
      say: {
        type: type,
        targetId: targetId,
        actorId: actorId,
        result: result
      },
      content: speechMessage,
      day: state.currentDay
    });
  }
}
