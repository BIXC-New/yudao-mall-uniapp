<!-- 订单详情 -->
<template>
  <s-layout title="订单详情" class="index-wrap" navbar="inner">
    <view
      class="state-box"
      :style="[
        {
          marginTop: '-' + Number(statusBarHeight + 88) + 'rpx',
          paddingTop: Number(statusBarHeight + 88) + 'rpx',
        },
      ]"
    >
      <view class="state-content">
        <view class="state-heading">
          <view class="state-mark" :class="{ 'is-closed': state.orderInfo.status === 40 }">
            <text v-if="state.orderInfo.status === 30" class="state-mark-check">✓</text>
            <text v-else-if="state.orderInfo.status === 40" class="state-mark-close">×</text>
            <text v-else class="state-mark-dot"></text>
          </view>
          <text class="state-title">{{ formatOrderStatus(state.orderInfo) }}</text>
        </view>
        <text class="state-description">
          {{ formatOrderStatusDescription(state.orderInfo) }}
        </text>

        <view v-if="statusProgress.length" class="status-progress">
          <view
            v-for="(step, index) in statusProgress"
            :key="step.label"
            class="progress-step"
            :class="{ 'is-done': step.done, 'is-current': step.current }"
          >
            <view class="progress-track" v-if="index < statusProgress.length - 1">
              <view class="progress-track-fill" v-if="step.done"></view>
            </view>
            <view class="progress-node">
              <text v-if="step.done">✓</text>
              <view v-else class="progress-node-dot"></view>
            </view>
            <text class="progress-label">{{ step.label }}</text>
          </view>
        </view>
      </view>
    </view>

    <!-- 收货地址 -->
    <view class="order-address-box" v-if="state.orderInfo.receiverAreaId > 0">
      <view class="ss-flex ss-col-center">
        <text class="address-username">
          {{ state.orderInfo.receiverName }}
        </text>
        <text class="address-phone">{{ state.orderInfo.receiverMobile }}</text>
      </view>
      <view class="address-detail">
        {{ state.orderInfo.receiverAreaName }} {{ state.orderInfo.receiverDetailAddress }}
      </view>
    </view>

    <view
      class="detail-goods"
      :style="[{ marginTop: state.orderInfo.receiverAreaId > 0 ? '0' : '-40rpx' }]"
    >
      <!-- 订单信 -->
      <view class="order-list" v-for="item in state.orderInfo.items" :key="item.goods_id">
        <view class="order-card">
          <s-goods-item
            @tap="onGoodsDetail(item.spuId)"
            :img="item.picUrl"
            :title="item.spuName"
            :skuText="item.properties.map((property) => property.valueName).join(' ')"
            :price="item.price"
            :num="item.count"
          >
            <template #tool>
              <view class="ss-flex">
                <button
                  class="ss-reset-button apply-btn"
                  v-if="[10, 20, 30].includes(state.orderInfo.status) && item.afterSaleStatus === 0"
                  @tap.stop="
                    sheep.$router.go('/pages/order/aftersale/apply', {
                      orderId: state.orderInfo.id,
                      itemId: item.id,
                    })
                  "
                >
                  申请售后
                </button>
                <button
                  class="ss-reset-button apply-btn"
                  v-if="item.afterSaleStatus === 10"
                  @tap.stop="
                    sheep.$router.go('/pages/order/aftersale/detail', {
                      id: item.afterSaleId,
                    })
                  "
                >
                  退款中
                </button>
                <button
                  class="ss-reset-button apply-btn"
                  v-if="item.afterSaleStatus === 20"
                  @tap.stop="
                    sheep.$router.go('/pages/order/aftersale/detail', {
                      id: item.afterSaleId,
                    })
                  "
                >
                  退款成功
                </button>
              </view>
            </template>
            <template #priceSuffix>
              <button class="ss-reset-button tag-btn" v-if="item.status_text">
                {{ item.status_text }}
              </button>
            </template>
          </s-goods-item>
        </view>
      </view>
    </view>

    <!--  自提核销  -->
    <PickUpVerify
      :order-info="state.orderInfo"
      :systemStore="systemStore"
      ref="pickUpVerifyRef"
    ></PickUpVerify>

    <!-- 订单信息 -->
    <view class="notice-box">
      <view class="notice-box__content">
        <view class="notice-item--center">
          <view class="ss-flex ss-flex-1">
            <text class="title">订单编号：</text>
            <text class="detail">{{ state.orderInfo.no }}</text>
          </view>
          <button class="ss-reset-button copy-btn" @tap="onCopy">复制</button>
        </view>
        <view class="notice-item">
          <text class="title">下单时间：</text>
          <text class="detail">
            {{ sheep.$helper.timeFormat(state.orderInfo.createTime, 'yyyy-mm-dd hh:MM:ss') }}
          </text>
        </view>
        <view class="notice-item" v-if="state.orderInfo.payTime">
          <text class="title">支付时间：</text>
          <text class="detail">
            {{ sheep.$helper.timeFormat(state.orderInfo.payTime, 'yyyy-mm-dd hh:MM:ss') }}
          </text>
        </view>
        <view class="notice-item">
          <text class="title">支付方式：</text>
          <text class="detail">{{ state.orderInfo.payChannelName || '-' }}</text>
        </view>
      </view>
    </view>

    <!-- 价格信息 -->
    <view class="order-price-box">
      <view class="notice-item ss-flex ss-row-between">
        <text class="title">商品总额</text>
        <view class="ss-flex">
          <text class="detail">￥{{ fen2yuan(state.orderInfo.totalPrice) }}</text>
        </view>
      </view>
      <view class="notice-item ss-flex ss-row-between">
        <text class="title">运费</text>
        <text class="detail">￥{{ fen2yuan(state.orderInfo.deliveryPrice) }}</text>
      </view>
      <view class="notice-item ss-flex ss-row-between" v-if="state.orderInfo.couponPrice > 0">
        <text class="title">优惠劵金额</text>
        <text class="detail">-¥{{ fen2yuan(state.orderInfo.couponPrice) }}</text>
      </view>
      <view class="notice-item ss-flex ss-row-between" v-if="state.orderInfo.pointPrice > 0">
        <text class="title">积分抵扣</text>
        <text class="detail">-¥{{ fen2yuan(state.orderInfo.pointPrice) }}</text>
      </view>
      <view class="notice-item ss-flex ss-row-between" v-if="state.orderInfo.discountPrice > 0">
        <text class="title">活动优惠</text>
        <text class="detail">¥{{ fen2yuan(state.orderInfo.discountPrice) }}</text>
      </view>
      <view class="notice-item ss-flex ss-row-between" v-if="state.orderInfo.vipPrice > 0">
        <text class="title">会员优惠</text>
        <text class="detail">-¥{{ fen2yuan(state.orderInfo.vipPrice) }}</text>
      </view>
      <view class="notice-item all-rpice-item ss-flex ss-m-t-20">
        <text class="title">{{ state.orderInfo.payStatus ? '已付款' : '需付款' }}</text>
        <text class="detail all-price">￥{{ fen2yuan(state.orderInfo.payPrice) }}</text>
      </view>
      <view
        class="notice-item all-rpice-item ss-flex ss-m-t-20"
        v-if="state.orderInfo.refundPrice > 0"
      >
        <text class="title">已退款</text>
        <text class="detail all-price">￥{{ fen2yuan(state.orderInfo.refundPrice) }}</text>
      </view>
    </view>

    <!-- 底部按钮 -->
    <!-- TODO: 查看物流、等待成团、评价完后返回页面没刷新页面 -->
    <su-fixed bottom placeholder bg="bg-white" v-if="state.orderInfo.buttons?.length">
      <view class="footer-box ss-flex ss-col-center ss-row-right">
        <button
          class="ss-reset-button cancel-btn"
          v-if="state.orderInfo.buttons?.includes('cancel')"
          @tap="onCancel(state.orderInfo.id)"
        >
          取消订单
        </button>
        <button
          class="ss-reset-button pay-btn ui-BG-Main-Gradient"
          v-if="state.orderInfo.buttons?.includes('pay')"
          @tap="onPay(state.orderInfo.payOrderId)"
        >
          继续支付
        </button>
        <button
          class="ss-reset-button cancel-btn"
          v-if="state.orderInfo.buttons?.includes('combination')"
          @tap="
            sheep.$router.go('/pages/activity/groupon/detail', {
              id: state.orderInfo.combinationRecordId,
            })
          "
        >
          拼团详情
        </button>
        <button
          class="ss-reset-button cancel-btn"
          v-if="state.orderInfo.buttons?.includes('express')"
          @tap="onExpress(state.orderInfo.id)"
        >
          查看物流
        </button>
        <button
          class="ss-reset-button cancel-btn"
          v-if="state.orderInfo.buttons?.includes('confirm')"
          @tap="onConfirm(state.orderInfo.id)"
        >
          确认收货
        </button>
        <button
          class="ss-reset-button cancel-btn"
          v-if="state.orderInfo.buttons?.includes('comment')"
          @tap="onComment(state.orderInfo.id)"
        >
          评价
        </button>
      </view>
    </su-fixed>
  </s-layout>
