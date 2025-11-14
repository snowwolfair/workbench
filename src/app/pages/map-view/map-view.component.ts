import { Component, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import * as THREE from 'three';
import { OrbitControls } from 'three-orbitcontrols-ts';
import { FormsModule } from '@angular/forms';
import { NzRadioModule } from 'ng-zorro-antd/radio';
import { I18nPipe, SettingsService, _HttpClient } from '@delon/theme';
import { ChangeDetectionStrategy, ChangeDetectorRef, OnDestroy, inject } from '@angular/core';
import { GameState } from '../../services/wolfkiller/options';
import { WolflogicService } from '../../services/wolfkiller/wolf-logic.service';
import { ProphetLogicService } from '../../services/wolfkiller/prophet-logic.service';
import { SuspicionService } from '../../services/wolfkiller/suspicion.service';
import { PsychicLogicService } from '../../services/wolfkiller/psychic-logic.service';
import { GarderLogicService } from '../../services/wolfkiller/garder-logic.service';
import { HunterLogicService } from '../../services/wolfkiller/hunter-logic.service';
import { VillagerLogicService } from '../../services/wolfkiller/villager-logic.service';

import { ReplyService } from '../../services/speakmodal/replay.service';

import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzMessageService } from 'ng-zorro-antd/message';
import { Player } from '../../services/wolfkiller/options';

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
    private psychiclogicService: PsychicLogicService,
    private garderlogicService: GarderLogicService,
    private hunterlogicService: HunterLogicService,
    private villagerlogicService: VillagerLogicService,
    private suspicionService: SuspicionService,
    private replyService: ReplyService,
    private msg: NzMessageService
  ) {}

  @ViewChild('player-container-wrapper', { static: false }) specialPanel!: ElementRef;

  // 指定映射逻辑
  // 1： 预言家
  // 2： 守卫
  // 3： 猎人
  // 4： 通灵人
  // 5： 村民
  // 6： 狼人

  radioValue = '12';
  // 投票中标识
  voteSign = true;
  // 投票后标识
  votedSign = true;

  // 强制投票标识
  forceVote = false;
  // 指定预言标识
  prophecySign = false;
  // 指定守卫标识
  guardSign = false;
  // 指定猎人标识
  hunterSign = false;

  // 选择玩家标识
  choosePlayer = false;

  target?: Player;
  today = 0;
  state: GameState[] = [];

  system: Player = {
    id: 999,
    name: '系统',
    role: 'system',
    isAlive: true
  };

  // 指定时的蒙层
  showOverlay = false;

  // 当前发言玩家
  currentPlayer: Player;

  talk: string = '';

  ngOnInit() {
    this.switchGameMode();
  }

  // 开始游戏
  startGame() {
    this.gameResult = '';
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
    this.state = [
      {
        players: this.playerList,
        nightActions: [], // 夜晚行为记录（谁被刀、谁被验等）
        daySpeeches: [], // 白天发言记录
        currentDay: 1,
        log: [] // 游戏日志
      }
    ];
    console.log(this.roles);
  }

  // 拆分玩家列表为两行
  // 顶部玩家行
  get topRow() {
    const len = this.playerList.length;
    if (len === 12) return this.playerList.slice(0, 6);
    if (len === 9) return this.playerList.slice(0, 5);
    return this.playerList.slice(0, Math.ceil(len / 2)); // 兜底
  }
  // 底部玩家行
  get bottomRow() {
    const len = this.playerList.length;
    if (len === 12) return this.playerList.slice(6);
    if (len === 9) return this.playerList.slice(5);
    return this.playerList.slice(Math.ceil(len / 2)); // 兜底
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

  showPlayerRole = false;

  //对话框和控制台切换
  showControl = true;
  showModel = true;

  //控制台选项
  controlOptions = [
    {
      label: '指定猎人猎物',
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
        this.choosePlayer = true;
        this.hunterSign = true;
        this.showOverlay = true;
        // this.resetGame();

        this.currentPlayer = this.system;
        this.talk = '请指定猎物';
        break;
      case 2:
        this.choosePlayer = true;
        this.prophecySign = true;
        this.showOverlay = true;

        this.currentPlayer = this.system;
        this.talk = '请指定预言';
        break;
      case 3:
        this.choosePlayer = true;
        this.guardSign = true;
        this.showOverlay = true;

        this.currentPlayer = this.system;
        this.talk = '请指定守卫';
        break;
      case 4:
        let message = '';
        let context = {
          name: 'wanjia'
        };
        this.replyService.getRandomMessage('jump_role_announce', context).subscribe(msg => {
          message = msg;
        });
        console.log(message);
        break;
      case 5:
        this.showPlayerRole = !this.showPlayerRole;
        break;
      case 6:
        this.choosePlayer = true;
        this.forceVote = true;

        this.talk = '请指定投票目标';
        break;
      case 7:
        this.target = undefined;
        this.voteSign = true;
        this.votedSign = false;
        this.choosePlayer = false;

        setTimeout(() => {
          this.talk = '投票进行中...';
        }, 1000);
        this.gameVote();
        if (this.playerList.filter(p => p.isAlive && p.role == 'wolf').length == 0) {
          console.log(this.playerList.filter(p => p.isAlive && p.role == 'villager').length);
          this.state[this.today].log.push(`---游戏结束，村民胜利---`);
          this.gameOver(true);
        }
        break;
      case 8:
        // 下一日
        this.today++;

        // 初始化下一日游戏状态
        this.state.push({
          players: this.playerList,
          nightActions: [], // 夜晚行为记录（谁被刀、谁被验等）
          daySpeeches: [], // 白天发言记录
          currentDay: this.today + 1,
          targetHunter: this.targetHunter,
          targetProphecy: this.targetProphecy,
          targetGuard: this.targetGuard,
          vote: this.playerList[this.voted],
          log: this.systemLogs // 系统日志
        });
        // 游戏进行
        this.gamelink();
        break;
    }
  }

  onOverlayClick(event?: MouseEvent) {
    // event.stopPropagation();
    this.choosePlayer = false;
    this.forceVote = false;
    this.guardSign = false;
    this.hunterSign = false;
    this.prophecySign = false;
    this.showOverlay = false; // 点击蒙层关闭
  }

  // 按钮禁用
  setDisabled(option: any) {
    // 游戏结束后，禁用所有选项
    if (this.gameResult) {
      return true;
    }

    if (option.value === 7 || option.value === 6) {
      return this.voteSign;
    }
    if (option.value === 8) {
      return this.votedSign;
    }
    return false;
  }

  targetProphecy: any;
  targetGuard: any;
  targetHunter: any;

  // 在指定预言，指定守卫，强制投票中
  // 获取鼠标点击的对应玩家
  getPlayer(id: number) {
    // 选择玩家后，点击玩家进行投票
    if (this.choosePlayer && this.forceVote) {
      this.voteSign = true;
      this.votedSign = false;
      this.target = this.playerList[id];

      this.gameLogs.push(`指定${this.target.name}为强制投票目标`);

      this.state[this.today].log.push(`${this.target.name} 被强制投票`);

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
      if (this.targetProphecy) {
        this.targetProphecy = this.playerList[id];
        this.gameLogs.push(`重新指定${this.targetProphecy.name}为夜晚预言目标`);
      } else {
        this.targetProphecy = this.playerList[id];
        this.gameLogs.push(`指定${this.targetProphecy.name}为夜晚预言目标`);
      }
      this.state[this.today].log.push(`${this.targetProphecy.name} 被指定预言`);
      // 清除选择玩家状态
      this.choosePlayer = false;
      this.prophecySign = false;
    }

    // 选择玩家后，点击玩家进行守卫
    if (this.choosePlayer && this.guardSign) {
      if (this.targetGuard) {
        this.targetGuard = this.playerList[id];
        this.gameLogs.push(`重新指定${this.targetGuard.name}为夜晚守卫目标`);
      } else {
        this.targetGuard = this.playerList[id];
        this.gameLogs.push(`指定${this.targetGuard.name}为夜晚守卫目标`);
      }
      this.state[this.today].log.push(`${this.targetGuard.name} 被指定守卫`);
      // 清除选择玩家状态
      this.choosePlayer = false;
      this.guardSign = false;
    }
    // 选择玩家后，点击玩家进行猎人
    if (this.choosePlayer && this.hunterSign) {
      if (this.targetHunter) {
        this.targetHunter = this.playerList[id];
        this.gameLogs.push(`重新指定${this.targetHunter.name}为猎人目标`);
      } else {
        this.targetHunter = this.playerList[id];
        this.gameLogs.push(`指定${this.targetHunter.name}为猎人目标`);
      }
      this.state[this.today].log.push(`${this.targetHunter.name} 被指定猎人目标`);
      this.state[this.today].targetHunter = this.targetHunter;
      // 清除选择玩家状态
      this.choosePlayer = false;
      this.hunterSign = false;
    }
    console.log(this.talk);
    this.onOverlayClick();
  }

  // 游戏链接
  async gamelink() {
    this.voteSign = false;

    await this.gameNight();
    if (this.gameResult) {
      return;
    }
    await this.gameDay();
  }

  async gameNight() {
    this.voteSign = false;
    this.votedSign = true;

    let forkill: number;
    let forguard: number;

    this.state[this.today].log.push(`---第${this.today}日夜晚---`);

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
          this.state[this.today] = this.villagerlogicService.night(this.playerList[i], this.state[this.today]);
          console.log(JSON.parse(JSON.stringify(this.state)));
          break;
        case 'hunter':
          // 猎人无晚上活动
          break;
        case 'psychic':
          this.state[this.today] = this.psychiclogicService.night(this.playerList[i], this.state[this.today]);
          console.log(JSON.parse(JSON.stringify(this.state)));
          break;
        case 'garder':
          this.state[this.today] = this.garderlogicService.night(this.playerList[i], this.state[this.today]);
          console.log(JSON.parse(JSON.stringify(this.state)));
          break;
        case 'prophet':
          this.state[this.today] = this.prophetlogicService.night(this.playerList[i], this.state[this.today]);
          console.log(JSON.parse(JSON.stringify(this.state)));
          break;
      }
    }
    // 判定每个人晚上的活动
    currentState.nightActions.forEach(action => {
      if (action.type === 'kill') {
        forkill = action.targetId;
      }
      if (action.type === 'guard') {
        forguard = action.targetId;
      }
    });

    // 刀人结果：如果守卫的目标不是被刀的目标，那么被刀的目标就会死亡
    if (forkill !== forguard) {
      currentState.players[forkill].isAlive = false;

      // 刀到猎人触发猎人防守反击
      if (forkill === this.playerList.find(p => p.role === 'hunter').id) {
        this.state[this.today] = this.hunterlogicService.night(
          this.playerList.find(p => p.role === 'hunter'),
          this.state[this.today]
        );
      }
    }

    // 添加游戏日志
    await this.addGameLogNight(this.state[this.today], forkill !== forguard);

    console.log(currentState);

    // 如果狼人数量大于其他人数量，狼人胜利
    if (
      currentState.players.filter(p => p.isAlive && p.role !== 'wolf').length <=
      currentState.players.filter(p => p.isAlive && p.role === 'wolf').length
    ) {
      this.state[this.today].log.push(`---游戏结束，狼人胜利---`);
      this.gameOver(false);
    }
  }

  async gameDay() {
    this.state[this.today].log.push(`---第${this.today + 1}日早---`);
    for (let i = 0; i < this.playerList.length; i++) {
      if (!this.playerList[i].isAlive) {
        continue;
      }
      switch (this.playerList[i].role) {
        case 'wolf':
          this.state[this.today] = await this.wolflogicService.day(this.playerList[i], this.state[this.today]);
          break;
        case 'villager':
          this.state[this.today] = await this.villagerlogicService.day(this.playerList[i], this.state[this.today]);
          break;
        case 'hunter':
          this.state[this.today] = this.hunterlogicService.day(this.playerList[i], this.state[this.today]);
          console.log(JSON.parse(JSON.stringify(this.state)));
          break;
        case 'psychic':
          this.state[this.today] = this.psychiclogicService.day(this.playerList[i], this.state[this.today]);
          console.log(JSON.parse(JSON.stringify(this.state)));
          break;
        case 'garder':
          this.state[this.today] = this.garderlogicService.day(this.playerList[i], this.state[this.today]);
          console.log(JSON.parse(JSON.stringify(this.state)));
          break;
        case 'prophet':
          this.state[this.today] = await this.prophetlogicService.day(this.playerList[i], this.state[this.today]);
          console.log(JSON.parse(JSON.stringify(this.state)));
          break;
      }
    }

    this.targetProphecy = undefined;
    this.targetGuard = undefined;
    this.voted = undefined;

    // 添加游戏日志
    await this.addGameLogDay(this.state[this.today]);
  }

  voted: any;
  hunterDie = false;

  gameVote() {
    this.voted = this.startVote();
    this.state[this.today].log.push(`玩家${this.voted + 1} 被投票出局`);
    this.playerList[this.voted].isAlive = false;
    console.log(this.playerList[this.voted].role);
    if (this.playerList[this.voted].role === 'hunter') {
      if (this.state[this.today].targetHunter && this.state[this.today].targetHunter.id !== this.playerList[this.voted].id) {
        this.playerList[this.state[this.today].targetHunter.id].isAlive = false;
        this.hunterDie = true;
      }
    }
    this.state[this.today].vote = this.playerList[this.voted];

    this.addGameLogVote(this.state[this.today]);
  }

  // 玩家发言

  // 投票系统
  voteList: Map<number, number> = new Map();

  startVote() {
    this.state[this.today].log.push(`---第${this.today + 1}日投票---`);
    console.log(this.state[this.today].daySpeeches);
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

  gameResult: string = 'true';
  gameOver(isWin: boolean) {
    if (isWin) {
      this.gameResult = '村民胜利';
      this.msg.success(this.gameResult);
    } else {
      this.gameResult = '狼人胜利';
      this.msg.error(this.gameResult);
    }
    this.showPlayerRole = true;
    console.log(this.gameResult);
  }

  //重新初始化游戏
  resetGame() {
    this.today = 0;
    this.state = [];
    this.gameResult = 'true';
    this.gameLogs = [];
    this.showPlayerRole = false;
    this.voteSign = true;
    this.votedSign = true;
    this.hunterDie = false;
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
  async addGameLogNight(state: GameState, isKill: boolean): Promise<void> {
    console.log(state);
    let message = '';

    this.gameLogs.push(`---第 ${state.currentDay - 1} 日夜晚---`);
    if (isKill) {
      for (const action of state.nightActions) {
        if (action.type === 'kill') {
          let context = {
            name: `玩家${action.targetId + 1}`
          };
          message = await this.replyService.getRandomMessageAsync('death_night', context);
          this.gameLogs.push(message);
        }
      }
    } else {
      let context = {};
      message = await this.replyService.getRandomMessageAsync('safe_night', context);
      this.gameLogs.push(message);
    }
  }

  async addGameLogDay(state: GameState): Promise<void> {
    let message = '';
    console.log(state);
    this.gameLogs.push(`---第 ${state.currentDay} 日白天---`);
    for (const speech of state.daySpeeches) {
      let context = {
        name: `玩家${speech.playerId + 1}`,
        content: speech.content
      };
      message = await this.replyService.getRandomMessageAsync('day_speech', context);
      this.gameLogs.push(`玩家${speech.playerId + 1} 说: ${speech.content}`);
    }
  }

  async addGameLogVote(state: GameState): Promise<void> {
    console.log(state);
    let message = '';
    this.gameLogs.push(`---第 ${state.currentDay} 日投票结果---`);
    this.voteList.forEach((vote, playerId) => {
      this.gameLogs.push(`玩家${playerId + 1} : ${vote} 票`);
    });
    let context = {
      name: `玩家${state.vote.id + 1}`
    };
    message = await this.replyService.getRandomMessageAsync('death_day', context);
    this.gameLogs.push(message);

    this.voteList.clear();
    for (const player of this.playerList) {
      if (player.isAlive) {
        this.voteList.set(player.id, 0);
      }
    }

    if (this.hunterDie) {
      let context = {
        name: `玩家${state.targetHunter.id + 1}`
      };
      message = await this.replyService.getRandomMessageAsync('hunter_death_day', context);
      this.currentPlayer = state.targetHunter;

      this.gameLogs.push(`玩家${state.targetHunter.id + 1}被猎人开枪带走了`);
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
