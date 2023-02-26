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
    const checkResult = await validator.check(event.info, checkList.modifyCheck);
    if (checkResult.code !== 'success') {
        return checkResult
    }
    const info = {
        typeName: event.info.typeName,
        _id: event.info._id
    }
    const _cnt = await db.collection('ActivityType').where({
        _id: _.neq(info._id),
        typeName: info.typeName
    }).count().then(res => {
        return res.total
    })
    if (_cnt !== 0) {
        return {
            code: 'fail',
            status: 402,
            des: '该类别已经被创建了'
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
