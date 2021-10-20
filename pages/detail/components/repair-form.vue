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
				<text>{{ contactData.fixCode }}</text>
			</input-box>
			<view class="flex">
				<input-box class="flex-sub" label="联系人"><input type="text" v-model="contactData.contactName" /></input-box>
				<input-box class="flex-sub" label="电话"><input type="text" v-model="contactData.contactPhone" /><button v-if="!userInfo.phoneNumber" class="cu-btn round lines-red" open-type="getPhoneNumber" @getphonenumber="bindPhone">获取</button></input-box>
			</view>
			<input-box label="邮寄地址">
				<input type="text" v-model="contactData.contactAddr" />
				<!-- <textarea v-model="formData.contactAddr" placeholder="请填写邮寄地址" /> -->
			</input-box>
		</view>
		<!-- 维修联系人及单号end -->
		
		<!-- 分页器start -->
		<view class="pagination-warpper flex">
			<uni-icons class="flex-sub text-center" type="arrowleft" @click="handlePageChange('prev')"></uni-icons>
			<text class="">{{ currentPage + 1 }}/{{ formData.length }}</text>
			<uni-icons class="flex-sub text-center" type="arrowright" @click="handlePageChange('next')"></uni-icons>
		</view>
		<!-- 分页器end -->
		
		<view class="form-warpper">
			<input-box label="产品条码" required><input type="text" v-model="proData.barCode" placeholder="请输入或扫描产品包装盒上的条码" /></input-box>
			<input-box label="产品名称"><input type="text" v-model="proData.name"  disabled /></input-box>
			<input-box label="产品型号"><input type="text" v-model="proData.model"  disabled /></input-box>
			<input-box label="购买日期" required>
				<picker mode="date" v-model="proData.bounghtDate" @change="handleBounghtDateChange">
					<view class="flex align-center"><input type="text" v-model="proData.bounghtDate" class="flex-sub" placeholder="请选择日期" /></view>
				</picker>
			</input-box>
			<input-box label="保修期至"><input type="text" v-model="proData.expireDate" class="flex-sub" disabled placeholder="自动计算,最少一年" /></input-box>
			<input-box label="故障说明"><textarea v-model="proData.faultDesc" placeholder="填写故障说明" /></input-box>
			<input-box label="售后要求" required>
				<picker v-model="proData.afterSales" :range="afterSalesList" @change="handleAfterSales">
					<view class="flex">
						<view class=" flex-sub">{{ afterSalesList[proData.afterSales] }}</view>
						<uni-icons type="arrowdown" color="#808080"></uni-icons>
					</view>
				</picker>
			</input-box>
			<!-- 支持多选 -->
			<input-box label="故障图片">
				<uni-file-picker :limit="3" file-mediatype="image" mode="grid" file-extname="png,jpg" @select="select($event, 'fault')" @delete="delFile($event, 'fault')" />
			</input-box>
			<!-- 支持多选 -->
			<input-box label="购买凭证">
				<uni-file-picker
					:limit="3"
					file-mediatype="image"
					mode="grid"
					file-extname="png,jpg"
					@select="select($event, 'certificate')"
					@delete="delFile($event, 'certificate')"
				/>
			</input-box>
		</view>
	</view>
</template>

