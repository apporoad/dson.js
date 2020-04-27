require=(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
const utils = require('lisa.utils')
const uType = utils.Type

function DSON() {
    var _this = this
    this._implements = {}
    this._queue = []
    this.reg = (itemName, implement) => {
        if (itemName && (utils.Type.isFunction(implement) || utils.Type.isAsyncFunction(implement))) {
            switch (itemName) {
                case 'do':
                case 'doTest':
                case 'reg':
                case 'add':
                case 'run':
                case 'go':
                case 'doDraw':
                    console.log('DSON key string cannot be reged : ' + itemName)
                    return
                default:
                    this[itemName] = (...args) => {
                        _this._queue.push({
                            item: itemName,
                            params: args,
                            type: 'dson'
                        })
                        return _this
                    }
                    _this._implements[itemName] = implement
                    break;
            }
        }
    }
    this.add = this.reg

    this.isDSON=()=>{return true}

    /**
     * 执行抽取操作，返回context中的最后的值
     */
    this.doDraw = this.doSelect = async (data,options) =>{
        var context = await _this.do(data,options)
        return context.tempData
    }

    /**
     *  执行dson
     */
    this.do = this.run = this.go = async (data,options) => {
        var context = {
            root: data,
            currentData: data, //当前位置对应的数据
            tempData: data, //当前记录的数据
            marks: {},
            autoMarks: {},
            history: [],
            position: [],
            test : [],
            JVD : _this.JVD
        }
        //串上下文情况 ,只有mark autoMarks history进行传递
        if(options && uType.isObject(options.context)){
            context.marks = options.context.marks || {}
            context.autoMarks = options.context.autoMarks || {}
            context.history = options.context.history || []
            //test 不传递
            //context.test = options.context.test || []
            context.JVD = options.context.JVD
        }
        //传递
        if(options)
            context.defaultReplacementJson = options.replacementJson
        //selector
        if(_this.selector && _this._implements['select']){
            await Promise.resolve(_this._implements['select'].apply(_this, [context,_this.selector]))
            context.root = context.currentData
        }
        for (var index = 0; index < _this._queue.length; index++) {
            var current = _this._queue[index]
            var pureParams = current.params.length>0 ? current.params : ([]) //this.defaultParams  
            var params = [context].concat(pureParams)
            await Promise.resolve(_this._implements[current.item].apply(_this, params))
            if (current.item != 'mark') {
                //auto mark
                context.autoMarks[current.item] = context.tempData
                // postion 也通用不记录mark情况
                if (context.position.length == 0 || (context.position.length > 0 && context.position[context.position.length - 1] != context.currentData)) {
                    context.position.push(context.currentData)
                }
            }
            //history mark也有历史
            context.history.push({
                key: current.item,
                params : params,
                value: context.tempData
            })
        }

        return context
    }
    this.doTest = async (data, options) => {
        var c = await _this.do(data,options)
        var result = null
        for(var i =0;i<c.test.length;i++){
            if(c.test[i] == null || c.test[i] == undefined){
                continue
            }
            if(!c.test[i]){
                result = false
                break
            }else{
                result = true
            }
        }
        return result
    }
    return this
}

module.exports = DSON
},{"lisa.utils":9}],2:[function(require,module,exports){
const utils = require('lisa.utils')
const uType = utils.Type
const ljson = require('lisa.json')
const sxg = require('./sxg')
const sxgGet = require('./sxgGet')
const LJ = require('lustjson.js')

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
            var r = await ljson(element).find(keyOrFilter, values) || []
            values = values.concat(r)
        }
    }
    var reals = []
    values.forEach(val => {
        reals.push(val.value)
    })
    context.currentData = context.tempData = reals
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

