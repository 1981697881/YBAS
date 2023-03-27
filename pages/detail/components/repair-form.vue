<!--
 * @Descripttion: 
 * @version: 
 * @Author: yeungxsheng
 * @Date: 2021-09-14 21:51:20
 * @LastEditors: yeungxsheng
 * @LastEditTime: 2021-09-14 22:51:09
-->
<template>
	<view>
		<!-- 维修联系人及单号start -->
		<view class="address-warpper">
			<input-box label="维修单号">
				<text>{{ contactData.repairOrder || "自动生成"}}</text>
			</input-box>
			<view class="flex">
				<input-box class="flex-sub" label="联系人"><input type="text" v-model="contactData.contactPerson" />
				</input-box>
				<input-box class="flex-sub" label="电话"><input v-if="userInfo.phoneNumber" type="text"
						v-model="contactData.contactNumber" /><button v-if="!userInfo.phoneNumber"
						class="cu-btn round lines-red sm" open-type="getPhoneNumber"
						@getphonenumber="bindPhone">获取</button></input-box>
			</view>
			<input-box label="省市区">
				<view class="flex align-center" @click="openPicker"><input type="text" disabled v-model="contactData.province"
						class="flex-sub" placeholder="请填写省份市区" /></view>
			 <lotus-address v-on:choseVal="choseValue" :lotusAddressData="lotusAddressData"></lotus-address>
				</input-box>
			<!-- <input-box label="省市区">
				<input type="text" v-model="formData.provinceCity" placeholder="请填写省份市区" /> 
				<uni-data-picker v-model="contactData.provinceNum" placeholder="请选择地址" popup-title="请选择城市"
					:preload="true" :step-searh="true" self-field="code" parent-field="parent_code"
					collection="opendb-city-china" orderby="value asc"
					field="code as value, name as text, eq(['$type', 2]) as isleaf" @change="onchange"
					@nodeclick="onnodeclick"></uni-data-picker>
			</input-box>-->
			<input-box label="详细地址">
				<input type="text" v-model="contactData.contactAddress" />
				<!-- <textarea v-model="contactData.contactAddr" placeholder="请填写邮寄地址" /> -->
			</input-box>
			<input-box label="快递单号">
				<input type="text" v-model="contactData.courierNumber" />
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
						<input class="flex-sub" type="text" confirm-type="search" @confirm="confirmBarcode(item)"
							v-model="item.productCode" placeholder="请输入或扫描产品包装盒上的条码" />
						<uni-icons type="scan" size="20" color="#808080" @tap="handleScanBarCode(item)"></uni-icons>
					</view>
				</input-box>
				<input-box label="产品名称" required><input type="text" v-model="item.productName" /></input-box>
				<input-box label="产品型号" required><input type="text" v-model="item.productModel" /></input-box>
				<input-box label="购买日期" required>
					<uni-datetime-picker type="date" :clear-icon="false" :value="item.productBuyDate" @change="handleBounghtDateChange($event,item)" @maskClick="maskClick" />
					<!-- <picker mode="date" v-model="item.productBuyDate" @change="handleBounghtDateChange($event,item)">
						<view class="flex align-center"><input type="text" disabled v-model="item.productBuyDate"
								class="flex-sub" placeholder="请选择日期" /></view>
					</picker> -->
				</input-box>
				<input-box label="保修期至">
					<uni-datetime-picker type="date" :disabled="isScanCode" :clear-icon="false" :value="item.productGuarantee" @change="handleProductGuarantee($event,item)" @maskClick="maskClick" />
					<!-- <picker mode="date" :disabled="isScanCode" v-model="item.productGuarantee"
						@change="handleProductGuarantee($event,item)">
						<view class="flex align-center"><input type="text" disabled v-model="item.productGuarantee"
								class="flex-sub" placeholder="请选择日期" /></view>
					</picker> -->
					<!-- <input type="text" v-model="item.productGuarantee" class="flex-sub"
						:disabled="isScanCode" placeholder="自动计算,最少一年" /> -->
				</input-box>
				<input-box label="故障说明"><textarea style="width: auto;" v-model="item.faultDescription"
						placeholder="填写故障说明" /></input-box>
				<input-box label="售后要求" required>
					<picker v-model="item.salesRequirements" :range="afterSalesList"
						@change="handleAfterSales($event,item)">
						<view class="flex">
							<view class=" flex-sub">{{ afterSalesList[item.salesRequirements] }}</view>
							<uni-icons type="arrowdown" color="#808080"></uni-icons>
						</view>
					</picker>
				</input-box>
				<!-- 支持多选 -->
				<input-box label="故障图片" v-if="currentPage == index">
					<uni-file-picker :auto-upload="false" :value="item.faultPhoto" :limit="3" file-mediatype="image"
						mode="grid" file-extname="png,jpg" @select="select($event, 'fault',item)"
						@delete="delFile($event, 'fault',item)" />
				</input-box>
				<!-- 支持多选 -->
				<input-box label="购买凭证" v-if="currentPage == index">
					<uni-file-picker :auto-upload="false" :value="item.voucher" :limit="3" file-mediatype="image"
						mode="grid" file-extname="png,jpg" @select="select($event, 'certificate',item)"
						@delete="delFile($event, 'certificate',item)" />
				</input-box>
				<input-box label="反馈故障"  v-if="currentPage == index">
					<view style="display: flex;" v-if="item.faultPhotoByE != null">
						<view v-for="(itemImg,indexImg) in item.faultPhotoByE.split(',')" :key="index" >
							<image style="width: 160rpx;height: 160rpx;" mode="scaleToFill" :src="itemImg"  @click="previewImage(indexImg,item.faultPhotoByE.split(','))"></image>
						</view>
					</view>
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
	import uniFilePicker from './uni-file-picker/uni-file-picker.vue';
	import lotusAddress from "@/components/Winglau14-lotusAddress/Winglau14-lotusAddress.vue";
	import uniDatetimePicker from './uni-datetime-picker/uni-datetime-picker.vue';
	export default {
		components: {
			"lotus-address":lotusAddress,
			"uni-file-picker":uniFilePicker,
			"uni-datetime-picker":uniDatetimePicker
		},
		data() {
			return {
				lotusAddressData:{
				               visible:false,
				               provinceName:'',
				               cityName:'',
				               townName:'',
				           },
				           region:'',
				// 联系信息数据源
				contactData: { 
					repairOrder: '',
					contactPerson: '',
					contactNumber: '',
					contactAddress: '',
					province: '',
					provinceNum: '',
				},
				// 产品表单数据源
				formData: [],
				imageUrl: '',
				formDataCopy: {
					productCode: '',
					productName: '',
					productModel: '',
					productBuyDate: '',
					productGuarantee: '',
					faultDescription: '',
					salesRequirements: 0,
					faultPhoto: [],
					voucher: [],
					faultPhotoByE: ''
				},
				isScanCode: true,
				codeBarcode: {},
				// 当前页码数
				currentPage: 0,
				// 售后要求选择器数据
				afterSalesList: ['维修', '退换'],
				// 必填项目，对应formData的字段，只需要写“验证提示内容”皆可
				formRules: {
					productCode: '产品条码不能为空',
					productName: '产品名称不能为空',
					productModel: '产品型号不能为空',
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
			this.imageUrl = API_URL.replace("/yingbao", "") + 'uploadFiles/image/'
			// 将副本字段引用到表单data中
			// 需要深拷贝，不然.push = 引用this.formDataCopy
			/* this.formData.push(JSON.parse(JSON.stringify(this.formDataCopy))) */
			this.contactData.contactPerson = this.userInfo.username;
			this.contactData.contactNumber = this.userInfo.phoneNumber;
			
		},
		methods: {
			...mapActions(['getUserDetails']),
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
			               this.contactData.province = `${res.province} ${res.city} ${res.town}`; //region为已选的省市区的值
			           }
			       },
				   // 多张 图片预览 
				   previewImage(index,items) { // index 索引 如果 需要复用方法 可以使用 类型来进行区分(val)
				   		var photoList = items.map(item => {
				   			return item;
				   		});
				   	uni.previewImage({
				   		current: index,     // 当前显示图片的索引值
				   		urls: photoList,    // 需要预览的图片列表，photoList要求必须是数组
				   		loop:true,          // 是否可循环预览
				   	})
				   },

			onchange(e) {
				let str = "";
				console.log(e)
				e.detail.value.forEach((item, index) => {
					if (index == 0) {
						str = item.text
					} else {
						str = str + "" + item.text
					}

				})
				this.contactData.province = str
				this.contactData.provinceNum = e.detail.value[2]['value']
			},
			onnodeclick(node) {},
			confirmBarcode(item) {
				let that = this
				let resData = item.productCode.split(';')
				that.$api('afterSale.productionMessage', {
					productBarcode: item.productCode,
					status: 1
				}).then(reso => {
					if (reso.flag && reso.data != null) {
						let obj = {};
						that.codeBarcode = reso.data;
						item.productName = reso.data.productName;
						item.productModel = reso.data.productModel;
						item.productBuyDate = '';
						item.productGuarantee = '';
					} else {
						that.codeBarcode = {};
						item.productName = '';
						item.productModel = '';
						item.productBuyDate = '';
						item.productGuarantee = '';
						uni.showToast({
							icon: 'none',
							title: '标签有误，查询不到数据',
						});
					}
				}).catch((err) => {
					uni.showToast({
						icon: 'none',
						title: reso.msg,
					});
				});
				/* if (resData.length > 1) {
					item.productName= resData[2];
					item.productModel= resData[1];
				} else {
					that.$api('afterSale.productionMessage', {
						productBarcode: item.productCode
					}).then(reso => {
						if (reso.flag) {
							let obj = {}
							item.productName= reso.data.productName;
							item.productModel= reso.data.productModel;
						}
					});
				} */
			},
			handleScanBarCode(item) {
				let that = this
				uni.scanCode({
					success: function(res) {
						let resData = res.result.split(';')
						item.productCode = res.result;
						that.confirmBarcode(item);
					}
				});
			},
			scanBarcode(obj) {
				this.formData[this.currentPage].productCode = obj.barCode;
				this.formData[this.currentPage].productName = obj.name;
				this.formData[this.currentPage].productModel = obj.model;
			},
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
								if (!val.faultPhoto instanceof Array) {
									val.faultPhoto = []
								}
								let actionData = val.faultPhoto;
								actionData.push({
									path: that.imageUrl + data.data,
									uuid: data.data
								});
							} else if (action === 'certificate') {
								// 凭证图片
								if (!val.voucher instanceof Array) {
									val.voucher = []
								}
								let actionData = val.voucher;
								actionData.push({
									path: that.imageUrl + data.data,
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
				console.log(e.tempFile)
				// 需要操作的目标对象
				if (action === 'fault') {
					// 故障图片
					let actionData = val.faultPhoto;
					for (let i = 0; i < actionData.length; i++) {
						// 删除对应的file
						if (actionData[i].uuid === e.tempFile.uuid) {
							actionData.splice(i, 1);
							return;
						}
					}
				} else if (action === 'certificate') {
					// 凭证图片
					let actionData = val.voucher;
					for (let i = 0; i < actionData.length; i++) {
						// 删除对应的file
						if (actionData[i].uuid === e.tempFile.uuid) {
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
			handleAfterSales: function(e, item) {
				item.salesRequirements = e.target.value;
			},
			// 购买日期选择器
			handleBounghtDateChange: function(e, item) {
				let that = this;
				if (Object.keys(that.codeBarcode).length > 0) {
					if (that.codeBarcode.itemOfService) {
						item.productBuyDate = e;
						// TODO 其实只需要在getFullYear的基础上+1就好了 *.*
						const nowTime = new Date(e).getTime();
						// 时间加1年（365天）的毫秒数
						const newTime = nowTime;
						const newDate = new Date(newTime);
						newDate.setMonth(newDate.getMonth() + Number(that.codeBarcode.itemOfService));
						const year = newDate.getFullYear(),
							month = newDate.getMonth() + 1,
							day = newDate.getDate();
						item.productGuarantee =
							`${year}-${month.toString().length == 1 ? '0' : ''}${month}-${day.toString().length == 1 ? '0' : ''}${day}`;
					} else {
						uni.showToast({
							icon: 'none',
							title: '无产品保质信息',
						});
					}
				} else {
					item.productBuyDate = e;
					that.isScanCode = false
					/* uni.showToast({
						icon: 'none',
						title: '请先录入产品信息',
					}); */
				}
			}, // 保修日期选择器
			handleProductGuarantee: function(e, item) {
				let that = this;
				item.productGuarantee = e;
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
