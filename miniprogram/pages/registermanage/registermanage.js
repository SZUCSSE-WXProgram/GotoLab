// pages/registermanage/registermanage.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    text: "    请选择一个excel文件",
    file: '',
    url: ''
  },
  handleClick() {
    wx.chooseMessageFile({
      count: 1,
      type: 'file',
      success: (res) => {
        console.log(res)
        const tempFilePaths = res.tempFiles[0].path
        const name = res.tempFiles[0].name
        const type = tempFilePaths.substring(tempFilePaths.lastIndexOf('.') + 1).toLowerCase()
        const cloudPath = 'excel/' + new Date().getTime() + '.' + type
        wx.showLoading({
          title: '正在上传',
        });
        wx.cloud.uploadFile({
          cloudPath: cloudPath,
          filePath: tempFilePaths,
          success: (res) => {
            console.log(res)
            this.setData({
              url: res.fileID,
              text: name
            })
            this.handleUpload()
          },
          fail: (res) => {
            console.log(res)
          }
        })
      }
    })
  },
  handleUpload() {
    return new Promise((resolve, reject) => {
      wx.cloud.callFunction({
        name: 'user',
        data: {
          type: "handleUpload",
          info: {
            fileID: this.data.url
          }
        },
        success: (res) => {
          console.log(res)
          wx.hideLoading({
            success: (res) => {},
          })
          if (res.result.code == "success") {
            wx.showToast({
              title: '上传成功',
            })
          } else {
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
  upload() {
    wx.showLoading({
      title: '正在导入',
    });
    wx.cloud.callFunction({
      name: 'user',
      data: {
        type: "uploadUsers",
        info: {
          fileID: this.data.url
        }
      },
      success: (res) => {
        console.log(res)
        if (res.result.code == "success") {
          wx.hideLoading({
            success: (res) => {},
          })
          wx.showToast({
            title: '上传成功 新增:'+res.result.createNumber+'条\n更新:'+res.result.updateNumber+'条 错误:'+res.result.errorNumber+'条',
            icon:'none',
            duration: 7000
          })
        } else {
          wx.hideLoading({
            success: (res) => {},
          })
          wx.showToast({
            title: res.result.des,
            icon: 'none',
            duration: 2000
          })
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