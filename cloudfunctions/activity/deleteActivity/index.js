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
    console.log('User ID: ' + wxContext.OPENID)
    console.log('Params: ' + JSON.stringify(event))
    const checkResult = await validator.check(event.info, checkList.deleteActivityCheck);
    if (checkResult.code !== 'success') {
        return checkResult
    }
    const permissionCheck = await permission.isActivityAdmin(event.info.activityId)
    if (permissionCheck.code !== 'success') {
        return permissionCheck
    }
    try {
        await db.collection('UserToActivity').where({
            activityId: event.info.activityId
        }).remove()
        await db.collection('Activity').doc(event.info.activityId).remove()
    } catch (e) {
        return {
            code: 'fail',
            status: 500,
            des: e
        }
    }
    return {
        code: 'success',
        status: 200,
        des: '删除成功',
    }
}
