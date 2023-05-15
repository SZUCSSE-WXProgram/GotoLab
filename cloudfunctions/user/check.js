const cloud = require('wx-server-sdk')
cloud.init({
    env: cloud.DYNAMIC_CURRENT_ENV
})
const wxContext = cloud.getWXContext()
const db = cloud.database()
const _ = db.command;
const $ = _.aggregate
exports.registerCheck = {
    stuid: {
        des: '学号',
        type: 'string',
        required: true,
        minLength: 6,
        maxLength: 10,
        validator: [isNumber]
    },
    name: {des: '姓名', type: 'string', required: true, minLength: 2, maxLength: 10},
    phone: {des: '手机号', type: 'string', required: true, minLength: 11, maxLength: 11, validator: [isNumber]},
    class: {des: '班级', type: 'string', required: true, validator: [validateClass]},
    openid: {des: '用户ID', type: 'string', required: true, validator: [uniqueOpenid]},
    email: {des: '邮箱', type: 'string', required: true, validator: [validateEmail]}
}

exports.modifyCheck = {
    stuid: {
        des: '学号',
        type: 'string',
        required: false,
        minLength: 6,
        maxLength: 10,
        validator: [isNumber]
    },
    name: {des: '姓名', type: 'string', required: false, minLength: 2, maxLength: 10},
    phone: {des: '手机号', type: 'string', required: false, minLength: 11, maxLength: 11, validator: [isNumber]},
    class: {des: '班级', type: 'string', required: false, validator: [validateClass]},
    email: {des: '邮箱', type: 'string', required: false, validator: [validateEmail]}

}

exports.manageUserCheck = {
    docid: {des: '文档id', type: 'string', required: true, validator: [validateStu_id]},
    stuid: {des: '学号', type: 'string', required: false, minLength: 10, maxLength: 10, validator: [isNumber]},
    name: {des: '姓名', type: 'string', required: false, minLength: 2, maxLength: 10},
    phone: {des: '手机号', type: 'string', required: false, minLength: 11, maxLength: 11, validator: [isNumber]},
    class: {des: '班级', type: 'string', required: false, validator: [validateClass]},
    permission: {des: '权限', type: 'enum', required: false, range: [0, 1, 2]},
    email: {des: '邮箱', type: 'string', required: false, validator: [validateEmail]}
}

exports.uploadUserCheck = {
    fileID: {des: '文件ID', type: 'string', required: true, validator: [validateExcel]},
}
exports.handleUploadCheck = {
    fileID: {des: '文件ID', type: 'string', required: true},
}

async function uniqueStuid(stuid) {
    return await db.collection('User').where({
        stuid: stuid,
        openid: _.neq(wxContext.OPENID)
    }).count().then(res => {
        if (res.total === 0) {
            return {
                code: 'success',
                status: 200,
            }
        } else {
            return {
                code: 'fail',
                status: 402,
                des: '该学号已经被注册了'
            }
        }
    })
}

async function isNumber(str) {
    const reg = /^[0-9]*$/;
    if (reg.test(str)) {
        return {
            code: 'success',
            status: 200,
        }
    } else {
        return {
            code: 'fail',
            status: 402,
            des: '学号必须为数字'
        }
    }
}

async function uniqueOpenid(openID) {
    const _cnt = await db.collection('User').where({
        openid: openID
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
            des: '该账户已经被注册了'
        }
    }
}

async function validateClass(classid) {
    const _cnt = await db.collection('Class').where({
        _id: classid,
        available: true
    }).count()
    if (_cnt.total === 0) {
        return {
            code: 'fail',
            status: 402,
            des: '该班级不存在'
        }
    } else {
        return {
            code: 'success',
            status: 200,
        }
    }
}

async function validateStu_id(_id) {
    const _cnt = await db.collection('User').where({
        _id: _id,
    }).count()
    if (_cnt.total === 1) {
        return {
            code: 'success',
            status: 200,
        }
    } else {
        return {
            code: 'fail',
            des: '该学生不存在',
            status: 402,
        }
    }
}

async function validateEmail(email) {
    const reg = /^(\w-*\.*)+@(\w-?)+(\.\w{2,})+$/;
    if (reg.test(email)) {
        return {
            code: 'success',
            status: 200,
        }
    } else {
        return {
            code: 'fail',
            status: 402,
            des: '邮箱格式不正确'
        }
    }
}

async function validateExcel(fileID) {
    if (fileID.endsWith('xlsx') || fileID.endsWith('xls')) {
        return {
            code: 'success',
            status: 200,
        }
    } else {
        return {
            code: 'fail',
            status: 402,
            des: '文件格式不正确'
        }
    }
}
