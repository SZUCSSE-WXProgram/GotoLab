const cloud = require('wx-server-sdk')
cloud.init({
    env: cloud.DYNAMIC_CURRENT_ENV
})
const db = cloud.database()
const _ = db.command;
const $ = _.aggregate
exports.createCheck = {
    typeName: {des: '活动类别名', type: 'string', required: true, minLength: 2, maxLength: 10},
}

exports.modifyCheck = {
    typeName: {des: '活动类别名', type: 'string', required: true, minLength: 2, maxLength: 10, validator: [uniqueType]},
    _id: {des: '活动id', type: 'string', required: true, validator: [existType]},
}


async function uniqueType(typeName) {
    const _cnt = await db.collection('ActivityType').where({
        typeName: typeName
    }).count()
    if (_cnt.total === 0) {
        return {
            code: 'success',
            status: 200,
        }
    } else {
        return {
            code: 'fail',
            status: 402,
            des: '该类别已经被创建了'
        }
    }
}

async function existType(typeId) {
    const _cnt = await db.collection('Grade').where({
        _id: typeId
    }).count()
    if (_cnt.total === 0) {
        return {
            code: 'fail',
            status: 402,
            des: '该类别不存在'
        }
    } else {
        return {
            code: 'success',
            status: 200,
        }
    }
}
