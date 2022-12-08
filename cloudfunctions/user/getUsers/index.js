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

// 云函数入口函数
exports.main = async (event, context) => {
  const pageOffset={
    limit:event.info.limit?Math.min(event.info.limit,20):10,
    offset:event.info.offset?event.info.offset:0,
  }
  const pageQuery={
    search:event.info.search?event.info.search:"",
    permission:event.info.permission?event.info.permission:0,
  }
  const permissionValidate = await permission.isSuperAdmin();
  if(permissionValidate.code!=="success"){
    return permissionValidate;
  }
  console.log(pageOffset)
  return await db.collection('User').where(_.or([{
    name: db.RegExp({
      regexp: '.*' + pageQuery.search,
      options: 'i',
    })
  }, {
    stuid: db.RegExp({
      regexp: '.*' +  pageQuery.search,
      options: 'i',
    })
  }
]).and({
  permission:_.gte(pageQuery.permission)
})).orderBy('stuid','asc')
  .skip(pageOffset.offset)
  .limit(pageOffset.limit+1)// tricky做法 多取一条数据判断数据是不是取完了
  .get().then(res=>{
    const hasMore=res.data.length>pageOffset.limit?true:false
    if(hasMore){
      res.data.pop()
    }
    return {
      code:'success',
      data:res,
      hasMore:hasMore,
      status:200
    }
  }).catch(e=>{
    return {
      code:'fail',
      status:500,
      des:e
    }
  })
}