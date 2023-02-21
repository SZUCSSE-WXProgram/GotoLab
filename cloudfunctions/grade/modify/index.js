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
        gradeName: event.info.gradeName,
        _id: event.info._id
    }
    const _cnt = await db.collection('Grade').where({
        _id: _.neq(info._id),
        gradeName: info.gradeName
    }).count()
    if (_cnt.total !== 0) {
        return {
            code: 'fail',
            des: '该年级已存在',
            status: 402,
        }
    }
    return await db.collection('Grade').doc(info._id).update({
        data: {
            gradeName: info.gradeName,
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
