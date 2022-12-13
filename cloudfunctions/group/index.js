const create = require('./create/index');
const getList = require('./getList/index');
const modify = require('./modify/index');
const getGroupAdmins = require('./getGroupAdmins/index')
const addGroupAdmin = require('./addGroupAdmin/index')
const deleteGroupAdmin = require('./deleteGroupAdmin/index')

// 云函数入口函数
exports.main = async (event, context) => {
    switch (event.type) {
        case 'create':
            return await create.main(event, context);
        case 'getActivities':
            return await getList.main(event, context);
        case 'modify':
            return await modify.main(event, context);
        case 'getGroupAdmins':
            return await getGroupAdmins.main(event, context);
        case  'addGroupAdmin':
            return await addGroupAdmin.main(event, context);
        case 'deleteGroupAdmin':
            return await deleteGroupAdmin.main(event, context);
        default :
            return {
                code: 'fail',
                status: '404',
                des: 'unrecognized function formate!'
            }
    }
};
