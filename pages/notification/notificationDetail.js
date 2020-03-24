// pages/notification/notificationDetail.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    news:{},
    noticeType: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this
    // console.log(options.noticeId)
    that.getNoticeInfo(options.noticeId)
    that.setData({
      noticeType: options.noticeType
    })
  },
  getNoticeInfo(noticeId){
    let that = this
    wx.request({
      url: app.globalData.host + '/system/notice/' + noticeId,
      method: "GET",
      data: {},
      header: {
        "Authorization": app.globalData.access_token
      },
      success(res) {
        // console.log(res)
        var r = res.data;
        if (r.code == 200) {
          let newsInfo = r.data
          newsInfo.noticeContent = newsInfo.noticeContent.replace(/\<img/gi, '<img style="width:100%;height:auto;border-radius:4px;" ')
          // console.log(newsInfo)
          that.setData({
            news: newsInfo
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
        // setTimeout(function () {
        //   wx.hideLoading();
        // }, 1000)

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