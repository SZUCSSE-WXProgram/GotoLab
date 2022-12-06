const cloud = require('wx-server-sdk')
const check =require('../../validate.js')
const registerCheck = require('../check')
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
	const wxContext = cloud.getWXContext()
	info = {
		stuid:event.info.stuid,
		name:event.info.name,
		phone:event.info.phone,
		class:event.info.class,
		openid:wxContext.OPENID,
	  }
	const checkResult = check(info,registerCheck);
	if(checkResult.code==='fail'){
		return checkResult
	}
  await db.collection('User').add({
    data:{
      openid:info.openid,
      name:info.name,
      stuid:info.stuid,
      phone:info.phone,
      permission:0,
      class:info.class,
      groups:[],
    }
  }).then(res=>{
    return{
      code: 'success',
      des: '注册成功',
      status: 200,
      info: res,
    }
  }).catch(e=>{
    return{
      code: 'fail',
      des: e,
      status: 500,
    }
  })
}