
var time = require('../../utils/time.js');
var QQMapWX = require('../../utils/qqmap-wx-jssdk.js');

var mapId = 'myMap';
// 实例化API核心类
var qqmapsdk = new QQMapWX({
  key: 'PU4BZ-3ZPW6-JNJSB-EQLMY-4QZWZ-LAFEG' // 必填
});
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
    current_time2: "",
    current_location: "当前位置：",
    signState: '签到',
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
    },
    
  },
  getTime(){
    // console.log(new Date())
    // console.log(this.data.current_time)
    let timeNow = new Date(this.data.current_time).getHours();
    // console.log(timeNow);
    if(timeNow >=0 && timeNow < 12){
      this.setData({
        signState: '签到'
      });
    }else if(timeNow>=12 && timeNow <=23){
      this.setData({
        signState: '签退'
      });
    }else{
      this.setData({
        signState: '签退'
      });
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;

    

    var workDay = 'params.workDay'
    var checkTime = 'params.checkTime'
    var nickName = 'params.nickName'

    setInterval(function () {
      that.setData({
        current_time: time.getNowTime(),
        [workDay]: time.getDate(),
        [checkTime]: time.getNowTime2(),
        current_time2: time.getNowTime3()
        
      })
      that.getTime()
    }, 1000)
    that.requestLocation();
    wx.getLocation({
      success: function (res) {
        // console.log(res)
        //保存到data里面的location里面
        
        that.setData({
          location: {
            longitude: res.longitude,
            latitude: res.latitude,
          },
          
        })
        that.moveTolocation()
        
      }
    })
    // that.getTime();
  },
  //请求地理位置
  requestLocation: function () {
    var that = this;
    var lat = 'params.latitude'
    var lng = 'params.longitude'
    wx.getLocation({
      type: 'gcj02',
      success: function (res) {
        // console.log(res)
        that.setData({
          latitude: res.latitude,
          longitude: res.longitude,
          [lat]: res.latitude.toFixed(5).toString(),
          [lng]: res.longitude.toFixed(5).toString()
        })
        that.moveTolocation();
        qqmapsdk.reverseGeocoder({
          loc: {
            latitude: res.latitude,
            longitude: res.longitude
          },
          success: function (res) {
            // console.log(res);
            var res = res.result;
            var areaName = 'params.areaName'
            that.setData({
              current_location: res.address,
              [areaName]: res.address
            })
          },
          fail: function (error) {
            // console.error(error);
          },
          complete: function (res) {
            // console.log(res);
            // console.log(that.data.params)
          }
        })
      },
    })
  },
  /**
   * 移动到中心点
   */
  moveTolocation: function () {
    // console.log("move to location")
    var mapCtx = wx.createMapContext(mapId);
    mapCtx.moveToLocation();
  },
  clock() {
    var that = this
    if(that.data.signState == '签到'){
      that.data.params.checkType = '1'
    } else if (that.data.signState == '签退'){
      that.data.params.checkType = '2'
    }else{
      return false
    }
    
    wx.request({
      url: app.globalData.host + app.globalData.clockUrl,
      header: {
        "Authorization": app.globalData.access_token,
        "content-type": "application/json"
      },
      data: that.data.params,
      method: "POST",
      success(res) {
        // console.log(res);
        if(res.data.code == 200){
          wx.showToast({
            title: that.data.signState + '成功',
          })
          setTimeout(function () {
            wx.navigateBack({

            })
          }, 1000)
        }else{
          wx.showToast({
            title: that.data.signState + '失败',
            icon: "none"
          })
        }
        
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
        // console.log(res);
        wx.showToast({
          title: '签到成功',
        })
        setTimeout(function(){
          wx.navigateBack({
            
          })
        },1000)
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
        // console.log(res)
        wx.showToast({
          title: '签退成功',
        })
        setTimeout(function () {
          wx.navigateBack({

          })
        }, 1000)
      }
    })
  }
})