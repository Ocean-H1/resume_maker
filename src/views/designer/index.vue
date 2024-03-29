<template>
  <div class="design-box">
    <!-- 导航栏 -->
    <DesignNav
      ref="navRef"
      @generate-report="generateReport"
      @generate-report-new="generateReportNew"
      @reset="reset"
    ></DesignNav>
    <!-- 内容区 -->
    <div class="bottom">
      <!-- 左侧添加模块区 -->
      <div class="left" ref="leftRef">
        <c-scrollbar trigger="hover">
          <Title show-collapse @unfold-or-collapse="unfoldOrCollapse"></Title>
          <ModelList :key="refreshUuid" :left-show-status="leftShowStatus"></ModelList>
        </c-scrollbar>
      </div>
      <!-- 效果预览区 -->
      <div class="center" id="print">
        <!-- 放大缩小组件 -->
        <zoom-and-out @add-size="addSize" @reduce-size="reduceSize"></zoom-and-out>
        <component :is="resumeBackgroundName" ref="html2Pdf" :key="refreshUuid">
          <!-- 内容区域 -->
          <div class="design-content" ref="htmlContentPdf">
            <component
              :is="custom"
              ref="customRef"
              @content-height-change="contentHeightChange"
            ></component>
          </div>
          <!-- 分页线 -->
          <template v-if="linesNumber > 0 && !isPrinting">
            <div
              v-for="(item, index) in linesNumber"
              :ref="(el) => setLinesRef(el, index)"
              :key="index"
              class="lines"
              :style="{ top: `${1158 + 1160 * index}px` }"
            >
              <span class="page-tips-one">第{{ index + 1 }}页</span>
            </div>
          </template>
        </component>

        <!-- 评论组件 -->
        <CommentCom :comment-type-id="id" comment-type="resumeOnline"></CommentCom>
        <!-- 回到顶部 -->
        <el-backtop :right="365" :bottom="50" target="#print">
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
            UP
          </div>
        </el-backtop>
      </div>
      <!-- 右侧属性设置面板 -->
      <div class="config" ref="configRef" :key="refreshUuid">
        <TitleConfig :title="cptTitle" @unfold-or-collapse="unfoldOrCollapseConfig"></TitleConfig>
        <c-scrollbar
          trigger="hover"
          :h-thumb-style="{
            'background-color': 'rgba(0,0,0,0.4)'
          }"
        >
          <component
            :is="optionsComponents[appStore.useSelectMaterialStore.cptOptionsName]"
            v-if="appStore.useSelectMaterialStore.cptName"
            :key="appStore.useSelectMaterialStore.cptKeyId"
          ></component>
          <!-- 全局主题样式设置 -->
          <GlobalStyleOptionsVue v-else></GlobalStyleOptionsVue>
        </c-scrollbar>
      </div>
    </div>
    <!-- 导出pdf进度弹窗 -->
    <process-bar-dialog
      :dialog-visible="dialogVisible"
      :percentage-num="percentage"
      @cancel="cancelProgress"
    ></process-bar-dialog>
  </div>
</template>

