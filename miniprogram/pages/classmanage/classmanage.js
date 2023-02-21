// pages/classmanage/classmanage.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    class:[],
    name:'',
    index:0
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
					})
					return resolve(res);
				}
			})
		})
  },
  handleInputName(e) {
		const {
			value
    } = e.detail;
		this.setData({
			name: value
		})
  },
  create(e){
    const {index}=e.currentTarget.dataset;
    return new Promise((resolve, reject) => {
			wx.cloud.callFunction({
				name: 'class',
				data: {
          type: "create",
          info:{
            className:this.data.name,
            gradeId:index
          }
				},
				success: (res) => {
					console.log(res)
					wx.showToast({
            title: res.result.des,
            icon:'none'
          })
          this.getClass()
					return resolve(res);
				}
			})
		})
  },
  creategrd(){
    return new Promise((resolve, reject) => {
			wx.cloud.callFunction({
				name: 'grade',
				data: {
          type: "create",
          info:{
            gradeName:this.data.name,
          }
				},
				success: (res) => {
					console.log(res)
					wx.showToast({
            title: res.result.des,
            icon:'none'
          })
          this.getClass()
					return resolve(res);
				}
			})
		})
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.getClass()
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
  onUnload() {

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