</template>

<script setup>
  import sheep from '@/sheep';
  import { onLoad, onShow } from '@dcloudio/uni-app';
  import { computed, reactive, ref, watch } from 'vue';
  import { isEmpty } from '@/sheep/helper/lodash';
  import {
    fen2yuan,
    formatOrderStatus,
    formatOrderStatusDescription,
    handleOrderButtons,
  } from '@/sheep/hooks/useGoods';
  import OrderApi from '@/sheep/api/trade/order';
  import DeliveryApi from '@/sheep/api/trade/delivery';
  import PayOrderApi from '@/sheep/api/pay/order';
  import PickUpVerify from '@/pages/order/pickUpVerify.vue';

  const statusBarHeight = sheep.$platform.device.statusBarHeight * 2;

  const state = reactive({
    orderInfo: {},
  });

  const statusProgress = computed(() => {
    const { status, deliveryType } = state.orderInfo;
    if (status === undefined || status === null || status === 40) {
      return [];
    }

    const currentIndex = status === 0 ? 0 : status === 10 ? 1 : status === 20 ? 2 : 3;
    const labels = [
      '待付款',
      deliveryType === 2 ? '待核销' : '待发货',
      '待收货',
      '已完成',
    ];
    return labels.map((label, index) => ({
      label,
      done: status === 30 || index < currentIndex,
      current: status !== 30 && index === currentIndex,
    }));
  });

  // ========== 门店自提（核销） ==========
  const systemStore = ref({}); // 门店信息

  // 复制
  const onCopy = () => {
    sheep.$helper.copyText(state.orderInfo.no);
  };

  // 去支付
  function onPay(payOrderId) {
    sheep.$router.go('/pages/pay/index', {
      id: payOrderId,
    });
  }

  // 查看商品
  function onGoodsDetail(id) {
    sheep.$router.go('/pages/goods/index', {
      id,
    });
  }

  // 取消订单
  async function onCancel(orderId) {
    uni.showModal({
      title: '提示',
      content: '确定要取消订单吗?',
      success: async function (res) {
        if (!res.confirm) {
          return;
        }
        const { code } = await OrderApi.cancelOrder(orderId);
        if (code === 0) {
          await getOrderDetail(orderId);
        }
      },
    });
  }

  // 查看物流
  async function onExpress(id) {
    sheep.$router.go('/pages/order/express/log', {
      id,
    });
  }

  // 确认收货
  async function onConfirm(orderId, ignore = false) {
    // 需开启确认收货组件
    // todo: 芋艿：【微信物流】待接入微信 https://gitee.com/sheepjs/shopro-uniapp/commit/a6bbba49b84dd418b84c5fefc8b7463df8f4901f
    // 1.怎么检测是否开启了发货组件功能？如果没有开启的话就不能在这里return出去
    // 2.如果开启了走mpConfirm方法,需要在App.vue的show方法中拿到确认收货结果
    let isOpenBusinessView = true;
    if (
      sheep.$platform.name === 'WechatMiniProgram' &&
      !isEmpty(state.orderInfo.wechat_extra_data) &&
      isOpenBusinessView &&
      !ignore
    ) {
      mpConfirm(orderId);
      return;
    }

    uni.showModal({
      title: '提示',
      content: '确认收货吗？',
      success: async function (res) {
        if (!res.confirm) {
          return;
        }
        // 正常的确认收货流程
        const { code } = await OrderApi.receiveOrder(orderId);
        if (code === 0) {
          await getOrderDetail(orderId);
        }
      },
    });
  }

  // #ifdef MP-WEIXIN
  // 小程序确认收货组件
  function mpConfirm(orderId) {
    if (!wx.openBusinessView) {
      sheep.$helper.toast(`请升级微信版本`);
      return;
    }
    wx.openBusinessView({
      businessType: 'weappOrderConfirm',
      extraData: {
        merchant_trade_no: state.orderInfo.wechat_extra_data.merchant_trade_no,
        transaction_id: state.orderInfo.wechat_extra_data.transaction_id,
      },
      success(response) {
        console.log('success:', response);
        if (response.errMsg === 'openBusinessView:ok') {
          if (response.extraData.status === 'success') {
            onConfirm(orderId, true);
          }
        }
      },
      fail(error) {
        console.log('error:', error);
      },
      complete(result) {
        console.log('result:', result);
      },
    });
  }

  // #endif

  // 评价
  function onComment(id) {
    sheep.$router.go('/pages/goods/comment/add', {
      id,
    });
  }

  const pickUpVerifyRef = ref();

  async function getOrderDetail(id) {
    // 对详情数据进行适配
    let res;
    if (state.comeinType === 'wechat') {
      // TODO 芋艿：【微信物流】微信场景下
      res = await OrderApi.getOrderDetail(id, {
        merchant_trade_no: state.merchantTradeNo,
      });
    } else {
      res = await OrderApi.getOrderDetail(id);
    }
    if (res.code === 0) {
      state.orderInfo = res.data;
      handleOrderButtons(state.orderInfo);
      // 配送方式：门店自提
      if (res.data.pickUpStoreId) {
        const { data } = await DeliveryApi.getDeliveryPickUpStore(res.data.pickUpStoreId);
        systemStore.value = data || {};
      }
      if (state.orderInfo.deliveryType === 2 && state.orderInfo.payStatus) {
        pickUpVerifyRef.value && pickUpVerifyRef.value.markCode(res.data.pickUpVerifyCode);
      }
    } else {
      sheep.$router.back();
    }
  }

  onShow(async () => {
    // onShow 中获取订单列表,保证跳转后页面为最新状态
    // 有几率在 onLoad 完成 state.orderInfo.id 赋值前进入 onShow
    if (state.orderInfo.id) {
      await getOrderDetail(state.orderInfo.id);
    }
  });

  onLoad(async (options) => {
    let id = 0;
    if (options.id) {
      id = options.id;
    }
    // 场景：例如说“微信小程序购物订单”
    // https://developers.weixin.qq.com/miniprogram/dev/platform-capabilities/business-capabilities/order_center/order_center.html
    // （小程序商品订单详情 path）配置参考：pages/order/detail?payOrderNo=${商品订单号} 。其中：${商品订单号} out_trade_no 为 payOrderNo
    if (!id && options.payOrderNo) {
      // 查询支付订单：根据 payOrderNo 取 merchantOrderId ，merchantOrderId 即 tradeOrderId
      const payOrder = await PayOrderApi.getOrder(undefined, undefined, options.payOrderNo);
      if (payOrder.code === 0) {
        id = payOrder.data?.merchantOrderId;
      }
    }
    state.orderInfo.id = id;
    // 完成 state.orderInfo.id 赋值后加载一次detail，但有几率与 onShow 重复可能导致 detail 会加载两次。
    await getOrderDetail(state.orderInfo.id);
  });
