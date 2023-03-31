<template>
  <el-config-provider size="small" :locale="zhCn">
    <!-- 公告导航栏 -->
    <nav-bar
      v-if="route.meta.isShowComNav"
      :key="refreshUuid"
      bg-color="#fff"
      font-color="green"
      position="sticky"
      icon-color="green"
    >
    </nav-bar>
    <router-view v-show="!isLoading" v-slot="{}" :key="refreshUuid"></router-view>
    <loading-com-vue v-show="isLoading"></loading-com-vue>
  </el-config-provider>
</template>

<script setup lang="ts">
  import zhCn from 'element-plus/lib/locale/lang/zh-cn';
  import { storeToRefs } from 'pinia';
  import appStore from './store';
  import LoadingComVue from '@/components/Loading/LoadingCom.vue'; // 全局等待层

  const { isLoading } = storeToRefs(appStore.useLoadingStore);
  const route = useRoute();
  const { refreshUuid } = appStore.useRefreshStore;

  // 查询和更新用户信息
  const { getAndUpdateUserInfo } = appStore.useUserInfoStore;
  const { token } = appStore.useTokenStore;
  if (token) {
    getAndUpdateUserInfo();
  }
</script>

<style scoped></style>
