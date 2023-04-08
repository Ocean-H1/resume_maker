<template>
  <div class="custom-resume-box">
    <!-- 导航栏 -->
    <NavCom @generate-report="generateReport"></NavCom>
    <!-- 主区域 -->
    <div class="main-box">
      <!-- 左侧物料区 -->
      <MainLeft></MainLeft>
      <!-- 中间设计区 -->

      <!-- 右侧属性面板 -->

    </div>
  </div>
</template>

<script setup lang="ts">
  import NavCom from './components/NavCom.vue'
  import MainLeft from './components/MainLeft.vue';

  const generateReport = () => {

  }
</script>

<style lang="scss" scoped>
  .custom-resume-box {
    height: 100vh;
    width: 100%;
    box-sizing: border-box;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    .main-box {
      flex: 1;
      display: flex;
      box-sizing: border-box;
    }
  }
</style>