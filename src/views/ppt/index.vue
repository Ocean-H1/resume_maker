<template>
  <div class="resume-ppt-box">
    <div class="content-box">
      <!-- 分类筛选 -->
      <category-vue
        :category-list="categoryList"
        :tags-list="tagsList"
        @get-template-list-by-cate="getTemplateListByCategory"
      ></category-vue>
      <!-- 模板列表 -->
      <template-list :template-list="templateList"></template-list>
      <!-- 暂无数据 -->
      <div v-if="!templateList.length && !isShowLoading" class="no-data-box">
        <no-data></no-data>
      </div>
      <!-- 等待动画 -->
      <div v-if="isShowLoading" class="no-data-box">
        <common-loading></common-loading>
      </div>
      <!-- 分页组件 -->
      <Pagination
        v-if="templateList.length && templateList.length < total"
        :total="total"
        :limit="limit"
        :current-page="currentPage"
        @handle-current-change="handleCurrentChange"
      ></Pagination>
    </div>
  </div>
</template>

<script setup lang="ts">
  import CategoryVue from './components/Category.vue';
  import {
    getPPTCategoryListAsync,
    getPPTTemplateTagsListAsync,
    getPPTTemplateListAsync
  } from '@/http/api/pptTemplate';
  import TemplateList from './components/TemplateList.vue';

  const isShowLoading = ref<boolean>(false); //  是否显示等待动画

  // 查询分类列表
  const categoryList = ref<any>([]);
  const getCategoryList = async () => {
    const data = await getPPTCategoryListAsync();
    if (data.status === 200) {
      categoryList.value = data.data.map((item: any) => {
        return {
          category_label: item.name,
          category_value: item._id
        };
      });
      // 添加 '全部' 选项
      categoryList.value.unshift({
        category_label: '全部',
        category_value: ''
      });
    } else {
      ElMessage.error(data.data.message);
    }
  };
  getCategoryList();

  // 查询标签列表
  const tagsList = ref<any>([]);
  const getTemplateTagsList = async () => {
    const data = await getPPTTemplateTagsListAsync();
    if (data.status === 200) {
      tagsList.value = data.data;
    } else {
      ElMessage.error(data.data.message);
    }
  };
  getTemplateTagsList();

  // 根据分类获取模板列表
  const category = ref<string>();
  const sort = ref<string>();
  const tag = ref<string>();
  const getTemplateListByCategory = async (item: any) => {
    category.value = item.category;
    tag.value = item.tag;
    sort.value = item.sort;
    page.value = 1;
    limit.value = 12;
    getTemplateList();
  };

  // 查询模板列表
  const templateList = ref<any>([]);
  const page = ref<number>(1);
  const limit = ref<number>(12);
  const total = ref<number>(0);
  const currentPage = ref<number>(1);
  const getTemplateList = async () => {
    isShowLoading.value = true;
    const params = {
      page: page.value,
      limit: limit.value,
      category: category.value,
      sort: sort.value,
      tag: tag.value
    };
    const data = await getPPTTemplateListAsync(params);
    if (data.status === 200) {
      templateList.value = data.data.list;
      total.value = data.data.page.count;
      currentPage.value = data.data.page.currentPage;
      isShowLoading.value = false;
    } else {
      ElMessage.error(data.data.message);
      isShowLoading.value = false;
    }
  };
  getTemplateList();

  // 页码改变时触发
  const handleCurrentChange = (currentPage: number) => {
    page.value = currentPage;
    getTemplateList();
  };
</script>

<style lang="scss" scoped>
  .resume-ppt-box {
    width: 100%;
    .content-box {
      margin: 0 auto;
      min-height: 500px;
      padding: 20px 0;
      width: 1300px;
      .no-data-box {
        margin-top: 80px;
      }
    }
  }
</style>
