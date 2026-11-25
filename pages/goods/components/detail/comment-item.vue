<!-- 商品评论项 -->
<template>
  <view class="comment-item">
    <!-- 用户评论 -->
    <view class="comment-author">
      <view class="avatar-box">
        <image
          v-if="item.userAvatar && !avatarFailed"
          class="avatar"
          :src="item.userAvatar"
          mode="aspectFill"
          @error="avatarFailed = true"
        />
        <uni-icons v-else type="person" size="20" color="var(--ui-TC-2, #777777)" />
      </view>
      <view class="author-info">
        <view class="nickname">{{ item.userNickname || '匿名用户' }}</view>
        <uni-rate
          :readonly="true"
          :touchable="false"
          :value="Number(item.scores) || 0"
          :size="14"
          :margin="3"
          active-color="var(--shop-accent-text, var(--ui-BG-Main))"
          color="var(--ui-TC-3, #9e9e9e)"
        />
      </view>
    </view>
    <view v-if="item.content" class="content">{{ item.content }}</view>
    <view class="comment-pictures" v-if="item.picUrls?.length">
      <scroll-view class="scroll-box" scroll-x scroll-anchoring>
        <view class="ss-flex">
          <view v-for="(picUrl, index) in item.picUrls" :key="picUrl" class="picture-item">
            <su-image
              class="content-img"
              isPreview
              :previewList="item.picUrls"
              :current="index"
              :src="picUrl"
              :height="144"
              :width="144"
              mode="aspectFill"
            />
          </view>
        </view>
      </scroll-view>
    </view>
    <!-- 商家回复 -->
    <view class="reply-box" v-if="item.replyTime && item.replyContent">
      <view class="reply-title">商家回复</view>
      <view class="reply-content">{{ item.replyContent }}</view>
    </view>
  </view>
</template>

<script setup>
  import { ref, watch } from 'vue';

  const props = defineProps({
    item: {
      type: Object,
      default() {},
    },
  });
  const avatarFailed = ref(false);
  watch(() => props.item.userAvatar, () => {
    avatarFailed.value = false;
  });
</script>

<style lang="scss" scoped>
  .comment-item {
    min-width: 0;
    color: var(--ui-TC, #303030);
  }

  .comment-author {
    display: flex;
    align-items: center;
  }

  .avatar-box {
    display: flex;
    align-items: center;
    justify-content: center;
    flex: 0 0 72rpx;
    width: 72rpx;
    height: 72rpx;
    margin-right: 20rpx;
    background: var(--ui-BG-2, #f1f1f1);
    border-radius: 50%;
    overflow: hidden;
  }

  .avatar {
    width: 100%;
    height: 100%;
  }

  .author-info {
    flex: 1;
    min-width: 0;
  }

  .nickname {
    margin-bottom: 6rpx;
    font-size: 28rpx;
    font-weight: 500;
    line-height: 1.4;
    color: var(--ui-TC, #303030);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .content {
    margin-top: 24rpx;
    font-size: 28rpx;
    font-weight: 400;
    line-height: 1.65;
    white-space: pre-wrap;
    overflow-wrap: break-word;
    color: var(--ui-TC, #303030);
  }

  .reply-box {
    margin-top: 24rpx;
    background: var(--ui-BG-1, #f6f6f6);
    border-radius: 16rpx;
    padding: 24rpx;
  }

  .reply-title {
    margin-bottom: 8rpx;
    font-weight: 500;
    font-size: 24rpx;
    line-height: 1.5;
    color: var(--ui-TC-2, #777777);
  }

  .reply-content {
    font-weight: 400;
    font-size: 26rpx;
    line-height: 1.65;
    white-space: pre-wrap;
    overflow-wrap: break-word;
    color: var(--ui-TC, #303030);
  }

  .comment-pictures {
    margin-top: 24rpx;
  }

  .scroll-box {
    width: 100%;
  }

  .picture-item {
    flex-shrink: 0;
    margin-right: 16rpx;
    border-radius: 12rpx;
    overflow: hidden;
  }
</style>
