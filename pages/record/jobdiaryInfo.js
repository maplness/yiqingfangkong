// pages/record/jobdiaryInfo.js
const app = getApp()
const util = require('../../utils/util.js')
import WxValidate from '../../utils/WxValidate.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    stopLoadMoreTiem: false,
    activeIndex: 0,
    imageO: '../../images/record_1.png',
    imageT: '../../images/addRecord.png',
    scrollHeight: 300,
    arr: [],
    triggered: true,
    pageNum: 1,
    pageSize: 10,
    noData: false,
    images: [],
    form: {
      userId: '',
      userName: '',
      workDay: '',
      workGoal: '',
      workDetail: ''
    },
    noDataText: '没有更多了~'
  },
  ToDetail(){
    this.setData({
      activeIndex: 0,
      imageO: '../../images/record_1.png',
      imageT: '../../images/addRecord.png'
    });
  },
  detailtip: function (e) {
    wx.navigateTo({
      url: '/pages/record/detail?id=' + e.currentTarget.dataset.index,
    })
  },
  onPulling(e) {
    // console.log('onPulling:', e)
  },
  onRefresh() {
    let that = this;
    if (that._freshing) return
    that._freshing = true
    that.setData({
      pageNum: 1,
      noData: false
    })
    that.getjobdiaryInfo()
    setTimeout(function () {
      that.setData({
        triggered: false
      })
      that._freshing = false
    }, 1000)

  },
  onRestore(e) {
    // console.log('onRestore:', e)
  },

  onAbort(e) {
    // console.log('onAbort', e)
  },
  scrollLoading(){
    let that = this;
    if (that.stopLoadMoreTiem) {
      return;
    }
    var pageNum = that.data.pageNum + 1; //当前页加1
    that.setData({
      pageNum: pageNum
    })
    that.getjobdiaryInfo()
  },
  addJobDiary(){
    this.setData({
      activeIndex: 1,
      imageO: '../../images/record.png',
      imageT: '../../images/addRecord_1.png'
    });
  },
  submitForm(e){
    let that = this
    const params = e.detail.value
    // 目前用户id先写死
    params.userId = app.globalData.user.userId
    params.workDay = util.formatDate(new Date())

    console.log(params);
    if (!this.WxValidate.checkForm(params)) {
      const error = this.WxValidate.errorList[0]
      this.showModal(error)
      return false
    }
    params.picturePath = ''
    // 先上传照片，再提交表单
    if (that.data.images.length > 0){
      // console.log(that.data.images)
      for (var i = 0; i < that.data.images.length; i++) {
        wx.uploadFile({
          url: app.globalData.host + app.globalData.uploadImgUrl,
          header: {
            "Authorization": app.globalData.access_token
          },
          filePath: that.data.images[i],
          name: 'file',
          success(res) {
            console.log(res.data)
            params.picturePath += JSON.parse(res.data).url + ','
            // console.log(i)
            // console.log(params.picturePath)
            var n = (params.picturePath.split(',')).length - 1;
            //传完了图片
            if (n == (that.data.images.length)) {
              // console.log(params)
              // console.log("图片上传完毕")
              params.picturePath = params.picturePath.substring(0, params.picturePath.length-1)
              that.formSubmit(params)
            }
          }
        })
      }
    }else{
      that.formSubmit(params)
    }
  },
  formSubmit(params){
    let that =  this;
    wx.request({
      url: app.globalData.host + '/worklog/workLog',
      method: "POST",
      data: params,
      header: {
        "Authorization": app.globalData.access_token
      },
      success(res) {
        var r = res.data;
        if (r.code == 200) {
          wx.showToast({
            title: '提交成功！',
            duration: 1000
          });
          setTimeout(function () {
            that.setData({
              activeIndex: 0,
              imageO: '../../images/record_1.png',
              imageT: '../../images/addRecord.png',
              pageNum: 1,
              "form.workDay": '',
              "form.workGoal": '',
              "form.workDetail": '',
              images: []
            });
            that.getjobdiaryInfo()
          }, 1000)
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
  //报错 
  showModal(error) {
    wx.showModal({
      content: error.msg,
      showCancel: false,
    })
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
  getjobdiaryInfo: function () {
    var that = this;
    that.stopLoadMoreTiem = true
    wx.showLoading({
      title: '玩命加载中',
    })
    var params = {
      userId: app.globalData.user.userId,
      pageNum: that.data.pageNum,
      pageSize: that.data.pageSize
    }
    wx.request({
      url: app.globalData.host + app.globalData.jobdiaryRecord,
      method: "GET",
      data: params,
      header: {
        "Authorization": app.globalData.access_token
      },
      success(res) {
        // console.log(res)
        var r = res.data;
        if (r.code == 200) {
          var jobdiaryArr = r.rows
          if (jobdiaryArr.length > 0) {
            for (var i in jobdiaryArr) {
              var date = new Date(jobdiaryArr[i].workDay)
              var date1 = new Date(jobdiaryArr[i].createTime)
              jobdiaryArr[i].workDay = util.formatDate(date)
              jobdiaryArr[i].reportTime = util.formatDateTime(date1)
            }
          }
          if(that.data.pageNum == 1){
            that.setData({
              arr: jobdiaryArr
            })
            if(jobdiaryArr.length == 0){
              that.setData({
                noData: true,
                noDataText: '暂无记录'
              })
              return 
            }else{
              that.setData({
                noData: false,
                noDataText: '没有更多了~'
              })
            }
          }else{
            let arr1 = that.data.arr
            let arr2 = jobdiaryArr
            if(arr1.length < r.total){
                arr1 = arr1.concat(arr2)
            }else{
              wx.showToast({
                title: '已加载全部',
              })
              that.setData({
                noData: true,
              })
              return;
            }
            that.setData({
              arr: arr1
            })
          }
          that.stopLoadMoreTiem = false
          
        } else {
          wx.showToast({
            title: r.msg,
            icon: 'none'
          })
        }
      },
      fail(error) {
        wx.showToast({
          title: error.errMsg,
          icon: 'none'
        })
      },
      complete(){
        setTimeout(function(){
          wx.hideLoading();
        },1000)
        
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.computeScrollViewHeight()
    this.getjobdiaryInfo()
    this.initValidate()
  },
  computeScrollViewHeight() {
    let that = this;
    let windowHeight = wx.getSystemInfoSync().windowHeight
    let scrollHeight = windowHeight - 150 * app.globalData.pr_rate - 2;
    that.setData({
      scrollHeight: scrollHeight
    })
    // console.log(that.data.scrollHeight);
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
    let that = this;
    that.setData({
      "form.userId": app.globalData.user.userId,
      "form.userName": app.globalData.user.nickName
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