const cloud = require('wx-server-sdk')
cloud.init({
    env: cloud.DYNAMIC_CURRENT_ENV
})
const db = cloud.database()
const _ = db.command;
const $ = _.aggregate

exports.createCheck = {
    group: {des: '研究所', required: true, type: 'string', validator: [existGroup]},
    creator: {des: '创建者', type: 'string', required: true},
    name: {des: '活动名', type: 'string', required: true, minLength: 2, maxLength: 20},
    intro: {des: '活动简介', type: 'string', required: true, minLength: 2},
    limit: {des: '人数限制', type: 'number', required: true, validator: [positiveInteger]},
    signable: {des: '是否可报名', type: 'boolean', required: true},
    startTime: {des: '开始时间', type: 'date', required: true},
    endTime: {des: '结束时间', type: 'date', required: true},
    location: {des: '活动地点', type: 'string', required: true},
    type: {des: '活动类型', type: 'string', required: true, validator: [existType]},
}


exports.modifyCheck = {
    _id: {des: '活动id', type: 'string', required: true, validator: [existActivity]},
    group: {des: '研究所', required: true, type: 'string', validator: [existGroup]},
    name: {des: '活动名', type: 'string', required: false, minLength: 2, maxLength: 20},
    intro: {des: '活动简介', type: 'string', required: false, minLength: 2},
    limit: {des: '人数限制', type: 'number', required: false, validator: [positiveInteger]},
    signable: {des: '是否可报名', type: 'boolean', required: false},
    startTime: {des: '开始时间', type: 'string', required: false},
    endTime: {des: '结束时间', type: 'string', required: false},
    location: {des: '活动地点', type: 'string', required: false},
    type: {des: '活动类型', type: 'string', required: false, validator: [existType]},
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

async function existActivity(activity_id) {
    const _cnt = await db.collection('Activity').where({
        _id: activity_id
    }).count()
    if (_cnt.total === 0) {
        return {
            code: 'fail',
            status: 402,
            des: '活动不存在'
        }

    } else {
        return {
            code: 'success',
            status: 200,
        }
    }
}

