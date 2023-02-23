// pages/groupadmin/groupadmin.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    admin: [],
    id:''
  },
  deleteAdmin(id)
  {
    wx.showLoading({
      title: '加载中',
    })
    return new Promise((resolve, reject) => {
      wx.cloud.callFunction({
        name: 'group',
        data: {
          type: "deleteGroupAdmin",
          info: {
            groupId: this.data.id,
            userId: id
          }
        },
        success: (res) => {
          console.log(res)
          wx.hideLoading({
            success: (res) => {
            },
          })
          if(res.result.code=="success"){
          wx.showToast({
            title: '删除成功',
            icon: 'none',
            duration: 2000
          })
        }
        else{
          wx.showToast({
            title: res.result.des,
            icon: 'none',
            duration: 2000
          })
        }
          return resolve(res);
        }
      })
    })
  },
  delete(e) {
    let id = e.currentTarget.dataset.id
    wx.showModal({
      title: '系统提示',
      content: '确认要删除吗？',
      cancelColor: 'cancelColor',
      success: async (res)=> {
        if (res.confirm) {
          await this.deleteAdmin(id)
          this.getList(this.options.id)
        }
      }
    })
  },
  getList(id) {
    wx.showLoading({
      title: '加载中',
    })
    return new Promise((resolve, reject) => {
      wx.cloud.callFunction({
        name: 'group',
        data: {
          type: "getGroupAdmins",
          info: {
            groupId: id
          }
        },
        success: (res) => {
          console.log(res)
          this.setData({
            admin: res.result.info,
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
    this.getList(options.id)
    this.setData({
      id:options.id
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
    this.getList()
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