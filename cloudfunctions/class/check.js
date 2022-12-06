const cloud = require('wx-server-sdk')
cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})
const db = cloud.database()
const _ = db.command;
const $ = _.aggregate
exports.createCheck = {
  gradeId:{des:'年级ID',type:'string',required:true,validator:[this.existGrade]},
  className:{des:'班级名',type:'string',required:true,minLength:2,maxLength:10},
}

// exports.modifyCheck = {
//   gradeName:{des:'年级名',type:'string',required:true,minLength:4,maxLength:10,validator:[this.uniqueGrade]},
//   gradeId:{des:'年级ID',type:'string',required:true},
// }

exports.existGrade = async (gradeId)=>{
  db.collection('Grade').doc(gradeId).count().then(res=>{
    if(res>0){
     return {
       code :'success',
       status :200,
     }
    }else{
      return {
        code :'fail',
        status: 402,
        des:'该年级不存在'
      }
    }
  })
}

