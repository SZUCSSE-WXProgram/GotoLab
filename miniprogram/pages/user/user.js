// pages/user/user.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    myself: {},
    type0: true,
    type1: false,
    type2: false,
  },
  getMyself(){
    wx.showLoading({
      title: '加载中',
    })
    return new Promise((resolve,reject)=>{
    wx.cloud.callFunction({
      name:'user',
      data:{
        type: "getMyself",
      },
      success:(res)=>{
        wx.setStorageSync('myself', res.result.info)
        wx.hideLoading({
          success: (res) => {},
        })
        return resolve(res);
      }
    })
  })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  async onLoad(options) {
    
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  async onShow() {
    await this.getMyself()
    this.setData({
      myself: wx.getStorageSync('myself'),
      type0: wx.getStorageSync('myself').permission === 0,
      type1: wx.getStorageSync('myself').permission === 1,
      type2: wx.getStorageSync('myself').permission === 2
    })
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
  async onPullDownRefresh() {
    await this.getMyself()
    this.setData({
      myself: wx.getStorageSync('myself'),
      type0: wx.getStorageSync('myself').permission === 0,
      type1: wx.getStorageSync('myself').permission === 1,
      type2: wx.getStorageSync('myself').permission === 2
    })
    wx.stopPullDownRefresh({
      success: (res) => {},
    })
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