// app.js
App({
  onLaunch: function () {
    if (!wx.cloud) {
      console.error('请使用 2.2.3 或以上的基础库以使用云能力');
    } else {
      wx.cloud.init({
        env: 'cloud1-6glxj0gh4232206c',
        traceUser: true,
      });
    }
    this.globalData = {};
    this.getMyself();
  },
  getMyself(){
    wx.cloud.callFunction({
      name:'user',
      data:{
        type: "getMyself",
      },
      success:(res)=>{
        console.log(res)
        wx.setStorageSync('permission', res.result.info.permission)
        wx.setStorageSync('myself', res.result.info)
      }
    })
  }
});
