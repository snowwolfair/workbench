import { Injectable, inject } from '@angular/core';

import { Player, GameState } from './options';
import { SuspicionService } from './suspicion.service';
import { ReplyService } from '../../services/speakmodal/replay.service';

// 悍跳预言家，对跳守墓人
// 无论如何，前两个狼中必有一个跳预言家
// 如果有人跳守墓人非狼队，跟跳守墓人

@Injectable({ providedIn: 'root' })
export class WolflogicService {
  private suspicionService = inject(SuspicionService);
  private replyService = inject(ReplyService);

  // wolfVote(votes: number[]) {
  //   const voteCount = votes.reduce((acc, vote) => {
  //     acc[vote] = (acc[vote] || 0) + 1;
  //     return acc;
  //   }, {} as Record<number, number>);
  //   const maxVotes = Math.max(...Object.values(voteCount));
  //   const candidates = Object.keys(voteCount)
  //     .filter(key => voteCount[Number(key)] === maxVotes)
  //     .map(Number);
  //   return candidates[Math.floor(Math.random() * candidates.length)];
  // }

  prophecySet = new Map<number, boolean>();

  night(currentPlayer: Player, state: GameState) {
    const wolfGroup = state.players.filter(p => p.role === 'wolf' && p.isAlive);
    const prophetGroup = state.players.filter(p => p.jumpRole === 'prophet' && p.isAlive && p.role !== 'wolf');
    // const suspicion = this.suspicionService.calculateSuspicion(wolfGroup[0], state);

    let role = currentPlayer.role;
    let name = currentPlayer.name;

    // 如果在场非狼人预言家大于0
    if (prophetGroup.length > 0) {
      // 狼人投票
      // const wolfVote = this.wolfVote(Array.from(suspicion.keys()));
      const wolfVote = state.players.filter(p => p.role !== 'wolf' && p.isAlive)[
        Math.floor(Math.random() * state.players.filter(p => p.role !== 'wolf' && p.isAlive).length)
      ].id;
      // const wolfVote = prophetGroup[0].id;
      // console.log(wolfVote);

      state.log.push(`(${role})${name} 投票了 (${state.players[wolfVote].role})${state.players[wolfVote].name}`);
      // 刀人
      if (currentPlayer.id === wolfGroup[wolfGroup.length - 1].id) {
        state.nightActions.push({ type: 'kill', targetId: wolfVote, actorId: wolfGroup[wolfGroup.length - 1].id });
        state.log.push(`(${role})${name} 杀死了 (${state.players[wolfVote].role})${state.players[wolfVote].name}`);
      }
    } else {
      // 狼人投票
      // const wolfVote = this.wolfVote(Array.from(suspicion.keys()));
      const wolfVote = state.players.filter(p => p.role !== 'wolf' && p.isAlive)[
        Math.floor(Math.random() * state.players.filter(p => p.role !== 'wolf' && p.isAlive).length)
      ].id;
      // console.log(wolfVote);
      state.log.push(`(${role})${name} 投票了 (${state.players[wolfVote].role})${state.players[wolfVote].name}`);
      // 刀人

      if (currentPlayer.id === wolfGroup[wolfGroup.length - 1].id) {
        state.nightActions.push({ type: 'kill', targetId: wolfVote, actorId: wolfGroup[wolfGroup.length - 1].id });
        state.log.push(`(${role})${name} 杀死了 (${state.players[wolfVote].role})${state.players[wolfVote].name}`);
      }
    }
    // console.log(JSON.parse(JSON.stringify(state)));

    return state;
  }