</script>

<style lang="scss" scoped>
  .score-img {
    width: 36rpx;
    height: 36rpx;
    margin: 0 4rpx;
  }

  .apply-btn {
    width: 140rpx;
    height: 50rpx;
    border-radius: 25rpx;
    font-size: 24rpx;
    border: 2rpx solid var(--shop-accent-text, var(--ui-BG-Main));
    background: var(--ui-BG-Main-opacity-1, transparent);
    color: var(--shop-accent-text, var(--ui-BG-Main));
    line-height: normal;
    margin-left: 16rpx;
  }

  .state-box {
    color: var(--ui-BG-Main-TC, #ffffff);
    width: 100%;
    background: linear-gradient(90deg, var(--ui-BG-Main), var(--ui-BG-Main-gradient));
    background-size: 750rpx 100%;
    box-sizing: border-box;

    .state-content {
      padding: 28rpx 32rpx 70rpx;
      text-align: center;
    }

    .state-heading {
      position: relative;
      display: flex;
      align-items: center;
      justify-content: center;
      min-height: 56rpx;
    }

    .state-mark {
      position: absolute;
      right: calc(50% + 74rpx);
      width: 42rpx;
      height: 42rpx;
      display: flex;
      align-items: center;
      justify-content: center;
      flex: none;
      border-radius: 50%;
      background: rgba(255, 255, 255, 0.16);
      font-size: 32rpx;
      font-weight: 600;
      line-height: 1;
    }

    .state-mark.is-closed {
      background: rgba(255, 255, 255, 0.12);
    }

    .state-mark-check {
      font-size: 28rpx;
    }

    .state-mark-close {
      font-size: 36rpx;
      font-weight: 400;
    }

    .state-mark-dot,
    .progress-node-dot {
      width: 12rpx;
      height: 12rpx;
      border-radius: 50%;
      background: currentColor;
    }

    .state-title {
      font-size: 34rpx;
      font-weight: 600;
      line-height: 1.4;
    }

    .state-description {
      display: block;
      max-width: 620rpx;
      margin: 8rpx auto 0;
      font-size: 24rpx;
      line-height: 1.5;
      opacity: 0.86;
      overflow-wrap: anywhere;
    }

    .status-progress {
      display: grid;
      grid-template-columns: repeat(4, minmax(0, 1fr));
      margin: 30rpx auto 0;
      max-width: 650rpx;
    }

    .progress-step {
      position: relative;
      display: flex;
      min-width: 0;
      flex-direction: column;
      align-items: center;
      color: inherit;
      opacity: 0.55;
    }

    .progress-step.is-done,
    .progress-step.is-current {
      opacity: 1;
    }

    .progress-track {
      position: absolute;
      z-index: 0;
      top: 11rpx;
      left: 50%;
      width: 100%;
      height: 2rpx;
      background: currentColor;
      opacity: 0.3;
    }

    .progress-track-fill {
      width: 100%;
      height: 100%;
      background: currentColor;
      opacity: 1;
    }

    .progress-node {
      position: relative;
      z-index: 1;
      display: flex;
      width: 24rpx;
      height: 24rpx;
      align-items: center;
      justify-content: center;
      border: 2rpx solid currentColor;
      border-radius: 50%;
      box-sizing: border-box;
      background: var(--ui-BG-Main, #27231e);
      font-size: 16rpx;
      font-weight: 700;
      line-height: 1;
    }

    .is-done .progress-node {
      color: var(--ui-BG-Main, #27231e);
      border-color: currentColor;
      background: var(--ui-BG-Main-TC, #ffffff);
    }

    .progress-label {
      margin-top: 10rpx;
      font-size: 20rpx;
      line-height: 1.35;
      white-space: nowrap;
    }
  }

  .order-address-box {
    background-color: var(--ui-BG, #fff);
    border-radius: 10rpx;
    margin: -50rpx 20rpx 16rpx 20rpx;
    padding: 44rpx 34rpx 42rpx 20rpx;
    font-size: 30rpx;
    box-sizing: border-box;
    font-weight: 500;
    color: var(--ui-TC);

    .address-username {
      margin-right: 20rpx;
    }

    .address-detail {
      font-size: 26rpx;
      font-weight: 500;
      color: var(--ui-TC-2);
      margin-top: 20rpx;
    }
  }

  .detail-goods {
    border-radius: 10rpx;
    margin: 0 20rpx 20rpx 20rpx;

    .order-list {
      margin-bottom: 20rpx;
      background-color: var(--ui-BG, #fff);

      .order-card {
        padding: 20rpx 0;

        .order-sku {
          font-size: 24rpx;

          font-weight: 400;
          color: var(--ui-TC-2);
          width: 450rpx;
          margin-bottom: 20rpx;

          .order-num {
            margin-right: 10rpx;
          }
        }

        .tag-btn {
          margin-left: 16rpx;
          font-size: 24rpx;
          height: 36rpx;
          color: var(--shop-accent-text, var(--ui-BG-Main));
          border: 2rpx solid var(--shop-accent-text, var(--ui-BG-Main));
          border-radius: 14rpx;
          padding: 0 4rpx;
        }
      }
    }
  }

  // 订单信息。
  .notice-box {
    background: var(--ui-BG, #fff);
    border-radius: 10rpx;
    margin: 0 20rpx 20rpx 20rpx;

    .notice-box__head {
      font-size: 30rpx;

      font-weight: 500;
      color: var(--ui-TC);
      line-height: 80rpx;
      border-bottom: 1rpx solid var(--ui-Border, #dfdfdf);
      padding: 0 25rpx;
    }

    .notice-box__content {
      padding: 20rpx;

      .self-pickup-box {
        width: 100%;

        .self-pickup--img {
          width: 200rpx;
          height: 200rpx;
          margin: 40rpx 0;
        }
      }
    }

    .notice-item,
    .notice-item--center {
      display: flex;
      align-items: center;
      line-height: normal;
      margin-bottom: 24rpx;

      .title {
        font-size: 28rpx;
        color: var(--ui-TC-2, #777777);
      }

      .detail {
        font-size: 28rpx;
        color: var(--ui-TC, #303030);
        flex: 1;
      }
    }
  }

  .copy-btn {
    width: 100rpx;
    line-height: 50rpx;
    border-radius: 25rpx;
    padding: 0;
    background: var(--ui-BG-2, #eeeeee);
    font-size: 22rpx;
    font-weight: 400;
    color: var(--ui-TC);
  }

  // 订单价格信息
  .order-price-box {
    background-color: var(--ui-BG, #fff);
    border-radius: 10rpx;
    padding: 20rpx;
    margin: 0 20rpx 20rpx 20rpx;

    .notice-item {
      line-height: 70rpx;

      .title {
        font-size: 28rpx;
        color: var(--ui-TC-2, #777777);
      }

      .detail {
        font-size: 28rpx;
        color: var(--shop-price, var(--shop-accent-text, var(--ui-TC, #303030)));
        font-family: OPPOSANS;
      }
    }

    .all-rpice-item {
      justify-content: flex-end;
      align-items: center;

      .title {
        font-size: 26rpx;
        font-weight: 500;
        color: var(--ui-TC, #303030);
        line-height: normal;
      }

      .all-price {
        font-size: 26rpx;
        font-family: OPPOSANS;
        line-height: normal;
        color: var(--shop-price, var(--shop-accent-text, var(--ui-BG-Main)));
      }
    }
  }

  // 底部
  .footer-box {
    height: 100rpx;
    width: 100%;
    box-sizing: border-box;
    border-radius: 10rpx;
    padding-right: 20rpx;

    .cancel-btn {
      width: 160rpx;
      height: 60rpx;
      background: var(--ui-BG-2, #eeeeee);
      border-radius: 30rpx;
      margin-right: 20rpx;
      font-size: 26rpx;
      font-weight: 400;
      color: var(--ui-TC, #303030);
    }

    .pay-btn {
      width: 160rpx;
      height: 60rpx;
      font-size: 26rpx;
      border-radius: 30rpx;
      font-weight: 500;
      color: var(--ui-BG-Main-TC, #ffffff);
    }
  }
</style>
