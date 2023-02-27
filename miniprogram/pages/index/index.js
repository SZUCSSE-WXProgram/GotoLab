// pages/index/index.js

Page({

  /**
   * 页面的初始数据
   */
  data: {
    groupList: []
  },
  getMyself() {
    return new Promise((resolve, reject) => {
      wx.cloud.callFunction({
        name: 'user',
        data: {
          type: "getMyself",
        },
        success: (res) => {
          wx.setStorageSync('myself', res.result.info)
          wx.setStorageSync('isRegister', res.result.isRegistered)
          return resolve(res);
        }
      })
    })
  },
  getgroupList() {
    wx.showLoading({
      title: '加载中',
    })
    return new Promise((resolve, reject) => {
      wx.cloud.callFunction({
        name: 'group',
        data: {
          type: "getFullList",
        },
        success: (res) => {
          this.setData({
            // groupList.append(...res.result.info),
            groupList: res.result.info
          })
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
  onLoad(options) {
    this.getgroupList()
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
  async onPullDownRefresh() {
    await this.getgroupList()
    this.getMyself();
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