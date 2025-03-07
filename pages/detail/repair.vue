<!-- 我要报修 -->
<template>
	<view>
		<!-- 搜索条件start -->
		<view class="title-warpper">
			<!-- <view class="input-box flex">
				<text class="input-label">产品条码</text>
				<input type="text" v-model="searchData.barCode" class="flex-sub" placeholder="请手动输入或者扫描" />
				<text v-if="searchData.barCode" class="text-clear cuIcon-backdelete"
					@click.stop="handleSearchClear('searchData.barCode')"></text>
				<uni-icons type="scan" color="#808080" size="28" @click="handleScan"></uni-icons>
			</view> -->
			<view class="input-box flex">
				<text class="input-label">维修单号</text>
				<input type="text" v-model="searchData.repairOrder" class="flex-sub" placeholder="请手动输入" />
				<text v-if="searchData.repairOrder" class="text-clear cuIcon-backdelete"
					@click.stop="handleSearchClear('searchData.repairOrder')"></text>
			</view>
			<view class="input-box flex">
				<text class="input-label">报修日期</text>
				<view class="flex-sub flex align-center">
					<uni-datetime-picker v-model="range" type="daterange" @maskClick="maskClick" />
				</view>
			</view>
			<!-- <view class="input-box flex">
				<text class="input-label">报修日期</text>
				<view class="flex-sub flex align-center">
					<picker mode="date" ref="pickerRef" :value="searchData.startDate" @change="handleMaxDateChange">
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
			</view> -->
			<view class="input-box text-blue text-center"
				style="border-top: 1px solid #ccc;border-bottom: 1px solid #ccc;" @click="getList">查找</view>
		</view>
		<!-- 搜索条件end -->

		<!-- 列表start -->
		<view class="list-warpper">
			<!-- <view class="input-box text-right" style="background: inherit;font-size:26rpx;">
				<text class="flex-sub text-blue text-right cuIcon-add" @click="handleShare(true, 'edit')">我要报修</text>
			</view> -->
			<view class=" text-right"><button @click="handleShare" style="width: 200rpx;"
					class="bg-blue cu-btn cuIcon ">我要报修
					<text class="cuIcon-add"></text>
				</button>
				<!-- <text class="flex-sub text-blue text-right cuIcon-add"
					>登记</text> -->
			</view>
			<template v-if="list.length === 0">
				<view class="text-center text-grey">暂无数据，请重新查找</view>
			</template>
			<template v-for="(item, index) in list">
				<uni-collapse :key="index">
					<uni-collapse-item :title="'维修单号：' + item.repairOrder" :showArrow="true">
						<template slot="title-right">
							<view :class="isPayStatus(item) ? 'text-red' : 'text-green'">
								{{ item.payStatus | filterPayStatus }}
							</view>
						</template>
						<view class="list-content">
							<view class="flex align-start" v-for="(detail,detailIndex) in item.repairDetailList"
								:key="detailIndex">
								<view class="flex-sub" @tap="handleShare('edit',item)">
									<input-box label="产品条码">
										<text>{{ detail.productCode }}</text>
									</input-box>
									<input-box label="产品名称">
										<text>{{ detail.productName }}</text>
									</input-box>
									<input-box label="型号">
										<text>{{ detail.productModel }}</text>
									</input-box>
									<input-box label="购买日期">
										<text>{{ detail.productBuyDate | formatDate }}</text>
									</input-box>
									<input-box label="保修期至">
										<text>{{ detail.productGuarantee | formatDate }}</text>
									</input-box>
									<input-box label="故障说明">
										<text>{{ detail.faultDescription }}</text>
									</input-box>
									<input-box label="维修说明">
										<text>{{ detail.repairOpinion }}</text>
									</input-box>
									<input-box label="维修状态">
										<text class="text-blue">{{ item.status | filterFixStatus }}</text>
									</input-box>
									<!-- <input-box label="寄件信息"><text class="text-blue">点击查看</text></input-box> -->
									<input-box label="物流公司">
										<text>{{ item.logistics.expressName }}</text>
									</input-box>
									<input-box label="物流单号" @tap.stop="clickNum(item.logistics.expressOrder)">
										<text class="text-cyan">{{ item.logistics.expressOrder }}</text>
									</input-box>
								</view>
								<!-- <view class="" style="color: #bbbbbb;">
									进入详情
									<uni-icons type="arrowright" color="#bbbbbb"></uni-icons>
								</view> -->
							</view>
							<!-- 列表项分页器start -->
							<view class="flex">
								<uni-icons class="flex-sub text-center" type="arrowleft"
									@click="handlePageChange('prev', item)"></uni-icons>
								<text class="">{{ item.currentPage + 1 }}/{{ item.repairDetailList.length }}</text>
								<uni-icons class="flex-sub text-center" type="arrowright"
									@click="handlePageChange('next', item)"></uni-icons>
							</view>
							<!-- 列表项分页器end -->
						</view>
					</uni-collapse-item>
					<view class="flex uni-collapse-footer">
						<view class="flex-sub text-blue text-center"
							@click="jump('/pages/detail/repairPayDetail', { repairOrder: item.repairOrder })">查看详细报价
						</view><!-- @click="doPay(item)" -->
						<view class="flex-sub text-center" :class="isPayStatus(item) ? 'text-blue' : 'text-grey'">
							维修费用：{{ item.status>=3?item.payPrice: "未完成" }}</view>
					</view>
				</uni-collapse>
			</template>
		</view>
		<!-- 列表end -->

		<!-- 登记界面的弹出层start -->
		<custom-share :show="shareStatus" title="新增报修单" @close="handleShare" @rtClick="handleScan('edit')">
			<template slot="title-right">
				<uni-icons type="scan" color="#808080" size="28"></uni-icons>
			</template>
			<template slot="title-footer"></template>
			<repair-form ref="repair-form" />
			<template slot="footer">
				<view class="flex" style="height: 90rpx;">
					<text class="flex-sub share-footer text-white bg-blue cuIcon-add" @tap="add">追加产品</text>
					<view class="flex-sub share-footer text-blue" @click="submit">提交</view>
				</view>
			</template>
		</custom-share>
		<!-- 登记界面的弹出层end -->
		<!-- 登录提示 -->
		<app-login-modal></app-login-modal>
	</view>
