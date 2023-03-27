<!-- 质保登记 -->
<template>
	<view>
		<!-- 搜索条件start -->
		<view class="title-warpper">
			<view class="input-box flex">
				<text class="input-label">产品条码</text>
				<input type="text" v-model="searchData.productCode" class="flex-sub" placeholder="请手动输入或者扫描" />
				<text v-if="searchData.productCode" class="text-clear cuIcon-backdelete"
					@click.stop="handleSearchClear('searchData.productCode')"></text>
				<uni-icons type="scan" color="#808080" size="28" @click="handleScan"></uni-icons>
			</view>
			<view class="input-box flex">
				<text class="input-label">购买日期</text>
				<view class="flex-sub flex align-center">
					<uni-datetime-picker v-model="range" type="daterange" @maskClick="maskClick" />
					<!-- <picker mode="date" :value="searchData.productStartBuyDate" @change="bindMaxDateChange">
						<view class="flex align-center">
							<input type="text" disabled v-model="searchData.productStartBuyDate" class="flex-sub"
								placeholder="开始日期" />
							<text v-if="searchData.productStartBuyDate" class="text-clear cuIcon-backdelete"
								@click.stop="handleSearchClear('searchData.productStartBuyDate')"></text>
						</view>
					</picker>
					<picker mode="date" :value="searchData.productEndBuyDate" @change="bindMinDateChange">
						<view class="flex align-center">
							<input type="text" disabled v-model="searchData.productEndBuyDate" class="flex-sub"
								placeholder="结束日期" />
							<text v-if="searchData.productEndBuyDate" class="text-clear cuIcon-backdelete"
								@click.stop="handleSearchClear('searchData.productEndBuyDate')"></text>
						</view>
					</picker> -->
				</view>
			</view>
			<view class="input-box text-blue text-center"
				style="border-top: 1px solid #ccc;border-bottom: 1px solid #ccc;" @click="getList">查找</view>
		</view>
		<!-- 搜索条件end -->
		<!-- 列表start -->
		<view class="list-warpper">
			<view class="input-box" style="background: inherit;font-size:26rpx;">
				<view class=" text-right"><button @click="handleShare(true, 'edit')" style="width: 100rpx;"
						class="bg-blue cu-btn cuIcon ">登记
						<text class="cuIcon-add"></text>
					</button>
					<!-- <text class="flex-sub text-blue text-right cuIcon-add"
						>登记</text> -->
				</view>
			</view>
			<template v-if="list.length === 0">
				<view class="text-center text-grey">暂无数据，请重新查找</view>
			</template>
			<template v-for="(item, index) in list">
				<uni-collapse :key="index">
					<uni-collapse-item :title="'产品名称：' + item.productName" @delete="handleDelList(item, index)">
						<!-- showDelete -->
						<view class="list-content">
							<input-box label="产品条码">
								<text>{{ item.productCode }}</text>
							</input-box>
							<input-box label="型号">
								<text>{{ item.productModel }}</text>
							</input-box>
							<input-box label="购买日期">
								<text>{{ item.productBuyDate | formatDate }}</text>
							</input-box>
							<input-box label="保修期至">
								<text>{{ item.productGuarantee | formatDate }}</text>
							</input-box>
							<input-box label="省市区">
								<text>{{ item.province }}</text>
							</input-box>
							<input-box label="联系电话">
								<text>{{ item.contactNumber }}</text>
							</input-box>
							<input-box label="联系地址">
								<text>{{ item.contactAddress }}</text>
							</input-box>
							<input-box label="购买凭证">
								<uni-file-picker v-if="item.voucher.length>0" readonly=true :value="item.voucher"
									:limit="3" file-mediatype="image" mode="grid" file-extname="png,jpg" />
							</input-box>
						</view>
					</uni-collapse-item>
				</uni-collapse>
			</template>
		</view>
		<!-- 列表end -->
		<!-- 登记界面的弹出层start -->
		<custom-share :show="shareStatus" title="新增登记" @close="handleShare" @rtClick="handleScan('edit')">
			<template slot="footer">
				<view class="share-footer bg-blue" style="height: 90rpx;" @click="submit">提交</view>
			</template>
			<template slot="title-right">
				<uni-icons type="scan" color="#808080" size="28"></uni-icons>
			</template>
			<register-form ref="register-form" :resData="resData" />
		</custom-share>
		<!-- 登记界面的弹出层end -->
	</view>
