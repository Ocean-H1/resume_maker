<template>
  <div ref="indexRef" class="index-box" @scroll="handleScroll">
    <!-- 导航栏 -->
    <nav-bar :bg-color="navColor" :font-color="fontColor" :icon-color="iconColor"></nav-bar>
    <!-- 项目介绍栏 -->
    <div ref="introduceRef">
      <project-introduce
        @free-make="freeMake"
        @custom-template="customTemple"
        @sponsor="sponsor"
      ></project-introduce>
    </div>
    <!-- 模板选择 -->
    <template-select ref="templateRef"></template-select>
    <!-- 自定义模板 -->
    <CustomTemplate ref="customTemplateRef"></CustomTemplate>
    <!-- 成为赞助者 -->
    <SponsorComVue ref="sponsorRefs"></SponsorComVue>
    <!-- 网站相关数据 -->
    <WebData></WebData>
    <!-- footer -->
    <FooterCom></FooterCom>
    <!-- 回到顶部 -->
    <el-backtop :bottom="100">
      <div
        style="
          height: 100%;
          width: 100%;
          background-color: var(--el-bg-color-overlay);
          box-shadow: var(--el-box-shadow-lighter);
          text-align: center;
          line-height: 40px;
          color: #1989fa;
          user-select: none;
          border-radius: 50%;
          font-size: 14px;
        "
      >
        UP ↑
      </div>
    </el-backtop>
    <!-- 联系我 -->
    <CallMe></CallMe>
    <!-- Github卡片 -->
    <GithubCard></GithubCard>
  </div>
</template>

<script setup lang="ts">
  import GithubCard from '@/components/GithubCard/GithubCard.vue';
  import CallMe from './components/CallMe.vue';
  import FooterCom from '@/components/FooterCom/FooterCom.vue';
  import WebData from './components/WebData.vue';
  import ProjectIntroduce from './components/ProjectIntroduce.vue';
  import TemplateSelect from './components/TemplateSelect.vue';
  import CustomTemplate from './components/CustomTemplate.vue';
  import SponsorComVue from './components/SponsorCom.vue';
  import { throttle } from 'lodash';

  // 监听元素滚动
  onMounted(() => {
    window.addEventListener('scroll', throttleHandle);
  });
  onBeforeUnmount(() => {
    window.removeEventListener('scroll', throttleHandle);
  });

  // 页面滚动改变导航栏样式
  const throttleHandle = throttle(() => {
    handleScroll();
  }, 300);
  const navColor = ref<string>('');
  const fontColor = ref<string>('#fff');
  const iconColor = ref<string>('#fff');
  const handleScroll = () => {
    if (document.documentElement.scrollTop > 0) {
      navColor.value = '#fff';
      fontColor.value = 'green';
      iconColor.value = 'green';
    } else {
      navColor.value = '';
      iconColor.value = '#fff';
      fontColor.value = '#fff';
    }
  };

  // 点击免费制作
  const templateRef = ref<any>(null);
  const freeMake = () => {
    templateRef.value.scrollIntoView();
  };
  // 点击自定义模板
  const customTemplateRef = ref<any>(null);
  const customTemple = () => {
    customTemplateRef.value.scrollIntoView();
  };
  // 点击成为赞助者
  const sponsorRefs = ref<any>(null);
  const sponsor = () => {
    sponsorRefs.value.scrollIntoView();
  };
</script>

<style lang="scss" scoped>
  .index-box {
    position: relative;
    z-index: 0;
  }
</style>
