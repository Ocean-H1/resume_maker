<template>
  <div class="card-wraper" @mouseover="mouseover" @mouseleave="mouseleave">
    <div class="template-card-box">
      <img :src="getImgUrl(cardData.previewUrl)" alt="" />
      <!-- 遮罩层 -->
      <div class="mask-layer" ref="maskLayerRef">
        <div
          class="preview-icon"
          v-if="cardData.NAME !== 'custom'"
          title="预览"
          @click="previewImg"
        >
          <svg-icon icon-name="icon-yulan" class-name="yulan" color="#fff"></svg-icon>
        </div>
        <div class="design-button" @click="toPreview"> 立即下载 </div>
      </div>
    </div>
    <!-- 使用人数 -->
    <div class="viewer-box">
      <!-- 模板作者 -->
      <div class="downloads-box">
        <svg-icon icon-name="icon-xiazailiang" color="#a3abb1" size="19px"></svg-icon>
        <span class="downloads">{{ cardData.downloads }}</span>
      </div>
      <div class="word-name">
        <span :title="cardData.name">{{ cardData.name }}</span>
      </div>
      <div class="icon-box">
        <svg-icon icon-name="icon-pinglun1" color="#a3abb1" size="19px"></svg-icon>
        <span class="number">{{ cardData.commentCount }}</span>
        <svg-icon icon-name="icon-liulanliang1" color="#a3abb1" size="19px"></svg-icon>
        <span class="number">{{ cardData.views }}</span>
      </div>
    </div>
  </div>

  <!-- 预览 -->
  <PreviewImage v-show="dialogVisible" @close="close">
    <img :src="getImgUrl(cardData.previewUrl)" alt="" class="previewImg" />
  </PreviewImage>
</template>

<script setup lang="ts">
  import PreviewImage from '@/components/PreviewImage/PreviewImage.vue';

  const emit = defineEmits(['toPreview']);
  const props = defineProps<{
    cardData: any;
  }>();

  // 返回图片url
  const getImgUrl = (str: string) => {
    if (str) {
      return JSON.parse(str)[0].url;
    }
  };

  // 鼠标移入/移出事件
  const maskLayerRef = ref<any>(null);
  const mouseover = () => {
    maskLayerRef.value.style.opacity = 1;
  };
  const mouseleave = () => {
    maskLayerRef.value.style.opacity = 0;
  };

  // 图片预览
  const dialogVisible = ref<boolean>(false);
  const previewImg = () => {
    dialogVisible.value = true;
  };
  // 取消预览
  const close = () => {
    dialogVisible.value = false;
  };

  // 点击立即下载
  const toPreview = () => {
    emit('toPreview', props.cardData);
  };
</script>

<style lang="scss" scoped>
  .card-wraper {
    display: flex;
    flex-direction: column;
    margin-bottom: 40px;
    border-radius: 5px;
    overflow: hidden;
    width: 300px;
    height: 440px;
    flex-basis: fit-content;
    transition: all 0.3s;
    &:hover {
      box-shadow: 0px 16px 22px 2px rgb(0 37 58 / 24%);
      transform: translateY(2%) scale(1.03);
      background-color: #fff;
    }
    .template-card-box {
      height: 400px;
      background-color: #fff;
      position: relative;
      z-index: 0;
      user-select: none;
      transition: all 0.3s;

      img {
        width: 100%;
        height: 100%;
      }
      .mask-layer {
        height: 100%;
        width: 100%;
        border-radius: 5px 5px 0 0;
        position: absolute;
        left: 0;
        top: 0;
        background-color: rgba(0, 0, 0, 0.5);
        transition: all 0.3s;
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 1;
        transition: all 0.3s;
        opacity: 0;
        .design-button {
          width: 100px;
          height: 30px;
          font-size: 13px;
          background-color: #2cbd99;
          border-radius: 6px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #ffffff;
          transition: all 0.3s;
          &:hover {
            background-color: rgba(#42aa90, 0.7);
          }
        }
        .preview-icon {
          position: absolute;
          right: 15px;
          top: 15px;
          z-index: 12;
          width: 30px;
          height: 30px;
          background-color: rgba(0, 0, 0, 0.7);
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 4px;
          .yulan {
            cursor: pointer;
            font-size: 20px;
          }
        }
      }
    }
    .viewer-box {
      flex: 1;
      width: 100%;
      color: #a3abb1;
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0 5px;
      .downloads-box {
        display: flex;
        align-items: center;
        .name {
          margin-left: 10px;
          font-size: 12px;
        }
        .downloads {
          margin-left: 6px;
        }
      }
      .word-name {
        flex: 1;
        padding: 0 0 0 20px;
        white-space: nowrap;
        text-overflow: ellipsis;
        overflow: hidden;
        span {
          font-size: 14px;
        }
      }
      .icon-box {
        margin-right: 5px;
        display: flex;
        align-items: center;
        .svg-icon {
          margin-left: 10px;
        }
        .number {
          margin-left: 5px;
          padding-top: 1px;
        }
      }
    }
  }

  .previewImg {
    height: 90vh;
  }
</style>
