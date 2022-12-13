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
    }
    const checkResult = await validator.check(info, checkList.getAttenderCheck);
    if (checkResult.code !== 'success') {
        return checkResult
    }
    const permissionCheck = await permission.isActivityAdmin(info.activityId)
    if (permissionCheck.code !== 'success') {
        return permissionCheck
    }
    return await db.collection('Activity').aggregate()
        .match({
            _id: info.activityId
        })
        .lookup({
            from: 'UserToActivity',
            localField: '_id',
            foreignField: 'activityId',
            as: 'attender',
        }).lookup({
            from: 'User',
            localField: 'attender.userId',
            foreignField: '_id',
            as: 'attender.user',
        }).end().then(res => {
            return {
                code: 'success',
                status: 200,
                des: '获取成功',
                info: res
            }
        }).catch(e => {
            return {
                code: 'fail',
                status: 500,
                des: e
            }
        })
}
