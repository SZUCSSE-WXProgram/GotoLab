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
	this.start()
  },
  async start(){
    await this.getMyself();
    if(!wx.getStorageSync('isRegister')){
      wx.navigateTo({
        url: '/pages/register/register',
      })
    }
  },
  getMyself(){
    return new Promise((resolve,reject)=>{
    wx.cloud.callFunction({
      name:'user',
      data:{
        type: "getMyself",
      },
      success:(res)=>{
        wx.setStorageSync('myself', res.result.info)
        wx.setStorageSync('isRegister', res.result.isRegistered)
        return resolve(res);
      }
    })
  })
  }
});
