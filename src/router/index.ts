import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';
import LoginDialog from '@/components/LoginDialog/LoginDialog';
import { closeGlobalLoading } from '@/utils/common';

const Index = () => import('@/views/index/index.vue');
const Person = () => import('@/views/person/index.vue');
const PersonDetail = () => import('@/views/person/personDetail/index.vue');
const AccountSetting = () => import('@/views/person/accountSetting/index.vue');
const MyComment = () => import('@/views/person/myComment/index.vue');
const MyResume = () => import('@/views/person/myResume/index.vue');
const MyOnlineResume = () => import('@/views/person/onlineResume/index.vue');
const MyContribute = () => import('@/views/person/myContribute/index.vue')

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'Index',
    meta: {
      title: '首页',
      keepAlive: true, //  是否需要保存状态
      isShowComNav: false, // 是否显示公共的导航栏
      requireLogin: false // 是否需要登录
    },
    component: Index
  },
  {
    path: '/person',
    name: 'Person',
    redirect: '/person/personDetail',
    meta: {
      title: '个人中心',
      keepAlive: true,
      isShowComNav: true,
      requireLogin: true
    },
    component: Person,
    children: [
      {
        path: 'personDetail',
        name: 'personDetail',
        meta: {
          title: '个人信息',
          keepAlive: true,
          isShowComNav: true,
          requireLogin: true,
          showTitle: true
        },
        component: PersonDetail
      },
      {
        path: 'accountSetting',
        name: 'AccountSetting',
        meta: {
          title: '账号设置',
          keepAlive: true,
          isShowComNav: true,
          requireLogin: true,
          showTitle: true
        },
        component: AccountSetting
      },
      {
        path: 'myComment',
        name: 'MyComment',
        meta: {
          title: '我的评论',
          keepAlive: true,
          isShowComNav: true,
          requireLogin: true,
          showTitle: true
        },
        component: MyComment
      },
      {
        path: 'myResume',
        name: 'MyResume',
        meta: {
          title: '我的简历',
          keepAlive: true,
          isShowComNav: true,
          requireLogin: true,
          showTitle: true
        },
        component: MyResume
      },
      {
        path: 'myOnlineResume',
        name: 'MyOnlineResume',
        meta: {
          title: '在线简历',
          keepAlive: true,
          isShowComNav: true,
          requireLogin: true,
          showTitle: true
        },
        component: MyOnlineResume
      },
      {
        path: 'myContribute',
        name: 'MyContribute',
        meta: {
          title: '我的贡献',
          keepAlive: true,
          isShowComNav: true,
          requireLogin: true,
          showTitle: false
        },
        component: MyContribute
      }
    ]
  }
];
const router = createRouter({
  history: createWebHistory(),
  routes
});

// 全局守卫：登录拦截 本地没有存token,请重新登录
router.beforeEach((to, from, next) => {
  console.log(to, from);
  const token = localStorage.getItem('token');
  const userInfo = localStorage.getItem('userInfo');
  // 需要权限且已经登录
  if (to.meta.requireLogin && !token) {
    closeGlobalLoading(); // 关闭全局等待层
    LoginDialog(true, to.fullPath);
  } else if (to.meta.requireLogin && token) {
    // 需要权限且已经登录
    if (userInfo) {
      const emailVerify = JSON.parse(userInfo as string).auth.email.valid;
      if (emailVerify) {
        next();
      } else {
        router.push({
          path: '/emailVerify',
          query: {
            email: JSON.parse(userInfo as string).email
          }
        });
        closeGlobalLoading(); // 关闭全局等待层
      }
    } else {
      closeGlobalLoading(); // 关闭全局等待层
      LoginDialog(true, to.fullPath);
    }
  } else {
    next();
  }
});

export default router;
