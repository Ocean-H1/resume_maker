import http from '../request';

// 登录
interface ILogin {
  email: string;
  password: string;
}
export const loginAsync: any = (data: ILogin) => {
  return http.request({
    url: '/huajian/auth/email/login',
    method: 'post',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    data: data
  });
};
// 注册
interface IRegister {
  name: string;
  email: string;
  password: string;
}
export const registerAsync: any = (data: IRegister) => {
  return http.request({
    url: '/huajian/auth/email/register',
    method: 'post',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    data: data
  });
};
// 查询用户信息
export const getUserInfoAsync: any = (email: string) => {
  return http.request({
    url: `/huajian/users/user/${email}`,
    method: 'get'
  });
};

// 获取网站分析数据
export const getWebAnalycDataAsync: any = () => {
  return http.request({
    url: '/huajian/common/getWebAnalycData',
    method: 'get'
  });
};
