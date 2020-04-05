const utils = require('lisa.utils')
const uType = utils.Type
const ljson = require('lisa.json')


exports.get = (context, expression) => {
    if (expression && context.currentData) {
        if (utils.Type.isObject(context.currentData) || utils.Type.isArray(context.currentData)) {
            context.currentData = context.tempData
                = ljson(context.currentData).get(expression)
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
    }
    else {
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
            context.currentData= context.tempData = context.currentData.length > 0 ? context.currentData[0] : null
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
exports.average  =exports.avg = async (context, selectFn) => {
    if (utils.Type.isArray(context.currentData)) {
        context.tempData = context.currentData.length > 0 ? (await sum(context.currentData, selectFn)) / context.currentData.length : 0
    }
}
exports.max = async (context, compareFn) => {
    if (utils.Type.isArray(context.currentData)) {
        context.tempData = context.currentData.length > 0 ? utils.ArraySort(context.currentData, compareFn)[context.currentData.length -1] : null
    }
}
exports.min = async (context, compareFn) => {
    if (utils.Type.isArray(context.currentData)) {
        context.tempData = context.currentData.length > 0 ? utils.ArraySort(context.currentData, compareFn)[0] : null
    }
}
exports.unique = (context, equilsFn) => {
    //todo
}
exports.pre =()=>{}
exports.next =()=>{}
exports.move = ()=>{}
exports.trim = (context) => {
    if (utils.Type.isString(context.currentData)) {
        context.currentData = context.tempData = context.currentData.trim()
    }
}
exports.trimAll = (context) => {
    //todo
}
exports.trimStart = (context, stringOrArray) => {
    if (utils.Type.isString(context.currentData)) {
        context.currentData = context.tempData = utils.startTrim(context.currentData, stringOrArray)
    }
}
exports.trimStartAll = (context, stringOrArray) => {
    //todo
}
exports.trimEnd = (context, stringOrArray) => {
    if (utils.Type.isString(context.currentData)) {
        context.currentData = context.tempData = utils.endTrim(context.currentData, stringOrArray)
    }
}
exports.trimEndAll = (context, stringOrArray) => {
    //todo
}
exports.toUpperCase = exports.toUpper = (context) => {
    if (utils.Type.isString(context.currentData)) {
        context.currentData = context.tempData = context.currentData.toUpperCase()
    }
}
exports.toUpperCaseAll = exports.toUpperAll = (context) => {
    //todo
}
exports.toLowerCase = exports.toLower = (context) => {
    if (utils.Type.isString(context.currentData)) {
        context.currentData = context.tempData = context.currentData.toLowerCase()
    }
}
exports.toLowerCaseAll = exports.toLowerAll = (context) => { }

exports.replace = (context, regex, replaceValue, equilsFn) => {
    if (utils.Type.isString(context.currentData) && (uType.isRegExp(regex) || uType.isString(regex))) {
        context.currentData = context.tempData = context.currentData.replace(regex, replaceValue)
    }
    //todo
}
exports.replaceAll = () => {
    //todo
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
