// pages/classmanage/classmanage.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    class: [],
    name: '',
    cname: '',
    index: 0,
  },
  listpx(e) {
    let index = e.currentTarget.dataset.index
    let eclass = this.data.class
    eclass[index].pxopen = !eclass[index].pxopen
    this.setData({
      class: eclass
    })
  },
  getClass() {
    return new Promise((resolve, reject) => {
      wx.cloud.callFunction({
        name: 'class',
        data: {
          type: "getList",
        },
        success: (res) => {
          console.log(res)
          let eclass = res.result.info;
          for (let index = 0; index < eclass.length; index++) {
            eclass[index].pxopen = false;
            eclass[index].index = index;
          }
          this.setData({
            class: eclass,
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
  handleInputcName(e) {
    const {
      value
    } = e.detail;
    this.setData({
      cname: value
    })
  },
  modifyclass(e) {
    const {
      id
    } = e.currentTarget.dataset;
    return new Promise((resolve, reject) => {
      wx.cloud.callFunction({
        name: 'class',
        data: {
          type: "modify",
          info: {
            className: this.data.name,
            _id: id
          }
        },
        success: (res) => {
          if (res.result.code === 'success') {
            this.setData({
              name: ''
            })
            wx.showToast({
              title: res.result.des,
              icon: 'success'
            })
          } else {
            wx.showToast({
              title: res.result.des,
              icon: 'none'
            })
          }
          return resolve(res);
        }
      })
    })
  },
  deleteClass(id) {
    return new Promise((resolve, reject) => {
      wx.cloud.callFunction({
        name: 'class',
        data: {
          type: "delete",
          info: {
            _id: id
          }
        },
        success: (res) => {
          if (res.result.code === 'success') {
            this.getClass()
            wx.showToast({
              title: '删除成功',
              icon: 'success'
            })
          } else {
            wx.showToast({
              title: res.result.des,
              icon: 'none'
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
      success: (res) => {
        if (res.confirm) {
          this.deleteClass(id)
        }
      }
    })
  },
  create(e) {
    const {
      index
    } = e.currentTarget.dataset;
    return new Promise((resolve, reject) => {
      wx.cloud.callFunction({
        name: 'class',
        data: {
          type: "create",
          info: {
            className: this.data.cname,
            gradeId: index
          }
        },
        success: (res) => {
          if (res.result.code === 'success') {
            this.getClass()
            this.setData({
              cname: ''
            })
            wx.showToast({
              title: res.result.des,
              icon: 'success'
            })
          } else {
            wx.showToast({
              title: res.result.des,
              icon: 'none'
            })
          }
          return resolve(res);
        }
      })
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.getClass()
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