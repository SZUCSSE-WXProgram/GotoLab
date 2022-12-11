// 数据校验器格式
// exports.checkList = {
// 	keys:{des:'汉字描述',type:'string',required:false,maxLength:10,minLenth:5,range:[0,1],validator:[val1,val2]},
// }
const constructorList = {
    'object': Object,
    'array': Array,
    'date': Date,
    'number': Number,
    'string': String,
    'boolean': Boolean
}
exports.check = async (data, checkList) => {
    for (let item in checkList) {
        // 空值检验
        if (checkList[item].required && (!data.hasOwnProperty(item) || data[item] === null || data[item] === undefined)) {
            return {
                code: 'fail',
                status: 402,
                des: `${checkList[item].des}不可为空`
            }
        }
        // 类型检验
        if (data[item] && checkList[item].type && checkList[item].type != 'enum') {
            if (data[item].constructor !== constructorList[checkList[item].type]) {
                return {
                    code: 'fail',
                    status: 402,
                    des: `${checkList[item].des}数据类型错误`
                }
            }
        }
        //enum 范围校验
        if (data[item] && checkList[item].type && checkList[item].type === 'enum') {
            if ((checkList[item].range || []).indexOf(data[item]) === -1) {
                return {
                    code: 'fail',
                    status: 402,
                    des: `${checkList[item].des}不在枚举类型范围内`
                }
            }
        }
        //长度校验
        if (data[item] && checkList[item].maxLength && data[item].length > checkList[item].maxLength) {
            return {
                code: 'fail',
                status: 402,
                des: `${checkList[item].des}太长了`
            }
        }
        if (data[item] && checkList[item].minLength && data[item].length < checkList[item].minLength) {
            return {
                code: 'fail',
                status: 402,
                des: `${checkList[item].des}太短了`
            }
        }
        if (data[item] && checkList[item].validator && checkList[item].validator.length > 0) {
            for (let v in checkList[item].validator) {
                const checkResult = await checkList[item].validator[v](data[item]);
                if (checkResult.code !== 'success') {
                    return checkResult
                }
            }
        }
    }
    return {
        code: 'success',
        status: 200,
        des: "数据校验通过"
    }
}
