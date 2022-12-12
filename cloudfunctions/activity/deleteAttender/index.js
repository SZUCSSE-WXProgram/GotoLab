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
        userId: event.info.userId,
        activityId: event.info.activityId,
    }
    const checkResult = await validator.check(info, checkList.modifyCheck);
    if (checkResult.code !== 'success') {
        return checkResult
    }
    const _group = await db.collection('Activity').where({
        _id: info.activityId
    }).get()
    const permissionCheck = await permission.isGroupAdmin(_group.data[0].group)
    if (permissionCheck.code !== 'success') {
        return permissionCheck
    }
    return await db.collection('UserToActivity').where({
        userId: info.userId,
        activityId: info.activityId,
    }).remove().then(res => {
        return {
            code: 'success',
            status: 200,
            des: '删除成功',
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
