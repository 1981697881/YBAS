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
		<!-- 表单的父表start -->
		<view class="address-warpper" v-if="isEdit">
			<input-box label="出库单号">
				<view class="flex align-center">
					<input class="flex-sub" type="text" v-model="customData.retrievalOrder" placeholder="请输入或扫描出库单号"
						:disabled="!isEdit" />
					<uni-icons type="scan" size="20" color="#808080" @tap="handleScanOut"></uni-icons>
				</view>
			</input-box>
			<input-box label="装箱码">
				<view class="flex align-center">
					<input class="flex-sub" type="text" v-model="customData.productPackcode" placeholder="请输入或扫描装箱码"
						:disabled="!isEdit" />
					<uni-icons type="scan" size="20" color="#808080" @tap="handleScanInbox"></uni-icons>
				</view>
			</input-box>
		</view>
		<!-- 表单的父表end -->
		<!-- 分页器start -->
		<view class="pagination-warpper flex" v-if="formData.length>0">
			<uni-icons class="flex-sub text-center" type="arrowleft" @tap="handlePageChange('prev')"></uni-icons>
			<text class="">{{ currentPage + 1 }}/{{ formData.length }}</text>
			<uni-icons class="flex-sub text-center" type="arrowright" @tap="handlePageChange('next')"></uni-icons>
		</view>
		<!-- 分页器end -->
		<block v-for="(item, index) in formData" :key="index">
			<!-- 表单的子表-多个start -->
			<view class="form-warpper" v-if="currentPage == index">
				<input-box label="产品条码" required>
					<view class="flex align-center">
						<input class="flex-sub" type="text" v-model="item.productBarcode" placeholder="请输入或扫描产品包装盒上的条码"
							:disabled="!isEdit" />
						<uni-icons v-if="isEdit" size="20" type="scan" color="#808080" @tap="handleScanBarCode(item)"></uni-icons>
					</view>
				</input-box>
				<input-box label="产品名称"><input type="text" v-model="item.productName" placeholder="根据条码自动填充" disabled />
				</input-box>
				<input-box label="产品型号"><input type="text" v-model="item.productModel" placeholder="根据条码自动填充"
						disabled /></input-box>
			</view>
			<!-- 支持多选 -->
			<input-box label="相关图片" v-if="currentPage == index">
				<uni-file-picker :readonly="!isEdit" :auto-upload="false" v-model="item.photos" :disabled="!isEdit" :limit="3" file-mediatype="image"
					mode="grid" file-extname="png,jpg" @select="select($event, 'fault',item)"
					@delete="delFile($event, 'fault',item)" />
			</input-box>
			<button v-if="currentPage == index&& isEdit" class="cu-btn round line-red shadow"
				@tap="delItem(index,item)">移除当前行</button>
			<!-- 表单的子表-多个end -->
		</block>
	</view>
</template>

