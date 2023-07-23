const cloud = require('wx-server-sdk')
const validator = require('../util/validate')
const checkList = require('../check')
// 云环境初始化
cloud.init({
    env: cloud.DYNAMIC_CURRENT_ENV
})

// 获取db对象用于查询数据库
const db = cloud.database({
    throwOnNotFound: false
})


// 云函数入口函数
exports.main = async (event, context) => {
    const wxContext = cloud.getWXContext()
    console.log('User ID: ' + wxContext.OPENID)
    console.log('Params: ' + JSON.stringify(event))
    let info = {
        stuid: event.info.stuid,
        name: event.info.name,
        phone: event.info.phone,
        class: event.info.class,
        openid: wxContext.OPENID,
        email: event.info.email,
    }
    const checkResult = await validator.check(info, checkList.registerCheck);
    if (checkResult.code !== 'success') {
        return checkResult
    }
    const cnt = await db.collection('User').where({
        stuid: info.stuid,
        name: info.name,
        openid: ""
    }).count()
    if (cnt.total === 0) {
        return {
            code: 'fail',
            des: '学号与用户名不匹配或当前学号已经被其他账户注册',
            status: 402,
        }
    }
    return await db.collection('User').where({
        stuid: info.stuid,
        name: info.name,
        openid: ""
    }).update({
        data: {
            openid: info.openid,
            phone: info.phone,
            permission: 0,
            class: info.class,
            email: info.email,
            groups: [],
        }
    }).then(res => {
        return {
            code: 'success',
            des: '注册成功',
            status: 200,
        }
    }).catch(e => {
        return {
            code: 'fail',
            des: e,
            status: 500,
        }
    })
}

