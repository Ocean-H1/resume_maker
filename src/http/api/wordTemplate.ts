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

// 查询word模板列表(不查询详细信息)
export const getWordTemplateListAsync: any = (params: any) => {
  return http.request({
    url: '/huajian/common/getWordTemplateList',
    method: 'get',
    params: params
  });
};

// 查询单个模板的详细信息
export const getWordTemplateInfoAsync: any = (id: string) => {
  return http.request({
    url: `/huajian/common/getWordTemplateInfo/${id}`,
    method: 'get'
  });
};

// 获取word模板下载链接
export const wordDownloadUrl: any = (id: string) => {
  return http.request({
    url: `/huajian/wordTemplate/wordDownloadUrl/${id}`,
    method: 'get'
  });
};
