import { Component, HostListener, ElementRef, ViewChild, ViewChildren,} from '@angular/core';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzPaginationComponent } from "ng-zorro-antd/pagination";
import { NzPageHeaderModule } from 'ng-zorro-antd/page-header';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzTypographyModule } from 'ng-zorro-antd/typography';
import { NzModalService } from 'ng-zorro-antd/modal';
import { LitematicaCreateComponent } from './litematica-create/litematica-create.component';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { HttpClient, HttpEvent, HttpEventType } from '@angular/common/http';
import { _HttpClient } from '@delon/theme';

// import { MessageService } from 'src/app/core/services/message.service';



@Component({
  selector: 'app-litematica',
  imports: [
    NzDividerModule,
    NzCardModule, 
    NzPaginationComponent, 
    NzPageHeaderModule, 
    NzTagModule, 
    NzGridModule, 
    NzTypographyModule, 
    NzInputModule,
    NzIconModule
  ],
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
  height = 500;
  pageIndex = 1;
  pageSize = 10;
  total = 0;
  loading = false;
  ftion: number;

  constructor(
    private modalService: NzModalService,
    private http: _HttpClient,
    // public msg: MessageService,
  ) {}

  onEnter(event: any) {
    console.log(event.target.value);
  }

  ngOnInit(): void {
    this.height = window.innerHeight - 280;
    this.listOfData = [
      {
        title: 'Title 1',
        author: 'Author 1',
        size: 100,
        tags: [{'name': 'Tag 1', 'color': 'red'}],
        description: '这是一个litematica文件Ant Design\'s design team preferred to design with the HSB color model, which makes it easier for designers 1',
        img: 'assets/logo.svg'
      },
      {
        title: 'Title',
        author: 'Dragon_Flight',
        size: 200,
        tags: [{'name': 'Tag 2', 'color': 'green'}, {'name': 'Tag 3', 'color': 'blue'}],
        description: '这是一个litematica文件Ant Design\'s design team preferred to design with the HSB color model, which makes it easier for designers 2'
      },
      {
        title: 'Title 3',
        author: 'Author 3',
        size: 300,
        tags: [{'name': 'Tag 3', 'color': 'blue'}],
        description: '这是一个litematica文件Ant Design\'s design team preferred to design with the HSB color model, which makes it easier for designers 3'
      },
      {
        title: 'Title 4',
        author: 'Author 4',
        size: 400,
        tags: [{'name': 'Tag 4', 'color': 'orange'}],
        description: 'Description 4'
      },

    ];

    this.dragImages = this.listOfData.map(data => {
      const img = new Image();
      img.src = data.img || 'assets/rgba.png';
      return img;
    });
    // this.getListofData();
    console.log(this.loading);
    this.getListofData();

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

  @HostListener('window:scroll', ['$event'])


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
      nzWidth: 800,
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

  getListofData(){
    this.loading = true;
    console.log(this.loading)

    this.http
      .get('/litematica/data', {
          page: this.pageIndex,
          limit: this.pageSize
      })
      .subscribe((res: any) => {
        console.log(res);
        if (res.success) {
           setTimeout(() => {
            if(this.ftion === 1){
              this.listOfData = [...this.listOfData, ...res.data];
              this.total = res.count;
              this.loading = false;
              this.ftion = 0;
            }else{
              this.listOfData = res.data;
              this.total = res.count;
              this.loading = false;
            }
          }, 1000);

          
        } else {
          console.log(res.message);
          setTimeout(() => {
            this.loading = false;
          }, 1000);

          // this.msg.error(res.message);
        }
      });
  }

  @ViewChild('tableContainer') scrollContainer!: ElementRef;


  onScroll(event: Event){
    const scrollTop = (event.target as HTMLElement).scrollTop;
    const scrollHeight = (event.target as HTMLElement).scrollHeight;
    const clientHeight = (event.target as HTMLElement).clientHeight;
    if (scrollTop + clientHeight >= scrollHeight && !this.loading && this.total > this.listOfData.length) {

      this.pageIndex++;
      this.ftion = 1;
      
      this.getListofData();
    }
  }



  //后端某个api需要传入data，data中包含以下字段
  //title: 标题
  //author: 作者
  //size: 大小
  //tags: 标签数组
  //description: 描述

  //tags是一个数组，数组每个元素是一个对象，对象有name和color属性

}
