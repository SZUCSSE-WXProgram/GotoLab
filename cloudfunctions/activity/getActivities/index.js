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
    const checkResult = await validator.check(event.info, checkList.getActivitiesCheck);
    if (checkResult.code !== 'success') {
        return checkResult
    }
    const pageOffset = {
        limit: event.info.limit ? Math.min(event.info.limit, 20) : 10,
        offset: event.info.offset ? event.info.offset : 0,
    }
    const pageQuery = {
        search: event.info.search ? event.info.search : "",
        type: event.info.type ? event.info.type : "",
    }
    return await db.collection('Activity').aggregate().lookup({
        from: 'Group',
        localField: 'group',
        foreignField: '_id',
        as: 'group',
    }).lookup({
        from: 'User',
        localField: 'creator',
        foreignField: '_id',
        as: 'creator'
    }).match(_.and([{
        name: db.RegExp({
            regexp: '.*' + pageQuery.search,
            options: 'i',
        })
    }, {
        type: db.RegExp({
            regexp: '.*' + pageQuery.type,
            options: 'i',
        })
    }])).skip(pageOffset.offset)
        .limit(pageOffset.limit + 1)// tricky做法 多取一条数据判断数据是不是取完了
        .end().then(res => {
            const hasMore = res.list.length > pageOffset.limit
            if (hasMore) {
                res.list.pop()
            }
            return {
                code: 'success',
                data: res.list,
                hasMore: hasMore,
                status: 200
            }
        }).catch(e => {
            return {
                code: 'fail',
                status: 500,
                des: e
            }
        })
}
