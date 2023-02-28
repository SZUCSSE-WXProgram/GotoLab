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
    }).get().then(res => {
        return res.data
    })
    for (let i = 0; i < fileList.length; i++) {
        console.log(fileList[i].createTime - new Date().getTime())
        await cloud.deleteFile({
            fileList: [fileList[i].url],
        })
        await db.collection('Files').doc(fileList[i]._id).remove()
    }
    return {
        code: 'success',
        des: '清理成功',
        files: fileList,
        status: 200,
    }

};
