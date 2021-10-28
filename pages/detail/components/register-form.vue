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
		<input-box label="产品条码" required><input type="text" v-model="formData.productCode" placeholder="请输入或扫描产品包装盒上的条码" /></input-box>
		<input-box label="产品名称"><input type="text" v-model="formData.productName" disabled /></input-box>
		<input-box label="产品型号"><input type="text" v-model="formData.productModel" disabled /></input-box>
		<input-box label="购买日期" required>
			<picker mode="date" v-model="formData.bounghtDate" @change="handleBounghtDateChange">
				<view class="flex align-center"><input type="text" v-model="formData.productBuyDate" class="flex-sub" placeholder="请选择日期" /></view>
			</picker>
		</input-box>
		<input-box label="保修期至"><input type="text" v-model="formData.productGuarantee" class="flex-sub" disabled placeholder="自动计算,最少一年" /></input-box>
		<input-box label="省市">
			<!-- <input type="text" v-model="formData.provinceCity" placeholder="请填写省份市区" /> -->
			<uni-data-picker
				placeholder="请选择地址"
				popup-title="请选择城市"
				collection="opendb-city-china"
				field="code as value, name as text"
				orderby="value asc"
				self-field="code"
				v-model="formData.province"
				parent-field="parent_code"
				@change="onchange"
				@nodeclick="onnodeclick"
			></uni-data-picker>
		</input-box>
		<input-box label="联系电话"><input type="text" v-model="formData.contactNumber" placeholder="请输入电话或座机号码" /></input-box>
		<input-box label="联系地址"><input type="text" v-model="formData.contactAddress" placeholder="请输入联系地址" /></input-box>
		<!-- 支持多选 -->
		<input-box label="购买凭证" required>
			<uni-file-picker :auto-upload="false" :limit="3" file-mediatype="image" mode="grid" file-extname="png,jpg" @select="select" @delete="delFile" />
		</input-box>
	</view>
</template>

<script>
import mock from '@/common/mock/register';
export default {
	components: {},
	data() {
		return {
			isReview: false,
			// 数据源
			formData: {
				productCode: '',
				productName: '',
				productModel: '',
				productBuyDate: '',
				productGuarantee: '',
				province: '110100',
				contactNumber: '',
				contactAddress: '',
				certificateFiles: []
			},
			// 必填项目，对应formData的字段，只需要写“验证提示内容”皆可
			formRules: {
				productCode: '产品条码不能为空',
				productBuyDate: '请选择购买日期',
				contactNumber: '联系电话不能为空',
				contactAddress: '联系地址不能为空',
				//certificateFiles: '请上传图片'
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
			this.formData.productGuarantee = `${year}-${month.toString().length == 1 ? '0' : ''}${month}-${day.toString().length == 1 ? '0' : ''}${day}`;
			console.log(value);
		}
	},
	mounted: function() {},
	methods: {
		scanBarcode(obj) {
			this.formData.productCode = obj.barCode;
			this.formData.productName = obj.name;
			this.formData.productModel = obj.model;
		},
		onchange(e) {
			const value = e.detail.value;
			console.log(value);
		},
		onnodeclick(node) {
			console.log(node);
		},
		// 选择文件后触发 - 支持多选
		select(e) {
			// tempFiles - Array[Files]
			// 控制台查看该组件的files数据类型
			// console.log('选择文件：', e);
			e.tempFiles.map((item, index) => {
				// TODO 根据业务需求修改所需要的数据，以下代码目前用作前端测试用
				this.formData.certificateFiles.push({
					file: item.file,
					uuid: item.uuid
				});
			});
		},
		// 文件从列表移除时触发
		delFile(e) {
			// tempFile - Object[Files]
			const { uuid } = e.tempFile;
			const { certificateFiles } = this.formData;
			for (let i = 0; i < certificateFiles.length; i++) {
				// 删除对应的file
				if (certificateFiles[i].uuid === uuid) {
					certificateFiles.splice(i, 1);
					return;
				}
			}
		},
		// 购买日期选择器
		handleBounghtDateChange: function(e) {
			this.formData.productBuyDate = e.target.value;
		}
	}
};
</script>

<style lang="scss" scoped></style>
