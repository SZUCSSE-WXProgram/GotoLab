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
    let info = {
        activityId: event.info.activityId,
        userId: event.info.userId,
        status: event.info.status === undefined ? event.info.status : 1,//1为遴选，0为取消遴选
    }
    const checkResult = await validator.check(info, checkList.checkAttenderCheck);
    if (checkResult.code !== 'success') {
        return checkResult
    }
    const permissionCheck = await permission.isActivityAdmin(info.activityId)
    if (permissionCheck.code !== 'success') {
        return permissionCheck
    }
    const _cnt = await db.collection('UserToActivity').where({
        activityId: info.activityId,
        userId: info.userId,
    }).count()
    if (_cnt.total === 0) {
        return {
            code: 'fail',
            status: 404,
            des: '用户未报名'
        }
    }
    return await db.collection('UserToActivity').where({
        activityId: info.activityId,
        userId: info.userId,
    }).update({
        data: {
            status: info.status
        }
    }).then(res => {
        return {
            code: 'success',
            status: 200,
            des: '操作成功',
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
