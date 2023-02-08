<template>
	<view>
		<cell-box label="维修单号" :value="formData.repairOrder"></cell-box>
		<cell-box label="总费用" :value="formData.payPrice | rmb"></cell-box>
		<cell-box label="付款状态">
			<template slot="value">
				<view>
					<text class="text-grey">{{ formData.payStatus | filterPayStatus }}</text>
					<!-- <view @click="doPay" v-if="isPayStatus" class="text-blue" :style="{ 'margin-top': !isPayStatus ? '16rpx' : '' }"><text>去支付</text></view> -->
				</view>
			</template>
		</cell-box>
		<!-- 分页器start -->
		<cell-box style="margin-top: 30rpx;" v-if="formData.repairDetailList.length>0">
			<template slot="value">
				<view class="flex align-center">
					<uni-icons class="flex-sub text-center" type="arrowleft" @click="handlePageChange('prev', 'currentPage', formData.repairDetailList.length)"></uni-icons>
					<text class="">{{ currentPage + 1 }}/{{ formData.repairDetailList.length }}</text>
					<uni-icons class="flex-sub text-center" type="arrowright" @click="handlePageChange('next', 'currentPage', formData.repairDetailList.length)"></uni-icons>
				</view>
			</template>
		</cell-box>
		<!-- 分页器end -->
		<block v-for="(item, index) in formData.repairDetailList" :key="index" v-if="currentPage == index">
		<!-- 产品列表start -->
		<cell-box label="产品条码" :value="proData.productCode"></cell-box>
		<cell-box label="产品名称" :value="proData.productName"></cell-box>
		<cell-box label="产品型号" :value="proData.productModel"></cell-box>
		<cell-box label="维修意见" :value="proData.repairOpinion"></cell-box>
		<cell-box label="配件费用" :value="proData.partsMoney | rmb">
			<template slot="value">
				<view @click="handleShare(true)">
					<text class="text-grey">{{ proData.partsMoney | rmb }}</text>
					<view class="text-blue" :style="{ 'margin-top': !isPayStatus ? '16rpx' : '' }"><text>查看配件清单</text></view>
				</view>
			</template>
		</cell-box>
		<cell-box label="工时费" :value="proData.workMoney | rmb"></cell-box>
		<cell-box label="运费" :value="proData.freight | rmb"></cell-box>
		<cell-box label="实收金额" :value="proData.discountMoney | rmb"></cell-box>
		<!-- 产品列表end -->
		</block>
		<!--配件清单弹出层start -->
		<custom-share :show="shareStatus" title="配件清单" @close="handleShare">
			<view class="" style="padding: 30rpx 0;">
				<block v-for="(item, index) in proData.repairDetailParts" :key="index" v-if="componentCurrentPage == index">
					<input-box label="零件编码">{{item.partsCode}}</input-box>
					<input-box label="零件名称">{{item.partsName}}</input-box>
					<input-box label="版本号">{{item.partsEdition}}</input-box>
					<input-box label="销售价格">{{item.partsPrice}}</input-box>
				</block>
				<!-- 配件清单分页器start -->
				<view class="flex align-center" v-if="proData.repairDetailParts.length>0">
					<uni-icons class="flex-sub text-center" type="arrowleft" @click="handlePageChange('prev', 'componentCurrentPage', proData.repairDetailParts.length)"></uni-icons>
					<text class="">{{ componentCurrentPage + 1 }}/{{ proData.repairDetailParts.length }}</text>
					<uni-icons class="flex-sub text-center" type="arrowright" @click="handlePageChange('next', 'componentCurrentPage', proData.repairDetailParts.length)"></uni-icons>
				</view>
				<!-- 配件清单分页器end -->
			</view>
		</custom-share>
		<!-- 配件清单弹出层end -->
	</view>
</template>

<script>
import cellBox from './components/cell-box';
import customShare from './components/custom-share/custom-share.vue';
export default {
	components: {
		cellBox,customShare
		
	},
	data() {
		return {
			fixCode: '',
			formData: {},
			currentPage: 0,
			componentCurrentPage: 0,
			shareStatus: false
		};
	},
	computed: {
		// 该维修单是否已支付，传入当前维修单的data；0 未支付。1 已支付
		isPayStatus() {
			return this.formData.status == '3';
		},
		proData() {
			return this.formData.repairDetailList[this.currentPage];
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
	onLoad() {
		const repairOrder = this.$Route.query.repairOrder;
		this.getDetailList({repairOrder: repairOrder});
	},
	mounted() {
	},
	methods: {
		// 支付维修费用
		doPay(item) {
			if (this.isPayStatus) {
				// ...
				uni.showToast({
					title: '支付成功',
					mask: true,
					icon: 'none',
					duration: 1500
				});
			}else{
				uni.showToast({
					title: '账单未出，暂不可支付，详情请咨询客服人员',
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
		getDetailList(val){
			let that = this
			uni.showLoading({
				title: 'loading...'
			});
			that.$api('afterSale.repairMessage', val).then(res => {
				if (res.flag) {
					that.formData = res.data
					uni.hideLoading();
				}
			});
		},
	}
};
</script>

<style lang="scss" scoped></style>
