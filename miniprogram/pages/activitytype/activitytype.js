// pages/activitytype/activitytype.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    type: [],
    name: ''
  },
  getList() {
    wx.showLoading({
      title: '加载中',
    })
    return new Promise((resolve, reject) => {
      wx.cloud.callFunction({
        name: 'activityType',
        data: {
          type: "getList",
        },
        success: (res) => {
          console.log(res)
          this.setData({
            type: res.result.info,
          })
          wx.hideLoading({
            success: (res) => {},
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
  create() {
    wx.showLoading({
      title: '加载中',
    })
    wx.cloud.callFunction({
      name: 'activityType',
      data: {
        type: "create",
        info: {
          typeName: this.data.name,
        }
      },
      success: (res) => {
        wx.hideLoading({
          success: (res) => {},
        })
        wx.showToast({
          title: res.result.des,
          icon: "none",
          duration: 2000
        })
        this.setData({
          name:''
        })
        setTimeout(() => {
          this.getList()
        }, 1000);
      }
    })
  },
  modify(e) {
    const {
      id
    } = e.currentTarget.dataset;
    console.log(id)
    return new Promise((resolve, reject) => {
      wx.cloud.callFunction({
        name: 'activityType',
        data: {
          type: "modify",
          info: {
            typeName: this.data.name,
            _id: id
          }
        },
        success: (res) => {
          console.log(res)
          wx.showToast({
            title: res.result.des,
            icon: 'none'
          })
          this.setData({
            name: ''
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
    this.getList()
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