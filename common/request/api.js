/**
 * 接口列表文件
 */
export default {
	/** 初始化 ↓ **/
	init: {
		url: 'index/init',
		auth: false,
		method: 'GET',
		// desc: '初始化数据',
	},
	/** 售后 ↓ **/
	afterSale: {
		repairDetailAdd: {
			url: 'applet/repairDetail/add',
			auth: true,
			method: 'POST',
			// desc: '报修',
		},repairDetailUpdate: {
			url: 'applet/repairDetail/update',
			auth: true,
			method: 'POST',
			// desc: '报修修改',
		},posterList: {
			url: 'applet/api/posterList',
			auth: true,
			method: 'POST',
			// desc: '主页轮播',
		},
		repairList: {
			url: 'applet/repair/list',
			auth: true,
			method: 'POST',
			// desc: '报修记录',
		},
		warrantyAdd: {
			url: 'applet/warranty/add',
			auth: true,
			method: 'POST',
			// desc: '质保登记',
		},
		warrantyList: {
			url: 'applet/warranty/List',
			auth: true,
			method: 'POST',
			// desc: '质保登记列表',
		},
		reportAdd: {
			url: 'applet/report/add',
			auth: true,
			method: 'POST',
			// desc: '上报',
		},reportList: {
			url: 'applet/report/list',
			auth: true,
			method: 'POST',
			// desc: '上报列表',
		},deleteReport: {
			url: 'report/deleteReport',
			auth: true,
			method: 'POST',
			// desc: '上报删除',
		},
		repairDetailUpdate: {
			url: 'applet/repairDetail/update',
			auth: true,
			method: 'POST',
			// desc: '维修',
		},receiving: {
			url: 'logistics/receiving',
			auth: true,
			method: 'POST',
			// desc: '确认收货',
		},confirmPrice: {
			url: 'applet/confirmPrice',
			auth: true,
			method: 'POST',
			// desc: '确认维修',
		},
		seriesList: {
			url: 'partsList/seriesList',
			auth: true,
			method: 'POST',
			// desc: '配件系列',
		},scanFuselageCode: {
			url: 'fuselage/scanFuselageCode',
			auth: true,
			method: 'POST',
			// desc: '机身码查询',
		},scanOutPutOrder: {
			url: 'outputOrder/scanOutPutOrder',
			auth: true,
			method: 'GET',
			// desc: '出库单扫描产品',
		},scanPackcode: {
			url: 'outputOrder/scanPackcode',
			auth: true,
			method: 'GET',
			// desc: '装箱码扫描产品',
		},productionMessage: {
			url: 'productBarcode/productionMessage',
			auth: true,
			method: 'POST',
			// desc: '装箱码扫描产品',
		},repairMessage: {
			url: 'repairDetail/repairMessage',
			auth: true,
			method: 'POST',
			// desc: '保修单详情',
		},isEmployee: {
			url: 'employeeShouhou/isEmployee',
			auth: true,
			method: 'POST',
			// desc: '判断是否绑定业务员',
		},bindingEmployee: {
			url: 'employeeShouhou/bindingEmployee',
			auth: true,
			method: 'POST',
			// desc: '绑定业务员',
		},

	},
	/** 聊天 ↓ **/
	chat: {
		init: {
			url: 'chat.index/init',
			auth: false,
			method: 'GET',
			// desc: '初始化聊天配置',
		}

	},

	/** 上传图片 ↓ **/
	upload: {
		url: 'file/imgUpload',
		auth: true,
		method: 'POST',
		// desc: '上传',
	},
	/** 上传图片 ↓ **/
	address: {
		url: 'address.json',
		auth: false,
		method: 'get',
		// desc: '上传',
	},

	/** 上传Base64图片 ↓ **/
	uploadBase64: {
		url: 'index/uploadBase64',
		auth: false,
		method: 'POST',
		// desc: '上传Base64位图片',
	},

	/** 消息订阅模板 ↓ **/
	messageIds: {
		url: 'notification/template',
		auth: true,
		method: 'GET',
		// desc: '订阅消息模板ids',
	},

	/** 微信Jssdk ↓ **/
	wechat: {
		jssdk: {
			url: 'wechat/jssdk',
			auth: false,
			method: 'POST',
			// desc: '微信Jssdk',
		},
	},

	/** 富文本  ↓ **/
	richtext: {
		url: 'index/richtext',
		auth: false,
		method: 'GET',
		// desc: '富文本数据',
	},

	/** 用户 ↓ **/
	user: {
		member: {
			url: 'member/loginMember',
			auth: true,
			method: 'POST',
			// desc: '用户信息',
		},
		findUserAuthority: {
			url: 'member/findUserAuthority',
			auth: true,
			method: 'POST',
			// desc: ' 查询当前用户是否绑定权限职员',
		},
		setUserAuthority: {
			url: 'member/setUserAuthority',
			auth: true,
			method: 'POST',
			// desc: ' 当前用户绑定权限职员',
		},
		approvalPerson: {
			url: 'applyApprovalRecord/approvalPerson',
			auth: true,
			method: 'POST',
			// desc: '查询职员',
		},
		info: {
			url: 'user',
			auth: true,
			method: 'GET',
			// desc: '用户信息',
		},
		register: {
			url: 'user/register',
			auth: false,
			method: 'POST',
			// desc: '用户注册',
		},
		getWxMiniProgramSessionKey: {
			url: 'weChat/memberAuthorize',
			auth: false,
			method: 'POST',
			// desc: '获取用户session_key',
		},
		wxMiniProgramLogin: {
			url: 'weChat/memberLogin',
			auth: false,
			method: 'POST',
			// desc: '微信小程序登录',
		},
		getWxMiniPhoneNumber: {
			url: 'phone/phoneNumber',
			auth: false,
			method: 'POST',
			// desc: '获取用户手机号码',
		},
		forgot: {
			url: 'user/forgot',
			auth: false,
			method: 'POST',
			// desc: '忘记密码',
		},
	},

	/** 分享 ↓ **/
	share: {
		add: {
			url: 'share/add',
			auth: false,
			method: 'POST',
			// desc: '添加分享记录',
		}
	},

	/** 位置 ↓ **/
	address: {
		area: {
			url: 'address/area',
			auth: false,
			method: 'GET',
			// desc: '省市区',
		},
		list: {
			url: 'address',
			auth: true,
			method: 'GET',
			// desc: '地址列表',
		},
		edit: {
			url: 'address/edit',
			auth: true,
			method: 'POST',
			// desc: '修改地址',
		},
		defaults: {
			url: 'address/defaults',
			auth: true,
			method: 'GET',
			// desc: '默认地址',
		},
		info: {
			url: 'address/info',
			auth: true,
			method: 'GET',
			// desc: '地址详情',
		},
		del: {
			url: 'address/del',
			auth: true,
			method: 'POST',
			// desc: '删除',
		},
	},

	/** 短信 ↓ **/
	sms: {
		send: {
			url: 'sms/send',
			auth: false,
			method: 'POST',
			// desc: '发送短信',
		},
	},

	/** 常见问题 ↓ **/
	faq: {
		list: {
			url: 'faq',
			auth: false,
			method: 'GET',
			// desc: '常见问题列表',
		},
	},

	/** 意见反馈 ↓ **/
	feedback: {
		type: {
			url: 'feedback/type',
			auth: true,
			method: 'GET',
			// desc: '意见反馈类型',
		},
		add: {
			url: 'feedback/add',
			auth: true,
			method: 'POST',
			// desc: '提交意见',
		},
	},
	/** 支付 ↓ **/
	pay: {
		prepay: {
			url: 'pay/prepay',
			auth: true,
			method: 'POST',
			// desc: '发起支付',
		},
	},
};
