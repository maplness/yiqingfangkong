// pages/menu/massesMenu.js
const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    currentTab: 0,
    tabArray: ["报事", "我的"],
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    menuitems: [
      { text: '我的报事', url: '../report/reportRecord', icon: '../../images/jilu.png', tips: '' },
      { text: '个性设置', url: '../userinfo/userinfo', icon: '../../images/icon-index.png', tips: '' }
    ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    if (app.globalData.userInfo) {
      that.setUserInfo(app.globalData.userInfo);
    } else if (that.data.canIUse) {
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        that.setUserInfo(res.userInfo);
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          that.setUserInfo(res.userInfo);
        }
      })
    }

    //获取事件类型
    wx.request({
      url: app.globalData.host + app.globalData.getEventTypeUrl,
      header: {
        "Authorization": app.globalData.access_token
      },
      success(res) {
        console.log(res)
        app.globalData.eventTypeArray = res.data.data
      }
    })
  },
  //事件处理函数
  bindChange: function (e) {
    var that = this;
    that.setData({ currentTab: e.detail.current });
  },
  swichNav: function (e) {
    var that = this;
    // console.log(e.target)
    if (this.data.currentTab === e.target.dataset.current) {
      return false;
    } else {
      that.setData({
        currentTab: e.target.dataset.current
      })
      wx.setNavigationBarTitle({
        title: that.data.tabArray[e.target.dataset.current]
      })
    }
  },

  enterprise(){
    // console.log("111")
    wx.navigateTo({
      url: '../enterpriseReport',
    })
  },
  masses(){
    wx.navigateTo({
      url: '../report/generalReport',
    })
  },
  getUserInfo: function (e) {
    this.setUserInfo(e.detail.userInfo);
  },

  setUserInfo: function (userInfo) {
    if (userInfo != null) {
      app.globalData.userInfo = userInfo
      this.setData({
        userInfo: userInfo,
        hasUserInfo: true
      })
    }
  }
})