const cloud = require('wx-server-sdk')

// 云环境初始化
cloud.init({
    env: cloud.DYNAMIC_CURRENT_ENV
})

// 获取db对象用于查询数据库
const db = cloud.database({
    throwOnNotFound: true
})

// 云函数入口函数
exports.main = async (event, context) => {
    const wxContext = cloud.getWXContext()
    return await db.collection('User').aggregate()
        .match({
            openid: wxContext.OPENID
        })
        .lookup({
            from: 'Class',
            localField: 'class',
            foreignField: '_id',
            as: 'class',
        }).lookup({
            from: 'Grade',
            localField: 'class.gradeId',
            foreignField: '_id',
            as: 'grade',
        })
        .end().then(res => {
            delete res.list[0].class[0].gradeId
            res.list[0].class = res.list[0].class[0]
            res.list[0].grade = res.list[0].grade[0]
            res.list = res.list[0]
            return {
                code: 'success',
                info: res.list,
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