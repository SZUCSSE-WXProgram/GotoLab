const cloud = require('wx-server-sdk')
const permission = require('../util/permission.js')
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

const _ = db.command;
const $ = _.aggregate
// 云函数入口函数
exports.main = async (event, context) => {
    const checkResult = await validator.check(event.info, checkList.modifyCheck);
    if (checkResult.code !== 'success') {
        return checkResult
    }
    const wxContext = cloud.getWXContext()
    const permissionCheck = await permission.isNotStudent()
    if (permissionCheck.code === 'success') {
        return {
            code: 'fail',
            status: 403,
            des: '管理员无需参加活动'
        }
    }
    const currentUser = await db.collection('User').where({
        openid: wxContext.OPENID,
    }).get()
    return await db.collection('UserToActivity').add({
        data: {
            userId: currentUser.data[0]._id,
            activityId: event.info._id,
            status: 0,
        }
    }).then(res => {
        return {
            code: 'success',
            status: 200,
            des: '参加成功',
            data: res
        }
    }).catch(e => {
        return {
            code: 'fail',
            status: 500,
            des: e
        }
    })
}