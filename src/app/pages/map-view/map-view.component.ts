import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import * as THREE from 'three'
import { OrbitControls } from 'three-orbitcontrols-ts';
import { FormsModule } from '@angular/forms';
import { NzRadioModule } from 'ng-zorro-antd/radio';
import { I18nPipe, SettingsService, _HttpClient } from '@delon/theme';
import { ChangeDetectionStrategy, ChangeDetectorRef, OnDestroy, inject } from '@angular/core';



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

  radioValue = '12'

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


  showPlayerRole = false;

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
    if(option.value === 1) {
      this.showPlayerRole = !this.showPlayerRole;
    } else if(option.value === 2) {
      this.showControl = !this.showControl;
    } else if(option.value === 3) {
      this.showModel = !this.showModel;
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

}
