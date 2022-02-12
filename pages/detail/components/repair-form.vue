<!--
 * @Descripttion: 
 * @version: 
 * @Author: yeungxsheng
 * @Date: 2021-09-14 21:51:20
 * @LastEditors: yeungxsheng
 * @LastEditTime: 2021-09-14 22:51:09
-->
<template>
	<view style="padding: 32rpx 0;">
		<!-- 维修联系人及单号start -->
		<view class="address-warpper">
			<input-box label="维修单号">
				<text>{{ contactData.repairOrder || "自动生成"}}</text>
			</input-box>
			<view class="flex">
				<input-box class="flex-sub" label="联系人"><input type="text" v-model="contactData.contactPerson" />
				</input-box>
				<input-box class="flex-sub" label="电话"><input v-if="userInfo.phoneNumber" type="text" v-model="contactData.contactNumber" /><button
						v-if="!userInfo.phoneNumber" class="cu-btn round lines-red sm" open-type="getPhoneNumber"
						@getphonenumber="bindPhone">获取</button></input-box>
			</view>
			<input-box label="邮寄地址">
				<input type="text" v-model="contactData.contactAddress" />
				<!-- <textarea v-model="contactData.contactAddr" placeholder="请填写邮寄地址" /> -->
			</input-box>
		</view>
		<!-- 维修联系人及单号end -->

		<!-- 分页器start -->
		<view class="pagination-warpper flex" v-if="formData.length>0">
			<uni-icons class="flex-sub text-center" type="arrowleft" @tap="handlePageChange('prev')"></uni-icons>
			<text class="">{{ currentPage + 1 }}/{{ formData.length }}</text>
			<uni-icons class="flex-sub text-center" type="arrowright" @tap="handlePageChange('next')"></uni-icons>
		</view>
		<!-- 分页器end -->
		<block v-for="(item, index) in formData" :key="index">
			<view class="form-warpper" v-if="currentPage == index">
				<input-box label="产品条码" required>
					<view class="flex align-center">
						<input class="flex-sub" type="text" v-model="item.productCode" placeholder="请输入或扫描产品包装盒上的条码" />
						<uni-icons type="scan" color="#808080" @tap="handleScanBarCode(item)"></uni-icons>
					</view>
				</input-box>
				<input-box label="产品名称"><input type="text" v-model="item.productName" disabled /></input-box>
				<input-box label="产品型号"><input type="text" v-model="item.productModel" disabled /></input-box>
				<input-box label="购买日期" required>
					<picker mode="date" v-model="item.productBuyDate" @change="handleBounghtDateChange($event,item)">
						<view class="flex align-center"><input type="text" v-model="item.productBuyDate"
								class="flex-sub" placeholder="请选择日期" /></view>
					</picker>
				</input-box>
				<input-box label="保修期至"><input type="text" v-model="item.productGuarantee" class="flex-sub" disabled
						placeholder="自动计算,最少一年" /></input-box>
				<input-box label="故障说明"><textarea v-model="item.faultDescription" placeholder="填写故障说明" /></input-box>
				<input-box label="售后要求" required>
					<picker v-model="item.salesRequirements" :range="afterSalesList" @change="handleAfterSales($event,item)">
						<view class="flex">
							<view class=" flex-sub">{{ afterSalesList[item.salesRequirements] }}</view>
							<uni-icons type="arrowdown" color="#808080"></uni-icons>
						</view>
					</picker>
				</input-box>
				<!-- 支持多选 -->
				<input-box label="故障图片" v-if="currentPage == index">
					<uni-file-picker :auto-upload="false" v-model="item.faultPhoto" :limit="3" file-mediatype="image" mode="grid" file-extname="png,jpg"
						@select="select($event, 'fault',item)" @delete="delFile($event, 'fault',item)" />
				</input-box>
				<!-- 支持多选 -->
				<input-box label="购买凭证" v-if="currentPage == index">
					<uni-file-picker :auto-upload="false" v-model="item.voucher" :limit="3" file-mediatype="image" mode="grid" file-extname="png,jpg"
						@select="select($event, 'certificate',item)" @delete="delFile($event, 'certificate',item)" />
				</input-box>
				<button v-if="currentPage == index" class="cu-btn round line-red shadow"
					@tap="delItem(index,item)">移除当前行</button>
			</view>
		</block>
	</view>
