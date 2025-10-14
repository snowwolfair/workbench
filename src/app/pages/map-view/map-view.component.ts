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
      this.roles = ['wolf', 'wolf', 'wolf', 'wolf', 'person', 'person', 'person', 'person', 'witch', 'hunter', 'garder', 'prophet'];
      for(let i = 0; i < 12; i++) {
        this.playerList[i] = {
          id: i+1,
          name: 'player' + (i + 1),
          role: this.roles[i],
          isAlive: true,
        }
      }
    } else if(this.radioValue === '9') {
      this.roles = ['wolf', 'wolf', 'wolf', 'person', 'person', 'person', 'witch', 'hunter', 'prophet'];
      for(let i = 0; i < 9; i++) {
        this.playerList[i] = {
          id: i+1,
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
      label: '显示玩家角色',
      value: () => this.showPlayerRole = !this.showPlayerRole,
    },
    {
      label: '显示控制选项',
      value: () => this.showPlayerRole = !this.showPlayerRole,
    },
    {
      label: '显示对话框',
      value: () => this.showPlayerRole = !this.showPlayerRole,
    },
  ]

  // 控制台选项点击事件
  onControlClick(option: any) {
    option.value();
  }

}
