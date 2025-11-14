import { MockRequest, MockStatusError } from '@delon/mock';
import { HttpClient } from '@angular/common/http';

function getRule(params: any): any {
  // 提取分页参数

  const rawData = this.http.get('your-url.json').toPromise();
  // 返回标准格式的响应
  return {
    success: true
  };
}

function saveRule(data: any): void {
  const title = data.title || '无标题';
  const author = data.author || '匿名';
  const description = data.description || '无描述';
  const size = data.file.size || 0;
  const file = data.file || '无文件';
  const tags = data.tags || [];
  tags.forEach((tag: any) => {
    tag.name = tag.name || '无标签';
    tag.color = tag.color || 'red';
  });
  console.log(data);
}

export const USAGETIME = {
  'GET /usetime/getData': (req: MockRequest) => getRule(req.queryString),
  // 'DELETE /litematica': (req: MockRequest) => removeRule(req.queryString.nos),
  'POST /usetime/saveData': (req: MockRequest) => saveRule(req.queryString)
};
