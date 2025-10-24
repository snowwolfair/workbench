import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import * as THREE from 'three';
import { OrbitControls } from 'three-orbitcontrols-ts';
import { FormsModule } from '@angular/forms';
import { NzRadioModule } from 'ng-zorro-antd/radio';
import { I18nPipe, SettingsService, _HttpClient } from '@delon/theme';
import { ChangeDetectionStrategy, ChangeDetectorRef, OnDestroy, inject } from '@angular/core';
import { GameState } from '../../wolfkiller/options';
import { WolflogicService } from '../../wolfkiller/wolf-logic.service';
import { ProphetLogicService } from '../../wolfkiller/prophet-logic.service';
import { SuspicionService } from '../../wolfkiller/suspicion.service';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzMessageService } from 'ng-zorro-antd/message';
import { Player } from '../../wolfkiller/options';

@Component({
  selector: 'app-map-view',
  imports: [CommonModule, I18nPipe, FormsModule, NzRadioModule, NzModalModule],
  templateUrl: './map-view.component.html',
  styleUrls: ['./map-view.component.less']
})
export class MapViewComponent {
  // 这里只保留地图相关逻辑，如需扩展可在此添加
  private readonly http = inject(_HttpClient);
  constructor(
    private wolflogicService: WolflogicService,
    private prophetlogicService: ProphetLogicService,
    private suspicionService: SuspicionService,
    private msg: NzMessageService
  ) {}

  radioValue = '12';
  // 投票中标识
  voteSign = true;
  // 投票后标识
  votedSign = true;

  // 强制投票标识
  forceVote = false;
  // 指定预言标识
  prophecySign = false;

  // 选择玩家标识
  choosePlayer = false;

  target?: Player;
  today = 0;
  state: GameState[] = [];

  ngOnInit() {
    this.switchGameMode();
  }

  // 开始游戏
  startGame() {
    this.shuffledRoles = this.shuffle([...this.roles]);
    console.log(this.shuffledRoles);
    for (let i = 0; i < this.playerList.length; i++) {
      this.voteList.set(this.playerList[i].id, 0);
    }
    this.switchRole();
    this.gamelink();
  }

  //初始化角色和玩家列表
  roles = [];
  playerList = [];
  shuffledRoles = [];

