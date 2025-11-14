import { Pipe, PipeTransform } from '@angular/core';
import friendlyNames from '../../assets/friendly_names.json'; // 注意路径

@Pipe({
  name: 'friendlyName'
})
export class FriendlyNamePipe implements PipeTransform {
  transform(exeName: string): string {
    return friendlyNames[exeName] || exeName; // 找不到就返回原名
  }
}
