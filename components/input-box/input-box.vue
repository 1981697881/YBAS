<template>
	<view class="">
		<view class="input-box flex" :style="style">
			<text class="input-label" :class="{ required: required }" :style="[label.length == 2 ? labelStyle.w2 : label.length == 3 ? labelStyle.w3 : '']">
				{{ label }}
			</text>
			<view class="input-value flex-sub"><slot></slot></view>
		</view>
	</view>
</template>

<script>
export default {
	props: {
		label: '',
		required: false,
		style: '',
	},
	data() {
		return {
			labelStyle: {
				w2: {
					letterSpacing: '2em',
					marginRight: 'calc(-2em + 24rpx)'
				},
				w3: {
					letterSpacing: '0.5em',
					marginRight: 'calc(-0.5em + 24rpx)'
				}
			}
		};
	}
};
</script>

<style lang="scss">
/* 输入框容器样式 */
.input-box {
	margin-bottom: 40rpx;
	align-items: end;
	background-color: #ffffff;
	.input-label {
		position: relative;
		margin-right: 24rpx;
		min-width: 5em;
		padding-left: 30rpx;
		&::after {
			content: ':';
			position: absolute;
			// left: calc(4em + 2rpx);
			right: -10rpx;
		}
		&.required::before {
			content: '*';
			position: absolute;
			// left: -16rpx;
			left: 16rpx;
			color: red;
		}
	}
	.input-value {
		padding-right: 30rpx;
	}
}
</style>
