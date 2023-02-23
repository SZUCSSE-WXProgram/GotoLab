// pages/history/history.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    activity:[],
    hasMore:true,
    offset:0,
    limit:5,
    value:"",
  },
  getList(){
    wx.showLoading({
        title: '加载中',
      })
    return new Promise((resolve,reject)=>{
      wx.cloud.callFunction({
        name:'activity',
        data:{
          type: "history",
          info:{
            limit:this.data.limit,
            offset:this.data.offset
          }
        },
        success:(res)=>{
          let offset=this.data.offset
          this.setData({
            activity:[...this.data.activity,...res.result.data],
            hasMore:res.result.hasMore,
            offset:this.data.offset+this.data.limit
          })
          let act=this.data.activity
          for (let index = Number(offset); index < act.length; index++) {
            act[index].startTime=act[index].startTime.slice(0,10)+' '+act[index].startTime.slice(11,16)
            act[index].endTime=act[index].endTime.slice(0,10)+' '+act[index].endTime.slice(11,16)
          }
          this.setData({
              activity:act
            }) 
          wx.hideLoading({
            success: (res) => {},
          })
          return resolve(res);
        }
      })
    })
  },
  setValue(){
    if(this.data.activity.length!=0)
      this.setData({
        value:"这是底线"
      })
    else
      this.setData({
        value:"暂无内容"
      }) 
  },
  /**
   * 生命周期函数--监听页面加载
   */
  async onLoad(options) {
    await this.getList()
    this.setValue()
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
      this.getList()
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  }
})