// pages/task/taskProcessDetail.js
const app = getApp()
const time = require('../../utils/time.js')
let timer = null
Page({

  /**
   * 页面的初始数据
   */
  data: {
    id: '',
    taskId: '',
    l3_height: 300,
    pre_scrollTop: 0,
    heightArr: [0, 583, 677, 1400],
    activeIndex: 0,
    indicatorLeft: 0,
    ViewTo: "",
    taskStatusImg: "../../images/task1.png",
    stateIndex: '1',
    eventType1: '',
    eventType2: '',
    index: 0,
    opinion: '',
    event: {
      
    },
    images: [],
    solveInfo: '',
    solveImages: [],
    processArray: [
      {
        avatar: "https://tva1.sinaimg.cn/large/00831rSTgy1gcvzklju4xj30dc0hs0ty.jpg",
        stepName: "事件上报",
        auditPerson: "李大力",
        active: "1",
        time: "03-13 09:53"
      },
      {
        avatar: "https://tva1.sinaimg.cn/large/00831rSTgy1gcvzklju4xj30dc0hs0ty.jpg",
        stepName: "案卷建立",
        auditPerson: "超级管理员",
        active: "1",
        time: "03-13 09:53"
      },
      {
        avatar: "https://tva1.sinaimg.cn/large/00831rSTgy1gcvzklju4xj30dc0hs0ty.jpg",
        stepName: "任务派遣",
        auditPerson: "超级管理员",
        active: "1",
        time: "03-13 09:53"
      },
      {
        avatar: "https://tva1.sinaimg.cn/large/00831rSTgy1gcvzklju4xj30dc0hs0ty.jpg",
        stepName: "任务处理",
        auditPerson: "超级管理员",
        active: "0",
        time: "03-13 09:53"
      },
      {
        avatar: "https://tva1.sinaimg.cn/large/00831rSTgy1gcvzklju4xj30dc0hs0ty.jpg",
        stepName: "处理反馈",
        auditPerson: "超级管理员",
        active: "0",
        time: "03-13 09:53"
      },
      {
        avatar: "https://tva1.sinaimg.cn/large/00831rSTgy1gcvzklju4xj30dc0hs0ty.jpg",
        stepName: "核查结案",
        auditPerson: "超级管理员",
        active: "0",
        time: "03-13 09:53"
      },
      {
        avatar: "https://tva1.sinaimg.cn/large/00831rSTgy1gcvzklju4xj30dc0hs0ty.jpg",
        stepName: "完成",
        auditPerson: "超级管理员",
        active: "0",
        time: "03-13 09:53"
      }
    ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    var id = options.id
    var stateIndex = options.statusIndex
    switch (stateIndex) {
      case '1':
        that.setData({
          taskStatusImg: "../../images/task1.png",
          stateIndex: stateIndex,
          id: id
        })
        break;
      case '2':
        that.setData({
          taskStatusImg: "../../images/task3.png",
          stateIndex: stateIndex,
          id: id
        })
        break;
    }
    //根据任务详情id查询任务的所有信息
    that.getTaskAllInfo()
  },
  getTaskAllInfo(){
    let that = this;
    wx.request({
      url: app.globalData.host + '/report/reportInfo/taskDetail/'+ that.data.id,
      data: {
        
      },
      method: "GET",
      header: {
        "Authorization": app.globalData.access_token
      },
      success(res) {
        if (res.data.code == 200) {
          that.setData({
            event: res.data.data,
            taskId: res.data.data.taskInfo.id
          })
          
          //将事件图片塞到里边
          if (res.data.data.picturePath != null && res.data.data.picturePath != ''){
            let imagesPath = res.data.data.picturePath.split(',')
            let imagesArr = []
            for (let i = 0; i < imagesPath.length;i++){
              imagesArr.push(app.globalData.imageHost + imagesPath[i])
            }
            that.setData({
              images: imagesArr
            })
          }
          that.parseEventType(that.data.event.eventType)
          //如果点击的是已处理的详情，则进行查看处理图片
          if (res.data.data.taskDetailList[0].solvePic != '' && res.data.data.taskDetailList[0].solvePic !=null && that.data.stateIndex == 2){
            let solveImagesPath = res.data.data.taskDetailList[0].solvePic.split(',')
            let solveImagesArr = []
            for (let i = 0; i < solveImagesPath.length; i++) {
              solveImagesArr.push(app.globalData.imageHost + solveImagesPath[i])
            }
            that.setData({
              solveImages: solveImagesArr
            })
          }else{
            that.setData({
              solveImages: []
            })
          }
        } else {
          wx.showToast({
            title: res.data.msg,
            icon: 'none'
          })
        }
      },
      fail: function (err) {
        wx.showToast({
          title: err.errMsg,
          icon: 'none'
        })
      },//请求失败
      complete: function () {
        
      }//请求完成后执行的函数
    })
  },
  parseEventType(e) {
    var that = this
    var array = e.split(',')
    var eventType1 = app.globalData.eventTypeArray[0]
    var eventType2 = app.globalData.eventTypeArray[1]
    for (var i = 0; i < eventType1.length; i++) {
      if (parseInt(array[0]) == eventType1[i].id) {
        that.setData({
          eventType1: eventType1[i].name
        })
      }
    }
    for (var i = 0; i < eventType2.length; i++) {
      if (parseInt(array[1]) == eventType2[i].id) {
        that.setData({
          eventType2: eventType2[i].name
        })
      }
    }
  }, 
  opinionChange(e) {
    this.setData({
      solveInfo: e.detail.value
    })
  },
  chooseImage(e) {
    wx.chooseImage({
      sizeType: ['original', 'compressed'],  //可选择原图或压缩后的图片
      sourceType: ['album', 'camera'], //可选择性开放访问相册、相机
      success: res => {
        const images = this.data.solveImages.concat(res.tempFilePaths)
        // 限制最多只能留下3张照片
        const images1 = images.length <= 3 ? images : images.slice(0, 3)
        // console.log(images1);
        this.setData({
          solveImages: images1
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
      solveImages: images
    })
  },
  handleImagePreview(e) {
    const idx = e.target.dataset.idx
    const images = this.data.solveImages
    wx.previewImage({
      current: images[idx],  //当前预览的图片
      urls: images,  //所有要预览的图片
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
    this.computeScrollViewHeight()
    this.setIndicator(100)
  },
  computeScrollViewHeight() {
    let that = this
    var pr_rate = app.globalData.pr_rate
    var windowHeight = app.globalData.windowHeight
    var l3_height = 0
    if (that.data.stateIndex == 1){
      l3_height = windowHeight - (158 + 108 + 166) * pr_rate
    }else{
      l3_height = windowHeight - (158 + 108) * pr_rate
    }
    
    // console.log(pr_rate)
    // console.log(windowHeight)
    // console.log(l3_height)
    that.setData({
      l3_height: l3_height
    })
  },
  setIndicator(e) {
    //trans rpx to px
    var res = e * app.globalData.pr_rate
    this.setData({
      indicatorLeft: res
    })
  },
  animateIndicator12() {
    var that = this
    // console.log('调用了12')
    var offsetX = 250 * app.globalData.pr_rate
    this.animate('#indicator', [
      { ease: 'ease-in' },
      { translate: [offsetX, 0], ease: 'ease-out' }
    ], 100, function () {
      that.clearAnimation('#indicator', { translate: true }, function () {
        // console.log("清除了#container上的动画属性")
      })
      that.setIndicator(350)
    })
    // this.animate('#title1')

  },
  animateIndicator21() {
    var that = this
    // console.log('调用了21')
    var offsetX = 250 * app.globalData.pr_rate
    this.animate('#indicator', [
      { ease: 'ease-in' },
      { translate: [-offsetX, 0], ease: 'ease-out' }
    ], 100, function () {
      that.clearAnimation('#indicator', { translate: true }, function () {
        // console.log("清除了#container上的动画属性")
      })
      that.setIndicator(100)
    })

  },
  animateIndicator13() {
    var that = this
    // console.log('调用了13')
    var offsetX = 500 * app.globalData.pr_rate
    this.animate('#indicator', [
      { ease: 'ease-in' },
      { translate: [offsetX, 0], ease: 'ease-out' }
    ], 100, function () {
      that.clearAnimation('#indicator', { translate: true }, function () {
        // console.log("清除了#container上的动画属性")
      })
      that.setIndicator(600)
    })

  },
  animateIndicator31() {
    var that = this
    // console.log('调用了31')
    var offsetX = 500 * app.globalData.pr_rate
    this.animate('#indicator', [
      { ease: 'ease-in' },
      { translate: [-offsetX, 0], ease: 'ease-out' }
    ], 100, function () {
      that.clearAnimation('#indicator', { translate: true }, function () {
        // console.log("清除了#container上的动画属性")
      })
      that.setIndicator(100)
    })

  },
  animateIndicator23() {
    var that = this
    // console.log('调用了23')
    var offsetX = 250 * app.globalData.pr_rate
    this.animate('#indicator', [
      { ease: 'ease-in' },
      { translate: [offsetX, 0], ease: 'ease-out' }
    ], 100, function () {
      that.clearAnimation('#indicator', { translate: true }, function () {
        // console.log("清除了#container上的动画属性")
      })
      that.setIndicator(600)
    })

  },
  animateIndicator32() {
    var that = this
    // console.log('调用了32')
    var offsetX = 250 * app.globalData.pr_rate
    this.animate('#indicator', [
      { ease: 'ease-in' },
      { translate: [-offsetX, 0], ease: 'ease-out' }
    ], 100, function () {
      that.clearAnimation('#indicator', { translate: true }, function () {
        // console.log("清除了#container上的动画属性")
      })
      that.setIndicator(350)
    })

  },
  scroll(e) {
    // console.log(e)
    var that = this
    clearTimeout(timer);
    let srollTop = e.detail.scrollTop;
    var curActiveIndex = that.data.activeIndex;
    timer = setTimeout(() => {

      for (let i = 0; i < that.data.heightArr.length; i++) {
        if (
          srollTop >= that.data.heightArr[i] &&
          srollTop < that.data.heightArr[i + 1] &&
          that.data.activeIndex != i
        ) {
          //判断当前active index 和 preactiveIndex
          switch (curActiveIndex * 10 + i) {
            case 1:
              //01
              that.animateIndicator12()
              break;
            case 2:
              //02
              that.animateIndicator13()
              break;
            case 10:
              //01
              that.animateIndicator21()
              break;
            case 12:
              //02
              that.animateIndicator23()
              break;
            case 20:
              //01
              that.animateIndicator31()
              break;
            case 21:
              //02
              that.animateIndicator32()
              break;
          }
          //01
          that.setData({
            activeIndex: i
          })

        }
      }
    }, 10)

  },
  ToProcess() {
    this.setData({
      ViewTo: "process"
    })
  },
  ToRemark() {
    this.setData({
      ViewTo: "remark"
    })
  },
  ToDetail() {
    this.setData({
      ViewTo: "detail"
    })
  },
  approved(){
    let that = this;
    if (that.data.solveInfo == '') {
      wx.showModal({
        content: '请输入处理详情',
        showCancel: false
      })
      return false
    }
    let params = {
      id: that.data.id,
      taskId: that.data.taskId,
      solveInfo: that.data.solveInfo,
      solvePic: '',
      stage: 2,
      solveTime: time.getNowTime2()
    }
    // console.log(params)
    params.solvePic = ''
    // 先上传照片，再提交表单
    if (that.data.solveImages.length > 0) {
      console.log(that.data.solveImages)
      for (var i = 0; i < that.data.solveImages.length; i++) {
        wx.uploadFile({
          url: app.globalData.host + app.globalData.uploadImgUrl,
          header: {
            "Authorization": app.globalData.access_token
          },
          filePath: that.data.solveImages[i],
          name: 'file',
          success(res) {
            // console.log(JSON.parse(res.data))
            if (JSON.parse(res.data).code == 200){
              params.solvePic += JSON.parse(res.data).url + ','
              // console.log(i)
              // console.log(params.solvePic)
              var n = (params.solvePic.split(',')).length - 1;
              //传完了图片
              if (n == (that.data.solveImages.length)) {
                // console.log("图片上传完毕")
                params.solvePic = params.solvePic.substring(0, params.solvePic.length - 1)
                that.handleEvent(params)
              }
            }else{
              wx.showToast({
                title: res.data.msg,
                icon: 'none'
              })
            }
          }
        })
      }
    }else{
      that.handleEvent(params)
    }
  },
  handleEvent(params){
    let that = this;
    wx.request({
      url: app.globalData.host + '/taskDetail/taskDetail',
      data: params,
      method: "PUT",
      header: {
        "Authorization": app.globalData.access_token
      },
      success(res) {
        if (res.data.code == 200) {
          wx.showToast({
            title: '处理完成',
          })
          setTimeout(function(){
            wx.navigateBack({
              
            })
          },1000)
        } else {
          wx.showToast({
            title: res.data.msg,
            icon: 'none'
          })
        }
      },
      fail: function (err) {
        wx.showToast({
          title: err.errMsg,
          icon: 'none'
        })
      },//请求失败
      complete: function () {

      }//请求完成后执行的函数
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