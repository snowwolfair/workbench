import { Injectable } from '@angular/core';
import { Player, GameState, NightAction } from './options';
import { SuspicionService } from './suspicion.service';

@Injectable({ providedIn: 'root' })
export class ProphetLogicService {
  constructor(private suspicionService: SuspicionService) {}

  lastNightAction: NightAction | null = null;

  night(currentPlayer: Player, state: GameState) {
    const allPlayers = state.players.filter(p => p.isAlive && p.id !== currentPlayer.id);

    let role = currentPlayer.role;
    let name = currentPlayer.name;

    let targetPlayer: Player;
    targetPlayer = allPlayers[Math.floor(Math.random() * allPlayers.length)];

    if (!!state.targetProphecy) {
      targetPlayer = state.targetProphecy;
    }

    this.lastNightAction = {
      type: 'see',
      targetId: targetPlayer.id,
      actorId: currentPlayer.id,
      result: targetPlayer.role === 'wolf'
    };

    state.nightActions.push(this.lastNightAction);

    console.log(JSON.parse(JSON.stringify(state)));
    state.log.push(`(${role})${name} 预言了 ${targetPlayer.name} 是 ${targetPlayer.role === 'wolf' ? '狼人' : '村民'}`);
    return state;
  }

  day(currentPlayer: Player, state: GameState) {
    const allPlayers = state.players.filter(p => p.isAlive && p.id !== currentPlayer.id);

    let role = currentPlayer.role;
    let name = currentPlayer.name;

    currentPlayer.jumpRole = currentPlayer.role;
    state.log.push(`(${role})${name} 说明他的身份是 ${currentPlayer.jumpRole}`);

    state.daySpeeches.push({
      playerId: currentPlayer.id,
      say: this.lastNightAction,
      content: `我是${currentPlayer.role}，${state.players[this.lastNightAction.targetId].name} 是 ${this.lastNightAction.result ? '狼人' : '村民'}`,
      day: state.currentDay
    });
    state.log.push(
      `(${role})${name} 说 ${state.players[this.lastNightAction.targetId].name} 是 ${this.lastNightAction.result ? '狼人' : '村民'}`
    );
    return state;
  }
}
