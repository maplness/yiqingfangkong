// pages/report/reportRecord.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    eventList: [
    ],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    //获取事件数据
    wx.request({
      url: app.globalData.host + app.globalData.getEventInfoUrl,
      header: {
        "Authorization": app.globalData.access_token
      },
      success(res) {
        console.log(res)
        that.setData({
          eventList: res.data.rows
        })
      }
    })
    
  },
  toDetail(e){
    console.log(e)
    var index = e.currentTarget.dataset.index
    var temp = this.data.eventList[index]
    var str = JSON.stringify(temp)
    wx.navigateTo({
      url: temp.eventStatus == '1' ? "./reportDetail?event="+str : "./reportDetailFinal?event="+str
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