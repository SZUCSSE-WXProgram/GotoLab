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
    // 本api主要做注册时和管理员查看时的班级信息查询 不鉴权也不传入参数
    return await db.collection('Grade').aggregate()
        .lookup({
                from: 'Class',
                localField: '_id',
                foreignField: 'gradeId',
                as: 'class',
            }
        ).end().then(res => {
            for (const i in res.list) {
                for (const j in res.list[i].class) {
                    delete res.list[i].class[j].gradeId;
                }
            }
            return {
                code: 'success',
                des: '查询成功',
                status: 200,
                info: res.list,
            }

        }).catch(e => {
            return {
                code: 'fail',
                des: e,
                status: 500,
            }
        })
}
