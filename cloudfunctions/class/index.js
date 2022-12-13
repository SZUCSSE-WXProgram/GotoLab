const create = require('./create/index');
const modify = require('./modify/index');
const getList = require('./getList/index');


// 云函数入口函数
exports.main = async (event, context) => {
    switch (event.type) {
        case 'create':
            return await create.main(event, context);
        case 'modify':
            return await modify.main(event, context);
        case 'getActivities':
            return await getList.main(event, context);
        default :
            return {
                code: 'fail',
                status: '404',
                des: '未知的请求类型'
            }
    }
};
