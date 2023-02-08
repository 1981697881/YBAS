<template>
	<!-- 弹出层 -->
	<view class="share">
		<view :class="{ 'share-box': show }" @click="$emit('close', !maskClose)"></view>
		<view class="share-item flex flex-direction" :class="{ 'share-show': show }">
			<view class="title" v-if="title">
				<view class="flex align-center">
					<view class="title-lt" @click="$emit('ltClick')">
						<slot name="title-left"><text class="text-blue" @click.stop="$emit('close', false)">关闭</text></slot>
					</view>
					<text class="flex-sub" style="font-weight: bold;">{{ title }}</text>
					<view class="title-rt" @click="$emit('rtClick')"><slot name="title-right"></slot></view>
				</view>
				<view class="footer">
					<slot name="title-footer"></slot>
				</view>
			</view>
			
			<view class="content flex-sub"><slot></slot></view>
			<slot name="footer"></slot>
			<!-- <view class="cancel" @click.stop="$emit('close', false)"><text>取消</text></view> -->
		</view>
	</view>
</template>

<script>
export default {
	props: {
		show: {
			type: Boolean,
			default: false,
			require: true
		},
		title: {
			type: String,
			default: ''
		},
		// 点击遮罩层是否可以关闭
		maskClose: {
			type: Boolean,
			default: true
		},
	}
};
</script>

<style lang="scss">
.share {
	width: 100%;
	height: 100%;
}
.share-box {
	width: 100%;
	height: 100%;
	position: fixed;
	top: 0rpx;
	left: 0rpx;
	bottom: 0rpx;
	right: 0rpx;
	background-color: rgba(0, 0, 0, 0.4);
	transition: 0.3s;
	z-index: 999;
}
// 进入动画
.share-show {
	transition: all 0.3s ease;
	transform: translateY(0%) !important;
}
// 离开动画
.share-item {
	position: fixed;
	left: 0;
	bottom: 0;
	width: 100%;
	height: auto;
	max-height: 90vh;
	background-color: #ffffff;
	transition: all 0.3s ease;
	transform: translateY(100%);
	z-index: 1999;
	.title {
		padding: 24rpx 32rpx;
	}
	.content {
		// padding: 32rpx 32rpx;
		overflow: scroll;
	}
	.title {
		// font-weight: bold;
		text-align: center;
		border-bottom: 1rpx solid #e4e7ed;
		&-rt {
			position: absolute;
			right: 32rpx;
		}
		&-lt {
			position: absolute;
			left: 32rpx;
		}
		& > .footer{
			
		}
	}
}
</style>
