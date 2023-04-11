<template>
  <div class="online-preview-box">
    <!-- 简历 -->
    <div :key="refreshUuid" ref="html2Pdf" class="design">
      <div ref="htmlContentPdf" class="design-content">
        <component :is="OnlineResume" @content-height-change="contentHeightChange"></component>
      </div>
      <!-- 分页线 -->
      <template v-if="linesNumber > 0">
        <div
          v-for="(item, index) in linesNumber"
          :key="index"
          :ref="(el) => setLinesRef(el, index)"
          class="lines"
          :style="{ top: `${1128 + 1132 * index}px` }"
        >
          <p class="page">{{ index + 1 }}/{{ linesNumber }}</p>
        </div>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { storeToRefs } from 'pinia';
  import appStore from '@/store/index';
  import OnlineResume from './components/OnineResume.vue';
  import { getOnlineResumeAsync } from '@/http/api/userResume';
  import IDESIGNJSON from '@/interface/design';

  const route = useRoute();
  const { id } = route.params;
  const { resumeJsonNewStore } = storeToRefs(appStore.useResumeJsonNewStore);
  const { refreshUuid } = storeToRefs(appStore.useRefreshStore);
  const { setUuid } = appStore.useRefreshStore;
  const { changeResumeJsonData } = appStore.useResumeJsonNewStore;
  let TEMP_JSON: IDESIGNJSON;

  // 查询在线简历数据
  const getOnlineResume = async () => {
    const data = await getOnlineResumeAsync(id);
    if (data.status === 200) {
      TEMP_JSON = data.data as IDESIGNJSON;
      changeResumeJsonData(TEMP_JSON); //  更新store数据
      setUuid();
    } else {
      ElMessage.error(data.message);
    }
  };
  getOnlineResume();

  // 分页线模块ref
  const linesRef: Array<any> = [];
  const setLinesRef = (el: any, index: number) => {
    if (el) {
      if (linesNumber.value === index + 1) {
        el.style.top = linesNumber.value * 1160 + 'px'; // 最后一条分割线出现在底部
      }
      linesRef.push(el);
    }
  };

  // 监听内容元素怒高度变化，绘制分割线
  const htmlContentPdf = ref<any>(null);
  const html2Pdf = ref<any>(null); // 获取元素节点
  const linesNumber = ref<number>(0);
  let observer: ResizeObserver | null = null;
  let height = 0;
  const resizeDOM = () => {
    observer = new ResizeObserver(async (entries: ResizeObserverEntry[]) => {
      for (let entry of entries) {
        height = (entry.target as HTMLElement).offsetHeight;
        linesNumber.value = Math.ceil(height / 1160); //  计算分页线线数目
        html2Pdf.value.style.height = 1160 * linesNumber.value + 'px'; //  简历总高度
        htmlContentPdf.value.style.height = html2Pdf.value.style.height;
      }
    });
    observer.observe(htmlContentPdf.value);
  };
  // 子组件内容变化-->重新计算高度,触发resizeDOM
  const contentHeightChange = async (height: number) => {
    htmlContentPdf.value.style.height = height + 'px';
    await nextTick();
    resizeDOM();
  };
</script>

<style lang="scss" scoped>
  .online-preview-box {
    padding: 30px 0;
    .design {
      background: white;
      width: 820px;
      min-height: 1160px;
      display: flex;
      position: relative;
      margin: 0 auto;
      border-radius: 5px;
      box-shadow: 0px 16px 22px 2px rgb(0 37 58 / 10%);
      .design-content {
        font-family: v-bind(
          'resumeJsonNewStore.GLOBAL_STYLE.fontFamily ? resumeJsonNewStore.GLOBAL_STYLE.fontFamily : "微软雅黑"'
        );
      }

      .lines {
        z-index: 10;
        width: 880px;
        height: 24px;
        background: #f3f3f3;
        user-select: none;
        pointer-events: none;
        position: absolute;
        display: flex;
        align-items: center;
        left: -30px;
        .page {
          font-size: 9px;
          color: #999999;
        }
        .page {
          position: absolute;
          left: 50%;
          top: 50%;
          transform: translate(-50%, -50%);
        }
      }
    }
  }
</style>
