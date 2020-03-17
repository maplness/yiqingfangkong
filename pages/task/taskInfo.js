// pages/task/taskInfo.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    stopLoadMoreTiem1: false,
    stopLoadMoreTiem2: false,
    stopLoadMoreTiem3: false,
    noData1: false,
    noData2: false,
    noData3: false,
    hideBottom: true,
    loadMoreData: '加载更多...',
    triggered: true,
    toBeAuditEventList: [],
    toBeCheckEventList: [],
    processedEventList: [],
    currentTab: 0,
    tabArray: [
      {
        id: 1,
        name:'待核实',
        countNum: 0
      },{
        id: 2,
        name: '待核查',
        countNum: 0
      },{
        id: 3,
        name: '已处理',
        countNum: 0
      }],
    pageNum1: 1, //当前tab1页
    pageNum2: 1, //当前tab2页
    pageNum3: 1, //当前tab3页
    pageSize: 10, //每页显示条数
    scrollHeight: 200
  },
  onPulling(e) {
    // console.log('onPulling:', e)
  },
  onRefresh() {
    let that = this;
    if (that._freshing) return
    that._freshing = true
    // wx.showLoading({
    //   title: '刷新中',
    // })
    if (that.data.currentTab == 0) {
      that.setData({
        pageNum1: 1,
        noData1: false
      })
      that.gettoBeAuditEventList();
    } else if (that.data.currentTab == 1) {
      that.setData({
        pageNum2: 1,
        noData2: false
      })
      that.gettoBeCheckEventList();
    } else {
      that.setData({
        pageNum3: 1,
        noData3: false
      })
      that.getprocessedEventList();
    }
    setTimeout(function(){
      that.setData({
        triggered: false
      })
      that._freshing = false
    },1000)
    
  },
  onRestore(e) {
    // console.log('onRestore:', e)
  },

  onAbort(e) {
    // console.log('onAbort', e)
  },

  //事件处理函数
  bindChange: function (e) {
    var that = this;
    that.setData({ currentTab: e.detail.current });
  },
  swichNav: function (e) {
    var that = this;
    // console.log(e.target)
    if (this.data.currentTab === e.target.dataset.current) {
      return false;
    } else {
      that.setData({
        currentTab: e.target.dataset.current
      })
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;
    this.computeScrollViewHeight()
    that.data.pageNum1 = 1;
    that.data.pageNum2 = 1;
    that.data.pageNum3 = 1;
    that.gettoBeAuditEventList();
    that.gettoBeCheckEventList();
    that.getprocessedEventList();
  },
  //获取待核实事件数据
  gettoBeAuditEventList() {
    let that = this;
    that.stopLoadMoreTiem1 = true;
    wx.request({
      url: app.globalData.host + app.globalData.getEventInfoUrl,
      data: {
        startCases: '1',
        pageNum: that.data.pageNum1,
        pageSize: that.data.pageSize
      },
      method: "GET",
      header: {
        "Authorization": app.globalData.access_token
      },
      success(res) {
        if(res.data.code == 200){
          if(that.data.pageNum1 == 1){
            that.setData({
              toBeAuditEventList: res.data.rows,
              'tabArray[0].countNum': res.data.total
            })
          }else{
            let arr1 = that.data.toBeAuditEventList;
            let arr2 = res.data.rows;
            if (arr1.length < res.data.total) {
              arr1 = arr1.concat(arr2);
            } else{
              wx.showToast({
                title: '已加载全部',
              })
              that.setData({
                noData1: true,
              })
              return ;
            }
            that.setData({
              toBeAuditEventList: arr1,
              'tabArray[0].countNum': res.data.total
            })
          }
        }else{
          wx.showToast({
            title: res.data.msg,
            icon: 'none'
          })
        }
        that.stopLoadMoreTiem1 = false
      },
      fail: function (err) { 
        wx.showToast({
          title: err.errMsg,
          icon: 'none'
        })
      },//请求失败
      complete: function () {
          // console.log("我已经请求完毕了")
          setTimeout(function(){
            wx.hideLoading()
          },1000)
          // this._freshing = false
          // wx.stopPullDownRefresh()
       }//请求完成后执行的函数
    })
  },
  //获取待核查事件数据
  gettoBeCheckEventList() {
    let that = this;
    that.stopLoadMoreTiem2 = true
    wx.request({
      url: app.globalData.host + app.globalData.getEventInfoUrl,
      data: {
        startCases: '6',
        pageNum: that.data.pageNum2,
        pageSize: that.data.pageSize
      },
      method: 'GET',
      header: {
        "Authorization": app.globalData.access_token
      },
      success(res) {
        // console.log(res)
        if (res.data.code == 200) {
          if (that.data.pageNum2 == 1) {
            that.setData({
              toBeCheckEventList: res.data.rows,
              'tabArray[1].countNum': res.data.total
            })
          }else{
            let arr1 = that.data.toBeCheckEventList;
            let arr2 = res.data.rows;
            if (arr1.length < res.data.total) {
              arr1 = arr1.concat(arr2);
            } else {
              wx.showToast({
                title: '已加载全部',
              })
              that.setData({
                noData2: true,
              })
              return 
            }
            that.setData({
              toBeCheckEventList: arr1,
              'tabArray[1].countNum': res.data.total
            })
          }
        } else {
          wx.showToast({
            title: res.data.msg,
            icon: 'none'
          })
        }
        that.stopLoadMoreTiem2 = false

      },
      fail: function (err) {
        wx.showToast({
          title: err.errMsg,
          icon: 'none'
        })
      },//请求失败
      complete: function () {
        setTimeout(function () {
          wx.hideLoading()
        }, 1000)
        // this._freshing = false
        // wx.stopPullDownRefresh()
      }//请求完成后执行的函数
    })
  },
  //获取已处理事件数据（包括已核实和已核查）
  getprocessedEventList() {
    let that = this;
    that.stopLoadMoreTiem3 = true
    wx.request({
      url: app.globalData.host + app.globalData.getEventInfoUrl,
      data: {
        startCases: '2,3,4,5,7',
        pageNum: that.data.pageNum3,
        pageSize: that.data.pageSize
      },
      method: 'GET',
      header: {
        "Authorization": app.globalData.access_token
      },
      success(res) {
        if (res.data.code == 200) {
          var eventList = res.data.rows
          
          if(eventList.length > 0){
            for (var i = 0; i < eventList.length; i++) {
              if (eventList[i].startCase == '7') {
                eventList[i].statusDesc = "已核查"

              } else {
                eventList[i].statusDesc = "已核实"
              }
            }
          }
          if (that.data.pageNum3 == 1) {
            that.setData({
              processedEventList: eventList,
              'tabArray[2].countNum': res.data.total
            })
          }else{
            let arr1 = that.data.processedEventList;
            let arr2 = eventList;
            if (arr1.length < res.data.total) {
              arr1 = arr1.concat(arr2);
            } else {
              wx.showToast({
                title: '已加载全部',
              })
              that.setData({
                noData3: true,
              })
              return 
            }
            that.setData({
              processedEventList: arr1,
              'tabArray[2].countNum': res.data.total
            })
          }
        } else {
          wx.showToast({
            title: res.data.msg,
            icon: 'none'
          })
        }
        that.stopLoadMoreTiem3 = false
      },
      fail: function (err) {
        wx.showToast({
          title: err.errMsg,
          icon: 'none'
        })
      },//请求失败
      complete: function () {
        setTimeout(function () {
          wx.hideLoading()
        }, 1000)
        // this._freshing = false
        // wx.stopPullDownRefresh()
      }//请求完成后执行的函数
    })
  },
  ToDetail(e){
    var that = this
    // console.log(e)
    var currentPage = e.currentTarget.dataset.cur_page
    var index = e.currentTarget.dataset.index
    switch(currentPage){
      case 0:
        var currentEvent = that.data.toBeAuditEventList[index]
        wx.navigateTo({
          url: './taskDetail?currentEvent='+JSON.stringify(currentEvent),
        })
        break;
      case 1:
        var currentEvent = that.data.toBeCheckEventList[index]
        wx.navigateTo({
          url: './taskDetail?currentEvent=' + JSON.stringify(currentEvent),
        })
        break;
      case 2:
        var currentEvent = that.data.processedEventList[index]
        wx.navigateTo({
          url: './taskDetail?currentEvent=' + JSON.stringify(currentEvent),
        })

    }
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
  computeScrollViewHeight(){
    let that = this;
    let windowHeight = wx.getSystemInfoSync().windowHeight
    let scrollHeight = windowHeight - 90 * app.globalData.pr_rate - 5;
    that.setData({
      scrollHeight: scrollHeight
    })
    // console.log(that.data.scrollHeight);
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

    this.onLoad();
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },
  scrollLoading: function () {
    let that = this;
    if (that.data.currentTab == 0) {
      if (that.stopLoadMoreTiem1) {
        return;
      }
      wx.showLoading({
        title: '玩命加载中',
      })
      var pageNum = that.data.pageNum1 + 1; //获取当前页数并+1
      that.setData({
        pageNum1: pageNum
      })
      that.gettoBeAuditEventList();
    } else if (that.data.currentTab == 1) {
      if (that.stopLoadMoreTiem2) {
        return;
      }
      wx.showLoading({
        title: '玩命加载中',
      })
      var pageNum = that.data.pageNum2 + 1; //获取当前页数并+1
      that.setData({
        pageNum2: pageNum
      })
      that.gettoBeCheckEventList();
    } else {
      if (that.stopLoadMoreTiem3) {
        return;
      }
      wx.showLoading({
        title: '玩命加载中',
      })
      var pageNum = that.data.pageNum3 + 1; //获取当前页数并+1
      that.setData({
        pageNum3: pageNum
      })
      that.getprocessedEventList();
    }

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})