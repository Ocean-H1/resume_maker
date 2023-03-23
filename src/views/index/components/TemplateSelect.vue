<template>
  <div ref="templateRef" class="template-select-box">
    <IntroduceTitle
      title="在线简历制作"
      subtitle="选择简历模板，点击在线制作，永久云端保存，可一键导出"
      title-color="#000"
      subtitle-color="#7f8b96"
    ></IntroduceTitle>
    <!-- 模板列表 -->
    <div class="card-list">
      <template v-if="templateList.length">
        <div v-for="(item, index) in templateList" :key="index" class="card-list-item-box">
          <template-card :card-data="item" @to-design="toDesign"></template-card>
        </div>
      </template>
      <template v-else>
        <div v-for="index in 8" :key="index" class="card-list-item-box">
          <SkeletonCard></SkeletonCard>
        </div>
      </template>
    </div>
    <!-- 查看更多 -->
    <div class="more">
      <div class="button" @click="seeMore"> 查看更多 </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import IntroduceTitle from './IntroduceTitle.vue';
  import { getTemplateListAsync } from '@/http/api/resume';
  import TemplateCard from '@/components/TemplateCard/TemplateCard.vue';
  import { ITempList } from '@/template/type';
  import { openGlobalLoading } from '@/utils/common';
  import SkeletonCard from '@/components/SkeletonCard/SkeletonCard.vue';
  import appStore from '@/store';

  // 查询模板列表
  const page = 1;
  const limit = 8;
  const templateList = ref<Array<any>>([]);
  const getTemplateList = async () => {
    let params = {
      page,
      limit
    };
    const data = await getTemplateListAsync(params);
    if (data.status === 200) {
      templateList.value = data.data.list;
    } else {
      ElMessage.error(data.data.message);
    }
  };
  getTemplateList();

  // 跳转至设计页面
  const { resetResumeJson } = appStore.useResumeJsonNewStore;
  const { resetSelectModel } = appStore.useSelectMaterialStore;
  const router = useRouter();
  const toDesign = (item: ITempList) => {
    openGlobalLoading(); //  等待动画层
    resetResumeJson(); // 重置JSON数据
    resetSelectModel(); // 重置选中模块
    router.push({
      path: '/designer',
      query: {
        id: item.ID
      }
    });
  };

  // 点击查看更多
  const seeMore = () => {
    router.push({
      name: 'Template'
    });
  };

  // 出现在可视区域
  const templateRef = ref<any>(null);
  const scrollIntoView = () => {
    templateRef.value.scrollIntoView({ behavior: 'smooth' });
  };

  defineExpose({
    scrollIntoView
  });
</script>

<style lang="scss" scoped></style>
