// pages/userdetail/userdetail.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    TypeArray:['学生','研究所管理员','超级管理员'],
    mypermission: false,
    multiArray: [],
    multiIndex: [0, 0],
    classList: [],
    class: [],
    name: '',
    id: '',
    phone: '',
    permission:'',
    _class: '',
    _grade: '',
    _id: '',
    flag:false,
    change:'',
    email:''
  },
  handleInputName(e) {
    const {
      value
    } = e.detail;
    this.setData({
      name: value
    })
  },
  handleInputID(e) {
    const {
      value
    } = e.detail;
    this.setData({
      id: value
    })
  },
  handleInputPhone(e) {
    const {
      value
    } = e.detail;
    this.setData({
      phone: value
    })
  },
  handleInputEmail(e) {
    const {
      value
    } = e.detail;
    this.setData({
      email: value
    })
  },
  bindTypeChange: function(e) {console.log(e)
    this.setData({
      permission:e.detail.value,
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
          this.setData({
            class: res.result.info,
            _class: res.result.info[0].class[0]._id,
            _grade: res.result.info[0]._id
          })
          return resolve(res);
        }
      })
    })
  },
  buildArray() {
    const _class = this.data.class
    var grade = []
    for (var i = 0; i < _class.length; i++) {
      grade.push(_class[i].gradeName)
    }
    var classList = []
    var classItem = []
    for (var j = 0; j < _class.length; j++) {
      for (var i = 0; i < _class[j].class.length; i++) {
        classItem.push(_class[j].class[i].className)
      }
      classList.push(classItem)
      classItem = []
    }
    var array = []
    array.push(grade)
    array.push(classList[0])
    this.setData({
      multiArray: array,
      classList: classList
    })
  },
  bindMultiPickerChange: function (e) {
    this.setData({
      multiIndex: e.detail.value
    })
  },
  bindMultiPickerColumnChange: function (e) {
    var data = {
      multiArray: this.data.multiArray,
      multiIndex: this.data.multiIndex
    };
    data.multiIndex[e.detail.column] = e.detail.value;
    if (e.detail.column == 0) {
      data.multiArray[1] = this.data.classList[e.detail.value];
      data.multiIndex[1] = 0;
    }
    this.setData(data);
    this.setData({
      _grade: this.data.class[data.multiIndex[0]]._id,
      _class: this.data.class[data.multiIndex[0]].class[data.multiIndex[1]]._id
    })
  },
  manage() {
    if(this.data.change===this.data.permission)
    {
      return new Promise((resolve, reject) => {
        wx.cloud.callFunction({
          name: 'user',
          data: {
            type: "manageUser",
            info: {
              docid: this.data._id,
              stuid: this.data.id,
              name: this.data.name,
              phone: this.data.phone,
              class: this.data._class,
              email:this.data.email
            }
          },
          success:async (res) => {
            await this.getMyself()
            if (res.result.code === "fail") {
              wx.showToast({
                title: res.result.des,
                icon: 'none',
                duration: 2000
              })
            } else {
              wx.navigateBack({
                delta: 0,
              })
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
    }
    else{
      return new Promise((resolve, reject) => {
        wx.cloud.callFunction({
          name: 'user',
          data: {
            type: "manageUser",
            info: {
              docid: this.data._id,
              stuid: this.data.id,
              name: this.data.name,
              phone: this.data.phone,
              class: this.data._class,
              permission: this.data.permission,
              email:this.data.email
            }
          },
          success:async (res) => {
            await this.getMyself()
            if (res.result.code === "fail") {
              wx.showToast({
                title: res.result.des,
                icon: 'none',
                duration: 2000
              })
            } else {
              wx.navigateBack({
                delta: 0,
              })
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
    }
    
    
  },
  modify() {
    return new Promise((resolve, reject) => {
      wx.cloud.callFunction({
        name: 'user',
        data: {
          type: "modify",
          info: {
            stuid: this.data.id,
            name: this.data.name,
            phone: this.data.phone,
            class: this.data._class,
            email:this.data.email
          }
        },
        success:async (res) => {
         await this.getMyself()
          if (res.result.code === "fail") {
            wx.showToast({
              title: res.result.des,
              icon: 'none',
              duration: 2000
            })
          } else {
            wx.navigateBack({
              delta: 0,
            })
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
  },
  click() {
    if (this.data.flag) {
      this.modify()
    } else {
      this.manage()
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  async onLoad(options) {
    await this.getClass()
    this.buildArray()
    this.setData({
      name: options.name,
      id: options.id,
      phone: options.phone,
      permission: options.permission,
      change:options.permission,
      _id: options._id,
      flag:options.flag,
      email:options.email,
      mypermission: wx.getStorageSync('myself').permission === 2
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