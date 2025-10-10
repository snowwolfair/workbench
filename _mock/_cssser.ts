import { MockRequest} from '@delon/mock';

function getRule(params: any): any {
  // 提取tag参数
  
  const type = params.type || 2;
  const id = params.id || 123;
  
  // 生成模拟数据
  let list = [];
  for (let i = 0; i < 5; i++) {
      list.push({
        id: i,
        colorLight: '#FFD700',
        colorDark: '#FFA500',
        size: 'medium',
        name: '标签' + i,
      });
      if(i == 3){
        list[i].icon = 'assets/kingicon.png';
      }
      list.push({
        id: 1,
        colorLight: '#FFD700',
        colorDark: '#FFA500',
        size: 'medium',
        name: '标签' + i,
      });
    }
  let data = [];
  if(type == 1){
    data = list.filter((item) => item.id == id);
    console.log(data);
  }
  // 返回标准格式的响应
  return {
    success: true,
    data: data,
  };

}

export const CSSSER = {
  '/cssser/getData': (req: MockRequest) => getRule(req.queryString),
};
