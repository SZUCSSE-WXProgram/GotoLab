// pages/user/user.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    avatar: '',
    myself: {},
    type0: true,
    type1: false,
    type2: false,
  },
  getinfo() {
    return new Promise((resolve, reject) => {
      wx.getSetting({
        success(res) {
          if (res.authSetting['scope.userInfo']) {
            wx.getUserInfo({
              success: (res) => {
                wx.setStorageSync('userInfo', res.userInfo)
              },
              fail: (res) => {},
              complete: (res) => {
                return resolve(res);
              },
            })
          }
        }
      })
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  async onLoad(options) {
    this.setData({
      avatar: wx.getStorageSync('userInfo').avatarUrl,
      myself: wx.getStorageSync('myself'),
      type0: wx.getStorageSync('myself').permission === 0,
      type1: wx.getStorageSync('myself').permission === 1,
      type2: wx.getStorageSync('myself').permission === 2
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