import http from '../request';

// 登录
interface ILogin {
  email: string;
  password: string;
}

// 注册
interface IRegister {
  name: string;
  email: string;
  password: string;
}

// 查询用户信息
export const getUserInfoAsync: any = (email: string) => {
  return http.request({
    url: `/huajian/users/user/${email}`,
    method: 'get'
  });
};
