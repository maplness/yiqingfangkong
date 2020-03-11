// pages/changePassword/changePassword.js
import WxValidate from '../../utils/WxValidate.js';
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },
  onLoad(){
    this.initValidate()
  },
  submit(e){
    var that = this
    console.log(e.detail.value)
    var params = e.detail.value
    if (!that.WxValidate.checkForm(e.detail.value)) {
      const error = this.WxValidate.errorList[0];
      this.showModal(error);
      return false;
    }

    wx.request({
      url: app.globalData.host + app.globalData.changePasswordUrl +"?oldPassword="+params.oldPass+"&newPassword="+params.newPass,
      header: {
        "Authorization": app.globalData.access_token
      },
      method: "PUT",
      success(res){
        console.log(res)
      }
    })
  },
  initValidate(){
    const rules = {
      oldPass: {
        required: true
      },
      newPass: {
        required: true
      },
      newPass2: {
        required: true,
        equalTo: 'newPass'
      }
    }
    const messages = {
      oldPass: {
        required: "请输入原密码"
      },
      newPass: {
        required: "请输入新密码"
      },
      newPass2: {
        required: "请再次输入新密码",
        equalTo: "两次输入的密码不同"
      }
    }

    this.WxValidate = new WxValidate(rules, messages)
  },
  //报错 
  showModal(error) {
    wx.showModal({
      content: error.msg,
      showCancel: false,
    })
  },

})