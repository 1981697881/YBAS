<!-- 我要报修 -->
<template>
	<view>
		<!-- 搜索条件start -->
		<view class="title-warpper">
			<view class="input-box flex">
				<text class="input-label">产品条码</text>
				<input type="text" v-model="searchData.barCode" class="flex-sub" placeholder="请手动输入或者扫描" />
				<text v-if="searchData.barCode" class="text-clear cuIcon-backdelete" @click.stop="handleSearchClear('searchData.barCode')"></text>
				<uni-icons type="scan" color="#808080" size="28" @click="handleScan"></uni-icons>
			</view>
			<view class="input-box flex">
				<text class="input-label">维修单号</text>
				<input type="text" v-model="searchData.fixCode" class="flex-sub" placeholder="请手动输入" />
				<text v-if="searchData.fixCode" class="text-clear cuIcon-backdelete" @click.stop="handleSearchClear('searchData.fixCode')"></text>
			</view>
			<view class="input-box flex">
				<text class="input-label">报修日期</text>
				<view class="flex-sub flex align-center">
					<picker mode="date" :value="searchData.maxDate" @change="handleMaxDateChange">
						<view class="flex align-center">
							<input type="text" v-model="searchData.maxDate" class="flex-sub" placeholder="开始日期" />
							<!-- <text v-if="maxDate" class="text-clear text-blue">清空</text> -->
							<text v-if="searchData.maxDate" class="text-clear cuIcon-backdelete" @click.stop="handleSearchClear('searchData.maxDate')"></text>
						</view>
					</picker>
					<picker mode="date" :value="searchData.minDate" @change="handleMinDateChange">
						<view class="flex align-center">
							<input type="text" v-model="searchData.minDate" class="flex-sub" placeholder="结束日期" />
							<!-- <text v-if="minDate" class="text-clear text-blue">清空</text> -->
							<text v-if="searchData.minDate" class="text-clear cuIcon-backdelete" @click.stop="handleSearchClear('searchData.minDate')"></text>
						</view>
					</picker>
				</view>
			</view>
			<view class="input-box text-blue text-center" @click="getList">查找</view>
		</view>
		<!-- 搜索条件end -->

		<!-- 列表start -->
		<view class="list-warpper">
			<view class="input-box text-right" style="background: inherit;font-size:26rpx;">
				<text class="flex-sub text-blue text-right cuIcon-add" @click="handleShare(true, 'edit')">我要报修</text>
			</view>
			<template v-if="list.length === 0">
				<view class="text-center text-grey">暂无数据，请重新查找</view>
			</template>
			<template v-for="(item, index) in list">
				<uni-collapse :key="index">
					<uni-collapse-item :title="'维修单号：' + item.fixCode" :showArrow="true">
						<template slot="title-right">
							<view :class="isPayStatus(item) ? 'text-green' : 'text-red'">{{ item.payStatus | filterPayStatus }}</view>
						</template>
						<view class="list-content">
							<view class="flex align-start">
								<view class="flex-sub">
									<input-box label="产品条码">
										<text>{{ item.list[item.currentPage].barCode }}</text>
									</input-box>
									<input-box label="产品名称">
										<text>{{ item.list[item.currentPage].name }}</text>
									</input-box>
									<input-box label="型号">
										<text>{{ item.list[item.currentPage].model }}</text>
									</input-box>
									<input-box label="购买日期">
										<text>{{ item.list[item.currentPage].bounghtDate | formatDate }}</text>
									</input-box>
									<input-box label="保修期至">
										<text>{{ item.list[item.currentPage].expireDate | formatDate }}</text>
									</input-box>
									<input-box label="故障说明">
										<text>{{ item.list[item.currentPage].faultDesc }}</text>
									</input-box>
									<input-box label="维修说明">
										<text>{{ item.list[item.currentPage].fixDesc }}</text>
									</input-box>
									<input-box label="维修状态">
										<text>{{ item.list[item.currentPage].fixStatus | filterFixStatus }}</text>
									</input-box>
									<input-box label="寄件信息"><text class="text-blue">点击查看</text></input-box>
								</view>
								<view class="" style="color: #bbbbbb;">
									进入详情
									<uni-icons type="arrowright" color="#bbbbbb"></uni-icons>
								</view>
							</view>
							<!-- 列表项分页器start -->
							<view class="flex">
								<uni-icons class="flex-sub text-center" type="arrowleft" @click="handlePageChange('prev', item)"></uni-icons>
								<text class="">{{ item.currentPage + 1 }}/{{ item.list.length }}</text>
								<uni-icons class="flex-sub text-center" type="arrowright" @click="handlePageChange('next', item)"></uni-icons>
							</view>
							<!-- 列表项分页器end -->
						</view>
					</uni-collapse-item>
					<view class="flex uni-collapse-footer">
						<view class="flex-sub text-blue text-center" @click="jump('/pages/detail/repairPayDetail', { fixCode: item.fixCode })">查看详细报价</view>
						<view class="flex-sub text-center" :class="isPayStatus(item) ? 'text-grey' : 'text-blue'" @click="doPay(item)">支付维修费用：{{ item.price }}</view>
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
				<view class="flex">
					<text class="flex-sub share-footer text-white bg-blue cuIcon-add" @click="$refs['repair-form'].addformData">追加产品</text>
					<view class="flex-sub share-footer text-blue" @click="submit">提交</view>
				</view>
			</template>
		</custom-share>
		<!-- 登记界面的弹出层end -->
	</view>
