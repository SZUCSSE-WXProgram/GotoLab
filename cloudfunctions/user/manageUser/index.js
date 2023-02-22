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
const changeableItems = ['name', 'stuid', 'phone', 'class', 'permission', 'docid']

// 云函数入口函数
exports.main = async (event, context) => {
    const wxContext = cloud.getWXContext()
    const permissionCheck = await permission.isSuperAdmin()
    if (permissionCheck.code !== 'success') {
        return permissionCheck;
    }
    const info = {}
    try {
        for (let items of changeableItems) {
            if (event.info && event.info[items] !== undefined && event.info[items] !== '') {
                if (items === 'permission') {
                    info[items] = Number(event.info[items])
                } else {
                    info[items] = event.info[items]
                }
            }
        }
    } catch (e) {
        return {
            code: 'fail',
            des: "数据类型错误" + e,
            status: 500,
        }
    }
    const checkResult = await validator.check(info, checkList.manageUserCheck);
    if (checkResult.code !== 'success') {
        return checkResult;
    }
    // 单独对学号进行校验
    const stuidCheck = await db.collection('User').where({
        stuid: info.stuid,
        _id: _.neq(info.docid),
    }).count()
    if (stuidCheck.total > 0) {
        return {
            code: 'fail',
            des: '学号已存在！',
            status: 402,
        }
    }
    if (Object.keys(info).length <= 1) {
        return {
            code: 'fail',
            des: '没有需要修改的内容',
            status: 402,
        }
    }
    if (info.permission && info.permission === 1) {
        return {
            code: 'fail',
            des: '不允许直接修改为研究所管理员，请在研究所管理中修改！',
            status: 402,
        }
    }
    const _id = info.docid
    delete info.docid
    if (info.permission === 2 || info.permission === 0) info['groups'] = []
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
