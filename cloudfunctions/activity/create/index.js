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
    const currentUser= await db.collection('User').where({
        openid: wxContext.OPENID
    }).get()
    let info = {
        group: event.info.group,
        creator: currentUser.data[0]._id,
        name: event.info.name,
        intro: event.info.intro,
        limit: event.info.limit,
        signable: true,
        startTime: event.info.startTime,
        endTime: event.info.endTime,
        location: event.info.location,
        type: event.info.type,
    }
    try {
        info.startTime = new Date(info.startTime)
        info.endTime = new Date(info.endTime)
    } catch (e) {
        return {
            status: 402,
            code: 'fail',
            msg: '时间格式错误'
        }
    }
    const checkResult = await validator.check(info, checkList.createCheck);
    if (checkResult.code !== 'success') {
        return checkResult
    }
    if (info.startTime >= info.endTime) {
        return {
            status: 402,
            code: 'fail',
            msg: '开始时间不能晚于结束时间'
        }
    }
    const permissionCheck = await permission.isGroupAdmin(info.group)
    if (permissionCheck.code !== 'success') {
        return permissionCheck
    }
    return await db.collection('Activity').add({
        data: info
    }).then(res => {
        return {
            code: 'success',
            des: '创建成功',
            status: 200,
            info: res,
        }
    }).catch(e => {
        return {
            code: 'fail',
            des: e,
            status: 500,
        }
    })
}
