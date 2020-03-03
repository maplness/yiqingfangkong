// pages/gridOperator/gridOperator.js
import WxValidate from '../../utils/WxValidate.js'
var QQMapWX = require('../../utils/qqmap-wx-jssdk.js');
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    images: [],
    current_location: ""
  },
  chooseImage(e) {
    wx.chooseImage({
      sizeType: ['original', 'compressed'],  //可选择原图或压缩后的图片
      sourceType: ['album', 'camera'], //可选择性开放访问相册、相机
      success: res => {
        const images = this.data.images.concat(res.tempFilePaths)
        // 限制最多只能留下3张照片
        const images1 = images.length <= 3 ? images : images.slice(0, 3)
        console.log(images1);
        this.setData({
          images: images1
        })
      }
    })
  },
  removeImage(e) {
    var that = this;
    var images = that.data.images;
    // 获取要删除的第几张图片的下标
    const idx = e.currentTarget.dataset.idx
    // splice  第一个参数是下表值  第二个参数是删除的数量
    images.splice(idx, 1)
    this.setData({
      images: images
    })
  },
  handleImagePreview(e) {
    const idx = e.target.dataset.idx
    const images = this.data.images
    wx.previewImage({
      current: images[idx],  //当前预览的图片
      urls: images,  //所有要预览的图片
    })
  },
  formSubmit: function (e) {
    var that = this
    const params = e.detail.value
    params.reportType = '2';
    console.log(params);
    if (!this.WxValidate.checkForm(params)) {
      const error = this.WxValidate.errorList[0]
      this.showModal(error)
      return false
    }
    wx.request({
      url: app.globalData.host +'/report/reportInfo',
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
  //验证函数
  initValidate() {
    const rules = {
      eventName: {
        required: true
      },
      eventDetail: {
        required: true
      },
      eventAddress: {
        required: true
      }
    }
    const messages = {
      eventName: {
        required: '请填写报事名称'
      },
      eventDetail: {
        required: '请填写报事详情'
      },
      eventAddress: {
        required: '请填写事件发生位置'
      }
    }
    this.WxValidate = new WxValidate(rules, messages)
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.initValidate();
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