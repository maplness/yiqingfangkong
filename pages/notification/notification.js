// pages/notification/notification.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    news: [],
    dictType: 'sys_notice_type',
    noticeTypeArray: [],
    scrollHeight: 400,
    noData: '没有更多了~',
    pageNum: 1,
    pageSize: 10,
    triggered: true,
    stopLoadMoreTiem: false

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;
    wx.showLoading({
      title: '玩命加载中',
    })
    //获取通知公告类型
    that.getNoticeType()
  },
  getNoticeType(){
    let that = this;
    wx.request({
      url: app.globalData.host + '/system/dict/data/dictType/' + that.data.dictType,
      data: {},
      method: "GET",
      header: {
        "Authorization": app.globalData.access_token
      },
      success(res) {
        // console.log(res)
        if (res.data.code == 200) {
          if (res.data.data.length > 0) {
            let r = res.data.data;
            let noticeTypeArr = []
            if(r.length > 0){
              for (let i = 0; i < r.length; i++) {
                noticeTypeArr.push(r[i])
              }
            }
            that.setData({
              noticeTypeArray: noticeTypeArr
            })
            //获取通知公告列表
            that.getNoticeList()
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
  getNoticeList(){
    let that = this
    that.setData({
      stopLoadMoreTiem: true
    })
    wx.request({
      url: app.globalData.host + '/system/notice/list',
      method: "GET",
      data: {
        pageNum: that.data.pageNum,
        pageSize:  that.data.pageSize
      },
      header: {
        "Authorization": app.globalData.access_token
      },
      success(res) {
        // console.log(res)
        var r = res.data;
        if (r.code == 200) {
          let newsArr = r.rows
          if(that.data.noticeTypeArray.length>0 && newsArr.length > 0){
            for (let i = 0; i < that.data.noticeTypeArray.length; i++ ){
              for (let j = 0; j < newsArr.length; j++){
                if (that.data.noticeTypeArray[i].dictValue == newsArr[j].noticeType){
                  newsArr[j].noticeType = that.data.noticeTypeArray[i].dictLabel
                }
              }
            }
          }
          if (that.data.pageNum == 1) {
            that.setData({
              news: newsArr
            })
            if (r.total == 0) {
              that.setData({
                noData: true,
                noDataText: '暂无通知'
              })
              return
            } else {
              that.setData({
                noData: false,
                noDataText: '没有更多了~'
              })
            }
          } else {
            let arr1 = that.data.news
            let arr2 = newsArr
            if (arr1.length < r.total) {
              arr1 = arr1.concat(arr2)
            } else {
              wx.showToast({
                title: '已加载全部',
              })
              that.setData({
                noData: true,
              })
              return;
            }
            that.setData({
              news: arr1
            })
          }
          that.setData({
            stopLoadMoreTiem: false
          })
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
      complete() {
        setTimeout(function () {
          wx.hideLoading();
          wx.stopPullDownRefresh()
        }, 1000)
        
      }
    })
  },
  scrollLoading() {
    let that = this;
    // console.log('下拉刷新')
    if (that.data.stopLoadMoreTiem) {
      return;
    }
    var pageNum = that.data.pageNum + 1; //当前页加1
    that.setData({
      pageNum: pageNum
    })
    wx.showLoading({
      title: '玩命加载中',
    })
    that.getNoticeList()
  },
  toDetail(e){
    let that = this
    let id = e.currentTarget.dataset.id
    let type = e.currentTarget.dataset.type
    // console.log(that.data.news[index])
    // var currentNotice = that.data.news[index]
    wx.navigateTo({
      url: './notificationDetail?noticeId='+id+'&noticeType='+type
    })
  },
  onPulling(e) {
    console.log('onPulling:', e)
  },
  onRefresh() {
    let that = this;
    if (that._freshing) return
    that._freshing = true
    that.setData({
      pageNum: 1,
      noData: false
    })
    wx.showLoading({
      title: '刷新中',
    })
    that.getNoticeList()
    setTimeout(function () {
      that.setData({
        triggered: false
      })
      that._freshing = false
    }, 1000)

  },
  onRestore(e) {
    console.log('onRestore:', e)
  },

  onAbort(e) {
    console.log('onAbort', e)
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
    that.computeScrollViewHeight()
  },
  computeScrollViewHeight() {
    let that = this;
    let windowHeight = wx.getSystemInfoSync().windowHeight
    let scrollHeight = windowHeight;
    that.setData({
      scrollHeight: scrollHeight
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
    let that = this
    that.setData({
      pageNum: 1,
      noData: false
    })
    wx.showLoading({
      title: '刷新中',
    })
    that.getNoticeList()
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    let that = this;
    // console.log('下拉刷新')
    if (that.data.stopLoadMoreTiem) {
      return;
    }
    var pageNum = that.data.pageNum + 1; //当前页加1
    that.setData({
      pageNum: pageNum
    })
    wx.showLoading({
      title: '玩命加载中',
    })
    that.getNoticeList()
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})