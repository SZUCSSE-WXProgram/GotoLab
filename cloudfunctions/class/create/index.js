const cloud = require('wx-server-sdk')
const permission = require('../util/permission.js')
const validator = require('../util/validate.js')
const createCheck = require('../check')
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
    const checkResult = validator.check(event.info, createCheck.createCheck);
    if (checkResult.code !== 'success') {
        return checkResult
    }
    const permissionCheck = permission.isSuperAdmin()
    if (permissionCheck.code !== 'success') {
        return permissionCheck;
    }
    const info = {
        className: event.info.className,
        gradeId: event.info.gradeId,
    }
    const _cnt = await db.collection('Class').where({
        className: info.className,
        gradeId: info.gradeId
    }).count()

    if (_cnt.total !== 0) {
        return {
            code: 'fail',
            des: '班级已存在',
            status: 402,
        }
    }
    return await db.collection('Class').add({
        data: {
            className: info.className,
            gradeId: info.gradeId,
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
