const cloud = require('wx-server-sdk')

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
  const ret = {
    code: 'success',
    des: '添加成功',
    status: 200,
    info: [],
  }

  info = {
    stuid:event.info.stuid,
    name:event.info.name,
    phone:event.info.phone,
    class:event.info.class,
    openid:wxContext.OPENID,
  }

  // 学号不能重复
  const cnt= await db.collection('User').where({
    stuid:stuid
  }).count();
  if(cnt>0){
    return {
      code: 'fail',
      des: '该学号已被注册！',
      status: 402,
    }
  }
  //检验班级存在
  const _class = await db.collection('Class').where({
    _id:info.class
  }).count()
  if(_class === 0){
    return {
      code: 'fail',
      des: '该班级不存在！',
      status: 402,
    }
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