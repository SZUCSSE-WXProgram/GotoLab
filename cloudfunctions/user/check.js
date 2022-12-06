const cloud = require('wx-server-sdk')
cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})
const db = cloud.database()
const _ = db.command;
const $ = _.aggregate
exports.registerCheck = {
	stuid:{des:'学号',type:'string',required:true,minLength:10,maxLength:10,validator:[uniqueStuid]},
	name:{des:'姓名',type:'string',required:true,minLength:2,maxLength:10},
	phone:{des:'手机号',type:'string',required:true,minLength:11,maxLength:11},
	class:{des:'班级',type:'string',required:true,validator:[validateClass]},
	openid:{des:'用户ID',type:'string',required:true,validator:[uniqueOpenid]}
}
exports.modifyCheck = {
	stuid:{des:'学号',type:'string',required:false,minLength:10,maxLength:10,validator:[uniqueStuid]},
	name:{des:'姓名',type:'string',required:false,minLength:2,maxLength:10},
	phone:{des:'手机号',type:'string',required:false,minLength:11,maxLength:11},
	class:{des:'班级',type:'string',required:false,validator:[validateClass]},
	openid:{des:'用户ID',type:'string',required:true}
}

async function uniqueStuid(stuid) {
  await db.collection('User').where({
		stuid:stuid
  }).count().then(res=>{
    console.log(res)
    if(res.total===0){
      console.log("1111")
      return{
        code:'success',
        status:200,
      }
    }
    else{
      return {
        code:'fail',
        status:402,
        des:'该学号已经被注册了'
      }
    }
  })
}

async function uniqueOpenid(openID) {
	await db.collection('User').where({
		openid:openID
	}).count().then(res=>{
		if(res.total===0){
			return{
				code:'success',
				status:200,
			}
		}else{
			return{
				code:'fail',
				status:402,
				des:'该账户已经被注册了'
			}
		}
	}).catch(e=>{
		return{
			code:'fail',
			status:500,
			des:'账户验证失败'
		}
	})
}

async function validateClass(classid) {
	await db.collection('Class').doc(classid).count().then(res=>{
		if(res.total===0){
			return{
				code:'fail',
				status:402,
				des:'该班级不存在'
			}
		}else{
			return{
				code:'success',
				status:200,
			}
		}
	}).catch(e=>{
		return{
			code:'fail',
			status:500,
			des:'班级验证失败'
		}
	})
}
