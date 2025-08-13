import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-users',
    imports: [CommonModule],
    templateUrl: './users.component.html',
    styleUrls: ['./users.component.less']
})
export class UsersComponent {
  users = [
    { name: '张三', email: 'zhangsan@example.com' },
    { name: '李四', email: 'lisi@example.com' },
    { name: '王五', email: 'wangwu@example.com' },
    { name: '赵六', email: 'zhaoliu@example.com' }
  ];
}