exports.debug= async (context,fn)=>{
    if(uType.isFunction(fn) || uType.isAsyncFunction(fn)){
        await Promise.resolve(fn(context.tempData,context))
    }
}
},{"./sxg":12,"./sxgGet":13,"lisa.json":7,"lisa.utils":9,"lustjson.js":10}],3:[function(require,module,exports){
const utils = require('lisa.utils')
const uType = utils.Type

function isNumber(val){
    var regPos = /^\d+(\.\d+)?$/; //非负浮点数
    var regNeg = /^(-(([0-9]+\.[0-9]*[1-9][0-9]*)|([0-9]*[1-9][0-9]*\.[0-9]+)|([0-9]*[1-9][0-9]*)))$/; //负浮点数
    if(regPos.test(val) || regNeg.test(val)){
        return true;
    }else{
        return false;
    }
}

function isInteger(val){
    var regPos = /^\d+(\.)?$/; //非负浮点数
    var regNeg = /^(-(([0-9]+\.)|([0-9]*[1-9][0-9]*\.)|([0-9]*[1-9][0-9]*)))$/; //负浮点数
    if(regPos.test(val) || regNeg.test(val)){
        return true;
    }else{
        return false;
    }
}

exports.isString = (data,options)=>{
    if(data == null || data == undefined)
        return null
    return utils.Type.isString(data)
}

exports.isNumber = (data,options)=>{
    if(data==null || data == undefined)
        return null
    return isNumber(data)
}

exports.isInteger =(data,options)=>{
    if(data == null || data== undefined)
        return null
    return isInteger(data)
}

exports.isFunction = (data)=>{
    if(data == null || data == undefined)
        return null
    return utils.Type.isFunction(data) || utils.Type.isAsyncFunction(data)
}
exports.isSyncFunction = (data)=>{
    if(data == null || data == undefined)
        return null
    return utils.Type.isFunction(data) 
}
exports.isAsyncFunction = (data)=>{
    if(data == null || data == undefined)
        return null
    return utils.Type.isAsyncFunction(data)
}
exports.isJSON = (data)=>{
    if(data == null || data == undefined)
        return null
    return utils.Type.isObject(data)
}
exports.isArray = (data)=>{
    if(data == null || data == undefined)
        return null
    return utils.Type.isArray(data)
}
exports.isRegExp = (data)=>{
    if(data == null || data == undefined)
        return null
    return utils.Type.isRegExp(data)
}
exports.required = (data)=>{
    if(data == null || data == undefined)
        return false
    return true
}
exports.anything = exports.required

exports.pattern = exports.match  = (data,options, regExp)=>{
    if(data ==null || data == undefined){
        return null
    }
    if(regExp && utils.Type.isRegExp(regExp)){
        return regExp.test(data)
    }
    throw Error('not right regExp' + regExp)
}

var innerGt= (one,value)=>{
    var v1 = one
    var v2 = value
    if(uType.isString(v1) && uType.isString(v2)){
        return v1 > v2
    }
    if(uType.isArray(v1) || uType.isString(v1)){
        v1 = v1.length
    }
    if(uType.isArray(v2) || uType.isString(v2)){
        v2 = v2.length
    }
    return v1 > v2
}
var innerEquils= (one,value)=>{
    var v1 = one
    var v2 = value
    if((uType.isArray(v1) || uType.isString(v1)) && uType.isNumber(v2)){
        return v1.length == v2
    }
    if((uType.isArray(v2) || uType.isArray(v2)) && uType.isNumber(v1)){
        return v2.length == v1
    }
    return v1 == v2
}

exports.gt = exports.greaterThan = (data ,options, value,comparedFn)=>{
     if(data ==null || data == undefined){
        return null
    }
    if(value){
        if(comparedFn){
            return comparedFn(data,value)
        }
        return innerGt(data,value) 
    }
    return false
}
exports.lt = exports.litterThan =(data,options,value,comparedFn)=>{
     if(data ==null || data == undefined){
        return null
    }
    if(value){
        if(comparedFn){
            return !comparedFn(data,value)
        }
        return innerGt(value,data)
    }
    return false
}

exports.between = exports.range = (data,options,low,high,comparedFn)=>{
     if(data ==null || data == undefined){
        return null
    }
    if(low && high){
        if(comparedFn){
            return comparedFn(data,low) && comparedFn(high,data)
        }
        return  !innerGt(low,data)  &&  !innerGt(data,high)
    }
    return false
}

exports.oneOf = exports.in = (data , options, array,comparedFn)=>{
      if(data ==null || data == undefined){
        return null
    }
    if(array && utils.Type.isArray(array)){
        if(comparedFn){
            utils.ArrayContains(array,data,comparedFn)
        }
        return utils.ArrayContains(array,data)
    }
    return false
}

exports.equils = exports.toBe = exports.is =(data,options,value,compareFn)=>{
      if(data ==null || data == undefined){
        return null
    }
    if(value){
        if(compareFn)
            return compareFn(data,value)
        return innerEquils(data,value)
    }
    return false
}

exports.$ =  (data , options,value) =>{
    if(data == null || data ==undefined){
        return null
    }
    if(value ==null || value==undefined){
        return true
    }
    return value ? true : false
}
},{"lisa.utils":9}],4:[function(require,module,exports){

const di = require('./defautImpl')
const traslator = require('./simpleTranslator')
const JVD = require('./jvd')

module.exports = (expression) => {
    var j =new JVD()
    for (key in di) {
        j.reg(key, di[key])
    }
    j.transInfo = traslator.translate(j,expression) 
    return j
}
},{"./defautImpl":3,"./jvd":5,"./simpleTranslator":6}],5:[function(require,module,exports){
const utils = require('lisa.utils')
function JVD() {
    var _this = this
    this._implements = {}
    this._queue = []
    this.reg = (itemName, implement) => {
        if (itemName && (utils.Type.isFunction(implement) || utils.Type.isAsyncFunction(implement))) {
            switch (itemName) {
                case 'test':
                case 'reg':
                case 'add':
                case 'run':
                case 'go':
                case 'or':
                case 'not':
                    console.log('JVD key string cannot be reged : ' + itemName)
                    return
                default:
                    this[itemName] = (...args) => {
                        _this._queue.push({
                            item: itemName,
                            params: args,
                            type: 'validator'
                        })
                        return _this
                    }
                    _this._implements[itemName] = implement
                    break;
            }
        }
    }
    this.add = this.reg

    this.test = this.run = this.go = async (data,options) => {
        var trueOrFalse = true
        for (var i = 0; i < _this._queue.length; i++) {
            var pre = i == 0 ? null : _this._queue[i - 1]
            var current = _this._queue[i]
            var next = i + 1 >= _this._queue.length ? null : _this._queue[i + 1]
            if (current.type == 'validator') {
                var params = [data,options].concat(current.params)
                var result = await Promise.resolve(_this._implements[current.item].apply(_this, params))
                if (result == null) {
                    continue
                } else if (result) {
                    if (pre && pre.type == 'operation' && pre.item == 'not') {
                        trueOrFalse = false
                        if (next && next.type == 'operation' && next.item == 'or') {
                            continue
                        } else {
                            break
                        }
                    } else {
                        trueOrFalse = true
                        if (next && next.type == 'operation' && next.item == 'or') {
                            break
                        }
                        else {
                            continue
                        }
                    }
                } else {
                    if (pre && pre.type == 'operation' && pre.item == 'not') {
                        trueOrFalse = true
                        if (next && next.type == 'operation' && next.item == 'or') {
                            break
                        }
                        else {
                            continue
                        }
                    } else {
                        trueOrFalse = false
                        if (next && next.type == 'operation' && next.item == 'or') {
                            continue
                        } else {
                            break
                        }
                    }
                }
            } else {
                continue
            }
        }
        return trueOrFalse
    }

    this.isJVD = ()=>{return true}
    
    this.not = () => {
        _this._queue.push({
            item: 'not',
            type: 'operation'
        })
        return _this
    }
    this.or = () => {
        _this._queue.push({
            item: 'or',
            type: 'operation'
        })
        return _this
    }

    return this
}

module.exports = JVD
},{"lisa.utils":9}],6:[function(require,module,exports){
const utils = require('lisa.utils')
const uType = utils.Type
// and => &   &&
// or => |   ||
// not  => !
//isString  =>  ?''  ?string
//isNumber =>  ?d  ?number
//isInteger =>  ?int
//isFunction => ?function   ?fn  ?fun  ?method
//isSyncFunction => ?sync
//isAsyncFunction => ?async
//isJSON => ?json  ?j   ?{} ?object
//isArray => ?[] ?array
// isRegExp => ?// ?regexp
// required = anything  => !!  
// pattern = match  =>  ?/ab/
// gt =  greaterThan =>  ?>12 >12
// lt =  litterThan =>  ?<12  <12
// between = range => ?(1,200.2)
// oneOf = in = ?[1,'a','ccc']
// equils = toBe = is =>  ?=1    ?='cc'   ='dd'

var tryParse = str=>{
    if(!str) return { value : str, success: true}
    try{
        var value = JSON.parse(str.replace(/'/g,'"'))
        return { value : value, success: true}
    }catch(e){
        return { error : e, success: false}
    }
}

var tran = (jvd,expression) =>{
    if(!expression) return true
    if( expression == '!!'){
        jvd.required()
        return true
    }
    if(utils.startWith(expression,'!')){
        jvd.not()
        expression = '?' + expression.substring(1)
    }else if(utils.startWith(expression,'<') 
    || utils.startWith(expression,'>')
    || utils.startWith(expression,'=')
    ){
        expression = '?' + expression
    }
    //处理 ?<=  ?>=
    if(utils.startWith(expression,'?>=')){
        jvd.not()
        expression = expression.replace('?>=','?<')
    }else if(utils.startWith(expression,'?<=')){
        jvd.not()
        expression = expression.replace('?<=','?>')
    }
    switch(expression.toLowerCase()){
        case '?\'\'':
        case '?string':
            jvd.isString()
            break
        case '?d':
        case '?number':
            jvd.isNumber()
            break
        case '?int':
            jvd.isInteger()
            break
        case '?function':
        case '?fn':
        case '?fun':
        case '?method':
            jvd.isFunction()
            break
        case '?sync':
            jvd.isSyncFunction()
            break
        case '?async':
            jvd.isAsyncFunction()
            break
        case '?json':
        case '?j':
        case '?{}':
        case '?object':
            jvd.isJSON()
            break
        case '?[]':
        case '?array':
            jvd.isArray()
            break
        case '?//':
        case '?regexp':
            jvd.isRegExp()
            break
        default:
            if(utils.startWith(expression,'?/') && utils.endWith(expression,'/') && expression.length>3){
                // pattern = match  =>   ?/ab/
                jvd.match(new RegExp(expression.substring(2,expression.length-1)))
            }else if(utils.startWith(expression,'?>') && expression.length>2){
                var n = expression.substring(2)
                if(isNaN(n))
                    return false
                jvd.gt(parseFloat(n))
            }else if(utils.startWith(expression,'?<') && expression.length>2){
                var n = expression.substring(2)
                if(isNaN(n))
                    return false
                jvd.lt(parseFloat(n))
            }else if(utils.startWith(expression,'?(') && utils.endWith(expression,')') && expression.length>3){
                // between = range => !(1,200.2)
                var sArr = expression.substring(2,expression.length-1).split(',')
                var first = sArr[0]
                var second = sArr.length>1 ? sArr[1] : null
                if(first && second){
                    first = tryParse(first)
                    second = tryParse(second)
                    if(first.success && second.success){
                        jvd.between(first.value,second.value)
                    }
                    else
                        return false
                }else{
                    return false
                }
            }else if(utils.startWith(expression,'?[') && utils.endWith(expression,']')&& expression.length>3){
                // oneOf = in = ![1,'a','ccc'] JSON.parse("[1,'a','ccc']".replace(/'/g,'"'))
                var value = tryParse(expression.substring(1))
                if(value.success){
                    jvd.oneOf(value.value)
                }else
                    return false
            }else if(utils.startWith(expression,'?=')){
                var value = tryParse(expression.substring(2))
                if(value.success){
                    jvd.is(value.value)
                }else
                    return false
            }else {
                //其他情况认为转换失败
                return false
            }
            break
    }
    return true
}



exports.translate =(jvd,expression) =>{
    if(!expression) return
    var successCount = 0
    var failCount = 0
    var actions = utils.ArrayRemove(expression.replace(/&&/g,'&').split('&'),'')
    if(actions && actions.length>0){
        for(var i =0 ;i<actions.length ;i ++){
            var action = actions[i]
            var subActions = utils.ArrayRemove(action.replace(/\|\|/g,'|').split('|'),'')
            if(subActions && subActions.length>0){
                for(var j =0 ;j<subActions.length;j++){
                    var sa = subActions[j]
                    if(!tran(jvd,sa)){
                        failCount++
                        //console.log('jvd:simpleTranslator: tran error:' + expression + ' : '+sa)
                    }else{
                        successCount++
                    }
                    if(j<subActions.length-1){
                        jvd.or()
                    }
                }
            }
        }
    }
    return {
        success : successCount,
        fail : failCount
    }
}
},{"lisa.utils":9}],7:[function(require,module,exports){
var utils = require('lisa.utils')
var LJ = require('lustjson.js')
var sxg = require('./sxg')

var getValue =(jsonOrArray,node)=>{
    if(utils.Type.isObject(jsonOrArray)){
        var json = jsonOrArray
        if(json[node]){
            return json[node]
        }
        node = utils.startTrim(utils.endTrim(node,'.'),'.')
        if(json[node]){
            return json[node]
        }

        var ArrayIndex = node.indexOf('[')
        var index =node.indexOf('.')
        if(ArrayIndex == -1 && index ==-1){
            return json[node]
        }
        else if(ArrayIndex == -1 && index > -1 || (index > -1 && ArrayIndex > index)){
            if(json[node.substring(0,index)]){
                return getValue(json[node.substring(0,index)],node.substr(index))
            }else{
                return null
            }
        }
        else if((ArrayIndex > -1 && index==-1) || (ArrayIndex > -1 && ArrayIndex < index)){
            //"[0].asd"  "[0]"
            if(ArrayIndex==0){
                return null
            }else{
                //"zsdf[0]"
                if(json[node.substring(0,ArrayIndex)]){
                    return getValue(json[node.substring(0,ArrayIndex)],node.substr(ArrayIndex))
                }else{
                    return null
                }
            }
        }
    }else{
        // array
        node = utils.startTrim(utils.endTrim(node,'.'),'.')
        var ArrayIndex = node.indexOf('[')
        var ArrayEndIndex= node.indexOf(']')
        var index =node.indexOf('.')
        if((ArrayIndex ==0 && ArrayEndIndex > 0)){
            //"[0].asd"  "[0]"
            var i = node.substring(1, ArrayEndIndex)
            if(!i){
                // []
                if(ArrayEndIndex + 1== node.length){
                    return jsonOrArray
                }
                //[].abc
                var arrayResult = []
                for(var index = 0 ;index< jsonOrArray.length;index++){
                    var subResult = getValue(jsonOrArray[index],node.substr(ArrayEndIndex +1))
                    if(utils.Type.isArray(subResult)){
                        arrayResult = arrayResult.concat(subResult)
                    }else{
                        arrayResult.push(subResult)
                    } 
                }
                return arrayResult
            }else{
                if(isNaN(i)){
                    return null
                }
                if(parseInt(i)<jsonOrArray.length){
                    if(ArrayEndIndex + 1== node.length){
                        return jsonOrArray[parseInt(i)]
                    }else
                    {
                        return getValue(jsonOrArray[parseInt(i)],node.substr(ArrayEndIndex +1) )
                    }
                }
                else{
                    return null
                }
            }
        }
        else{
            return null
        }
    }
}

var setValue =(jsonOrArray,node,value)=>{
    if(utils.Type.isObject(jsonOrArray)){
        var json = jsonOrArray
        if(json[node]){
            json[node] = value
        }
        node = utils.startTrim(utils.endTrim(node,'.'),'.')
        if(json[node]){
            json[node] = value
        }

        var ArrayIndex = node.indexOf('[')
        var index =node.indexOf('.')
        if(ArrayIndex == -1 && index ==-1){
            json[node] = value
        }
        else if(ArrayIndex == -1 && index > -1 || (index > -1 && ArrayIndex > index)){
            if(json[node.substring(0,index)]){
                setValue(json[node.substring(0,index)],node.substr(index),value)
            }
        }
        else if((ArrayIndex > -1 && index==-1) || (ArrayIndex > -1 && ArrayIndex < index)){
            //"[0].asd"  "[0]"
            if(ArrayIndex==0){
            }else{
                //"zsdf[0]"
                if(json[node.substring(0,ArrayIndex)]){
                    setValue(json[node.substring(0,ArrayIndex)],node.substr(ArrayIndex),value)
                }
            }
        }
    }else{
        // array
        node = utils.startTrim(utils.endTrim(node,'.'),'.')
        var ArrayIndex = node.indexOf('[')
        var ArrayEndIndex= node.indexOf(']')
        var index =node.indexOf('.')
        if((ArrayIndex ==0 && ArrayEndIndex > 1)){
            //"[0].asd"  "[0]"
            var i = node.substring(1, ArrayEndIndex)
            if(isNaN(i)){
            }
            if(parseInt(i)<jsonOrArray.length){
                if(ArrayEndIndex + 1== node.length){
                    jsonOrArray[parseInt(i)] =value
                }else
                {
                    setValue(jsonOrArray[parseInt(i)],node.substr(ArrayEndIndex +1),value)
                }
            }
        }
    }
}

var find = async (json,keyOrFilter,value)=>{
    var options= { result : []}
    if(json && utils.Type.isObject(json)){
        var param = {}
        var needSearch = false
        if(keyOrFilter){
            if(utils.Type.isRegExp(keyOrFilter)){
                needSearch = true
                param.key = keyOrFilter
            }else if(utils.Type.isString(keyOrFilter)){
                needSearch = true
                param.key = keyOrFilter
            }else if(utils.Type.isFunction(keyOrFilter) || utils.Type.isAsyncFunction(keyOrFilter)){
                needSearch = true
                param.fn = keyOrFilter
            }
        }
        param.value = value
        if(value || needSearch){
            options.param = param
            await LJ.get(json,sxg,options)
            return  utils.ArrayDistinct(options.result,(a,b)=>{
                return a.jrl == b.jrl
            })
        }
        return null
    }
    return null
}

function LiSAJSON(json){
    var json = json
    var _this = this
    
    this.get = (node)=>{
        if(json){
            if(node){
                return getValue(json,node)
            }
            else{
                return json
            }
        }
        else{
            return null
        }
    }
    this.set = (node,value) => {
        if(json){
            setValue(json,node,value)
        }
        return _this
    }
    this.find = async (keyOrFilter,value) =>{
        return await find(json,keyOrFilter,value)
    }
}


module.exports = json=>{
    return new LiSAJSON(json)
}

},{"./sxg":8,"lisa.utils":9,"lustjson.js":10}],8:[function(require,module,exports){
const utils = require('lisa.utils')

/**
 * here is the start
 * 故事开始的地方
 */
exports.prelude = options => { }

/**
 * is the string in Array a lust, example :   [ 'abc','???' ]
 * 判断数据中的字符串是否是Lust
 */
exports.isLustForString =  async (str, options, LJ) => {
    var param = options.param
    options.result = options.result || []
    if (str && param.value) {
        if (str == param.value) {
            options.result.push({
                jrl: LJ.LJ.dotTree,
                value: str
            })
        } else if (utils.Type.isRegExp(param.value) && param.value.test(str)) {
            options.result.push({
                jrl: LJ.LJ.dotTree,
                value: str
            })
        }
    }
     if (param.fn) {
            if (await Promise.resolve(param.fn(null, str))) {
                options.result.push({
                    jrl: LJ.LJ.dotTree,
                    value: str
                })
            }
        }
    return false
}

/**
 * get lustInfo from String when isLustForString is true
 * 获取lust from String
 */
exports.getLustForString = function (str, options, innerLJ) { return {} }

/**
 * is the Object in Arry a lust  ,example : [{ isLust: true, hello: ' world'}]
 * 判断数组中对象是否是Lust
 */
exports.isLustForObject = async (obj, options, LJ) => {
    var param = options.param
    options.result = options.result || []
    if (obj && param.value) {
        if (obj == param.value) {
            return {
                jrl: LJ.LJ.dotTree,
                value: obj
            }
        }
    }
    if (param.fn) {
        if (await Promise.resolve(param.fn(null, obj))) {
            options.result.push({
                jrl: LJ.LJ.dotTree,
                value: obj
            })
        }
    }
    return false
}

/**
 * get lustInfo from Object when isLustForObject is true
 * 获取lust from Object
 */
exports.getLustForObject = (obj, options, innerLJ) => { return {} }

/**
 * is the node of json  a lust , example : { '???':{ 'hello': 'world'}}
 * 判断json中的节点是否是lust
 */
exports.isLustForKV = async (k, v, options, LJ) => {
    var param = options.param
    options.result = options.result || []
    if (param.key) {
        if (utils.Type.isString(param.key) && param.key == k) {
            options.result.push({
                jrl: LJ.LJ.dotTree.replace('???', k),
                key: k,
                value: v
            })
        } else if (utils.Type.isRegExp(param.key) && param.key.test(k)) {
            options.result.push({
                jrl: LJ.LJ.dotTree.replace('???', k),
                key: k,
                value: v
            })
        }
    }
    if (param.value && v) {
        if (utils.Type.isString(v) && utils.Type.isRegExp(param.value) && param.value.test(v)) {
            options.result.push({
                jrl: LJ.LJ.dotTree.replace('???', k),
                key: k,
                value: v
            })
        } else if (v ==  param.value) {
            options.result.push({
                jrl: LJ.LJ.dotTree.replace('???', k),
                key: k,
                value: v
            })
        }
    }

    if (param.fn) {
        if (await Promise.resolve(param.fn(k, v))) {
            options.result.push({
                jrl: LJ.LJ.dotTree.replace('???', k),
                key: k,
                value: v
            })
        }
    }

    return false
}

/**
 * get lustInfo from node of json when isLustForKV is true
 * 获取lust 
 */
exports.getLustForKV = (k, v, options, innerLJ) => { return {} }

/**
 * is the node of other  a lust , example :  ()=>{}
 * 判断json中的节点是否是lust
 */
exports.isLustForOthers = async (obj, options,LJ) => { 
    var param = options.param
    options.result = options.result || []
    if (obj && param.value) {
        if (obj == param.value) {
            return {
                jrl: LJ.LJ.dotTree,
                value: obj
            }
        }
    }
    if (param.fn) {
        if (await Promise.resolve(param.fn(null, obj))) {
            options.result.push({
                jrl: LJ.LJ.dotTree,
                value: obj
            })
        }
    }
    return false 
}

/**
 * get lustInfo from node of json when isLustForOthers is true
 * 获取lust 
 */
exports.getLustForOthers = (obj, options, innerLJ) => { return {} }


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
    return new Promise((r, j) => {
        r({
            isRemakeLustJson: false
        })
    })
}

/**
 * sexgirl核心逻辑， 为 一个lust填充值
 * core logic @ sex girl, get real value for a lust
 */
exports.getInputOneLustValue = (lustInfo, lastData, options) => {
    return new Promise((r, j) => {
        r({
            hello: 'good good day'
        })
    })
}

/**
 * getInputOneLustValue后面的方法，校验输入值
 * method after getInputOneLustValue
 */
exports.validateOneLustInfo = (value, lustInfo, lastData, options) => {
    return new Promise((r, j) => {
        r({
            isPass: true,   // important result ,  will reRun when false
            isKeepLust: false, // nullable, when true , the lust won't be deleted
            key: 'your new json node name', // nullable， only you need change your key in json
            value: "???"  // important result , your real value against lust
        })
    })
}
},{"lisa.utils":9}],9:[function(require,module,exports){
var Type = (function () {
    var type = {};
    var typeArr = ['String', 'Object', 'Number', 'Array', 'Undefined', 'Function', 'Null', 'Symbol', 'Boolean', 'RegExp', 'AsyncFunction'];
    for (var i = 0; i < typeArr.length; i++) {
        (function (name) {
            type['is' + name] = function (obj) {
                return Object.prototype.toString.call(obj) == '[object ' + name + ']';
            }
        })(typeArr[i]);
    }
    return type;
})();

var endWith = function (str, s) {
    if (s == null || s == "" || str.length == 0 || s.length > str.length)
        return false;
    if (str.substring(str.length - s.length) == s)
        return true;
    else
        return false;
}

exports.endTrim = (str, end) => {
    end = end || ' '
    var result =str
    var array = []
    if (Type.isArray(end)) {
        array = end
    }
    else {
        array.push(end)
    }

    for (var i = 0; i < array.length; i++) {
        var s = array[i]
        if (endWith(str, s) && s) {
            //console.log(str, start)
            result = str.substring(0, str.length - s.length)
        }
    }
    if(result == str){
        return  result
    }
    return exports.endTrim(result,end)
}
var startWith = function (str, s) {
    if (s == null || s == "" || str == null || str == "" || str.length == 0 || s.length > str.length)
        return false;
    if (str.substr(0, s.length) == s)
        return true;
    else
        return false;
}

exports.startTrim = (str, start) => {
    start = start || ' '
    var result = str
    var array = []
    if (Type.isArray(start)) {
        array = start
    }
    else {
        array.push(start)
    }

    for (var i = 0; i < array.length; i++) {
        var s = array[i]
        if (startWith(str, s) && s) {
            //console.log(str, start)
            result = str.substring(s.length)
        }
    }
    if(result == str){
        return result
    }
    return exports.startTrim(result,start)
}

exports.randUnique = (start, end, size) => {
    var allNums = new Array;
    size = size ? (size > end - start ? end - start : size) : 1;
    for (var i = start, k = 0; i <= end; i++, k++) {
        allNums[k] = i;
    }
    allNums.sort(function () { return 0.5 - Math.random(); });
    return allNums.slice(0, size);
}

exports.Type = Type
exports.endWith = endWith
exports.startWith = startWith


exports.indexOfString = (str, searchStr) => {
    if (!str || !searchStr) {
        return -1
    }
    if (searchStr.length > 2 && endWith(searchStr, '/') && startWith(searchStr, '/')) {
        //正则匹配
        var re = new RegExp(searchStr.substring(1, searchStr.length - 1), "mg")
        var arr;
        while ((arr = re.exec(str)) != null)
            return arr.index  //print(arr.index + "-" + arr.lastIndex + "\t" + arr);
        return -1
    }
    else {
        return str.indexOf(searchStr)
    }
}
var indexOfString = exports.indexOfString

exports.indexOf = (str, search) => {
    if (!str || !search) {
        return -1
    }
    if (Type.isString(search)) {
        return indexOfString(str, search)
    }
    else if (Type.isNumber(search)) {
        re = new RegExp(/\n/, "mg")
        var nArr = new Array()
        var temp = null
        while ((temp = re.exec(str)) != null)
            nArr.push(temp.index)
        if (search >= 0) {
            if (search == 0)
                return 0
            if (search - 1 < nArr.length) {
                return nArr[search - 1]
            }
            else {
                //? maybe should know
                return -1
            }
        } else {
            var activeIndex = nArr.length + search
            if (activeIndex > -1) {
                return nArr[activeIndex]
            } else {
                //?  maybe should know
                return -1
            }
        }
    }
    else {
        throw Error('pplugins:util: unsupport search type')
    }
}


exports.ArrayContains = (array, one, compareFn) => {
    return exports.ArrayIndexOf(array, one, compareFn) > -1
}

exports.ArrayEquals = (array1, array2, compareFn) => {
    if (array1.length != array2.length) {
        return false
    }
    array1.sort(compareFn)
    array2.sort(compareFn)
    for (var i = 0; i < array1.length; i++) {
        if (compareFn) {
            if (!compareFn(array1[i], array2[i])) {
                return false
            }
        } else {
            if (array1[i] != array2[i]) {
                return false
            }
        }
    }
    return true
}

exports.ArrayIndexOf = (array, one, compareFn) => {
    for (var i = 0; i < array.length; i++) {
        element = array[i]
        if (compareFn) {
            if (compareFn(one, element)) {
                return i
            }
        }
        else {
            if (one == element) {
                return i
            }
        }
    }
    return -1
}

exports.ArrayFilter = (array, one, compareFn) => {
    var newArr = []
    for (var i = 0; i < array.length; i++) {
        var element = array[i]
        if (compareFn) {
            if (compareFn(one, element)) {
                newArr.push(element)
            }
        } else if (one == element) {
            newArr.push(element)
        }
    }
    return newArr
}


exports.ArraySort = (array, compareFn) => {
    if(compareFn){
        return array.sort((a,b)=>{
            var result = compareFn(a,b)
            if(Type.isNumber(result))
                return result
            else
                return result ? 1 : -1
        })
    }else{
        return array.sort()
    }
}

exports.ArrayDistinct = (array, compareFn) => {
    return array.filter(function (item, index, arr) {
        return exports.ArrayIndexOf(arr, item, compareFn) === index
    });
}

exports.ArrayRemove = (array, arrayOrOneRemoving, compareFn) => {
    var newArr = []
    if (!exports.Type.isArray(arrayOrOneRemoving)) {
        arrayOrOneRemoving = [arrayOrOneRemoving]
    }
    array.forEach(element => {
        if (!exports.ArrayContains(arrayOrOneRemoving, element, compareFn)) {
            newArr.push(element)
        }
    })
    return newArr
}

exports.deepCopy = (obj) => {
    let map = new WeakMap();
    function dp(obj) {
        let result = null;
        let keys = Object.keys(obj);
        let key = null,
            temp = null,
            existobj = null;
        existobj = map.get(obj);
        if (existobj) {
            return existobj;
        }
        result = {}
        map.set(obj, result);
        for (let i = 0, len = keys.length; i < len; i++) {
            key = keys[i];
            temp = obj[key];
            if (temp && typeof temp === 'object') {
                result[key] = dp(temp);
            } else {
                result[key] = temp;
            }
        }
        return result;
    }

    return dp(obj);
}
},{}],10:[function(require,module,exports){
const util = require('./util')

/*
lust.LJ.isArray: 是否是数组对象一员
lust.LJ.object: lustJson
lust.LJ.index:  数组对象中的位置 0 开始，非数据对象没有该属性
lust.LJ.dotTree lustJson所有在的树位置 如： key1.key2[3]
lust.LJ.fJson  父json对象
lust.LJ.fKey  object所在父json的键值
lust.LJ.key   objcet所属的key 值 ，只有 出现在 lust在kv中的v时  及    xxx : "???" 这种情况时  ？？？ 代表lust
lust.LJ.isKey ： lust是否是 kv 中的 k
lust.LJ.root  lustJson根对象
*/

/**
 *  找到所有的lust
 * @param {*} json 
 * @param {*} dotTree 
 * @param {*} fJson 
 * @param {*} fKey 
 * @param {*} sxg 
 * @param {*} options  { findOne : false}  需要找1个时采用findOne： true
 * */
var getLusts = async (json, dotTree, fJson, fKey, sxg, options) => {
    if(!options.root){
        options.root = json
    }
    if (!json) return []
    if (!sxg) return []
    var lustArray = new Array()
    //json must be arry or json
    if (util.Type.isArray(json)) {
        for (var i = 0; i < json.length; i++) {
            var arrayOne = json[i]

            if (util.Type.isString(arrayOne)) {
                var r = {}
                r.LJ = r.LJ || {}
                r.LJ.isKey = false
                r.LJ.isArray = true
                r.LJ.object = json
                r.LJ.index = i
                r.LJ.dotTree = dotTree ? (dotTree + "[" + i + "]") : ('[' + i + ']'),
                r.LJ.fJson = fJson
                r.LJ.fKey = fKey
                r.LJ.key = null
                r.LJ.root = options.root
                if (sxg.isLustForString && sxg.getLustForString && await Promise.resolve(sxg.isLustForString(arrayOne, options,r))) {
                    r.value= await Promise.resolve(sxg.getLustForString(arrayOne, options,r))
                    lustArray.push(r)
                }
            } else if (util.Type.isObject(arrayOne)) {
                var r = {}
                r.value = arrayOne
                r.LJ = r.LJ || {}
                r.LJ.isArray = true
                r.LJ.isKey = false
                r.LJ.object = json
                r.LJ.index = i
                r.LJ.dotTree = dotTree ? (dotTree + "[" + i + "]") : ('[' + i + ']'),
                r.LJ.fJson = fJson
                r.LJ.fKey = fKey
                r.LJ.key = null
                r.LJ.root = options.root
                //if is lust， return lust
                if (sxg.isLustForObject && await Promise.resolve(sxg.isLustForObject(arrayOne, options,r))) {
                    if (sxg.getLustForObject) {
                        r.value = await Promise.resolve(sxg.getLustForObject(arrayOne, options,r)) || arrayOne
                    }
                    lustArray.push(r)
                }
                else {
                    var r = await getLusts(arrayOne, (dotTree ? (dotTree + "[" + i + "]") : ('[' + i + ']')), json, i, sxg, options)
                    if (r != null)
                        lustArray = lustArray.concat(r)
                }
            } else if (util.Type.isArray(arrayOne)) {
                var r = await getLusts(arrayOne, (dotTree ? (dotTree + "[" + i + "]") : ('[' + i + ']')), json, i, sxg, options)
                if (r != null)
                    lustArray = lustArray.concat(r)
            }
            else {
                var r = {}
                r.LJ = r.LJ || {}
                r.LJ.isKey = false
                r.LJ.isArray = true
                r.LJ.object = json
                r.LJ.index = i
                r.LJ.dotTree = dotTree ? (dotTree + "[" + i + "]") : ('[' + i + ']'),
                r.LJ.fJson = fJson
                r.LJ.fKey = fKey
                r.LJ.key = null
                r.LJ.root = options.root
                //others
                if (sxg.isLustForOthers && sxg.getLustForOthers && await Promise.resolve(sxg.isLustForOthers(arrayOne, options,r))) {
                    r .value= await Promise.resolve(sxg.getLustForOthers(arrayOne, options,r))
                    lustArray.push(r)
                }
            }
            //find one
            if (options && options.findOne && lustArray.length > 0) {
                return lustArray
            }
        }
    }
    else if (util.Type.isObject(json)) {
        //util.type.isArray(json)
        for (var key in json) {
            // name: '???(string)[rue]这里填写你的名字'
            var value = json[key]
            // '???': null
            var r ={}
            r.LJ = r.LJ || {}
            r.LJ.root = options.root
            r.LJ.isKey = true
            r.LJ.key = key
            r.LJ.object = json
            r.LJ.dotTree = (dotTree ? (dotTree + ".???") : "???")
            if (sxg.isLustForKV && await Promise.resolve(sxg.isLustForKV(key, value, options,r))) {
                r.value = await Promise.resolve(sxg.getLustForKV(key, value, options,r))
                lustArray.push(r)
            }
            // is String
            else if (util.Type.isString(value)) {
                var r = {}
                r.LJ = r.LJ || {}
                r.LJ.isKey = false
                r.LJ.isArray = false
                r.LJ.object = json
                r.LJ.index = i
                r.LJ.dotTree = dotTree ? (dotTree + "." + key) : key
                r.LJ.fJson = fJson
                r.LJ.fKey = fKey
                r.LJ.key = key
                r.LJ.root = options.root
                if (sxg.isLustForString && sxg.getLustForString && await Promise.resolve(sxg.isLustForString(value, options,r))) {
                    r.value = await Promise.resolve(sxg.getLustForString(value, options,r))
                    lustArray.push(r)
                }
            }
            // is Array
            else if (util.Type.isArray(value)) {
                var r = await getLusts(value, (dotTree ? (dotTree + "." + key) : key), json, key, sxg, options)
                if (r != null)
                    lustArray = lustArray.concat(r)
            }
            else if (util.Type.isObject(value)) {
                //if is lust， return lust
                var r = {}
                r.value= value
                r.LJ = r.LJ || {}
                r.LJ.isArray = false
                r.LJ.isKey = false
                r.LJ.object = json
                r.LJ.index = 0
                r.LJ.dotTree = dotTree ? (dotTree + "." + key) : key
                r.LJ.fJson = fJson
                r.LJ.fKey = fKey
                r.LJ.key = key
                r.LJ.root = options.root
                if (sxg.isLustForObject && await Promise.resolve(sxg.isLustForObject(value, options,r))) {
                    if (sxg.getLustForObject) {
                        r .value= await Promise.resolve(sxg.getLustForObject(value, options,r)) || value
                    }
                    lustArray.push(r)
                }
                else {
                    var r = await getLusts(value, (dotTree ? (dotTree + "." + key) : key), json, key, sxg, options)
                    if (r != null)
                        lustArray = lustArray.concat(r)
                }
            } else {
                //others
                var r = {}
                r.LJ = r.LJ || {}
                r.LJ.isKey = false
                r.LJ.isArray = false
                r.LJ.object = json
                r.LJ.index = i
                r.LJ.dotTree = dotTree ? (dotTree + "." + key) : key
                r.LJ.fJson = fJson
                r.LJ.fKey = fKey
                r.LJ.key = key
                r.LJ.root = options.root
                if (sxg.isLustForOthers && sxg.getLustForOthers && await Promise.resolve(sxg.isLustForOthers(value, options,r))) {

                    r.value = await Promise.resolve(sxg.getLustForOthers(value, options,r))
                    lustArray.push(r)
                }
            }
            if (options && options.findOne && lustArray.length > 0)
                return lustArray
        }
    }
    return lustArray
}

/**
 * 填充lustInfo
 * @param {*} cr 
 */
var fillOneLustInfo = function (cr, lustInfo) {
    if (lustInfo.LJ.isKey) {
        lustInfo.LJ.object[cr.key] = cr.value
    }
    else {
        if (lustInfo.LJ.isArray) {
            lustInfo.LJ.object.splice(lustInfo.LJ.index, 0, cr.value)
        }
        else {
            lustInfo.LJ.object[lustInfo.LJ.key] = cr.value
        }
    }

    if (!cr.isKeepLust) {
        //console.log(lustInfo)
        if (lustInfo.LJ.isArray) {
            //lustInfo.fJson[lustInfo.fkey] = 
            lustInfo.LJ.object.splice(lustInfo.LJ.index + 1, 1)
        }
        else if (lustInfo.LJ.isKey) {
            delete lustInfo.LJ.object[lustInfo.LJ.key]
        }
    }
}

/**
 * satify one lust
 * @param {*} lustInfo 
 */
var satifyOneLust = function (lustInfo, sxg, options) {
    return new Promise(function (r, j) {
        const cycle = function (lastData) {
            if (!sxg.getInputOneLustValue) {
                throw new Error("lustJson: your sxg must implement the exports methods: getInputOneLustValue")
            }
            if (!sxg.validateOneLustInfo) {
                throw new Error("lustJson: your sxg must implement the exports methods: validateOneLustInfo")
            }
            var dataOrPromise = sxg.getInputOneLustValue(lustInfo, lastData, options)
            //inputHandler
            const inputHandler = data => {
                const validateHandler = cr => {
                    //cr like:
                    /* 
                        isPass
                        isKeepLust
                        value
                        key
                    */
                    if (cr.isPass) {
                        fillOneLustInfo(cr, lustInfo)
                        r()
                    }
                    else {
                        //stdin.writeLine(cr.message + "\r\n")
                        cycle(data)
                    }

                    // if(cr.isPass)
                    // {
                    //     if(!cr.isUpdate){
                    //         stdin.writeLine("add success:" + lustInfo.dotTree + " continue to add?\r\nyes/no:(no) ")         
                    //         stdin.readLine().then(data1=>{ 
                    //             if(data1 == "true" || data1 == "yes" || data1 == "y" || data1=="Y"
                    //                 || data1 == "t"){
                    //                 // if continue ,will keep ???
                    //                 r()
                    //             }
                    //             else{
                    //                 //console.log(lustInfo)
                    //                 if(lustInfo.isArray){
                    //                     //lustInfo.fJson[lustInfo.fkey] = 
                    //                     lustInfo.object.splice(lustInfo.index+1,1) 
                    //                 }
                    //                 else if(lustInfo.isKey){
                    //                     delete lustInfo.object[lustInfo.key]
                    //                 }
                    //                 r()
                    //             }
                    //         })

                    //     }
                    //     else
                    //     {
                    //         r()
                    //     }
                    // }
                }
                var vResultOrPromise = sxg.validateOneLustInfo(data, lustInfo, lastData, options)
                if (vResultOrPromise.then) {
                    vResultOrPromise.then(vResult => {
                        validateHandler(vResult)
                    })
                }
                else {
                    validateHandler(vResultOrPromise)
                }

                //var cr =lust.checkAndUpdateValueByLustInfo(data,lustInfo,lastData)

            }
            if (dataOrPromise && dataOrPromise.then) {
                dataOrPromise.then(data => {
                    inputHandler(data)
                })
            }
            else {
                inputHandler(dataOrPromise)
            }
        }
        //start main logic
        cycle()
    })
}


/**
 * 获取lustJson值
 * @param {*} lustJson 欲望json
 * @param {*} sxg 性感女孩 解决器
 * @param {*} options 选择项
 */
var get = function (lustJson, sxg, options) {
    if (sxg.prelude) {
        sxg.prelude(options)
    }
    //deep copy json
    var iJson = Object.assign({}, lustJson)
    return new Promise(function (r, j) {

        //serial
        var cylceAllLustSerial = async (options) => {
            var firstLustInfo = await getLusts(iJson, null, null, null, sxg, options)
            if (firstLustInfo.length > 0) {
                firstLustInfo = firstLustInfo[0]
                if (sxg.beforeSatifyOneLust) {
                    var pOrNot = sxg.beforeSatifyOneLust(firstLustInfo, options)
                    //判断是否是promise
                    if (pOrNot && pOrNot.then) {
                        pOrNot.then(data => {
                            satifyOneLust(firstLustInfo, sxg, options).then(() => {
                                if (sxg.afterSatifyOneLust) {
                                    sxg.afterSatifyOneLust(firstLustInfo, options)
                                }
                                cylceAllLustSerial(options)
                            }, j)
                        }, j)
                    }
                    else {
                        satifyOneLust(firstLustInfo, sxg, options).then(() => {
                            if (sxg.afterSatifyOneLust) {
                                sxg.afterSatifyOneLust(firstLustInfo, options)
                            }
                            cylceAllLustSerial(options)
                        })
                    }
                }
                else {
                    satifyOneLust(firstLustInfo, sxg, options).then(() => {
                        if (sxg.afterSatifyOneLust) {
                            sxg.afterSatifyOneLust(firstLustInfo, options)
                        }
                        cylceAllLustSerial(options)
                    }, j)
                }

            }
            else {
                if (sxg.afterSatifyAllLust) {
                    var pOrNot = sxg.afterSatifyAllLust(iJson, options)
                    //这边是是否重新make的逻辑，可扩展其他方式
                    if (pOrNot) {
                        if (pOrNot.then) {
                            pOrNot.then(result => {
                                if (result.isRemakeLustJson) {
                                    iJson = Object.assign({}, lustJson)
                                    cylceAllLustSerial(options)
                                }
                                else {
                                    r(iJson)
                                }
                            }, j)
                        }
                        else {
                            if (pOrNot.isRemakeLustJson) {
                                iJson = Object.assign({}, lustJson)
                                cylceAllLustSerial(options)
                            }
                            else {
                                r(iJson)
                            }
                        }
                    }
                    else
                        r(iJson)
                }
                else {
                    r(iJson)
                }
            }
            return
        }
        //parallel
        var cylceAllLustParallel = async (options) => {
            var lustInfos = await getLusts(iJson, null, null, null, sxg, options)
            if (lustInfos.length > 0) {
                util.promiseAllArray(lustInfos, ele => {
                    return new Promise((rr, jj) => {
                        if (sxg.beforeSatifyOneLust) {
                            var pOrNot = sxg.beforeSatifyOneLust(ele, options)
                            //判断是否是promise
                            if (pOrNot && pOrNot.then) {
                                pOrNot.then(data => {
                                    satifyOneLust(ele, sxg, options).then(() => {
                                        if (sxg.afterSatifyOneLust) {
                                            sxg.afterSatifyOneLust(ele, options)
                                        }
                                        rr()
                                    }, jj)
                                }, jj)
                            } else {
                                satifyOneLust(ele, sxg, options).then(() => {
                                    if (sxg.afterSatifyOneLust) {
                                        sxg.afterSatifyOneLust(ele, options)
                                    }
                                    rr()
                                }, jj)
                            }
                        } else {
                            satifyOneLust(ele, sxg, options).then(() => {
                                if (sxg.afterSatifyOneLust) {
                                    sxg.afterSatifyOneLust(ele, options)
                                }
                                rr()
                            }, jj)
                        }
                    })
                }, () => {
                    cylceAllLustParallel(options)
                }, j)
            }
            else {
                //here no lust now , redo logic
                if (sxg.afterSatifyAllLust) {
                    var pOrNot = sxg.afterSatifyAllLust(iJson, options)
                    //这边是是否重新make的逻辑，可扩展其他方式
                    if (pOrNot) {
                        if (pOrNot.then) {
                            pOrNot.then(result => {
                                if (result.isRemakeLustJson) {
                                    iJson = Object.assign({}, lustJson)
                                    cylceAllLustParallel(options)
                                }
                                else {
                                    r(iJson)
                                }
                            }, j)
                        }
                        else {
                            if (pOrNot.isRemakeLustJson) {
                                iJson = Object.assign({}, lustJson)
                                cylceAllLustParallel(options)
                            }
                            else {
                                r(iJson)
                            }
                        }
                    }
                    else
                        r(iJson)
                }
                else {
                    r(iJson)
                }
            }
            return
        }

        //是否串行 is Serial 默认并行
        if (options.serial) {
            options = Object.assign({}, options)
            options.findOne = true
            cylceAllLustSerial(options)
        }
        else {
            //并行lust
            options = Object.assign({}, options)
            options.findOne = false
            cylceAllLustParallel(options)
        }
    });
}


// exports.checkSxg = (sxg,isCheckAll) =>{
//     if(!sxg.prelude && isCheckAll){
//         throw new Error("sxg should implement prelude")
//     }
//     if(!sxg.prelude && isCheckAll){
//         throw new Error("sxg should implement prelude")
//     }
// }

exports.get = get //function(lustJson,resolver,resolverConf){console.log("get")}


},{"./util":11}],11:[function(require,module,exports){
var Type = (function() {
    var type = {};
    var typeArr = ['String', 'Object', 'Number', 'Array','Undefined', 'Function', 'Null', 'Symbol','Boolean','RegExp'];
    for (var i = 0; i < typeArr.length; i++) {
        (function(name) {
            type['is' + name] = function(obj) {
                return Object.prototype.toString.call(obj) == '[object ' + name + ']';
            }
        })(typeArr[i]);
    }
    return type;
})();

var endWith=function(str,s){
    if(s==null||s==""||str.length==0||s.length>str.length)
       return false;
    if(str.substring(str.length-s.length)==s)
       return true;
    else
       return false;
   }
var startWith=function(str,s){
    if(s==null||s==""|| str==null || str==""||str.length==0||s.length>str.length)
       return false;
    if(str.substr(0,s.length)==s)
       return true;
    else
       return false;
   }



exports.Type = Type
exports.endWith =endWith
exports.startWith = startWith


exports.promiseAllArray =  (arr,fn,completeFn,onReject)=>{
   if(!Type.isArray(arr)){
       arr = [arr]
   }
   var pArray = new Array()
   arr.forEach(element => {
       pArray.push(fn(element))
   });
   Promise.all(pArray).then(values=>{
       completeFn(values)
   },onReject)
}
},{}],12:[function(require,module,exports){

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
},{"./utils":14,"lisa.json":7,"lisa.utils":9}],13:[function(require,module,exports){
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
        return ljson(options.data).get(innerLJ.LJ.dotTree)
    }
    return lutils.fillNeeds(str, options.replacement)
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
        //todo 传递 replacement
        return await obj.doDraw(options.data, {
            context: options.context,
            replacementJson : options.replacementJson
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
            key: lutils.fillNeeds(k,options.replacement) + ''
        }
    }
    if (v == '$') {
        var value0 = ljson(options.data).get(innerLJ.LJ.dotTree.replace('???', innerLJ.LJ.key))
        var value1 = value0 
        if(!value1){
            value1 = []
            var array = await Promise.resolve(ljson(options.data).find(k))
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
},{"./utils":14,"lisa.json":7,"lisa.utils":9}],14:[function(require,module,exports){
var ljson = require('lisa.json')
var utils = require('lisa.utils')

/**
 * 判断是否是  所在节点 均是在唯一队列中 ，  如果都在唯一数组中，表示需要验证数组中的所有元素
 */
exports.isArrayUnique = (dotTree, data) => {
    // abc.sdf 无  数组情况，返回false
    if (/\[\d*\]/.test(dotTree) == false) {
        return false
    }
    //   'asdf[0]s[10]df' 情况直接排除
    if (/[1-9]\d*/.test(dotTree)) {
        return false
    }
    var newDotTree = dotTree.replace(/\[0+\]/g, '[]')
    var array = ljson(data).get(newDotTree)
    return array ? array.length == 1 : false
}


exports.hasNeeds = (rawString) => {
    if (utils.indexOfString(rawString, '$') > -1) {
        if (/^\$[a-zA-Z0-9_\.\[\]]+$/.test(rawString)) {
            return true
        } else if (/^\$\{[a-zA-Z0-9_\.\[\]]+\}$/.test(rawString)) {
            return true
        } else if (/.*\$\{[a-zA-Z0-9_\.\[\]]+\}.*/.test(rawString)) {
            return true
        }
    }
    return false
}

exports.fillNeeds = (rawString, context) => {
    if (utils.indexOfString(rawString, '$') > -1) {
        if (/^\$[a-zA-Z0-9_\.\[\]]+$/.test(rawString)) {
            return ljson(context).get(rawString.substr(1))
        } else if (/^\$\{[a-zA-Z0-9_\.\[\]]+\}$/.test(rawString)) {
            var path = rawString.substring(2, rawString.length - 1)
            return ljson(context).get(path)
        } else if (/.*\$\{[a-zA-Z0-9_\.\[\]]+\}.*/.test(rawString)) {
            var str = rawString
            var array = rawString.match(/\$\{[a-zA-Z0-9\[\]_\.]+\}/g)
            if (array) {
                array.forEach(ele => {
                    var path = ele.substring(2, ele.length - 1)
                    str = str.replace(ele ,  ljson(context).get(path))
                })
                return str
            }
        }
    }
    return rawString
}
},{"lisa.json":7,"lisa.utils":9}],"dson.js":[function(require,module,exports){
const DSON = require('./dson')
const impls = require('./implements')
const JVD = require('jvd.js')

exports.DSON = (selector) => {
    var d=new DSON()
    for (key in impls) {
        d.reg(key, impls[key])
    }
    d.selector = selector
    //traslator.translate(j,expression) 
    d.JVD = exports.JVD
    return d
}

var $ = async (data,options,expressionOrJVD) =>{
    if(data == null || data ==undefined){
        return null
    }
    if(expressionOrJVD == null || expressionOrJVD == undefined){
        return null
    }
    var r = await exports.DSON().expect(expressionOrJVD).doTest(data,options)
    return r
}

exports.JVD = (expression) =>{
    var j = JVD(expression)
    j.reg('$', $)
    return j
} 
},{"./dson":1,"./implements":2,"jvd.js":4}]},{},[]);
