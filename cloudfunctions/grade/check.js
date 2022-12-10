const cloud = require('wx-server-sdk')
cloud.init({
    env: cloud.DYNAMIC_CURRENT_ENV
})
const db = cloud.database()
const _ = db.command;
const $ = _.aggregate
exports.createCheck = {
    name: {des: '年级名', type: 'string', required: true, minLength: 2, maxLength: 10, validator: [uniqueGrade]},
}

exports.modifyCheck = {
    name: {des: '年级名', type: 'string', required: true, minLength: 2, maxLength: 10, validator: [uniqueGrade]},
    _id: {des: '年级id', type: 'string', required: true, validator: [existGrade]},
}


async function uniqueGrade(gradeName) {
    const _cnt = await db.collection('Grade').where({
        gradeName: gradeName
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
            des: '该年级已经被创建了'
        }
    }
}

async function existGrade(gradeId) {
    const _cnt = await db.collection('Grade').where({
        _id: gradeId
    }).count()
    if (_cnt.total === 0) {
        return {
            code: 'fail',
            status: 402,
            des: '该年级不存在'
        }
    } else {
        return {
            code: 'success',
            status: 200,
        }
    }
}
