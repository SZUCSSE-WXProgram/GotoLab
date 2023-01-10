const create = require('./create/index');
const getList = require('./getList/index');
const modify = require('./modify/index');
const getGroupAdmins = require('./getGroupAdmins/index')
const addGroupAdmin = require('./addGroupAdmin/index')
const deleteGroupAdmin = require('./deleteGroupAdmin/index')
const getFullList = require('./getFullList/index')
const getGroupByID = require('./getGroupByID/index')

// 云函数入口函数
exports.main = async (event, context) => {
    switch (event.type) {
        case 'create':
            return await create.main(event, context);
        case 'getList':
            return await getList.main(event, context);
        case 'modify':
            return await modify.main(event, context);
        case 'getGroupAdmins':
            return await getGroupAdmins.main(event, context);
        case 'addGroupAdmin':
            return await addGroupAdmin.main(event, context);
        case 'deleteGroupAdmin':
            return await deleteGroupAdmin.main(event, context);
        case 'getFullList':
            return await getFullList.main(event, context);
        case 'getGroupByID':
            return await getGroupByID.main(event, context);
        default :
            return {
                code: 'fail',
                status: '404',
                des: '未知的请求类型'
            }
    }
};
