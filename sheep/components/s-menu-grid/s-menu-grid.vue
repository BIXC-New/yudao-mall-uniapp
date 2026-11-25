<!-- 装修基础组件：宫格导航 -->
<template>
  <view :style="[bgStyle, { marginLeft: `${data.space}px` }]">
    <view class="menu-grid" :class="{ 'menu-grid--border': data.border }">
      <view
        v-for="(item, index) in data.list"
        :key="index"
        class="menu-grid-item"
        :style="gridItemStyle"
      >
        <view
          class="grid-item-box ss-flex ss-flex-col ss-row-center ss-col-center"
          @tap="sheep.$router.go(item.url)"
        >
          <view class="img-box">
            <view
              class="tag-box"
              v-if="item.badge?.show"
              :style="[{ background: item.badge.bgColor, color: item.badge.textColor }]"
            >
              {{ item.badge.text }}
            </view>
            <uni-icons
              v-if="getThemeIcon(item.iconUrl)"
              :type="getThemeIcon(item.iconUrl)"
              size="24"
              color="var(--shop-accent-text)"
            />
            <image v-else class="menu-image" :src="sheep.$url.cdn(item.iconUrl)"></image>
          </view>

          <view class="title-box ss-flex ss-flex-col ss-row-center ss-col-center">
            <view class="grid-text" :style="[{ color: item.titleColor }]">
              {{ item.title }}
            </view>
            <view v-if="item.subtitle" class="grid-tip" :style="[{ color: item.subtitleColor }]">
              {{ item.subtitle }}
            </view>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup>
  import sheep from '@/sheep';
  import { getThemeIcon } from '@/sheep/theme';
  import { computed } from 'vue';

  const props = defineProps({
    // 装修数据
    data: {
      type: Object,
      default: () => ({}),
    },
    // 装修样式
    styles: {
      type: Object,
      default: () => ({}),
    },
  });
  // 按容器比例分列，避免挂载时测量的像素宽度在窗口缩放后失效。
  const gridItemStyle = computed(() => {
    const column = Math.max(1, Math.floor(Number(props.data.column) || 4));
    return { width: `${100 / column}%` };
  });

  // 设置背景样式
  const bgStyle = computed(() => {
    // 直接从 props.styles 解构
    const { bgType, bgImg, bgColor } = props.styles;

    // 根据 bgType 返回相应的样式
    return {
      background: bgType === 'img' ? `url(${bgImg}) no-repeat top center / 100% 100%` : bgColor,
    };
  });
</script>

<style lang="scss" scoped>
  .menu-grid {
    display: flex;
    flex-wrap: wrap;
    width: 100%;
    box-sizing: border-box;
  }

  .menu-grid-item {
    flex-shrink: 0;
    min-width: 0;
    box-sizing: border-box;
  }

  .menu-grid--border {
    border-top: 1px solid var(--ui-Line, #d2d2d2);
    border-left: 1px solid var(--ui-Line, #d2d2d2);

    .menu-grid-item {
      border-right: 1px solid var(--ui-Line, #d2d2d2);
      border-bottom: 1px solid var(--ui-Line, #d2d2d2);
    }
  }

  .menu-image {
    width: 24px;
    height: 24px;
  }

  .grid-item-box {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-height: 88px;
    padding: 16px 4px;
    box-sizing: border-box;

    .img-box {
      position: relative;

      .tag-box {
        position: absolute;
        z-index: 2;
        top: 0;
        right: 0;
        font-size: 2em;
        line-height: 1;
        padding: 0.4em 0.6em 0.3em;
        transform: scale(0.4) translateX(0.5em) translatey(-0.6em);
        transform-origin: 100% 0;
        border-radius: 200rpx;
        white-space: nowrap;
      }
    }

    .title-box {
      width: 100%;
      min-width: 0;
      margin-top: 8px;

      .grid-text,
      .grid-tip {
        max-width: 100%;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }

      .grid-text {
        font-size: 26rpx;
        line-height: 1.5;
      }

      .grid-tip {
        font-size: 24rpx;
        white-space: nowrap;
        text-align: center;
      }
    }
  }
</style>
