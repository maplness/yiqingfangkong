// pages/mainpage/mainpage.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    swiperCurrent: 0,
    indicatorDots: true,
    autoplay: true,
    interval: 3000,
    duration: 800,
    circular: true,
    imgUrls: [
      'https://tva1.sinaimg.cn/large/00831rSTgy1gcs9wh1gicj30tx0boaiz.jpg',
      'https://tva1.sinaimg.cn/large/00831rSTgy1gcs9xqxfplj309z03wabq.jpg',
      'https://tva1.sinaimg.cn/large/00831rSTgy1gcs9yz6s66j30tx0bowpt.jpg'
    ],
    links: [
      '../user/user',
      '../user/user',
      '../user/user'
    ],
    function:[
      {
        icon:"../../images/messes.png",
        label:"群众报事"
      },
      {
        icon:"../../images/grid.png",
        label:"网格员报事"
      },
      {
        icon:"../../images/enterprise.png",
        label:"企业报事"
      },
      {
        icon:"../../images/clock1.png",
        label:"打卡"
      },
      {
        icon:"../../images/f1.png",
        label:"信息采集"
      },
      {
        icon:"../../images/f7.png",
        label:"任务管理"
      },
      {
        icon:"../../images/f3.png",
        label:"意见反馈"
      },
      {
        icon:"../../images/f8.png",
        label:"全部"
      }
    ],
    news:[
      {
        title:"今日习近平在湖北考察新冠肺炎疫情防控工作",
        author: "中央广播电视总台",
        date: "2020-03-11"
      },
      {
        title:"英文头条播报|Xi vows victory over coronavirus in Wuhan",
        author: "中央广播电视总台",
        date: "2020-03-11"
      },
      {
        title:"世界卫生组织：中国以外的新冠肺炎确诊",
        author: "中央广播电视总台",
        date: "2020-03-11"
      },
      {
        title:"今日纳斯达克指数再次熔断，美国经济堪忧",
        author: "中央广播电视总台",
        date: "2020-03-11"
      }
    ]

  },
  //轮播图的切换事件
  swiperChange: function (e) {
    this.setData({
      swiperCurrent: e.detail.current
    })
  },
  //点击指示点切换
  chuangEvent: function (e) {
    this.setData({
      swiperCurrent: e.currentTarget.id
    })
  },
  //点击图片触发事件
  swipclick: function (e) {
    console.log(this.data.swiperCurrent);
    wx.switchTab({
      url: this.data.links[this.data.swiperCurrent]
    })
  },
  func1(){
    if(!app.globalData.isLogin){
      this.checkLogIn()
    }else{
      wx.navigateTo({
        url: '../report/generalReport',
      })
    }
    
    
  },
  func2() {
    if (!app.globalData.isLogin){
      this.checkLogIn()
    } else {
    wx.navigateTo({
      url: '../report/gridManReport',
    })
    }
  },
  func3() {
    if (!app.globalData.isLogin){
      this.checkLogIn()
    } else {
    wx.navigateTo({
      url: '../enterpriseReport',
    })
    }
  },
  func4() {
    if (!app.globalData.isLogin){
      this.checkLogIn()
    } else {
    wx.navigateTo({
      url: '../clock/clock',
    })
    }
  },
  func5() {
    if (!app.globalData.isLogin){
      this.checkLogIn()
    } else {
    wx.navigateTo({
      url: '../record/jobdiaryInfo',
    })
    }
  },
  func6() {
    if (!app.globalData.isLogin){
      this.checkLogIn()
    } else {
    wx.navigateTo({
      url: '../task/taskInfo',
    })
    }
  },
  onLoad(){
    var that = this
    //未登录点击返回登陆页

    //获取事件类型
    wx.request({
      url: app.globalData.host + app.globalData.getEventTypeUrl,
      header: {
        "Authorization": app.globalData.access_token
      },
      success(res) {
        console.log(res)
        if(res.data.code != 200){
          //没有登录
          app.globalData.isLogin = false
        }
        app.globalData.eventTypeArray = res.data.data
      }
    })

    //获取用户信息
    wx.request({
      url: app.globalData.host + app.globalData.getInfoUrl,
      header: {
        "Authorization": app.globalData.access_token
      },
      success(res) {
        console.log(res)
        app.globalData.user = res.data.user
        console.log(app.globalData.user)
      }
    })

    //设置用户信息
    that.setData({
      user: app.globalData.user
    })
  },
  checkLogIn(){
    
      wx.showModal({
        title: '未登录',
        content: '您还未登录，将不能使用此功能，是否跳转登陆页',
        success(res){
          if (res.confirm) {
            wx.redirectTo({
              url: '../login/login',
            })
            return false
          } else if (res.cancel) {
            console.log('用户点击取消')
          }
        }
      })
      
    

  }


  
})