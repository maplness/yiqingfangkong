
import WxValidate from '../../utils/WxValidate.js'
var app = getApp();
var interval = null;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    form: {
      tel: "",
      vcode: ""
    },
    account: "",
    pwd: "",
    isGridMan: false
  },

  telChange(e) {
    this.setData({
      account: e.detail.value
    })
  },

  setPwd(e) {
    this.setData({
      pwd: e.detail.value
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.initValidate();
    
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

  },

  initValidate: function () {
    const rules = {
      tel: {
        required: true,
      },
      vcode: {
        required: true
      }
    }
    const messages = {
      tel: {
        required: '请填写手机号',
      },
      vcode: {
        required: "请填写验证码"
      }
    }
    this.WxValidate = new WxValidate(rules, messages)
  },
  submitForm(e) {
    var that = this
    const params = e.detail.value;

    if (!this.WxValidate.checkForm(params)) {
      const error = this.WxValidate.errorList[0];
      this.showModal(error);
      return false;
    }

    // console.log(params)
    wx.request({
      url:app.globalData.host + '/loginWechat?username=' + params.tel + '&password=' + params.vcode,
      // url: "https://createsharp.cn/scgp/loginWechat?username=admin&password=admin123",
      method: "POST",
      header: {
        "ContentType": "application/json;charset=UTF-8"
      },
      success(res) {
        // console.log(res);
        if(res.data.msg == '操作成功'){
          app.globalData.isLogin = true
          app.globalData.access_token = res.data.token;

          if (params.tel == 'admin') {
            that.data.isGridMan = true;
          } else {
            that.data.isGridMan = false;
          }
          // if (!that.data.isGridMan) {
          //   wx.redirectTo({
          //     url: '../menu/massesMenu',
          //   })
          // }
          // else {
          //   wx.redirectTo({
          //     url: '../menu/gridManMenu',
          //   })
          // }
          wx.switchTab({
            url: '../mainpage/mainpage',
          })
        }
        
      }
    })
    
    
  },
  showModal(error) {
    wx.showModal({
      content: error.msg,
      showCancel: false,
    })
  },
})