  // 切换游戏模式 9人场/12人场
  switchGameMode() {
    this.roles = [];
    this.playerList = [];
    if (this.radioValue === '12') {
      this.roles = [
        'wolf',
        'wolf',
        'wolf',
        'wolf',
        'villager',
        'villager',
        'villager',
        'villager',
        'hunter',
        'psychic',
        'garder',
        'prophet'
      ];
      for (let i = 0; i < 12; i++) {
        this.playerList[i] = {
          id: i,
          name: 'player' + (i + 1),
          role: this.roles[i],
          isAlive: true
        };
      }
    } else if (this.radioValue === '9') {
      this.roles = ['wolf', 'wolf', 'wolf', 'villager', 'villager', 'villager', 'hunter', 'psychic', 'prophet'];
      for (let i = 0; i < 9; i++) {
        this.playerList[i] = {
          id: i,
          name: 'player' + (i + 1),
          role: this.roles[i],
          isAlive: true
        };
      }
    }
    // 初始化游戏状态
    this.state.push({
      players: this.playerList,
      nightActions: [], // 夜晚行为记录（谁被刀、谁被验等）
      daySpeeches: [], // 白天发言记录
      currentDay: 1,
      log: [] // 游戏日志
    });
    console.log(this.roles);
  }
  //洗牌算法
  shuffle(array: string[]) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }
  // 为每个玩家选择角色
  switchRole() {
    this.playerList.forEach(player => {
      player.role = this.shuffledRoles.shift() || 'person';
    });
    console.log(this.playerList);
  }

  showPlayerRole = true;

  //对话框和控制台切换
  showControl = true;
  showModel = false;

  //控制台选项
  controlOptions = [
    {
      label: '重置游戏',
      value: 1,
      disabled: false
    },
    {
      label: '指定预言',
      value: 2,
      disabled: false
    },
    {
      label: '指定守卫',
      value: 3,
      disabled: false
    },
    {
      label: '询问通灵',
      value: 4,
      disabled: false
    },
    {
      label: '显示身份',
      value: 5,
      disabled: false
    },
    {
      label: '强制投票',
      value: 6,
      disabled: false
    },
    {
      label: '自由投票',
      value: 7,
      disabled: false
    },
    {
      label: '下一日',
      value: 8,
      disabled: true
    }
  ];

  // 控制台选项点击事件
  onControlClick(option: any) {
    switch (option.value) {
      case 1:
        this.resetGame();
        break;
      case 2:
        this.choosePlayer = true;
        this.prophecySign = true;

        break;
      case 3:
        this.gameOver(false);
        break;
      case 4:
        this.showPlayerRole = !this.showPlayerRole;
        break;
      case 5:
        this.showPlayerRole = !this.showPlayerRole;
        break;
      case 6:
        this.choosePlayer = true;
        this.forceVote = true;

        // this.forceVoteId = option.value;
        break;
      case 7:
        this.target = undefined;
        this.voteSign = true;
        this.votedSign = false;
        this.choosePlayer = false;
        this.gameVote();

        if (this.playerList.filter(p => p.isAlive && p.role == 'wolf').length == 0) {
          console.log(this.playerList.filter(p => p.isAlive && p.role == 'villager').length);
          this.state[this.today].log.push(`---游戏结束，村民胜利---`);
          this.gameOver(true);
        }
        break;
      case 8:
        this.systemLogs = this.state[this.today].log;
        console.log(JSON.parse(JSON.stringify(this.systemLogs)));
        // 下一日
        this.today++;

        // 初始化下一日游戏状态
        this.state.push({
          players: this.playerList,
          nightActions: [], // 夜晚行为记录（谁被刀、谁被验等）
          daySpeeches: [], // 白天发言记录
          currentDay: this.today + 1,
          log: this.systemLogs // 系统日志
        });
        // 游戏进行
        this.gamelink();
        break;
    }
  }

  // 按钮禁用
  setDisabled(option: any) {
    if (option.value === 7 || option.value === 6) {
      return this.voteSign;
    }
    if (option.value === 8) {
      return this.votedSign;
    }
    return false;
  }

  // 在指定预言，指定守卫，强制投票中
  // 获取鼠标点击的对应玩家
  getPlayer(id: number) {
    // 选择玩家后，点击玩家进行投票
    if (this.choosePlayer && this.forceVote) {
      this.voteSign = true;
      this.votedSign = false;
      this.target = this.playerList[id];
      console.log(this.target);
      this.gameVote();
      // 清除选择玩家状态
      this.choosePlayer = false;
      this.forceVote = false;
      // 检查是否所有狼人都已死亡，判定胜利
      if (this.playerList.filter(p => p.isAlive && p.role == 'wolf').length == 0) {
        console.log(this.playerList.filter(p => p.isAlive && p.role == 'villager').length);
        this.state[this.today].log.push(`---游戏结束，村民胜利---`);
        this.gameOver(true);
      }
    }

    // 选择玩家后，点击玩家进行预言
    if (this.choosePlayer && this.prophecySign) {
      this.state[this.today].targetProphecy = this.playerList[id];
      console.log(this.state[this.today].targetProphecy);
      // 清除选择玩家状态
      this.choosePlayer = false;
      this.prophecySign = false;
    }
  }

  // 游戏链接
  gamelink() {
    this.voteSign = false;
    this.gameNight();
    if (this.gameResult) {
      return;
    }
    this.gameDay();
  }

  gameNight() {
    this.voteSign = false;
    this.votedSign = true;

    this.state[this.today].log.push(`---第${this.today}日夜---`);
    let currentState = this.state[this.today];
    console.log(JSON.parse(JSON.stringify(this.state)));
    for (let i = 0; i < this.playerList.length; i++) {
      if (!this.playerList[i].isAlive) {
        continue;
      }
      switch (this.playerList[i].role) {
        case 'wolf':
          this.state[this.today] = this.wolflogicService.night(this.playerList[i], this.state[this.today]);
          console.log(JSON.parse(JSON.stringify(this.state)));
          break;
        case 'villager':
          break;
        case 'hunter':
          break;
        case 'psychic':
          break;
        case 'garder':
          break;
        case 'prophet':
          this.state[this.today] = this.prophetlogicService.night(this.playerList[i], this.state[this.today]);
          console.log(JSON.parse(JSON.stringify(this.state)));
          break;
      }
    }
    currentState.nightActions.forEach(action => {
      if (action.type === 'kill') {
        currentState.players[action.targetId].isAlive = false;
      }
    });
    // 添加游戏日志
    this.addGameLogNight(this.state[this.today]);

    console.log(currentState);

    // 如果狼人数量大于其他人数量，狼人胜利
    if (
      currentState.players.filter(p => p.isAlive && p.role !== 'wolf').length <
      currentState.players.filter(p => p.isAlive && p.role === 'wolf').length
    ) {
      this.state[this.today].log.push(`---游戏结束，狼人胜利---`);
      this.gameOver(false);
    }
  }

  gameDay() {
    this.state[this.today].log.push(`---第${this.today + 1}日早---`);
    let currentState = this.state[this.today];
    for (let i = 0; i < this.playerList.length; i++) {
      if (!this.playerList[i].isAlive) {
        continue;
      }
      switch (this.playerList[i].role) {
        case 'wolf':
          this.state[this.today] = this.wolflogicService.day(this.playerList[i], this.state[this.today]);
          break;
        case 'villager':
          break;
        case 'hunter':
          break;
        case 'psychic':
          break;
        case 'garder':
          break;
        case 'prophet':
          this.state[this.today] = this.prophetlogicService.day(this.playerList[i], this.state[this.today]);
          console.log(JSON.parse(JSON.stringify(this.state)));
          break;
      }
    }

    // 添加游戏日志
    this.addGameLogDay(this.state[this.today]);

    // let vote = this.startVote();
    // this.state[this.today].log.push(`玩家${vote + 1} 被投票出局`);
    // this.playerList[vote].isAlive = false;
    // this.state[this.today].vote = this.playerList[vote];
    // // if(forceVote == true){
    // //   currentState.players[vote.targetId].isAlive = false;
    // // }
    // // // currentState.players[vote.targetId].isAlive = false;

    // this.addGameLogVote(this.state[this.today]);
  }

  gameVote() {
    let vote = this.startVote();
    this.state[this.today].log.push(`玩家${vote + 1} 被投票出局`);
    this.playerList[vote].isAlive = false;
    this.state[this.today].vote = this.playerList[vote];

    this.addGameLogVote(this.state[this.today]);
  }

  // 玩家发言
  talk() {
    this.showModel = !this.showModel;
  }

  // 投票系统
  voteList: Map<number, number> = new Map();

  startVote() {
    this.state[this.today].log.push(`---第${this.today + 1}日投票---`);
    for (let i = 0; i < this.playerList.length; i++) {
      if (!this.playerList[i].isAlive) {
        continue;
      }
      const sortedKeys = Array.from(this.suspicionService.calculateSuspicion(this.playerList[i], this.state[this.today]).entries())
        .sort((a, b) => b[1] - a[1]) // 按 value 降序：b[1] - a[1]
        .map(entry => entry[0]); // 提取 key
      if (this.target) {
        if (this.target !== this.playerList[i]) {
          this.voteList.set(this.target.id, (this.voteList.get(this.target.id) || 0) + 1);
          this.state[this.today].log.push(`玩家${this.playerList[i].id + 1} 投票给玩家${this.target.id + 1}`);
        } else {
          this.voteList.set(sortedKeys[0], (this.voteList.get(sortedKeys[0]) || 0) + 1);
          this.state[this.today].log.push(`玩家${this.playerList[i].id + 1} 投票给玩家${sortedKeys[0] + 1}`);
        }
      } else {
        if (sortedKeys[1] === this.playerList[i].id) {
          this.voteList.set(sortedKeys[2], (this.voteList.get(sortedKeys[2]) || 0) + 1);
          this.state[this.today].log.push(`玩家${this.playerList[i].id + 1} 投票给玩家${sortedKeys[2] + 1}`);
        } else {
          this.voteList.set(sortedKeys[0], (this.voteList.get(sortedKeys[0]) || 0) + 1);
          this.state[this.today].log.push(`玩家${this.playerList[i].id + 1} 投票给玩家${sortedKeys[0] + 1}`);
        }
      }
    }
    // 找到投票最多的玩家
    const maxVotes = Math.max(...this.voteList.values());
    const candidates = Array.from(this.voteList.entries())
      .filter(([key, votes]) => votes === maxVotes)
      .map(([key, votes]) => key);
    // 如果有多个玩家获得最多投票，随机选择一个
    const voteTarget = candidates[Math.floor(Math.random() * candidates.length)];

    return voteTarget;
  }

  gameResult: string;
  gameOver(isWin: boolean) {
    if (isWin) {
      this.gameResult = '村民胜利';
      this.msg.success(this.gameResult);
    } else {
      this.gameResult = '狼人胜利';
      this.msg.error(this.gameResult);
    }
    console.log(this.gameResult);
  }

  //重新初始化游戏
  resetGame() {
    this.today = 0;
    this.state = [];
    this.gameResult = '';
    this.gameLogs = [];
    this.voteList.clear();
    this.switchGameMode();
  }

  // 游戏日志
  gameLogs: string[] = [];
  gameLogVisible: boolean = false;
  // 显示游戏日志
  showGameLog(): void {
    this.gameLogVisible = true;
  }
  // 添加游戏日志
  addGameLogNight(state: GameState): void {
    console.log(state);
    this.gameLogs.push(`第 ${state.currentDay - 1} 日夜`);
    state.nightActions.forEach(action => {
      if (action.type === 'kill') {
        this.gameLogs.push(`玩家${action.targetId + 1} 被残忍地杀害了`);
      }
    });
    if (state.nightActions.filter(a => a.type === 'kill').length == 0) {
      this.gameLogs.push(`昨夜是平安夜`);
    }
  }

  addGameLogDay(state: GameState): void {
    console.log(state);
    this.gameLogs.push(`第 ${state.currentDay - 1} 日白天`);
    state.daySpeeches.forEach(speech => {
      this.gameLogs.push(`玩家${speech.playerId + 1} 说: ${speech.content}`);
    });
  }

  addGameLogVote(state: GameState): void {
    console.log(state);
    this.gameLogs.push(`第 ${state.currentDay - 1} 日投票结果`);
    this.voteList.forEach((vote, playerId) => {
      this.gameLogs.push(`玩家${playerId + 1} : ${vote} 票`);
    });
    this.gameLogs.push(`玩家${state.vote.id + 1} 被投票出局`);
    this.voteList.clear();
    for (const player of this.playerList) {
      if (player.isAlive) {
        this.voteList.set(player.id, 0);
      }
    }
  }

  // 关闭游戏日志
  handleCancelGameLog(): void {
    this.gameLogVisible = false;
  }

  // 系统日志
  systemLogVisible: boolean = false;
  systemLogs: string[] = [];
  // 显示系统日志
  showSystemLog(): void {
    this.systemLogVisible = true;
    this.systemLogs = this.state[this.today]?.log;
  }
  // 关闭系统日志
  handleCancelSystemLog(): void {
    this.systemLogVisible = false;
  }
}