</template>

<script>
	import repairForm from './components/repair-form';
	import customShare from './components/custom-share/custom-share.vue';
	import uniDatetimePicker from './components/uni-datetime-picker/uni-datetime-picker.vue';
	export default {
		components: {
			repairForm,
			customShare,
			uniDatetimePicker
		},
		data() {
			return {
				range: [Date.now() - 1000000000, Date.now() + 1000000000],
				// 查找的数据集
				searchData: {
					// 产品条码
					barCode: '',
					// 维修单号
					repairOrder: '',
					// 购买日期-最大日期
					startDate: Date.now() - 1000000000,
					// 购买日期-最小日期
					endDate: Date.now() + 1000000000
				},
				// 查找的列表数据
				list: [],
				// 登记界面弹出层
				shareStatus: false,
				isSubmin: false,
				// 登记界面是否可编辑
			};
		},
		computed: {},
		filters: {
			filterFixStatus: dataValue => ['待寄回', '待检修', '待确认', '待维修', '待发货', '待收货', '完成'][dataValue],
			filterPayStatus: dataValue => ['未支付', '已支付'][dataValue],
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
		mounted() {},
		methods: {
			maskClick(e) {
				console.log('maskClick事件:', e);
			},
			clickNum(val) {
				uni.setClipboardData({
					data: val, //要被复制的内容
					success: function() {
						//在success中加入uni.hideToast()可以解决
						uni.showToast({
							title: '复制成功',
							duration: 2000,
							icon: 'none'
						});
						//以下就可自定义操作了~
					},
					fail: function(err) {
						uni.showToast({
							title: '复制失败',
							duration: 2000,
							icon: 'none'
						});
					}
				});
			},
			add() {
				let that = this;
				that.$nextTick(function() {
					that.$refs['repair-form'].addformData();
				})
			},
			// 该维修单是否已支付，传入当前维修单的data；0 未支付。1 已支付
			isPayStatus: item => item.payStatus,
			// 登记界面的表单提交
			submit() {
				let that = this;
				if(that.isSubmin){
					uni.showToast({
						icon: 'none',
						title: "数据还在处理，请稍后~",
					});
					return;
				}
				that.isSubmin = true;
				// 获取表单data，rules
				const {
					formData,
					formRules,
					contactData
				} = this.$refs['repair-form'];
				const showToast = function(value) {
					uni.showToast({
						title: value,
						mask: true,
						icon: 'none',
						duration: 1500
					});
				};
				let formDataTik = JSON.parse(JSON.stringify(formData))
				// 该页面的formData是Array类型
				for (let i = 0; i < formDataTik.length; i++) {
					const item = formDataTik[i];
					formDataTik[i].voucher = JSON.stringify(formDataTik[i].voucher)
					formDataTik[i].faultPhoto = JSON.stringify(formDataTik[i].faultPhoto)
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
				contactData.contactAddress = contactData.province + '-' + contactData.contactAddress
				contactData.repairDetailList = formDataTik;
				//contactData.repairDetail = formDataTik;
				if (contactData.repairOrder != '') {
					that.$api('afterSale.repairDetailUpdate', contactData).then(res => {
						if (res.flag) {
							that.isSubmin = false;
							uni.showToast({
								icon: 'none',
								title: res.msg,
							});
							that.shareStatus = false;
							that.getList();
							contactData = {}
							wx.requestSubscribeMessage({
								tmplIds: ['nEeDyvzRMz71h4JyVxvnr050Xo-znFAHsOPVZTpgMoI',
									'GW11IrdJlW10kcoyrjmrXyMCxdO7O_qT3joFEajWpeY'
								],
								success: (res) => {
									if (res['nEeDyvzRMz71h4JyVxvnr050Xo-znFAHsOPVZTpgMoI',
											'GW11IrdJlW10kcoyrjmrXyMCxdO7O_qT3joFEajWpeY'] ===
										'accept') {
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
						} else {
							that.isSubmin = false;
							uni.showToast({
								icon: 'none',
								title: res.msg,
							});
						}
					});
				} else {
					that.$api('afterSale.repairDetailAdd', contactData).then(res => {
						if (res.flag) {
							that.isSubmin = false;
							showToast(res.msg);
							that.shareStatus = false;
							that.getList();
							contactData = {}
							wx.requestSubscribeMessage({
								tmplIds: ['nEeDyvzRMz71h4JyVxvnr050Xo-znFAHsOPVZTpgMoI',
									'GW11IrdJlW10kcoyrjmrXyMCxdO7O_qT3joFEajWpeY'
								],
								success: (res) => {
									if (res['nEeDyvzRMz71h4JyVxvnr050Xo-znFAHsOPVZTpgMoI',
											'GW11IrdJlW10kcoyrjmrXyMCxdO7O_qT3joFEajWpeY'] ===
										'accept') {
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
						} else {
							that.isSubmin = false;
							uni.showToast({
								icon: 'none',
								title: res.msg,
							});
						}
					});
				}
			},
			// 支付维修费用
			doPay(item) {
				if (this.isPayStatus(item)) {
					// ...
					uni.showToast({
						title: '支付成功',
						mask: true,
						icon: 'none',
						duration: 1500
					});
				} else {
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
				if (value == "edit") {
					this.$refs['repair-form'].contactData = {
						repairOrder: action.repairOrder,
						contactPerson: action.contactPerson,
						contactNumber: action.contactNumber,
						contactAddress: action.contactAddress.split('-')[1],
						province: `${action.contactAddress.split('-')[0].split(' ')[0]} ${action.contactAddress.split('-')[0].split(' ')[1]} ${action.contactAddress.split('-')[0].split(' ')[2]}`,
						provinceNum: action.provinceNum,
						courierNumber: action.courierNumber,
					};
					this.$refs['repair-form'].lotusAddressData = {
						provinceName: action.contactAddress.split('-')[0].split(' ')[0],
						visible: false,
						cityName: action.contactAddress.split('-')[0].split(' ')[1],
						townName: action.contactAddress.split('-')[0].split(' ')[2],
					};
					let repairDetailList = JSON.parse(JSON.stringify(action.repairDetailList))
					for (var i = 0; i < repairDetailList.length; i++) {
						if (repairDetailList[i].faultPhoto != null && repairDetailList[i].faultPhoto != "[]" && !Array
							.isArray(repairDetailList[i].faultPhoto)) {
							repairDetailList[i].faultPhoto = JSON.parse(repairDetailList[i].faultPhoto)
						} else {
							repairDetailList[i].faultPhoto = []
						}
						if (repairDetailList[i].voucher != null && repairDetailList[i].voucher != "[]" && !Array.isArray(
								repairDetailList[i].voucher)) {
							repairDetailList[i].voucher = JSON.parse(repairDetailList[i].voucher)
						} else {
							repairDetailList[i].voucher = []
						}
					}
					this.$refs['repair-form'].formData = repairDetailList
					this.$refs['repair-form'].currentPage = 0
				} else {
					this.$refs['repair-form'].contactData = {
						repairOrder: '',
						contactPerson: '',
						contactNumber: '',
						contactAddress: '',
						province: '',
						provinceNum: '',
						courierNumber: ''
					};
					this.$refs['repair-form'].formData = []
				}
			},
			handleDelList(item, index) {
				// item为当前要删除的list.data
				uni.showModal({
					title: `删除提示`,
					content: `删除条码为：${item.barCode}`,
					success: res => {
						if (res.confirm) {
							// 确认删除
							this.list.splice(index, 1);
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
				let that = this;
				uni.scanCode({
					success: function(res) {
						if (action === 'edit') {
							let resData = res.result.split(';')
							that.$api('afterSale.productionMessage', {
								productBarcode: res.result
							}).then(reso => {
								if (reso.flag && reso.data != null) {
									let obj = {}
									obj.name = reso.data.productName;
									obj.model = reso.data.productModel;
									obj.barCode = res.result;
									that.$nextTick(function() {
										that.$refs['repair-form'].scanBarcode(obj);
										that.$refs['repair-form'].codeBarcode = reso.data;
									})
								} else {
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
									that.$refs['repair-form'].scanBarcode(obj);
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
											that.$refs['repair-form'].scanBarcode(obj);
										})
									}
								});
							} */
							// 在登记界面点击的扫描图标
						} else {
							that.searchData.barCode = res.result;
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
			// 监听切换页
			/**
			 * @param {Object} action 上一页/下一页
			 * @param {Object} item 当前维修项
			 */
			handlePageChange(action, item) {
				if (action === 'prev') {
					// 上一页
					if (item.currentPage > 0) {
						item.currentPage--;
					}
				} else if (action === 'next') {
					// 下一页
					if (item.currentPage < item.repairDetailList.length - 1) {
						item.currentPage++;
					}
				}
			},
			// 路由跳转
			jump(path, params) {
				let obj = {
					...params
				};
				// path路径必须以“/”开头
				if (path && path[0] === '/') {
					this.$Router.push({
						path: path,
						query: obj
					});
				}
			},
			// 获取到list数据后，给list添加分页要用的字段
			// 必须要用set 将新属性加入到vue观察者中
			setListPage() {
				this.list.map((item, index) => {
					this.$set(this.list[index], 'currentPage', 0);
				});
			},
			// api - 请求列表
			getList() {
				let that = this;
				uni.showLoading({
					title: '查找中'
				});
				that.$api('afterSale.repairList', that.searchData).then(res => {
					if (res.flag) {
						uni.hideLoading();
						res.data.forEach((item) => {
							item.currentPage = 0;
						})
						that.list = [...res.data];
					}
				});
				this.setListPage();
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
		font-size: 28rpx;

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

		// 每一个块级项
		.uni-collapse {
			margin-bottom: 16rpx;
		}

		// 每一个块级列表的底部
		.uni-collapse-footer {
			.flex-sub {
				padding: 16rpx 30rpx;
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
