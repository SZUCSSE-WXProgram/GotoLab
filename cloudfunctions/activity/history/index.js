const cloud = require('wx-server-sdk')
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
    // 获取本人之前的活动记录
    const pageOffset = {
        limit: event.info.limit ? Math.min(event.info.limit, 20) : 10,
        offset: event.info.offset ? event.info.offset : 0,
    }
    const currentUser = await db.collection('User').where({
        openid: wxContext.OPENID,
    }).get().then(res => {
        return res.data[0]._id
    }).catch(e => {
        return null
    })
    if (currentUser === null) {
        return {
            code: 'fail',
            des: '用户不存在',
            status: 404,
        }
    }
    return await db.collection('UserToActivity').aggregate()
        .match({
            userId: currentUser,
        }).lookup({
            from: 'Activity',
            localField: 'activityId',
            foreignField: '_id',
            as: 'activity',
        }).skip(pageOffset.offset)
        .limit(pageOffset.limit + 1)// tricky做法 多取一条数据判断数据是不是取完了
        .end().then(res => {
            for (let i = 0; i < res.list.length; i++) {
                res.list[i] = res.list[i].activity[0]
            }
            const hasMore = res.list.length > pageOffset.limit
            if (hasMore) {
                res.list.pop()
            }
            return {
                code: 'success',
                status: 200,
                data: res.list,
                hasMore: hasMore,
            }

        }).catch(e => {
            return {
                code: 'fail',
                des: e,
                status: 500,
            }
        }).catch(e => {
            return {
                code: 'fail',
                des: e,
                status: 500,
            }
        })
}
