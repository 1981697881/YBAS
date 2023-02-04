<template>
	<view>
		<!-- 搜索条件start -->
		<view class="title-warpper">
			<view class="input-box flex">
				<text class="input-label">上报日期</text>
				<view class="flex-sub flex align-center">
					<picker mode="date" :value="searchData.startDate" @change="handleMaxDateChange">
						<view class="flex align-center">
							<input type="text" disabled v-model="searchData.startDate" class="flex-sub"
								placeholder="开始日期" />
							<text v-if="searchData.startDate" class="text-clear cuIcon-backdelete"
								@click.stop="handleSearchClear('searchData.startDate')"></text>
						</view>
					</picker>
					<picker mode="date" :value="searchData.endDate" @change="handleMinDateChange">
						<view class="flex align-center">
							<input type="text" disabled v-model="searchData.endDate" class="flex-sub"
								placeholder="结束日期" />
							<text v-if="searchData.endDate" class="text-clear cuIcon-backdelete"
								@click.stop="handleSearchClear('searchData.endDate')"></text>
						</view>
					</picker>
				</view>
			</view>
			<view class="input-box text-blue text-center"
				style="border-top: 1px solid #ccc;border-bottom: 1px solid #ccc;" @click="getList">查找</view>
		</view>
		<!-- 搜索条件end -->

		<!-- 列表start -->
		<view class="list-warpper">
			<!-- <view class="input-box" style="background: inherit;font-size:26rpx;">
				<view class="text-right"><text class=" text-blue text-right cuIcon-add" @click="handleShare(true, 'edit')">上报</text></view>
			</view> -->
			<view class=" text-right"><button @click="handleShare(true, 'edit')" style="width: 100rpx;"
					class="bg-blue cu-btn cuIcon ">上报
					<text class="cuIcon-add"></text>
				</button>
			</view>
			<template v-if="list.length === 0">
				<view class="text-center text-grey">暂无数据，请重新查找</view>
			</template>
			<template v-for="(item, index) in list">
				<uni-collapse :key="index">
					<uni-collapse-item :title="'产品名称：' + item.productName" showDelete
						@delete="handleDelList(item, index)">
						<!-- <template slot="title-right">
							<view class="text-grey">2021/8/1/</view>
						</template> -->
						<view class="list-content" @click="handleShare(true, 'readonly', item)">
							<input-box label="产品条码">
								<text>{{ item.productBarcode }}</text>
							</input-box>
							<input-box label="型号">
								<text>{{ item.productModel }}</text>
							</input-box>
							<input-box label="详情"><text class="text-blue"
									style="text-decoration: underline">点击查看详情</text></input-box>
							<input-box label="处理状态">
								<text>{{ item.status | filterStatus }}</text>
							</input-box>
							<input-box label="上报时间">
								<text>{{ item.createDate }}</text>
							</input-box>
						</view>
					</uni-collapse-item>
				</uni-collapse>
			</template>
		</view>
		<!-- 列表end -->
		<!-- 登记界面的弹出层start -->
		<!-- 隐藏销毁 -->
		<template v-if="shareStatus">
			<custom-share :show="shareStatus" :title="shareTitle" :maskClose="!isEdit" @close="handleShare"
				@rtClick="handleScan('edit')">
				<template slot="title-right" v-if="isEdit">
					<!-- <uni-icons type="scan" color="#808080" size="28"></uni-icons> -->
				</template>
				<report-form ref="report-form" :isEdit="isEdit" />
				<template slot="footer" v-if="isEdit">
					<view class="flex" style="height: 90rpx;">
						<text class="flex-sub share-footer text-white bg-blue cuIcon-add"
							@click="addformData">追加产品</text>
						<view class="flex-sub share-footer text-blue" @click="submit">提交</view>
					</view>
				</template>
			</custom-share>
		</template>
		<!-- 登记界面的弹出层end -->
	</view>
</template>

