<!-- 商品评论的卡片 -->
<template>
  <view class="detail-comment-card bg-white">
    <view class="card-header ss-flex ss-col-center ss-row-between">
      <view class="ss-flex ss-col-center">
        <view class="line"></view>
        <view class="title ss-m-l-20 ss-m-r-10">评价</view>
        <view class="des">({{ state.total }})</view>
      </view>
      <view
        class="ss-flex ss-col-center"
        @tap="sheep.$router.go('/pages/goods/comment/list', { id: goodsId })"
        v-if="state.commentList.length > 0"
      >
        <button class="ss-reset-button more-btn">查看全部</button>
        <text class="cicon-forward" />
      </view>
    </view>
    <!-- 评论列表 -->
    <view class="card-content">
      <view class="comment-box" v-for="item in state.commentList" :key="item.id">
        <comment-item :item="item" />
      </view>
      <s-empty
        v-if="state.commentList.length === 0"
        paddingTop="0"
        icon="/static/comment-empty.png"
        text="期待您的第一个评价"
      />
    </view>
  </view>
</template>

<script setup>
  import { reactive, onBeforeMount } from 'vue';
  import sheep from '@/sheep';
  import CommentApi from '@/sheep/api/product/comment';
  import commentItem from './comment-item.vue';

  const props = defineProps({
    goodsId: {
      type: [Number, String],
      default: 0,
    },
  });

  const state = reactive({
    commentList: [], // 评论列表，只展示最近的 3 条
    total: 0, // 总评论数
  });

  async function getComment(id) {
    const { data } = await CommentApi.getCommentPage(id, 1, 3, 0);
    state.commentList = data.list;
    state.total = data.total;
  }

  onBeforeMount(() => {
    getComment(props.goodsId);
  });
</script>

<style lang="scss" scoped>
  .detail-comment-card {
    margin: 0 32rpx 24rpx;
    padding: 28rpx 28rpx 0;
    border-radius: var(--lux-radius, 24rpx);
    .card-header {
      .line {
        width: 6rpx;
        height: 30rpx;
        background: linear-gradient(180deg, var(--ui-BG-Main) 0%, var(--ui-BG-Main-gradient) 100%);
        border-radius: 3rpx;
      }

      .title {
        font-size: 30rpx;
        font-weight: bold;
        line-height: normal;
        color: var(--ui-TC, #303030);
      }

      .des {
        font-size: 24rpx;
        color: var(--ui-TC-2, #777777);
      }

      .more-btn {
        font-size: 24rpx;
        color: var(--shop-accent-text, var(--ui-BG-Main));
        line-height: normal;
      }

      .cicon-forward {
        font-size: 24rpx;
        line-height: normal;
        color: var(--shop-accent-text, var(--ui-BG-Main));
        margin-top: 4rpx;
      }
    }
  }
  .comment-box {
    padding: 36rpx 0;
    border-bottom: 1px solid var(--ui-Border, #eeeeee);
    &:last-child {
      border: none;
    }
  }
</style>
