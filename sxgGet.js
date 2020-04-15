const utils = require('lisa.utils')
const uType = utils.Type
const lutils = require('./utils')
const ljson = require('lisa.json')

/**
 * here is the start
 * 故事开始的地方
 */
exports.prelude = options => {}

/**
 * is the string in Array a lust, example :   [ 'abc','???' ]
 * 判断数据中的字符串是否是Lust
 */
exports.isLustForString = async (str, options, innerLJ) => {
    //这里处理字符串处理
    options.cache = options.cache || []
    if (str == '$') {
        return true
    }
    return lutils.hasNeeds(str)
}

/**
 * get lustInfo from String when isLustForString is true
 * 获取lust from String
 */
exports.getLustForString = async (str, options, innerLJ) => {
    if (str == '$') {
        return ljson(options.context._d).get(innerLJ.LJ.dotTree)
    }
    return lutils.fillNeeds(str, options.context)
}

/**
 * is the Object in Arry a lust  ,example : [{ isLust: true, hello: ' world'}]
 * 判断数组中对象是否是Lust
 */
exports.isLustForObject = async (obj, options, innerLJ) => {
    if (options && options.data && uType.isFunction(obj.isDSON) && obj.isDSON()) {
        // var test =   obj.doDraw(options.data)
        return true
    }
    return false
}

/**
 * get lustInfo from Object when isLustForObject is true
 * 获取lust from Object
 */
exports.getLustForObject = async (obj, options, innerLJ) => {
    if (options && options.data && uType.isFunction(obj.isDSON) && obj.isDSON()) {
        return await obj.doDraw(options.data, {
            context: options.context
        })
    }
    return null
}

/**
 * is the node of json  a lust , example : { '???':{ 'hello': 'world'}}
 * 判断json中的节点是否是lust
 */
exports.isLustForKV = async (k, v, options, innerLJ) => {
    if (lutils.hasNeeds(k)) {
        return true
    }
    return v == '$'
}

/**
 * get lustInfo from node of json when isLustForKV is true
 * 获取lust 
 */
exports.getLustForKV = async (k, v, options, innerLJ) => {
    if (lutils.hasNeeds(k)) {
        return {
            key: lutils.fillNeeds(k, options.context) + ''
        }
    }
    if (v == '$') {
        var value0 = ljson(options.context._d).get(innerLJ.LJ.dotTree.replace('???', innerLJ.LJ.key))
        var value1 = value0 
        if(!value1){
            value1 = []
            var array = await Promise.resolve(ljson(options.context._d).find(k))
            array.forEach(a=>{ value1.push(a.value)})
        }
        return {
            key: innerLJ.LJ.key,
            value: value1
        }
    }
}

/**
 * is the node of other  a lust , example :  ()=>{}
 * 判断json中的节点是否是lust
 */
exports.isLustForOthers = async (obj, options, innerLJ) => {
    return false
}

/**
 * get lustInfo from node of json when isLustForOthers is true
 * 获取lust 
 */
exports.getLustForOthers = async (obj, options, innerLJ) => {
    return {}
}


/**
 * 满足一个lust节点前触发行为 
 */
exports.beforeSatifyOneLust = (lustInfo, options) => {}

/**
 * 满足一个lust节点后触发行为
 */
exports.afterSatifyOneLust = (lustInfo, options) => {}

/**
 * 满足所有lust之后触发行为
 */
exports.afterSatifyAllLust = (lustJson, options) => {
    return {
        isRemakeLustJson: false
    }
}

/**
 * sexgirl核心逻辑， 为 一个lust填充值
 * core logic @ sex girl, get real value for a lust
 */
exports.getInputOneLustValue = (lustInfo, lastData, options) => {
    return lustInfo.value
}

/**
 * getInputOneLustValue后面的方法，校验输入值
 * method after getInputOneLustValue
 */
exports.validateOneLustInfo = (value, lustInfo, lastData, options) => {
    if (lustInfo.LJ.isKey) {
        if (value.value) {
            return {
                isPass: true, // important result ,  will reRun when false
                isKeepLust: true, // nullable, when true , the lust won't be deleted
                key: value.key || null, // nullable， only you need change your key in json
                value: value.value || lustInfo.LJ.object[lustInfo.LJ.key] // important result , your real value against lust
            }
        }else{
            return {
                isPass: true, // important result ,  will reRun when false
                isKeepLust: false, // nullable, when true , the lust won't be deleted
                key: value.key || null, // nullable， only you need change your key in json
                value: value.value || lustInfo.LJ.object[lustInfo.LJ.key] // important result , your real value against lust
            }
        }
    } else {
        return {
            isPass: true,
            isKeepLust: false,
            value: value
        }
    }
}