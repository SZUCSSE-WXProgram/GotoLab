// pages/activity_detail/activity_detail.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    activity:{}
  },
  attend(){
    wx.cloud.callFunction({
      name:'activity',
      data:{
        type: "attendActivity",
        info:{
            activityId:this.options._id
          }
      },
      success:(res)=>{
        console.log(res)
        }
    })
  },
  getList(){
    wx.showLoading({
        title: '加载中',
      })
    return new Promise((resolve,reject)=>{
      wx.cloud.callFunction({
        name:'activity',
        data:{
          type: "getActivityByID",
          info:{
            activityId:this.options._id
          }
        },
        success:(res)=>{
          this.setData({
            activity:res.result.data,
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
    this.getList()
    this.attend()
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