<script>
import { mapMutations, mapActions, mapState } from 'vuex';
import mock from '@/common/mock/register';
export default {
	components: {
		
	},
	data() {
		return {
			// 联系信息数据源
			contactData: { fixCode: '', contactName: '', contactPhone: '', contactAddr: '' },
			// 产品表单数据源
			formData: [],
			// 产品表单数据源的字段副本
			formDataCopy: {
				barCode: '',
				name: '',
				model: '',
				bounghtDate: '',
				expireDate: '',
				faultDesc: '',
				afterSales: 0,
				faultFiles: [],
				certificateFiles: []
			},
			// 当前页码数
			currentPage: 0,
			// 售后要求选择器数据
			afterSalesList: ['维修', '退换'],
			// 必填项目，对应formData的字段，只需要写“验证提示内容”皆可
			formRules: {
				barCode: '产品条码不能为空',
				bounghtDate: '请选择购买日期'
			}
		};
	},
	computed:{
		...mapState({
			userInfo: state => state.user.userInfo,
		}),
		// 当前选择的第n个产品数据
		proData: function(){
			return this.formData[this.currentPage]
		}
	},
	watch: {
		// 购买日期选择后，自动填写上保修期的时间，默认没从条码带出来的话，为1年
		'proData.bounghtDate'(value) {
			if(!value) return
			// TODO 其实只需要在getFullYear的基础上+1就好了 *.*
			const nowTime = new Date(value).getTime();
			// 时间加1年（365天）的毫秒数
			const newTime = nowTime + 1000 * 60 * 60 * 24 * 365;
			const newDate = new Date(newTime),
				year = newDate.getFullYear(),
				month = newDate.getMonth() + 1,
				day = newDate.getDate();
			this.proData.expireDate = `${year}-${month.toString().length == 1 ? '0' : ''}${month}-${day.toString().length == 1 ? '0' : ''}${day}`;
		}
	},
	created: function() {
		// 将副本字段引用到表单data中
		// 需要深拷贝，不然.push = 引用this.formDataCopy
		this.formData.push(JSON.parse(JSON.stringify(this.formDataCopy)))
		this.contactData.contactName = this.userInfo.username;
		 this.contactData.contactPhone = this.userInfo.phoneNumber;
	},
	mounted: function() {
		// 自动生成单号
		this.getFixCode();
	},
	methods: {
		...mapActions(['getUserDetails']),
		bindPhone(e) {
			console.log(e)
			let me = this;
			me.$api('user.getWxMiniPhoneNumber', {
				sessionKey: uni.getStorageSync('session_key'),
				openid: uni.getStorageSync('openid'),
				encryptedData: e.detail.encryptedData,
				iv: e.detail.iv
			}).then(res => {
				if (res.flag) {
					me.getUserDetails();
					/* uni.setStorageSync('phone', res.data);
					me.jump('/pages/user/edit-phone', { fromType: 'bind', phone: res.data }); */
				}
			});
		},
		// 选择文件后触发 - 支持多选
		select(e, action) {
			// tempFiles - Array[Files]
			// 控制台查看该组件的files数据类型
			// console.log('选择文件：', e);
			e.tempFiles.map((item, index) => {
				let actionData;
				if (action === 'fault') {
					// 故障图片
					actionData = this.formData.faultFiles;
				} else if (action === 'certificate') {
					// 凭证图片
					actionData = this.formData.certificateFiles;
				}
				// TODO 根据业务需求修改所需要的数据，以下代码目前用作前端测试用
				actionData.push({
					file: item.file,
					uuid: item.uuid
				});
			});
		},
		// 文件从列表移除时触发
		delFile(e, action) {
			// tempFile - Object[Files]
			const { uuid } = e.tempFile;
			// 需要操作的目标对象
			let actionData;
			if (action === 'fault') {
				// 故障图片
				actionData = this.formData.faultFiles;
			} else if (action === 'certificate') {
				// 凭证图片
				actionData = this.formData.certificateFiles;
			}
			for (let i = 0; i < actionData.length; i++) {
				// 删除对应的file
				if (actionData[i].uuid === uuid) {
					actionData.splice(i, 1);
					return;
				}
			}
		},
		// 追加产品
		addformData(){
			// 不用深拷贝的话，添加2个数据以上就会无限复制第二条数据
			const data = JSON.parse(JSON.stringify(this.formDataCopy))
			this.$set(this.formData,this.formData.length,data)
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
		handleAfterSales: function(e) {
			this.proData.afterSales = e.target.value;
		},
		// 购买日期选择器
		handleBounghtDateChange: function(e) {
			this.proData.bounghtDate = e.target.value;
		},
		// 获取维修单号 - 自动生成，看前端还是后端生成
		getFixCode() {
			const str = [
				'0',
				'1',
				'2',
				'3',
				'4',
				'5',
				'6',
				'7',
				'8',
				'9',
				'A',
				'B',
				'C',
				'D',
				'E',
				'F',
				'G',
				'H',
				'I',
				'J',
				'K',
				'L',
				'M',
				'N',
				'O',
				'P',
				'Q',
				'R',
				'S',
				'T',
				'U',
				'V',
				'W',
				'X',
				'Y',
				'Z'
			];
			let res = '';
			for (let i = 0; i < 16; i++) {
				let id = Math.ceil(Math.random() * 35);
				res += str[id];
			}
			this.contactData.fixCode = res;
		}
	}
};
</script>

<style lang="scss" scoped>
.address-warpper {
	// border-bottom: 2rpx #cccccc dashed;
}
.form-warpper{
	    overflow-y:scroll;
	    max-height: 300px;
}
.pagination-warpper{
	padding: 16rpx 0;
	margin-bottom: 16rpx;
	border-bottom: 2rpx #dddddd solid;
}
</style>
