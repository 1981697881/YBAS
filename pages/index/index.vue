<!-- 首页 -->
<template>
	<view class="index-page">
		<!-- 轮播图 start -->
		<swiper :indicator-dots="true" :autoplay="false" :interval="3000" :duration="1000" :indicator-active-color="'#ffffff'">
			<swiper-item v-for="(item, index) in imagesList" :key="index"><image style="width: 100%; height: 100%;" :src="item" mode="scaleToFill"></image></swiper-item>
		</swiper>
		<!-- 轮播图 end -->

		<!-- 菜单入口 start -->
		<view class="margin-box">
			<u-grid :col="3">
				<!--  -->
				<u-grid-item v-for="(item, index) in meau" :custom-style="{ padding: '0', textAlign: 'center' }" :key="index">
					<!-- <uni-icons :type="item.icon"></uni-icons> -->
					<view style="padding: 60rpx 0;"><button v-if="index<4" @tap="jump(item.path,{},index)" class="cu-btn round shadow line-black">{{ item.name }}</button><button v-else open-type="contact" class="cu-btn round shadow line-black">{{ item.name }}</button></view>
				</u-grid-item>
			</u-grid>
		</view>
		<!-- 菜单入口 end -->

		<!-- 通知 start -->
		<custom-title title="客服留言">
			<view class="text-blue"><text style="margin-right: 6rpx;">查看更多</text></view>
		</custom-title>
		<view class="notice-warpper flex flex-direction margin-box">
			<view class="flex">
				<u-notice-bar
					v-if="notices.length"
					class="flex-sub"
					:autoplay="false"
					:mode="'vertical'"
					:list="notices"
					:bgColor="'#fff'"
					:color="'#000'"
					:duration="5000"
					:close-icon="false"
					:volumeIcon="false"
					:padding="0"
				></u-notice-bar>
			</view>
		</view>
		<!-- 通知 end -->

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
					<view class="list-item">
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
							<text>{{ item.repairDetailList[item.page].status | getStatus }}</text>
						</input-box>
					</view>
					<custom-pagination class="margin-box" :page="item.page" :total="item.repairDetailList.length" @onChange="handlePageChange($event, item)" ></custom-pagination>
					<view class="btn-warpper text-center">
						<text :class="tabCurrent === 0 ? 'text-blue':'text-grey'" @click="doPay(item)">支付维修费用：{{ item.status>=3? '￥'+item.payPrice: "未完成" }}</text>
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
import { mapMutations, mapActions, mapState } from 'vuex';
export default {
	data() {
		return {
			// 最新展品轮播区的测试图
			imagesList: ['https://picsum.photos/500/300', 'https://picsum.photos/500/300', 'https://picsum.photos/500/300'],
			// 菜单
			meau: mock.index.meau,
			// 客服留言
			notices: mock.index.notices,
			// 报修tab数据
			tabList: ['未完成', '已完成'],
			// 报修tab当前选中项目
			tabCurrent: 0,
			// 报修数据
			list: null
		};
	},
	computed: {
		// 展示tabs对应状态的报修列表数据，未完成/已完成
		currentList() {
			return this.list && this.list.reduce((prev, item) => prev.concat(item.status == this.tabCurrent.toString() ? item : []), []);
		},
	},
	mounted() {
		this.init();
	},
	filters: {
		// 通过传入的status数字值，返回对应的字段出去
		getStatus: value => ['待发货', '已发货', '已完成'][value || 0] // 控制默认返回下标0的字段
	},
	// 下拉顶部刷新
	// 方法留着对接口的时候供参考
	onPullDownRefresh() {
		this.init();
	},
	created() {
		let that = this;
		this.$api('afterSale.posterList', {
		}).then(res => {
			if (res.flag) {
				that.imagesList = res.data.A
			}
		});
	},
	methods: {
		// 监听分页器的变化，修改当前单号下的页数
		handlePageChange(newPage,item) {
			item.page = newPage
		},
		// 切换tab页
		handletab(index) {
			this.tabCurrent = index;
			this.init();
		},
		// 路由跳转
		jump(path, params,index) {
			let that = this
			let obj = { ...params };
			if(index == 3){
				this.$api('afterSale.isEmployee', {
				}).then(res => {
					if (res.flag) {
						if(!res.data){
							uni.showModal({
								title: '温馨提示',
								content: '该功能需绑定业务员，是否跳转绑定页面',
								success: function(res) {
									if (res.confirm) {
										that.$Router.push({
											path: '/pages/index/register',
											query: {}
										});
									} else if (res.cancel) {
										console.log('用户点击取消');
									}
								}
							});
						}else{
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
			}else{
				// path路径必须以“/”开头
				if (path && path[0] === '/') {
					this.$Router.push({
						path: path,
						query: obj
					});
				}
			}
		},
		doPay(item){
			// 支付
			// 小程序中不支持在组件上通过表达式来动态绑定函数 
			if(this.tabCurrent === 0){
				console.log(item)
			}
		},
		// 初始化
		init() {
			// 停止当前页面下拉刷新。
			uni.stopPullDownRefresh();
			// 每个单号下的独立列表赋予当前选中页属性
			let that = this;
			this.$api('afterSale.repairList', {
				status: that.tabCurrent == 1?5:that.tabCurrent
			}).then(res => {
				if (res.flag) {
					this.list = res.data.map(item => Object.assign(item, { page: 0 }));
				}
			});
		}
	}
};
</script>

<style lang="scss" >
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
		& > .active {
			border-bottom-width: 2rpx;
			border-bottom-style: solid;
		}
		& > text {
			padding-bottom: 8rpx;
		}
	}
}

.btn-warpper{
	padding: 24rpx 0;
}
/* TODO 以下只在微信小程序中生效 */
/* wx */
.index-page > wx-swiper {
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
