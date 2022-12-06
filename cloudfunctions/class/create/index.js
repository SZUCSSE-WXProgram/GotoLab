const cloud = require('wx-server-sdk')
const isSuperAdmin=require('../../permission.js')
const check =require('../../validate.js')
const createCheck = require('../check')
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
	const permissionCheck=isSuperAdmin()
	if(permissionCheck.code!=='success'){
		return permissionCheck;
	}
	info = {
    gradeId:event.info.gradeId,
		className:event.info.className,
	}
	const checkResult = check(info,createCheck);
	if(checkResult.code==='fail'){
		return checkResult
  }
  // 检测班级是否唯一
  await db.collection('Class').where({
    gradeId:info.gradeId,
    className:info.className
  }).count().then(res=>{
    if(res>0){
      return {
        code:'fail',
        status:402,
        des:'已存在相同班级'
      }
    }
  })

  //操作db
  await db.collection('Class').add({
    data:info
  }).then(res=>{
    return{
      code: 'success',
      des: '创建成功',
      status: 200,
      info: res.data,
    }
  }).catch(e=>{
    return{
      code: 'fail',
      des: e,
      status: 500,
    }
  })
}