const cloud = require('wx-server-sdk')
const validator = require('../util/validate')
const checkList = require('../check')
const permission = require('../util/permission.js')

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
    const checkResult = await validator.check(event.info, checkList.getByIDCheck)
    if (checkResult.code !== 'success') {
        return checkResult
    }
    const _id = event.info._id
    return await db.collection('Group').doc(_id).get().then(res => {
        return {
            code: 'success',
            info: res.data,
            status: 200
        }
    }).catch(e => {
        return {
            code: 'fail',
            des: e,
            status: 500,
        }
    })
}
