<!-- 质保登记 -->
<template>
	<view>
		<!-- 搜索条件start -->
		<view class="title-warpper">
			<view class="input-box flex">
				<text class="input-label">机身码</text>
				<input type="text" v-model="searchData.productBarcode" class="flex-sub" placeholder="请手动输入或者扫描" />
				<text v-if="searchData.productBarcode" class="text-clear cuIcon-backdelete"
					@click.stop="handleSearchClear('searchData.productBarcode')"></text>
				<uni-icons type="scan" color="#808080" size="28" @click="handleScan"></uni-icons>
			</view>
			<view class="input-box text-blue text-center"
				style="border-top: 1px solid #ccc;border-bottom: 1px solid #ccc;" @click="getList">查找</view>
		</view>
		<!-- 搜索条件end -->
		<!-- 列表start -->
		<view class="list-warpper">
			<template v-if="list.length === 0">
				<view class="text-center text-grey">暂无数据，请重新查找</view>
			</template>
			<template v-for="(item, index) in list">
				<view class="list-content">
					<input-box label="产品名称">
						<text>{{ item.productName }}</text>
					</input-box>
					<input-box label="出货日期">
						<text>{{ item.outputDate }}</text>
					</input-box>
					<input-box label="机身码">
						<text>{{ item.productBarcode }}</text>
					</input-box>
					<input-box label="规格型号">
						<text>{{ item.productModel }}</text>
					</input-box>
					<input-box label="客户编码">
						<text>{{ item.custNumber }}</text>
					</input-box>
					<input-box label="出库单号">
						<text>{{ item.outPutOrderNumber }}</text>
					</input-box>
				</view>
			</template>
		</view>
		<!-- 列表end -->
	</view>
</template>
<script>
	import {
		API_URL
	} from '@/env'
	export default {
		data() {
			return {
				// 查找的数据集
				searchData: {
					// 机身码
					productBarcode: '',
				},
				// 查找的列表数据
				list: [],
			};
		},
		computed: {},
		watch: {},
		mounted() {

		},
		methods: {
			// 点击扫描图标
			handleScan(action) {
				let that = this;
				uni.scanCode({
					success: function(res) {
						that.searchData.productBarcode = res.result;
						that.getList();
					}
				});
			},
			// 查询条件的所有输入框一键清空内容功能
			// key 对应的v-model键名
			// 接受数据类型'keyname' | 'keyname.keyname' | 'keyname.keyname.keyname'......
			handleSearchClear(key) {
				const keyArr = key.split('.');
				if (keyArr.length > 1) {
					let data = this;
					for (let i in keyArr) {
						const k = keyArr[i];
						if (i * 1 === keyArr.length - 1) {
							data[keyArr[keyArr.length - 1]] = '';
						} else {
							data = data[k];
						}
					}
				}
			},
			// api - 请求列表
			getList() {
				let that = this;
				that.isLoading = true;
				that.loadStatus = 'loading';
				that.$api('afterSale.scanFuselageCode', that.searchData).then(res => {
					if (res.flag) {
						that.isLoading = false;
						/* res.data.forEach((item) => {
							if (item.voucher == null) {
								item.voucher = []
							} else {
								item.voucher = JSON.parse(item.voucher)
							}
						}) */
						that.list = [res.data];
						console.log(that.list)
					}
				});
			}
		}
	};
</script>

<style lang="scss" scoped>
	/* 头部+列表容器*/
	.title-warpper,
	.list-warpper {
		margin-bottom: 16rpx;
	}

	/* 筛选区：搜索+日期选择*/
	.search,
	.datePicker {
		align-items: center;
	}

	/* 清空输入框文字 */
	.text-clear {
		margin-right: 16rpx;
	}

	/* 输入框容器样式 */
	.input-box {
		align-items: center;
		background-color: #ffffff;
		padding: 16rpx 30rpx;

		.input-label {
			margin-right: 16rpx;
		}
	}

	.list-warpper {
		.list-content {
			background-color: white;
			// padding: 16rpx 30rpx;
			padding: 16rpx 0;
		}

		.btn-group {
			padding: 16rpx;

			/* uni-collapse-item组件内的内容使用padding是撑不开下一个uni-collapse-item组件的间距的 */
			/* 会出现点击第一个item的最底部，结果展开了第二个item。元素溢出 */
			// margin-bottom: 16rpx;
			.cuIcon-deletefill {
				color: #fff;
			}
		}
	}

	.share-footer {
		padding: 16rpx 30rpx;
		width: 100%;
		display: flex;
		justify-content: center;
		align-items: center;
		border-top: 1rpx solid #e4e7ed;
	}
</style>
