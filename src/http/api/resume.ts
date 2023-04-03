import http from '../request';

// 查询模板列表
export const getTemplateListAsync: any = (params: any) => {
  return http.request({
    url: '/huajian/common/getTemplateList',
    method: 'get',
    params: params
  });
};

// 查询用户简历列表
export const getUserResumeListAsync: any = (params: any) => {
  return http.request({
    url: '/huajian/userresume/templateList',
    method: 'get',
    params: params
  });
};

// 用户删除自己的简历
export const deleteUserResumeAsync: any = (id: string) => {
  return http.request({
    url: `/huajian/userresume/deleteResume/${id}`,
    method: 'delete'
  });
};

// 更新在线简历设置
export const updateOnlineResumeAsync: any = (data: any) => {
  return http.request({
    url: '/huajian/userresume/updateOnlineResume',
    method: 'put',
    data: data
  });
};

// 查询自己贡献的模板列表
export const getMyContributeTemplateListAsync: any = (params: any) => {
  return http.request({
    url: '/huajian/resume/getMyContributeTemplateList',
    method: 'get',
    params: params
  });
};

// 保存用户简历
export const updateUserresumeAsync: any = (data: any) => {
  return http.request({
    url: '/huajian/userresume/template',
    method: 'post',
    data: data
  });
};

// 查询单个简历模板的数据
export const getResetTemplateInfoAsync: any = (id: string) => {
  return http.request({
    url: `/huajian/resume/templateReset/${id}`,
    method: 'get'
  });
};
// 查询单个简历模板数据->有草稿则会返回草稿
export const getTemplateInfoAsync: any = async (id: string) => {
  return http.request({
    url: `/huajian/resume/template/${id}`,
    method: 'get'
  });
};
