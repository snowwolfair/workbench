import { Component, HostListener } from '@angular/core';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzPaginationComponent } from "ng-zorro-antd/pagination";
import { NzPageHeaderModule } from 'ng-zorro-antd/page-header';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzTypographyModule } from 'ng-zorro-antd/typography';
import { NzModalService } from 'ng-zorro-antd/modal';
import { LitematicaCreateComponent } from './litematica-create/litematica-create.component';


@Component({
  selector: 'app-litematica',
  imports: [NzDividerModule, NzCardModule, NzPaginationComponent, NzPageHeaderModule, NzTagModule, NzGridModule, NzTypographyModule],


  templateUrl: './litematica.component.html',
  styleUrl: './litematica.component.less'
})
export class LitematicaComponent {
  tags = [
    {'name': 'Unremovable', 'color': 'red'}, 
    {'name': 'Tag 2', 'color': 'green'}, 
    {'name': 'Tag 3', 'color': 'blue'}
  ];

  listOfData: any[] = [];

  dragImages: HTMLImageElement[] = [];

  constructor(
    private modalService: NzModalService,
  ) {}


  ngOnInit(): void {
    this.listOfData = [
      {
        title: 'Title 1',
        author: 'Author 1',
        size: 100,
        tags: [{'name': 'Tag 1', 'color': 'red'}],
        description: 'Description 1',
        img: 'assets/logo.svg'
      },
      {
        title: 'Title',
        author: 'Dragon_Flight',
        size: 200,
        tags: [{'name': 'Tag 2', 'color': 'green'}, {'name': 'Tag 3', 'color': 'blue'}],
        description: 'Description 2'
      }
    ];

    this.dragImages = this.listOfData.map(data => {
      const img = new Image();
      img.src = data.img || 'assets/rgba.png';
      return img;
    });
  }

  showtagcolor = 'red';

  onLoding = false;

  dragImage = new Image();

  size = 32;

  author: string = '张三';

  sliceTagName(tag: string): string {
    const isLongTag = tag.length > 20;
    return isLongTag ? `${tag.slice(0, 20)}...` : tag;
  }

  @HostListener('dragstart', ['$event'])
  onDragStart(event: DragEvent) {
    event.dataTransfer.setData('text/plain', 'litematica');

    const target = event.target as HTMLElement;

    const index = parseInt(target.getAttribute('data-index') || '0', 10);
    this.dragImage = this.dragImages[Number(index)];

    event.dataTransfer.setDragImage(this.dragImage, 50, 50);
    
    event.dataTransfer.effectAllowed = 'move';
  }

  @HostListener('dragenter', ['$event'])
  onDragEnter(event: DragEvent) {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }

  @HostListener('dragover', ['$event'])
  onDragOver(event: DragEvent) {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }

  @HostListener('dragend', ['$event'])
  onDragEnd(event: DragEvent) {
    event.dataTransfer.clearData();
  }

  loding(){
    console.log('loding');
  }

  addModal: any;

  showmodel(){
    this.addModal = this.modalService.create({
      nzTitle: '上传模型',
      nzContent: LitematicaCreateComponent,
      nzOkText: '确定',
      nzCancelText: '取消',
      nzOnOk: () => console.log('OK'),
      nzOnCancel: () => console.log('Cancel')
    });
    this.addModal.afterClose.subscribe((result: any) => {
      if (result === 'confirmed') {

      }
    });
  }



  //后端某个api需要传入data，data中包含以下字段
  //title: 标题
  //author: 作者
  //size: 大小
  //tags: 标签数组
  //description: 描述

  //tags是一个数组，数组每个元素是一个对象，对象有name和color属性

}
