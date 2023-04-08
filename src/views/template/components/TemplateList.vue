<template>
  <div class="template-card-list-box">
    <div v-for="(item, index) in templateList" :key="index" class="card-box-item">
      <TemplateCard :card-data="item" @to-design="toDesign"></TemplateCard>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ITempList } from '@/template/type';
  import TemplateCard from '@/components/TemplateCard/TemplateCard.vue';
  import { openGlobalLoading } from '@/utils/common';
  import appStore from '@/store';

  defineProps<{
    templateList: Array<ITempList>;
  }>();

  const router = useRouter();
  const { resetResumeJson } = appStore.useResumeJsonNewStore;
  const { resetSelectModel } = appStore.useSelectMaterialStore;
  const toDesign = (item: ITempList) => {
    openGlobalLoading();  //  打开loading动画
    resetResumeJson();  //  重置json数据
    resetSelectModel(); //  重置选中模块
    router.push({
      path: '/designer',
      query : {
        id: item.ID
      }
    })
  };
</script>

<style lang="scss" scoped>
  .template-card-list-box {
    display: flex;
    flex-wrap: wrap;
    padding: 30px 0 0 0;
    .card-box-item {
      &:not(:nth-child(4n)) {
        margin-right: 33px;
      }
    }
  }
</style>
