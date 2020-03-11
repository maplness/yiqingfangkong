// pages/enterpriseReport.js
var QQMapWX = require('../utils/qqmap-wx-jssdk.js');
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    texts: "0/500",
    form:{},
    charNumber: 0,
    current_location: "",

    //multiple picker
    objectMultiShow: [],
    objectMultiArray: [],
    multiArray: [],
    multiIndex: [],
    checkeIndex: [],
    eventType: "请选择"
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

    // console.log(params);
    if (that.data.eventType == '请选择') {
      wx.showModal({
        content: '请选择事件类型',
        showCancel: false
      })
      return false
    }
    params.eventType = that.data.eventId
    var url = app.globalData.host+'/report/reportInfo';
    wx.request({
      url:url,
      method: "POST",
      data: params,
      header: {
        "Authorization": app.globalData.access_token
      },
      success(res) {
        // console.log(res)
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
            // console.log(that.data.current_location)
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

    //mutiple picker
    // 初始化
    let data = {
      objectMultiShow: this.data.objectMultiShow,
      objectMultiArray: this.data.objectMultiArray,
      multiArray: this.data.multiArray,
      multiIndex: this.data.multiIndex,
      checkeIndex: this.data.checkeIndex
    }
    data.objectMultiArray = app.globalData.eventTypeArray

    data.objectMultiShow = data.objectMultiArray.map((item, index) => {
      if (index > 0) {
        item = item.filter(i => i.parentId === data.objectMultiArray[index - 1][0].id)
      }
      return item
    })
    data.multiArray = data.objectMultiShow.map(item => {
      item = item.map(i => i.name)
      return item
    })
    // console.log(data.multiIndex)

    // 数据更新
    this.setData(data)

  },
  //mutiple picker
  bindMultiPickerChange: function (e) {
    // console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      multiIndex: e.detail.value
    })
  },
  bindMultiPickerColumnChange: function (e) {
    // console.log('修改的列为', e.detail.column, '，值为', e.detail.value);
    // 初始化数据
    var data = {
      objectMultiShow: this.data.objectMultiShow,
      multiArray: this.data.multiArray,
      multiIndex: this.data.multiIndex
    };

    // 改变第i列数据之后，后几列选择第0个选项（重置）
    data.multiIndex[e.detail.column] = e.detail.value;
    for (let i = e.detail.column; i < data.multiIndex.length - 1; i++) {
      data.multiIndex[i + 1] = 0
    }

    /**
     * 改变第i列数据之后，后几列数据更新
     * 两种写法：for 和 switch，switch为三列选择器写法，for由switch精简拓展过来，可用于多列选择器
     * swich写法：如果更改的是第一列数据，第二列数据通过filter筛选（parentId = 第一列选中项id），同时更新第三列数据
     *            如果更改的是第二列数据，更新第三列数据 通过filter筛选（parentId = 第二列选中项id）
     */
    let arry = this.data.objectMultiArray
    for (let i = e.detail.column; i < data.multiIndex.length - 1; i++) {
      data.objectMultiShow[i + 1] = arry[i + 1].filter(item => item.parentId === data.objectMultiShow[i][data.multiIndex[i]].id)
      data.multiArray[i + 1] = data.objectMultiShow[i + 1].map(item => item.name)
    }
    /*switch (e.detail.column) {
      case 0:
        data.objectMultiShow[1] = arry[1].filter(item => item.parentId === data.objectMultiShow[0][data.multiIndex[0]].id)
        data.multiArray[1] = data.objectMultiShow[1].map(item => item.name)
        data.objectMultiShow[2] = arry[2].filter(item => item.parentId === data.objectMultiShow[1][data.multiIndex[1]].id)
        data.multiArray[2] = data.objectMultiShow[2].map(item => item.name)
        break;
      case 1:
        data.objectMultiShow[2] = arry[2].filter(item => item.parentId === data.objectMultiShow[1][data.multiIndex[1]].id)
        data.multiArray[2] = data.objectMultiShow[2].map(item => item.name)
    }*/
    // 数据更新
    var temp1 = data.multiArray[0][data.multiIndex[0]] ? data.multiArray[0][data.multiIndex[0]] : "请选择"
    var temp2 = data.multiArray[1][data.multiIndex[1]] ? data.multiArray[1][data.multiIndex[1]] : "请选择"
    var temp = temp1 + ' -- ' + temp2
    // console.log(temp)
    this.setData({
      eventType: temp
    })
    this.setData(data);
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