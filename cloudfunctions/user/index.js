const create = require('./create/index');
const getMyself = require('./getMyself/index');
const modify = require('./modify/index');
const manageUser = require('./manageUser/index')
const getUsers = require('./getUsers/index')


// 云函数入口函数
exports.main = async (event, context) => {
    switch (event.type) {
        case 'create':
            return await create.main(event, context);
        case 'getMyself':
            return await getMyself.main(event, context);
        case 'modify':
            return await modify.main(event, context);
        case 'manageUser':
            return await manageUser.main(event, context);
        case 'getUsers':
            return await getUsers.main(event, context);
        default :
            return {
                code: 'fail',
                status: '404',
                des: '未知的请求类型'
            }
    }
};
