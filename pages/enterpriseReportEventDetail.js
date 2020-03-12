// pages/enterpriseReportEventDetail.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    charNumber: 0,
    eventDetail: ''
  },
  commitEventDetail() {
    var pages = getCurrentPages();
    var prevPage = pages[pages.length - 2];//上一个页面
    //直接调用上一个页面的setData()方法，把数据存到上一个页面中去
    console.log(this.data.eventDetail);
    if (this.data.eventDetail == '') {
      wx.showModal({
        content: '请输入报事详情',
        showCancel: false
      })
      return false
    }
    prevPage.setData({
      eventDetail: this.data.eventDetail
    })
    wx.navigateBack({
      delta: 1,
    })
  },
  signDetailInput(e) {
    var v = e.detail.value || '';
    this.setData({
      charNumber: v.length,
      eventDetail: e.detail.value
    });
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options);
    this.setData({
      charNumber: options.eventDetail.length,
      eventDetail: options.eventDetail
    });
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