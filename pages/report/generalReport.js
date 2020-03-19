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
    charNumber: 0,
    images: [],
    eventId: "",
    eventDetail: '',
    //multiple picker
    objectMultiShow: [],
    objectMultiArray: [],
    multiArray: [],
    multiArray2: [],
    multiIndex: [],
    checkeIndex: [],
    eventType: '',
    location: {},
    adCode: ''

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
  getLocation(){
    let that = this;
    // 实例化API核心类
    var qqmapsdk = new QQMapWX({
      key: 'PU4BZ-3ZPW6-JNJSB-EQLMY-4QZWZ-LAFEG' // 必填
    });
    wx.getLocation({
      type: 'gcj02',
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
            console.log(res);
            var res = res.result;
            var adCode = res.ad_info.adcode
            that.setData({
              current_location: res.address,
              adCode: adCode
            })
            // console.log(that.data.current_location)
            that.data.form.eventAddress = that.data.current_location
            that.setData({
              form: that.data.form
            })
            wx.request({
              url: app.globalData.host + app.globalData.getGridInfoUrl,
              header: {
                'Authorization': app.globalData.access_token
              },
              method: 'GET',
              data: {
                adCode: that.data.adCode,
                lng: that.data.location.longitude,
                lat: that.data.location.latitude,
                mapType: 1
              },
              success(res) {
                console.log(res)
                that.setData({
                  gridName: res.data.data.gridName
                })
              }
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
    //get grid name
    
  },
  changeLocation(e){
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
  canceltip() {
    wx.navigateBack({
      
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
  formSubmit: function(e) {
    var that = this
    const params = e.detail.value;
    params.eventDay = new Date();
    params.reportType = '1'
    params.eventLongitude = that.data.location.longitude
    params.eventLatitude = that.data.location.latitude
    if (that.data.eventType == ''){
      wx.showModal({
        content: '请选择事件类型',
        showCancel: false
      })
      return false
    }
    params.eventType = that.data.eventId
    if (!this.WxValidate.checkForm(params)) {
      const error = this.WxValidate.errorList[0];
      this.showModal(error);
      return false;
    }
    params.picturePath = ''
    that.submitForm(params)
    //先上传照片，再提交表单
    // for (var i = 0; i < that.data.images.length; i++) {
    //   wx.uploadFile({
    //     url: app.globalData.host + app.globalData.uploadImgUrl,
    //     header: {
    //       "Authorization": app.globalData.access_token
    //     },
    //     filePath: that.data.images[0],
    //     name: 'file',
    //     success(res) {
    //       params.picturePath += JSON.parse(res.data).url + ','
    //       console.log(i)
    //       console.log(params.picturePath)
    //       var n = (params.picturePath.split(',')).length - 1;
    //       //传完了图片
    //       if (n == (that.data.images.length)) {
    //         console.log(params)
    //         that.submitForm(params)
    //       }
    //     }
    //   })
    // }
    
  },
  submitForm(e){
    var that = this
    wx.request({
      url: app.globalData.host + '/report/reportInfo',
      method: "POST",
      data: e,
      header: {
        "Content-Type": "application/json;charset=UTF-8",
        "Authorization": app.globalData.access_token
      },
      success(res) {
        if (res.data && res.data.code == 200) {
          that.showModal({
            msg: '提交成功',
          });
          // wx.navigateTo({
          //   url: '/pages/jobdiary/jobdiary'
          // })
          setTimeout(function () {
            wx.navigateBack({

            })
          }, 1000);

        } else {
          that.showModal({
            msg: '提交失败',
          });
        }
      }
    });
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
        required: '请填事件发生位置'
      },
      eventGrid: {
        required: '请填写定位网格'
      },
      reporterIdNum: {
        required: '请填写报事人联系方式'
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
    console.log("generalReport")

    // 实例化API核心类
    var qqmapsdk = new QQMapWX({
      key: 'PU4BZ-3ZPW6-JNJSB-EQLMY-4QZWZ-LAFEG' // 必填
    });
    that.getLocation()

    // wx.getLocation({
    //   success: function (res) {
    //     // console.log(res)
    //     //保存到data里面的location里面
    //     that.setData({
    //       location: {
    //         longitude: res.longitude,
    //         latitude: res.latitude
    //       }
    //     })
    //     qqmapsdk.reverseGeocoder({
    //       loc: {
    //         latitude: res.latitude,
    //         longitude: res.longitude
    //       },
    //       success: function (res) {
    //         // console.log(res);
    //         var res = res.result;
    //         that.setData({
    //           current_location: res.address
    //         })
    //         // console.log(that.data.current_location)
    //         that.data.form.eventAddress = that.data.current_location
    //         that.setData({
    //           form: that.data.form
    //         })
    //       },
    //       fail: function (error) {
    //         // console.error(error);
    //       },
    //       complete: function (res) {
    //         // console.log(res);
    //       }
    //     })
    //   }
    // })

    //mutiple picker
    // 初始化
    let data = {
      objectMultiShow: this.data.objectMultiShow,
      objectMultiArray: this.data.objectMultiArray,
      multiArray: this.data.multiArray,
      multiArray2: this.data.multiArray2,
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
    data.multiArray2 = data.objectMultiShow.map(item => {
      item = item.map(i => i.id)
      return item
    })
    // console.log(data.multiIndex)
    
    // 数据更新
    this.setData(data)

  },

  //mutiple picker
  bindMultiPickerChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
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
      multiArray2: this.data.multiArray2,
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
      data.multiArray2[i + 1] = data.objectMultiShow[i + 1].map(item => item.id)
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
    if (data.multiIndex[0] == undefined || data.multiIndex[0] == 'undefined') {
      data.multiIndex[0] = 0;
    }
    var temp1 = data.multiArray[0][data.multiIndex[0]] ? data.multiArray[0][data.multiIndex[0]] : "请选择"
    var temp2 = data.multiArray[1][data.multiIndex[1]] ? data.multiArray[1][data.multiIndex[1]] : "请选择"
    var temp = temp1 + ' -- ' + temp2
  
    var id1 = data.multiArray2[0][data.multiIndex[0]]
    var id2 = data.multiArray2[1][data.multiIndex[1]]
    console.log(data.multiArray2);
    console.log(data.multiIndex[0]);
    console.log(id1 + ',' + id2)
    // console.log(temp)
    this.setData({
      eventType: temp,
      eventId : id1+','+id2
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
    var pages = getCurrentPages();
    var currPage = pages[pages.length - 1];
    // console.log(currPage.__data__.eventDetail);//此处既是上一页面传递过来的值
    this.data.form.eventDetail = currPage.__data__.eventDetail
    this.setData({
      "form.eventDetail": currPage.__data__.eventDetail
    })
  },
  getEventDetail() {
    wx.navigateTo({
      url: '/pages/report/generalReportEventDetail?eventDetail='+ this.data.form.eventDetail,
    })
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