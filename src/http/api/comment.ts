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

// 查询评论列表
export const getCommentListAsync: any = (params: any) => {
  return http.request({
    url: '/huajian/common/getCommentList',
    method: 'get',
    params
  });
};

// 添加一条评论
export const addCommentAsync: any = (data: any) => {
  return http.request({
    url: '/huajian/comment/addComment',
    method: 'post',
    data
  });
};

// 查询用户点赞ids
export const getUserLikeCommentIdsAsync: any = (params: any) => {
  return http.request({
    url: '/huajian/userLikeComment/getUserLikeCommentIds',
    method: 'get',
    params
  });
};

// 点赞一条评论
export const likeCommentAsync: any = (data: any) => {
  return http.request({
    url: '/huajian/comment/likeComment',
    method: 'post',
    data
  });
};

// 取消点赞一条评论
export const cancelLikeCommentAsync: any = (data: any) => {
  return http.request({
    url: '/huajian/comment/cancleLikeComment',
    method: 'post',
    data
  });
};

