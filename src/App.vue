<template>
  <el-config-provider size="small" :locale="zhCn">
    <!-- 公告导航栏 -->
    <nav-bar
      
      :key="refreshUuid"
      bg-color="#fff"
      font-color="green"
      position="sticky"
      icon-color="green"
    >
    </nav-bar>
    <router-view :key="refreshUuid"></router-view>
  </el-config-provider>
  
</template>

<script setup lang="ts">
  import zhCn from 'element-plus/lib/locale/lang/zh-cn';
  import appStore from './store';

  const route = useRoute()
  const { refreshUuid } = appStore.useRefreshStore;
</script>

<style scoped></style>
