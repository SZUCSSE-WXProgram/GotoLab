const cloud = require('wx-server-sdk')
const permission = require('../util/permission.js')

// 云环境初始化
cloud.init({
    env: cloud.DYNAMIC_CURRENT_ENV
})

// 获取db对象用于查询数据库
const db = cloud.database({
    throwOnNotFound: true
})
const _ = db.command
const $ = _.aggregate


// 云函数入口函数
exports.main = async (event, context) => {
    const wxContext = cloud.getWXContext()
    console.log('User ID: ' + wxContext.OPENID)
    console.log('Params: ' + JSON.stringify(event))
    const permissionValidate = await permission.isNotStudent();
    if (permissionValidate.code !== "success") {
        return permissionValidate;
    }
    const pageOffset = {
        limit: event.info.limit ? Math.min(event.info.limit, 20) : 10,
        offset: event.info.offset ? event.info.offset : 0,
    }
    const pageQuery = {
        search: event.info.search ? event.info.search : "",
        permission: event.info.permission,
    }
    if (pageQuery.permission === undefined || pageQuery.permission === null || pageQuery.permission === "") {
        return await db.collection('User').aggregate()
            .match(_.or([{
                name: db.RegExp({
                    regexp: '.*' + pageQuery.search,
                    options: 'i',
                })
            }, {
                stuid: db.RegExp({
                    regexp: '.*' + pageQuery.search,
                    options: 'i',
                })
            }]).and({
                openid: _.neq("")
            }))
            .lookup({
                from: 'Class',
                localField: 'class',
                foreignField: '_id',
                as: 'class',
            }).lookup({
                from: 'Grade',
                localField: 'class.gradeId',
                foreignField: '_id',
                as: 'grade'
            }).sort({
                stuid: 1,
            })
            .skip(pageOffset.offset)
            .limit(pageOffset.limit + 1)// tricky做法 多取一条数据判断数据是不是取完了
            .end().then(res => {
                const hasMore = res.list.length > pageOffset.limit
                if (hasMore) {
                    res.list.pop()
                }
                for (let i in res.list) {
                    res.list[i].class = res.list[i].class[0]
                    delete res.list[i].class.gradeId
                    res.list[i].grade = res.list[i].grade[0]
                }
                return {
                    code: 'success',
                    data: res.list,
                    hasMore: hasMore,
                    status: 200
                }
            }).catch(e => {
                return {
                    code: 'fail',
                    status: 500,
                    des: e
                }
            })
    } else {
        return await db.collection('User').aggregate()
            .match(_.or([{
                name: db.RegExp({
                    regexp: '.*' + pageQuery.search,
                    options: 'i',
                })
            }, {
                stuid: db.RegExp({
                    regexp: '.*' + pageQuery.search,
                    options: 'i',
                })
            }]).and([{
                permission: pageQuery.permission
            }, {
                openid: _.neq("")
            }]))
            .lookup({
                from: 'Class',
                localField: 'class',
                foreignField: '_id',
                as: 'class',
            }).lookup({
                from: 'Grade',
                localField: 'class.gradeId',
                foreignField: '_id',
                as: 'grade'
            }).sort({
                stuid: 1,
            })
            .skip(pageOffset.offset)
            .limit(pageOffset.limit + 1)// tricky做法 多取一条数据判断数据是不是取完了
            .end().then(res => {
                const hasMore = res.list.length > pageOffset.limit
                if (hasMore) {
                    res.list.pop()
                }
                for (let i in res.list) {
                    res.list[i].class = res.list[i].class[0]
                    delete res.list[i].class.gradeId
                    res.list[i].grade = res.list[i].grade[0]
                }
                return {
                    code: 'success',
                    data: res.list,
                    hasMore: hasMore,
                    status: 200
                }
            }).catch(e => {
                return {
                    code: 'fail',
                    status: 500,
                    des: e
                }
            })
    }


}
