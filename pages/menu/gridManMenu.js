// pages/menu/gridManMenu.js
var app = getApp()
const util = require('../../utils/util.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    currentTab: 0,
    tabArray: ["报事", "记录", "我的"],
    arr: [],
    userId: ''
  },

  //事件处理函数
  bindChange: function (e) {
    var that = this;
    that.setData({ currentTab: e.detail.current });
  },
  swichNav: function (e) {
    var that = this;
    console.log(e.target)
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
  onLoad: function () {
    console.log('onLoad')
    var that = this
    //调用应用实例的方法获取全局数据
    // app.getUserInfo(function (userInfo) {
    //   //更新数据
    //   that.setData({
    //     userInfo: userInfo
    //   })
    // })
  },

  masses(){
    wx.navigateTo({
      url: '../report/generalReport',
    })
  },
  gridMan(){
    wx.navigateTo({
      url: '../report/gridManReport',
    })
  },
  record(){
    wx.navigateTo({
      url: '../record/jobdiary',
    })
  },
  getjobdiaryInfo: function () {
    var that = this;
    var params = {
      userId: that.data.userId
    }
    wx.request({
      url: app.globalData.host +'/worklog/workLog/list',//app.globalData.host + app.globalData.sendFormUrl',
      method: "GET",
      data: params,
      header: {
        "Content-Type": "application/x-www-form-urlencoded",
        "Authorization": app.globalData.access_token
      },
      success(res) {
        console.log(res)
        var r = res.data;
        if (r.code == 200) {
          var jobdiaryArr = r.rows;
          if (jobdiaryArr.length > 0) {
            for (var i in jobdiaryArr) {
              var date = new Date(jobdiaryArr[i].workDay);
              jobdiaryArr[i].workDay = util.formatDate(date);
            }
          }
          that.setData({
            arr: jobdiaryArr
          })
        } else {
          wx.showModal({
            content: r.msg,
            showCancel: false,
          })
        }
      },
      fail(error) {
        wx.showModal({
          content: error.errMsg,
          showCancel: false,
        })
      }
    })
  },
  addtip: function () {
    wx.navigateTo({
      url: '/pages/record/add'
    })
  },
  detailtip: function (e) {
    wx.navigateTo({
      url: '/pages/record/detail?id=' + e.currentTarget.dataset.index,
    })
  },
  /**
   * 获取用户信息
   */
  getUserInfo() {
    var that = this;
    //获取当前登录用户信息
    wx.request({
      url: app.globalData.host +'/getInfo',//app.globalData.host + app.globalData.sendFormUrl',
      method: "GET",
      header: {
        "Content-Type": "application/json;charset=UTF-8",
        "Authorization": app.globalData.access_token
      },
      success(res) {
        console.log(res)
        var r = res.data;
        if (r.code == 200) {
          // that.data.form.userId = r.user.userId
          // that.data.form.userName = r.user.userName
          that.setData({
            userId: r.user.userId
          });
          that.getjobdiaryInfo()
          console.log(r.user);
          console.log(r.user.userName);
        } else {
          wx.showModal({
            content: r.msg,
            showCancel: false,
          })
        }
      },
      fail(error) {
        console.log(error);
        wx.showModal({
          content: error.errMsg,
          showCancel: false,
        })
      }
    })
  },
  onReady: function(){
    this.getUserInfo()
  }


})