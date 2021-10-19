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
					<view style="padding: 60rpx 0;" @click="jump(item.path)">{{ item.name }}</view>
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
				<uni-collapse-item :title="'维修单号：' + item.oid" :open="index === 0">
					<view class="list-item">
						<input-box label="产品条码">
							<text>{{ item.list[item.page].barCode }}</text>
						</input-box>
						<input-box label="产品名称">
							<text>{{ item.list[item.page].name }}</text>
						</input-box>
						<input-box label="型号">
							<text>{{ item.list[item.page].model }}</text>
						</input-box>
						<input-box label="维修状态">
							<text>{{ item.list[item.page].status | getStatus }}</text>
						</input-box>
					</view>
					<custom-pagination class="margin-box" :page="item.page" :total="item.list.length" @onChange="handlePageChange($event, item)" ></custom-pagination>
					<view class="btn-warpper text-center">
						<text :class="tabCurrent === 0 ? 'text-blue':'text-grey'" @click="doPay(item)">支付维修费用：￥{{ item.price }}</text>
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
			return this.list && this.list.reduce((prev, item) => prev.concat(item.status == this.tabCurrent ? item : []), []);
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
	/* created() {
		let that = this;
		this.$api('user.findUserAuthority', {
			openId: uni.getStorageSync('openid')
		}).then(res => {
			if (!res.flag) {
				uni.showToast({
					title: res.msg || '注册成功',
					icon: 'success',
					duration: 2000,
					mask: true,
					success: function() {
						setTimeout(function() {
							that.$Router.replace({
								path: '/pages/index/register',
								query: {}
							});
						}, 1000);
					}
				});
			}
		});
	}, */
	methods: {
		// 监听分页器的变化，修改当前单号下的页数
		handlePageChange(newPage,item) {
			item.page = newPage
		},
		// 切换tab页
		handletab(index) {
			this.tabCurrent = index;
		},
		// 路由跳转
		jump(path, params) {
			let obj = { ...params };
			// path路径必须以“/”开头
			if (path && path[0] === '/') {
				this.$Router.push({
					path: path,
					query: obj
				});
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
			this.list = mock.index.list.map(item => Object.assign(item, { page: 0 }));
			console.log(this.currentList);
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
