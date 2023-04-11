<template>
  <div v-if="item.show" :ref="(el) => setItemRef(el, item.keyId)" class="material-model-box">
    <component
      :is="components[item.cptName]"
      :class="['mode-item', { 'is-have-border': cptKeyId === item.keyId }]"
      :model-data="item.data"
      :model-style="item.style"
      :style="getDynamicStyle(item)"
    ></component>
  </div>
</template>

<script setup lang="ts">
  import { IMATERIALITEM } from '@/interface/material';
  import appStore from '@/store';
  import { storeToRefs } from 'pinia';
  import { ComponentPublicInstance } from 'vue';

  defineProps<{
    item: IMATERIALITEM;
    components: any;
  }>();

  // 锚点定位
  const { cptKeyId } = storeToRefs(appStore.useSelectMaterialStore);
  watch(
    () => cptKeyId.value,
    (newVal) => {
      // 如果选中了模块
      if (newVal && modelObj[newVal]) {
        modelObj[newVal].el.scrollIntoView({ behavior: 'smooth', block: 'center' }); //  出现在可视区域内
      }
    },
    {
      deep: true
    }
  );

  // 模块ref
  const modelObj = reactive<any>({});
  const setItemRef = (el: ComponentPublicInstance | null | Element, keyId: string) => {
    if (el) {
      modelObj[keyId] = {
        el: el,
        id: keyId
      };
    }
  };

  // 添加样式
  const getDynamicStyle = (item: IMATERIALITEM) => {
    return {
      width: item.cptWidth
    };
  };
</script>

<style lang="scss" scoped>
  .material-model-box {
    border: 1px dashed transparent;
    transition: all 0.3s;
    position: relative;
    .mode-item {
      border: 1px dashed transparent;
      position: relative;
      box-sizing: border-box;
    }
  }
  .is-have-border {
    border-color: #7ec97e;
  }
</style>
