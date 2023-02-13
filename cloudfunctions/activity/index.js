const create = require('./create/index');
const modify = require('./modify/index');
const attendActivity = require('./attendActivity/index');
const checkAttender = require('./checkAttender/index');
const deleteAttender = require('./deleteAttender/index');
const getActivities = require('./getActivities/index');
const getAttender = require('./getAttender/index');
const getActivityByID = require('./getActivityByID/index');
const history = require('./history/index');
const deleteActivity = require('./deleteActivity/index');
// 云函数入口函数
exports.main = async (event, context) => {
    switch (event.type) {
        case 'create':
            return await create.main(event, context);
        case 'modify':
            return await modify.main(event, context);
        case 'attendActivity':
            return await attendActivity.main(event, context);
        case 'checkAttender':
            return await checkAttender.main(event, context);
        case 'deleteAttender':
            return await deleteAttender.main(event, context);
        case 'getActivities':
            return await getActivities.main(event, context);
        case 'getAttender':
            return await getAttender.main(event, context);
        case 'getActivityByID':
            return await getActivityByID.main(event, context);
        case 'history':
            return await history.main(event, context);
        case 'deleteActivity':
            return await deleteActivity.main(event, context);
        default :
            return {
                code: 'fail',
                status: '404',
                des: '未知的请求类型'
            }
    }
};
