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
    const wxContext = cloud.getWXContext()
    console.log('User ID: ' + wxContext.OPENID)
    console.log('Params: ' + JSON.stringify(event))
    const checkResult = await validator.check(event.info, checkList.modifyCheck)
    if (checkResult.code !== 'success') {
        return checkResult;
    }
    const permissionCheck = await permission.isGroupAdmin(event.info._id)
    if (permissionCheck.code !== 'success') {
        return permissionCheck;
    }
    let info = {}
    let changeableFields = ['groupName', 'intro', 'picLink']
    let cnt = 0;
    for (const item in changeableFields) {
        if (event.info[changeableFields[item]] !== undefined && event.info[changeableFields[item]] !== '') {
            cnt++;
            info[changeableFields[item]] = event.info[changeableFields[item]]
        }
    }
    if (cnt === 0) {
        return {
            code: 'success',
            status: 200,
            des: '修改成功'
        }
    }
    const docId = event.info._id;
    return await db.collection('Group').doc(docId).update({
        data: info
    }).then(updateRes => {
        return {
            code: 'success',
            status: 200,
            des: '修改成功'
        }
    }).catch(e => {
        return {
            code: 'fail',
            status: 500,
            des: e,
        }
    })


}
