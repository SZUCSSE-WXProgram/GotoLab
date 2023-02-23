// pages/creategroup/creategroup.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    name:'',
    intro:'',
    img:'',
    finish:false
  },
  handleInputName(e) {
		const {
			value
		} = e.detail;
		this.setData({
			name: value
		})
	},
	handleInputIntro(e) {
		const {
			value
		} = e.detail;
		this.setData({
			intro: value
		})
  },
  click(){
    wx.chooseImage({
      count: 1,
      sizeType:['compressed'],
      sourceType:['album'],
      success:(res)=>{
        const tempFilePaths=res.tempFilePaths[0]
        const format=tempFilePaths.substring(tempFilePaths.lastIndexOf('.')+1).toLowerCase()
        console.log(format)
        let imge=wx.getFileSystemManager().readFileSync(tempFilePaths,'base64');
        this.setData({
          img:'data:image/'+format+';base64,'+imge,
          finish:true
        })
        wx.showToast({
          title: '上传成功',
        })
      }
    })
  },
  create(){
    wx.showLoading({
      title: '加载中',
    })
    wx.cloud.callFunction({
      name: 'group',
      data: {
        type: "create",
        info:{
          groupName: this.data.name,
          intro: this.data.intro,
          pic_base64: this.data.img
        }
      },
      success: (res) => {
        wx.hideLoading({
          success: (res) => {},
        })
        wx.showToast({
          title: res.result.des,
          icon:'none',
          duration:2000
        })
        console.log(res)
        if(res.result.code=="success"){
          setTimeout(() => {
            wx.navigateBack({
              delta: 0,
            })
          }, 2000);
        }
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {

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