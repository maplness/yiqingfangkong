// pages/jobdiary/add.js
import WxValidate from '../../utils/WxValidate.js'
var util = require('../../utils/util.js');
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    form: {
      userId: '',
      userName: '',
      workDay: '',
      workGoal: '',
      workDetail: ''
    },
    images: [],
    min: 1,
    max: 300
  },
  inputs: function(e){
    var value = e.detail.value;
    var len = parseInt(value.length);
    if (len > this.data.max) {
      return;
    }
    this.setData({
      currentWordNumber: len
    });
    if (this.data.currentWordNumber == this.data.max) {
      wx.showModal({
        title: '提示',
        content: '您输入的次数已达上限',
        showCancel: false
      })
    }
  },
  chooseImage(e) {
    wx.chooseImage({
      sizeType: ['original', 'compressed'],  //可选择原图或压缩后的图片
      sourceType: ['album', 'camera'], //可选择性开放访问相册、相机
      success: res => {
        const images = this.data.images.concat(res.tempFilePaths)
        // 限制最多只能留下3张照片
        const images1 = images.length <= 3 ? images : images.slice(0, 3)
        // console.log(images1);
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
  submitForm(e) {
    var that = this
    const params = e.detail.value
    // 目前用户id先写死
    params.userId = that.data.form.userId
    params.workDay = util.formatDate(new Date());
    // console.log(params);
    if (!this.WxValidate.checkForm(params)) {
      const error = this.WxValidate.errorList[0]
      this.showModal(error)
      return false
    }
    wx.request({
      url: app.globalData.host +'/worklog/workLog',//app.globalData.host + app.globalData.sendFormUrl',
      method: "POST",
      data: params,
      header: {
        "Content-Type": "application/json;charset=UTF-8",
        "Authorization": app.globalData.access_token
      },
      success(res) {
        var r = res.data;
        if(r.code == 200){
          wx.showToast({
            title: '提交成功！',
            duration: 3000
          });
          wx.navigateTo({
            url: '/pages/record/jobdiary'
          })
        }else{
          wx.showModal({
            content: r.msg,
            showCancel: false,
          })
        }
      },
      fail(error){
        // console.log(error);
        wx.showModal({
          content: error.errMsg,
          showCancel: false,
        })
      }
    })
    
  },
  /**
   * 取消返回上一级页面
   */
  canceltip(){
    wx.navigateBack({
      
    })
  },
  /**
   * 获取用户信息
   */
  getUserInfo(){
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
            form: {
              userId: r.user.userId,
              userName: r.user.userName,
              workDay: '',
              workGoal: '',
              workDetail: ''
            }
          });
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
  // onLoad() {
  //   this.initValidate()//验证规则函数
  // },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    rules: { }
    messages: { }
    this.initValidate()
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
      userName: {
        required: true
      },
      workGoal: {
        required: true
      },
      workDetail: {
        required: true
      }
    }
    const messages = {
      userName: {
        required: '请填写填报人'
      },
      workGoal: {
        required: '请填写工作目标'
      },
      workDetail: {
        required: '请填写工作记录'
      }
    }
    this.WxValidate = new WxValidate(rules, messages)
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    this.getUserInfo();
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