<script>
	import mock from '@/common/mock/register';
	import reportForm from './components/report-form';
	import customShare from './components/custom-share/custom-share.vue';
	import {
		API_URL
	} from '@/env'
	export default {
		components: {
			reportForm,
			customShare

		},
		data() {
			return {
				// 查找的数据集
				searchData: {
					// 上报日期-最大日期
					startDate: null,
					// 上报日期-最小日期
					endDate: null
				},
				// 查找的列表数据
				list: [],
				// 弹出层
				shareStatus: false,
				// 表单是否可编辑
				isEdit: false
			};
		},
		computed: {
			shareTitle: function() {
				return this.isEdit ? '新增上报' : '查看详情'
			}
		},
		filters: {
			formatDate: dateValue => {
				const date = new Date(dateValue);
				return `${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()}`;
			},
			filterStatus: dataValue => ['未处理', '已处理'][dataValue || 0],
		},
		watch: {},

		mounted() {},
		methods: {
			// 表单提交
			submit() {
				let that = this;
				// 获取表单data，rules
				const {
					formData,
					formRules,
					customData
				} = this.$refs['report-form'];
				const showToast = function(value) {
					uni.showToast({
						title: value,
						mask: true,
						icon: 'none',
						duration: 1500
					});
				};
				// 该页面的formData是Array类型
				console.log(formData)
				
				for (let i = 0; i < formData.length; i++) {
					const item = formData[i];
					formData[i].photos = JSON.stringify(formData[i].photos)
					console.log(formData[i].photos)
					for (let key in formRules) {
						if (typeof item[key] === 'string') {
							if (item[key] === '') {
								showToast(`第${i + 1}条产品：${formRules[key]}`);
								return false;
							}
						}
						if (typeof item[key] === 'object') {
							if (JSON.stringify(item[key]) === '{}' || JSON.stringify(item[key]) === '[]') {
								showToast(`第${i + 1}条产品：${formRules[key]}`);
								return false;
							}
						}
					}
				}
				that.$api('afterSale.reportAdd', {
					reports: formData
				}).then(res => {
					if (res.flag) {
						uni.showToast({
							icon: 'none',
							title: res.msg,
						});
						this.shareStatus = false;
						this.isEdit = false;
						that.getList();
						wx.requestSubscribeMessage({
							tmplIds: ['S9_D9bJHy57UJv16aiNOItmcSHdyhjan0khgNrK_GZg'],
							success: (res) => {
								if (res['S9_D9bJHy57UJv16aiNOItmcSHdyhjan0khgNrK_GZg'] === 'accept') {
									wx.showToast({
										title: '订阅成功！',
										duration: 1000,
										success(data) {
											console.log("消息授权成功")
											console.log(data)
										}
									})
								}
							},
							fail(err) {
								console.log("消息授权失败")
								console.log(err)
							}
						})
					}else{
						uni.showToast({
							icon: 'none',
							title: res.msg,
						});
					}
				});

			},
			// 追加产品
			addformData() {
				this.$refs['report-form'].addformData()
			},
			// 弹出层显示
			handleShare(value, action, item) {
				let that = this;
				that.shareStatus = value;
				that.$nextTick(function() {
					this.$refs['report-form'].customData = {
						retrievalOrder: '',
						productPackcode: '',
						imageFiles: []
					};
					this.$refs['report-form'].formData = []
				})
				if (action === 'edit') {
					// 表单可以编辑
					that.isEdit = true
				} else if (action === 'readonly') {
					// 表单不可以编辑
					that.isEdit = false
					that.$nextTick(function() {
						that.$refs['report-form'].formData.push(item)
					})
					formData.push(formData);
				}
			},
			handleDelList(item, index) {
				const showToast = function(value) {
					uni.showToast({
						title: value,
						mask: true,
						icon: 'none',
						duration: 1500
					});
				};
				let that = this;
				// item为当前要删除的list.data
				uni.showModal({
					title: `删除提示`,
					content: `删除条码为：${item.productBarcode}`,
					success: res => {
						if (res.confirm) {
							// 确认删除
							that.$api('afterSale.deleteReport', {
								id: item.id
							}).then(reso => {
								if (reso.flag) {
									showToast(reso.msg);
									that.getList();
								}
							});
						} else if (res.cancel) {}
					}
				});
			},
			// 选择购买日期 - 开始日期
			handleMaxDateChange: function(e) {
				this.searchData.startDate = e.target.value;
			},
			// 选择购买日期 - 结束日期
			handleMinDateChange: function(e) {
				this.searchData.endDate = e.target.value;
			},
			// 点击扫描图标
			handleScan(action) {
				if (action === 'edit') {
					// 在登记界面点击的扫描图标
				} else {
					// 默认点击列表页的扫描图标
				}
				console.log('点击扫描图标');
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
				uni.showLoading({
					title: '查找中'
				});
				that.$api('afterSale.reportList', that.searchData).then(res => {
					if (res.flag) {
						res.data.forEach((item) => {
							item.photos = JSON.parse(item.photos)
						})
						uni.hideLoading();
						that.list = [...res.data];
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
