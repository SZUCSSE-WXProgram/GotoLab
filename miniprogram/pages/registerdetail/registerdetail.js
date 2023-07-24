// pages/registerdetail/registerdetail.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    name: '',
    id: '',
    _id: ''
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
  modify() {
    return new Promise((resolve, reject) => {
      wx.cloud.callFunction({
        name: 'user',
        data: {
          type: "manageRegister",
          info: {
            stuid: this.data.id,
            name: this.data.name,
            docid: this.data._id,
          }
        },
        success:(res) => {
          console.log(res)
          if (res.result.code === "fail") {
            wx.showToast({
              title: res.result.des,
              icon: 'none',
              duration: 2000
            })
          } else {
            wx.showToast({
              title: res.result.des,
              icon: 'success',
              duration: 2000
            })
            setTimeout(() => {
              wx.navigateBack({
                delta: 0,
              })
            }, 1000);
          }
          return resolve(res);
        }
      })
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.setData({
      name: options.name,
      id: options.id,
      _id: options._id
    })
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