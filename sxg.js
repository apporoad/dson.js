
const utils = require('lisa.utils')
/**
 * here is the start
 * 故事开始的地方
 */
exports.prelude = options=>{}

/**
 * is the string in Array a lust, example :   [ 'abc','???' ]
 * 判断数据中的字符串是否是Lust
 */
exports.isLustForString = (str,options,innerLJ) =>{ 
    options.cache = options.cache || []
    if(options && options.stringHandler && !utils.ArrayContains(options.cache,innerLJ.LJ.dotTree) ){
        options.cache.push(innerLJ.LJ.dotTree)
        return true
    }
    return false 
}

/**
 * get lustInfo from String when isLustForString is true
 * 获取lust from String
 */
exports.getLustForString = async (str,options, innerLJ) =>{
    var params = [str].concat(options.params || [])
    return  await Promise.resolve( options.stringHandler.apply(this,params)) 
}

/**
 * is the Object in Arry a lust  ,example : [{ isLust: true, hello: ' world'}]
 * 判断数组中对象是否是Lust
 */
exports.isLustForObject = (obj,options,innerLJ) =>{ 
    options.cache = options.cache || []
    if(options && options.othersHandler && !utils.ArrayContains(options.cache,innerLJ.LJ.dotTree) ){
        options.cache.push(innerLJ.LJ.dotTree)
        return true
    }
    return false 
}

/**
 * get lustInfo from Object when isLustForObject is true
 * 获取lust from Object
 */
exports.getLustForObject =async (obj,options,innerLJ)=>{ 
    var params = [obj].concat(options.params || [])
    return  await Promise.resolve( options.othersHandler.apply(this,params)) 
 } 

/**
 * is the node of json  a lust , example : { '???':{ 'hello': 'world'}}
 * 判断json中的节点是否是lust
 */
exports.isLustForKV = (k,v,options)=>{ return false }

/**
 * get lustInfo from node of json when isLustForKV is true
 * 获取lust 
 */
exports.getLustForKV = (k,v,options,innerLJ) => { return {}}

/**
 * is the node of other  a lust , example :  ()=>{}
 * 判断json中的节点是否是lust
 */
exports.isLustForOthers= (obj,options)=>{ 
    options.cache = options.cache || []
    if(options && options.othersHandler && !utils.ArrayContains(options.cache,innerLJ.LJ.dotTree) ){
        options.cache.push(innerLJ.LJ.dotTree)
        return true
    }
    return false
}

/**
 * get lustInfo from node of json when isLustForOthers is true
 * 获取lust 
 */
exports.getLustForOthers= async (obj,options,innerLJ) => { 
    var params = [obj].concat(options.params || [])
    return  await Promise.resolve( options.othersHandler.apply(this,params)) 
}


/**
 * 满足一个lust节点前触发行为 
 */
exports.beforeSatifyOneLust = (lustInfo,options)=>{}

/**
 * 满足一个lust节点后触发行为
 */
exports.afterSatifyOneLust = (lustInfo,options) =>{}

/**
 * 满足所有lust之后触发行为
 */
exports.afterSatifyAllLust = (lustJson,options) =>{
    return {
        isRemakeLustJson : false
    }
}

/**
 * sexgirl核心逻辑， 为 一个lust填充值
 * core logic @ sex girl, get real value for a lust
 */
exports.getInputOneLustValue = (lustInfo,lastData,options) =>{
    return  lustInfo.value
}

/**
 * getInputOneLustValue后面的方法，校验输入值
 * method after getInputOneLustValue
 */
exports.validateOneLustInfo = (value,lustInfo,lastData,options) =>{
    return {
            isPass:true,   // important result ,  will reRun when false
            isKeepLust: false, // nullable, when true , the lust won't be deleted
            key:  null, // nullable， only you need change your key in json
            value : value  // important result , your real value against lust
        }
}