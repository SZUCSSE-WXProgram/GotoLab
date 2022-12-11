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
    const wxContext = cloud.getWXContext()
    const ret = {
        code: 'success',
        des: '添加成功',
        status: 200,
        info: [],
    }
    //用户输入的信息
    infoPre = {}


    return ret

}
