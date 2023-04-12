import http from '../request';

// 查询word分类
export const getWordCategoryListAsync: any = () => {
  return http.request({
    url: '/huajian/common/getWordCategoryList',
    method: 'get'
  });
};

// 查询所有标签列表
export const getWordTemplateTagsListAsync: any = () => {
  return http.request({
    url: '/huajian/common/getWordTemplateTagsList',
    method: 'get'
  });
};

// 查询word模板列表，不查询详细信息
export const getWordTemplateListAsync: any = (params: any) => {
  return http.request({
    url: '/huajian/common/getWordTemplateList',
    method: 'get',
    params: params
  });
};
