const cloud = require('wx-server-sdk')
const permission=require('../util/permission.js')

// 云环境初始化
cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})

// 获取db对象用于查询数据库
const db = cloud.database({
  throwOnNotFound: true
})
const _ = db.command
const $ = _.aggregate

// 云函数入口函数
exports.main = async (event, context) => {
  const pageOffset={
    limit:event.info.limit?Math.min(event.info.limit,20):10,
    offset:event.info.offset?event.info.offset:0,
  }
  const search = event.info.search?event.info.search:""
  return await db.collection('Group').where({
    groupName: db.RegExp({
      regexp:'.*'+search,
      options:'i',
    })
  }).skip(pageOffset.offset)
  .limit(pageOffset.limit+1)
  .get().then(res=>{
    const hasMore = res.data.length>pageOffset.limit?true:false
    if(hasMore){
      res.data.pop()
    }
    return {
      code : 'success',
      info:res.data,
      hasMore:hasMore,
      status:200
    }
  }).catch(e=>{
    return {
      code:'fail',
      des:e,
      status:500,
    }
  })
  
}
