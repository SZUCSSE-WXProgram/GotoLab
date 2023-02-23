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
const changeableItems = ['name', 'stuid', 'phone', 'class']
const _ = db.command;
// 云函数入口函数
exports.main = async (event, context) => {
    const wxContext = cloud.getWXContext()
    const permissionCheck = await permission.isNotStudent()
    if (permissionCheck.code === 'fail') {
        return permissionCheck;
    }
    let info = {}
    for (let items of changeableItems) {
        if (event.info[items] && event.info[items] !== undefined && event.info[items] !== '') {
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
    const checkResult = await validator.check(info, checkList.modifyCheck);
    if (checkResult.code !== 'success') {
        return checkResult;
    }
    const stuidCheck = await db.collection('User').where({
        stuid: info.stuid,
        openid: _.neq(wxContext.OPENID),
    }).count()
    if (stuidCheck.total > 0) {
        return {
            code: 'fail',
            des: '学号已存在！',
            status: 402,
        }
    }
    return await db.collection('User').where({
        openid: wxContext.OPENID
    }).update({
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
