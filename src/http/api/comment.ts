import http from '../request';

// 用户查询个人评论列表
export const getPersonCommentPageAsync: any = (params: any) => {
  return http.request({
    url: '/huajian/comment/getPersonCommentPage',
    method: 'get',
    params
  });
};

// 删除一条评论
export const deleteOneCommentAsync: any = (data: any) => {
  return http.request({
    url: '/huajian/comment/deleteOneComment',
    method: 'delete',
    data
  });
};
