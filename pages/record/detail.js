// pages/jobdiary/detail.js
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    form: {
      userId: '',
      userName: '',
      workDay: '',
      workGoal: '',
      workDetail: '',
      picturePath: ''
    },
    id: '',
    images: [],
    test:"哈接口挥洒上课就不发了几把酸辣粉哭还是不能动，卡吧v拉开是不可接受发布会爱上你快来讲述的哈佛艰苦跋涉来到尽快发货是的 就会看啦函数的就哈说就啊收到了卡上了阿升级换代"
  },

  chooseImage(e) {
    wx.chooseImage({
      sizeType: ['original', 'compressed'],  //可选择原图或压缩后的图片
      sourceType: ['album', 'camera'], //可选择性开放访问相册、相机
      success: res => {
        const images = this.data.images.concat(res.tempFilePaths)
        // 限制最多只能留下3张照片
        const images1 = images.length <= 3 ? images : images.slice(0, 3)
        this.setData({
          images: images1
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
      images: images
    })
  },
  handleImagePreview(e) {
    const idx = e.target.dataset.idx
    const images = this.data.images
    wx.previewImage({
      current: images[idx],  //当前预览的图片
      urls: images,  //所有要预览的图片
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var id = options.id
    this.getJobDetailById(id)
  },
  //通过id查看工作日志详情
  getJobDetailById(id){
    var that = this;
    wx.request({
      url: app.globalData.host +'/worklog/workLog/'+id,
      method: 'GET',
      header:{
        // "Content-Type": "application/x-www-form-urlencoded",
        "Authorization": app.globalData.access_token
      },
      success(res){
        // console.log(res)
        var r = res.data;
        if(r.code == 200){
          that.setData({
            form: r.data
          })
          if (that.data.form.picturePath != '' && that.data.form.picturePath != null){
            let imgArr = that.data.form.picturePath.split(',')
            for(let i = 0;i<imgArr.length;i++){
              imgArr[i] = app.globalData.imageHost + imgArr[i]
            }
            that.setData({
              images: imgArr
            })
            // console.log(imgArr)
          }
        }else{
          wx.showModal({
            content: r.msg,
            showCancel: false,
          })
        }
      },
      fail(error){
        wx.showModal({
          content: error.errMsg,
          showCancel: false,
        })
      }
    })
  },
  //报错 
  showModal(error) {
    wx.showModal({
      content: error.msg,
      showCancel: false,
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