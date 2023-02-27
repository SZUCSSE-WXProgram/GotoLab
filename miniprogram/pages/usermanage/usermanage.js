// pages/usermanage/usermanage.js
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
      {
        _id:0,
        typeName:"学生",
        isActive:false
      },
      {
        _id:1,
        typeName:"研究所管理",
        isActive:false
      },
      {
        _id:2,
        typeName:"超级管理员",
        isActive:false
      },
    ], 
    users: [],
    hasMore: true,
    offset: 0,
    limit: 15,
    id: 0,
    oldpermission: '',
    TypeArray: ['学生', '研究所管理员', '超级管理员'],
    index:0,
    search:''
  },
  tabclick(e){
    console.log(e)
    const {index}=e.currentTarget.dataset;
    if(!this.data.tabs[index].isActive)
    {
      let {tabs}=this.data;
      tabs.forEach((v,i)=>i===index?v.isActive=true:v.isActive=false);
      this.setData({
        tabs,
        offset:0,
        hasmore:true,  
        users:[],
        index:index
      })
      this.getUser()
    }
  },
  handleInput(e) {
    const {
      value
    } = e.detail;
    this.setData({
      users: [],
      offset: 0,
      search:value
    })
    this.getUser()
  },
  getUser() {
    wx.showLoading({
      title: '加载中',
    })
    wx.cloud.callFunction({
      name: 'user',
      data: {
        type: "getUsers",
        info: {
          limit: this.data.limit,
          offset: this.data.offset,
          search: this.data.search,
          permission:this.data.tabs[this.data.index]._id
        }
      },
      success: (res) => {
        this.setData({
          users: [...this.data.users, ...res.result.data],
          hasMore: res.result.hasMore,
          offset: this.data.offset + this.data.limit
        })
        wx.hideLoading({
          success: (res) => {},
        })
      }
    })
  },
  addAdmin(e) {
    wx.showModal({
      title: '系统提示',
      content: '确认要添加吗？',
      cancelColor: 'cancelColor',
      success: async (res) => {
        if (res.confirm) {
          this.create(e)
        }
      }
    })
  },
  create(e) {
    wx.showLoading({
      title: '加载中',
    })
    return new Promise((resolve, reject) => {
      wx.cloud.callFunction({
        name: 'group',
        data: {
          type: "addGroupAdmin",
          info: {
            groupId: this.data.id,
            userId: e.currentTarget.dataset.id
          }
        },
        success: (res) => {
          wx.hideLoading({
            success: (res) => {},
          })
          if (res.result.code === "success") {
            wx.showToast({
              title: '添加成功',
              duration: 1000
            })
            setTimeout(() => {
              wx.navigateBack({
                delta: 0,
              })
            }, 1000);
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
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.setData({
      id: options.id,
      oldpermission: wx.getStorageSync('myself').permission
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
    this.setData({
      users: [],
      hasMore: true,
      offset: 0,
      search:''
    })
    this.getUser()
    if (this.data.oldpermission === 2 && wx.getStorageSync('myself').permission !== 2) {
      wx.navigateBack({
        delta: 0,
      })
    }
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
    this.setData({
      users: [],
      hasMore: true,
      offset: 0,
      search:''
    })
    this.getUser()
    wx.stopPullDownRefresh({
      success: (res) => {},
    })
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {
    if (this.data.hasMore) {
      this.getUser()
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  }
})