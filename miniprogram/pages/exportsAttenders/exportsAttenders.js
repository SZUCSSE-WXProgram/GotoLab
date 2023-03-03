// pages/exportsAttenders/exportsAttenders.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    url: '',
    flag: false,
    copy: false
  },
  open() {
    wx.downloadFile({
      url: this.data.url,
      success: (res) => {
        wx.showLoading({
          title: '正在打开',
        })
        setTimeout(() => {
          if (!this.data.flag) {
            wx.hideLoading({
              success: (res) => {},
            })
            wx.showToast({
              title: '打开失败，请复制到浏览器中打开',
              icon: 'none'
            })
            this.setData({
              copy: true
            })
          }
        }, 5000);
        const filePath = res.tempFilePath
        wx.openDocument({
          filePath: filePath,
          showMenu: true,
          success: (res) => {
            wx.hideLoading({
              success: (res) => {},
            })
            this.setData({
              flag: true
            })
            console.log('打开文档成功')
          }
        })
      },
      fail: function (res) {
        console.log(res)
      }
    })
  },
  copy() {
    wx.setClipboardData({
      data: this.data.url,
      success: (res) => {
        wx.getClipboardData({
          success: (option) => {
            wx.showToast({
              title: '复制成功',
              icon: 'success'
            })
          },
        })
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.setData({
      url: options.url
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