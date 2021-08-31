const utils = require('lisa.utils')
const uType = utils.Type
const ljson = require('lisa.json')
const sxg = require('./sxg')
const sxgGet = require('./sxgGet')
const LJ = require('lustjson.js')
//const G = globalThis || global || window || {}

exports.mark = (context, name) => {
    if (name) {
        context.marks[name] = context.tempData
    }
}

exports.find = async (context, keyOrFilter, value) => {
    /*[ { jrl: 'name', key: 'name', value: 'apporoad' },
     { jrl: 'loves[0].name', key: 'name', value: 'final fanstasy' },
     { jrl: 'loves[1].name', key: 'name', value: 'dq' },
     { jrl: 'loves[2].name', key: 'name', value: 'LiSA' } ] */
    var json = context.currentData
    var values = []
    if (utils.Type.isObject(json)) {
        values = (await ljson(json).find(keyOrFilter, value)) || []
    } else if (utils.Type.isArray(json)) {
        for (var i = 0; i < json.length; i++) {
            var element = json[i]
            var r = await ljson(element).find(keyOrFilter, value) || []
            values = values.concat(r)
        }
    }
    var reals = []
    values.forEach(val => {
        reals.push(val.value)
    })
    context.currentData = context.tempData = reals
}

var innerSet = async (json ,  positions , valueOrDsonOrFunction , context)=>{
    var value = valueOrDsonOrFunction
    // dson 情况
    if(uType.isObject(valueOrDsonOrFunction) && uType.isFunction(valueOrDsonOrFunction.isDSON) && valueOrDsonOrFunction.isDSON()){
        value = await  valueOrDsonOrFunction.doDraw(json , { context : context})
    }
    for(var i =0 ;i < positions.length;i++){
        var p = positions[i]
        //函数情况
         if(uType.isFunction(valueOrDsonOrFunction) || uType.isAsyncFunction(valueOrDsonOrFunction)){
                value = await Promise.resolve(valueOrDsonOrFunction( p ,json , context))
           }
           ljson(json).set(p.jrl , value)
    }
}

exports.set = exports.findAndSet = async (context, keyOrFilter, value,  valueOrDsonOrFunction) => {
    /*[ { jrl: 'name', key: 'name', value: 'apporoad' },
     { jrl: 'loves[0].name', key: 'name', value: 'final fanstasy' },
     { jrl: 'loves[1].name', key: 'name', value: 'dq' },
     { jrl: 'loves[2].name', key: 'name', value: 'LiSA' } ] */
    var json = context.currentData
    var values = []
    if (utils.Type.isObject(json)) {
        values = (await ljson(json).find(keyOrFilter, value)) || []
        if(values.length >0 ){
            var fjson = utils.deepCopy(json)
             await innerSet(fjson , values , valueOrDsonOrFunction,context)
            context.currentData = context.tempData =  fjson
        }
    } else if (utils.Type.isArray(json)) {
        var arr = []
        for (var i = 0; i < json.length; i++) {
            var element = json[i]
            var r = await ljson(element).find(keyOrFilter, value) || []
            if(r.length>0){
                var fjson = utils.deepCopy(element)
                await innerSet(fjson,r, valueOrDsonOrFunction,context)
                arr.push(fjson)
            }else{
                arr.push(element)
            }
        }
        context.currentData = context.tempData = arr
    }
}

exports.root = (context) => {
    context.currentData = context.root
    context.tempData = context.root
}

