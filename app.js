//app.js
App({
  onLaunch: function () {
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
      }
    })
    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo

              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          })
        }
      }
    })
  },
  globalData: {
    userInfo: null,
    access_token: "",
    host:"https://www.createsharp.cn:8888",
    login_url: "/loginWechat",
    eventTypeArray: [
      [{ id: 1, name: '市容环境' }, { id: 2, name: '宣传广告' }, { id: 3, name: '施工管理' }, { id: 4, name: '突发事件' }, { id: 5, name: '街面秩序' }, { id: 21, name: '扩展事件' }],
      [{ id: 1, name: '私搭乱建', parentId: 1 }, { id: 2, name: '暴露垃圾', parentId: 1 }, { id: 3, name: '积存垃圾渣土', parentId: 1 }, { id: 4, name: '道路不洁', parentId: 1 }, { id: 5, name: '水域不洁', parentId: 0 }, { id: 6, name: '绿地脏乱', parentId: 1 }, { id: 7, name: '废弃车辆', parentId: 1 }, { id: 8, name: '废弃家具设施', parentId: 1 }, { id: 9, name: '非装饰性树挂', parentId: 1 }, { id: 10, name: '道路破损', parentId: 1 }, { id: 11, name: '河堤破损', parentId: 1 }, { id: 12, name: '道路撒遗', parentId: 1 }, { id: 13, name: '建筑物外立面不洁', parentId: 1 }, { id: 14, name: '水域秩序问题', parentId: 1 }, { id: 15, name: '焚烧树叶，垃圾', parentId: 1 }, { id: 16, name: '油烟污染', parentId: 1 }, { id: 17, name: '动物尸体清理', parentId: 1 } ,
{ id: 18, name: '私自饲养家禽家畜', parentId: 1 }, { id: 99, name: '其他市容环境问题', parentId: 1 },
      { id: 1, name: '非法小广告', parentId: 2 }, { id: 2, name: '违章张贴悬挂广告牌匾', parentId: 2 }, { id: 3, name: '占道广告牌', parentId: 2 }, { id: 4, name: '街头散发广告', parentId: 2 }, { id: 5, name: '广告招牌破损', parentId: 2 },
      { id: 1, name: '施工扰民', parentId: 3 }, { id: 2, name: '工地扬尘', parentId: 3 }, { id: 3, name: '施工废弃料', parentId: 3 }, { id: 4, name: '施工占道', parentId: 3 }, { id: 5, name: '无证掘路', parentId: 3 }, { id: 99, name: '其他施工管理问题', parentId: 3 },
      { id: 1, name: '路面塌陷', parentId: 4 }, { id: 2, name: '自来水管破裂', parentId: 4 }, { id: 3, name: '燃气管道破裂', parentId: 4 }, { id: 4, name: '下水道堵塞或破损', parentId: 4 }, { id: 5, name: '热力管道破裂', parentId: 4 }, { id: 6, name: '道路积水', parentId: 4 }, { id: 7, name: '道路积雪结冰', parentId: 4 }, { id: 8, name: '架空线缆损坏', parentId: 4 }, { id: 9, name: '群发行事件', parentId: 4 }, { id: 99, name: '其他突发事件', parentId: 4 } ,
{ id: 1, name: '无照经营游商', parentId: 5 }, { id: 2, name: '流浪乞讨', parentId: 5 }, { id: 3, name: '占道废品收购', parentId: 5 }, { id: 4, name: '店外经营', parentId: 5 }, { id: 5, name: '机动车乱停放', parentId: 5 }, { id: 6, name: '非机动车乱停放', parentId: 5 }, { id: 7, name: '乱堆物料堆', parentId: 5 }, { id: 8, name: '商业噪音', parentId: 5 }, { id: 9, name: '黑车拉客', parentId: 5 }, { id: 10, name: '露天烧烤', parentId: 5 }, { id: 11, name: '沿街晾挂', parentId: 5 }, { id: 12, name: '非法出版物销售', parentId: 5 }, { id: 13, name: '空调室外机低挂', parentId: 5 }, { id: 99, name: '其他街面秩序问题', parentId: 5 }],
    ]

  }
})