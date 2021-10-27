<template>
	<view class="flex flex-direction">
		<view class="category-warpper">
			<input-box label="当前选择">
				<picker :value="index" range-key="seriesName" :range="categoryList" @change="handleCategory">
					<view class="flex">
						<view class="text-bold flex-sub">{{ categoryList[index].seriesName }}</view>
						<uni-icons type="arrowright" color="#808080"></uni-icons>
					</view>
				</picker>
			</input-box>
		</view>
		<view class="list-warpper flex-sub">
			<template v-if="list.length === 0">
				<view class="text-center text-grey">暂无数据，请重新选则</view>
			</template>
			<view v-if="list.length !== 0" class="list-title" style="background: inherit;font-size:26rpx;">
				<text>共{{ list.length }}条数据</text>
			</view>
			<scroll-view class="scroll-box" scroll-y enable-back-to-top scroll-with-animation @scrolltolower="loadMore">
				<template v-for="(item, index) in list">
					<uni-collapse :key="index">
						<uni-collapse-item :title="'配件编码：' + item.partsCode">
							<view class="list-content padding-left">
								<input-box label="配件名称">
									<text>{{ item.partsName }}</text>
								</input-box>
								<input-box label="版本号">
									<text>{{ item.partsEdition }}</text>
								</input-box>
								<input-box label="销售价格">
									<text>{{ item.salePrice }}</text>
								</input-box>
								<input-box label="适用产品">
									<template v-for="(pro, proid) in item.applicablePro">
										<view :key="proid">{{ pro.name }}</view>
									</template>
								</input-box>
							</view>
						</uni-collapse-item>
					</uni-collapse>
				</template>
				<!-- 加载更多 -->
				<view v-if="grouponList.length" class="cu-load text-gray" :class="loadStatus"></view>
				<!-- loading -->
				<app-load v-model="isLoading"></app-load>
			</scroll-view>
		</view>
	</view>
</template>

<script>
export default {
	components: {},
	data() {
		return {
			categoryList: [],
			// 列表数据
			list: [],
			isLoading: true,
			lastPage: 1,
			currentPage: 1,
			index: 0
		};
	},
	mounted() {
		this.getSeries();
		/* this.getList(); */
	},
	onPullDownRefresh() {},
	methods: {
		// 加载更多
		loadMore() {
			if (this.currentPage < this.lastPage) {
				this.currentPage += 1;
				this.getList();
			}
		},
		handleCategory(e) {
			this.index = e.detail.value;
			this.getList();
		},
		getSeries(){
			let that = this;
			that.$api('afterSale.seriesList', {
				 parentId: 0,
			}).then(res => {
				if (res.flag) {
					that.categoryList = res.data;
					that.getList();
				}
			});
		},
		getList() {
			let that = this;
			// this.index
			that.isLoading = true;
			that.loadStatus = 'loading';
			that.$api('afterSale.seriesList', {
				parentId: that.categoryList[that.index].id
			}).then(res => {
				if (res.flag) {
					that.isLoading = false;
					that.list = res.data;
				}
			});
			/* that.lastPage = res.data.last_page;
			if (that.currentPage < res.data.last_page) {
				that.loadStatus = '';
			} else {
				that.loadStatus = 'over';
			}
			setTimeout(() => {
				uni.hideLoading();
			}, 1000);
			// 测试数据
			this.list = [
				{
					code: 'S180917835',
					name: 'B板',
					version: '0.1',
					price: '80',
					applicablePro: [
						{
							name: 'JPA0003'
						},
						{
							name: 'JPA0004'
						}
					]
				}
			]; */
		}
	}
};
</script>

<style lang="scss" scoped>
.category-warpper,
.list-title {
	padding: 16rpx 30rpx;
}

.category-warpper {
	width: 100%;
	background-color: #ffffff;
	/deep/.input-box {
		margin: 0;
	}
}

.list-warpper {
	margin-top: 30rpx;
	.list-title {
		background: inherit;
	}
	.list-content {
	}
}

/deep/ .input-box .input-label {
	padding-left: 0;
}
</style>