<script setup lang="ts">
  import appStore from '@/store';
  import DesignNav from './components/DesignNav.vue';
  import { storeToRefs } from 'pinia';
  import IDESIGNJSON from '@/interface/design';
  import {
    getResetTemplateInfoAsync,
    getTemplateInfoAsync,
    addMakeResumeCountAsync,
    cancelDownload
  } from '@/http/api/resume';
  import Title from './components/Title.vue';
  import ModelList from './components/ModelList.vue';
  import resumeBackgroundComponents from '@/utils/registerResumeBackgroundCom';
  import custom from '@/template/custom/index.vue';
  import { exportPNG, exportPdf } from '@/utils/pdf';
  import printHtml from '@/utils/print';
  import TitleConfig from './components/TitleConfig.vue';
  import optionsComponents from '@/utils/registerMaterialOptionsCom';
  import GlobalStyleOptionsVue from '@/options/GlobalStyleOptions.vue'; //  全局主体设置
  import { closeGlobalLoading } from '@/utils/common';

  const route = useRoute();
  const { cptTitle } = storeToRefs(appStore.useSelectMaterialStore);
  const { resumeJsonNewStore } = storeToRefs(appStore.useResumeJsonNewStore); // store里的模板数据
  const { id } = route.query; //  模板id
  const { refreshUuid } = storeToRefs(appStore.useRefreshStore);

  // 添加自定义模块时，左右布局单独处理
  const customRef = ref<any>(null);
  const addCustomModelLeftRight = (item: any) => {
    if (item.layout === 'left') {
      customRef.value.leftList.push(item);
    } else {
      customRef.value.rightList.push(item);
    }
  };
  provide('addCustomModelLeftRight', addCustomModelLeftRight);

  // 查询简历数据，如果存在草稿就返回，没有就相当于重置简历数据
  const { changeResumeJsonData } = appStore.useResumeJsonNewStore;
  const { setUuid } = appStore.useRefreshStore;
  const resetStoreAndLocal = async (isReset = false, ID = id) => {
    let TEMPLATE_JSON: IDESIGNJSON;
    let data;
    if (isReset) {
      data = await getResetTemplateInfoAsync(ID); //  重置数据
    } else {
      data = await getTemplateInfoAsync(ID);
    }
    if (data.data.status === 200) {
      TEMPLATE_JSON = data.data.data as IDESIGNJSON;
    } else {
      ElMessage.error('查询模板失败!');
      return;
    }
    changeResumeJsonData(TEMPLATE_JSON); //  更新store中的数据
    setUuid();
  };
  resetStoreAndLocal();
  provide('resetStoreAndLocal', resetStoreAndLocal);

  // 展开或收起左侧边栏
  const leftRef = ref<any>(null);
  const leftShowStatus = ref<boolean>(true);
  const unfoldOrCollapse = (status: boolean) => {
    if (status) {
      // 展开
      setTimeout(() => {
        leftShowStatus.value = status;
      }, 100);
      leftRef.value.style.width = '300px';
    } else {
      // 折叠
      setTimeout(() => {
        leftShowStatus.value = status;
      }, 100);
      leftRef.value.style.width = '70px';
    }
  };

  // 生成要下载的PDF / PNG
  const dialogVisible = ref<boolean>(false);
  const percentage = ref<number>(10); //  导出进度
  let timer: any = null;
  let generateType = ''
  const generateReport = async (type: string) => {
    generateType = type
    dialogVisible.value = true;
    timer = setInterval(() => {
      percentage.value += 5;
      if (percentage.value > 95) {
        percentage.value = 98;
        clearInterval(timer);
      }
    }, 500);
    let token = localStorage.getItem('token') as string;
    let height = htmlContentPdf.value.style.height;
    if (type === 'pdf') {
      await exportPdf(token, id as string, height);
    } else {
      await exportPNG(token, id as string, height);
    }
    clearInterval(timer);
    percentage.value = 100;
  };

  // 另存为PDF，新的方法
  const isPrinting = ref<boolean>(false);
  const generateReportNew = async () => {
    addMakeResumeCountAsync(); // 增加pdf导出次数
    isPrinting.value = true; // 去掉分割线
    // 重置store选中模块
    resetSelectModel();
    await nextTick();
    const target = document.getElementById('print');
    if (target) {
      printHtml(target.innerHTML);
    }
    // 打印取消和完成
    window.onbeforeprint = () => {
      isPrinting.value = true;
    };
    window.onafterprint = () => {
      isPrinting.value = false;
    };
  };

  // 关闭进度弹窗
  const cancelProgress = () => {
    // 取消导出
    cancelDownload(generateType);
    dialogVisible.value = false;
    percentage.value = 10;
  };

  const { resetSelectModel } = appStore.useSelectMaterialStore;
  // 全局样式设置
  const globalStyleSetting = () => {
    // 重置store中选中的模块
    resetSelectModel();
  };

  // 重置数据
  const reset = async () => {
    resetStoreAndLocal(true); //  重置store数据
    globalStyleSetting(); //  重置选中模块
    ElMessage({
      message: '重置成功！',
      type: 'success',
      center: true
    });
    setUuid(); //  重新渲染左侧列表和右侧属性面板
    await nextTick();
    resizeDOM();
  };

  // 放大缩小center
  const sizeCenter = ref<number>(1);
  const addSize = (number: number) => {
    sizeCenter.value = number;
  };
  const reduceSize = (number: number) => {
    sizeCenter.value = number;
  };

  // 返回简历背景
  const resumeBackgroundName = computed(() => {
    return resumeJsonNewStore.value.GLOBAL_STYLE.resumeBackgroundCom
      ? resumeBackgroundComponents[resumeJsonNewStore.value.GLOBAL_STYLE.resumeBackgroundCom]
      : resumeBackgroundComponents['RESUME_BACKGROUND_DEFAULT'];
  });

  // 分割线模块化ref
  const html2Pdf = ref<any>(null);
  let lineRefs: Array<any> = []; // 分割线的ref
  const setLinesRef = (el: any, index: number) => {
    if (el) {
      if (linesNumber.value === index + 1) {
        el.style.top = linesNumber.value * 1160 + 'px'; //  最后一条分割线出现在底部
      }
      lineRefs.push(el);
    }
  };
  // 监听内容元素高度变化，绘制分割线
  const htmlContentPdf = ref<any>(null);
  const linesNumber = ref<number>(0);
  let observer: ResizeObserver | null = null;
  let height = 0;
  const resizeDOM = () => {
    observer = new ResizeObserver(async (entries: ResizeObserverEntry[]) => {
      for (let entry of entries) {
        height = (entry.target as HTMLElement).offsetHeight;
        linesNumber.value = Math.ceil(height / 1160); //  计算分割线数目
        html2Pdf.value.$el.style.height = 1160 * linesNumber.value + 'px'; //  计算整个简历的高度
        htmlContentPdf.value.style.height = html2Pdf.value.$el.style.height;
      }
    });
    observer.observe(htmlContentPdf.value);
  };

  // 子组件内容发生变化-->需要重新计算高度,触发resizeDOM
  const contentHeightChange = async (height: number) => {
    htmlContentPdf.value.style.height = height + 'px';
    await nextTick();
    resizeDOM();
  };

  // 展开或收起属性面板
  const configRef = ref<any>(null);
  const unfoldOrCollapseConfig = (status: boolean) => {
    if (status) {
      configRef.value.style.width = '355px';
      configRef.value.style.flex = 'inherit';
    } else {
      configRef.value.style.flex = 1;
    }
  };

  // 点击其他区域取消模块选择
  const initClickListener = () => {
    window.addEventListener('click', dealClick);
  };
  const dealClick = (e: MouseEvent) => {
    const bool = getTargetNode(htmlContentPdf.value, e.target);
    if (bool) {
      globalStyleSetting();
    }
  };
  const getTargetNode = (el: any, target: any): boolean => {
    if (!el || el === document) return false;
    return el === target ? true : getTargetNode(el.parentNode, target);
  };
  onBeforeUnmount(() => {
    window.removeEventListener('click', dealClick); //  取消事件监听
  });

  // 生命周期hooks
  onMounted(async () => {
    resizeDOM();
    initClickListener();

    await nextTick();
    closeGlobalLoading(); //  关闭全局等待层
  });
  onBeforeUnmount(() => {
    observer?.disconnect();
  });
  onBeforeUpdate(() => {
    lineRefs = [];
  });
