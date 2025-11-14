// template.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, firstValueFrom } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';

export type TemplateMap = Record<string, string[]>;

@Injectable({
  providedIn: 'root'
})
export class ReplyService {
  private templates$: Observable<TemplateMap>;

  constructor(private http: HttpClient) {
    // 使用 shareReplay 缓存结果，避免多次 HTTP 请求
    this.templates$ = this.http.get<TemplateMap>('/assets/replies.json').pipe(shareReplay(1));
  }

  getRandomMessage(type: string, context: Record<string, any>): Observable<string> {
    return this.templates$.pipe(
      map(templates => {
        const list = templates[type];
        if (!list || list.length === 0) {
          console.warn(`未找到模板类型: ${type}`);
          return '（无可用模板）';
        }

        const randomTemplate = list[Math.floor(Math.random() * list.length)];
        return this.fillTemplate(randomTemplate, context);
      })
    );
  }

  async getRandomMessageAsync(type: string, context: Record<string, any>): Promise<string> {
    return firstValueFrom(this.getRandomMessage(type, context));
  }

  private fillTemplate(template: string, context: Record<string, any>): string {
    return template.replace(/{{\s*([^}]+?)\s*}}/g, (match, key) => {
      const k = key.trim();
      return context[k] !== undefined ? String(context[k]) : '';
    });
  }
}
