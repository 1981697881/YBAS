<template>
	<!-- 列表项分页器start -->
	<view class="flex text-center">
		<uni-icons class="flex-sub" type="arrowleft" @click="handlePageChange('prev')"></uni-icons>
		<text class="">{{ page+1 }}/{{ total }}</text>
		<uni-icons class="flex-sub" type="arrowright" @click="handlePageChange('next')"></uni-icons>
	</view>
	<!-- 列表项分页器end -->
</template>
<script>
export default {
	props: {
		page: 0,
		total: 0
	},
	data() {
		return {};
	},
	mounted() {},
	methods: {
		// 监听切换页
		/**
		 * @param {Object} action 上一页/下一页
		 */
		handlePageChange(action) {
			if (action === 'prev') {
				// 上一页
				if (this.page > 0) {
					
					this.$emit('onChange',this.page-1)
				}
			} else if (action === 'next') {
				// 下一页
				if (this.page < this.total - 1) {
					
					this.$emit('onChange',this.page+1)
				}
			}
		},
	}
};
</script>

<style lang="scss" scoped>
</style>
