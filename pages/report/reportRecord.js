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
        wx.stopPullDownRefresh()
        var eventList = res.data.rows
        for(var i=0;i<eventList.length;i++){
          if(eventList[i].startCase == '1'){
            eventList[i].statusDesc = "待核实"
            eventList[i].statusDescColor = "#BF197B"
          }
          // else if(parseInt(eventList[i].startCase)>=2 && parseInt(eventList[i].startCase)<=5){
          //   eventList[i].statusDesc = "核实完成"
          //   eventList[i].statusDescColor = "#F4550F"
          // }
          else if (eventList[i].startCase == '6'){
            eventList[i].statusDesc = "待核查"
            eventList[i].statusDescColor = "#8AC23E"
          } else if(eventList[i].startCase == '7'){
            eventList[i].statusDesc = "核查完成"
            eventList[i].statusDescColor = "#2CA49C"
          }else{
            eventList[i].statusDesc = "核实完成"
            eventList[i].statusDescColor = "#F4550F"
          }
        }
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
    if(parseInt(temp.startCase)>=1 &&parseInt(temp.startCase)<6){
      var str = JSON.stringify(temp)
      wx.navigateTo({
        url: "./reportDetail?event=" + str,
      })
    }else{
      var str = JSON.stringify(temp)
      wx.navigateTo({
        url: "./reportDetailFinal?event=" + str,
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
    this.onLoad()
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