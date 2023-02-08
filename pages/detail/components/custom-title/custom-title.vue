<template>
	<view class="custom-title-warpper flex">
		<text class="custom-title-title text-bold">{{ title }}</text>
		<view class="custom-title-right flex-sub text-right">
			<slot></slot>
		</view>
	</view>
</template>
<script>
export default {
	props: {
		title: ''
	},
	data() {
		return {};
	},
	mounted() {},
	methods: {}
};
</script>

<style lang="scss" scoped>
.custom-title {
	&-warpper {
		padding: 16rpx 15rpx;
		padding-right: 30rpx;
	}
	&-title{
		padding-left: calc(15rpx - 4rpx);
		border-left: 4rpx #0081ff solid;
	}
}
</style>
