import { MockRequest, MockStatusError} from '@delon/mock';
import * as Mock from 'mockjs';

function getRule(params: any): any {
  // 提取分页参数
  const page = params.page || 1;
  const pageSize = params.limit || 10;
  const totalCount = 114; // 模拟总数据量
  
  // 计算起始索引
  const startIndex = (page - 1) * pageSize;
  
  // 生成模拟数据
  let data = [];
  for (let i = 0; i < pageSize && startIndex + i < totalCount; i++) {
    data.push({
      id: startIndex + i + 1,
      title: `任务名称 ${startIndex + i + 1}`,
      author: '曲丽丽',
      description: `这是任务 ${startIndex + i + 1} 的详细描述内容。`,
      size: Math.ceil(Math.random() * 100),
      tags: [{"name": 'Tag ' + (i % 5 + 1), "color": ['#08979c', '#7cb305', '#1890ff', '#d48806', '#531dab'][i % 5], "background": ['#e6fffb', '#fcffe6', '#e6f7ff', '#fffbe6', '#f9f0ff'][i % 5], "border": ['#87e8de', '#eaff8f', '#91d5ff', '#ffe58f', '#d3adf7'][i % 5]}],
      img: 'assets/logo.svg',
    });
  }
  // 模拟搜索
  if (params.key) {
    data = data.filter(item => item.title.includes(params.key) || item.description.includes(params.key) || item.tags.some((tag: any) => tag.name.includes(params.key)));
  }
  
  // 返回标准格式的响应
  return {
    success: true,
    data: data,
    count: totalCount
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

export const LITEMATICA = {
  'GET /litematica/getData': (req: MockRequest) => getRule(req.queryString),
  // 'DELETE /litematica': (req: MockRequest) => removeRule(req.queryString.nos),
  'POST /litematica/saveData': (req: MockRequest) => saveRule(req.queryString)
};
