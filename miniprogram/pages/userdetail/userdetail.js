// pages/userdetail/userdetail.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    TypeArray: ['学生', '研究所管理员', '超级管理员'],
    mypermission: false,
    multiArray: [],
    multiIndex: [0, 0],
    classList: [],
    class: [],
    name: '',
    id: '',
    phone: '',
    permission: '',
    _class: '',
    _grade: '',
    _id: '',
    flag: false,
    change: '',
    email: '',
    mygrade: '',
    myclass: ''
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
  bindTypeChange: function (e) {
    console.log(e)
    this.setData({
      permission: e.detail.value,
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
          const _class = res.result.info
          for (var i = 0; i < _class.length; i++) {
            if (_class[i].class.length == 0) {
              for (let j = i; j < _class.length-1; j++) {
                _class[j]=_class[j+1]
              }
            }
          }
          this.setData({
            class: _class,
            _class: _class[0].class[0]._id,
            _grade: _class[0]._id
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
    var x = 0,
      y = 0;
    for (let index = 0; index < grade.length; index++) {
      if (this.data.mygrade === grade[index]) {
        x = index
        for (let j = 0; j < classList.length; j++) {
          if (this.data.myclass === classList[index][j])
            y = j
        }
      }
    }
    var array = []
    array.push(grade)
    array.push(classList[x])
    var multiIndex = this.data.multiIndex
    multiIndex[0] = x;
    multiIndex[1] = y;
    this.setData({
      multiArray: array,
      classList: classList,
      multiIndex: multiIndex,
      _grade: _class[x]._id,
      _class: _class[x].class[y]._id
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
    if (this.data.change === this.data.permission) {
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
              email: this.data.email
            }
          },
          success: async (res) => {
            await this.getMyself()
            if (res.result.code === "fail") {
              wx.showToast({
                title: res.result.des,
                icon: 'none',
                duration: 2000
              })
            } else {
              wx.showToast({
                title: '修改成功',
                icon:'success',
                duration: 1000
              })
              setTimeout(() => {
                wx.navigateBack({
                  delta: 0,
                })
              }, 1000);
            }
            return resolve(res);
          }
        })
      })
    } else {
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
              email: this.data.email
            }
          },
          success: async (res) => {
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
            email: this.data.email
          }
        },
        success: async (res) => {
          await this.getMyself()
          if (res.result.code === "fail") {
            wx.showToast({
              title: res.result.des,
              icon: 'none',
              duration: 2000
            })
          } else {
            wx.showToast({
              title: res.result.des,
              icon: 'success',
              duration: 2000
            })
            setTimeout(() => {
              wx.navigateBack({
                delta: 0,
              })
            }, 1000);
          }
          return resolve(res);
        }
      })
    })
  },
  getMyself() {
    return new Promise((resolve, reject) => {
      wx.cloud.callFunction({
        name: 'user',
        data: {
          type: "getMyself",
        },
        success: (res) => {
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
    this.setData({
      name: options.name,
      id: options.id,
      phone: options.phone,
      permission: options.permission,
      change: options.permission,
      _id: options._id,
      flag: Boolean(options.flag),
      email: options.email,
      myclass: options.class,
      mygrade: options.grade,
      mypermission: wx.getStorageSync('myself').permission === 2
    })
    this.buildArray()
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