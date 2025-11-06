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
    const allPlayers = state.players.filter(p => p.isAlive && p.id !== currentPlayer.id);

    let role = currentPlayer.role;
    let name = currentPlayer.name;

    let targetPlayer: Player;
    targetPlayer = allPlayers[Math.floor(Math.random() * allPlayers.length)];

    if (state.targetGuard) {
      if (!!state.targetGuard && state.targetGuard.length === 2) {
        targetPlayer = state.targetGuard[1];
      }
    }

    state.targetGuard = [];

    this.lastNightAction = {
      type: 'guard',
      targetId: targetPlayer.id,
      actorId: currentPlayer.id
    };

    state.nightActions.push(this.lastNightAction);

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
}
