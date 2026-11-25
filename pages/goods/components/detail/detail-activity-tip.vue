<template>
  <view class="activity-list detail-card">
      <view v-for="activity in props.activityList" :key="`${activity.type}-${activity.id}`">
        <view
          class="activity-box ss-p-x-38 ss-flex ss-row-between ss-col-center"
          :class="activity.type === 1 ? 'seckill-box' : 'groupon-box'"
        >
          <view class="activity-title ss-flex">
            <view class="ss-m-r-16">
              <image
                v-if="activity.type === 1"
                :src="sheep.$url.static('/static/img/shop/goods/seckill-icon.png')"
                class="activity-icon"
              />
              <image
                v-else-if="activity.type === 3"
                :src="sheep.$url.static('/static/img/shop/goods/groupon-icon.png')"
                class="activity-icon"
              />
            </view>
            <view>该商品正在参与{{ activity.name }}活动</view>
          </view>
          <button v-if="[1, 3].includes(activity.type)" class="ss-reset-button activity-go" @tap="onActivity(activity)">查看</button>
        </view>
      </view>
  </view>
</template>

<script setup>
  import sheep from '@/sheep';


  const props = defineProps({
    activityList: {
      type: Array,
      default() {
        return [];
      },
    },
  });

  function onActivity(activity) {
    const type = activity.type;
    const typePath = type === 1 ? 'seckill' : type === 3 ? 'groupon' : undefined;
    if (!typePath) {
      return;
    }
    sheep.$router.go(`/pages/goods/${typePath}`, {
      id: activity.id,
    });
  }
</script>

<style lang="scss" scoped>
  .activity-list {
    padding: 12rpx 20rpx;
    border-radius: 10rpx;
    margin: 14rpx 20rpx;
  }

  .activity-box {
    width: 100%;
    min-height: 72rpx;
    box-sizing: border-box;
    gap: 16rpx;
    padding: 12rpx 0;
    border-bottom: 1px solid var(--ui-Border);

    &:last-child { border-bottom: 0; }

    .activity-title {
      flex: 1;
      min-width: 0;
      font-size: 26rpx;
      font-weight: 500;
      color: var(--ui-TC);
      line-height: 1.45;

      .activity-icon {
        width: 38rpx;
        height: 38rpx;
      }
    }

    .activity-go {
      width: 70rpx;
      height: 48rpx;
      flex: 0 0 70rpx;
      background: var(--ui-BG-Main);
      border-radius: 16rpx;
      font-weight: 500;
      color: var(--ui-BG-Main-TC);
      font-size: 24rpx;
      line-height: normal;
    }
  }

</style>
