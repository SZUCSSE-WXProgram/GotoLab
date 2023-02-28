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
const xlsx = require('node-xlsx');
const _ = db.command;
const $ = _.aggregate
const batchSize = 50 //每次查询的数量
// 云函数入口函数
exports.main = async (event, context) => {
    const wxContext = cloud.getWXContext()
    let info = {
        activityId: event.info.activityId,
    }
    const checkResult = await validator.check(info, checkList.getAttenderCheck);
    if (checkResult.code !== 'success') {
        return checkResult
    }
    const permissionCheck = await permission.isActivityAdmin(info.activityId)
    if (permissionCheck.code !== 'success') {
        return permissionCheck
    }
    const countResult = await db.collection('UserToActivity').where({
        activityId: info.activityId,
    }).count()
    const total = countResult.total
    const batchTimes = Math.ceil(total / batchSize)
    const tasks = []
    for (let i = 0; i < batchTimes; i++) {
        const promise = db.collection('UserToActivity').aggregate()
            .match({
                activityId: info.activityId
            }).lookup({
                from: 'User',
                let: {
                    uid: '$userId',
                },
                pipeline: $.pipeline()
                    .match(_.expr($.eq(['$_id', '$$uid'])))
                    .limit(1)
                    .done(),
                as: 'user'
            }).replaceRoot({
                newRoot: $.mergeObjects([$.arrayElemAt(['$user', 0]), '$$ROOT'])
            })
            .project({
                class: true,
                email: true,
                name: true,
                phone: true,
                status: true,
                stuid: true,
            }).lookup({
                from: 'Class',
                let: {
                    cid: '$class',
                },
                pipeline: $.pipeline()
                    .match(_.expr($.eq(['$_id', '$$cid'])))
                    .limit(1)
                    .done(),
                as: 'class'
            }).replaceRoot({
                newRoot: $.mergeObjects([$.arrayElemAt(['$class', 0]), '$$ROOT'])
            }).project({
                className: true,
                email: true,
                gradeId: true,
                name: true,
                phone: true,
                status: true,
                stuid: true,
            }).lookup({
                from: 'Grade',
                let: {
                    gid: '$gradeId',
                },
                pipeline: $.pipeline()
                    .match(_.expr($.eq(['$_id', '$$gid'])))
                    .limit(1)
                    .done(),
                as: 'grade'
            }).replaceRoot({
                newRoot: $.mergeObjects([$.arrayElemAt(['$grade', 0]), '$$ROOT'])
            }).project({
                className: true,
                email: true,
                gradeName: true,
                name: true,
                phone: true,
                status: true,
                stuid: true,
            }).skip(i * batchSize).limit(batchSize).end()
        tasks.push(promise)
    }
    let exportsUsers = {}
    try {
        exportsUsers = (await Promise.all(tasks)).reduce((acc, cur) => {
            return {
                data: acc.data.concat(cur.data),
                errMsg: acc.errMsg,
            }
        })
    } catch (e) {
        return {
            code: 'fail',
            des: '导出失败' + e,
            status: 500,
        }
    }
    try {
        const data = exportsUsers.list
        data.sort((a, b) => {
            return a.stuid < b.stuid ? -1 : 1
        })
        for (let i = 0; i < data.length; i++) {
            data[i].status = data[i].status === 0 ? '未确认' : '已确认'
        }
        const keys = {
            stuid: '学号',
            name: '姓名',
            gradeName: '年级',
            className: '班级',
            phone: '手机号',
            email: '邮箱',
            status: '状态',
        }
        const exportData = []
        exportData.push(Object.values(keys))
        for (let i = 0; i < data.length; i++) {
            const row = []
            for (let key of Object.keys(keys)) {
                row.push(data[i][key])
            }
            exportData.push(row)
        }
        let buffer = xlsx.build([{
            name: 'exports',
            data: exportData
        }]);
        const res = await cloud.uploadFile({
            cloudPath: 'exports/' + new Date().getTime() + '.xlsx',
            fileContent: buffer,
        })
        await db.collection('Files').add({
            data: {
                url: res.fileID,
                activityId: info.activityId,
                createTime: new Date(),
                type: 'exports',
            }
        })
        return {
            code: 'success',
            des: '导出成功',
            status: 200,
            data: res.fileID,
        }
    } catch (e) {
        return {
            code: 'fail',
            des: '导出失败' + e,
            status: 500,
        }
    }
}
