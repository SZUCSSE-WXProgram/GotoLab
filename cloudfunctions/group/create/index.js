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
    const permissionCheck = await permission.isSuperAdmin()
    if (permissionCheck.code !== 'success') {
        return permissionCheck;
    }
    const checkResult = await validator.check(event.info, checkList.createCheck)
    if (checkResult.code !== 'success') {
        return checkResult;
    }
    const validateFields = ['groupName', 'intro', 'pic_base64']
    let info = {}
    for (const item in validateFields) {
        info[validateFields[item]] = event.info[validateFields[item]]
    }
    if (info.pic_base64.length * 0.75 > 5 * 1024 * 1024) {
        return {
            code: 'fail',
            des: '图片过大，最大5M',
            status: 403,
        }
    }
    const picType = info.pic_base64.split(';')[0].split('/')[1]
    const allowedPicType = ['jpg', 'jpeg', 'png', 'bmp']
    if (!allowedPicType.includes(picType)) {
        return {
            code: 'fail',
            des: '非法的图片类型',
            status: 403,
        }
    }
    try {
        const uploadResult = await cloud.uploadFile({
            cloudPath: 'picture/' + new Date().getTime() + '.' + picType,
            fileContent: Buffer.from(info.pic_base64.split(',')[1], 'base64'),
        })
        info.picLink = uploadResult.fileID
        delete info.pic_base64
    } catch (e) {
        return {
            code: 'fail',
            des: e,
            status: 500,
        }
    }
    return await db.collection('Group').add({
        data: info
    }).then(res => {
        return {
            code: 'success',
            status: 200,
            des: '创建成功',
            info: res,
        }
    }).catch(e => {
        return {
            code: 'fail',
            status: 500,
            des: e,
        }
    })

}