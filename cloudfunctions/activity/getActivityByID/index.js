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
    const checkResult = await validator.check(event.info, checkList.getActivityByIDCheck);
    if (checkResult.code !== 'success') {
        return checkResult
    }
    const _cnt = await db.collection('UserToActivity').where({
        activityId: event.info.activityId,
    }).count()
    return await db.collection('Activity').aggregate()
        .lookup({
            from: 'Group',
            localField: 'group',
            foreignField: '_id',
            as: 'group',
        }).lookup({
            from: 'User',
            localField: 'creator',
            foreignField: '_id',
            as: 'creator'
        }).lookup({
            from: 'ActivityType',
            localField: 'type',
            foreignField: '_id',
            as: 'type'
        }).match({
            _id: event.info.activityID
        })
        .end().then(res => {
            res.list[0].group = res.list[0].group[0]
            res.list[0].creator = res.list[0].creator[0]
            res.list[0].type = res.list[0].type[0]
            delete res.list[0].creator.class
            delete res.list[0].creator.permission
            delete res.list[0].creator.openid
            delete res.list[0].creator.groups
            delete res.list[0].creator.phone
            delete res.list[0].creator.stuid
            delete res.list[0].group.picLink
            delete res.list[0].group.intro
            res = res.list[0]
            res.attenders = _cnt.total
            return {
                code: 'success',
                data: res,
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
