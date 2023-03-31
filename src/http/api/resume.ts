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
export const deleteUserResumeAsync:any  = (id:string) => {
  return http.request({
    url: `/huajian/userresume/deleteResume/${id}`,
    method: 'delete'
  })
}