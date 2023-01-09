const cloud = require('wx-server-sdk')
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
    // 不带查询参数，只返回研究所名称，id和图片链接
    return await db.collection('Group')
        .field({
            _id: true,
            groupName: true,
            picLink: true,
        })
        .limit(100)
        .get().then(res => {
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
