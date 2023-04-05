<!-- 评论组件 -->
<template>
  <div :key="refreshUuid" class="comment-view">
    <u-comment
      :config="config"
      :show-size="2"
      :is-login="isLogin"
      @submit="submit"
      @like="like"
      @remove="remove"
      @report="report"
    >
      <!-- 未登录展示 -->
      <template v-if="!isLogin" #is-not-login>
        <div class="login-content-box" @click="openLoginDialog">
          <p>请先登录</p>
        </div>
      </template>
      <!-- 已有评论 -->
      <template v-if="config.comments.length" #list-title>
        全部评论 ({{ initCommentList.length }})
      </template>
      <template v-else #list-title>
        <div class="comment-no-data-box">
          <no-data width="200px" height="200px"></no-data>
          <p>快来发布一条评论吧O.o</p>
        </div>
      </template>
    </u-comment>
  </div>
</template>

<script setup lang="ts">
  import appStore from '@/store';
  import { storeToRefs } from 'pinia';
  import { CommentApi, ConfigApi } from '@/components/packages/index';
  import emoji from './emoji';
  import LoginDialog from '@/components/LoginDialog/LoginDialog';
  import {
    getCommentListAsync,
    addCommentAsync,
    likeCommentAsync,
    getUserLikeCommentIdsAsync,
    cancelLikeCommentAsync,
    deleteOneCommentAsync
  } from '@/http/api/comment';
  import { cloneDeep } from 'lodash';
  import { showtime, formatListDate } from '@/utils/common';

  interface IComment {
    commentType: string;
    commentTypeId: string;
    width: string;
  }
  const props = withDefaults(defineProps<IComment>(), {
    commentType: '',
    commentTypeId: '',
    width: '820px'
  });

  // 处理登录后的情况
  const config = reactive<ConfigApi>({
    user: {
      id: '',
      username: '',
      avatar: '',
      likeIds: []
    },
    emoji: emoji,
    comments: []
  });
  const { refreshUuid } = storeToRefs(appStore.useRefreshStore);
  const isLogin = computed(() => {
    let token = appStore.useTokenStore.token;
    if (token) {
      const { userInfo } = appStore.useUserInfoStore;
      config.user = {
        id: userInfo._id,
        username: userInfo.name,
        avatar: userInfo.photos.profilePic.url,
        likeIds: []
      };
      return true;
    } else {
      return false;
    }
  });

  // 打开登录弹窗
  const openLoginDialog = () => {
    LoginDialog(true);
  };

  // 查询评论列表
  const initCommentList = ref<Array<any>>([]); // 初始评论列表
  const getCommentList = async () => {
    const params = {
      commentType: props.commentType,
      commentTypeId: props.commentTypeId
    };
    const data = await getCommentListAsync(params);
    if (data.status === 200) {
      initCommentList.value = data.data;
      config.comments = formatComment(data.data);
    } else {
      ElMessage.error(data.message);
    }
  };
  getCommentList();

  // 格式化评论数据
  const formatComment = (data: Array<any>) => {
    let filterData = cloneDeep(data);
    // 处理评论时间
    filterData = filterData.map((item) => {
      const temp = {
        id: item._id,
        parentId: item.parentId,
        uid: item.uid,
        username: item.username,
        avatar: item.avatar,
        level: item.level,
        link: item.link,
        address: item.address,
        content: item.content,
        like: 0,
        like_users: item.like_users,
        createTime: showtime(formatListDate(item.createDate))
      };
      return temp;
    });

    // 筛选出一级评论
    const parentCommentList = filterData.filter((item: any) => {
      if (!item.parentId) {
        item.reply = {
          total: 0,
          list: []
        };
        item.like = item.like_users.length;
        return item;
      }
    });

    // 筛选出子评论
    const childCommentList = filterData.filter((item: any) => {
      if (item.parentId) {
        item.like = item.like_users.length;
        return item;
      }
    });

    for (let i = 0; i < childCommentList.length; i++) {
      const parentId = childCommentList[i].parentId;
      for (let j = 0; j < parentCommentList.length; j++) {
        const id = parentCommentList[j].id;
        if (parentId === id) {
          parentCommentList[j].reply.list.push(childCommentList[i]);
          parentCommentList[j].reply.total = parentCommentList[j].reply.list.length;
          break;
        }
      }
    }

    return parentCommentList;
  };

  // 提交评论事件
  const submit = async (
    content: string,
    parentId: string,
    finish: (comment: CommentApi) => void
  ) => {
    console.log(`评论提交parentId`, parentId);

    // 添加评论
    const params = {
      parentId: parentId,
      link: '',
      content: content,
      reply: null,
      commentType: props.commentType,
      commentTypeId: props.commentTypeId
    };
    const data = await addCommentAsync(params);

    if (data.data.status === 200) {
      const createTime = showtime(formatListDate(data.data.data.createDate)); //  处理时间戳
      let comment: CommentApi = {
        id: data.data.data._id,
        parentId: data.data.data.parentId,
        uid: data.data.data.uid,
        username: data.data.data.username,
        avatar: data.data.data.avatar,
        level: data.data.data.level,
        link: data.data.data.link,
        address: data.data.data.address,
        content: data.data.data.content,
        like: 0,
        createTime: createTime,
        reply: null
      };
      finish(comment);
      getCommentList(); //  刷新评论列表
      ElMessage.success('评论发表成功!');
    } else {
      ElMessage.error(data.data.message);
    }
  };

  // 获取用户点赞评论的id
  const getUserLikeCommentIds = async () => {
    const params = {
      commentType: props.commentType,
      commentTypeId: props.commentTypeId
    };
    const data = await getUserLikeCommentIdsAsync(params);
    if (data.data.status === 200) {
      config.user.likeIds = data.data.data.like_comment_ids || [];
    } else {
      ElMessage.error(data.data.message);
    }
  };
  if (isLogin.value) {
    // 用户已登陆，查询点赞评论ids
    getUserLikeCommentIds();
  }

  // 点赞按钮事件
  const like = async (id: string, finish: () => void) => {
    const isLike = (config.user.likeIds as Array<string>).indexOf(id) > -1 ? true : false; //  当前是否已经是点赞状态
    if (!isLike) {
      // 进行点赞
      const params = {
        id: id, //  评论id
        commentType: props.commentType,
        commentTypeId: props.commentTypeId //  评论类型id
      };
      const data = await likeCommentAsync(params);
      if (data.data.status === 200) {
        finish();
        getUserLikeCommentIds(); //  更新点赞id
        ElMessage.success('点赞成功!');
      } else {
        ElMessage.error(data.data.message);
      }
    } else {
      // 取消点赞
      const params = {
        id: id, //  评论id
        commentType: props.commentType,
        commentTypeId: props.commentTypeId //  评论类型id
      };
      const data = await cancelLikeCommentAsync(params);
      if (data.data.status === 200) {
        finish();
        getUserLikeCommentIds(); //  更新点赞id
        ElMessage.success('取消点赞成功!');
      } else {
        ElMessage.error(data.data.message);
      }
    }
  };

  // 删除评论
  const remove = async (id: number, finish: () => void) => {
    const params = {
      id: id
    };
    const data = await deleteOneCommentAsync(params);
    if (data.data.status === 200) {
      finish()
      getCommentList(); //  更新评论列表
      ElMessage.success('删除成功!')
    } else {
      ElMessage.error(data.data.message)
    }
  };

  // 举报用户
  const report = (id:number,finish: () => void) => {
    setTimeout(() => {
      finish()
      alert(`举报成功: ${id}`)
    }, 200);
  }
</script>

<style lang="scss" scoped>
  .comment-view {
    width: v-bind('props.width');
    margin: 40px auto;
    position: relative;
    .login-content-box {
      width: 100%;
      height: 100px;
      background-color: rgba($color: #eee, $alpha: 0.7);
      display: flex;
      align-items: center;
      justify-content: center;
      margin-top: 30px;
      cursor: pointer;
      border-radius: 10px;
      p {
        color: #028e6b;
        font-size: 16px;
        letter-spacing: 2px;
        transition: all 0.3s;
        &:hover {
          color: #06b78b;
        }
      }
    }
    .comment-no-data-box {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      :deep(.no-data-box) {
        min-height: 100px;
      }
      p {
        font-size: 14px;
        color: rgb(116, 114, 114);
      }
    }
  }
</style>
