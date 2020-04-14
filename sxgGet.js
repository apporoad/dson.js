
const utils = require('lisa.utils')
const uType = utils.Type
const lutils = require('./utils')
const ljson = require('lisa.json')

var check = async (jvd, dotTree,template, checkData,context)=>{
    var test = []
    if(lutils.isArrayUnique(dotTree,template)){
        var newDotTree = dotTree.replace(/\[0+\]/g,'[]')
        var checkNodes = ljson(checkData).get(newDotTree)
        for(var i =0;i< checkNodes.length;i++){
            test.push(await jvd.test(checkNodes[i],{ context: context }))
        }
    }else{
        var checkNode = ljson(checkData).get(dotTree)
        test.push(await jvd.test(checkNode,{ context: context }))   
    }
    return test
}

var checkDson = async(dson ,dotTree,template,checkData,context) =>{
    var test = []
    if(lutils.isArrayUnique(dotTree,template)){
        var newDotTree = dotTree.replace(/\[0+\]/g,'[]')
        var checkNodes = ljson(checkData).get(newDotTree)
        for(var i =0;i< checkNodes.length;i++){
            test.push(await dson.doTest(checkNodes[i], {context : context }))
        }
    }else{
        var checkNode = ljson(checkData).get(dotTree)
        test.push(await dson.doTest(checkNode,{context : context}))   
    }
    return test
}

var checkFunction = async(fn ,dotTree,template,checkData,context) =>{
    var test = []
    if(lutils.isArrayUnique(dotTree,template)){
        var newDotTree = dotTree.replace(/\[0+\]/g,'[]')
        var checkNodes = ljson(checkData).get(newDotTree)
        for(var i =0;i< checkNodes.length;i++){
            test.push(await Promise.resolve(fn(checkNodes[i],context)))
        }
    }else{
        var checkNode = ljson(checkData).get(dotTree)
        test.push(await Promise.resolve(fn(checkNode,context)))   
    }
    return test
}

/**
 * here is the start
 * 故事开始的地方
 */
exports.prelude = options => { }

/**
 * is the string in Array a lust, example :   [ 'abc','???' ]
 * 判断数据中的字符串是否是Lust
 */
exports.isLustForString = async (str, options, innerLJ) => {
    //这里处理字符串处理
    options.cache = options.cache || []
    if (options && options.stringHandler && !utils.ArrayContains(options.cache, innerLJ.LJ.dotTree)) {
        options.cache.push(innerLJ.LJ.dotTree)
        return true
    }
    //for test handler 测试模板情况
    if (str && options && options.jvd
        && options.JVD
        && options.data
        && options.test
        && !utils.ArrayContains(options.cache, innerLJ.LJ.dotTree)) {
        options.cache.push(innerLJ.LJ.dotTree)
        //判断是否是jvd string
        var jvd = options.JVD(str)
        if (jvd.transInfo.fail == 0 && jvd.transInfo.success > 0) {
            //todo use root
            var test = await check(jvd,innerLJ.LJ.dotTree,innerLJ.LJ.root, options.data)
            test.forEach(t=>{
                options.test.push(t)
            })
        }
        //todo 转化错误提示
    }
    return false
}

/**
 * get lustInfo from String when isLustForString is true
 * 获取lust from String
 */
exports.getLustForString = async (str, options, innerLJ) => {
    var params = [str].concat(options.params || [])
    return await Promise.resolve(options.stringHandler.apply(this, params))
}

/**
 * is the Object in Arry a lust  ,example : [{ isLust: true, hello: ' world'}]
 * 判断数组中对象是否是Lust
 */
exports.isLustForObject =  async (obj, options, innerLJ) => {
    options.cache = options.cache || []
    if (options && options.othersHandler && !utils.ArrayContains(options.cache, innerLJ.LJ.dotTree)) {
        options.cache.push(innerLJ.LJ.dotTree)
        return true
    }
    //for test handler 测试模板情况
    if (obj && options && options.jvd
        && options.JVD
        && options.data
        && options.test
        && options.context
        && !utils.ArrayContains(options.cache, innerLJ.LJ.dotTree)) {
        options.cache.push(innerLJ.LJ.dotTree)
        //判断是否是jvd 
        if (uType.isFunction(obj.isJVD) && obj.isJVD()) {
            var test = await check(obj,innerLJ.LJ.dotTree,innerLJ.LJ.root, options.data,options.context)
            test.forEach(t=>{
                options.test.push(t)
            })
            return true
        }else if(uType.isFunction(obj.isDSON) && obj.isDSON()){
            var test = await checkDson(obj,innerLJ.LJ.dotTree,innerLJ.LJ.root,options.data,options.context)
            test.forEach(t=>{
                options.test.push(t)
            })
            return true
        }
        //todo 转化错误提示
    }
    return false
}

/**
 * get lustInfo from Object when isLustForObject is true
 * 获取lust from Object
 */
exports.getLustForObject = async (obj, options, innerLJ) => {
    if (options && options.othersHandler) {
        var params = [obj].concat(options.params || [])
        return await Promise.resolve(options.othersHandler.apply(this, params))
    }
    if (obj && options && options.jvd
        && options.JVD
        && options.data
        && options.test){
            //返回空对象
            return {}
    }

    return null
}

/**
 * is the node of json  a lust , example : { '???':{ 'hello': 'world'}}
 * 判断json中的节点是否是lust
 */
exports.isLustForKV = (k, v, options) => { return false }

/**
 * get lustInfo from node of json when isLustForKV is true
 * 获取lust 
 */
exports.getLustForKV = (k, v, options, innerLJ) => { return {} }

/**
 * is the node of other  a lust , example :  ()=>{}
 * 判断json中的节点是否是lust
 */
exports.isLustForOthers =  async (obj, options, innerLJ) => {
    options.cache = options.cache || []
    if (options && options.othersHandler && !utils.ArrayContains(options.cache, innerLJ.LJ.dotTree)) {
        options.cache.push(innerLJ.LJ.dotTree)
        return true
    }
    if (obj && options && options.jvd
        && options.JVD
        && options.data
        && options.test
        && options.context
        && !utils.ArrayContains(options.cache, innerLJ.LJ.dotTree)){
            if(uType.isFunction(obj) || uType.isAsyncFunction(obj)){
                var test = await checkFunction(obj,innerLJ.LJ.dotTree,innerLJ.LJ.root,options.data,options.context)
                test.forEach(t=>{
                    options.test.push(t)
                })
            }
            //todo 提示
        }
    return false
}

/**
 * get lustInfo from node of json when isLustForOthers is true
 * 获取lust 
 */
exports.getLustForOthers = async (obj, options, innerLJ) => {
    var params = [obj].concat(options.params || [])
    return await Promise.resolve(options.othersHandler.apply(this, params))
}


/**
 * 满足一个lust节点前触发行为 
 */
exports.beforeSatifyOneLust = (lustInfo, options) => { }

/**
 * 满足一个lust节点后触发行为
 */
exports.afterSatifyOneLust = (lustInfo, options) => { }

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
    return {
        isPass: true,   // important result ,  will reRun when false
        isKeepLust: false, // nullable, when true , the lust won't be deleted
        key: null, // nullable， only you need change your key in json
        value: value  // important result , your real value against lust
    }
}