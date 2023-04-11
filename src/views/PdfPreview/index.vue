<template>
  <component :is="resumeBackgroundName" ref="html2Pdf" :key="refreshUuid">
    <div ref="htmlContentPdf" class="design-content">
      <component :is="custom" @content-height-change="contentHeightChange"></component>
    </div>
  </component>
</template>

<script setup lang="ts">
  import appStore from '@/store';
  import { storeToRefs } from 'pinia';
  import resumeBackgroundComponents from '@/utils/registerResumeBackgroundCom';
  import custom from '@/template/custom/index.vue';
  import IDESIGNJSON from '@/interface/design';
  import { getTemplateInfoAsync } from '@/http/api/resume';
  import { closeGlobalLoading } from '@/utils/common';

  closeGlobalLoading();
  const { resumeJsonNewStore } = storeToRefs(appStore.useResumeJsonNewStore);
  const resumeBackgroundName = computed(() => {
    return resumeJsonNewStore.value.GLOBAL_STYLE.resumeBackgroundCom
      ? resumeBackgroundComponents[resumeJsonNewStore.value.GLOBAL_STYLE.resumeBackgroundCom]
      : resumeBackgroundComponents['RESUME_BACKGROUND_DEFAULT'];
  });

  const route = useRoute();
  const { refreshUuid } = storeToRefs(appStore.useRefreshStore);
  const { token, id, height } = route.query; //  模板id和高度
  const { changeResumeJsonData } = appStore.useResumeJsonNewStore;
  const { setUuid } = appStore.useRefreshStore;
  let TEMP_JSON: IDESIGNJSON;
  // 获得简历数据
  const getResumeData = async () => {
    if (token && id) {
      localStorage.setItem('token', token as string);
      const data = await getTemplateInfoAsync(id);
      if (data.data.status === 200) {
        TEMP_JSON = data.data.data as IDESIGNJSON;
      } else {
        ElMessage.error('查询模板失败!');
        return;
      }
      changeResumeJsonData(TEMP_JSON); //  更新store
      setUuid();
    } else {
      let token = localStorage.getItem('token');
      if (token) {
        const data = await getTemplateInfoAsync(id);
        if (data.data.status === 200) {
          TEMP_JSON = data.data.data as IDESIGNJSON;
        } else {
          ElMessage.error('查询模板失败!');
          return;
        }
        changeResumeJsonData(TEMP_JSON); //  更新store
        setUuid();
      } else {
        return;
      }
    }
  };
  getResumeData();

  // 监听内容元素变化，绘制分割线
  const htmlContentPdf = ref<any>(null);
  const html2Pdf = ref<any>(null);
  let observer: ResizeObserver | null = null;
  const resizeDOM = () => {
    observer = new ResizeObserver(async (entries: ResizeObserverEntry[]) => {
      for (let entry of entries) {
        html2Pdf.value.$el.style.height = height; //  整个简历的高度
        htmlContentPdf.value.$el.style.height = html2Pdf.value.$el.style.height;
      }
    });
    observer.observe(htmlContentPdf.value);
  };

  // 子组件内容发生变化-->重新计算高度，触发resizeDOM
  const contentHeightChange = async () => {
    await nextTick();
    resizeDOM();
  };
</script>

<style lang="scss" scoped>
  .design {
    width: 820px;
    min-height: 1160px;
    display: flex;
    position: relative;
    margin: 0 auto;
    .design-content {
      font-family: v-bind(
        'resumeJsonNewStore.GLOBAL_STYLE.fontFamily ? resumeJsonNewStore.GLOBAL_STYLE.fontFamily : "微软雅黑"'
      );
    }
  }
</style>
