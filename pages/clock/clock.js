
var time = require('../../utils/time.js');
var QQMapWX = require('../../utils/qqmap-wx-jssdk.js');


const app = getApp();
// pages/items/map.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    icon_clock: "../../images/clock.png",
    icon_position: "../../images/position.png",
    current_time: "now",
    current_location: "当前位置：",
    location: {
      longitude: "",
      latitude: ""
    },
    params:{
      workDay: "",
      checkAttendance: "",
      checkType: "",
      latitude: "",
      longitude: "",
      areaName: "",
      checkTime: "",
      nickName: ""
    }
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

    var workDay = 'params.workDay'
    var checkTime = 'params.checkTime'
    var nickName = 'params.nickName'
    that.setData({
      [nickName]: app.globalData.user.userName
    })

    setInterval(function () {
      that.setData({
        current_time: time.getNowTime2(),
        [workDay]: time.getDate(),
        [checkTime]: time.getNowTime2(),
        
      })
    }, 1000)

    wx.getLocation({
      success: function (res) {
        console.log(res)
        //保存到data里面的location里面
        var lat = 'params.latitude'
        var lng = 'params.longitude'
        that.setData({
          location: {
            longitude: res.longitude,
            latitude: res.latitude,
          },
          [lat]: res.latitude.toString(),
          [lng]: res.longitude.toString()
        })
        qqmapsdk.reverseGeocoder({
          loc: {
            latitude: res.latitude,
            longitude: res.longitude
          },
          success: function (res) {
            console.log(res);
            var res = res.result;
            var areaName = 'params.areaName'
            that.setData({
              current_location: res.address,
              [areaName]: res.address
            })
          },
          fail: function (error) {
            console.error(error);
          },
          complete: function (res) {
            console.log(res);
            console.log(that.data.params)
          }
        })
      }
    })
  },
  clockIn(){
    var that = this
    that.data.params.checkType = '1'
    wx.request({
      url: app.globalData.host + app.globalData.clockUrl,
      header:{
        "Authorization":app.globalData.access_token,
        "content-type":"application/json"
      },
      data: that.data.params,
      method: "POST",
      success(res){
        console.log(res)
      }
    })
  },
  clockOut() {
    var that = this
    that.data.params.checkType = '2'
    wx.request({
      url: app.globalData.host + app.globalData.clockUrl,
      header: {
        "Authorization": app.globalData.access_token,
        "content-type": "application/json"
      },
      data: that.data.params,
      method: "POST",
      success(res) {
        console.log(res)
      }
    })
  }
})