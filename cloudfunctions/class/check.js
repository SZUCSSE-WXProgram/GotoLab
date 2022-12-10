const cloud = require('wx-server-sdk')
cloud.init({
    env: cloud.DYNAMIC_CURRENT_ENV
})
const db = cloud.database()
const _ = db.command;
const $ = _.aggregate
exports.createCheck = {
    className: {des: '班级名', type: 'string', required: true, minLength: 2, maxLength: 10},
    gradeId: {des: '年级id', type: 'string', required: true, validator: [existGrade]},
}

exports.modifyCheck = {
    _id:{des:'班级id',type:'string',required:true,validator:[existClass]},
    className: {des: '班级名', type: 'string', required: false, minLength: 2, maxLength: 10},
    gradeId: {des: '年级id', type: 'string', required: false, validator: [existGrade]},
}


async function existGrade(_id) {
    const _cnt = await db.collection('Grade').where({
        _id: _id
    }).count()
    if (_cnt.total === 0) {
        return {
            code: 'fail',
            des: '该年级不存在',
            status: 402,
        }
    }
    return {
        code: 'success',
        status: 200,
    }
}

async function existClass(_id) {
    const _cnt = await db.collection('Class').where({
        _id: _id
    }).count()
    if (_cnt.total === 0) {
        return {
            code: 'fail',
            des: '该班级不存在',
            status: 402,
        }
    }
    return {
        code: 'success',
        status: 200,
    }
}
