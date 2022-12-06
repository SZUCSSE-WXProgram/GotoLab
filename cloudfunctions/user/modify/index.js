const cloud = require('wx-server-sdk')
const isNotStudent=require('../util/permission.js')

const check =require('../util/validate.js')
const modifyCheck = require('../check')
// 云环境初始化
cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})

// 获取db对象用于查询数据库
const db = cloud.database({
  throwOnNotFound: false
})
const changeableItems=['name','stuid','phone','class']

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  const permissionCheck=isNotStudent()
  if(permissionCheck.code==='fail'){
    return permissionCheck;
  }
  info = {}
  for(let items in event.info.filter(v=>changeableItems.includes(v))){
    info[items]=event.info[items]
  }
  const checkResult=check(info,modifyCheck);
  if(checkResult.code!=='success'){
    return checkResult;
  }
  await db.collection('User').where({
    openid:wxContext.OPENID
  }).update({
    data:info,
  }).then(res=>{
    return {
      code: 'success',
      des: '修改成功！',
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