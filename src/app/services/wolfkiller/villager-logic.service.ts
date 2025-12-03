import { Injectable, inject } from '@angular/core';

import { Player, GameState } from './options';
import { SuspicionService } from './suspicion.service';
import { ReplyService } from '../../services/speakmodal/replay.service';

@Injectable({ providedIn: 'root' })
export class VillagerLogicService {
  private suspicionService = inject(SuspicionService);
  private replyService = inject(ReplyService);

  // 伪装成神职
  // 预言家 、 通灵人
  // 2神4人 伪装成功概率10%
  // 单人成功概率60% 双人成功概率20% 合理

  prophecySet = new Map<number, boolean>();

  night(currentPlayer: Player, state: GameState) {
    return state;
  }

  async day(currentPlayer: Player, state: GameState) {
    const villagerGroup = state.players.filter(p => p.role === 'villager' && p.isAlive);
    const notSelfGroup = state.players.filter(p => p.id !== currentPlayer.id && p.isAlive);

    if (state.currentDay === 1) {
      // 如果村民队没有跳预言家
      if (villagerGroup.filter(p => p.jumpRole === 'prophet').length === 0) {
        if (Math.random() < 0.1) {
          currentPlayer.jumpRole = 'prophet';
        }
      }
      if (currentPlayer.jumpRole === 'prophet') {
        const targetPlayer = notSelfGroup[Math.floor(Math.random() * notSelfGroup.length)].id;
        let choosePlayer: number;
        do {
          choosePlayer = state.players.filter(p => p.isAlive && p.id !== currentPlayer.id)[
            Math.floor(Math.random() * state.players.filter(p => p.isAlive && p.id !== currentPlayer.id).length)
          ].id;
        } while (this.prophecySet.has(choosePlayer));
        // 预言家发言
        // 随机发言
        if (Math.random() < 0.5) {
          let context = {
            role: currentPlayer.jumpRole,
            name: state.players[targetPlayer].name,
            result: '狼人'
          };
          const speechMessage = await this.replyService.getRandomMessageAsync('prophet_speech_d1', context);
          this.pushState(state, currentPlayer.id, speechMessage, 'see', currentPlayer.id, targetPlayer, true);
          this.prophecySet.set(targetPlayer, true);
        } else {
          let context = {
            role: currentPlayer.jumpRole,
            name: state.players[choosePlayer].name,
            result: '村民'
          };
          const speechMessage = await this.replyService.getRandomMessageAsync('prophet_speech_d1', context);
          this.pushState(state, currentPlayer.id, speechMessage, 'see', currentPlayer.id, choosePlayer, false);
          this.prophecySet.set(choosePlayer, false);
        }
        state.players.find(p => p.id === currentPlayer.id).prophecySet = this.prophecySet;
      } else {
        let context = {
          role: currentPlayer.jumpRole
        };
        const speechMessage = await this.replyService.getRandomMessageAsync('villager_speech', context);
        currentPlayer.jumpRole = 'villager';
        this.pushState(state, currentPlayer.id, speechMessage, 'sleep');
        // state.daySpeeches.push({
        //   playerId: currentPlayer.id,
        //   say: {
        //     type: 'sleep'
        //   },
        //   content: speechMessage,
        //   day: state.currentDay
        // });
      }
    }
    // 第二日
    if (state.currentDay === 2) {
      // 如果村民没有跳守墓人(通灵人)
      if (villagerGroup.filter(p => p.jumpRole === 'psychic').length === 0) {
        // 10%概率跳守墓人(通灵人)
        if (Math.random() < 0.1 && currentPlayer.jumpRole !== 'prophet') {
          // 村民随机一个跳守墓人(通灵人)
          currentPlayer.jumpRole = 'psychic';
        }
      }
      if (currentPlayer.jumpRole === 'psychic') {
        // 通灵人发言
        // 随机发言
        if (Math.random() < 0.5) {
          state.daySpeeches.push({
            playerId: currentPlayer.id,
            say: {
              type: 'psychic',
              targetId: state.vote.id,
              actorId: currentPlayer.id,
              result: false
            },
            content: `我是psychic，${state.players[state.vote.id].name} 是 村民`,
            day: state.currentDay
          });
        } else {
          state.daySpeeches.push({
            playerId: currentPlayer.id,
            say: {
              type: 'psychic',
              targetId: state.vote.id,
              actorId: currentPlayer.id,
              result: true
            },
            content: `我是psychic，${state.players[state.vote.id].name} 是 狼人`,
            day: state.currentDay
          });
        }
      }
      this.villagerProphet(currentPlayer, state);
    }

    return state;
  }

