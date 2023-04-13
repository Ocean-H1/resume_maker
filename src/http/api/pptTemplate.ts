import http from '../request'

// 查询ppt分类
export const getPPTCategoryListAsync: any = () => {
  return http.request({
    url: '/huajian/common/getPPTCategoryList',
    method: 'get'
  });
};

// 查询所有标签列表
export const getPPTTemplateTagsListAsync: any = () => {
  return http.request({
    url: '/huajian/common/getPPTTemplateTagsList',
    method: 'get'
  });
};

// 查询ppt模板列表，不查询详细信息
export const getPPTTemplateListAsync: any = (params: any) => {
  return http.request({
    url: '/huajian/common/getPPTTemplateList',
    method: 'get',
    params: params
  });
};