</template>
<script>
	import {
		mapMutations,
		mapActions,
		mapState
	} from 'vuex';
	import {
		API_URL
	} from '@/env'
	import mock from '@/common/mock/register';
	export default {
		components: {
		},
		data() {
			return {
				// 联系信息数据源
				contactData: {
					repairOrder: '',
					contactPerson: '',
					contactNumber: '',
					contactAddress: ''
				},
				// 产品表单数据源
				formData: [],
				formDataCopy: {
					productCode: '',
					productName: '',
					productModel: '',
					productBuyDate: '',
					productGuarantee: '',
					faultDescription: '',
					salesRequirements: 0,
					faultPhoto: [],
					voucher: []
				},
				// 当前页码数
				currentPage: 0,
				// 售后要求选择器数据
				afterSalesList: ['维修', '退换'],
				// 必填项目，对应formData的字段，只需要写“验证提示内容”皆可
				formRules: {
					productCode: '产品条码不能为空',
					productBuyDate: '请选择购买日期'
				}
			};
		},
		computed: {
			...mapState({
				userInfo: state => state.user.userInfo,
			}),
			// 当前选择的第n个产品数据
			proData: function() {
				return this.formData[this.currentPage]
			}
		},
		watch: {
			// 购买日期选择后，自动填写上保修期的时间，默认没从条码带出来的话，为1年
			'proData.bounghtDate'(value) {
				if (!value) return
				// TODO 其实只需要在getFullYear的基础上+1就好了 *.*
				const nowTime = new Date(value).getTime();
				// 时间加1年（365天）的毫秒数
				const newTime = nowTime + 1000 * 60 * 60 * 24 * 365;
				const newDate = new Date(newTime),
					year = newDate.getFullYear(),
					month = newDate.getMonth() + 1,
					day = newDate.getDate();
				this.proData.expireDate =
					`${year}-${month.toString().length == 1 ? '0' : ''}${month}-${day.toString().length == 1 ? '0' : ''}${day}`;
			}
		},
		created: function() {
			// 将副本字段引用到表单data中
			// 需要深拷贝，不然.push = 引用this.formDataCopy
			/* this.formData.push(JSON.parse(JSON.stringify(this.formDataCopy))) */
			this.contactData.contactPerson = this.userInfo.username;
			this.contactData.contactNumber = this.userInfo.phoneNumber;
		},
		mounted: function() {
		},
		methods: {
			...mapActions(['getUserDetails']),
			handleScanBarCode(item){
				let that = this;
				uni.scanCode({
					success: function(res) {
						item.productCode = res.result
						that.$api('afterSale.productionMessage', {productBarcode: res.result}).then(res => {
							if (res.flag) {
								item.productName = res.data.productName
								item.productModel = res.data.productModel
							}
						});
					}
				});
			},
			delItem(index, item) {
				let that = this;
				uni.showModal({
					title: '温馨提示',
					content: '是否删除，'+item.productName,
					success: function(res) {
						if (res.confirm) {
							that.formData.splice(index, 1);
						} else if (res.cancel) {
							console.log('用户点击取消');
						}
					}
				});
			},
			bindPhone(e) {
				let me = this;
				me.$api('user.getWxMiniPhoneNumber', {
					sessionKey: uni.getStorageSync('session_key'),
					openid: uni.getStorageSync('openid'),
					encryptedData: e.detail.encryptedData,
					iv: e.detail.iv
				}).then(res => {
					if (res.flag) {
						me.getUserDetails();
					}
				});
			},
			
			// 选择文件后触发 - 支持多选
			select(e, action, val) {
				let that = this
				// tempFiles - Array[Files]
				// 控制台查看该组件的files数据类型
				// console.log('选择文件：', e);
				e.tempFiles.map((item, index) => {
					uni.uploadFile({
						url: API_URL + 'file/imgUpload',
						filePath: item.url,
						name: 'imgS',
						header: {
							Authorization: uni.getStorageSync('token')
						},
						success: function(uploadFileRes) {
							let data = JSON.parse(uploadFileRes.data);
							if (action === 'fault') {
								// 故障图片
								if(! val.faultPhoto instanceof Array){
									val.faultPhoto = []
								}
								let actionData = val.faultPhoto;
								actionData.push({
									file: API_URL+data.data,
									uuid: data.data
								});
							} else if (action === 'certificate') {
								// 凭证图片
								if(! val.voucher instanceof Array){
									val.voucher = []
								}
								let actionData = val.voucher;
								actionData.push({
									file: API_URL+data.data,
									uuid: data.data
								});
							}
							uni.showToast({
								icon: 'success',
								title: data.msg
							});
						},
						fail: err => {
							console.log('uploadImage fail', err);
							uni.showModal({
								content: err.errMsg,
								showCancel: false
							});
						}
					});
				});
			},
			// 文件从列表移除时触发
			delFile(e, action, val) {
				// tempFile - Object[Files]
				const {
					url
				} = e.tempFile;
				// 需要操作的目标对象
				if (action === 'fault') {
					// 故障图片
					let actionData = val.faultPhoto;
					for (let i = 0; i < actionData.length; i++) {
						// 删除对应的file
						if (actionData[i].uuid === uuid) {
							actionData.splice(i, 1);
							return;
						}
					}
				} else if (action === 'certificate') {
					// 凭证图片
					let actionData = val.voucher;
					for (let i = 0; i < actionData.length; i++) {
						// 删除对应的file
						if (actionData[i].uuid === url) {
							actionData.splice(i, 1);
							return;
						}
					}
				}
				
			},
			// 追加产品
			addformData() {
				// 不用深拷贝的话，添加2个数据以上就会无限复制第二条数据
				const data = JSON.parse(JSON.stringify(this.formDataCopy))
				this.$set(this.formData, this.formData.length, data)
				this.currentPage = this.formData.length - 1
			},
			// 监听切换页
			/**
			 * @param {Object} action 上一页/下一页
			 */
			handlePageChange(action) {
				if (action === 'prev') {
					// 上一页
					if (this.currentPage > 0) {
						this.currentPage--;
					}
				} else if (action === 'next') {
					// 下一页
					if (this.currentPage < this.formData.length - 1) {
						this.currentPage++;
					}
				}
			},
			// 售后要求选择器
			handleAfterSales: function(e,item) {
				item.salesRequirements = e.target.value;
			},
			// 购买日期选择器
			handleBounghtDateChange: function(e,item) {
				item.productBuyDate = e.target.value;
				// TODO 其实只需要在getFullYear的基础上+1就好了 *.*
				const nowTime = new Date(e.target.value).getTime();
				// 时间加1年（365天）的毫秒数
				const newTime = nowTime + 1000 * 60 * 60 * 24 * 365;
				const newDate = new Date(newTime),
					year = newDate.getFullYear(),
					month = newDate.getMonth() + 1,
					day = newDate.getDate();
				item.productGuarantee =
					`${year}-${month.toString().length == 1 ? '0' : ''}${month}-${day.toString().length == 1 ? '0' : ''}${day}`;
			},
		}
	};
</script>

<style lang="scss" scoped>
	.address-warpper {
		// border-bottom: 2rpx #cccccc dashed;
	}

	.form-warpper {
		overflow-y: scroll;
		height: 530rpx;
		max-height: 300px;
	}

	.pagination-warpper {
		padding: 16rpx 0;
		margin-bottom: 16rpx;
		border-bottom: 2rpx #dddddd solid;
	}
</style>
