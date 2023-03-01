const cloud = require('wx-server-sdk')
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
    let current = new Date(new Date().getTime() - 24 * 60 * 60 * 1000)
    // 获取创建超过一天的文件
    const fileList = await db.collection('Files').where({
        createTime: _.lte(current),
        type: 'exports',
    }).limit(10)
        .get().then(res => {
            return res.data
        })
    if (fileList.length === 0) {
        return {
            code: 'success',
            des: '无需清理',
            files: fileList,
            status: 200,
        }
    }

    //获取url数组
    const urls = fileList.map(item => {
        return item.url
    })
    const _ids = fileList.map(item => {
        return item._id
    })
    const tasks = []
    tasks.push(cloud.deleteFile({
        fileList: urls,
    }))
    tasks.push(db.collection('Files').where({
        _id: _.in(_ids),
    }).remove())
    try {
        await Promise.all(tasks)
        return {
            code: 'success',
            des: '清理成功',
            files: fileList,
            status: 200,
        }
    } catch (e) {
        return {
            code: 'fail',
            des: e,
            status: 500,
        }
    }
};
