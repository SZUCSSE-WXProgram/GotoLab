const cloud = require('wx-server-sdk')
const permission = require('../util/permission.js')
const validator = require('../util/validate.js')
const createCheck = require('../check')
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
    console.log('User ID: ' + wxContext.OPENID)
    console.log('Params: ' + JSON.stringify(event))
    const permissionCheck = await permission.isSuperAdmin()
    if (permissionCheck.code !== 'success') {
        return permissionCheck;
    }
    const checkResult = await validator.check(event.info, createCheck.modifyCheck);
    if (checkResult.code !== 'success') {
        return checkResult
    }
    const info = {
        _id: event.info._id,
        className: event.info.className,
    }
    const curClass = await db.collection('Class').doc(info._id).get().then(res => {
        return res.data
    })
    const _cnt = await db.collection('Class').where({
        _id: _.neq(info._id),
        className: info.className,
        gradeId: curClass.gradeId,
        available: true,
    }).count()
    if (_cnt.total !== 0) {
        return {
            code: 'fail',
            des: '该班级已存在',
            status: 402,
        }
    }
    const docid = info._id;
    delete info._id;
    return await db.collection(('Class')).doc(docid).update({
        data: info,
    }).then(res => {
        return {
            code: 'success',
            des: '修改成功',
            status: 200,
            info: res,
        }
    }).catch(e => {
        return {
            code: 'fail',
            des: e,
            status: 500,
        }
    })

}
