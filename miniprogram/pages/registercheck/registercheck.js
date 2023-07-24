// pages/registercheck/registercheck.js
Page({
  /**
   * 页面的初始数据
   */
  data: {
    users: [],
    hasMore: true,
    offset: 0,
    limit: 15,
    search:''
  },
  handleInput(e) {
    const {
      value
    } = e.detail;
    this.setData({
      users: [],
      offset: 0,
      search:value
    })
    this.getUser()
  },
  getUser() {
    wx.showLoading({
      title: '加载中',
    })
    wx.cloud.callFunction({
      name: 'user',
      data: {
        type: "getRegisters",
        info: {
          limit: this.data.limit,
          offset: this.data.offset,
          search: this.data.search,
        }
      },
      success: (res) => {
        console.log(res)
        this.setData({
          users: [...this.data.users, ...res.result.data],
          hasMore: res.result.hasMore,
          offset: this.data.offset + this.data.limit
        })
        wx.hideLoading({
          success: (res) => {},
        })
      }
    })
  },
  deleteType(id) {
    return new Promise((resolve, reject) => {
      wx.cloud.callFunction({
        name: 'user',
        data: {
          type: "delRegister",
          info: {
            docid: id
          }
        },
        success: (res) => {
          if (res.result.code === "success") {
            wx.showToast({
              title: res.result.des,
              icon: 'success',
              duration: 2000
            })
          } else {
            wx.showToast({
              title: res.result.des,
              icon: "none",
              duration: 2000
            })
          }
          return resolve(res);
        },
      })
    })
  },
  delete(e) {
    console.log(e)
    let id = e.currentTarget.dataset.id
    wx.showModal({
      title: '系统提示',
      content: '确认要删除吗？',
      cancelColor: 'cancelColor',
      success: async (res) => {
        if (res.confirm) {
          await this.deleteType(id)
          setTimeout(() => {
            this.setData({
              users: [],
              hasMore: true,
              offset: 0,
              search:''
            })
            this.getUser()
          }, 1000);
        }
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
      users: [],
      hasMore: true,
      offset: 0,
      search:''
    })
    this.getUser()
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
    this.setData({
      users: [],
      hasMore: true,
      offset: 0,
      search:''
    })
    this.getUser()
    wx.stopPullDownRefresh({
      success: (res) => {},
    })
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {
    if (this.data.hasMore) {
      this.getUser()
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  }
})