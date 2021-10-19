<!-- 质保登记 -->
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
				<text class="input-label">购买日期</text>
				<view class="flex-sub flex align-center">
					<picker mode="date" :value="searchData.maxDate" @change="bindMaxDateChange">
						<view class="flex align-center">
							<input type="text" v-model="searchData.maxDate" class="flex-sub" placeholder="开始日期" />
							<!-- <text v-if="maxDate" class="text-clear text-blue">清空</text> -->
							<text v-if="searchData.maxDate" class="text-clear cuIcon-backdelete" @click.stop="handleSearchClear('searchData.maxDate')"></text>
						</view>
					</picker>
					<picker mode="date" :value="searchData.minDate" @change="bindMinDateChange">
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
			<view class="input-box" style="background: inherit;font-size:26rpx;">
				<view class="flex"><text class="flex-sub text-blue text-right cuIcon-add" @click="handleShare(true, 'edit')">登记</text></view>
			</view>
			<template v-if="list.length === 0">
				<view class="text-center text-grey">暂无数据，请重新查找</view>
			</template>
			<template v-for="(item, index) in list">
				<uni-collapse :key="index">
					<uni-collapse-item :title="'产品条码：' + item.barCode" showDelete @delete="handleDelList(item, index)">
						<view class="list-content">
							<input-box label="产品名称">
								<text>{{ item.name }}</text>
							</input-box>
							<input-box label="型号">
								<text>{{ item.model }}</text>
							</input-box>
							<input-box label="购买日期">
								<text>{{ item.bounghtDate | formatDate }}</text>
							</input-box>
							<input-box label="保修期至">
								<text>{{ item.expireDate | formatDate }}</text>
							</input-box>
							<input-box label="省市">
								<text>{{ item.provinceCity }}</text>
							</input-box>
							<input-box label="联系电话">
								<text>{{ item.phone }}</text>
							</input-box>
							<input-box label="联系地址">
								<text>{{ item.address }}</text>
							</input-box>
							<input-box label="购买凭证"><uni-file-picker v-model="item.certificateFiles" readonly /></input-box>
						</view>
					</uni-collapse-item>
				</uni-collapse>
			</template>
		</view>
		<!-- 列表end -->
		
		<!-- 登记界面的弹出层start -->
		<custom-share :show="shareStatus" title="新增登记" @close="handleShare" @rtClick="handleScan('edit')">
			<template slot="footer">
				<view class="share-footer text-blue" @click="submit">提交</view>
			</template>
			<template slot="title-right">
				<uni-icons type="scan" color="#808080" size="28"></uni-icons>
			</template>
			<register-form ref="register-form" />
		</custom-share>
		<!-- 登记界面的弹出层end -->
	</view>
</template>

<script>
import mock from '@/common/mock/register';
import registerForm from './components/register-form';

export default {
	components: {
		registerForm,
		
	},
	data() {
		return {
			// 查找的数据集
			searchData: {
				// 产品条码
				barCode: '',
				// 购买日期-最大日期
				maxDate: null,
				// 购买日期-最小日期
				minDate: null,
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
		formatDate: dateValue => {
			const date = new Date(dateValue);
			return `${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()}`;
		}
	},
	watch: {},

	mounted() {},
	methods: {
		// 登记界面的表单提交
		submit() {
			// 获取表单data，rules
			const { formData, formRules } = this.$refs['register-form'];
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
			showToast('提交成功');
			this.shareStatus = false;
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
		bindMaxDateChange: function(e) {
			this.searchData.maxDate = e.target.value;
		},
		// 选择购买日期 - 结束日期
		bindMinDateChange: function(e) {
			this.searchData.minDate = e.target.value;
		},
		// 点击扫描图标
		handleScan(action){
			if(action === 'edit'){
				// 在登记界面点击的扫描图标
			} else {
				// 默认点击列表页的扫描图标
			}
			console.log('点击扫描图标')
		},
		// 查询条件的所有输入框一键清空内容功能
		// key 对应的v-model键名
		// 接受数据类型'keyname' | 'keyname.keyname' | 'keyname.keyname.keyname'......
		handleSearchClear(key) {
			const keyArr = key.split('.')
			if (keyArr.length > 1) {
				let data = this;
				for(let i in keyArr){
					const k = keyArr[i]
					if(i*1 === keyArr.length-1){
						data[keyArr[keyArr.length-1]] = ''
					}else{
						data = data[k]
					}
					
				}
			}
		},
		// api - 请求列表
		getList(){
			uni.showLoading({
				title: '查找中',
			})
			this.list = mock.index.list
			console.log(this.list)
			setTimeout(()=>{
				uni.hideLoading()
			},1000)
		},
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
