// pages/enterpriseReport.js
var QQMapWX = require('../utils/qqmap-wx-jssdk.js');
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    texts: "0/500",
    form:{},
    charNumber: 0,
    current_location: ""
  },
  signDetailInput(e) {
    var v = e.detail.value || '';
    this.setData({
      charNumber: v.length
    });
  },
  formSubmit: function (e) {
    var that = this
    const params = e.detail.value
    params.reportType = '3';
    const company={
      companyName: params.companyName,
      companyAddress: params.companyAddress,
      companyLeader: params.companyLeader,
      leaderContact: params.leaderContact,
      totalStaffNum: params.totalStaffNum,
      jinanStaffNum: params.jinanStaffNum,
      otherCityStaffNum: params.otherCityStaffNum,
      otherProvinceStaffNum: params.otherProvinceStaffNum,
      hubeiStaffNum: params.hubeiStaffNum,
      wuhanStaffNum: params.wuhanStaffNum
    }
    params.company = company;
    //console.log(params);
    var url = app.globalData.host+'/report/reportInfo';
    wx.request({
      url:url,
      method: "POST",
      data: params,
      header: {
        "Authorization": app.globalData.access_token
      },
      success(res) {
        console.log(res)
        that.showModal({
          msg: '提交成功',
        })
      }
    })
  },
  //报错 
  showModal(error) {
    wx.showModal({
      content: error.msg,
      showCancel: false,
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;

    // 实例化API核心类
    var qqmapsdk = new QQMapWX({
      key: 'PU4BZ-3ZPW6-JNJSB-EQLMY-4QZWZ-LAFEG' // 必填
    });

    wx.getLocation({
      success: function (res) {
        // console.log(res)
        //保存到data里面的location里面
        that.setData({
          location: {
            longitude: res.longitude,
            latitude: res.latitude
          }
        })
        qqmapsdk.reverseGeocoder({
          loc: {
            latitude: res.latitude,
            longitude: res.longitude
          },
          success: function (res) {
            // console.log(res);
            var res = res.result;
            that.setData({
              current_location: res.address
            })
            console.log(that.data.current_location)
          },
          fail: function (error) {
            console.error(error);
          },
          complete: function (res) {
            // console.log(res);
          }
        })
      }
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

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