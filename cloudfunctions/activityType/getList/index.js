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
    // 获取整个活动类型列表
    return await db.collection('ActivityType').where({
        available: true
    }).field({
        _id: true,
        typeName: true,
    }).get().then(res => {
        return {
            code: 'success',
            des: '获取成功',
            status: 200,
            info: res.data,
        }
    }).catch(e => {
        return {
            code: 'fail',
            des: e,
            status: 500,
        }
    })
}
