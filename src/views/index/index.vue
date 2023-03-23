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
    <div ref="customTemplateRef"></div>
    <!-- 成为赞助者 -->
    <div ref="sponsorRefs"></div>
    <!-- 网站相关数据 -->
    <!-- footer -->
    <!-- 回到顶部 -->
    <!-- 联系我 -->
    <!-- Github卡片 -->
  </div>
</template>

<script setup lang="ts">
  import ProjectIntroduce from './components/ProjectIntroduce.vue';
  import TemplateSelect from './components/TemplateSelect.vue'
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
