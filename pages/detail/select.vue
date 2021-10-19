<template>
	<view class="flex flex-direction">
		<view class="category-warpper">
			<input-box label="当前选择">
				<picker :value="index" :range="categoryList" @change="handleCategory">
					<view class="flex">
						<view class="text-bold flex-sub">{{ categoryList[index] }}</view>
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
			<template v-for="(item, index) in list">
				<uni-collapse :key="index">
					<uni-collapse-item :title="'配件编码：' + item.code">
						<view class="list-content">
							<input-box label="配件名称">
								<text>{{ item.name }}</text>
							</input-box>
							<input-box label="版本号">
								<text>{{ item.version }}</text>
							</input-box>
							<input-box label="销售价格">
								<text>{{ item.price }}</text>
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
		</view>
	</view>
</template>

<script>

export default {
	components: {
		
	},
	data() {
		return {
			categoryList: ['所有', '电吹风系列', '直/卷发器系列', '烫发机JPB001-2'],
			// 列表数据
			list: [],
			index: 0
		};
	},
	mounted() {
		this.getList();
	},
	methods: {
		handleCategory(e) {
			this.index = e.detail.value;
			this.getList();
		},
		getList() {
			// this.index
			uni.showLoading({
				title: '加载中'
			});
			setTimeout(() => {
				uni.hideLoading();
			}, 1000);
			// 测试数据
			this.list = [{
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
			}];
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

/deep/
.input-box .input-label{
	padding-left: 0;
}
</style>
