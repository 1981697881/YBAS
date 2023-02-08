<!-- 订单查询 -->
<template>
	<view>
		<zhilin-picker v-model="show" :data="chooseList" :multiple="false" :title="title" @confirm="chooseClick" />
		<!-- 搜索条件start -->
		<view class="title-warpper">
			<view class="input-box flex">
				<text class="input-label">订单号</text>
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
				<uni-collapse :key="index">
					<uni-collapse-item :title="'产品名称：' + item.FName">
						<!-- showDelete --> 
						<view class="list-content" v-for="(child) in item.children" style="border-bottom: 1px solid #C0C4CC;"
							:style="child.status=='未入库'?'color:gray;':''">
							<input-box :style="'margin-bottom: 20rpx'" label="工序名称">
								<text>{{ child.procedure }}</text>
							</input-box>
							<input-box :style="'margin-bottom: 20rpx'" label="完成时间">
								<text>{{ child.finishtime }}</text>
							</input-box>
							<input-box :style="'margin-bottom: 20rpx'" label="状态">
								<text>{{ child.status }}</text>
							</input-box>
							<input-box :style="'margin-bottom: 20rpx'" label="图片">
								<button style="width: 180rpx;" v-if="child.image.length>0"
									class="text-blue cu-btn round sm lines-blue" @click="seeImage(item)">查看图片</button>
								<text v-else>暂无图片</text>
							</input-box>
						</view>
					</uni-collapse-item>
				</uni-collapse>
			</template>
		</view>
		<!-- 列表end -->
	</view>