exports.count = (context) => {
    if (utils.Type.isArray(context.currentData)) {
        context.tempData = context.currentData.length
    } else {
        context.tempData = 0
    }
}
exports.first = (context) => {
    if (utils.Type.isArray(context.currentData)) {
        context.currentData = context.tempData = context.currentData.length > 0 ? context.currentData[0] : null
    }
}
exports.last = (context, num) => {
    if (utils.Type.isArray(context.currentData)) {
        var num = num || 1
        if (num == 1) {
            context.currentData = context.tempData = context.currentData.length > 0 ? context.currentData[context.currentData.length - 1] : null
        } else {
            context.currentData = context.tempData = context.currentData.slice(context.currentData.length - num)
        }
    }
}
exports.random = (context, num) => {
    if (utils.Type.isArray(context.currentData)) {
        num = num || 1
        if (num < context.currentData.length) {
            var arr = []
            utils.randUnique(0, context.currentData.length - 1, num).forEach(ele => {
                arr.push(context.currentData[ele])
            })
            if (num == 1) {
                context.currentData = context.tempData = arr.length > 0 ? arr[0] : null
            } else {
                context.currentData = context.tempData = arr
            }
        }
    }
}
exports.top = (context, num) => {
    if (utils.Type.isArray(context.currentData)) {
        num = num || 1
        if (num == 1) {
            context.currentData = context.tempData = context.currentData.length > 0 ? context.currentData[0] : null
        } else {
            context.currentData = context.tempData = context.currentData.slice(0, (num || 1))
        }

    }
}

exports.distinct = (context, compareFn) => {
    if (utils.Type.isArray(context.currentData)) {
        context.currentData = context.tempData = utils.ArrayDistinct(context.currentData, compareFn)
    }
}

exports.order = exports.sort = (context,compareFn)=>{
    if(utils.Type.isArray(context.currentData)){
        context.currentData = context.tempData = utils.ArraySort(context.currentData,compareFn)
    }
}

var sum = async (arr, selectFn) => {
    var total = 0
    for (var i = 0; i < arr.length; i++) {
        var ele = arr[i]
        if (selectFn) {
            total += await Promise.resolve(selectFn(ele))
        } else if (!isNaN(ele)) {
            total += parseFloat(ele)
        }
    }
    return total
}
exports.sum = async (context, selectFn) => {
    if (utils.Type.isArray(context.currentData)) {
        context.tempData = await sum(context.currentData, selectFn)
    }
}
exports.average = exports.avg = async (context, selectFn) => {
    if (utils.Type.isArray(context.currentData)) {
        context.tempData = context.currentData.length > 0 ? (await sum(context.currentData, selectFn)) / context.currentData.length : 0
    }
}
exports.max = async (context, compareFn) => {
    if (utils.Type.isArray(context.currentData)) {
        context.tempData = context.currentData.length > 0 ? utils.ArraySort(context.currentData, compareFn)[context.currentData.length - 1] : null
    }
}
exports.min = async (context, compareFn) => {
    if (utils.Type.isArray(context.currentData)) {
        context.tempData = context.currentData.length > 0 ? utils.ArraySort(context.currentData, compareFn)[0] : null
    }
}
exports.unique = (context, equilsFn) => {
    if (uType.isArray(context.currentData)) {
        //todo
        var uArr = []
        for (var i = 0; i < context.currentData.length; i++) {
            var ele = context.currentData[i]
            if (utils.ArrayFilter(context.currentData, ele, equilsFn).length == 1) {
                uArr.push(ele)
            }
        }
        context.currentData = context.tempData = uArr
    }
}
exports.preNode = exports.pre = (context, step) => {
    step = step || 1
    if (context.position.length > 0) {
        var index = context.position.length - 1 - step
        index = index >= 0 ? index : 0
        context.currentData = context.tempData = context.position[index]
        context.position.push(context.currentData)
    }
}
exports.goto = exports.travel = exports.chuanyue = (context, mark) => {
    if (mark) {
        if (context.marks[mark]) {
            context.currentData = context.tempData = context.marks[mark]
            context.position.push(context.currentData)
        } else if (context.autoMarks[mark]) {
            context.currentData = context.tempData = context.autoMarks[index]
            context.position.push(context.currentData)
        }
    } else {
        //找到history的上次mark
        var lastMark = null
        for (var i = context.history.length - 1; i >= 0; i--) {
            if (context.history[i].key == 'mark') {
                lastMark = context.history[i].value
                break
            }
        }
        if (lastMark) {
            context.currentData = context.tempData = lastMark
            context.position.push(context.currentData)
        }
    }
}

