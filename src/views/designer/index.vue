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

    <!-- 导出pdf进度弹窗 -->
  </div>
</template>

<script setup lang="ts">
  import appStore from '@/store';
  import DesignNav from './components/DesignNav.vue';
  import { storeToRefs } from 'pinia';
  import IDESIGNJSON from '@/interface/design';
  import { getResetTemplateInfoAsync, getTemplateInfoAsync } from '@/http/api/resume';

  const route = useRoute();
  const { resumeJsonNewStore } = storeToRefs(appStore.useResumeJsonNewStore); // store里的模板数据
  const { id } = route.query;

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
  const { setUuid } = appStore.useRefreshStore
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
    setUuid()
  };
  resetStoreAndLocal();
  provide('resetStoreAndLocal', resetStoreAndLocal);

  const generateReport = async () => {};

  const generateReportNew = async () => {};

  const reset = () => {};

  // 放大缩小center
  const sizeCenter = ref<number>(1);
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
          zoom: v-bind('sizeCenter');
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
