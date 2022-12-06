const cloud = require('wx-server-sdk')
cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})
const db = cloud.database()
const _ = db.command;
const $ = _.aggregate
exports.createCheck = {
	gradeName:{des:'年级名',type:'string',required:true,minLength:4,maxLength:10,validator:[this.uniqueGrade]},
}

exports.modifyCheck = {
  gradeName:{des:'年级名',type:'string',required:true,minLength:4,maxLength:10,validator:[this.uniqueGrade]},
  gradeId:{des:'年级ID',type:'string',required:true},
}

exports.uniqueGrade = async (gradeName)=>{
	db.collection('Grade').where({
		gradeName:gradeName
	}).count().then(res=>{
		if(res===0){
			return{
				code:'success',
				status:200,
			}
		}else{
			return{
				code:'fail',
				status:402,
				des:'该年级已经被注册了'
			}
		}
	}).catch(e=>{
		return{
			code:'fail',
			status:500,
			des:'年级验证失败'
		}
	})
}
