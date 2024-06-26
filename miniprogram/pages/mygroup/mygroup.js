// pages/mygroup/mygroup.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    groupList: [],
    permission:1
  },
  click(){
    wx.navigateTo({
      url: '/pages/creategroup/creategroup',
    })
  },
  getgroupList() {
    wx.showLoading({
      title: '加载中',
    })
    wx.cloud.callFunction({
      name: 'group',
      data: {
        type: "getFullList",
      },
      success: (res) => {
        this.setData({
          // groupList.append(...res.result.info),
          groupList: [...this.data.groupList, ...res.result.info]
        })
        wx.hideLoading({
          success: (res) => {},
        })
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    

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
    this.setData({
      permission: wx.getStorageSync('myself').permission,
      groupList: [],
    })
    if (wx.getStorageSync('myself').permission === 1) {
      this.setData({
        groupList: wx.getStorageSync('myself').groups
      })
    } else if (wx.getStorageSync('myself').permission === 2) {
      this.getgroupList()
    }
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