</script>

<style lang="scss">
  @import '../../style/options.scss';
</style>
<style lang="scss" scoped>
  .design-box {
    height: 100vh;
    width: 100%;
    box-sizing: border-box;
    overflow: hidden;
    min-width: 1375px;
    .bottom {
      display: flex;
      width: 100%;

      .left {
        width: 300px;
        background-color: #fff;
        height: calc(100vh - 50px);
        overflow: auto;
        transition: all 0.3s;
      }

      .center {
        // display: flex;
        // justify-content: center;
        // align-items: flex-start;
        flex: 1;
        min-width: 840px;
        height: calc(100vh - 50px);
        overflow: auto;

        .design {
          // background: white;
          width: 820px;
          min-height: 1160px;
          margin: 40px auto;
          display: flex;
          position: relative;
          .lines {
            z-index: 10;
            width: 820px;
            height: 4px;
            background: #f3f3f3 url(@/assets/images/paging_bg.png) center top no-repeat;
            user-select: none;
            pointer-events: none;
            position: absolute;
            display: flex;
            align-items: center;
            .page-tips-one {
              position: absolute;
              top: -17px;
              right: 0px;
              font-size: 12px;
              background: #ff9971;
              color: #fff;
              padding: 2px 8px;
              border-radius: 8px 0 0 0;
            }
          }
          .design-content {
            font-family: v-bind(
              'resumeJsonNewStore.GLOBAL_STYLE.fontFamily ? resumeJsonNewStore.GLOBAL_STYLE.fontFamily : "微软雅黑"'
            );
            zoom: v-bind('sizeCenter');
          }
        }
      }

      .config {
        width: 355px;
        background-color: #fff;
        overflow-y: auto;
        display: flex;
        flex-direction: column;
        height: calc(100vh - 50px);
        transition: all 0.3s;
      }
    }
  }
</style>
