const cloud = require('wx-server-sdk')
const permission=require('../util/permission.js')
const validator =require('../util/validate')
const checkList = require('../check')
// 云环境初始化
cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})

// 获取db对象用于查询数据库
const db = cloud.database({
  throwOnNotFound: false
})

const _ = db.command;
const $ = _.aggregate
// 云函数入口函数
exports.main = async (event, context) => {
  const checkResult =  await validator.check(event.info,checkList.modifyCheck)
  if(checkResult.code!=='success'){
    return checkResult;
  }
  info = {}
  validateFields=['_id','groupName','info','picLink']
  for(const item in validateFields){
    info[validateFields[item]]=event.info[validateFields[item]]
  }
  const permissionCheck= await permission.isGroupAdmin(info._id)
  if(permissionCheck.code!=='success'){
    return permissionCheck;
  }
  var docId=info._id
  delete info._id
  return await db.collection('Group').doc(docId).
  update({
    data:info
  }).then(res=>{
    return {
      code :'success',
      status:200,
      des: '修改成功',
      info: res,
    }
  }).catch(e=>{
    return {
      code :'fail',
      status:500,
      des: e,
    }
  })
}