<template>
  <div class="template-card-list-box">
    <div class="card-box-item" v-for="(item, index) in templateList" :key="index">
      <template-card :card-data="item" @to-preview="toPreview"></template-card>
    </div>
  </div>
</template>

<script setup lang="ts">
  import TemplateCard from './TemplateCard.vue';

  defineProps<{
    templateList: any;
  }>();

  const router = useRouter();
  const toPreview = (item: any) => {
    const newPage = router.resolve({
      path: '/pptPreview',
      query: {
        id: item._id
      }
    });
    window.open(newPage.href, '_blank');
  };
</script>

<style lang="scss" scoped>
  .template-card-list-box {
    display: flex;
    flex-wrap: wrap;
    padding: 30px 0 0 0;
    .card-box-item {
      &:not(:nth-child(4n)) {
        margin-right: 25px;
      }
    }
  }
</style>