<script>
	import {
		API_URL
	} from '@/env'
	import mock from '@/common/mock/register';
	import uniFilePicker from './uni-file-picker/uni-file-picker.vue';
	export default {
		components: {uniFilePicker},
		props: {
			isEdit: {
				type: Boolean,
				default: false
			}
		},
		data() {
			return {
				// 联系信息数据源
				customData: {
					retrievalOrder: '',
					productPackcode: '',
					imageFiles: []
				},
				// 产品表单数据源
				formData: [],
				// 产品表单数据源的字段副本 
				formDataCopy: {
					productBarcode: '',
					productName: '',
					productModel: '',
					photos: []
				},
				list: [],
				// 当前页码数
				currentPage: 0,
				// 必填项目，对应formData的字段，只需要写“验证提示内容”皆可
				formRules: {
					productBarcode: '产品条码不能为空'
				}
			};
		},
		computed: {
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
			this.imageUrl = API_URL.replace("/yingbao","")+'uploadFiles/image/'
			// 将副本字段引用到表单data中
			// 需要深拷贝，不然.push = 引用this.formDataCopy
			//this.formData.push(JSON.parse(JSON.stringify(this.formDataCopy)))
		},
		mounted: function() {},
		methods: {
			delItem(index, item) {
				let that = this;
				uni.showModal({
					title: '温馨提示',
					content: '是否删除，' + item.productName,
					success: function(res) {
						if (res.confirm) {
							that.formData.splice(index, 1);
						} else if (res.cancel) {
							console.log('用户点击取消');
						}
					}
				});
			},
			// 选择文件后触发 - 支持多选
			select(e, action,val) {
				let that = this
				// tempFiles - Array[Files]
				// 控制台查看该组件的files数据类型
				// console.log('选择文件：', e);
				e.tempFiles.map((item, index) => {
					// TODO 根据业务需求修改所需要的数据，以下代码目前用作前端测试用
					uni.uploadFile({
						url: API_URL + 'file/imgUpload',
						filePath: item.url,
						name: 'imgS',
						header: {
							Authorization: uni.getStorageSync('token')
						},
						success: function(uploadFileRes) {
							let data = JSON.parse(uploadFileRes.data);
							val.photos.push({
								path: that.imageUrl+data.data,
								uuid: data.data
							});
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
			delFile(e, action,val) {
				// tempFile - Object[Files]
				const {
					uuid
				} = e.tempFile;
				let actionData = val.photos;
				for (let i = 0; i < actionData.length; i++) {
					// 删除对应的file
					if (actionData[i].uuid === uuid) {
						actionData.splice(i, 1);
						return;
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
			// 出库单号扫描
			handleScanOut() {
				let that = this;
				uni.scanCode({
					success: function(res) {
						console.log('条码类型：' + res.scanType);
						console.log('条码内容：' + res.result);
						that.customData.retrievalOrder = res.result
						that.customData.productPackcode = ""
						that.$api('afterSale.scanOutPutOrder', {
							outputOrder: res.result
						}).then(res => {
							if (res.flag) {
								res.data.forEach((item) => {
									item.retrievalOrder = that.customData.retrievalOrder
								})
								/* that.formData = [...res.data,...that.formData] */
								that.formData = res.data
								console.log(that.formData)
							}
						});
					}
				});
			},
			// 装箱码扫描
			handleScanInbox() {
				let that = this;
				uni.scanCode({
					success: function(res) {
						console.log('条码类型：' + res.scanType);
						console.log('条码内容：' + res.result);
						that.customData.productPackcode = res.result
						that.customData.retrievalOrder = ""
						that.$api('afterSale.scanPackcode', {
							packcode: res.result
						}).then(res => {
							if (res.flag) {
								res.data.forEach((item) => {
									item.productPackcode = that.customData.productPackcode
								})
								/* that.formData = [...res.data,...that.formData] */
								that.formData = res.data
							}
						});
					}
				});
			}, 
			// 产品条码扫描
			handleScanBarCode(item) {
				let that = this;
				uni.scanCode({
					success: function(res) {
						let resData = res.result.split(';')
						that.$api('afterSale.productionMessage', {
							productBarcode: res.result,
							status: 0,
						}).then(reso => {
							if (reso.flag) {
								let obj = {}
								item.productName = reso.data.productName;
								item.productModel = reso.data.productModel;
								item.productBarcode = res.result;
							}
						});
						/* if (resData.length > 1) {
							let obj = {}
							item.productName = resData[2];
							item.productModel = resData[1];
							item.productBarcode = res.result;
						} else {
							that.$api('afterSale.productionMessage', {
								productBarcode: res.result
							}).then(reso => {
								if (reso.flag) {
									let obj = {}
									item.productName = reso.data.productName;
									item.productModel = reso.data.productModel;
									item.productBarcode = res.result;
								}
							});
						} */
					}
				});
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
		max-height: 300px;
	}

	.pagination-warpper {
		padding: 16rpx 0;
		margin-bottom: 16rpx;
		border-bottom: 2rpx #dddddd solid;
	}
</style>