exports.trim = (context) => {
    if (utils.Type.isString(context.currentData)) {
        context.currentData = context.tempData = context.currentData.trim()
    }
}
exports.trimAll = async (context) => {
    if (uType.isString(context.currentData)) {
        exports.trim(context)
    } else if (uType.isObject(context.currentData) || uType.isArray(context.currentData)) {
        var options = {
            stringHandler: (str) => {
                if (str)
                    return str.trim()
                return str
            }
        }
        context.currentData = context.tempData = await LJ.get(utils.deepCopy(context.currentData), sxg, options)
    }
}
exports.trimStart = (context, stringOrArray) => {
    if (utils.Type.isString(context.currentData)) {
        context.currentData = context.tempData = utils.startTrim(context.currentData, stringOrArray)
    }
}
exports.trimStartAll = async (context, stringOrArray) => {
    if (uType.isString(context.currentData)) {
        exports.trimStart(context, stringOrArray)
    } else if (uType.isObject(context.currentData) || uType.isArray(context.currentData)) {
        var options = {
            stringHandler: (str, stringOrArray) => {
                if (str)
                    return utils.startTrim(str, stringOrArray)
                return str
            },
            params: [stringOrArray]
        }
        context.currentData = context.tempData = await LJ.get(utils.deepCopy(context.currentData), sxg, options)
    }
}
exports.trimEnd = (context, stringOrArray) => {
    if (utils.Type.isString(context.currentData)) {
        context.currentData = context.tempData = utils.endTrim(context.currentData, stringOrArray)
    }
}
exports.trimEndAll = async (context, stringOrArray) => {
    if (uType.isString(context.currentData)) {
        exports.trimEnd(context, stringOrArray)
    } else if (uType.isObject(context.currentData) || uType.isArray(context.currentData)) {
        var options = {
            stringHandler: (str, stringOrArray) => {
                if (str)
                    return utils.endTrim(str, stringOrArray)
                return str
            },
            params: [stringOrArray]
        }
        context.currentData = context.tempData = await LJ.get(utils.deepCopy(context.currentData), sxg, options)
    }
}

exports.toUpperCase = exports.toUpper = async (context) => {
    if (uType.isString(context.currentData)) {
        context.currentData = context.tempData = context.currentData.toUpperCase()
    } else if (uType.isObject(context.currentData) || uType.isArray(context.currentData)) {
        var options = {
            stringHandler: (str) => {
                if (str)
                    return str.toUpperCase()
                return str
            }
        }
        context.currentData = context.tempData = await LJ.get(utils.deepCopy(context.currentData), sxg, options)
    }
}
exports.toLowerCase = exports.toLower = async (context) => {
    if (uType.isString(context.currentData)) {
        context.currentData = context.tempData = context.currentData.toLowerCase()
    } else if (uType.isObject(context.currentData) || uType.isArray(context.currentData)) {
        var options = {
            stringHandler: (str) => {
                if (str)
                    return str.toLowerCase()
                return str
            }
        }
        context.currentData = context.tempData = await LJ.get(utils.deepCopy(context.currentData), sxg, options)
    }
}

exports.replace = (context, regex, replaceValue, equilsFn) => {
    // 字符串替换
    if (utils.Type.isString(context.currentData) && (uType.isRegExp(regex) || uType.isString(regex))) {
        context.currentData = context.tempData = context.currentData.replace(regex, replaceValue)
    } else {
        //其他替换方式
        if (equilsFn && equilsFn(context.currentData, regex)) {
            context.currentData = context.tempData = replaceValue
        }
    }
}
exports.replaceAll = async (context, regex, replaceValue, equilsFn) => {
    if (uType.isArray(context.currentData) || uType.isObject(context.currentData)) {
        var options = {
            stringHandler: (str) => {
                if (uType.isRegExp(regex) || uType.isString(regex))
                    return str.replace(regex, replaceValue)
                if (equilsFn && equilsFn(str, regex)) {
                    return replaceValue
                }
                return str
            },
            othersHandler: (obj) => {
                if (equilsFn && equilsFn(obj, regex)) {
                    return replaceValue
                }
                return obj
            }
        }
        context.currentData = context.tempData = await LJ.get(utils.deepCopy(context.currentData), sxg, options)
    } else {
        exports.replace(context, regex, replaceValue, equilsFn)
    }
}
exports.substr = (context, from, length) => {
    if (uType.isString(context.currentData)) {
        context.currentData = context.tempData = context.currentData.substr(from, length)
    }
}
exports.substring = (context, start, end) => {
    if (uType.isString(context.currentData)) {
        context.currentData = context.tempData = context.currentData.substring(start, end)
    }
}


