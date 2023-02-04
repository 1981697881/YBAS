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
		<view class="address-warpper">
			<input-box label="产品条码" required>
				<view class="flex align-center">
					<input class="flex-sub" type="text" v-model="formData.productCode" placeholder="请输入或扫描产品包装盒上的条码" />
					<uni-icons type="search" size="20" color="#808080" @tap="handleScanBarCode"></uni-icons>
				</view>
			</input-box>
			<input-box label="产品名称"><input type="text" v-model="formData.productName" disabled /></input-box>
			<input-box label="产品型号"><input type="text" v-model="formData.productModel" disabled /></input-box>
			<input-box label="购买日期" required>
				<picker mode="date" v-model="formData.bounghtDate" @change="handleBounghtDateChange">
					<view class="flex align-center"><input type="text" disabled v-model="formData.productBuyDate"
							class="flex-sub" placeholder="请选择日期" /></view>
				</picker>
			</input-box>
			<input-box label="保修期至"><input type="text" v-model="formData.productGuarantee" class="flex-sub" disabled
					placeholder="自动计算,最少一年" /></input-box>
			<input-box label="省市区">
				<view class="flex align-center" @click="openPicker"><input type="text" disabled v-model="formData.province"
						class="flex-sub" placeholder="请填写省份市区" /></view>
			 <lotus-address v-on:choseVal="choseValue" :lotusAddressData="lotusAddressData"></lotus-address>
				</input-box>
			<!-- <input-box label="省市区">
				<input type="text" v-model="formData.provinceCity" placeholder="请填写省份市区" />
				<uni-data-picker placeholder="请选择地址" popup-title="请选择城市" :preload="true" :step-searh="true"
					self-field="code" parent-field="parent_code" collection="opendb-city-china" orderby="value asc"
					field="code as value, name as text, eq(['$type', 2]) as isleaf" @change="onchange"
					@nodeclick="onnodeclick"></uni-data-picker>
			</input-box> -->
			<input-box label="联系电话"><input type="text" v-model="formData.contactNumber" placeholder="请输入电话或座机号码" />
			</input-box>
			<input-box label="联系地址"><input type="text" v-model="formData.contactAddress" placeholder="请输入联系地址" />
			</input-box>
			<!-- 支持多选 -->
			<input-box label="购买凭证" required>
				<uni-file-picker :auto-upload="false" v-model="item.voucher" :limit="3" file-mediatype="image"
					mode="grid" file-extname="png,jpg" @select="select" @delete="delFile" />
			</input-box>
		</view>
	</view>
</template>

<script>
	import {
		API_URL
	} from '@/env'
	import address from '@/common/address.json';
	import mock from '@/common/mock/register';
	import lotusAddress from "@/components/Winglau14-lotusAddress/Winglau14-lotusAddress.vue";
	export default {
		components: {
			  "lotus-address":lotusAddress
		},
		data() {
			return {
				isReview: false,
				 lotusAddressData:{
				                visible:false,
				                provinceName:'',
				                cityName:'',
				                townName:'',
				            },
				            region:'',
				// 数据源
				formData: {
					productCode: '',
					productName: '',
					productModel: '',
					productBuyDate: '',
					productGuarantee: '',
					province: '',
					contactNumber: '',
					contactAddress: '',
					voucher: []
				},
				codeBarcode: {},
				// 必填项目，对应formData的字段，只需要写“验证提示内容”皆可
				formRules: {
					productCode: '产品条码不能为空',
					productBuyDate: '请选择购买日期',
					contactNumber: '联系电话不能为空',
					contactAddress: '联系地址不能为空',
				}
			};
		},
		watch: {
			'formData.productBuyDate'(value) {
				// TODO 其实只需要在getFullYear的基础上+1就好了 *.*
				const nowTime = new Date(value).getTime();
				// 时间加1年（365天）的毫秒数
				const newTime = nowTime + 1000 * 60 * 60 * 24 * 365;
				const newDate = new Date(newTime),
					year = newDate.getFullYear(),
					month = newDate.getMonth() + 1,
					day = newDate.getDate();
				this.formData.productGuarantee =
					`${year}-${month.toString().length == 1 ? '0' : ''}${month}-${day.toString().length == 1 ? '0' : ''}${day}`;
				console.log(value);
			}
		},
		mounted: function() {
			this.imageUrl = API_URL.replace("/yingbao","")+'uploadFiles/image/'
		},
		onLoad() {
			
		},
		methods: {
			 //打开picker
			        openPicker() {
			            this.lotusAddressData.visible = true;
						if(this.lotusAddressData.provinceName == ''){
							this.lotusAddressData.provinceName = '广东省';
							this.lotusAddressData.cityName = '广州市';
							this.lotusAddressData.townName = '白云区';
						}
			        },
			        //回传已选的省市区的值
			        choseValue(res){
			            //res数据源包括已选省市区与省市区code
			            console.log(res);
			            this.lotusAddressData.visible = res.visible;//visible为显示与关闭组件标识true显示false隐藏
			            //res.isChose = 1省市区已选 res.isChose = 0;未选
			            if(res.isChose){
			                this.lotusAddressData.provinceName = res.province;//省
			                this.lotusAddressData.cityName = res.city;//市
			                this.lotusAddressData.townName = res.town;//区
			                this.formData.province = `${res.province} ${res.city} ${res.town}`; //region为已选的省市区的值
			            }
			        },
			handleScanBarCode() {
				let that = this
				let resData = that.formData.productCode.split(';')
				that.$api('afterSale.productionMessage', {
					productBarcode: that.formData.productCode
				}).then(reso => {
					if (reso.flag && reso.data !=null) {
						let obj = {}
						obj.name = reso.data.productName;
						obj.model = reso.data.productModel;
						obj.barCode = this.formData.productCode;
						that.scanBarcode(obj);
						
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
					obj.barCode = that.formData.productCode;
					that.scanBarcode(obj);
				} else {
					that.$api('afterSale.productionMessage', {
						productBarcode: that.formData.productCode
					}).then(reso => {
						if (reso.flag) {
							let obj = {}
							obj.name = reso.data.productName;
							obj.model = reso.data.productModel;
							obj.barCode = this.formData.productCode;
							that.scanBarcode(obj);
						}
					});
				} */
			},
			scanBarcode(obj) {
				this.formData.productCode = obj.barCode;
				this.formData.productName = obj.name;
				this.formData.productModel = obj.model;
			},
			onchange(e) {
				console.log(e)
				let str = "";
				e.detail.value.forEach((item, index) => {
					if (index == 0) {
						str = item.text
					} else {
						str = str + "/" + item.text
					}

				})
				this.formData.province = str
				const value = e.detail.value;
			},
			onnodeclick(node) {},
			// 选择文件后触发 - 支持多选
			select(e) {
				let that = this
				// tempFiles - Array[Files]
				// 控制台查看该组件的files数据类型
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
							that.formData.voucher.push({
								path: that.imageUrl + data.data,
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
			delFile(e) {
				// tempFile - Object[Files]
				const {
					uuid
				} = e.tempFile;
				const {
					voucher
				} = this.formData;
				for (let i = 0; i < voucher.length; i++) {
					// 删除对应的file
					if (voucher[i].uuid === uuid) {
						voucher.splice(i, 1);
						return;
					}
				}
			},
			// 购买日期选择器
			handleBounghtDateChange: function(e) {
				console.log(this.codeBarcode)
				this.formData.productBuyDate = e.target.value;
			}
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
