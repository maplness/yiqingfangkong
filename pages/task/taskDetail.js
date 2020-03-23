// pages/task/taskDetail.js
const app = getApp()
const util = require('../../utils/util.js')
let timer;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    l3_height: 300,
    pre_scrollTop: 0,
    heightArr: [0,583,677,1400],
    activeIndex: 0,
    indicatorLeft: 0,
    ViewTo: "",
    event: {
      eventName : "郑州发现一名“毒王”",
      eventDetail : "2020-03-13日，在郑州市XXX区金域国际小区发现一名新冠状肺炎疫区归来人员，该人员是回国后隐瞒出国史病且在出现症状后仍欺骗社区工作人员及警方该男子被媒体戏称郑州“毒王”",
      eventType: "市容环境问题",
      eventDay: "2020-03-13",
      eventGrid: "郑州市XXX区金裕网格",
      eventAddress: "郑州市XXX区金域国际小区1号楼1单元412",
      eventImage: [
        "https://tva1.sinaimg.cn/large/00831rSTgy1gcq790nhy9j30ku09wq7v.jpg",
        "https://tva1.sinaimg.cn/large/00831rSTgy1gcq790nhy9j30ku09wq7v.jpg",
        "https://tva1.sinaimg.cn/large/00831rSTgy1gcq790nhy9j30ku09wq7v.jpg"
      ]
    },
    taskStatusImg: "../../images/task1.png",
    stateIndex: '1',
    eventType1: '',
    eventType2: '',
    eventToFileValue: 'caseIn',
    index: 0,
    opinion: '',
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
        auditPerson: "李大力",
        active: "0",
        time: "03-13 09:53"
      },
      {
        avatar: "https://tva1.sinaimg.cn/large/00831rSTgy1gcvzklju4xj30dc0hs0ty.jpg",
        stepName: "任务派遣",
        auditPerson: "李大力",
        active: "0",
        time: "03-13 09:53"
      },
      {
        avatar: "https://tva1.sinaimg.cn/large/00831rSTgy1gcvzklju4xj30dc0hs0ty.jpg",
        stepName: "任务处理",
        auditPerson: "李大力",
        active: "0",
        time: "03-13 09:53"
      },
      {
        avatar: "https://tva1.sinaimg.cn/large/00831rSTgy1gcvzklju4xj30dc0hs0ty.jpg",
        stepName: "处理反馈",
        auditPerson: "李大力",
        active: "0",
        time: "03-13 09:53"
      },
      {
        avatar: "https://tva1.sinaimg.cn/large/00831rSTgy1gcvzklju4xj30dc0hs0ty.jpg",
        stepName: "核查结案",
        auditPerson: "李大力",
        active: "0",
        time: "03-13 09:53"
      },
      {
        avatar: "https://tva1.sinaimg.cn/large/00831rSTgy1gcvzklju4xj30dc0hs0ty.jpg",
        stepName: "完成",
        auditPerson: "李大力",
        active: "0",
        time: "03-13 09:53"
      },
      
    ],
    caseOption: [
      { name: 'caseIn', value: '立案处理', checked: 'true' },
      { name: 'caseOff', value: '销案处理' }
    ],
    images: [],
    filingImages: [],
    dictType: 'event_history_status'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    var currentEvent = JSON.parse(options.currentEvent)
    console.log(currentEvent)
    //将事件图片塞到里边
    if (currentEvent.picturePath != null && currentEvent.picturePath != '') {
      let imagesPath = currentEvent.picturePath.split(',')
      let imagesArr = []
      for (let i = 0; i < imagesPath.length; i++) {
        imagesArr.push(app.globalData.imageHost + imagesPath[i])
      }
      console.log(imagesArr)
      that.setData({
        images: imagesArr
      })
    }
    this.setData({
      event: currentEvent
    })
    var stateIndex = options.statusIndex
    switch (stateIndex){
      case '1':
        that.setData({
          taskStatusImg:"../../images/task1.png",
          stateIndex: stateIndex
        })
        break;
      case '2':
        that.setData({
          taskStatusImg: "../../images/task2.png",
          stateIndex: stateIndex
        })
        break;
      case '3':
        that.setData({
          taskStatusImg: "../../images/task3.png",
          stateIndex: stateIndex
        })
        break;
    }
    //获取处理进程
    that.getAllProcessInfo()
    that.parseEventType(that.data.event.eventType)
    // console.log(app.globalData.eventTypeArray)
  },
  getAllProcessInfo() {
    let that = this;
    wx.request({
      url: app.globalData.host + '/system/dict/data/dictType/' + that.data.dictType,
      data: {

      },
      method: "GET",
      header: {
        "Authorization": app.globalData.access_token
      },
      success(res) {
        // console.log(res)
        if (res.data.code == 200) {
          if (res.data.data.length > 0) {
            let r = res.data.data;
            let processArr = []
            for (let i = 0; i < r.length; i++) {
              let process = {
                avatar: "https://tva1.sinaimg.cn/large/00831rSTgy1gcvzklju4xj30dc0hs0ty.jpg",
                stepName: r[i].dictLabel,
                stepId: r[i].dictValue + "",
                auditPerson: '',
                active: "0",
                time: ''
              }
              processArr.push(process)
            }
            that.setData({
              processArray: processArr
            })
            //根据事件id获取事件流程
            that.getCurrentEventHisProcess()
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
  getCurrentEventHisProcess() {
    let that = this;
    wx.request({
      url: app.globalData.host + '/event/historyInfo/listEventHistory/' + that.data.event.id,
      data: {

      },
      method: "GET",
      header: {
        "Authorization": app.globalData.access_token
      },
      success(res) {
        // console.log(res)
        let r = res.data
        if (r.code == 200) {
          // console.log(r)
          let processArr = that.data.processArray;
          if (processArr.length > 0 && r.data.length > 0) {
            for (let i = 0; i < processArr.length; i++) {
              for (let j = 0; j < r.data.length; j++) {
                if (processArr[i].stepId == r.data[j].eventStageStatus) {
                  // processArr[i].avatar = app.globalData.imageHost + r.data[j].avatar
                  processArr[i].avatar = "https://tva1.sinaimg.cn/large/00831rSTgy1gcvzklju4xj30dc0hs0ty.jpg"
                  if (r.data[j].nickName != null && r.data[j].nickName != '') {
                    processArr[i].auditPerson = r.data[j].nickName
                  }
                  if (r.data[j].eventStageFinish == 1) {
                    //代表当前阶段已经完成
                    processArr[i].active = '1'
                    processArr[i].time = util.formatTime1(new Date(r.data[j].eventStageEndTime))
                  } else if (r.data[j].eventStageFinish == 2) {
                    //代表当前阶段正在进行中
                    processArr[i].active = '2'
                    processArr[i].time = util.formatTime1(new Date(r.data[j].eventStageStartTime))
                  } else {
                    //代表当前阶段完成失败（暂未考虑）
                  }

                }
              }
            }
          }
          that.setData({
            processArray: processArr
          })
          // console.log(that.data.processArray)
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
  parseEventType(e){
    var that = this
    var array = e.split(',')
    var eventType1 = app.globalData.eventTypeArray[0]
    var eventType2 = app.globalData.eventTypeArray[1]
    for(var i = 0;i<eventType1.length;i++){
      if(parseInt(array[0]) == eventType1[i].id){
        that.setData({
          eventType1: eventType1[i].name
        })
      }
    }
    for(var i = 0;i<eventType2.length;i++){
      if(parseInt(array[1]) == eventType2[i].id){
        that.setData({
          eventType2: eventType2[i].name
        })
      }
    }
  }, 
  chooseImage(e) {
    wx.chooseImage({
      sizeType: ['original', 'compressed'],  //可选择原图或压缩后的图片
      sourceType: ['album', 'camera'], //可选择性开放访问相册、相机
      success: res => {
        const images = this.data.filingImages.concat(res.tempFilePaths)
        // 限制最多只能留下3张照片
        const images1 = images.length <= 3 ? images : images.slice(0, 3)
        // console.log(images1);
        this.setData({
          filingImages: images1
        })
      }
    })
  },
  removeImage(e) {
    var that = this;
    var images = that.data.filingImages;
    // 获取要删除的第几张图片的下标
    const idx = e.currentTarget.dataset.idx
    // splice  第一个参数是下表值  第二个参数是删除的数量
    images.splice(idx, 1)
    this.setData({
      filingImages: images
    })
  },
  handleImagePreview(e) {
    const idx = e.target.dataset.idx
    const images = this.data.filingImages
    wx.previewImage({
      current: images[idx],  //当前预览的图片
      urls: images,  //所有要预览的图片
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
  radioChange: function (e) {
    　　console.log('radio发生change事件，携带value值为：', e.detail.value)
        this.setData({
          eventToFileValue: e.detail.value
        })
  },

  opinionChange(e){
    this.setData({
      opinion: e.detail.value
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
    // this.animateIndicator()
  },
  computeScrollViewHeight(){
    let that = this
    var pr_rate = app.globalData.pr_rate
    var windowHeight = app.globalData.windowHeight
    var l3_height = windowHeight - (158+108+216)*pr_rate
    // console.log(pr_rate)
    // console.log(windowHeight)
    // console.log(l3_height)
    that.setData({
      l3_height: l3_height
    })
  },
  setIndicator(e){
    //trans rpx to px
    var res = e*app.globalData.pr_rate
    this.setData({
      indicatorLeft: res
    })
  },
  animateIndicator12(){
    var that = this
    // console.log('调用了12')
    var offsetX = 250*app.globalData.pr_rate
    this.animate('#indicator', [
      {  ease: 'ease-in'},
      {  translate: [offsetX,0] ,ease: 'ease-out'}
    ], 100 , function(){
      that.clearAnimation('#indicator', { translate: true }, function () {
        // console.log("清除了#container上的动画属性")
      })
      that.setIndicator(350)
    })
    // this.animate('#title1')
    
  },
  animateIndicator21(){
    var that = this
    // console.log('调用了21')
    var offsetX = 250*app.globalData.pr_rate
    this.animate('#indicator', [
      {  ease: 'ease-in'},
      {  translate: [-offsetX,0] ,ease: 'ease-out'}
    ], 100, function(){
      that.clearAnimation('#indicator', { translate: true }, function () {
        // console.log("清除了#container上的动画属性")
      })
      that.setIndicator(100)
    })
    
  },
  animateIndicator13(){
    var that = this
    // console.log('调用了13')
    var offsetX = 500*app.globalData.pr_rate
    this.animate('#indicator', [
      {  ease: 'ease-in'},
      {  translate: [offsetX,0] ,ease: 'ease-out'}
    ], 100 , function(){
      that.clearAnimation('#indicator', { translate: true }, function () {
        // console.log("清除了#container上的动画属性")
      })
      that.setIndicator(600)
    })
    
  },
  animateIndicator31(){
    var that = this
    // console.log('调用了31')
    var offsetX = 500*app.globalData.pr_rate
    this.animate('#indicator', [
      {  ease: 'ease-in'},
      {  translate: [-offsetX,0] ,ease: 'ease-out'}
    ], 100, function(){
      that.clearAnimation('#indicator', { translate: true }, function () {
        // console.log("清除了#container上的动画属性")
      })
      that.setIndicator(100)
    })
    
  },
  animateIndicator23(){
    var that = this
    // console.log('调用了23')
    var offsetX = 250*app.globalData.pr_rate
    this.animate('#indicator', [
      {  ease: 'ease-in'},
      {  translate: [offsetX,0] ,ease: 'ease-out'}
    ], 100 , function(){
      that.clearAnimation('#indicator', { translate: true }, function () {
        // console.log("清除了#container上的动画属性")
      })
      that.setIndicator(600)
    })
    
  },
  animateIndicator32(){
    var that = this
    // console.log('调用了32')
    var offsetX = 250*app.globalData.pr_rate
    this.animate('#indicator', [
      {  ease: 'ease-in'},
      {  translate: [-offsetX,0] ,ease: 'ease-out'}
    ], 100, function(){
      that.clearAnimation('#indicator', { translate: true }, function () {
        // console.log("清除了#container上的动画属性")
      })
      that.setIndicator(350)
    })
    
  },
  scroll(e){
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
          switch(curActiveIndex*10+i){
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
  ToProcess(){
    this.setData({
      ViewTo: "process"
    })
  },
  ToRemark(){
    this.setData({
      ViewTo: "remark"
    })
  },
  ToDetail(){
    this.setData({
      ViewTo: "detail"
    })
  },
  approved(){
    var that = this
    that.data.event.caseInfo.eventId = that.data.event.id
    //confirm status
    
    that.data.event.caseInfo.confirmStatus = '1'
    //confirm remark
    that.data.event.caseInfo.confirmRemark = that.data.opinion
    //register status
    if (that.data.eventToFileValue == 'caseIn') {
      that.data.event.caseInfo.registerStatus = '1'
    } else{
      that.data.event.caseInfo.registerStatus = '2'
    }
    if (that.data.opinion == ''){
      wx.showModal({
        content: '请输入审批意见',
        showCancel: false
      })
      return false
    }
    let confirmImg = ''
    // that.submitForm(params)

    //先上传照片，再提交
    if (that.data.filingImages.length > 0) {
      // console.log(that.data.filingImages)
      for (var i = 0; i < that.data.filingImages.length; i++) {
        wx.uploadFile({
          url: app.globalData.host + app.globalData.uploadImgUrl,
          header: {
            "Authorization": app.globalData.access_token
          },
          filePath: that.data.filingImages[i],
          name: 'file',
          success(res) {
            // console.log(res.data)
            confirmImg += JSON.parse(res.data).url + ','
            // console.log(i)
            // console.log(confirmImg)
            var n = (confirmImg.split(',')).length - 1;
            //传完了图片
            if (n == (that.data.filingImages.length)) {
              // console.log("图片上传完毕")
              confirmImg = confirmImg.substring(0, confirmImg.length - 1)
              that.data.event.caseInfo.confirmImg = confirmImg
              that.auditCurrentEvent()
            }
          }
        })
      }
    } else {
      that.auditCurrentEvent()
    }
    
  },
  auditCurrentEvent(){
    let that = this
    wx.request({
      url: app.globalData.host + app.globalData.registerCaseUrl,
      header: {
        "Authorization": app.globalData.access_token
      },
      method: "POST",
      data: that.data.event.caseInfo,
      success(res) {
        console.log(res)
        if(res.data.code == 200){
          //提交成功并返回
          wx.showToast({
            title: '审核成功',
          })
          setTimeout(function () {
            //要延时执行的代码
            wx.navigateBack({

            })
          }, 1000)
        }else{
          wx.showToast({
            title: res.data.msg,
            icon: 'none'
          })
        }
      }
    })  
  },
  approvedFail(){
    var that = this
    // that.data.event.caseInfo.id = that.data.event.id
    //eventid
    that.data.event.caseInfo.eventId = that.data.event.id
    //confirm status
      that.data.event.caseInfo.confirmStatus = '2'
    //confirm remark
    that.data.event.caseInfo.confirmRemark = that.data.opinion
    //register status
    if (that.data.eventToFileValue == 'caseOff') {
      that.data.event.caseInfo.registerStatus = '1'
    }else{
      that.data.event.caseInfo.registerStatus = '2'
    }
    console.log(that.data.event.caseInfo)
    if (that.data.opinion == '') {
      wx.showModal({
        content: '请输入审批意见',
        showCancel: false
      })
      return false
    }
    //rigester case
    that.auditCurrentEvent()
  }
})

