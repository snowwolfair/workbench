import { MockRequest, MockStatusError} from '@delon/mock';
import * as Mock from 'mockjs';

function getRule(params: any): any {
  // 提取分页参数
  const page = params.page || 1;
  const pageSize = params.limit || 10;
  const totalCount = 100; // 模拟总数据量
  
  // 计算起始索引
  const startIndex = (page - 1) * pageSize;
  
  // 生成模拟数据
  const data = [];
  for (let i = 0; i < pageSize && startIndex + i < totalCount; i++) {
    data.push({
      id: startIndex + i + 1,
      title: `任务名称 ${startIndex + i + 1}`,
      author: '曲丽丽',
      description: `这是任务 ${startIndex + i + 1} 的详细描述内容。`,
      size: Math.ceil(Math.random() * 100),
      tags: [{"name": 'Tag ' + (i % 5 + 1), "color": ['red', 'blue', 'green', 'yellow', 'purple'][i % 5]}],
      img: 'assets/logo.svg',
    });
  }
  
  // 返回标准格式的响应
  return {
    success: true,
    data: data,
    count: totalCount
  };

}

// function saveRule(description: string): void {
// }

export const LITEMATICA = {
  'GET /litematica/data': (req: MockRequest) => getRule(req.queryString)
  // 'DELETE /litematica': (req: MockRequest) => removeRule(req.queryString.nos),
  // 'POST /litematica': (req: MockRequest) => saveRule(req.body.description)
};
