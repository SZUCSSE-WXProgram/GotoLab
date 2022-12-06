const cloud = require('wx-server-sdk')
const isSuperAdmin=require('../../utils/permission.js')
const check =require('../../utils/validate.js')
const modifyCheck = require('../check')
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
		gradeName:event.info.gradeName,
	}
	const checkResult = check(info,modifyCheck);
	if(checkResult.code==='fail'){
		return checkResult
	}
  await db.collection('Grade').doc(info.gradeId).update({
    data:{
      gradeName:info.gradeName
    }
  }).then(res=>{
    return {
      code: 'success',
      des: '修改成功',
      status: 200,
      info: res.data,
    }
  }).catch(e=>{
    return {
      code: 'fail',
      des: e,
      status: 500,
    }
  })
}