// pages/jobdiary/jobdiary.js
var util = require('../../utils/util.js');
var app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    arr:[],
    userId: ''
  },
  getjobdiaryInfo: function () {
    var that = this;
    var params = {
      userId: that.data.userId
    }
    wx.request({
      url: app.globalData.host + '/worklog/workLog/list',//app.globalData.host + app.globalData.sendFormUrl',
      method: "GET",
      data: params,
      header: {
        "Content-Type": "application/x-www-form-urlencoded",
        "Authorization": app.globalData.access_token
      },
      success(res) {
        // console.log(res)
        var r = res.data;
        if (r.code == 200){
          var jobdiaryArr = r.rows;
          if(jobdiaryArr.length > 0){
            for (var i in jobdiaryArr) {
              var date = new Date(jobdiaryArr[i].workDay);
              jobdiaryArr[i].workDay = util.formatDate(date);
            }
          }
          that.setData({
            arr: jobdiaryArr
          })
        }else{
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
  detailtip: function(e){
    wx.navigateTo({
      url: '/pages/record/detail?id=' + e.currentTarget.dataset.index,
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // this.getjobdiaryInfo()
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    this.getUserInfo()
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
        // console.log(res)
        var r = res.data;
        if (r.code == 200) {
          // that.data.form.userId = r.user.userId
          // that.data.form.userName = r.user.userName
          that.setData({
            userId: r.user.userId
          });
          that.getjobdiaryInfo()
          // console.log(r.user);
          // console.log(r.user.userName);
        } else {
          wx.showModal({
            content: r.msg,
            showCancel: false,
          })
        }
      },
      fail(error) {
        // console.log(error);
        wx.showModal({
          content: error.errMsg,
          showCancel: false,
        })
      }
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})