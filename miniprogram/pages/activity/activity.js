// pages/activity/activity.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tabs:[
      {
        _id:'',
        typeName:"全部",
        isActive:true
      },
    ],
    activity:[],
    hasMore:true,
    offset:0,
    limit:5
  },
  getList(index){
    wx.showLoading({
      title: '加载中',
    })
    wx.cloud.callFunction({
      name:'activity',
      data:{
        type: "getActivities",
        info:{
          type:this.data.tabs[index]._id,
          limit:this.data.limit,
          offset:this.data.offset
        }
      },
      success:(res)=>{
        this.setData({
          activity:[...this.data.activity,...res.result.data],
          hasMore:res.result.hasMore,
          offset:this.data.offset+this.data.limit
        })
        console.log(res)
        wx.hideLoading({
          success: (res) => {},
        })
      }
    })
  },
  tabclick(e){
    const {index}=e.currentTarget.dataset;
    if(!this.data.tabs[index].isActive)
    {
      let {tabs}=this.data;
      tabs.forEach((v,i)=>i===index?v.isActive=true:v.isActive=false);
      this.setData({
        tabs,
        offset:0,
        hasmore:true,  
        activity:[]
      })
      this.getList(index)
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    wx.showLoading({
      title: '加载中',
      }),
    wx.cloud.callFunction({
      name:'activityType',
      data:{
        type: "getList",
      },
      success:(res)=>{
        this.setData({
          tabs:[...this.data.tabs,...res.result.info]
        })
        wx.hideLoading({
          success: (res) => {},
        })
        // for (var i=1 ;i<tabs.length;i++) {
        //   tabs[i].isActive=false;
        // }
      },
    })
    this.getList(0);
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