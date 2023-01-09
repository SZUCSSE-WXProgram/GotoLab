const cloud = require('wx-server-sdk')
cloud.init({
    env: cloud.DYNAMIC_CURRENT_ENV
})
const db = cloud.database()
const _ = db.command;
const $ = _.aggregate
exports.createCheck = {
    groupName: {des: '研究所名', type: 'string', required: true, minLength: 2, validator: [uniqueGroupName]},
    intro: {des: '简介', type: 'string', required: true, minLength: 10},
    pic_base64: {des: '研究所图片', type: 'string', required: true}
}
exports.getByIDCheck = {
    _id: {des: '研究所ID', type: 'string', required: true, validator: [existGroupId]},
}
exports.modifyCheck = {
    _id: {des: '文档id', type: 'string', required: true, validator: [existGroupId]},
    groupName: {des: '研究所名', type: 'string', required: false, minLength: 2},
    intro: {des: '简介', type: 'string', required: false, minLength: 10},
    pic_base64: {des: '研究所图片', type: 'string', required: true}
}

exports.getAdminCheck = {
    groupId: {des: '研究所id', type: 'string', required: true, validator: [existGroupId]}
}

exports.manageGroupAdminCheck = {
    userId: {des: '用户id', type: 'string', required: true, validator: [existUser]},
    groupId: {des: '研究所id', type: 'string', required: true, validator: [existGroupId]}
}

async function uniqueGroupName(groupName) {
    const _cnt = await db.collection('Group').where({
        groupName: groupName
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
            des: '该研究所已经被注册了'
        }
    }
}

async function existUser(_id) {
    const _cnt = await db.collection('User').where({
        _id: _id
    }).count()
    if (_cnt.total === 1) {
        return {
            code: 'success',
            status: 200,
        }
    } else {
        return {
            code: 'fail',
            status: 402,
            des: '该用户不存在'
        }
    }
}

async function existGroupId(groupId) {
    const _cnt = await db.collection('Group').where({
        _id: groupId
    }).count()
    if (_cnt.total === 1) {
        return {
            code: 'success',
            status: 200,
        }
    } else {
        return {
            code: 'fail',
            status: 402,
            des: '该研究所不存在！'
        }
    }
}