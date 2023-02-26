// pages/createactivity/createactivity.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    group: '',
    sdate: "请选择日期",
    stime: "请选择时间",
    edate: "请选择日期",
    etime: "请选择时间",
    intro: "",
    limit: '',
    position: "",
    name: '',
    type: [],
    mytype: "请选择活动类型",
    index: '',
    TypeArray: [],
    actid: 0,
    activity: [],
    signable: ''
  },
  bindTypeChange: function (e) {
    this.setData({
      mytype: this.data.TypeArray[e.detail.value],
      index: this.data.type[e.detail.value]._id
    })
  },
  bindsDateChange: function (e) {
    this.setData({
      sdate: e.detail.value
    })
  },
  bindsTimeChange: function (e) {
    this.setData({
      stime: e.detail.value
    })
  },
  bindeDateChange: function (e) {
    this.setData({
      edate: e.detail.value
    })
  },
  bindeTimeChange: function (e) {
    this.setData({
      etime: e.detail.value
    })
  },
  handleInputIntro(e) {
    const {
      value
    } = e.detail;
    this.setData({
      intro: value
    })
  },
  handleInputpos(e) {
    const {
      value
    } = e.detail;
    this.setData({
      position: value
    })
  },
  handleInputnum(e) {
    const {
      value
    } = e.detail;
    this.setData({
      limit: Number(value)
    })
  },
  handleInputname(e) {
    const {
      value
    } = e.detail;
    this.setData({
      name: value
    })
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
  createtype() {
    var type = []
    for (var i = 0; i < this.data.type.length; i++) {
      type.push(this.data.type[i].typeName)
    }
    this.setData({
      TypeArray: type
    })
  },
  getactivity() {
    wx.showLoading({
      title: '加载中',
    })
    return new Promise((resolve, reject) => {
      wx.cloud.callFunction({
        name: 'activity',
        data: {
          type: "getActivityByID",
          info: {
            activityId: this.data.actid
          }
        },
        success: (res) => {
          this.setData({
            activity: res.result.data,
          })
          wx.hideLoading({
            success: (res) => {},
          })
          return resolve(res);
        }
      })
    })
  },
  setsignable() {
    this.setData({
      signable: !this.data.signable
    })
    console.log(this.data.signable)
  },
  create() {
    var startTime = this.data.sdate + " " + this.data.stime;
    var endTime = this.data.edate + " " + this.data.etime;
    wx.showLoading({
      title: '加载中',
    })
    return new Promise((resolve, reject) => {
      wx.cloud.callFunction({
        name: 'activity',
        data: {
          type: "create",
          info: {
            group: this.data.group,
            name: this.data.name,
            intro: this.data.intro,
            limit: this.data.limit,
            startTime: startTime,
            endTime: endTime,
            location: this.data.position,
            type: this.data.index,
          }
        },
        success: (res) => {
          wx.hideLoading({
            success: (res) => {},
          })
          wx.showToast({
            title: res.result.des,
            icon: 'none',
          })
          if (res.result.code == "success") {
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
  modify() {
    var startTime = this.data.sdate + " " + this.data.stime;
    var endTime = this.data.edate + " " + this.data.etime;
    wx.showLoading({
      title: '加载中',
    })
    return new Promise((resolve, reject) => {
      wx.cloud.callFunction({
        name: 'activity',
        data: {
          type: "modify",
          info: {
            _id: this.data.actid,
            name: this.data.name,
            intro: this.data.intro,
            limit: this.data.limit,
            startTime: startTime,
            endTime: endTime,
            location: this.data.position,
            type: this.data.index,
            signable: Boolean(this.data.signable)
          }
        },
        success: (res) => {
          wx.hideLoading({
            success: (res) => {},
          })
          wx.showToast({
            title: res.result.des,
            icon: 'none',
          })
          if (res.result.code == "success") {
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
  async onLoad(options) {
    await this.getList()
    this.createtype()
    if (options.id) {
      this.setData({
        group: options.id,
      })
    }
    if (options.actid) {
      this.setData({
        actid: options.actid
      })
      await this.getactivity()
      this.setData({
        name: this.data.activity.name,
        limit: this.data.activity.limit,
        position: this.data.activity.location,
        intro: this.data.activity.intro,
        signable: this.data.activity.signable
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