<!-- 首页 -->
<template>
	<view class="index-page">
		<!-- 轮播图 start -->
		<swiper :indicator-dots="true" :autoplay="false" :interval="3000" :duration="1000"
			:indicator-active-color="'#ffffff'">
			<swiper-item v-for="(item, index) in imagesList" :key="index">
				<image style="width: 100%; height: 100%;" :src="imageUrl+''+item.posterPhoto" mode="scaleToFill">
				</image>
			</swiper-item>
		</swiper>
		<!-- 轮播图 end -->
		<!-- 菜单入口 start -->
		<view class="margin-box">
			<u-grid :col="3">
				<!--  -->
				<u-grid-item v-for="(item, index) in meau" bgColor="white"
					:custom-style="{ padding: '0', textAlign: 'center', borderRight: '1rpx solid #ccc',borderBottom: '1rpx solid #ccc' }"
					:key="index">
					<!-- <uni-icons :type="item.icon"></uni-icons> -->
					<view style="padding: 60rpx 0;"><button v-if="index<6" @tap="jump(item.path,{},index)"
							class="cu-btn round shadow line-black">{{ item.name }}</button><button v-else
							open-type="contact" class="cu-btn round shadow line-black">{{ item.name }}</button></view>
				</u-grid-item>
			</u-grid>
		</view>
		<!-- 菜单入口 end -->
		<!-- 通知 start -->
		<custom-title title="客服留言">

		</custom-title>
		<view class="notice-warpper flex flex-direction margin-box">
			<view class="flex">
				<u-notice-bar v-if="notices.length" class="flex-sub" :autoplay="false" :mode="'vertical'"
					:list="notices" :bgColor="'#fff'" :color="'#000'" :duration="5000" :close-icon="false"
					:volumeIcon="false" :padding="0"></u-notice-bar>
				<view class="text-blue" style="line-height: 64rpx;">查看更多</view>
			</view>
		</view>
		<!-- 通知 end -->
		<view class="list-box bg-white">
			<view class="input-box flex"><!-- @input="onInput" -->
				<input type="text" @confirm="onSearch" confirm-type="搜索"
					v-model="searchData.repairOrder" class="flex-sub search-input" placeholder="快递单号/维修单号" />
				<text v-show="searchData.repairOrder" @tap="handleSearchClear('searchData.repairOrder')"
					class="cuIcon-roundclosefill"></text>
			</view>
		</view>
		<!-- 列表 start -->
		<view class="margin-box list-box">
			<custom-title title="报修清单"><!-- <text class="cuIcon-refresh text-black"></text> --></custom-title>
			<view class="list-tab flex">
				<template v-for="(item, index) in tabList">
					<view class="tab-item flex-sub text-center" :key="index" @click="handletab(index)">
						<text :class="tabCurrent === index ? 'active line-blue' : ''">{{ item }}</text>
					</view>
				</template>
			</view>
			<!-- 列表tabs end -->

			<!-- 报修列表 start -->
			<uni-collapse v-for="(item, index) in currentList" :key="index">
				<uni-collapse-item :title="'维修单号：' + item.repairOrder" :open="index === 0">
					<view class="list-item" @tap="paste(item)">
						<input-box label="联系人">
							<text>{{ item.contactPerson }}</text>
						</input-box>
						<input-box label="联系电话">
							<text>{{ item.contactNumber }}</text>
						</input-box>
						<input-box label="地址">
							<text>{{ item.contactAddress }}</text>
						</input-box>
						<input-box label="产品条码">
							<text>{{ item.repairDetailList[item.page].productCode }}</text>
						</input-box>
						<input-box label="产品名称">
							<text>{{ item.repairDetailList[item.page].productName }}</text>
						</input-box>
						<input-box label="型号">
							<text>{{ item.repairDetailList[item.page].productModel }}</text>
						</input-box>
						<input-box label="维修状态">
							<text>{{ item.status | getStatus }}</text>
							<button style="width: 150rpx;float: right;" v-if="item.status==5" class="text-blue"
								@click="confirmReceipt(item)">确认收货</button>
							<button style="width: 150rpx;float: right;" v-if="item.status==2" class="text-blue"
								@click="confirmRepair(item)">维修确认</button>
						</input-box>
					</view>
					<custom-pagination class="margin-box" :page="item.page" :total="item.repairDetailList.length"
						@onChange="handlePageChange($event, item)"></custom-pagination>
					<view class="btn-warpper text-center">
						<text :class="tabCurrent === 0 ? 'text-blue':'text-grey'"
							@click="doPay(item)">维修费用：{{ item.status>=2? '￥'+item.payPrice: "未完成" }}</text>
					</view>
				</uni-collapse-item>
			</uni-collapse>
		</view>
		<!-- 列表 end -->
		<!-- 登录提示 -->
		<app-login-modal></app-login-modal>
	</view>
