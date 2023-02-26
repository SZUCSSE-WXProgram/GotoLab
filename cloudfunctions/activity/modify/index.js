const cloud = require('wx-server-sdk')
const permission = require('../util/permission.js')
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
    const changeableFields = ['name', 'intro', 'limit', 'signable', 'startTime', 'endTime', 'location', 'type']
    const wxContext = cloud.getWXContext()
    const checkResult = await validator.check(event.info, checkList.modifyCheck);
    if (checkResult.code !== 'success') {
        return checkResult
    }
    const permissionCheck = await permission.isActivityAdmin(event.info._id)
    if (permissionCheck.code !== 'success') {
        return permissionCheck
    }
    const _activity = await db.collection('Activity').doc(event.info._id).get().then(res => {
        return res.data
    })
    let info = {
        _id: event.info._id,
    }
    for (let field of changeableFields) {
        if (event.info[field] === undefined || event.info[field] === null || event.info[field] === "") {
            info[field] = _activity[field]
        } else {
            info[field] = event.info[field]
        }
    }
    if (isNaN(Date.parse(info.startTime)) || isNaN(Date.parse(info.endTime)) || new Date(info.endTime).toString() === 'Invalid Date' || new Date(info.startTime).toString() === 'Invalid Date') {
        return {
            status: 402,
            code: 'fail',
            des: '时间格式错误'
        }
    }
    try {
        info.startTime = new Date(info.startTime)
        info.endTime = new Date(info.endTime)
    } catch (e) {
        return {
            status: 402,
            code: 'fail',
            des: '时间格式错误'
        }
    }

    if (info.startTime >= info.endTime) {
        return {
            status: 402,
            code: 'fail',
            des: '开始时间不能晚于结束时间'
        }
    }
    const doc_id = info._id
    delete info._id
    return await db.collection('Activity').doc(doc_id).update({
        data: info
    }).then(res => {
        return {
            code: 'success',
            des: '修改成功',
            status: 200,
        }
    }).catch(e => {
        return {
            code: 'fail',
            des: e,
            status: 500,
        }
    })
}
