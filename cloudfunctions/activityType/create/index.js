const cloud = require('wx-server-sdk')
const permission = require('../util/permission.js')
const validator = require('../util/validate.js')
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
    const permissionCheck = await permission.isSuperAdmin()
    if (permissionCheck.code !== 'success') {
        return permissionCheck;
    }
    const checkResult = await validator.check(event.info, checkList.createCheck);
    if (checkResult.code !== 'success') {
        return checkResult
    }
    return await db.collection('ActivityType').add({
        data: {
            typeName: event.info.typeName,
        }
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
