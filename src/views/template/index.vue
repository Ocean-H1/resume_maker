<template>
  <div class="template-box">
    <div class="content-box">
      <!-- 分类筛选 -->
      <Category
        :category-list="categoryList"
        @get-template-list-by-cate="getTemplateListByCategory"
      ></Category>
      <!-- 模板列表 -->
      <TemplateList
        v-if="templateList.length && !isShowLoading"
        :template-list="templateList"
      ></TemplateList>
      <!-- 暂无数据 -->
      <div v-if="!templateList.length && !isShowLoading" class="no-data-box">
        <NoData></NoData>
      </div>
      <!-- 等待动画 -->
      <div v-if="isShowLoading" class="no-data-box">
        <CommonLoading></CommonLoading>
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
  import Category from './components/Category.vue';
  import { getCategoryListAsync } from '@/http/api/category';
  import { getTemplateListAsync } from '@/http/api/resume';
  import TemplateList from './components/TemplateList.vue';
  import NoData from '@/components/NoData/NoData.vue';
  import CommonLoading from '@/components/CommonLoading/CommonLoading.vue';

  // 根据选择的分类获取模板列表
  const category = ref<string>('');
  const sort = ref<string>('');
  const getTemplateListByCategory = (item: any) => {
    category.value = item.category;
    sort.value = item.sort;
    page.value = 1;
    limit.value = 12;
    getTemplateList();
  };

  // 查询分类列表
  const categoryList = ref<any>([]);
  const getCategoryList = async () => {
    const data = await getCategoryListAsync();
    if (data.status) {
      categoryList.value = data.data;
      // 添加全部选项
      categoryList.value.unshift({
        category_label: '全部',
        category_value: ''
      });
    } else {
      ElMessage.error(data.data.message);
    }
  };
  getCategoryList();

  // 查询模板列表
  const page = ref<number>(1);
  const limit = ref<number>(12);
  const total = ref<number>(0);
  const currentPage = ref<number>(1);
  const templateList = ref<any>([]);
  const isShowLoading = ref<boolean>(false); //  是否显示等待动画
  const getTemplateList = async () => {
    isShowLoading.value = true;
    const params = {
      page: page.value,
      limit: limit.value,
      category: category.value,
      sort: sort.value
    };
    const data = await getTemplateListAsync(params);
    if (data.status === 200) {
      templateList.value = data.data.list;
      total.value = data.data.page.count;
      currentPage.value = data.data.page.currentPage;
      isShowLoading.value = false;
    } else {
      ElMessage.error(data.message);
      isShowLoading.value = false;
    }
  };
  getTemplateList();

  // 改变页码时触发
  const handleCurrentChange = (currentPage: number) => {
    page.value = currentPage;
    getTemplateList();
  };
</script>

<style lang="scss" scoped>
  .template-box {
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