var getResult = (results) => {
    var result = null
    for (var i = 0; i < results.length; i++) {
        if (results[i] == null || results[i] == undefined) {
            continue
        }
        if (!results[i]) {
            result = false
            break
        } else {
            result = true
        }
    }
    return result
}

//  以下方法为模板操作方法+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
//where 只对数组起效
exports.where = exports.filter = async (context, expressionOrDsonOrJvdOrTemplate) => {
    if (uType.isArray(context.currentData) && expressionOrDsonOrJvdOrTemplate) {
        var rArray = []
        for (var i = 0; i < context.currentData.length; i++) {
            var data = context.currentData[i]
            var results = await expect(data, context, expressionOrDsonOrJvdOrTemplate, null)
            var r = getResult(results)
            if (r == null || r) {
                rArray.push(data)
            }
        }
        context.currentData = context.tempData = rArray
    }
}


var innerGetFromTemplateOrDSON = async (expression, data, context, replacementJson) => {
    if (uType.isString(expression) && data) {
        if (utils.Type.isObject(data) || utils.Type.isArray(data)) {
            return ljson(data).get(expression)
        }
    }
    if (uType.isFunction(expression) || uType.isAsyncFunction(expression)) {
        var result = await Promise.resolve(expression(data, context))
        return result
    }
    if (uType.isObject(expression)) {
        if (uType.isFunction(expression.isDSON) && expression.isDSON()) {
            return await expression.doDraw(data, {
                context: context
            })
        } else {
            //模板情况
            var options = {
                data: data,
                context : context,
                replacement : Object.assign({}, context.defaultReplacementJson || {}, 
                    context.autoMarks || {}, context.marks || {},
                    replacementJson),
                replacementJson : replacementJson
            }
            options.replacement._d = options.replacement._data = options.data
            var result = await LJ.get(expression,sxgGet,options)
            return result
        }
    }
    return null
}
exports.get = exports.fetch = async (context, expression, replacementJson) => {
    if (uType.isArray(expression) && expression.length==0 && uType.isArray(context.currentData)) {
        var rs = []
        for(var i =0 ;i<context.currentData.length;i++){
            rs.push(await innerGetFromTemplateOrDSON(expression[0], context.currentData[i], context, replacementJson))
        }
        context.currentData = context.tempData = rs
    } else {
        var value = await innerGetFromTemplateOrDSON(expression, context.currentData, context, replacementJson)
        if(value)
            context.currentData = context.tempData =value
    }
}

exports.select = exports.draw = exports.extract = exports.get
exports.format = exports.select
exports.render = exports.select

var expect = async (data, context, expressionOrJVDOrTemplate) => {
    var test = []
    var expressionOrJVD = expressionOrJVDOrTemplate
    if (expressionOrJVD) {
        //expression情况
        if (uType.isString(expressionOrJVD)) {
            var JVD = context.JVD
            var result = await JVD(expressionOrJVD).test(data)
            test.push(result)
        } else if (uType.isFunction(expressionOrJVD) || uType.isAsyncFunction(expressionOrJVD)) {
            var result = await Promise.resolve(expressionOrJVD(data, context))
            test.push(result)
        } else if (uType.isObject(expressionOrJVD)) {
            if (uType.isFunction(expressionOrJVD.isJVD) && expressionOrJVD.isJVD()) {
                var result = await expressionOrJVD.test(data, {
                    context: context
                })
                test.push(result)
            } else if (uType.isFunction(expressionOrJVD.isDSON) && expressionOrJVD.isDSON()) {
                test.push(await expressionOrJVD.doTest(data, {
                    context: context
                }))
            } else {
                //模板情况
                var options = {
                    jvd: context.JVD(),
                    JVD: context.JVD,
                    test: [],
                    data: data,
                    context: context
                }
                await LJ.get(expressionOrJVD, sxg, options)
                test = test.concat(options.test)
            }
        }
    }
    return test
}