</template>
<script>
	import mock from '@/common/mock/register';
	import registerForm from './components/register-form';
	import customShare from './components/custom-share/custom-share.vue';
	import {
		API_URL
	} from '@/env'
	import uniFilePicker from './components/uni-file-picker/uni-file-picker.vue';
	import uniDatetimePicker from './components/uni-datetime-picker/uni-datetime-picker.vue';
	export default {
		components: {
			registerForm,customShare,uniFilePicker,uniDatetimePicker
		},
		data() {
			return {
				range: [Date.now() - 1000000000, Date.now() + 1000000000],
				// 查找的数据集
				searchData: {
					// 产品条码
					productCode: '',
					// 购买日期-最大日期
					productStartBuyDate: Date.now() - 1000000000,
					// 购买日期-最小日期
					productEndBuyDate: Date.now() + 1000000000
				},
				imageUrl: [{
					path: "https://yb.gzfzdev.com/uploadFiles/image/1644891542075.jpg",
					uuid: "1644891542075.jpg"
				}],
				// 查找的列表数据
				list: [],
				// 登记界面弹出层
				shareStatus: false
				// 登记界面是否可编辑
			};
		},
		computed: {},
		filters: {
			formatDate: dateValue => {
				const date = new Date(dateValue);
				return `${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()}`;
			}
		},
		watch: {
			range(newval) {
				this.searchData.startDate = newval[0];
				this.searchData.endDate = newval[1];
			},
		},
		mounted() {

		},
		methods: {
			maskClick(e) {
				console.log('maskClick事件:', e);
			},
			ViewImage(e, item) {
				console.log(e.currentTarget.dataset.url)
				uni.previewImage({
					urls: e.currentTarget.dataset.url,
					longPressActions: {
						itemList: ['发送给朋友', '保存图片', '收藏'],
						success: function(data) {
							console.log('选中了第' + (data.tapIndex + 1) + '个按钮,第' + (data.index + 1) + '张图片');
						},
						fail: function(err) {
							console.log(err.errMsg);
						}
					}
				});
			},
			// 登记界面的表单提交
			submit() {
				let that = this;
				// 获取表单data，rules
				const {
					formData,
					formRules
				} = this.$refs['register-form'];
				const showToast = function(value) {
					uni.showToast({
						title: value,
						mask: true,
						icon: 'none',
						duration: 1500
					});
				};
				for (let key in formRules) {
					if (typeof formData[key] === 'string') {
						if (formData[key] === '') {
							showToast(formRules[key]);
							return false;
						}
					}
					if (typeof formData[key] === 'object') {
						console.log(JSON.stringify(formData));
						if (JSON.stringify(formData[key]) === '{}' || JSON.stringify(formData[key]) === '[]') {
							showToast(formRules[key]);
							return false;
						}
					}
				}
				formData.voucher = JSON.stringify(formData.voucher);
				that.$api('afterSale.warrantyAdd', formData).then(res => {
					if (res.flag) {
						that.getList();
						showToast(res.msg);
					}else{
						showToast(res.msg);
					}
				});

				this.shareStatus = false;
			},
			// 弹出层显示
			handleShare(value, action) {
				this.shareStatus = value;
				this.$refs['register-form'].formData = {
					productCode: '',
					productName: '',
					productModel: '',
					productBuyDate: '',
					productGuarantee: '',
					province: '',
					contactNumber: '',
					contactAddress: '',
					voucher: []
				}
			},
			handleDelList(item, index) {
				// item为当前要删除的list.data
				uni.showModal({
					title: `删除提示`,
					content: `删除条码为：${item.productName}`,
					success: res => {
						if (res.confirm) {
							// 确认删除
							this.list.splice(index, 1);
						} else if (res.cancel) {}
					}
				});
			},
			// 选择购买日期 - 开始日期
			bindMaxDateChange: function(e) {
				this.searchData.productStartBuyDate = e.target.value;
			},
			// 选择购买日期 - 结束日期
			bindMinDateChange: function(e) {
				this.searchData.productEndBuyDate = e.target.value;
			},
			// 点击扫描图标
			handleScan(action) {
				let that = this;
				uni.scanCode({
					success: function(res) {
						if (action === 'edit') {
							let resData = res.result.split(';')
							that.$api('afterSale.productionMessage', {
								productBarcode: res.result
							}).then(reso => {
								if (reso.flag && reso.data !=null) {
									let obj = {}
									obj.name = reso.data.productName;
									obj.model = reso.data.productModel;
									obj.barCode = res.result;
									that.$nextTick(function() {
										that.$refs['register-form'].scanBarcode(obj);
									})
								}else{
									uni.showToast({
										icon: 'none',
										title: '搜索不到产品信息',
									});
								}
							});
							/* if (resData.length > 1) {
								let obj = {}
								obj.name = resData[2];
								obj.model = resData[1];
								obj.barCode = res.result;
								that.$nextTick(function() {
									that.$refs['register-form'].scanBarcode(obj);
								})
							} else {
								that.$api('afterSale.productionMessage', {
									productBarcode: res.result
								}).then(reso => {
									if (reso.flag) {
										let obj = {}
										obj.name = reso.data.productName;
										obj.model = reso.data.productModel;
										obj.barCode = res.result;
										that.$nextTick(function() {
											that.$refs['register-form'].scanBarcode(obj);
										})
									}
								});
							} */
							// 在登记界面点击的扫描图标
						} else {
							that.searchData.productCode = res.result;
							that.getList();
						}
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
				that.$api('afterSale.warrantyList', that.searchData).then(res => {
					if (res.flag) {
						that.isLoading = false;
						res.data.forEach((item) => {
							if (item.voucher == null) {
								item.voucher = []
							} else {
								item.voucher = JSON.parse(item.voucher)
							}
						})
						that.list = [...res.data];
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
