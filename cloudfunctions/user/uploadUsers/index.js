const cloud = require('wx-server-sdk');
const xlsx = require('node-xlsx');
const validator = require('../util/validate')
const checkList = require('../check')
const permission = require("../util/permission");
// 云环境初始化
cloud.init({
    env: cloud.DYNAMIC_CURRENT_ENV
})

// 获取db对象用于查询数据库
const db = cloud.database({
    throwOnNotFound: false
})

// 云函数入口函数
exports.main = async (event, context) => {
    const wxContext = cloud.getWXContext()
    console.log('User ID: ' + wxContext.OPENID)
    console.log('Params: ' + JSON.stringify(event))
    const checkResult = await validator.check(event.info, checkList.uploadUserCheck);
    if (checkResult.code !== 'success') {
        return checkResult;
    }
    const permissionCheck = await permission.isSuperAdmin()
    if (permissionCheck.code !== 'success') {
        return permissionCheck;
    }
    const {fileID} = event.info
    let res;
    try {
        res = await cloud.downloadFile({
            fileID: fileID,
        })
    } catch (e) {
        return {
            code: 'fail',
            des: '文件下载失败' + e,
            status: 500,
        }
    }
    console.log('finish download')
    const buffer = res.fileContent
    const reg = /^\d+$/;
    const users = {}
    try {
        xlsx.parse(buffer)[0].data.forEach((item, index) => {
            if (item.length >= 2 && reg.test(item[0]) && item[1].trim().length >= 1) {// 有学号和姓名，且学号为数字，姓名不为空
                if (String(item[0]).length >= 6 && String(item[0]).length <= 10)// 学号长度在6-10之间
                    users[Number(item[0])] = item[1].trim()
            }
        })
    } catch (e) {
        return {
            code: 'fail',
            des: 'Excel解析错误' + e,
            status: 500,
        }
    }
    console.log('finish parsing')
    const tasks = []
    const createList = []
    const updateList = []
    const errorList = []
    const total = Object.keys(users).length
    if(total===0){
      return {
        code:"fail",
        status:402,
        des:"无数据待导入！"
      }
    }
    if(total>300){
      return {
        code:"fail",
        status:402,
        des:"每次最多导入300条数据！"
      }
    }
    for (let [key, value] of Object.entries(users)) {
        const task = db.collection('User').where({
            stuid: key
        }).count().then(res => {
            if (res.total === 0) {
                return db.collection('User').add({
                    data: {
                        stuid: key,
                        name: value,
                        openid:"",
                    }
                }).then(res => {
                    createList.push(key)
                }).catch(err => {
                    errorList.push(key)
                })
            } else {
                return db.collection('User').where({
                    stuid: key
                }).update({
                    data: {
                        name: value
                    }
                }).then(res => {
                    updateList.push(key)
                }).catch(err => {
                    errorList.push(key)
                })
            }
        })
        tasks.push(task)
    }
    console.log('submitting tasks')
    // 提交所有任务
    return await Promise.all(tasks).then(res => {
        return {
            code: 'success',
            des: '上传成功',
            status: 200,
            total:total,
            createNumber: createList.length,
            updateNumber: updateList.length,
            errorNumber: errorList.length,
        }
    }).catch(err => {
        return {
            code: 'fail',
            des: '上传失败' + err,
            status: 500,
        }
    })
}
