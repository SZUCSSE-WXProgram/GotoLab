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
    const checkResult = await validator.check(event.info, checkList.manageGroupAdminCheck)
    if (checkResult.code !== 'success') {
        return checkResult;
    }
    const info = {
        groupId: event.info.groupId,
        userId: event.info.userId
    }
    const isSuperAdmin = await permission.isSuperAdmin()
    if (isSuperAdmin.code === 'success') {
        return {
            code: 'fail',
            des: '超级管理员无需添加研究所管理员',
            status: 403,
        }
    }
    const permissionCheck = await permission.isGroupAdmin(info.groupId)
    if (permissionCheck.code !== 'success') {
        return permissionCheck;
    }
    const _isAlreadyAdmin = await db.collection('User').where({
        _id: info.userId,
        groups: info.groupId
    }).count()
    if (_isAlreadyAdmin.total > 0) {
        return {
            code: 'fail',
            status: 402,
            des: '该用户已经是该研究所的管理员',
        }
    }
    return await db.collection('User').doc(info.userId).update({
        data: {
            groups: _.push([info.groupId]),
            permission:1
        }
    }).then(res => {
        return {
            code: 'success',
            status: 200,
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