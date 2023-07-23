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
    throwOnNotFound: true
})
const _ = db.command
const $ = _.aggregate

// 云函数入口函数
exports.main = async (event, context) => {
    const wxContext = cloud.getWXContext()
    console.log('User ID: ' + wxContext.OPENID)
    console.log('Params: ' + JSON.stringify(event))
    const checkResult = await validator.check(event.info, checkList.getAdminCheck)
    if (checkResult.code !== 'success') {
        return checkResult;
    }
    const groupId = event.info.groupId
    return await db.collection('User').where({
        permission: 1,
        groups: groupId
    }).get().then(res => {
        for (let i = 0; i < res.data.length; i++) {
            delete res.data[i].groups
            delete res.data[i].class
            delete res.data[i].permission
        }
        return {
            code: 'success',
            status: 200,
            info: res.data
        }
    }).catch(e => {
        return {
            code: 'fail',
            status: 500,
            des: e
        }
    })
}
