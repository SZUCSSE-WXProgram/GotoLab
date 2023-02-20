// pages/usermanage/usermanage.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    users:[],
    hasMore:true,
    offset:0,
    limit:15
  },
  async handleInput(e){
    const {value}=e.detail;
    this.setData({
      users:[],
      offset:0
    })
    await this.getUser(value)
  },
  getUser(search){
    wx.showLoading({
      title: '加载中',
    })
    wx.cloud.callFunction({
      name:'user',
      data:{
        type: "getUsers",
        info: {
          limit:this.data.limit,
          offset:this.data.offset,
          search:search
        }
      },
      success:(res)=>{
        this.setData({
          users:[...this.data.users,...res.result.data],
          hasMore:res.result.hasMore,
          offset:this.data.offset+this.data.limit
        })
        wx.hideLoading({
          success: (res) => {},
        })
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.getUser('')
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
    if(this.data.hasMore){
      this.getUser()
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  }
})