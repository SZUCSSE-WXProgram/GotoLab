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
    let cntFile = 0, cntPic = 0;
    const fileList = await db.collection('Files').where({
        createTime: _.lte(current),
        type: 'exports',
    }).get().then(res => {
        return res.data
    })
    for (let i = 0; i < fileList.length; i++) {
        cntFile++;
        await cloud.deleteFile({
            fileList: [fileList[i].url],
        })
        await db.collection('Files').doc(fileList[i]._id).remove()
    }
    const picList = await db.collection('Files').where({
        type: 'upload',
    }).get().then(res => {
        return res.data
    })
    const groupList = await db.collection('Group').field({
        picLink: true,
    }).get().then(res => {
        return res.data
    })
    for (let i = 0; i < picList.length; i++) {
        if (groupList.includes(picList[i].url) === false) {
            cntPic++;
            await cloud.deleteFile({
                fileList: [picList[i].url],
            })
            await db.collection('Files').doc(picList[i]._id).remove()
        }
    }
    return {
        code: 'success',
        des: '清理了' + cntFile + '个文件，' + cntPic + '个图片',
        status: 200,
    }
};
