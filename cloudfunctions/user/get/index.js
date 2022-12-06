const cloud = require('wx-server-sdk')
const isNotStudent=require('../util/permission.js')

// 云环境初始化
cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})

// 获取db对象用于查询数据库
const db = cloud.database({
  throwOnNotFound: true
})

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  await db.collection('User').where({
    openid:wxContext.OPENID
  }).get().then(res=>{
    return {
      code: 'success',
	  info:res.data,
      status: 200,
    }
  }).catch(e=>{
    return {
      code: 'fail',
      des: e,
      status: 500,
    }
  })
}