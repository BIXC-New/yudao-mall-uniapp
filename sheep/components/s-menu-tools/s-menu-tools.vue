<!-- 全局 - 快捷入口 -->
<template>
  <su-popup
    :show="show"
    type="top"
    round="20"
    backgroundColor="var(--ui-BG, #24211f)"
    @close="closeMenuTools"
  >
    <su-status-bar />
    <view class="tools-wrap ss-m-x-30 ss-m-b-16">
      <view class="title ss-m-b-34 ss-p-t-20">快捷菜单</view>
      <view class="container-list ss-flex ss-flex-wrap">
        <view class="list-item ss-m-b-24" v-for="item in list" :key="item.title">
          <view class="ss-flex-col ss-col-center">
            <button
              class="ss-reset-button list-image ss-flex ss-row-center ss-col-center"
              @tap="onClick(item)"
            >
              <uni-icons class="list-icon" :type="item.icon" size="28" color="var(--shop-accent-text)" />
            </button>
            <view class="list-title ss-m-t-20">{{ item.title }}</view>
          </view>
        </view>
      </view>
    </view>
  </su-popup>
</template>

<script setup>
  import { computed } from 'vue';
  import sheep from '@/sheep';
  import { closeMenuTools } from '@/sheep/hooks/useModal';

  const show = computed(() => sheep.$store('modal').menu);

  function onClick(item) {
    closeMenuTools();
    if (item.url) sheep.$router.go(item.url);
  }

  const list = [
    {
      url: '/pages/index/index',
      icon: 'home',
      title: '首页',
    },
    {
      url: '/pages/index/search',
      icon: 'search',
      title: '搜索',
    },
    {
      url: '/pages/index/user',
      icon: 'person',
      title: '个人中心',
    },
    {
      url: '/pages/index/cart',
      icon: 'cart',
      title: '购物车',
    },
    {
      url: '/pages/user/goods-log',
      icon: 'eye',
      title: '浏览记录',
    },
    {
      url: '/pages/user/goods-collect',
      icon: 'heart',
      title: '我的收藏',
    },
    {
      url: '/pages/chat/index',
      icon: 'headphones',
      title: '客服',
    },
  ];
</script>

<style lang="scss" scoped>
  .tools-wrap {
    .title {
      font-size: 36rpx;
      font-weight: bold;
      color: var(--ui-TC, #303030);
    }

    .list-item {
      width: calc(25vw - 20rpx);

      .list-image {
        width: 104rpx;
        height: 104rpx;
        border-radius: 52rpx;
        background: var(--ui-BG-Main-opacity-1, rgba(0, 0, 0, 0.08));
        border: 1rpx solid var(--ui-BG-Main-opacity-1, rgba(0, 0, 0, 0.08));
      }

      .list-icon {
        line-height: 1;
      }

      .list-title {
        font-size: 26rpx;
        font-weight: 500;
        color: var(--ui-TC, #303030);
      }
    }
  }

  .uni-popup {
    top: 0 !important;
  }

  :deep(.button-hover) {
    background: var(--ui-BG-Main-opacity-1, rgba(0, 0, 0, 0.08)) !important;
  }
</style>