</template>
<script>
	import {
		API_URL
	} from '@/env'
	
	import zhilinPicker from './components/zhilin-picker/zhilin-picker.vue';
	export default {
		components: {
			zhilinPicker
		},
		data() {
			return {
				show: false,
				// 查找的数据集
				searchData: {
					// 机身码
					productBarcode: '',
				},
				// 查找的列表数据
				list: [],
				chooseList: [],
				title: '选择产品',
			};
		},
		computed: {},
		watch: {},
		mounted() {

		},
		methods: {
			seeImage(val) {
				uni.previewImage({
					urls: val.image,
					current: 0,
					// 下面我这边做的都是默认的选择
					longPressActions: {
						itemList: ['发送给朋友', '保存图片', '收藏'],
						success: function(data) {},
						fail: function(err) {

						}
					}
				});
			},
			chooseClick(val) {
				console.log(val)
				this.list = [{
					RowNumber: '1',
					FName: '圆餐桌',
					FNumber: '21051101',
					FModel: '直径1500*785',
					FQty: '1',
					Grain: '爵士白岩板',
					Material: '不锈钢框架托板',
					children: [{
							procedure: '开料工序',
							finishtime: '2021-01-18',
							status: '已入库',
							price: '0.00',
							image: ["https://yb.gzfzdev.com/uploadFiles/image/1644806272029.png"],
							id: 0,
						}, {
							procedure: '木工组装工序',
							finishtime: '2021-01-18',
							status: '已入库',
							price: '0.00',
							image: [],
							id: 1,
						}, {
							procedure: '雕刻工序',
							finishtime: '2021-01-18',
							status: '已入库',
							price: '0.00',
							image: [],
							id: 2,
						},
						{
							procedure: '木磨工序',
							finishtime: '2021-01-18',
							status: '已入库',
							price: '0.00',
							image: [],
							id: 3,
						},
						{
							procedure: '油磨工序',
							finishtime: '',
							status: '未入库',
							price: '85.00',
							image: [],
							id: 4,
						}, {
							procedure: '贴箔工序',
							finishtime: '',
							status: '未入库',
							price: '0.00',
							image: [],
							id: 5,
						}, {
							procedure: '面漆工序',
							finishtime: '',
							status: '未入库',
							price: '85.00',
							image: [],
							id: 6,
						}, {
							procedure: '打底贴棉工序',
							finishtime: '',
							status: '未入库',
							price: '29.00',
							image: [],
							id: 7,
						}, {
							procedure: '软包放样工序',
							finishtime: '',
							status: '未入库',
							price: '0.00',
							image: [],
							id: 8,
						}
					]
				}, {
					RowNumber: '2',
					FName: '多人沙发',
					FNumber: '21050501',
					FModel: '2700*900*780',
					FQty: '1',
					Grain: '显木纹',
					Material: '榉木框架+扪布/扪皮+深木色油漆',
					children: [{
							procedure: '开料工序',
							finishtime: '2021-01-18',
							status: '已入库',
							price: '0.00',
							image: ["https://yb.gzfzdev.com/uploadFiles/image/1644806272029.png"],
							id: 0,
						}, {
							procedure: '木工组装工序',
							finishtime: '2021-01-18',
							status: '已入库',
							price: '0.00',
							image: [],
							id: 1,
						}, {
							procedure: '雕刻工序',
							finishtime: '2021-01-18',
							status: '已入库',
							price: '0.00',
							image: [],
							id: 2,
						},
						{
							procedure: '木磨工序',
							finishtime: '2021-01-18',
							status: '已入库',
							price: '0.00',
							image: [],
							id: 3,
						},
						{
							procedure: '油磨工序',
							finishtime: '',
							status: '未入库',
							price: '85.00',
							image: [],
							id: 4,
						}, {
							procedure: '贴箔工序',
							finishtime: '',
							status: '未入库',
							price: '0.00',
							image: [],
							id: 5,
						}, {
							procedure: '面漆工序',
							finishtime: '',
							status: '未入库',
							price: '85.00',
							image: [],
							id: 6,
						}, {
							procedure: '打底贴棉工序',
							finishtime: '',
							status: '未入库',
							price: '29.00',
							image: [],
							id: 7,
						}, {
							procedure: '软包放样工序',
							finishtime: '',
							status: '未入库',
							price: '0.00',
							image: [],
							id: 8,
						}
					]
				}];
			},
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
				/* that.show = true; */
				that.loadStatus = 'loading';
				this.list = [{
					RowNumber: '1',
					FName: '圆餐桌',
					FNumber: '21051101',
					FModel: '直径1500*785',
					FQty: '1',
					Grain: '爵士白岩板',
					Material: '不锈钢框架托板',
					children: [{
							procedure: '开料工序',
							finishtime: '2021-01-18',
							status: '已入库',
							price: '0.00',
							image: ["https://yb.gzfzdev.com/uploadFiles/image/1644806272029.png"],
							id: 0,
						}, {
							procedure: '木工组装工序',
							finishtime: '2021-01-18',
							status: '已入库',
							price: '0.00',
							image: [],
							id: 1,
						}, {
							procedure: '雕刻工序',
							finishtime: '2021-01-18',
							status: '已入库',
							price: '0.00',
							image: [],
							id: 2,
						},
						{
							procedure: '木磨工序',
							finishtime: '2021-01-18',
							status: '已入库',
							price: '0.00',
							image: [],
							id: 3,
						},
						{
							procedure: '油磨工序',
							finishtime: '',
							status: '未入库',
							price: '85.00',
							image: [],
							id: 4,
						}, {
							procedure: '贴箔工序',
							finishtime: '',
							status: '未入库',
							price: '0.00',
							image: [],
							id: 5,
						}, {
							procedure: '面漆工序',
							finishtime: '',
							status: '未入库',
							price: '85.00',
							image: [],
							id: 6,
						}, {
							procedure: '打底贴棉工序',
							finishtime: '',
							status: '未入库',
							price: '29.00',
							image: [],
							id: 7,
						}, {
							procedure: '软包放样工序',
							finishtime: '',
							status: '未入库',
							price: '0.00',
							image: [],
							id: 8,
						}
					]
				}, {
					RowNumber: '2',
					FName: '多人沙发',
					FNumber: '21050501',
					FModel: '2700*900*780',
					FQty: '1',
					Grain: '显木纹',
					Material: '榉木框架+扪布/扪皮+深木色油漆',
					children: [{
							procedure: '开料工序',
							finishtime: '2021-01-18',
							status: '已入库',
							price: '0.00',
							image: ["https://yb.gzfzdev.com/uploadFiles/image/1644806272029.png"],
							id: 0,
						}, {
							procedure: '木工组装工序',
							finishtime: '2021-01-18',
							status: '已入库',
							price: '0.00',
							image: [],
							id: 1,
						}, {
							procedure: '雕刻工序',
							finishtime: '2021-01-18',
							status: '已入库',
							price: '0.00',
							image: [],
							id: 2,
						},
						{
							procedure: '木磨工序',
							finishtime: '2021-01-18',
							status: '已入库',
							price: '0.00',
							image: [],
							id: 3,
						},
						{
							procedure: '油磨工序',
							finishtime: '',
							status: '未入库',
							price: '85.00',
							image: [],
							id: 4,
						}, {
							procedure: '贴箔工序',
							finishtime: '',
							status: '未入库',
							price: '0.00',
							image: [],
							id: 5,
						}, {
							procedure: '面漆工序',
							finishtime: '',
							status: '未入库',
							price: '85.00',
							image: [],
							id: 6,
						}, {
							procedure: '打底贴棉工序',
							finishtime: '',
							status: '未入库',
							price: '29.00',
							image: [],
							id: 7,
						}, {
							procedure: '软包放样工序',
							finishtime: '',
							status: '未入库',
							price: '0.00',
							image: [],
							id: 8,
						}
					]
				}];
				/* that.$api('afterSale.scanFuselageCode', that.searchData).then(res => {
					if (res.flag) {
						that.isLoading = false;
						if (res.data.length > 0) {
							res.data.forEach((item) => {
								if (item.voucher == null) {
									item.voucher = []
								} else {
									item.voucher = JSON.parse(item.voucher)
								}
							})
							that.list = [...res.data];
						}
						console.log(that.list)
					}
				}); */
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
