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
    console.log('User ID: ' + wxContext.OPENID)
    console.log('Params: ' + JSON.stringify(event))
    const checkResult = await validator.check(event.info, checkList.manageGroupAdminCheck)
    if (checkResult.code !== 'success') {
        return checkResult;
    }
    const info = {
        groupId: event.info.groupId,
        userId: event.info.userId
    }
    const isAlreadySuperAdmin = await db.collection('User').where({
        _id: info.userId,
        permission: 2,
    }).count()
    if (isAlreadySuperAdmin.total !== 0) {
        return {
            code: 'fail',
            des: '超级管理员无需删除研究所管理员',
            status: 403,
        }
    }
    const permissionCheck = await permission.isGroupAdmin(info.groupId)
    if (permissionCheck.code !== 'success') {
        return permissionCheck;
    }
    const _isNotAdmin = await db.collection('User').where({
        _id: info.userId,
        groups: info.groupId
    }).count()

    if (_isNotAdmin.total === 0) {
        return {
            code: 'fail',
            status: 402,
            des: '该用户已经不是该研究所的管理员',
        }
    }
    const groups = await db.collection('User').doc(info.userId).get()
    if (groups.data.groups.length === 1) {
        return await db.collection('User').doc(info.userId).update({
            data: {
                groups: _.pullAll([info.groupId]),
                permission: 0
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
    } else {
        return await db.collection('User').doc(info.userId).update({
            data: {
                groups: _.pullAll([info.groupId])
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
}
