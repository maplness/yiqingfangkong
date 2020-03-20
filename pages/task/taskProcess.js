// pages/task/taskProcess.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    stopLoadMoreTiem1: false,
    stopLoadMoreTiem2: false,
    noData1: false,
    noData2: false,
    noDataText1: '没有更多了~',
    noDataText2: '没有更多了~',
    currentTab: 0,
    tabArray: [
      {
        id: 1,
        name: '待处理',
        countNum: 0
      }, {
        id: 2,
        name: '已处理',
        countNum: 0
      }],
    pageNum1: 1, //当前tab1页
    pageNum2: 1, //当前tab2页
    pageSize: 10, //每页显示条数
    scrollHeight: 200,
    triggered: true,
    untreatedTaskDetailList: [],
    processedTaskDetailList: [],
  },
  // 切换tab
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

  onPulling(e) {
    // console.log('onPulling:', e)
  },
  onRefresh() {
    let that = this;
    if (that._freshing) return
    that._freshing = true
    wx.showLoading({
      title: '刷新中',
    })
    if (that.data.currentTab == 0) {
      that.setData({
        pageNum1: 1,
        noData1: false
      })
      that.getUntreatedTaskDetailList();
    } else if (that.data.currentTab == 1) {
      that.setData({
        pageNum2: 1,
        noData2: false
      })
      that.getProcessedTaskDetailList();
    }
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

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
  },
  computeScrollViewHeight() {
    let that = this;
    let windowHeight = wx.getSystemInfoSync().windowHeight
    let scrollHeight = windowHeight - 90 * app.globalData.pr_rate - 5;
    that.setData({
      scrollHeight: scrollHeight
    })
    // console.log(that.data.scrollHeight);
  },
  scrollLoading: function () {
    let that = this;
    if (that.data.currentTab == 0) {
      if (that.data.stopLoadMoreTiem1) {
        return;
      }
      wx.showLoading({
        title: '玩命加载中',
      })
      var pageNum = that.data.pageNum1 + 1; //获取当前页数并+1
      that.setData({
        pageNum1: pageNum
      })
      that.getUntreatedTaskDetailList();
    } else if (that.data.currentTab == 1) {
      if (that.data.stopLoadMoreTiem2) {
        return;
      }
      wx.showLoading({
        title: '玩命加载中',
      })
      var pageNum = that.data.pageNum2 + 1; //获取当前页数并+1
      that.setData({
        pageNum2: pageNum
      })
      that.getProcessedTaskDetailList();
    }
  },
  ToDetail(e){
    var that = this
    var currentPage = e.currentTarget.dataset.cur_page
    var id = e.currentTarget.dataset.id
    console.log(id)
    switch (currentPage) {
      case 0:
        wx.navigateTo({
          url: './taskProcessDetail?id='+id+'&statusIndex=1',
        })
        break;
      case 1:
        wx.navigateTo({
          url: './taskProcessDetail?id='+id+'&statusIndex=2',
        })
    }
  },
  //获取待处理事件数据
  getUntreatedTaskDetailList() {
    let that = this;
    that.setData({
      stopLoadMoreTiem1: true
    })
    wx.request({
      url: app.globalData.host + app.globalData.getEventTaskDetailUrl,
      data: {
        stage: 1,
        pageNum: that.data.pageNum1,
        pageSize: that.data.pageSize
      },
      method: "POST",
      header: {
        "Authorization": app.globalData.access_token
      },
      success(res) {
        if (res.data.code == 200) {
          if (that.data.pageNum1 == 1) {
            that.setData({
              untreatedTaskDetailList: res.data.rows,
              'tabArray[0].countNum': res.data.total
            })
            if (res.data.total == 0) {
              that.setData({
                noData1: true,
                noDataText1: '暂无数据'
              })
              return;
            } else {
              that.setData({
                noData1: false,
                noDataText1: '没有更多了~'
              })
            }
          } else {
            let arr1 = that.data.untreatedTaskDetailList;
            let arr2 = res.data.rows;
            if (arr1.length < res.data.total) {
              arr1 = arr1.concat(arr2);
            } else {
              wx.showToast({
                title: '已加载全部',
              })
              that.setData({
                noData1: true,
                noDataText1: '没有更多了~'
              })
              return;
            }
            that.setData({
              untreatedTaskDetailList: arr1,
              'tabArray[0].countNum': res.data.total
            })
          }
        } else {
          wx.showToast({
            title: res.data.msg,
            icon: 'none'
          })
        }
        that.setData({
          stopLoadMoreTiem1: false
        })
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
      }//请求完成后执行的函数
    })
  },
  //获取已处理事件数据
  getProcessedTaskDetailList() {
    let that = this;
    that.setData({
      stopLoadMoreTiem2: true
    })
    wx.request({
      url: app.globalData.host + app.globalData.getEventTaskDetailUrl,
      data: {
        stage: 2,
        pageNum: that.data.pageNum2,
        pageSize: that.data.pageSize
      },
      method: 'POST',
      header: {
        "Authorization": app.globalData.access_token
      },
      success(res) {
        if (res.data.code == 200) {
          if (that.data.pageNum2 == 1) {
            that.setData({
              processedTaskDetailList: res.data.rows,
              'tabArray[1].countNum': res.data.total
            })
            if (res.data.total == 0) {
              that.setData({
                noData2: true,
                noDataText2: '暂无数据'
              })
              return
            } else {
              that.setData({
                noData2: false,
                noDataText2: '没有更多了~'
              })
            }
          } else {
            let arr1 = that.data.processedTaskDetailList;
            let arr2 = res.data.rows;
            if (arr1.length < res.data.total) {
              arr1 = arr1.concat(arr2);
            } else {
              wx.showToast({
                title: '已加载全部',
              })
              that.setData({
                noData2: true,
                noDataText2: '没有更多了~'
              })
              return
            }
            that.setData({
              processedTaskDetailList: arr1,
              'tabArray[1].countNum': res.data.total
            })
          }
        } else {
          wx.showToast({
            title: res.data.msg,
            icon: 'none'
          })
        }
        that.setData({
          stopLoadMoreTiem2: false
        })

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
      }//请求完成后执行的函数
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
    // this.onLoad()
    let that = this
    that.setData({
      pageNum1: 1,
      pageNum2: 1
    })
    that.computeScrollViewHeight()
    that.getUntreatedTaskDetailList()
    that.getProcessedTaskDetailList()
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