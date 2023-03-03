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
    const checkResult = await validator.check(event.info, checkList.handleUploadCheck)
    if (checkResult.code !== 'success') {
        return checkResult;
    }
    const permissionCheck = await permission.isGroupAdmin(event.info._id)
    if (permissionCheck.code !== 'success') {
        return permissionCheck;
    }
    return await db.collection('Files').add({
        data: {
            createTime: new Date(),
            url: event.info.picLink,
            type: 'upload'
        }
    }).then(res => {
        return {
            code: 'success',
            status: 200,
            des: '上传成功',
            info: res,
        }
    }).catch(e => {
            return {
                code: 'fail',
                status: 500,
                des: e,
            }
        }
    )
}
