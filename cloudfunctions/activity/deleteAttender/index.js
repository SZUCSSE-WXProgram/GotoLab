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
    const wxContext = cloud.getWXContext()
    const info = {
        userId: event.info.userId,
        activityId: event.info.activityId,
    }
    let selfDelete = false
    if (info.userId === undefined || info.userId === null || info.userId === '') {
        selfDelete = true
    }
    const checkResult = await validator.check(info, checkList.deleteAttenderCheck);
    if (checkResult.code !== 'success') {
        return checkResult
    }
    const permissionCheck = await permission.isActivityAdmin(info.activityId)
    // 既没有权限也不是本人参与的活动
    if (permissionCheck.code !== 'success' && selfDelete === false) {
        return permissionCheck
    }
    if (selfDelete === true) {
        await db.collection('User').where({
            openid: wxContext.OPENID,
        }).get().then(res => {
            info.userId = res.data[0]._id
        })
    }
    return await db.collection('UserToActivity').where({
        userId: info.userId,
        activityId: info.activityId,
    }).remove().then(res => {
        return {
            code: 'success',
            status: 200,
            des: '删除成功',
        }
    }).catch(e => {
        return {
            code: 'fail',
            status: 500,
            des: e
        }
    })
}