  async villagerProphet(currentPlayer: Player, state: GameState) {
    const notSelfGroup = state.players.filter(p => p.id !== currentPlayer.id && p.isAlive);
    if (currentPlayer.jumpRole === 'prophet') {
      let cont = 0;
      let choosePlayerId: number;
      do {
        choosePlayerId = notSelfGroup[Math.floor(Math.random() * notSelfGroup.length)].id;
        cont++;
      } while (this.prophecySet.has(choosePlayerId) && cont < 50);
      // 预言家发言
      if (state.targetProphecy) {
        // 如果指定目标预测过，直接根据预测结果发言
        if (this.prophecySet.has(state.targetProphecy.id)) {
          // 预测为狼
          if (this.prophecySet.get(state.targetProphecy.id)) {
            let context = {
              role: currentPlayer.jumpRole,
              name: state.players[state.targetProphecy.id].name,
              result: '狼人'
            };
            const speechMessage = await this.replyService.getRandomMessageAsync('prophet_speech', context);
            this.pushState(state, currentPlayer.id, speechMessage, 'see', currentPlayer.id, choosePlayerId, true);
          } else {
            let context = {
              role: currentPlayer.jumpRole,
              name: state.players[state.targetProphecy.id].name,
              result: '村民'
            };
            const speechMessage = await this.replyService.getRandomMessageAsync('prophet_speech', context);
            this.pushState(state, currentPlayer.id, speechMessage, 'see', currentPlayer.id, choosePlayerId, false);
          }
          return;
        } else {
          // 有目标，随机
          if (Math.random() < 0.5) {
            let context = {
              role: currentPlayer.jumpRole,
              name: state.players[state.targetProphecy.id].name,
              result: '狼人'
            };
            const speechMessage = await this.replyService.getRandomMessageAsync('prophet_speech', context);
            this.pushState(state, currentPlayer.id, speechMessage, 'see', currentPlayer.id, choosePlayerId, true);
            this.prophecySet.set(state.targetProphecy.id, true);
          } else {
            let context = {
              role: currentPlayer.jumpRole,
              name: state.players[state.targetProphecy.id].name,
              result: '村民'
            };
            const speechMessage = await this.replyService.getRandomMessageAsync('prophet_speech', context);
            this.pushState(state, currentPlayer.id, speechMessage, 'see', currentPlayer.id, choosePlayerId, false);
            this.prophecySet.set(state.targetProphecy.id, false);
          }
        }
      } else {
        // 随机
        if (Math.random() < 0.5) {
          let context = {
            role: currentPlayer.jumpRole,
            name: state.players[choosePlayerId].name,
            result: '狼人'
          };
          const speechMessage = await this.replyService.getRandomMessageAsync('prophet_speech', context);
          this.pushState(state, currentPlayer.id, speechMessage, 'see', currentPlayer.id, choosePlayerId, true);
          this.prophecySet.set(choosePlayerId, true);
        } else {
          // 低概率测错
          let context = {
            role: currentPlayer.jumpRole,
            name: state.players[choosePlayerId].name,
            result: '村民'
          };
          const speechMessage = await this.replyService.getRandomMessageAsync('prophet_speech', context);
          this.pushState(state, currentPlayer.id, speechMessage, 'see', currentPlayer.id, choosePlayerId, false);
          this.prophecySet.set(choosePlayerId, false);
        }
        console.log(state.players[choosePlayerId].name);
      }
      state.players.find(p => p.id === currentPlayer.id).prophecySet = this.prophecySet;
    }
  }

  villagerPsychic(currentPlayer: Player, state: GameState) {
    if (currentPlayer.jumpRole === 'psychic') {
      // 通灵人发言
      if (Math.random() < 0.5) {
        state.daySpeeches.push({
          playerId: currentPlayer.id,
          say: {
            type: 'psychic',
            targetId: state.vote.id,
            actorId: currentPlayer.id,
            result: false
          },
          content: `昨天白天吊死的${state.players[state.vote.id].name} 是 村民`,
          day: state.currentDay
        });
      } else {
        // 低概率第二天发 预言
        state.daySpeeches.push({
          playerId: currentPlayer.id,
          say: {
            type: 'psychic',
            targetId: state.vote.id,
            actorId: currentPlayer.id,
            result: true
          },
          content: `昨天白天吊死的${state.players[state.vote.id].name} 是 狼人`,
          day: state.currentDay
        });
      }
    }
  }

  chat() {}

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
