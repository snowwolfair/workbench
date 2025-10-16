import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import * as THREE from 'three'
import { OrbitControls } from 'three-orbitcontrols-ts';
import { FormsModule } from '@angular/forms';
import { NzRadioModule } from 'ng-zorro-antd/radio';
import { I18nPipe, SettingsService, _HttpClient } from '@delon/theme';
import { ChangeDetectionStrategy, ChangeDetectorRef, OnDestroy, inject } from '@angular/core';
import { GameState } from '../../wolfkiller/options';
import { WolflogicService } from '../../wolfkiller/wolf-logic.service';



@Component({
    selector: 'app-map-view',
    imports: [
      CommonModule,
      I18nPipe,
      FormsModule,
      NzRadioModule
    ],
    templateUrl: './map-view.component.html',
    styleUrls: ['./map-view.component.less']
})
export class MapViewComponent {
  // 这里只保留地图相关逻辑，如需扩展可在此添加
  private readonly http = inject(_HttpClient);
  constructor(
    private wolflogicService: WolflogicService
  ) { }

  radioValue = '12'


  today = 0;
  state: GameState[] = [];

  wolf = {

  }

  person = {

  }

  witch = {

  }

  hunter = {

  }
  
  garder = {

  }

  prophet = {

  }

  ngOnInit() {
    this.switchGameMode();
  }

  // 开始游戏
  startGame() {
    this.shuffledRoles = this.shuffle([...this.roles]);
    console.log(this.shuffledRoles);
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
    if(this.radioValue === '12') {
      this.roles = ['wolf', 'wolf', 'wolf', 'wolf', 'villager', 'villager', 'villager', 'villager', 'witch', 'psychic', 'garder', 'prophet'];
      for(let i = 0; i < 12; i++) {
        this.playerList[i] = {
          id: i,
          name: 'player' + (i + 1),
          role: this.roles[i],
          isAlive: true,
        }
      }
    } else if(this.radioValue === '9') {
      this.roles = ['wolf', 'wolf', 'wolf', 'villager', 'villager', 'villager', 'witch', 'psychic', 'prophet'];
      for(let i = 0; i < 9; i++) {
        this.playerList[i] = {
          id: i,
          name: 'player' + (i + 1),
          role: this.roles[i],
          isAlive: true,
        }
      }
    }
    // 初始化游戏状态
    this.state.push({
      players: this.playerList,
      nightActions: [],    // 夜晚行为记录（谁被刀、谁被验等）
      daySpeeches: [],         // 白天发言记录
      currentDay: 1,
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
      label: '谈话',
      value: 1,
    },
    {
      label: '指定预言',
      value: 2,
    },
    {
      label: '指定守卫',
      value: 3,
    },
    {
      label: '指定通灵',
      value: 4,
    },
    {
      label: '女巫行动',
      value: 5,
    },
    {
      label: '强制投票',
      value: 6,
    },
    {
      label: '自由投票',
      value: 7,
    },
    {
      label: '下一日',
      value: 8,
    },
  ]

  // 控制台选项点击事件
  onControlClick(option: any) {
    switch(option.value) {
      case 1:
        this.showPlayerRole = !this.showPlayerRole;
        break;
      case 2:
        this.showControl = !this.showControl;
        break;
      case 3:
        this.showModel = !this.showModel;
        break;
      case 4:
        this.showControl = !this.showControl;
        break;
      case 5:
        this.showModel = !this.showModel;
        break;
      case 6:
        this.showControl = !this.showControl;
        break;
      case 7:
        this.showModel = !this.showModel;
        break;
      case 8:
        // 下一日
        this.today++;
        // 初始化下一日游戏状态
        this.state.push({
          players: this.playerList,
          nightActions: [],    // 夜晚行为记录（谁被刀、谁被验等）
          daySpeeches: [],         // 白天发言记录
          currentDay: this.today + 1,
        });
        // 游戏进行
        this.gamelink();
        break;
    }
  }



  freeVote(votes: number[]) {
    // 自由投票实现
    // 统计投票结果
    const voteCount = votes.reduce((acc, vote) => {
      acc[vote] = (acc[vote] || 0) + 1;
      return acc;
    }, {} as Record<number, number>);
    // 找到投票最多的玩家
    const maxVotes = Math.max(...Object.values(voteCount));
    const candidates = Object.keys(voteCount)
      .filter(key => voteCount[Number(key)] === maxVotes)
      .map(Number);
    // 如果有多个玩家获得最多投票，随机选择一个
    return candidates[Math.floor(Math.random() * candidates.length)];
  }


  gamelink(){
    this.gameNight();
    this.gameDay();

  }

  gameNight(){
    for(let i = 0; i < this.playerList.length; i++) {
      if(!this.playerList[i].isAlive) {
        continue;
      }
      switch(this.playerList[i].role) {
        case 'wolf':
          this.state[this.today] = this.wolflogicService.night(this.playerList[i], this.state[this.today]);
          console.log(this.state);
          break;
        case 'villager':
          this.person[i] = this.playerList[i];
          break;
        case 'witch':
          this.witch[i] = this.playerList[i];
          break;
        case 'psychic':
          this.hunter[i] = this.playerList[i];
          break;
        case 'garder':
          this.garder[i] = this.playerList[i];
          break;
        case 'prophet':
          this.prophet[i] = this.playerList[i];
          break;
      }



      this.state[this.today].nightActions.forEach(action => {
        if(action.type === 'kill') {
          this.state[this.today].players[action.targetId].isAlive = false;
        }
      });
    } 
  }

  gameDay(){
    
  }
}
