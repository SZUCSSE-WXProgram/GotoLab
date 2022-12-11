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
    const permissionCheck = permission.isSuperAdmin()
    if (permissionCheck.code !== 'success') {
        return permissionCheck;
    }
    const checkResult = validator.check(event.info, checkList.modifyCheck);
    if (checkResult.code !== 'success') {
        return checkResult
    }
    const info = {
        typeName: event.info.typeName,
        _id: event.info._id
    }
    const _cnt = await db.collection('ActivityType').where({
        _id: info._id,
        typeName: info.typeName
    }).count()

    if (_cnt.total === 1) {
        return {
            code: 'fail',
            des: '未发生更改',
            status: 402,
        }
    }
    return await db.collection('ActivityType').doc(info._id).update({
        data: {
            typeName: info.typeName,
        }
    }).then(res => {
        return {
            code: 'success',
            des: '修改成功',
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
