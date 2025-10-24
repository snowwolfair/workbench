import { Injectable } from '@angular/core';
import { Player, GameState } from './options';
import { SuspicionService } from './suspicion.service';

//悍跳预言家，对跳守墓人
// 无论如何，前两个狼中必有一个跳预言家
// 如果有人跳守墓人非狼队，跟跳守墓人

@Injectable({ providedIn: 'root' })
export class WolflogicService {
  constructor(private suspicionService: SuspicionService) {}

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

  night(currentPlayer: Player, state: GameState) {
    const wolfGroup = state.players.filter(p => p.role === 'wolf' && p.isAlive);
    const prophetGroup = state.players.filter(p => p.jumpRole === 'prophet' && p.isAlive && p.role !== 'wolf');
    const suspicion = this.suspicionService.calculateSuspicion(wolfGroup[0], state);

    let role = currentPlayer.role;
    let name = currentPlayer.name;

    // 如果在场非狼人预言家大于0
    if (prophetGroup.length > 0) {
      // 狼人投票
      // const wolfVote = this.wolfVote(Array.from(suspicion.keys()));
      const wolfVote = prophetGroup[0].id;
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

  day(currentPlayer: Player, state: GameState) {
    const allPlayers = state.players.filter(p => p.isAlive);
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
        // 预言家发言
        // 高概率第一天发查杀
        if (Math.random() < 0.8) {
          state.daySpeeches.push({
            playerId: currentPlayer.id,
            say: {
              type: 'see',
              targetId: targetPlayer,
              actorId: currentPlayer.id,
              result: true
            },
            content: `我是prophet，${state.players[targetPlayer].name} 是 狼人`,
            day: state.currentDay
          });
        } else {
          // 低概率第一天发 金水
          state.daySpeeches.push({
            playerId: currentPlayer.id,
            say: {
              type: 'see',
              targetId: state.players.filter(p => p.isAlive && p.id !== currentPlayer.id)[
                Math.floor(Math.random() * state.players.filter(p => p.isAlive && p.id !== currentPlayer.id).length)
              ].id,
              actorId: currentPlayer.id,
              result: false
            },
            content: `我是prophet，${state.players[state.daySpeeches[state.daySpeeches.length - 1]?.say.targetId].name} 是 村民`,
            day: state.currentDay
          });
        }
      }
    }
    // 第二日
    if (state.currentDay === 2) {
      // 如果狼队没有跳守墓人(通灵人)
      if (wolfGroup.filter(p => p.jumpRole === 'psychic').length === 0) {
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
              type: 'see',
              targetId: state.players.filter(p => p.isAlive && p.id !== currentPlayer.id)[
                Math.floor(Math.random() * state.players.filter(p => p.isAlive && p.id !== currentPlayer.id).length)
              ].id,
              actorId: currentPlayer.id,
              result: false
            },
            content: '金水',
            day: state.currentDay
          });
        }
      }
    }
    // console.log(JSON.parse(JSON.stringify(state)));
    return state;
  }
}
