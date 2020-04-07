const utils = require('lisa.utils')
const uType = utils.Type
const ljson = require('lisa.json')
const sxg = require('./sxg')
const LJ = require('lustjson.js')


exports.get = (context, expression) => {
    if (expression && context.currentData) {
        if (utils.Type.isObject(context.currentData) || utils.Type.isArray(context.currentData)) {
            context.currentData = context.tempData = ljson(context.currentData).get(expression)
        }
    }
}

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
exports.where = exports.filter = (context, jvdOrTemplate) => {
    //todo
}
exports.distinct = (context, compareFn) => {
    if (utils.Type.isArray(context.currentData)) {
        context.currentData = context.tempData = utils.ArrayDistinct(context.currentData, compareFn)
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
exports.goto = (context , mark) => {
    if(mark){
        if(context.marks[mark]){
            context.currentData = context.tempData = context.marks[mark]
            context.position.push(context.currentData)
        }else if( context.autoMarks[mark]){
            context.currentData = context.tempData = context.autoMarks[index]
            context.position.push(context.currentData)
        }
    }else{
        //找到history的上次mark
        var lastMark = null
        for(var i= context.history.length- 1 ;i>=0;i--){
            if(context.history[i].key == 'mark'){
                lastMark = context.history[i].value
                break
            }
        }
        if(lastMark){
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
exports.toUpperCase = exports.toUpper = (context) => {
    if (utils.Type.isString(context.currentData)) {
        context.currentData = context.tempData = context.currentData.toUpperCase()
    }
}
exports.toUpperCaseAll = exports.toUpperAll = async (context) => {
    if (uType.isString(context.currentData)) {
        exports.toUpper(context)
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
exports.toLowerCase = exports.toLower = (context) => {
    if (utils.Type.isString(context.currentData)) {
        context.currentData = context.tempData = context.currentData.toLowerCase()
    }
}
exports.toLowerCaseAll = exports.toLowerAll = async (context) => {
    if (uType.isString(context.currentData)) {
        exports.toLowerCase(context)
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
exports.format = () => {
    //todo 

    // format json
}
exports.order
exports.select