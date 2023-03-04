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
    const excelList = await db.collection('Files').where({
        createTime: _.lte(current),
        type: 'exports',
    }).limit(10)
        .get().then(res => {
            return res.data
        })

    //获取url数组
    const excelUrls = excelList.map(item => {
        return item.url
    })
    const excelIDs = excelList.map(item => {
        return item._id
    })

    const groupPicLists = await db.collection('Group').field({
        picLink: true,
    }).get().then(res => {
        return res.data.map(item => {
            return item.picLink
        })
    })

    const allPicLinks = await db.collection('Files').where({
        type: 'upload',
    }).get().then(res => {
        return res.data
    })

    const invalidPics = []
    allPicLinks.forEach(item => {
        if (!groupPicLists.includes(item.url)) {
            invalidPics.push(item)
        }
    })
    const picUrls = invalidPics.map(item => {
        return item.url
    })
    const picIDs = invalidPics.map(item => {
        return item._id
    })

    if ((picUrls.length + excelUrls.length) === 0) {
        return {
            code: 'success',
            des: '无需清理',
            status: 200,
        }
    }

    const tasks = []
    tasks.push(cloud.deleteFile({
        fileList: excelUrls.concat(picUrls),
    }))
    tasks.push(db.collection('Files').where({
        _id: _.in(excelIDs.concat(picIDs)),
    }).remove())
    return await Promise.all(tasks).then(res => {
        return {
            code: 'success',
            des: '清理成功',
            excelList: excelList,
            picList: invalidPics,
            info: res,
            status: 200,
        }
    }).catch(e => {
        return {
            code: 'fail',
            des: e,
            status: 500,
        }
    })
};