var innerCalcTest = (testArray)=>{
    if(!testArray) return null
    var result = null
    for(var i =0;i< testArray .length;i++){
        if(testArray[i] == null || testArray[i] == undefined){
            continue
        }
        if(!testArray[i]){
            result = false
            break
        }else{
            result = true
        }
    }
    return result
}

exports.test = exports.expect = async (context, expressionOrDsonOrJvdOrTemplate, failInfo) => {
    var testArray = await expect(context.tempData, context, expressionOrDsonOrJvdOrTemplate)
    if (testArray && testArray.length > 0) {
        testArray.forEach(t => {
            context.test.push(t)
        })
    }
    if(failInfo && testArray && innerCalcTest(testArray) == false){
        if(uType.isString(failInfo)){
            context.testInfo = context.testInfo || []
            console.log(failInfo)
            context.testInfo.push(failInfo)
        }else if (uType.isFunction(failInfo) || uType.isAsyncFunction(failInfo)){
            context.testInfo = context.testInfo || []
            context.testInfo.push(await Promise.resolve(failInfo(context.tempData,context)))
        }
    }
}

exports.print = (context, expression) => {
    console.log(context.tempData)
}


exports.push = (context,name)=>{
    if (uType.isString(name)) {
        if(context.marks[name]){
            if(uType.isArray(context.marks[name])){
                context.marks[name].push(context.tempData)
            }else{
                context.marks[name] = [context.marks[name]]
                context.marks[name].push(context.tempData)
            }
        }else{
            context.marks[name] = [context.tempData]
        }
    }
}
exports.pop = (context, name)=>{
    if(uType.isString(name) && context.marks[name]){
         if(uType.isArray(context.marks[name])){
                context.currentData=context.tempData = context.marks[name].pop()
         }else{
                context.currentData = context.tempData =context.mark[name]
         }
    }
}

exports.unshift = (context,name)=>{
    if (uType.isString(name)) {
        if(context.marks[name]){
            if(uType.isArray(context.marks[name])){
                context.marks[name].unshift(context.tempData)
            }else{
                context.marks[name] = [context.marks[name]]
                context.marks[name].unshift(context.tempData)
            }
        }else{
            context.marks[name] = [context.tempData]
        }
    }
}
exports.shift = (context, name)=>{
    if(uType.isString(name) && context.marks[name]){
         if(uType.isArray(context.marks[name])){
                context.currentData=context.tempData = context.marks[name].shift()
         }else{
                context.currentData = context.tempData = context.mark[name]
         }
    }
}

// exports.each = exports.forEach
// exports.sequence

exports.doNothing = exports.debug= async (context,fn)=>{
    if(uType.isFunction(fn) || uType.isAsyncFunction(fn)){
        await Promise.resolve(fn(context.tempData,context))
    }
}




//todo
exports.mirror = exports.clone

// //穿越实现
// exports.X = exports.x = exports.cross = async(context, meta)=>{
//     //context.currentChainNode

//     var dson = null
//     //加载缓存
//     if(G.dsonCache && G.dsonCache.get(meta)){
//         dson = G.dsonCache.get(meta)
//         //如果有缓存，判断缓存是否有效
//         // do it in cache
//     }
//     //加载dsonserver
//     if(G.httpClient){
        
//     }
//     //加载本地global
// }

// //本地全局化
// exports.global = async(context , key)=>{
//     if(G.dsonCache){
//         G.dsonCache.set(key,context.this)
//     }
// }
//globalThis