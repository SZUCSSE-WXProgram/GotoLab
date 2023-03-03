// pages/attenderlist/attenderlist.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    users: [],
    hasMore: true,
    offset: 0,
    limit: 15,
    actid: 0,
    status: 0,
    url: ''
  },
  getAttenders() {
    wx.showLoading({
      title: '加载中',
    })
    wx.cloud.callFunction({
      name: 'activity',
      data: {
        type: "getAttender",
        info: {
          activityId: this.data.actid,
          limit: this.data.limit,
          offset: this.data.offset,
        }
      },
      success: (res) => {
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
  choose(e) {
    console.log(e)
    var id = e.currentTarget.dataset.id
    var status = e.currentTarget.dataset.status
    wx.showLoading({
      title: '加载中',
    })
    wx.cloud.callFunction({
      name: 'activity',
      data: {
        type: "checkAttender",
        info: {
          activityId: this.data.actid,
          userId: id,
          status: 1 - Number(status)
        }
      },
      success: (res) => {
        this.setData({
          users: [],
          hasMore: true,
          offset: 0,
          limit: 15,
        })
        this.getAttenders()
        wx.hideLoading({
          success: (res) => {},
        })
      }
    })
  },
  delete(e) {
    var id = e.currentTarget.dataset.id
    wx.showLoading({
      title: '加载中',
    })
    wx.cloud.callFunction({
      name: 'activity',
      data: {
        type: "deleteAttender",
        info: {
          activityId: this.data.actid,
          userId: id
        }
      },
      success: (res) => {
        this.setData({
          users: [],
          hasMore: true,
          offset: 0,
          limit: 15,
        })
        this.getAttenders()
        wx.hideLoading({
          success: (res) => {},
        })
        wx.showToast({
          title: '删除成功',
        })
      }
    })
  },
  excel() {
    wx.showLoading({
      title: '加载中',
    })
    wx.cloud.callFunction({
      name: 'activity',
      data: {
        type: "exportsAttenders",
        info: {
          activityId: this.data.actid,
        }
      },
      success: (res) => {
        wx.hideLoading({
          success: (res) => {},
        })
        if (res.result.code === "success") {
          wx.showToast({
            title: res.result.des,
            icon: 'success'
          })
        } else {
          wx.showToast({
            title: res.result.des,
            icon: 'none'
          })
        }
        wx.cloud.getTempFileURL({
          fileList: [res.result.data],
          success: (res) => {
            console.log(res.fileList[0].tempFileURL)
            this.setData({
              url: res.fileList[0].tempFileURL
            })
            wx.navigateTo({
              url: '/pages/exportsAttenders/exportsAttenders?url='+res.fileList[0].tempFileURL,
            })
          },
          fail: function (res) {
            console.log(res)
          }
        })
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.setData({
      actid: options.actid
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
    this.setData({
      users: [],
      hasMore: true,
      offset: 0,
      limit: 15,
    })
    this.getAttenders()
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