</template>
<script>
	import mock from '@/common/mock/index';
	import {
		API_URL
	} from '@/env'
	import {
		mapMutations,
		mapActions,
		mapState
	} from 'vuex';
	export default {
		data() {
			return {
				// 最新展品轮播区的测试图'https://picsum.photos/500/300', 'https://picsum.photos/500/300', 'https://picsum.photos/500/300'
				imagesList: [],
				// 菜单
				meau: mock.index.meau,
				searchData: {
					repairOrder: ''
				},
				// 客服留言
				notices: mock.index.notices,
				// 报修tab数据
				tabList: ['未完成', '已完成'],
				// 报修tab当前选中项目
				tabCurrent: 0,
				imageUrl: '',
				// 报修数据
				list: []
			};
		},
		computed: {
			// 展示tabs对应状态的报修列表数据，未完成/已完成
			currentList() {
				return this.list;
			},
		},
		mounted() {
			this.init();
		},
		filters: {
			// 通过传入的status数字值，返回对应的字段出去
			getStatus: value => ['待寄回', '待检修', '待确认', '待维修', '待发货', '待收货', '完成'][value || 0] // 控制默认返回下标0的字段
		},
		// 下拉顶部刷新
		// 方法留着对接口的时候供参考
		onPullDownRefresh() {
			this.init();
		},
		created() {
			let that = this;
			this.imageUrl = API_URL.replace("/yingbao", "") + 'uploadFiles/image/'
			console.log(this.imageUrl)
			this.$api('afterSale.posterList', {}).then(res => {
				if (res.flag) {
					that.imagesList = res.data.A
				}
			});
		},
		methods: {
			onSearch() {
				this.init()
			},
			onInput() {
				this.init()
			},
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
			paste(item) {
				uni.setClipboardData({
					data: '联系人:' + item.contactPerson + ';联系电话:' + item.contactNumber + ";地址:" + item
						.contactAddress + ";"
				});
			},
			// 监听分页器的变化，修改当前单号下的页数
			handlePageChange(newPage, item) {
				item.page = newPage
			},
			// 切换tab页
			handletab(index) {
				this.tabCurrent = index;
				this.init();
			},
			// 路由跳转
			jump(path, params, index) {
				let that = this
				let obj = {
					...params
				};
				if (index == 3) {
					this.$api('afterSale.isEmployee', {}).then(res => {
						if (res.flag) {
							if (!res.data) {
								uni.showModal({
									title: '温馨提示',
									content: '该功能需绑定业务员，是否跳转绑定页面',
									success: function(res) {
										if (res.confirm) {
											that.$Router.push({
												path: '/pages/register/register',
												query: {}
											});
										} else if (res.cancel) {
											console.log('用户点击取消');
										}
									}
								});
							} else {
								// path路径必须以“/”开头
								if (path && path[0] === '/') {
									that.$Router.push({
										path: path,
										query: obj
									});
								}
							}
						}
					});
				} else {
					// path路径必须以“/”开头
					if (path && path[0] === '/') {
						this.$Router.push({
							path: path,
							query: obj
						});
					}
				}
			},
			doPay(item) {
				// 支付
				// 小程序中不支持在组件上通过表达式来动态绑定函数 
				if (this.tabCurrent === 0) {
					console.log(item)
					uni.showToast({
						title: '支付功能暂未开放',
						mask: true,
						icon: 'none',
						duration: 1500
					});
				}
				uni.requestPayment({
					provider: 'wxpay',
					timeStamp: '1691051498',
					nonceStr: '9aa7f065c6d94ae59de15c414670c507',
					package: 'prepay_id=wx031631387757011bf756a8d8a6998f0000',
					signType: 'RSA',
					paySign: 'pX3JPHiwZAzE3t0/RMtmJdKvIAc0oEkO2A3dMg6B9Z/ZcEcPXPcaaWmcLPwn5pNUMYjldOjQM6Rc6P4Yz1O0jx6+aXHj//3S7pU3/F6WYRPZDdCh3y9hRGS7oXvHker3SIqVx0/kiCC2fKcAI8QeAyM834/k2Xkq0Of8OgA0Hlxkx1GykuwU8y432I4ZaEHBabFWU4vLOJ0AwM8A67cxRC1Rd+SdqdcUTmd9v55XSZ8W/PZkHh8lb7mBJoWqrJ70apRE1YOx0a/gxTZklmy+8Xv5MNPM9p1Wtv1BLCScpOA/XmRPlyScg7nzQwViBCID8jhmmAf8jvCPMoBhcuWjmg==',
					success: function(res) {
						console.log(res)
					},
					fail: function(err) {
						if (err.errMsg !== "requestPayment:fail cancel") {

						} else {
							console.log('关闭支付')
						}
					}
				});
			},
			confirmReceipt(item) {
				let that = this
				// 确认收货
				that.$api('afterSale.receiving', {
					repairOrder: item.repairOrder,
					receivingDate: that.getDay('', 0).date
				}).then(res => {
					if (res.flag) {
						uni.showToast({
							title: res.msg,
							mask: true,
							icon: 'success',
							duration: 1500
						});
						that.init();
					}
				}).catch(err => {
					uni.showToast({
						icon: 'none',
						title: err.msg,
					});
				});
			},
			confirmRepair(item) {
				let that = this
				// 确认维修
				that.$api('afterSale.confirmPrice', {
					repairOrder: item.repairOrder,
					status: item.status
				}).then(res => {
					if (res.flag) {
						uni.showToast({
							title: res.msg,
							mask: true,
							icon: 'success',
							duration: 1500
						});
						that.init();
					}
				}).catch(err => {
					uni.showToast({
						icon: 'none',
						title: err.msg,
					});
				});
			},
			getDay(date, day) {
				var today = new Date();
				var targetday_milliseconds = today.getTime() + 1000 * 60 * 60 * 24 * day;
				today.setTime(targetday_milliseconds); //注意，这行是关键代码
				var tYear = today.getFullYear();
				var tMonth = today.getMonth();
				var tDate = today.getDate();
				var getDay = today.getDay();
				tMonth = this.doHandleMonth(tMonth + 1);
				tDate = this.doHandleMonth(tDate);
				var weeks = new Array('星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六');
				var week = weeks[getDay];
				return {
					day: tDate,
					week: week,
					date: tYear + '-' + tMonth + '-' + tDate
				};
			},
			doHandleMonth(month) {
				var m = month;
				if (month.toString().length == 1) {
					m = '0' + month;
				}
				return m;
			},
			// 初始化
			init() {
				// 停止当前页面下拉刷新。
				uni.stopPullDownRefresh();
				// 每个单号下的独立列表赋予当前选中页属性
				let that = this;
				that.list = []
				let params = that.searchData;
				params.status = that.tabCurrent == 1 ? 6 : that.tabCurrent
				this.$api('afterSale.repairList', params).then(res => {
					if (res.flag) {
						let data = res.data.slice(0, 19)
						this.list = data.map(item => Object.assign(item, {
							page: 0
						}));
						console.log(this.list)
					}
				});
			}
		}
	};
