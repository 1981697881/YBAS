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
		<view class="address-warpper">
			<input-box label="出库单号">
				<view class="flex align-center">
					<input class="flex-sub" type="text" v-model="customData.outCode" placeholder="请输入或扫描出库单号" :disabled="!isEdit" />
					<uni-icons v-if="isEdit" type="scan" color="#808080" @click="handleScanOut"></uni-icons>
				</view>
			</input-box>
			<input-box label="装箱码">
				<view class="flex align-center">
					<input class="flex-sub" type="text" v-model="customData.inboxCode" placeholder="请输入或扫描装箱码" :disabled="!isEdit" />
					<uni-icons v-if="isEdit" type="scan" color="#808080" @click="handleScanInbox"></uni-icons>
				</view>
			</input-box>
		</view>
		<!-- 表单的父表end -->
		<!-- 分页器start -->
		<view class="pagination-warpper flex">
			<uni-icons class="flex-sub text-center" type="arrowleft" @click="handlePageChange('prev')"></uni-icons>
			<text class="">{{ currentPage + 1 }}/{{ formData.length }}</text>
			<uni-icons class="flex-sub text-center" type="arrowright" @click="handlePageChange('next')"></uni-icons>
		</view>
		<!-- 分页器end -->
		<!-- 表单的子表-多个start -->
		<view class="form-warpper">
			<input-box label="产品条码" required>
				<view class="flex align-center">
					<input class="flex-sub" type="text" v-model="proData.productCode" placeholder="请输入或扫描产品包装盒上的条码" :disabled="!isEdit" />
					<uni-icons v-if="isEdit" type="scan" color="#808080" @click="handleScanBarCode"></uni-icons>
				</view>
			</input-box>
			<input-box label="产品名称"><input type="text" v-model="proData.productName" placeholder="根据条码自动填充" disabled /></input-box>
			<input-box label="产品型号"><input type="text" v-model="proData.productModel" placeholder="根据条码自动填充" disabled /></input-box>
		</view>
		
		<!-- 支持多选 -->
		<input-box label="相关图片">
			<uni-file-picker :disabled="!isEdit" :limit="3" file-mediatype="image" mode="grid" file-extname="png,jpg" @select="select($event, 'fault')" @delete="delFile($event, 'fault')" />
		</input-box>
		<!-- 表单的子表-多个end -->
	</view>
</template>

<script>

import mock from '@/common/mock/register';
export default {
	props: {
		isEdit: {
			type: Boolean,
			default: false
		}
	},
	data() {
		return {
			// 联系信息数据源
			customData: { outCode: '', inboxCode: '', imageFiles: [] },
			// 产品表单数据源
			formData: [],
			// 产品表单数据源的字段副本 
			formDataCopy: {
				productCode: '',
				productName: '',
				productModel: '',
				certificateFiles: []
			},
			// 当前页码数
			currentPage: 0,
			// 必填项目，对应formData的字段，只需要写“验证提示内容”皆可
			formRules: {
				barCode: '产品条码不能为空'
			}
		};
	},
	computed:{
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
	},
	mounted: function() {
	},
	methods: {
		// 选择文件后触发 - 支持多选
		select(e, action) {
			// tempFiles - Array[Files]
			// 控制台查看该组件的files数据类型
			// console.log('选择文件：', e);
			e.tempFiles.map((item, index) => {
				let actionData = this.formDataCopy.certificateFiles;
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
			let actionData = this.formDataCopy.certificateFiles;
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
		// 出库单号扫描
		handleScanOut(){},
		// 装箱码扫描
		handleScanInbox(){},
		// 产品条码扫描
		handleScanBarCode(){},
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
