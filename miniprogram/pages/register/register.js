// pages/register/register.js
Page({

	/**
	 * 页面的初始数据
	 */
	data: {
		multiArray: [],
		multiIndex: [0, 0],
		classList: [],
		class: [],
		name: '',
		id: '',
		phone: '',
		_class: '',
		_grade: ''
	},
	handleInputName(e) {
		const {
			value
		} = e.detail;
		this.setData({
			name: value
		})
	},
	handleInputID(e) {
		const {
			value
		} = e.detail;
		this.setData({
			id: value
		})
	},
	handleInputPhone(e) {
		const {
			value
		} = e.detail;
		this.setData({
			phone: value
		})
	},
	getClass() {
		return new Promise((resolve, reject) => {
			wx.cloud.callFunction({
				name: 'class',
				data: {
					type: "getList",
				},
				success: (res) => {
					console.log(res)
					this.setData({
						class: res.result.info,
						_class: res.result.info[0].class[0]._id,
						_grade: res.result.info[0]._id
					})
					return resolve(res);
				}
			})
		})
	},
	buildArray() {
		const _class = this.data.class
		var grade = []
		for (var i = 0; i < _class.length; i++) {
			grade.push(_class[i].gradeName)
		}
		var classList = []
		var classItem = []
		for (var j = 0; j < _class.length; j++) {
			for (var i = 0; i < _class[j].class.length; i++) {
				classItem.push(_class[j].class[i].className)
			}
			classList.push(classItem)
			classItem = []
		}
		var array = []
		array.push(grade)
		array.push(classList[0])
		this.setData({
			multiArray: array,
			classList: classList
		})
	},
	bindMultiPickerChange: function (e) {
		this.setData({
			multiIndex: e.detail.value
		})
	},
	bindMultiPickerColumnChange: function (e) {
		var data = {
			multiArray: this.data.multiArray,
			multiIndex: this.data.multiIndex
		};
		data.multiIndex[e.detail.column] = e.detail.value;
		if (e.detail.column == 0) {
			data.multiArray[1] = this.data.classList[e.detail.value];
			data.multiIndex[1] = 0;
		}
		this.setData(data);
		this.setData({
			_grade: this.data.class[data.multiIndex[0]]._id,
			_class: this.data.class[data.multiIndex[0]].class[data.multiIndex[1]]._id
		})
	},
	getMyself(){
		return new Promise((resolve,reject)=>{
		wx.cloud.callFunction({
		  name:'user',
		  data:{
			type: "getMyself",
		  },
		  success:(res)=>{
			wx.setStorageSync('myself', res.result.info)
			wx.setStorageSync('isRegister', res.result.isRegistered)
			return resolve(res);
		  }
		})
	  })
	  },
	click() {
		wx.getUserProfile({
		  desc: '用于完善用户资料',
		  success:(res)=>{
			  console.log(res)
			  wx.setStorageSync('userInfo', res.userInfo)
		  }
		})
		return new Promise((resolve, reject) => {
			wx.cloud.callFunction({
				name: 'user',
				data: {
					type: "create",
					info: {
						stuid: this.data.id,
						name: this.data.name,
						phone: this.data.phone,
						class: this.data._class,
						grade: this.data._grade,
					}
				},
				success: (res) => {
					if (res.result.code === "fail") {
						wx.showToast({
							title: res.result.des,
							icon: 'none',
							duration: 2000
						})
					} else {
						wx.switchTab({
						  url: '/pages/index/index',
						})
						wx.showToast({
							title: res.result.des,
							icon: 'none',
							duration: 2000
						})
					}
					return resolve(res);
				}
			})
		})
	},
	/**
	 * 生命周期函数--监听页面加载
	 */
	async onLoad(options) {
		wx.showToast({
			title: '请先注册',
		})
		await this.getClass()
		this.buildArray()
		this.getMyself()
	},

	/**
	 * 生命周期函数--监听页面初次渲染完成
	 */
	onReady() {

	},

	/**
	 * 生命周期函数--监听页面显示
	 */
	onShow() {

	},

	/**
	 * 生命周期函数--监听页面隐藏
	 */
	onHide() {

	},

	/**
	 * 生命周期函数--监听页面卸载
	 */
	async onUnload() {
		await this.getMyself()
		if (!wx.getStorageSync('isRegister')) {
			wx.redirectTo({
				url: '/pages/register/register',
			})
		}

	},

	/**
	 * 页面相关事件处理函数--监听用户下拉动作
	 */
	onPullDownRefresh() {

	},

	/**
	 * 页面上拉触底事件的处理函数
	 */
	onReachBottom() {

	},

	/**
	 * 用户点击右上角分享
	 */
	onShareAppMessage() {

	}
})