</script>

<style lang="scss">
	.search-input {
		height: 100rpx;
		border: 1rpx solid;
		margin: 5rpx;
	}

	.cuIcon-roundclosefill {
		color: #d5a65a;
		line-height: 100rpx;
	}

	.margin-box {
		margin-bottom: 20rpx;
	}

	/* 客服留言 */
	.notice-warpper {
		background: #ffffff;
		padding: 18rpx 24rpx;
		font-size: 28rpx;
	}

	/* 报修清单的tab标签页 */
	.list-tab {
		.tab-item {
			background-color: #ffffff;
			padding: 16rpx;

			&>.active {
				border-bottom-width: 2rpx;
				border-bottom-style: solid;
			}

			&>text {
				padding-bottom: 8rpx;
			}
		}
	}

	.btn-warpper {
		padding: 24rpx 0;
	}

	/* TODO 以下只在微信小程序中生效 */
	/* wx */
	.index-page>wx-swiper {
		min-height: 600rpx;
	}

	/deep/wx-swiper .wx-swiper-dot {
		width: 20rpx;
		height: 6rpx;
		// position: relative;
		// top: 20rpx;
	}

	/deep/wx-swiper .wx-swiper-dot-active {
		background-color: #000000;
		width: 40rpx;
		border-radius: 10rpx;
	}
</style>