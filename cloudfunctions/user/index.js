const create = require('./create/index');
const get = require('./get/index');
const modify = require('./modify/index');


// 云函数入口函数
exports.main = async (event, context) => {
  switch (event.type) {
    case 'create':
      return await create.main(event, context);
    case 'get':
      return await get.main(event, context);
    case 'modify':
      return await modify.main(event, context);
    default :
    return {
      code :'fail',
      status :'404',
      des:'unrecognized function formate!'
    }
  }
};
