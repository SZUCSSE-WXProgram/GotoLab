// pages/activity_detail/activity_detail.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    id:'',
    mygroups:[],
    activity: {},
    inAttend: true,
    permission: 0,
    flag: false
  },
  attend() {
    wx.cloud.callFunction({
      name: 'activity',
      data: {
        type: "attendActivity",
        info: {
          activityId: this.options._id
        }
      },
      success: async (res) => {
        await this.getList()
        this.setattend()
        wx.showToast({
          title: res.result.des,
          icon: 'none'
        })
      }
    })
  },
  cancel(){
    wx.cloud.callFunction({
      name: 'activity',
      data: {
        type: "deleteActivity",
        info: {
          activityId: this.options._id
        }
      },
      success:async (res) => {
        await this.getList()
        this.setattend()
        wx.showToast({
          title: res.result.des,
          icon: 'none'
        })
      }
    })
  },
  getList() {
    wx.showLoading({
      title: '加载中',
    })
    return new Promise((resolve, reject) => {
      wx.cloud.callFunction({
        name: 'activity',
        data: {
          type: "getActivityByID",
          info: {
            activityId: this.options._id
          }
        },
        success: (res) => {
          this.setData({
            activity: res.result.data,
          })
          let act = this.data.activity
          act.startTime = act.startTime.slice(0, 10) + ' ' + act.startTime.slice(11, 16)
          act.endTime = act.endTime.slice(0, 10) + ' ' + act.endTime.slice(11, 16)
          this.setData({
            activity: act
          })
          wx.hideLoading({
            success: (res) => {},
          })
          return resolve(res);
        }
      })
    })
  },
  setattend()
  {
    if (String(this.data.activity.isAttend) === "-1")
    this.setData({
      isAttend: false
    })
    if (String(this.data.activity.isAttend) === "0")
    this.setData({
      isAttend: true
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  async onLoad(options) {
    this.setData({
      id: options._id,
      permission: wx.getStorageSync('myself').permission,
      mygroups: wx.getStorageSync('myself').groups
    })
    await this.getList()
   this.setattend()
      this.setflag()
  },
  setflag() {
    if (this.data.permission === 0) {
      this.setData({
        flag: false
      })
    } else if (this.data.permission === 1) {
      for (let index = 0; index < this.data.mygroups.length; index++) {
        if (this.data.id === this.data.mygroups[index]._id)
          break;
      }
      if (index === this.data.mygroups.length)
        this.setData({
          flag: false
        })
      else
        this.setData({
          flag: true
        })
    } else if (this.data.permission === 2) {
      this.setData({
        flag: true
      })
    }
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