<!-- 分销商信息  -->
<template>
	<!-- 用户资料 -->
	<view class="user-card ss-flex ss-col-bottom">
		<view class="card-top ss-flex ss-row-between">
			<view class="ss-flex">
				<view class="head-img-box">
					<image class="head-img" :src="sheep.$url.cdn(userInfo.avatar)" mode="aspectFill"></image>
				</view>
				<view class="ss-flex-col">
					<view class="user-name">{{ userInfo.nickname }}</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script setup>
	import sheep from '@/sheep';
	import { computed } from 'vue';

	const userInfo = computed(() => sheep.$store('user').userInfo);
</script>

<style lang="scss" scoped>
	// 用户资料卡片
	.user-card {
		width: 700rpx;
		height: 192rpx;
		margin: 0 auto;
		margin-top: -88rpx;
		padding-top: 88rpx;
		background: var(--ui-BG-1);

		.head-img-box {
			margin-right: 20rpx;
			width: 100rpx;
			height: 100rpx;
			border-radius: 50%;
			position: relative;
			background: var(--ui-BG-3);

			.head-img {
				width: 92rpx;
				height: 92rpx;
				border-radius: 50%;
				position: absolute;
				top: 50%;
				left: 50%;
				transform: translate(-50%, -50%);
			}
		}

		.card-top {
			box-sizing: border-box;
			padding-bottom: 34rpx;

			.user-name {
				font-size: 32rpx;
				font-weight: bold;
				color: var(--ui-TC);
				line-height: 30rpx;
				margin-bottom: 20rpx;
			}

			.log-btn {
				width: 84rpx;
				height: 42rpx;
				border: 2rpx solid rgba(#ffffff, 0.33);
				border-radius: 21rpx;
				font-size: 22rpx;
				font-weight: 400;
				color: #ffffff;
				margin-bottom: 20rpx;
			}

			.look-btn {
				color: #fff;
				width: 40rpx;
				height: 40rpx;
			}
		}

		.user-info-box {
			.tag-box {
				background: var(--ui-BG-Main);
				border-radius: 18rpx;
				line-height: 36rpx;

				.tag-img {
					width: 36rpx;
					height: 36rpx;
					border-radius: 50%;
					margin-left: -2rpx;
				}

				.tag-title {
					font-size: 24rpx;
					padding: 0 10rpx;
					font-weight: 500;
					line-height: 36rpx;
					color: var(--ui-BG-Main-TC);
				}
			}
		}
	}
</style>