  async day(currentPlayer: Player, state: GameState) {
    const wolfGroup = state.players.filter(p => p.role === 'wolf' && p.isAlive);
    const nonWolfPlayers = state.players.filter(p => p.role !== 'wolf' && p.isAlive);
    // 第一日
    if (state.currentDay === 1) {
      // 如果狼队没有跳预言家
      if (wolfGroup.filter(p => p.jumpRole === 'prophet').length === 0) {
        if (Math.random() < 0.4) {
          // 狼队随机一个跳预言家
          currentPlayer.jumpRole = 'prophet';
        }
        // 如果前面都没跳预言家，最后一个狼人跳预言家
        // if(currentPlayer.id === wolfGroup[wolfGroup.length - 1].id){
        //   currentPlayer.jumpRole = 'prophet';
        // }
      }
      if (currentPlayer.jumpRole === 'prophet') {
        const targetPlayer = nonWolfPlayers[Math.floor(Math.random() * nonWolfPlayers.length)].id;
        let choosePlayer: number;
        do {
          choosePlayer = state.players.filter(p => p.isAlive && p.id !== currentPlayer.id)[
            Math.floor(Math.random() * state.players.filter(p => p.isAlive && p.id !== currentPlayer.id).length)
          ].id;
        } while (this.prophecySet.has(choosePlayer));
        // 预言家发言
        // 高概率第一天发查杀

        if (Math.random() < 0.8) {
          let context = {
            role: currentPlayer.jumpRole,
            name: state.players[targetPlayer].name,
            result: '狼人'
          };
          const speechMessage = await this.replyService.getRandomMessageAsync('prophet_speech_d1', context);
          this.pushState(state, currentPlayer.id, speechMessage, 'see', currentPlayer.id, targetPlayer, true);
          this.prophecySet.set(targetPlayer, true);
        } else {
          // 低概率第一天发 金水
          let context = {
            role: currentPlayer.jumpRole,
            name: state.players[targetPlayer].name,
            result: '村民'
          };
          const speechMessage = await this.replyService.getRandomMessageAsync('prophet_speech_d1', context);
          this.pushState(state, currentPlayer.id, speechMessage, 'see', currentPlayer.id, targetPlayer, false);
          this.prophecySet.set(choosePlayer, false);
        }
        state.players.find(p => p.id === currentPlayer.id).prophecySet = this.prophecySet;
      } else {
        // 不是预言家，其他狼第一夜就跳村民
        let context = {
          role: currentPlayer.jumpRole
        };
        const speechMessage = await this.replyService.getRandomMessageAsync('villager_speech', context);
        currentPlayer.jumpRole = 'villager';
        this.pushState(state, currentPlayer.id, speechMessage, 'sleep');
      }
    }
    // 第二日
    if (state.currentDay === 2) {
      // 如果狼队没有跳守墓人(通灵人)
      if (wolfGroup.filter(p => p.jumpRole === 'psychic').length === 0) {
        // 40%概率跳守墓人(通灵人)
        if (Math.random() < 0.4 && currentPlayer.jumpRole !== 'prophet') {
          // 狼队随机一个跳守墓人(通灵人)
          currentPlayer.jumpRole = 'psychic';
        }
      }
      if (currentPlayer.jumpRole === 'psychic') {
        // 通灵人发言
        // 高概率第二天发 金水
        if (Math.random() < 0.8) {
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
          // 低概率第二天发 预言
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
      this.wolfProphet(currentPlayer, state);
    }

    if (state.currentDay >= 3) {
      // 狼队预言家行动
      this.wolfProphet(currentPlayer, state);

      // 狼队通灵人行动
      this.wolfPsychic(currentPlayer, state);
    }
    // console.log(JSON.parse(JSON.stringify(state)));
    return state;
  }

  // 狼队预言家行动
  async wolfProphet(currentPlayer: Player, state: GameState) {
    if (currentPlayer.jumpRole === 'prophet') {
      let count = 0;
      let choosePlayer: number;
      do {
        choosePlayer = state.players.filter(p => p.isAlive && p.id !== currentPlayer.id)[
          Math.floor(Math.random() * state.players.filter(p => p.isAlive && p.id !== currentPlayer.id).length)
        ].id;
        count++;
      } while (this.prophecySet.has(choosePlayer) && count < 50);
      // 预言家发言
      if (state.targetProphecy) {
        // 如果指定目标预测过，直接根据预测结果发言
        if (this.prophecySet.has(state.targetProphecy.id)) {
          // 之前的预言结果为狼
          if (this.prophecySet.get(state.targetProphecy.id)) {
            let context = {
              role: currentPlayer.jumpRole,
              name: state.players[state.targetProphecy.id].name,
              result: '狼人'
            };
            const speechMessage = await this.replyService.getRandomMessageAsync('prophet_speech', context);
            this.pushState(state, currentPlayer.id, speechMessage, 'see', currentPlayer.id, state.targetProphecy.id, true);
          } else {
            // 之前的预言结果为村民
            let context = {
              role: currentPlayer.jumpRole,
              name: state.players[state.targetProphecy.id].name,
              result: '村民'
            };
            const speechMessage = await this.replyService.getRandomMessageAsync('prophet_speech', context);
            this.pushState(state, currentPlayer.id, speechMessage, 'see', currentPlayer.id, state.targetProphecy.id, false);
          }
          return;
        }

        // 狼队如果测到狼人，低概率测对
        if (state.targetProphecy.role === 'wolf') {
          if (Math.random() < 0.4) {
            let context = {
              role: currentPlayer.jumpRole,
              name: state.players[state.targetProphecy.id].name,
              result: '狼人'
            };
            const speechMessage = await this.replyService.getRandomMessageAsync('prophet_speech', context);
            this.pushState(state, currentPlayer.id, speechMessage, 'see', currentPlayer.id, state.targetProphecy.id, true);
            this.prophecySet.set(state.targetProphecy.id, true);
          } else {
            // 高概率测错
            let context = {
              role: currentPlayer.jumpRole,
              name: state.players[state.targetProphecy.id].name,
              result: '村民'
            };
            const speechMessage = await this.replyService.getRandomMessageAsync('prophet_speech', context);
            this.pushState(state, currentPlayer.id, speechMessage, 'see', currentPlayer.id, state.targetProphecy.id, false);
            this.prophecySet.set(state.targetProphecy.id, false);
          }
        } else {
          // 狼队如果测到村民，高概率测对
          if (Math.random() < 0.4) {
            let context = {
              role: currentPlayer.jumpRole,
              name: state.players[state.targetProphecy.id].name,
              result: '狼人'
            };
            const speechMessage = await this.replyService.getRandomMessageAsync('prophet_speech', context);
            this.pushState(state, currentPlayer.id, speechMessage, 'see', currentPlayer.id, state.targetProphecy.id, true);
            this.prophecySet.set(state.targetProphecy.id, true);
          } else {
            // 低概率测错
            let context = {
              role: currentPlayer.jumpRole,
              name: state.players[state.targetProphecy.id].name,
              result: '村民'
            };
            const speechMessage = await this.replyService.getRandomMessageAsync('prophet_speech', context);
            this.pushState(state, currentPlayer.id, speechMessage, 'see', currentPlayer.id, state.targetProphecy.id, false);
            this.prophecySet.set(state.targetProphecy.id, false);
          }
        }
      } else {
        if (this.prophecySet.has(choosePlayer)) {
          // 之前的预言结果为狼
          if (this.prophecySet.get(choosePlayer)) {
            let context = {
              role: currentPlayer.jumpRole,
              name: state.players[choosePlayer].name,
              result: '狼人'
            };
            const speechMessage = await this.replyService.getRandomMessageAsync('prophet_speech', context);
            this.pushState(state, currentPlayer.id, speechMessage, 'see', currentPlayer.id, choosePlayer, true);
          } else {
            // 之前的预言结果为村民
            let context = {
              role: currentPlayer.jumpRole,
              name: state.players[choosePlayer].name,
              result: '村民'
            };
            const speechMessage = await this.replyService.getRandomMessageAsync('prophet_speech', context);
            this.pushState(state, currentPlayer.id, speechMessage, 'see', currentPlayer.id, choosePlayer, false);
          }
          return;
        }
        // 狼队如果测到村民，高概率测对
        if (Math.random() < 0.4) {
          let context = {
            role: currentPlayer.jumpRole,
            name: state.players[choosePlayer].name,
            result: '狼人'
          };
          const speechMessage = await this.replyService.getRandomMessageAsync('prophet_speech', context);
          this.pushState(state, currentPlayer.id, speechMessage, 'see', currentPlayer.id, choosePlayer, true);
          this.prophecySet.set(choosePlayer, true);
        } else {
          // 低概率测错
          let context = {
            role: currentPlayer.jumpRole,
            name: state.players[choosePlayer].name,
            result: '村民'
          };
          const speechMessage = await this.replyService.getRandomMessageAsync('prophet_speech', context);
          this.pushState(state, currentPlayer.id, speechMessage, 'see', currentPlayer.id, choosePlayer, false);
          this.prophecySet.set(choosePlayer, false);
        }
        console.log(state.players[choosePlayer].name);
      }
      state.players.find(p => p.id === currentPlayer.id).prophecySet = this.prophecySet;
    }
  }

  // 狼队通灵人行动
  wolfPsychic(currentPlayer: Player, state: GameState) {
    if (currentPlayer.jumpRole === 'psychic') {
      // 通灵人发言
      if (Math.random() < 0.6) {
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
