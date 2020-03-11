// pages/general/generalSign.js
import WxValidate from '../../utils/WxValidate.js';
var QQMapWX = require('../../utils/qqmap-wx-jssdk.js');
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    form: {
      eventName: '',
      eventDetail: '',
      eventAddress: '',
      eventGrid: '',
      reporterIdNum: '',
      current_location: ""
    },
    event: {
      "eventDay": "2020-03-02",
      "eventName": "摊贩占道经营问题",
      "eventDetail": "恒大城东侧每到下午4点以后，就有一些商贩聚集在道路旁边，占道经营，影响正常交通",
      "eventAddress": "高新区-槐安街158号",
      "eventLatitude": "",
      "eventLongitude": "",
      "eventGridName": "高新区-槐安街道-恒大城居委会-第316网格-孙东磊",
      "eventGrid": "",
      "reporterIdNum": "120223199608211214",
      "picturePath": "",
      "voicePath": "",
      "reportType": "",//1，群众报事；2，网格员报事； 3，公司报事
      "companyId": "",
      "eventStatus": "",
      "solvedInfo": "",
      "solvedUser": "",
      "nickName": "",
      "companyName": "",
      "userId": "",
      "solvedTime": "",
	    "company": "",
      "sort": "",
      "order": ""
    },
    validState: ['核实通过','核实不通过'],
    validValue: "请选择",
    eventToFile:  ['立案处理','销案处理'],
    eventToFileValue: "请选择",
    charNumber: 0,
    images: []
  },
  signDetailInput(e) {
    var v = e.detail.value || '';
    this.setData({
      charNumber: v.length
    });
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
  changeLocation(e) {
    // console.log(this.data.form)
    this.setData({
      current_location: e.detail.value
    })
    this.data.form.eventAddress = this.data.current_location
    this.setData({
      form: this.data.form
    })
    // console.log(this.data.form)
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
  validStateChange: function (e) {
    // console.log('picker发送选择改变，携带值为', e.detail.value)
    let index = e.detail.value
    let validState = this.data.validState
    this.setData({
      index,
      validValue: validState[index]
    })
  },
  eventToFileChange: function (e) {
    // console.log('picker发送选择改变，携带值为', e.detail.value)
    let index = e.detail.value
    let eventToFile = this.data.eventToFile
    this.setData({
      index,
      eventToFileValue: eventToFile[index]
    })
  },
  formSubmit(e) {
    var that = this

    var temp = {
      eventId : 11,
      confirmStatus : '1',
      confirmRemark : "确实",
      registerStatus : "1"
    }
    //rigester case
    wx.request({
      url: app.globalData.host + app.globalData.registerCaseUrl,
      header: {
        "Authroization" : app.globalData.access_token
      },
      method: "POST",
      data: temp,
      success(res){
        console.log(res)
      }
    })


    //提交成功并返回
    wx.showToast({
      title: '登记成功',
      duration: 2000
    })
    setTimeout(function () {
      //要延时执行的代码
      wx.navigateBack({

      })
    }, 2000)

    // const params = e.detail.value;
    // params.picturePath = this.data.images.join(',');
    // params.eventDay = new Date();
    // // console.log(params);
    // if (!this.WxValidate.checkForm(params)) {
    //   const error = this.WxValidate.errorList[0];
    //   this.showModal(error);
    //   return false;
    // }
    // wx.request({
    //   url: app.globalData.host + '/report/reportInfo',
    //   method: "POST",
    //   data: params,
    //   header: {
    //     "Content-Type": "application/json;charset=UTF-8"
    //   },
    //   success(res) {
    //     if (res.data && res.data.code == 200) {
    //       that.showModal({
    //         msg: '提交成功',
    //       });
    //       wx.navigateTo({
    //         url: '/pages/jobdiary/jobdiary'
    //       })
    //     } else {
    //       that.showModal({
    //         msg: '提交失败',
    //       });
    //     }
    //   }
    // });
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
      },
      eventGrid: {
        required: true
      },
      reporterIdNum: {
        required: true,
        idcard: true
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
        required: '请填事件发生位置'
      },
      eventGrid: {
        required: '请填写定位网格'
      },
      reporterIdNum: {
        required: '请填写报事人身份证号',
        idcard: '请输入正确的身份证号'
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
    var event = JSON.parse(options.event)
    console.log(event)
    that.setData({
      event: event
    })

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
            that.data.form.eventAddress = that.data.current_location
            that.setData({
              form: that.data.form
            })
          },
          fail: function (error) {
            // console.error(error);
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