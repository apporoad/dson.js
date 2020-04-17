declare class JVD{
    test(itemName : string, implement : Function)
}

declare class DSON{
    /**
     * reg new method for this DSON object
     * 给该dson注册新方法
     * @param itemName 方法名
     * @param implement 实现，同步函数或者异步函数
     */
    reg(itemName : string, implement : Function) 

    /**
     * just as reg
     * @param itemName 
     * @param implement 
     */
    add(itemName : string, implement : Function)

    /**
     * 是否是DSON实例，返回true
     */
    isDSON() : Boolean

    /**
     * 数据抽取，返回DSON链最后的值
     * @param data 数据  json or Array
     * @param options 
     */
    doDraw (data :Object, options?: Object) : Promise

    /**
     * just as doDraw
     */
    doSelect(data :Object, options?: Object) : Promise

    /**
     * 执行dson ，返回所有DSON过程对象
     * @param data json or Array
     * @param options 
     */
    do(data : Object,options? : Object) : Promise

    /**
     * just as do
     * @param data 
     * @param options 
     */
    run(data : Object,options? : Object) : Promise

    /**
     * just as do
     * @param data 
     * @param options 
     */
    go(data : Object,options? : Object) : Promise

    /**
     * 执行测试， 返回true or false
     * @param data  json or Array
     * @param options 
     */
    doTest (data:Object, options?: Object) : Promise

    /**
     * 标记当前数据到 Marks列表
     * @param name mark name
     */
    mark(name : string) :DSON

    /**
     * 在当前位置处查询需要的值，参数参考 ljson.find
     * @param keyOrFilter 
     * @param value 
     */
    find(keyOrFilter, value?) : DSON

    /**
     * 回到根路径
     */
    root() : DSON

    /**
     * 统计当前数组的行数，当前位置不变化
     */
    count() : DSON

    /**
     * 位置跳转到当前数组的第一个元素
     */
    first() : DSON

    /**
     * 位置跳转到当前数组的最后一个元素
     */
    last() : DSON

    /**
     * 位置跳转到当前数组的随机多个元素
     * @param num  默认为1
     */
    random(num ?: Number) :DSON

    /**
     * 位置跳转到当前数组的前几个元素
     * @param num 默认为1
     */
    top(num ?: Number) : DSON

    /**
     * 位置跳转到去除重复值后的数组
     * @param compareFn 
     */
    distinct (compareFn ?: Function) : DSON 

    /**
     * 计算当前数组的加和，当前位置不变化
     * @param selectFn 取值函数，要求返回数值类型
     */
    sum ( selectFn ? : Function) : DSON

    /**
     * 计算当前数组的平均值，当前位置不变化
     * @param selectFn 取值函数，要求返回数值类型
     */
    average ( selectFn ?: Function) :DSON

    /**
     * 获取数组最大值，当前位置不变化
     * @param compareFn 比较函数 
     */
    max (compareFn ? : Function) :DSON
    
    /**
     * 获取数组最小值，当前位置不变化
     * @param compareFn 比较函数 
     */
    min (compareFn ?: Function) : DSON

    /**
     * 位置跳转到无重复元素组成的数组
     * @param equilsFn 比较函数
     */
    unique ( equilsFn ?: Function) : DSON

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

exports.order

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

var expect = async (data, context, expressionOrJVDOrTemplate, info) => {
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

exports.test = exports.expect = async (context, expressionOrDsonOrJvdOrTemplate, info) => {
    var testArray = await expect(context.tempData, context, expressionOrDsonOrJvdOrTemplate, info)
    if (testArray && testArray.length > 0) {
        testArray.forEach(t => {
            context.test.push(t)
        })
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

}

declare function JVD(experssion:string): JVD
declare function DSON(experssion) : DSON

export = {
    DSON : DSON,
    JVD : JVD
}
