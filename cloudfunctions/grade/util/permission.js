const cloud = require('wx-server-sdk')

cloud.init({
    env: cloud.DYNAMIC_CURRENT_ENV
})
const db = cloud.database()

// 系统管理员鉴权
exports.isSuperAdmin = async () => {
    const wxContext = cloud.getWXContext();
    return await db.collection('User').where({
        openid: wxContext.OPENID
    }).get().then(res => {
        if (res.data[0].permission === 2) {
            return {
                code: 'success',
                status: 200,
            }
        } else {
            return {
                code: 'fail',
                des: '权限不足',
                status: 403,
            }
        }
    }).catch(e => {
        return {
            code: 'fail',
            des: e,
            status: 500,
        }
    })
}

// Group管理员鉴权
exports.isGroupAdmin = async (groupID) => {
    const _isAdmin = await this.isSuperAdmin();
    if (_isAdmin.code === 'success') {
        return {
            code: 'success',
            status: 200,
        }
    }
    const wxContext = cloud.getWXContext();
    return await db.collection('User').where({
        openid: wxContext.OPENID,
        groups: groupID
    }).get().then(res => {
        if (res.data.length > 0) {
            return {
                code: 'success',
                status: 200,
            }
        } else {
            return {
                code: 'fail',
                des: '权限不足',
                status: 403,
            }
        }
    }).catch(e => {
        return {
            code: 'fail',
            des: e,
            status: 500,
        }
    })
}

// 活动鉴权
exports.isActivityAdmin = async (activityID) => {
    const _isAdmin = await this.isSuperAdmin();
    if (_isAdmin.code === 'success') {
        return {
            code: 'success',
            status: 200,
        }
    }
    const groupID = await db.collection('Activity').where({
        _id: activityID
    }).get().then(res => {
        return res.data[0].group
    })
    return await this.isGroupAdmin(groupID)
}

// 非学生用户鉴权
exports.isNotStudent = async () => {
    const wxContext = cloud.getWXContext();
    return await db.collection('User').where({
        openid: wxContext.OPENID
    }).get().then(res => {
        if (res.data[0].permission === 1 || res.data[0].permission === 2) {
            return {
                code: 'success',
                status: 200,
            }
        } else {
            return {
                code: 'fail',
                des: '权限不足',
                status: 403,
            }
        }
    }).catch(e => {
        return {
            code: 'fail',
            des: e,
            status: 500,
        }
    })
}
