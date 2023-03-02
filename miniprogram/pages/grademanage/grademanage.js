// pages/grademanage/grademanage.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    grade: [],
    name: '',
    gname: ''
  },
  getList() {
    return new Promise((resolve, reject) => {
      wx.cloud.callFunction({
        name: 'class',
        data: {
          type: "getList",
        },
        success: (res) => {
          this.setData({
            grade: res.result.info,
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
  handleInputgName(e) {
    const {
      value
    } = e.detail;
    this.setData({
      gname: value
    })
  },
  create() {
    wx.showLoading({
      title: '加载中',
    })
    wx.cloud.callFunction({
      name: 'grade',
      data: {
        type: "create",
        info: {
          gradeName: this.data.gname,
        }
      },
      success: (res) => {
        wx.hideLoading({
          success: (res) => {},
        })
        if (res.result.code === "success") {
          this.setData({
            gname: ''
          })
          wx.showToast({
            title: res.result.des,
            icon: 'success',
            duration: 2000
          })
          setTimeout(() => {
            this.getList()
          }, 1000);
        } else {
          wx.showToast({
            title: res.result.des,
            icon: "none",
            duration: 2000
          })
        }
      }
    })
  },
  modify(e) {
    const {
      id
    } = e.currentTarget.dataset;
    return new Promise((resolve, reject) => {
      wx.cloud.callFunction({
        name: 'grade',
        data: {
          type: "modify",
          info: {
            gradeName: this.data.name,
            _id: id
          }
        },
        success: (res) => {
          console.log(res)
          if (res.result.code === "success") {
            this.setData({
              name: ''
            })
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
  deleteType(id) {
    return new Promise((resolve, reject) => {
      wx.cloud.callFunction({
        name: 'grade',
        data: {
          type: "delete",
          info: {
            _id: id
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
    let id = e.currentTarget.dataset.id
    wx.showModal({
      title: '系统提示',
      content: '确认要删除吗？',
      cancelColor: 'cancelColor',
      success: async (res) => {
        if (res.confirm) {
          await this.deleteType(id)
          setTimeout(() => {
            this.getList()
          }, 1000);
        }
      }
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