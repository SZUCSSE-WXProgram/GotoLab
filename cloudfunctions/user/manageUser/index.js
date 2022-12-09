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
const changeableItems = ['name', 'stuid', 'phone', 'class', 'permission', 'docid']

// 云函数入口函数
exports.main = async (event, context) => {
    const wxContext = cloud.getWXContext()
    const permissionCheck = await permission.isSuperAdmin()
    if (permissionCheck.code !== 'success') {
        return permissionCheck;
    }
    info = {}
    for (let items of changeableItems) {
        if (event.info[items] != undefined && event.info[items] !== '') {
            info[items] = event.info[items]
        }
    }
    if (Object.keys(info).length === 0) {
        return {
            code: 'fail',
            des: '没有需要修改的内容',
            status: 402,
        }
    }
    const checkResult = await validator.check(info, checkList.manageUserCheck);
    if (checkResult.code !== 'success') {
        return checkResult;
    }
    if (info.permission && info.permission === 1) {
        return {
            code: 'fail',
            des: '不允许直接修改为研究所管理员，请在研究所管理中修改！',
            status: 402,
        }
    }
    _id = info.docid
    delete info.docid
    return await db.collection('User').doc(_id).update({
        data: info,
    }).then(res => {
        return {
            code: 'success',
            des: '修改成功！',
            status: 200,
        }
    }).catch(e => {
        return {
            code: 'fail',
            des: e,
            status: 500,
        }
    })
}