const cloud = require('wx-server-sdk')
cloud.init({
    env: cloud.DYNAMIC_CURRENT_ENV
})
const db = cloud.database()
const _ = db.command;
const $ = _.aggregate
// group: event.info.group,
//     creator: wxContext.OPENID,
//     name: event.info.name,
//     intro: event.info.intro,
//     limit: event.info.limit,
//     signable: true,
//     startTime: event.info.startTime,
//     endTime: event.info.endTime,
//     location: event.info.location,
//     type: event.info.type,
exports.createCheck = {
    group: {des: '研究所', required: true, type: 'string', validator: [existGroup]},
    creator: {des: '创建者', type: 'string', required: true},
    name: {des: '活动名', type: 'string', required: true, minLength: 2, maxLength: 15},
    intro: {des: '活动简介', type: 'string', required: true, minLength: 2},
    limit: {des: '人数限制', type: 'number', required: true, validator: [positiveInteger]},
    signable: {des: '是否可报名', type: 'boolean', required: true},
    startTime: {des: '开始时间', type: 'date', required: true},
    endTime: {des: '结束时间', type: 'date', required: true},
    location: {des: '活动地点', type: 'string', required: true},
    type: {des: '活动类型', type: 'string', required: true, validator: [existType]},
}


async function existType(type_id) {
    const _cnt = await db.collection('ActivityType').where({
        _id: type_id
    }).count()
    if (_cnt.total === 0) {
        return {
            code: 'fail',
            status: 402,
            des: '活动类型不存在'
        }

    } else {
        return {
            code: 'success',
            status: 200,
        }
    }
}
async function existGroup(group_id) {
    const _cnt = await db.collection('Group').where({
        _id: group_id
    }).count()
    if (_cnt.total === 0) {
        return {
            code: 'fail',
            status: 402,
            des: '研究所不存在'
        }

    } else {
        return {
            code: 'success',
            status: 200,
        }
    }
}

async function positiveInteger(limit) {
    if (limit > 0) {
        return {
            code: 'success',
            status: 200,
        }
    } else {
        return {
            code: 'fail',
            status: 402,
            des: '人数限制必须大于0'
        }
    }

}

