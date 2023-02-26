// pages/activity_detail/activity_detail.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    id: '',
    mygroups: [],
    activity: {},
    isAttend: false,
    permission: 0,
    flag: false,
    isStart: false,
    isFull: false,
    signable: false,
    isCheck:false
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
  cancel() {
    wx.cloud.callFunction({
      name: 'activity',
      data: {
        type: "deleteAttender",
        info: {
          activityId: this.options._id
        }
      },
      success: async (res) => {
        await this.getList()
        this.setattend()
        console.log(res)
        if (res.result.code === "success") {
          wx.showToast({
            title: "取消成功",
          })
        } else {
          wx.showToast({
            title: res.result.des,
            icon: 'none'
          })
        }
      }
    })
  },
  delete() {
    wx.cloud.callFunction({
      name: 'activity',
      data: {
        type: "deleteActivity",
        info: {
          activityId: this.options._id
        }
      },
      success: (res) => {
        wx.showToast({
          title: res.result.des,
          icon: 'none'
        })
        if (res.result.code === "success") {
          wx.navigateBack({
            delta: 0,
          })
        }
      }
    })
  },
  truedelete(){
    wx.showModal({
      title: '系统提示',
      content: '确认要删除吗？',
      cancelColor: 'cancelColor',
      success: async (res)=> {
        if (res.confirm) {
          this.delete()
        }
      }
    })
  },
  setsignable() {
    if (this.data.activity.attenders >= Number(this.data.activity.limit)) {
      this.setData({
        isFull: true
      })
    } else {
      this.setData({
        isFull: false
      })
    }
    var startTime = new Date(this.data.activity.startTime)
    if (startTime < new Date()) {
      this.setData({
        isStart: true
      })
    } else {
      this.setData({
        isStart: false
      })
    }
    if (this.data.activity.signable) {
      this.setData({
        signable: true
      })
    } else {
      this.setData({
        signable: false
      })
    }
    if(this.data.activity.isAttend===Number(1))
    {
      this.setData({
        isCheck:true
      })
    }
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
  setattend() {
    if (String(this.data.activity.isAttend) === "-1")
      this.setData({
        isAttend: false
      })
    else(String(this.data.activity.isAttend) === "0")
      this.setData({
        isAttend: true
      })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {

  },
  setflag() {
    if (this.data.permission === 0) {
      this.setData({
        flag: false
      })
    } else if (this.data.permission === 1) {
      let index;
      for (index = 0; index < this.data.mygroups.length; index++) {
        if (this.data.activity.group._id === this.data.mygroups[index]._id) {
          break;
        }
      }
      if (index === this.data.mygroups.length) {
        this.setData({
          flag: false
        })
      } else {
        this.setData({
          flag: true
        })
      }
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
  async onShow() {
    this.setData({
      id: this.options._id,
      permission: wx.getStorageSync('myself').permission,
      mygroups: wx.getStorageSync('myself').groups
    })
    await this.getList()
    this.setattend()
    this.setflag()
    this.setsignable()
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