</template>

<script>
import repairForm from './components/repair-form';

export default {
	components: {
		repairForm
	},
	data() {
		return {
			// 查找的数据集
			searchData: {
				// 产品条码
				barCode: '',
				// 维修单号
				fixCode: '',
				// 当前日期
				date: '',
				// 购买日期-最大日期
				maxDate: null,
				// 购买日期-最小日期
				minDate: null
			},
			// 查找的列表数据
			list: [],
			// 登记界面弹出层
			shareStatus: false
			// 登记界面是否可编辑
		};
	},
	computed: {},
	filters: {
		filterFixStatus: dataValue => ['待寄回', '待检修', '待维修', '待发货', '待收货', '完成'][dataValue],
		filterPayStatus: dataValue => ['未支付', '已支付'][dataValue],
		formatDate: dateValue => {
			const date = new Date(dateValue);
			return `${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()}`;
		}
	},
	watch: {},

	mounted() {
	},
	methods: {
		// 该维修单是否已支付，传入当前维修单的data；0 未支付。1 已支付
		isPayStatus: item => item.payStatus == 1,
		// 登记界面的表单提交
		submit() {
			// 获取表单data，rules
			const { formData, formRules, contactData } = this.$refs['repair-form'];
			console.log(formData);
			const showToast = function(value) {
				uni.showToast({
					title: value,
					mask: true,
					icon: 'none',
					duration: 1500
				});
			};
			// 该页面的formData是Array类型

			for (let i = 0; i < formData.length; i++) {
				const item = formData[i];
				for (let key in formRules) {
					if (typeof item[key] === 'string') {
						if (item[key] === '') {
							showToast(`第${i + 1}条产品：${formRules[key]}`);
							return false;
						}
					}
					if (typeof item[key] === 'object') {
						console.log(JSON.stringify(item));
						if (JSON.stringify(item[key]) === '{}' || JSON.stringify(item[key]) === '[]') {
							showToast(`第${i + 1}条产品：${formRules[key]}`);
							return false;
						}
					}
				}
			}
			showToast('提交成功');
			this.shareStatus = false;
		},
		// 支付维修费用
		doPay(item) {
			if (!this.isPayStatus(item)) {
				// ...
				uni.showToast({
					title: '支付成功',
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
		handleDelList(item, index) {
			// item为当前要删除的list.data
			uni.showModal({
				title: `删除提示`,
				content: `删除条码为：${item.barCode}`,
				success: res => {
					if (res.confirm) {
						// 确认删除
						this.list.splice(index, 1);
					} else if (res.cancel) {
					}
				}
			});
		},
		// 选择购买日期 - 开始日期
		handleMaxDateChange: function(e) {
			this.searchData.maxDate = e.target.value;
		},
		// 选择购买日期 - 结束日期
		handleMinDateChange: function(e) {
			this.searchData.minDate = e.target.value;
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
				if (item.currentPage < item.list.length - 1) {
					item.currentPage++;
				}
			}
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
		// 获取到list数据后，给list添加分页要用的字段
		// 必须要用set 将新属性加入到vue观察者中
		setListPage() {
			this.list.map((item, index) => {
				this.$set(this.list[index], 'currentPage', 0);
			});
		},
		// api - 请求列表
		getList() {
			uni.showLoading({
				title: '查找中'
			});
			setTimeout(() => {
				uni.hideLoading();
			}, 1000);
			this.list = [
				{
					fixCode: 'BX202108010001',
					price: '90',
					payStatus: 0,
					list: [
						{
							barCode: '202108010001',
							name: '直发器',
							model: 'JPA40W',
							bounghtDate: 'Mon Sep 13 2021 23:53:02 GMT+0800 (中国标准时间)',
							expireDate: 'Mon Sep 13 2021 23:53:02 GMT+0800 (中国标准时间)',
							faultDesc: '插电没反应',
							fixDesc: '维修说明',
							fixStatus: 0
						},
						{
							barCode: '202108010002',
							name: '直发器',
							model: 'JPA40W',
							bounghtDate: 'Mon Sep 13 2021 23:53:02 GMT+0800 (中国标准时间)',
							expireDate: 'Mon Sep 13 2021 23:53:02 GMT+0800 (中国标准时间)',
							faultDesc: '加热慢',
							fixDesc: '维修说明2',
							fixStatus: 0
						}
					]
				},
				{
					fixCode: 'BX202108010001',
					price: '90',
					payStatus: 1,
					list: [
						{
							barCode: '202108010001',
							name: '直发器',
							model: 'JPA40W',
							bounghtDate: 'Mon Sep 13 2021 23:53:02 GMT+0800 (中国标准时间)',
							expireDate: 'Mon Sep 13 2021 23:53:02 GMT+0800 (中国标准时间)',
							faultDesc: '插电没反应',
							fixDesc: '维修说明',
							fixStatus: 0
						}
					]
				}
			];
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
