<template>
	<view>
		<cell-box label="维修单号" :value="fixCode"></cell-box>
		<cell-box label="总费用" :value="formData.totalPrice | rmb"></cell-box>
		<cell-box label="付款状态">
			<template slot="value">
				<view @click="doPay">
					<text class="text-grey">{{ formData.payStatus | filterPayStatus }}</text>
					<view v-if="!isPayStatus" class="text-blue" :style="{ 'margin-top': !isPayStatus ? '16rpx' : '' }"><text>去支付</text></view>
				</view>
			</template>
		</cell-box>

		<!-- 分页器start -->
		<cell-box style="margin-top: 30rpx;">
			<template slot="value">
				<view class="flex align-center">
					<uni-icons class="flex-sub text-center" type="arrowleft" @click="handlePageChange('prev', 'currentPage', formData.list.length)"></uni-icons>
					<text class="">{{ currentPage + 1 }}/{{ formData.list.length }}</text>
					<uni-icons class="flex-sub text-center" type="arrowright" @click="handlePageChange('next', 'currentPage', formData.list.length)"></uni-icons>
				</view>
			</template>
		</cell-box>
		<!-- 分页器end -->

		<!-- 产品列表start -->
		<cell-box label="产品条码" :value="proData.barCode"></cell-box>
		<cell-box label="产品名称" :value="proData.name"></cell-box>
		<cell-box label="产品型号" :value="proData.model"></cell-box>
		<cell-box label="维修意见" :value="proData.fixIdea"></cell-box>
		<cell-box label="配件费用" :value="proData.componentPrice | rmb">
			<template slot="value">
				<view @click="handleShare(true)">
					<text class="text-grey">{{ proData.componentPrice | rmb }}</text>
					<view class="text-blue" :style="{ 'margin-top': !isPayStatus ? '16rpx' : '' }"><text>查看配件清单</text></view>
				</view>
			</template>
		</cell-box>
		<cell-box label="工时费" :value="proData.workPrice | rmb"></cell-box>
		<cell-box label="运费" :value="proData.freight | rmb"></cell-box>
		<cell-box label="优惠后价格" :value="proData.discountPrice | rmb"></cell-box>
		<!-- 产品列表end -->

		<!--配件清单弹出层start -->
		<custom-share :show="shareStatus" title="配件清单" @close="handleShare">
			<view class="" style="padding: 30rpx 0;">
				<input-box label="零件编码"></input-box>
				<input-box label="零件名称"></input-box>
				<input-box label="版本号"></input-box>
				<input-box label="销售价格"></input-box>
				<!-- 配件清单分页器start -->
				<view class="flex align-center">
					<uni-icons class="flex-sub text-center" type="arrowleft" @click="handlePageChange('prev', 'componentCurrentPage', proData.componentList.length)"></uni-icons>
					<text class="">{{ componentCurrentPage + 1 }}/{{ proData.componentList.length }}</text>
					<uni-icons class="flex-sub text-center" type="arrowright" @click="handlePageChange('next', 'componentCurrentPage', proData.componentList.length)"></uni-icons>
				</view>
				<!-- 配件清单分页器end -->
			</view>
		</custom-share>
		<!-- 配件清单弹出层end -->
	</view>
</template>

<script>
import cellBox from './components/cell-box';

export default {
	components: {
		cellBox,
		
	},
	data() {
		return {
			fixCode: '',
			formData: {
				totalPrice: 0,
				payStatus: 0,
				list: [
					{
						barCode: '',
						name: '',
						model: '',
						fixIdea: '',
						componentPrice: 0,
						componentList: [
							{
								componentCode: '',
								componentName: '',
								componentVersion: '',
								salesPrice: 0
							}
						],
						workPrice: 0,
						freight: 0,
						discountPrice: 0
					}
				]
			},
			currentPage: 0,
			componentCurrentPage: 0,
			shareStatus: false
		};
	},
	computed: {
		// 该维修单是否已支付，传入当前维修单的data；0 未支付。1 已支付
		isPayStatus() {
			return this.formData.payStatus == 1;
		},
		proData() {
			return this.formData.list[this.currentPage];
		}
	},
	filters: {
		filterPayStatus: dataValue => ['未支付', '已支付'][dataValue],
		rmb(value) {
			if (value || value === 0) {
				const num = (value * 1).toFixed(2);
				return `￥${num}`;
			} else {
				return '';
			}
		}
	},
	watch: {},
	created() {
	},
	mounted() {
		// 使用computed失效，手动给fixCode赋值
		this.fixCode =  this.$Route.query.fixCode;
	},
	methods: {
		// 支付维修费用
		doPay(item) {
			if (!this.isPayStatus) {
				// ...
				uni.showToast({
					title: '支付成功',
					mask: true,
					icon: 'none',
					duration: 1500
				});
			}
		},
		// 弹出层显示
		handleShare(value, action) {
			this.shareStatus = value;
		},
		// 监听切换页
		/**
		 * @param {Object} action 上一页/下一页
		 */
		handlePageChange(action, pageKey = 'currentPage', maxPage) {
			console.log(pageKey)
			let page = this[pageKey];
			if (action === 'prev') {
				// 上一页
				this[pageKey] = page > 0 ? page - 1 : page;
			} else if (action === 'next') {
				// 下一页 
				this[pageKey] = page < maxPage - 1 ? page + 1 : page;
			}
			console.log(typeof this[pageKey])
		},
		getList(){
		},
	}
};
</script>

<style lang="scss" scoped></style>
